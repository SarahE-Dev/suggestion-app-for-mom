const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function addAdmin(email: string, password: string) {
  

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('User already exists:', existingUser.email);
      
      // Optionally update password
      const hashedPassword = await bcrypt.hash(password, 10)
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { password: hashedPassword }
      })
      console.log('Updated user password');
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    
    const user = await prisma.user.create({
      data: {
        email,
        name: "Admin User",
        password: hashedPassword,
      },
    })

    console.log('Created admin user:', {
      id: user.id,
      email: user.email,
      name: user.name,
      passwordLength: user.password?.length
    })
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

