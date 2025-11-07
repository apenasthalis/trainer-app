"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => boolean
  register: (name: string, email: string, password: string) => boolean
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem("gym-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = (email: string, password: string): boolean => {
    // Verificar se o usuário existe
    const users = JSON.parse(localStorage.getItem("gym-users") || "[]")
    const existingUser = users.find((u: any) => u.email === email && u.password === password)

    if (existingUser) {
      const userData = {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
      }
      setUser(userData)
      localStorage.setItem("gym-user", JSON.stringify(userData))
      return true
    }

    // Para demo, aceitar qualquer email/senha válidos
    if (email.includes("@") && password.length >= 6) {
      const userData = {
        id: Date.now().toString(),
        name: email.split("@")[0],
        email: email,
      }
      setUser(userData)
      localStorage.setItem("gym-user", JSON.stringify(userData))
      return true
    }

    return false
  }

  const register = (name: string, email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem("gym-users") || "[]")

    // Verificar se email já existe
    if (users.some((u: any) => u.email === email)) {
      return false
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // Em produção, seria hasheada
    }

    users.push(newUser)
    localStorage.setItem("gym-users", JSON.stringify(users))

    const userData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    }
    setUser(userData)
    localStorage.setItem("gym-user", JSON.stringify(userData))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("gym-user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
