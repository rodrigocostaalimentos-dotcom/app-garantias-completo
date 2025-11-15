'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/custom/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FileText, Users, CheckCircle, Clock, XCircle, Search, Filter } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

type Warranty = {
  id: string
  client_id: string
  warranty_number: string
  beneficiary: string
  value: number
  start_date: string
  end_date: string
  status: 'pending' | 'confirmed' | 'issued' | 'rejected'
  type: string
  description: string | null
  created_at: string
  profiles?: {
    full_name: string
    email: string
    company_name: string | null
  }
}

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [warranties, setWarranties] = useState<Warranty[]>([])
  const [filteredWarranties, setFilteredWarranties] = useState<Warranty[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWarranty, setSelectedWarranty] = useState<Warranty | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    filterWarranties()
  }, [warranties, searchTerm, statusFilter])

  const checkUser = async () => {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      router.push('/login')
      return
    }
    
    // Verificar se é admin (ajuste conforme sua lógica)
    if (currentUser.email !== 'admin@techgarantias.com.br') {
      router.push('/dashboard')
      return
    }
    
    setUser(currentUser)
    loadWarranties()
  }

  const loadWarranties = async () => {
    try {
      const { data, error } = await supabase
        .from('warranties')
        .select(`
          *,
          profiles (
            full_name,
            email,
            company_name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setWarranties(data || [])
    } catch (error) {
      console.error('Erro ao carregar garantias:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterWarranties = () => {
    let filtered = warranties

    if (statusFilter !== 'all') {
      filtered = filtered.filter(w => w.status === statusFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(w =>
        w.warranty_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.beneficiary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.profiles?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.profiles?.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredWarranties(filtered)
  }

  const updateWarrantyStatus = async (warrantyId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('warranties')
        .update({ status: newStatus })
        .eq('id', warrantyId)

      if (error) throw error

      toast.success('Status atualizado com sucesso!')
      loadWarranties()
      setSelectedWarranty(null)
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar status')
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

  const stats = {
    total: warranties.length,
    pending: warranties.filter(w => w.status === 'pending').length,
    confirmed: warranties.filter(w => w.status === 'confirmed').length,
    issued: warranties.filter(w => w.status === 'issued').length,
    rejected: warranties.filter(w => w.status === 'rejected').length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} isAdmin />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} isAdmin />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
          <p className="text-gray-600 mt-1">Gerencie todas as solicitações de garantias</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pendentes</CardDescription>
              <CardTitle className="text-3xl text-yellow-600">{stats.pending}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Confirmadas</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{stats.confirmed}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Emitidas</CardDescription>
              <CardTitle className="text-3xl text-green-600">{stats.issued}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Rejeitadas</CardDescription>
              <CardTitle className="text-3xl text-red-600">{stats.rejected}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por número, beneficiário ou cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="confirmed">Confirmadas</SelectItem>
                    <SelectItem value="issued">Emitidas</SelectItem>
                    <SelectItem value="rejected">Rejeitadas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warranties List */}
        <div className="grid gap-4">
          {filteredWarranties.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhuma garantia encontrada
                </h3>
                <p className="text-gray-600">
                  Ajuste os filtros ou aguarde novas solicitações
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredWarranties.map((warranty) => (
              <Card key={warranty.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">
                          #{warranty.warranty_number}
                        </CardTitle>
                        {getStatusBadge(warranty.status)}
                      </div>
                      <CardDescription>
                        <div className="space-y-1">
                          <p><strong>Cliente:</strong> {warranty.profiles?.full_name}</p>
                          {warranty.profiles?.company_name && (
                            <p><strong>Empresa:</strong> {warranty.profiles.company_name}</p>
                          )}
                          <p><strong>Email:</strong> {warranty.profiles?.email}</p>
                        </div>
                      </CardDescription>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedWarranty(warranty)}
                        >
                          Ver Detalhes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Detalhes da Garantia #{warranty.warranty_number}</DialogTitle>
                          <DialogDescription>
                            Gerencie o status e visualize informações completas
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedWarranty && (
                          <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-gray-600">Tipo</Label>
                                <p className="font-semibold">{selectedWarranty.type}</p>
                              </div>
                              <div>
                                <Label className="text-gray-600">Status Atual</Label>
                                <div className="mt-1">{getStatusBadge(selectedWarranty.status)}</div>
                              </div>
                              <div>
                                <Label className="text-gray-600">Beneficiário</Label>
                                <p className="font-semibold">{selectedWarranty.beneficiary}</p>
                              </div>
                              <div>
                                <Label className="text-gray-600">Valor</Label>
                                <p className="font-semibold text-blue-600">
                                  {formatCurrency(selectedWarranty.value)}
                                </p>
                              </div>
                              <div>
                                <Label className="text-gray-600">Data de Início</Label>
                                <p className="font-semibold">{formatDate(selectedWarranty.start_date)}</p>
                              </div>
                              <div>
                                <Label className="text-gray-600">Data de Término</Label>
                                <p className="font-semibold">{formatDate(selectedWarranty.end_date)}</p>
                              </div>
                            </div>

                            {selectedWarranty.description && (
                              <div>
                                <Label className="text-gray-600">Descrição</Label>
                                <p className="mt-1 text-sm">{selectedWarranty.description}</p>
                              </div>
                            )}

                            <div className="border-t pt-4">
                              <Label className="text-gray-600 mb-3 block">Alterar Status</Label>
                              <div className="grid grid-cols-2 gap-3">
                                <Button
                                  variant="outline"
                                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                                  onClick={() => updateWarrantyStatus(selectedWarranty.id, 'confirmed')}
                                  disabled={selectedWarranty.status === 'confirmed'}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Confirmar
                                </Button>
                                <Button
                                  variant="outline"
                                  className="border-green-600 text-green-600 hover:bg-green-50"
                                  onClick={() => updateWarrantyStatus(selectedWarranty.id, 'issued')}
                                  disabled={selectedWarranty.status === 'issued'}
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  Emitir
                                </Button>
                                <Button
                                  variant="outline"
                                  className="border-red-600 text-red-600 hover:bg-red-50"
                                  onClick={() => updateWarrantyStatus(selectedWarranty.id, 'rejected')}
                                  disabled={selectedWarranty.status === 'rejected'}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Rejeitar
                                </Button>
                                <Button
                                  variant="outline"
                                  className="border-yellow-600 text-yellow-600 hover:bg-yellow-50"
                                  onClick={() => updateWarrantyStatus(selectedWarranty.id, 'pending')}
                                  disabled={selectedWarranty.status === 'pending'}
                                >
                                  <Clock className="h-4 w-4 mr-2" />
                                  Pendente
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Tipo</p>
                      <p className="font-semibold">{warranty.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Beneficiário</p>
                      <p className="font-semibold">{warranty.beneficiary}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Valor</p>
                      <p className="font-semibold text-blue-600">
                        {formatCurrency(warranty.value)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Solicitado em</p>
                      <p className="font-semibold">{formatDate(warranty.created_at)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
