# SportIL DB Package

Prisma and raw SQL migration package.

Current scope:

- Prisma 7 schema and config.
- Initial booking/payment/source/audit models.
- Raw PostgreSQL checks and the exclusive booking overlap constraint.
- Migration scripts for future `prisma migrate deploy`.

The migration still needs to be applied to a live PostgreSQL database and paired with a Prisma-backed booking repository.
