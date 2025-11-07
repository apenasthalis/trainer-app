"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Trash2, Edit } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ProtectedRoute } from "@/components/protected-route"
import { Header } from "@/components/header"
import { PageTransition } from "@/components/page-transition"

interface Exercise {
  id: string
  name: string
  category: string
  description: string
  muscleGroup: string
}

export default function ExerciciosPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    muscleGroup: "",
  })

  useEffect(() => {
    const savedExercises = localStorage.getItem("gym-exercises")
    if (savedExercises) {
      setExercises(JSON.parse(savedExercises))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("gym-exercises", JSON.stringify(exercises))
  }, [exercises])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingExercise) {
      setExercises(exercises.map((ex) => (ex.id === editingExercise.id ? { ...editingExercise, ...formData } : ex)))
      setEditingExercise(null)
    } else {
      const newExercise: Exercise = {
        id: Date.now().toString(),
        ...formData,
      }
      setExercises([...exercises, newExercise])
    }

    setFormData({ name: "", category: "", description: "", muscleGroup: "" })
    setIsDialogOpen(false)
  }

  const handleEdit = (exercise: Exercise) => {
    setEditingExercise(exercise)
    setFormData({
      name: exercise.name,
      category: exercise.category,
      description: exercise.description,
      muscleGroup: exercise.muscleGroup,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id))
  }

  const resetForm = () => {
    setFormData({ name: "", category: "", description: "", muscleGroup: "" })
    setEditingExercise(null)
  }

  return (
    <ProtectedRoute>
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-900 dark:to-zinc-800">
          <Header />
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
              <Link href="/">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Gerenciar Exercícios</h1>
            </div>

            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600 dark:text-gray-300">
                Total de exercícios:{" "}
                <span className="font-semibold text-gray-900 dark:text-gray-100">{exercises.length}</span>
              </p>

              <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                  setIsDialogOpen(open)
                  if (!open) resetForm()
                }}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Exercício
                  </Button>
                </DialogTrigger>
                <DialogContent className="border-gray-200 dark:border-slate-700/50">
                  <DialogHeader>
                    <DialogTitle className="text-gray-900 dark:text-gray-100">
                      {editingExercise ? "Editar Exercício" : "Novo Exercício"}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-300">
                      {editingExercise
                        ? "Edite as informações do exercício"
                        : "Adicione um novo exercício à sua biblioteca"}
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-700 dark:text-gray-200">
                        Nome do Exercício
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Supino reto"
                        className="dark:border-zinc-600/50 dark:bg-zinc-800 dark:text-gray-100 dark:placeholder-gray-400"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="category" className="text-gray-700 dark:text-gray-200">
                        Categoria
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger className="dark:border-zinc-600/50 dark:bg-zinc-800 dark:text-gray-100">
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="peito">Peito</SelectItem>
                          <SelectItem value="costas">Costas</SelectItem>
                          <SelectItem value="pernas">Pernas</SelectItem>
                          <SelectItem value="ombros">Ombros</SelectItem>
                          <SelectItem value="bracos">Braços</SelectItem>
                          <SelectItem value="core">Core/Abdômen</SelectItem>
                          <SelectItem value="cardio">Cardio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="muscleGroup" className="text-gray-700 dark:text-gray-200">
                        Grupo Muscular
                      </Label>
                      <Input
                        id="muscleGroup"
                        value={formData.muscleGroup}
                        onChange={(e) => setFormData({ ...formData, muscleGroup: e.target.value })}
                        placeholder="Ex: Peitoral maior, tríceps"
                        className="dark:border-zinc-600/50 dark:bg-zinc-800 dark:text-gray-100 dark:placeholder-gray-400"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-gray-700 dark:text-gray-200">
                        Descrição
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Descreva como executar o exercício..."
                        className="dark:border-zinc-600/50 dark:bg-zinc-800 dark:text-gray-100 dark:placeholder-gray-400"
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="flex-1">
                        {editingExercise ? "Salvar Alterações" : "Adicionar Exercício"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exercises.map((exercise) => (
                <Card
                  key={exercise.id}
                  className="hover:shadow-md transition-shadow border-gray-200 dark:border-zinc-700/50"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{exercise.name}</CardTitle>
                        <CardDescription className="capitalize text-gray-600 dark:text-gray-300">
                          {exercise.category} • {exercise.muscleGroup}
                        </CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(exercise)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(exercise.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {exercise.description && (
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{exercise.description}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>

            {exercises.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-white dark:bg-zinc-800 rounded-lg p-8 shadow-sm max-w-md mx-auto border border-gray-200 dark:border-zinc-700/50">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    Nenhum exercício cadastrado
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Comece adicionando exercícios à sua biblioteca para criar treinos personalizados.
                  </p>
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Primeiro Exercício
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    </ProtectedRoute>
  )
}
