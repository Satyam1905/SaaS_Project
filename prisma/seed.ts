import { PrismaClient, Plan, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')
  
  // Create tenants
  const acme = await prisma.tenant.upsert({
    where: { name: 'Acme' },
    update: {},
    create: { name: 'Acme', plan: Plan.FREE },
  })

  const globex = await prisma.tenant.upsert({
    where: { name: 'Globex' },
    update: {},
    create: { name: 'Globex', plan: Plan.FREE },
  })

  const password = await bcrypt.hash('password', 12)

  // Create users for Acme
  await prisma.user.upsert({
    where: { email: 'admin@acme.test' },
    update: {},
    create: {
      email: 'admin@acme.test',
      password,
      role: Role.ADMIN,
      tenantId: acme.id,
    },
  })

  await prisma.user.upsert({
    where: { email: 'user@acme.test' },
    update: {},
    create: {
      email: 'user@acme.test',
      password,
      role: Role.MEMBER,
      tenantId: acme.id,
    },
  })

  // Create users for Globex
  await prisma.user.upsert({
    where: { email: 'admin@globex.test' },
    update: {},
    create: {
      email: 'admin@globex.test',
      password,
      role: Role.ADMIN,
      tenantId: globex.id,
    },
  })

  await prisma.user.upsert({
    where: { email: 'user@globex.test' },
    update: {},
    create: {
      email: 'user@globex.test',
      password,
      role: Role.MEMBER,
      tenantId: globex.id,
    },
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })