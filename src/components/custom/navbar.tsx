'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, LogOut, User, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/auth'
import { useRouter } from 'next/navigation'

interface NavbarProps {
  user?: any
  isAdmin?: boolean
}

export function Navbar({ user, isAdmin }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">TechGarantias</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                {isAdmin ? (
                  <Button 
                    variant={pathname === '/admin' ? 'default' : 'ghost'} 
                    size="sm"
                    asChild
                  >
                    <Link href="/admin">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Painel Admin
                    </Link>
                  </Button>
                ) : (
                  <Button 
                    variant={pathname === '/dashboard' ? 'default' : 'ghost'} 
                    size="sm"
                    asChild
                  >
                    <Link href="/dashboard">
                      <User className="h-4 w-4 mr-2" />
                      Minhas Garantias
                    </Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/cadastro">Cadastrar</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
