import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { generateToken } from '@/lib/auth'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // In a real app, verify password here
    // For demo purposes, we'll skip password verification
    // const isValidPassword = await verifyPassword(password, user.passwordHash)

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    })

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      },
      token
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}