import { PrismaClient } from "@prisma/client";

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if(process.env.NODE_ENV !== 'production') globalThis.prisma = db;

/*
npx prisma generate - generates the prisma client and make the schema changes accessible to the above db or client instance
 basically this command is for locally updates

npx prisma db push - pushes the schemas defined in your file schema.prisma to db
*/