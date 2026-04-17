import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const roles = [
  {
    roleName: "ADMIN",
    roleDescription: "Administrator with full access",
    createdOn: new Date(),
  },
  {
    roleName: "USER",
    roleDescription: "Regular user with standard access",
    createdOn: new Date(),
  },
];

const main = async () => {
  console.log("Seeding database...");

  for (const role of roles) {
    await prisma.role.upsert({
      where: { roleName: role.roleName },
      update: {},
      create: role,
    });
    console.log(`Created role: ${role.roleName}`);
  }

  console.log("Database seeding completed.");
};

main()
  .catch((e) => {
    console.error("Error seeding database:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
