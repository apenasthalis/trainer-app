"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dumbbell, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { PageTransition } from "@/components/page-transition"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const { login, register } = useAuth()
  const router = useRouter()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "Email é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória"
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres"
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = "Nome é obrigatório"
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Confirmação de senha é obrigatória"
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Senhas não coincidem"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Simular delay de rede
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (isLogin) {
        const success = login(formData.email, formData.password)
        if (success) {
          router.push("/")
        } else {
          setErrors({ general: "Email ou senha incorretos" })
        }
      } else {
        const success = register(formData.name, formData.email, formData.password)
        if (success) {
          router.push("/")
        } else {
          setErrors({ general: "Email já cadastrado" })
        }
      }
    } catch (error) {
      setErrors({ general: "Erro interno. Tente novamente." })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setFormData({ name: "", email: "", password: "", confirmPassword: "" })
    setErrors({})
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-gray-200 dark:border-zinc-700/50">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Dumbbell className="h-8 w-8 text-orange-600" />
              <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">GymTracker</CardTitle>
            </div>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              {isLogin ? "Entre na sua conta" : "Crie sua conta"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-200">
                    Nome Completo
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Seu nome completo"
                    className={`${errors.name ? "border-red-500" : ""} dark:border-zinc-600/50 dark:bg-zinc-800 dark:text-gray-100 dark:placeholder-gray-400`}
                  />
                  {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                </div>
              )}

              <div>
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-200">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                  className={`${errors.email ? "border-red-500" : ""} dark:border-zinc-600/50 dark:bg-zinc-800 dark:text-gray-100 dark:placeholder-gray-400`}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-200">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Sua senha"
                    className={`${errors.password ? "border-red-500" : ""} dark:border-zinc-600/50 dark:bg-zinc-800 dark:text-gray-100 dark:placeholder-gray-400`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
              </div>

              {!isLogin && (
                <div>
                  <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-200">
                    Confirmar Senha
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirme sua senha"
                    className={`${errors.confirmPassword ? "border-red-500" : ""} dark:border-zinc-600/50 dark:bg-zinc-800 dark:text-gray-100 dark:placeholder-gray-400`}
                  />
                  {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
                </div>
              )}

              {errors.general && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-md p-3">
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Carregando..." : isLogin ? "Entrar" : "Criar Conta"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  {isLogin ? "Criar conta" : "Fazer login"}
                </button>
              </p>
            </div>

            {isLogin && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-md">
                <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
                  <strong>Demo:</strong> Use qualquer email e senha com 6+ caracteres
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}
