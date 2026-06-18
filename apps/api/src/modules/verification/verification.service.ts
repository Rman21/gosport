import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "@sportil/db";
import type { Prisma, VerificationRequest } from "@prisma/client";
import type { CreateVerificationRequestDto } from "./dto/create-verification-request.dto.js";
import type { UpdateVerificationRequestStatusDto } from "./dto/update-verification-request-status.dto.js";

const requestInclude = {
  facility: {
    select: {
      id: true,
      name: true,
      neighborhood: true,
    },
  },
} satisfies Prisma.VerificationRequestInclude;

type VerificationRequestWithFacility = Prisma.VerificationRequestGetPayload<{
  include: typeof requestInclude;
}>;

const kindLabels = {
  availability_request: {
    en: "Resident asked to check availability",
    he: "תושב ביקש לבדוק זמינות",
    ru: "Житель попросил проверить доступность",
  },
  claim_facility: {
    en: "Operator claim request",
    he: "בקשת ניהול של מפעיל",
    ru: "Заявка на управление объектом",
  },
  report_wrong_info: {
    en: "Resident reported incorrect information",
    he: "תושב דיווח על מידע שגוי",
    ru: "Житель сообщил об ошибке",
  },
  request_online_booking: {
    en: "Resident requested SportIL booking",
    he: "תושב ביקש הזמנה דרך SportIL",
    ru: "Житель запросил бронь через SportIL",
  },
} satisfies Record<CreateVerificationRequestDto["kind"], Record<"en" | "he" | "ru", string>>;

const kindPriority = {
  availability_request: "medium",
  claim_facility: "high",
  report_wrong_info: "high",
  request_online_booking: "high",
} satisfies Record<CreateVerificationRequestDto["kind"], "high" | "medium">;

function compactString(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function requestPublicId(id: string) {
  return `VR-${id.replace(/[^a-z0-9]/gi, "").slice(-8).toUpperCase()}`;
}

@Injectable()
export class VerificationService {
  async createRequest(dto: CreateVerificationRequestDto, userId: string) {
    const residentName = compactString(dto.residentName);
    const contactEmail = compactString(dto.contactEmail);
    const contactPhone = compactString(dto.contactPhone);
    const message = compactString(dto.message);

    if (!residentName && !contactEmail && !contactPhone && !message) {
      throw new BadRequestException({
        code: "verification_request_empty",
        message: "Please add a short note or contact detail.",
      });
    }

    const request = await prisma.$transaction(async (tx) => {
      if (dto.facilityId) {
        const facility = await tx.facility.findUnique({
          select: { id: true },
          where: { id: dto.facilityId },
        });

        if (!facility) {
          throw new NotFoundException({
            code: "facility_not_found",
            message: `Facility ${dto.facilityId} was not found`,
          });
        }
      }

      await tx.userAccount.upsert({
        create: {
          id: userId,
          name: {
            en: residentName ?? "SportIL resident",
            he: residentName ?? "תושב SportIL",
            ru: residentName ?? "Житель SportIL",
          },
          role: "resident",
        },
        update: {
          ...(contactEmail ? { email: contactEmail } : {}),
          ...(residentName
            ? {
                name: {
                  en: residentName,
                  he: residentName,
                  ru: residentName,
                },
              }
            : {}),
        },
        where: { id: userId },
      });

      const existing = await tx.verificationRequest.findUnique({
        include: requestInclude,
        where: { idempotencyKey: dto.idempotencyKey },
      });

      if (existing) {
        return existing;
      }

      const created = await tx.verificationRequest.create({
        data: {
          ...(contactEmail ? { contactEmail } : {}),
          ...(contactPhone ? { contactPhone } : {}),
          ...(dto.facilityId ? { facilityId: dto.facilityId } : {}),
          idempotencyKey: dto.idempotencyKey,
          kind: dto.kind,
          ...(message ? { message } : {}),
          payloadRedacted: {
            hasContactEmail: Boolean(contactEmail),
            hasContactPhone: Boolean(contactPhone),
            source: "sportil_public_form",
          },
          preferredLocale: dto.preferredLocale,
          ...(residentName ? { residentName } : {}),
          status: "submitted",
          userId,
        },
        include: requestInclude,
      });

      if (dto.facilityId) {
        await tx.dataVerificationTask.create({
          data: {
            dueAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            facilityId: dto.facilityId,
            notes: {
              en: "Resident request received. Review the verification_requests queue before updating public data.",
              he: "התקבלה פנייה מתושב. בדקו את תור verification_requests לפני עדכון מידע ציבורי.",
              ru: "Получено обращение жителя. Перед изменением публичных данных проверьте очередь verification_requests.",
            },
            priority: kindPriority[dto.kind],
            sourceUrl: `/admin/verification-requests/${created.id}`,
            status: "open",
            title: kindLabels[dto.kind],
          },
        });
      }

      await tx.auditEvent.create({
        data: {
          action: "verification_request.submitted",
          actorRole: "resident",
          actorUserId: userId,
          idempotencyKey: dto.idempotencyKey,
          metadata: {
            facilityId: dto.facilityId ?? null,
            kind: dto.kind,
          },
          subjectId: created.id,
          subjectType: "verification_request",
        },
      });

      return created;
    });

    return {
      data: this.toResponse(request),
    };
  }

  async listForAdmin(status?: VerificationRequest["status"]) {
    const requests = await prisma.verificationRequest.findMany({
      include: requestInclude,
      orderBy: { createdAt: "desc" },
      take: 80,
      ...(status ? { where: { status } } : {}),
    });

    return {
      data: {
        requests: requests.map((request) => this.toResponse(request, true)),
      },
    };
  }

  async listForUser(userId: string) {
    const requests = await prisma.verificationRequest.findMany({
      include: requestInclude,
      orderBy: { createdAt: "desc" },
      take: 50,
      where: { userId },
    });

    return {
      data: {
        requests: requests.map((request) => this.toResponse(request)),
      },
    };
  }

  async updateStatus(id: string, dto: UpdateVerificationRequestStatusDto, adminUserId: string) {
    const request = await prisma.verificationRequest.update({
      data: {
        payloadRedacted: {
          adminNote: dto.adminNote ?? null,
          statusChangedBy: adminUserId,
        },
        status: dto.status,
      },
      include: requestInclude,
      where: { id },
    });

    await prisma.auditEvent.create({
      data: {
        action: "verification_request.status_changed",
        actorRole: "city_admin",
        actorUserId: adminUserId,
        metadata: {
          status: dto.status,
        },
        subjectId: request.id,
        subjectType: "verification_request",
      },
    });

    return {
      data: this.toResponse(request, true),
    };
  }

  private toResponse(request: VerificationRequestWithFacility, includeContact = false) {
    return {
      contact: includeContact
        ? {
            email: request.contactEmail,
            phone: request.contactPhone,
            residentName: request.residentName,
          }
        : undefined,
      createdAt: request.createdAt.toISOString(),
      facility: request.facility
        ? {
            id: request.facility.id,
            name: request.facility.name,
            neighborhood: request.facility.neighborhood,
          }
        : null,
      id: request.id,
      kind: request.kind,
      message: request.message,
      preferredLocale: request.preferredLocale,
      publicId: requestPublicId(request.id),
      status: request.status,
      updatedAt: request.updatedAt.toISOString(),
    };
  }
}
