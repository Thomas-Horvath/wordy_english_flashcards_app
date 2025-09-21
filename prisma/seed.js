// prisma/seed.ts
import { PrismaClient } from './generated/prisma/index.js';


const prisma = new PrismaClient();

async function main() {
  // 1. User létrehozása (ha még nem létezik)
  const user = await prisma.user.upsert({
    where: { email: "test@gmail.com" },
    update: {},
    create: {
      name: "Admin",
      email: "test@gmail.com",
      password: "$2b$10$YzwJwcQhfs63cdiJNr33WeocoKd1ONvl3MT16ulw7kp0raAcAoS0m", // "password" bcrypt hash
    },
  });

  // 2. Szócsoportok + szópárok
  const groups = [
    {
      name: "Állatok",
      cards: [
        { en: "dog", hu: "kutya" },
        { en: "cat", hu: "macska" },
        { en: "bird", hu: "madár" },
        { en: "bear", hu: "medve" },
        { en: "horse", hu: "ló" },
      ],
    },
    {
      name: "Ételek",
      cards: [
        { en: "apple", hu: "alma" },
        { en: "bread", hu: "kenyér" },
        { en: "cheese", hu: "sajt" },
        { en: "milk", hu: "tej" },
        { en: "meat", hu: "hús" },
      ],
    },
    {
      name: "Tárgyak",
      cards: [
        { en: "house", hu: "ház" },
        { en: "car", hu: "autó" },
        { en: "book", hu: "könyv" },
        { en: "table", hu: "asztal" },
        { en: "phone", hu: "telefon" },
      ],
    },
    {
      name: "Igeidők",
      cards: [
        { en: "run", hu: "fut" },
        { en: "eat", hu: "eszik" },
        { en: "sleep", hu: "alszik" },
        { en: "read", hu: "olvas" },
        { en: "write", hu: "ír" },
      ],
    },
  ];

  for (const group of groups) {
    await prisma.wordGroup.create({
      data: {
        name: group.name,
        userId: user.id,
        cards: {
          create: group.cards,
        },
      },
    });
  }

  console.log("✅ Seed kész!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
