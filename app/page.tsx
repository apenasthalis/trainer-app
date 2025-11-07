import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dumbbell, Plus, BarChart3, Calendar } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { Header } from "@/components/header"
import { PageTransition } from "@/components/page-transition"

export default function HomePage() {
  return (
    <ProtectedRoute>
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-900 dark:to-zinc-800">
          <Header />
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Dumbbell className="h-8 w-8 text-orange-600" />
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">GymTracker</h1>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-300">Sistema de Gerenciamento de Treinos</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <Card className="hover:shadow-lg transition-shadow border-gray-200 dark:border-zinc-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <Plus className="h-5 w-5 text-blue-600" />
                    Exercícios
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    Gerencie sua biblioteca de exercícios
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Adicione, edite e organize todos os exercícios disponíveis para seus treinos.
                  </p>
                  <Link href="/exercicios">
                    <Button className="w-full">Gerenciar Exercícios</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-gray-200 dark:border-zinc-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <Calendar className="h-5 w-5 text-green-600" />
                    Treinos
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    Crie e organize seus treinos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Monte treinos personalizados com exercícios, cargas e repetições.
                  </p>
                  <Link href="/treinos">
                    <Button className="w-full">Criar Treinos</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-gray-200 dark:border-zinc-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    Relatórios
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    Acompanhe seu progresso
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Visualize estatísticas e evolução das suas cargas e treinos.
                  </p>
                  <Link href="/relatorios">
                    <Button className="w-full">Ver Relatórios</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <div className="mt-16 text-center">
              <div className="bg-white dark:bg-zinc-800 rounded-lg p-8 shadow-sm max-w-2xl mx-auto border border-gray-200 dark:border-zinc-700/50">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Bem-vindo ao GymTracker!
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Organize seus treinos de forma eficiente. Cadastre exercícios, monte treinos personalizados com cargas
                  e repetições, e acompanhe seu progresso através de relatórios detalhados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </ProtectedRoute>
  )
}
