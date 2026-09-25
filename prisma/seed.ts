import { PrismaClient } from "@prisma/client";
import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";

const prisma = new PrismaClient();
const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = await scryptAsync(password, salt, 64) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

async function main() {
  console.log("Seeding database...");
  
  const passwordHash = await hashPassword("password123");
  
  await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      name: "Mahasiswa Tester",
      email: "test@example.com",
      passwordHash,
      preference: {
        create: {
          theme: "light",
          defaultFilter: "all",
        }
      },
      transactions: {
        create: [
          { type: "income", amount: 2500000, description: "Uang Bulanan dari Orang Tua", date: new Date(new Date().setDate(new Date().getDate() - 5)) },
          { type: "expense", amount: 150000, description: "Beli Buku Referensi", date: new Date(new Date().setDate(new Date().getDate() - 3)) },
          { type: "expense", amount: 50000, description: "Makan Siang", date: new Date(new Date().setDate(new Date().getDate() - 2)) },
          { type: "income", amount: 300000, description: "Bayaran Freelance", date: new Date(new Date().setDate(new Date().getDate() - 1)) },
          { type: "expense", amount: 20000, description: "Kopi", date: new Date() },
        ]
      }
    },
  });

  console.log("Database seeded successfully!");
  console.log("-----------------------------------------");
  console.log("Gunakan akun berikut untuk login:");
  console.log("Email:    test@example.com");
  console.log("Password: password123");
  console.log("-----------------------------------------");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

