import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@sportil/db";
import { Prisma } from "@prisma/client";
import type { UpdateProfileDto } from "./dto/update-profile.dto.js";

const profileSelect = {
  contactPhone: true,
  email: true,
  familyMembers: true,
  favoriteSports: true,
  id: true,
  name: true,
  preferredLocale: true,
  role: true,
} satisfies Prisma.UserAccountSelect;

const savedFacilityInclude = {
  facility: {
    select: {
      address: true,
      bookingMethod: true,
      id: true,
      name: true,
      neighborhood: true,
      sourceType: true,
      verificationStatus: true,
    },
  },
} satisfies Prisma.UserFollowInclude;

function compactString(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function localizedName(value: string | undefined) {
  const fallback = value ?? "SportIL resident";

  return {
    en: fallback,
    he: fallback,
    ru: fallback,
  };
}

function familyMembers(value: string | undefined) {
  const note = compactString(value);

  return note ? { note } : undefined;
}

function familyNote(value: Prisma.JsonValue | null | undefined) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const note = (value as Record<string, unknown>).note;
    return typeof note === "string" ? note : "";
  }

  return "";
}

function mapProfile(user: Prisma.UserAccountGetPayload<{ select: typeof profileSelect }>) {
  const name = user.name && typeof user.name === "object" && !Array.isArray(user.name)
    ? user.name as Record<string, unknown>
    : {};
  const fullName = typeof name.ru === "string"
    ? name.ru
    : typeof name.en === "string"
      ? name.en
      : typeof name.he === "string"
        ? name.he
        : "";

  return {
    contactPhone: user.contactPhone ?? "",
    email: user.email ?? "",
    familyNote: familyNote(user.familyMembers),
    favoriteSports: user.favoriteSports,
    fullName,
    id: user.id,
    preferredLocale: user.preferredLocale,
    role: user.role,
  };
}

@Injectable()
export class AccountService {
  async getProfile(userId: string) {
    const user = await prisma.userAccount.upsert({
      create: {
        id: userId,
        name: localizedName(undefined),
        preferredLocale: "ru",
        role: "resident",
      },
      select: profileSelect,
      update: {},
      where: { id: userId },
    });

    return {
      data: mapProfile(user),
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const fullName = compactString(dto.fullName);
    const contactPhone = compactString(dto.contactPhone);
    const email = compactString(dto.email);
    const family = familyMembers(dto.familyNote);

    let user: Prisma.UserAccountGetPayload<{ select: typeof profileSelect }>;

    try {
      user = await prisma.userAccount.upsert({
        create: {
          ...(contactPhone ? { contactPhone } : {}),
          ...(email ? { email } : {}),
          ...(family ? { familyMembers: family } : {}),
          favoriteSports: dto.favoriteSports ?? [],
          id: userId,
          name: localizedName(fullName),
          preferredLocale: dto.preferredLocale ?? "ru",
          role: "resident",
        },
        select: profileSelect,
        update: {
          contactPhone: contactPhone ?? null,
          email: email ?? null,
          familyMembers: family ?? Prisma.JsonNull,
          favoriteSports: dto.favoriteSports ?? [],
          ...(fullName ? { name: localizedName(fullName) } : {}),
          preferredLocale: dto.preferredLocale ?? "ru",
        },
        where: { id: userId },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ConflictException({
          code: "email_already_used",
          message: "This email is already connected to another SportIL profile.",
        });
      }

      throw error;
    }

    await prisma.auditEvent.create({
      data: {
        action: "profile.updated",
        actorRole: "resident",
        actorUserId: userId,
        metadata: {
          hasContactPhone: Boolean(contactPhone),
          hasEmail: Boolean(email),
          hasFamilyNote: Boolean(family),
        },
        subjectId: userId,
        subjectType: "user_account",
      },
    });

    return {
      data: mapProfile(user),
    };
  }

  async listSaved(userId: string) {
    const follows = await prisma.userFollow.findMany({
      include: savedFacilityInclude,
      orderBy: { createdAt: "desc" },
      take: 80,
      where: {
        facilityId: { not: null },
        userId,
      },
    });

    return {
      data: {
        facilities: follows
          .filter((follow) => follow.facility)
          .map((follow) => ({
            createdAt: follow.createdAt.toISOString(),
            facility: follow.facility,
            followId: follow.id,
          })),
      },
    };
  }

  async saveFacility(userId: string, facilityId: string) {
    const facility = await prisma.facility.findUnique({
      select: { id: true },
      where: { id: facilityId },
    });

    if (!facility) {
      throw new NotFoundException({
        code: "facility_not_found",
        message: `Facility ${facilityId} was not found`,
      });
    }

    try {
      await prisma.userAccount.upsert({
        create: {
          id: userId,
          name: localizedName(undefined),
          preferredLocale: "ru",
          role: "resident",
        },
        update: {},
        where: { id: userId },
      });

      await prisma.userFollow.create({
        data: {
          facilityId,
          userId,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ConflictException({
          code: "facility_already_saved",
          message: "This facility is already saved",
        });
      }

      throw error;
    }

    await prisma.auditEvent.create({
      data: {
        action: "facility.saved",
        actorRole: "resident",
        actorUserId: userId,
        metadata: { facilityId },
        subjectId: facilityId,
        subjectType: "facility",
      },
    });

    return this.listSaved(userId);
  }

  async removeSavedFacility(userId: string, facilityId: string) {
    await prisma.userFollow.deleteMany({
      where: {
        facilityId,
        userId,
      },
    });

    await prisma.auditEvent.create({
      data: {
        action: "facility.unsaved",
        actorRole: "resident",
        actorUserId: userId,
        metadata: { facilityId },
        subjectId: facilityId,
        subjectType: "facility",
      },
    });

    return this.listSaved(userId);
  }
}
