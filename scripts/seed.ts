// import { PrismaClient } from "@prisma/client";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main() {
    try {
        await db.category.createMany({
            data: [
                { name: "Computer Science" },
                { name: "Engineering" },
                { name: "Music" },
                { name: "Photography" },
                { name: "Painting" },
                { name: "Filming" },
                { name: "Fitness" },
                { name: "Accounting" },
            ]
        });

        console.log("Successfully created categories");
    } catch (error) {
        console.log("Error seeding the database categories", error);
    } finally {
        await db.$disconnect();
    }
}

main();