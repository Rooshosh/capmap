import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const FAKE_USERS = [
  { name: 'Henrik', color: '#e6194b' },
  { name: faker.person.firstName(), color: '#3cb44b' },
  { name: faker.person.firstName(), color: '#ffe119' },
  { name: faker.person.firstName(), color: '#4363d8' },
  { name: faker.person.firstName(), color: '#f58231' },
  { name: faker.person.firstName(), color: '#911eb4' },
  { name: faker.person.firstName(), color: '#46f0f0' },
  { name: faker.person.firstName(), color: '#f032e6' },
  { name: faker.person.firstName(), color: '#bcf60c' },
  { name: faker.person.firstName(), color: '#fabebe' },
];

async function main() {
  // Seed fake users if not already present
  const existing = await prisma.fakeUser.findMany();
  let fakeUsers;
  if (existing.length < FAKE_USERS.length) {
    await prisma.fakeUser.deleteMany();
    fakeUsers = await prisma.fakeUser.createMany({
      data: FAKE_USERS,
    });
  }
  const users = await prisma.fakeUser.findMany();
  const henrik = users.find(u => u.name === 'Henrik');
  const others = users.filter(u => u.name !== 'Henrik');

  // Assign each DetailedActivity to a fake user, with higher chance to Henrik
  const activities = await prisma.detailedActivity.findMany();
  for (const activity of activities) {
    let assignedUser;
    if (Math.random() < 0.3 && henrik) {
      assignedUser = henrik;
    } else {
      assignedUser = others[Math.floor(Math.random() * others.length)];
    }
    await prisma.detailedActivity.update({
      where: { id: activity.id },
      data: { fakeUserId: assignedUser.id },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 