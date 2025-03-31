// Simple script to check database connection
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Testing database connection...')
  
  try {
    // Try to get a count of schools
    const schoolCount = await prisma.school.count()
    console.log(`Successfully connected to database! You have ${schoolCount} schools in your database.`)
    
    // List all schools if any exist
    if (schoolCount > 0) {
      const schools = await prisma.school.findMany({ take: 5 })
      console.log('First 5 schools:', schools)
    }
    
    return { success: true, schoolCount }
  } catch (error) {
    console.error('Database connection error:', error)
    return { success: false, error: error.message }
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .then(result => console.log('Done!', result))
  .catch(e => console.error('Script error:', e)) 