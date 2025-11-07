"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Trash2, Edit, Calendar } from "lucide-react"
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

interface WorkoutExercise {
  exerciseId: string
  exerciseName: string
  sets: number
  reps: number
  weight: number
  restTime: number
}

interface Workout {
  id: string
  name: string
  date: string
  exercises: WorkoutExercise[]
  notes: string
}

export default function TreinosPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null)
  const [currentWorkout, setCurrentWorkout] = useState<Partial<Workout>>({
    name: "",
    date: new Date().toISOString().split("T")[0],
    exercises: [],
    notes: "",
  })

  useEffect(() => {
    const savedExercises = localStorage.getItem("gym-exercises")
    const savedWorkouts = localStorage.getItem("gym-workouts")

    if (savedExercises) {
      setExercises(JSON.parse(savedExercises))
    }
    if (savedWorkouts) {
      setWorkouts(JSON.parse(savedWorkouts))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("gym-workouts", JSON.stringify(workouts))
  }, [workouts])

  const addExerciseToWorkout = () => {
    if (exercises.length === 0) return

    const newExercise: WorkoutExercise = {
      exerciseId: exercises[0].id,
      exerciseName: exercises[0].name,
      sets: 3,
      reps: 10,
      weight: 0,
      restTime: 60,
    }

    setCurrentWorkout({
      ...currentWorkout,
      exercises: [...(currentWorkout.exercises || []), newExercise],
    })
  }

  const updateWorkoutExercise = (index: number, field: keyof WorkoutExercise, value: any) => {
    const updatedExercises = [...(currentWorkout.exercises || [])]

    if (field === "exerciseId") {
      const selectedExercise = exercises.find((ex) => ex.id === value)
      if (selectedExercise) {
        updatedExercises[index] = {
          ...updatedExercises[index],
          exerciseId: value,
          exerciseName: selectedExercise.name,
        }
      }
    } else {
      updatedExercises[index] = {
        ...updatedExercises[index],
        [field]: value,
      }
    }

    setCurrentWorkout({
      ...currentWorkout,
      exercises: updatedExercises,
    })
  }

  const removeExerciseFromWorkout = (index: number) => {
    const updatedExercises = currentWorkout.exercises?.filter((_, i) => i !== index) || []
    setCurrentWorkout({
      ...currentWorkout,
      exercises: updatedExercises,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentWorkout.name || !currentWorkout.exercises?.length) return

    if (editingWorkout) {
      setWorkouts(
        workouts.map((w) =>
          w.id === editingWorkout.id ? { ...(currentWorkout as Workout), id: editingWorkout.id } : w,
        ),
      )
      setEditingWorkout(null)
    } else {
      const newWorkout: Workout = {
        ...(currentWorkout as Workout),
        id: Date.now().toString(),
      }
      setWorkouts([...workouts, newWorkout])
    }

    resetForm()
    setIsDialogOpen(false)
  }

  const handleEdit = (workout: Workout) => {
    setEditingWorkout(workout)
    setCurrentWorkout(workout)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setWorkouts(workouts.filter((w) => w.id !== id))
  }

  const resetForm = () => {
    setCurrentWorkout({
      name: "",
      date: new Date().toISOString().split("T")[0],
      exercises: [],
      notes: "",
    })
    setEditingWorkout(null)
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Gerenciar Treinos</h1>
            </div>

            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600 dark:text-gray-300">
                Total de treinos:{" "}
                <span className="font-semibold text-gray-900 dark:text-gray-100">{workouts.length}</span>
              </p>

              <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                  setIsDialogOpen(open)
                  if (!open) resetForm()
                }}
              >
                <DialogTrigger asChild>
                  <Button disabled={exercises.length === 0}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Treino
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-gray-200 dark:border-zinc-700/50">
                  <DialogHeader>
                    <DialogTitle className="text-gray-900 dark:text-gray-100">
                      {editingWorkout ? "Editar Treino" : "Novo Treino"}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-300">
                      {editingWorkout ? "Edite as informações do treino" : "Crie um novo treino personalizado"}
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="workoutName" className="text-gray-700 dark:text-gray-200">
                          Nome do Treino
                        </Label>
                        <Input
                          id="workoutName"
                          value={currentWorkout.name}
                          onChange={(e) => setCurrentWorkout({ ...currentWorkout, name: e.target.value })}
                          placeholder="Ex: Treino A - Peito e Tríceps"
                          className="dark:border-zinc-600/50 dark:bg-zinc-800 dark:text-gray-100 dark:placeholder-gray-400"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="workoutDate" className="text-gray-700 dark:text-gray-200">
                          Data
                        </Label>
                        <Input
                          id="workoutDate"
                          type="date"
                          value={currentWorkout.date}
                          onChange={(e) => setCurrentWorkout({ ...currentWorkout, date: e.target.value })}
                          className="dark:border-zinc-600/50 dark:bg-zinc-800 dark:text-gray-100"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <Label className="text-gray-700 dark:text-gray-200">Exercícios do Treino</Label>
                        <Button type="button" onClick={addExerciseToWorkout} size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Exercício
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {currentWorkout.exercises?.map((workoutExercise, index) => (
                          <Card key={index} className="p-4 border-gray-200 dark:border-zinc-700/50">
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                              <div className="md:col-span-2">
                                <Label className="text-gray-700 dark:text-gray-200">Exercício</Label>
                                <Select
                                  value={workoutExercise.exerciseId}
                                  onValueChange={(value) => updateWorkoutExercise(index, "exerciseId", value)}
                                >
                                  <SelectTrigger className="dark:border-zinc-600/50 dark:bg-zinc-800 dark:text-gray-100">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {exercises.map((exercise) => (
                                      <SelectItem key={exercise.id} value={exercise.id}>
                                        {exercise.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label className="text-gray-700 dark:text-gray-200">Séries</Label>
                                <Input
                                  type="number"
                                  value={workoutExercise.sets}
                                  onChange={(e) =>
                                    updateWorkoutExercise(index, "sets", Number.parseInt(e.target.value))
                                  }
                                  className="dark:border-zinc-600/50 dark:bg-zinc-800 dark:text-gray-100"
                                  min="1"
                                />
                              </div>

                              <div>
                                <Label className="text-gray-700 dark:text-gray-200">Reps</Label>
                                <Input
                                  type="number"
                                  value={workoutExercise.reps}
                                  onChange={(e) =>
                                    updateWorkoutExercise(index, "reps", Number.parseInt(e.target.value))
                                  }
                                  className="dark:border-zinc-600/50 dark:bg-zinc-800 dark:text-gray-100"
                                  min="1"
                                />
                              </div>

                              <div>
                                <Label className="text-gray-700 dark:text-gray-200">Carga (kg)</Label>
                                <Input
                                  type="number"
                                  value={workoutExercise.weight}
                                  onChange={(e) =>
                                    updateWorkoutExercise(index, "weight", Number.parseFloat(e.target.value))
                                  }
                                  className="dark:border-zinc-600/50 dark:bg-zinc-800 dark:text-gray-100"
                                  min="0"
                                  step="0.5"
                                />
                              </div>

                              <div className="flex items-end">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => removeExerciseFromWorkout(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes" className="text-gray-700 dark:text-gray-200">
                        Observações
                      </Label>
                      <Input
                        id="notes"
                        value={currentWorkout.notes}
                        onChange={(e) => setCurrentWorkout({ ...currentWorkout, notes: e.target.value })}
                        placeholder="Observações sobre o treino..."
                        className="dark:border-zinc-600/50 dark:bg-zinc-800 dark:text-gray-100 dark:placeholder-gray-400"
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="flex-1">
                        {editingWorkout ? "Salvar Alterações" : "Criar Treino"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {exercises.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-white dark:bg-zinc-800 rounded-lg p-8 shadow-sm max-w-md mx-auto border border-gray-200 dark:border-zinc-700/50">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    Nenhum exercício cadastrado
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Você precisa cadastrar exercícios antes de criar treinos.
                  </p>
                  <Link href="/exercicios">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Cadastrar Exercícios
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workouts.map((workout) => (
                <Card
                  key={workout.id}
                  className="hover:shadow-md transition-shadow border-gray-200 dark:border-zinc-700/50"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{workout.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                          <Calendar className="h-4 w-4" />
                          {new Date(workout.date).toLocaleDateString("pt-BR")}
                        </CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(workout)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(workout.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {workout.exercises.length} exercício(s)
                      </p>
                      <div className="space-y-1">
                        {workout.exercises.slice(0, 3).map((ex, idx) => (
                          <div key={idx} className="text-xs text-gray-600 dark:text-gray-300">
                            {ex.exerciseName} - {ex.sets}x{ex.reps} ({ex.weight}kg)
                          </div>
                        ))}
                        {workout.exercises.length > 3 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            +{workout.exercises.length - 3} mais...
                          </div>
                        )}
                      </div>
                      {workout.notes && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{workout.notes}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {workouts.length === 0 && exercises.length > 0 && (
              <div className="text-center py-12">
                <div className="bg-white dark:bg-zinc-800 rounded-lg p-8 shadow-sm max-w-md mx-auto border border-gray-200 dark:border-zinc-700/50">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Nenhum treino criado</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Comece criando seu primeiro treino personalizado.
                  </p>
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Treino
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
