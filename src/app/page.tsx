import Link from 'next/link'
import { Shield, FileCheck, Lock, BarChart3, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">TechGarantias</span>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2" asChild>
                <Link href="/consultar">
                  <Search className="h-4 w-4" />
                  Consultar Carta
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/cadastro">Cadastrar</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Gestão de Garantias <span className="text-blue-600">Simplificada</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Solicite, acompanhe e gerencie suas cartas de garantia de forma rápida e segura
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="text-lg px-8 gap-2" asChild>
              <Link href="/consultar">
                <Search className="h-5 w-5" />
                Consultar Carta
              </Link>
            </Button>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8" asChild>
              <Link href="/cadastro">Começar Agora</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <Link href="/login">Já tenho conta</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Search className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Consulta Pública</CardTitle>
              <CardDescription>
                Verifique o status de qualquer carta de garantia sem precisar fazer login
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileCheck className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Cadastro Rápido</CardTitle>
              <CardDescription>
                Solicite suas garantias em minutos com nosso formulário intuitivo
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Lock className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Confirmação Segura</CardTitle>
              <CardDescription>
                Processo de aprovação transparente com notificações em tempo real
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Acompanhamento Total</CardTitle>
              <CardDescription>
                Visualize todas as suas garantias em um painel personalizado
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Crie sua conta gratuitamente e solicite sua primeira garantia hoje
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
              <Link href="/cadastro">Criar Conta Grátis</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>© 2024 TechGarantias. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
