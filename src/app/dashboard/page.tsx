'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/custom/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, FileText, Clock, CheckCircle, XCircle } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Warranty = {
  id: string
  warranty_number: string
  beneficiary: string
  value: number
  start_date: string
  end_date: string
  status: 'pending' | 'confirmed' | 'issued' | 'rejected'
  type: string
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [warranties, setWarranties] = useState<Warranty[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      router.push('/login')
      return
    }
    setUser(currentUser)
    loadWarranties(currentUser.id)
  }

  const loadWarranties = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('warranties')
        .select('*')
        .eq('client_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setWarranties(data || [])
    } catch (error) {
      console.error('Erro ao carregar garantias:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendente', variant: 'secondary' as const, icon: Clock },
      confirmed: { label: 'Confirmada', variant: 'default' as const, icon: CheckCircle },
      issued: { label: 'Emitida', variant: 'default' as const, icon: CheckCircle },
      rejected: { label: 'Rejeitada', variant: 'destructive' as const, icon: XCircle }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Minhas Garantias</h1>
            <p className="text-gray-600 mt-1">Gerencie e acompanhe suas cartas de garantia</p>
          </div>
          <Link href="/dashboard/nova-garantia">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Garantia
            </Button>
          </Link>
        </div>

        {warranties.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhuma garantia cadastrada
              </h3>
              <p className="text-gray-600 mb-6">
                Comece solicitando sua primeira carta de garantia
              </p>
              <Link href="/dashboard/nova-garantia">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Solicitar Garantia
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {warranties.map((warranty) => (
              <Card key={warranty.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">
                        Garantia #{warranty.warranty_number}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {warranty.type}
                      </CardDescription>
                    </div>
                    {getStatusBadge(warranty.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Beneficiário</p>
                      <p className="font-semibold">{warranty.beneficiary}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Valor</p>
                      <p className="font-semibold text-blue-600">
                        {formatCurrency(warranty.value)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Início</p>
                      <p className="font-semibold">{formatDate(warranty.start_date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Término</p>
                      <p className="font-semibold">{formatDate(warranty.end_date)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
