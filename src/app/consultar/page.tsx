'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Shield, Search, CheckCircle, XCircle, Clock, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

type WarrantyStatus = 'pending' | 'confirmed' | 'issued' | 'rejected'

interface WarrantyInfo {
  warranty_number: string
  beneficiary: string
  value: number
  start_date: string
  end_date: string
  status: WarrantyStatus
  type: string
  description: string | null
}

const statusConfig = {
  pending: {
    label: 'Pendente',
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200'
  },
  confirmed: {
    label: 'Confirmada',
    icon: CheckCircle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  issued: {
    label: 'Emitida',
    icon: FileText,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  rejected: {
    label: 'Rejeitada',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  }
}

export default function ConsultarPage() {
  const [warrantyNumber, setWarrantyNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [warranty, setWarranty] = useState<WarrantyInfo | null>(null)
  const [notFound, setNotFound] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!warrantyNumber.trim()) {
      toast.error('Digite o número da carta de garantia')
      return
    }

    setLoading(true)
    setNotFound(false)
    setWarranty(null)

    try {
      const { data, error } = await supabase
        .from('warranties')
        .select('warranty_number, beneficiary, value, start_date, end_date, status, type, description')
        .eq('warranty_number', warrantyNumber.trim())
        .single()

      if (error || !data) {
        setNotFound(true)
        toast.error('Carta de garantia não encontrada')
      } else {
        setWarranty(data)
        toast.success('Carta de garantia encontrada!')
      }
    } catch (error) {
      console.error('Erro ao buscar garantia:', error)
      toast.error('Erro ao buscar garantia')
    } finally {
      setLoading(false)
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">TechGarantias</span>
            </Link>
            <div className="flex gap-3">
              <Link href="/login">
                <Button variant="ghost">Entrar</Button>
              </Link>
              <Link href="/cadastro">
                <Button className="bg-blue-600 hover:bg-blue-700">Cadastrar</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Consultar Carta de Garantia
          </h1>
          <p className="text-lg text-gray-600">
            Digite o número da carta para verificar seu status e informações
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Buscar Garantia</CardTitle>
            <CardDescription>
              Insira o número da carta de garantia para consultar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-3">
              <Input
                type="text"
                placeholder="Ex: GAR-2024-001"
                value={warrantyNumber}
                onChange={(e) => setWarrantyNumber(e.target.value)}
                className="flex-1"
                disabled={loading}
              />
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>Buscando...</>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Consultar
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Not Found Message */}
        {notFound && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-red-600">
                <XCircle className="h-6 w-6" />
                <div>
                  <p className="font-semibold">Carta de garantia não encontrada</p>
                  <p className="text-sm text-red-500">
                    Verifique se o número está correto e tente novamente
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Warranty Information */}
        {warranty && (
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">
                    Carta Nº {warranty.warranty_number}
                  </CardTitle>
                  <CardDescription className="text-base">
                    Informações da garantia solicitada
                  </CardDescription>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${statusConfig[warranty.status].bgColor} ${statusConfig[warranty.status].borderColor} border-2`}>
                  {(() => {
                    const StatusIcon = statusConfig[warranty.status].icon
                    return <StatusIcon className={`h-5 w-5 ${statusConfig[warranty.status].color}`} />
                  })()}
                  <span className={`font-semibold ${statusConfig[warranty.status].color}`}>
                    {statusConfig[warranty.status].label}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Beneficiário</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {warranty.beneficiary}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Valor</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {formatCurrency(warranty.value)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {warranty.type}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Vigência</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {formatDate(warranty.start_date)} até {formatDate(warranty.end_date)}
                  </p>
                </div>
              </div>

              {warranty.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Descrição</label>
                  <p className="text-base text-gray-700 mt-1 bg-gray-50 p-4 rounded-lg">
                    {warranty.description}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500 text-center">
                  Para mais informações, entre em contato conosco ou{' '}
                  <Link href="/login" className="text-blue-600 hover:underline font-medium">
                    faça login
                  </Link>
                  {' '}para acessar seu painel completo
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Precisa de ajuda?
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Se você é cliente e deseja acompanhar todas as suas garantias, 
                  crie uma conta ou faça login para acessar seu painel completo.
                </p>
                <div className="flex gap-3">
                  <Link href="/cadastro">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Criar Conta
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="sm" variant="outline">
                      Fazer Login
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>© 2024 TechGarantias. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
