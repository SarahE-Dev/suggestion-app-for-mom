async function testPassword() {
  const email = 'seatherly.prsvr@gmail.com'
  const password = 'Masonlee11$'
  const { PrismaClient } = require('@prisma/client')
  const prisma = new PrismaClient()
  const bcrypt = require('bcryptjs')

  try {
    // First, find the user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (user) {
      console.log('Found user:', {
        id: user.id,
        email: user.email,
        hasPassword: !!user.password,
        passwordLength: user.password?.length
      })

      // Test the password
      if (user.password) {
        const isValid = await bcrypt.compare(password, user.password)
        console.log('Password valid:', isValid)
        
        // Create a new hash to compare
        const newHash = await bcrypt.hash(password, 10)
        console.log('Original hash:', user.password)
        console.log('New hash:', newHash)
        
        // Compare both ways to be sure
        console.log('Compare original:', await bcrypt.compare(password, user.password))
        console.log('Compare new:', await bcrypt.compare(password, newHash))
      }
    } else {
      console.log('User not found')
      
      // Create new user
      const hashedPassword = await bcrypt.hash(password, 10)
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: 'Test User'
        }
      })
      console.log('Created new user:', {
        id: newUser.id,
        email: newUser.email,
        hasPassword: !!newUser.password,
        passwordLength: newUser.password?.length
      })
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testPassword()