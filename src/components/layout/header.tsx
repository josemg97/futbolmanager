'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Bell, Menu, User, LogOut, Settings } from 'lucide-react'
import { createClientSupabaseClient } from '@/lib/supabase'

interface HeaderProps {
  user?: {
    username: string
    email: string
  }
}

export function Header({ user }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">FM</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Football Manager</span>
            </Link>
          </div>

          {/* Navigation */}
          {user && (
            <nav className="hidden md:flex space-x-8">
              <Link href="/dashboard" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/team" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">
                My Team
              </Link>
              <Link href="/market" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">
                Transfer Market
              </Link>
              <Link href="/matches" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">
                Matches
              </Link>
              <Link href="/training" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">
                Training
              </Link>
            </nav>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                
                <div className="relative">
                  <Button
                    variant="ghost"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2"
                  >
                    <User className="h-5 w-5" />
                    <span className="hidden md:block">{user.username}</span>
                  </Button>
                  
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Profile Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Get Started</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && user && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/dashboard" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600">
                Dashboard
              </Link>
              <Link href="/team" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600">
                My Team
              </Link>
              <Link href="/market" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600">
                Transfer Market
              </Link>
              <Link href="/matches" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600">
                Matches
              </Link>
              <Link href="/training" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600">
                Training
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}