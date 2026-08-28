# How to create a new table in the database

1. Update the `schema.prisma`

2. Run the command to validate the schema:
```bash
npx prisma validate
```

3. Create and apply a migration:
```bash
npx prisma migrate dev --name migration_msg
```

4. Generate/update the Prisma client:
```bash
npx prisma generate 
```