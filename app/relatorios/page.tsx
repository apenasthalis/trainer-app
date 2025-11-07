"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, TrendingUp, Calendar, Dumbbell, Target } from "lucide-react"
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

interface ExerciseStats {
  exerciseId: string
  exerciseName: string
  totalWorkouts: number
  maxWeight: number
  avgWeight: number
  totalVolume: number
  lastWorkout: string
  progression: number
}

export default function RelatoriosPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [selectedExercise, setSelectedExercise] = useState<string>("all")
  const [selectedPeriod, setSelectedPeriod] = useState<string>("30")

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

  const getFilteredWorkouts = () => {
    const days = Number.parseInt(selectedPeriod)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    return workouts.filter((workout) => new Date(workout.date) >= cutoffDate)
  }

  const getExerciseStats = (): ExerciseStats[] => {
    const filteredWorkouts = getFilteredWorkouts()
    const exerciseMap = new Map<string, ExerciseStats>()

    filteredWorkouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        const key = exercise.exerciseId
        const volume = exercise.sets * exercise.reps * exercise.weight

        if (!exerciseMap.has(key)) {
          exerciseMap.set(key, {
            exerciseId: exercise.exerciseId,
            exerciseName: exercise.exerciseName,
            totalWorkouts: 0,
            maxWeight: exercise.weight,
            avgWeight: 0,
            totalVolume: 0,
            lastWorkout: workout.date,
            progression: 0,
          })
        }

        const stats = exerciseMap.get(key)!
        stats.totalWorkouts += 1
        stats.maxWeight = Math.max(stats.maxWeight, exercise.weight)
        stats.totalVolume += volume

        if (new Date(workout.date) > new Date(stats.lastWorkout)) {
          stats.lastWorkout = workout.date
        }
      })
    })

    // Calculate average weight and progression
    exerciseMap.forEach((stats, key) => {
      const exerciseWorkouts = filteredWorkouts
        .filter((w) => w.exercises.some((e) => e.exerciseId === key))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      if (exerciseWorkouts.length > 0) {
        const weights = exerciseWorkouts.flatMap((w) =>
          w.exercises.filter((e) => e.exerciseId === key).map((e) => e.weight),
        )
        stats.avgWeight = weights.reduce((sum, w) => sum + w, 0) / weights.length

        // Calculate progression (difference between first and last workout)
        if (exerciseWorkouts.length > 1) {
          const firstWorkout = exerciseWorkouts[0]
          const lastWorkout = exerciseWorkouts[exerciseWorkouts.length - 1]

          const firstWeight = firstWorkout.exercises.find((e) => e.exerciseId === key)?.weight || 0
          const lastWeight = lastWorkout.exercises.find((e) => e.exerciseId === key)?.weight || 0

          stats.progression = lastWeight - firstWeight
        }
      }
    })

    return Array.from(exerciseMap.values()).sort((a, b) => b.totalVolume - a.totalVolume)
  }

  const getOverallStats = () => {
    const filteredWorkouts = getFilteredWorkouts()

    const totalWorkouts = filteredWorkouts.length
    const totalExercises = new Set(filteredWorkouts.flatMap((w) => w.exercises.map((e) => e.exerciseId))).size

    const totalVolume = filteredWorkouts.reduce((sum, workout) => {
      return (
        sum +
        workout.exercises.reduce((workoutSum, exercise) => {
          return workoutSum + exercise.sets * exercise.reps * exercise.weight
        }, 0)
      )
    }, 0)

    const avgWorkoutsPerWeek = totalWorkouts / (Number.parseInt(selectedPeriod) / 7)

    return {
      totalWorkouts,
      totalExercises,
      totalVolume,
      avgWorkoutsPerWeek: Math.round(avgWorkoutsPerWeek * 10) / 10,
    }
  }

  const exerciseStats = getExerciseStats()
  const overallStats = getOverallStats()
  const filteredStats =
    selectedExercise === "all" ? exerciseStats : exerciseStats.filter((stat) => stat.exerciseId === selectedExercise)

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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Relatórios e Estatísticas</h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex-1">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="dark:border-zinc-600/50 dark:bg-zinc-800 dark:text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Últimos 7 dias</SelectItem>
                    <SelectItem value="30">Últimos 30 dias</SelectItem>
                    <SelectItem value="90">Últimos 3 meses</SelectItem>
                    <SelectItem value="365">Último ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <Select value={selectedExercise} onValueChange={setSelectedExercise}>
                  <SelectTrigger className="dark:border-zinc-600/50 dark:bg-zinc-800 dark:text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os exercícios</SelectItem>
                    {exercises.map((exercise) => (
                      <SelectItem key={exercise.id} value={exercise.id}>
                        {exercise.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="border-gray-200 dark:border-zinc-700/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Total de Treinos
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {overallStats.totalWorkouts}
                  </div>
                  <p className="text-xs text-muted-foreground">{overallStats.avgWorkoutsPerWeek} por semana</p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 dark:border-zinc-700/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Exercícios Únicos
                  </CardTitle>
                  <Dumbbell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {overallStats.totalExercises}
                  </div>
                  <p className="text-xs text-muted-foreground">exercícios diferentes</p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 dark:border-zinc-700/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Volume Total</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {Math.round(overallStats.totalVolume).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">kg levantados</p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 dark:border-zinc-700/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Progressão</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {exerciseStats.filter((s) => s.progression > 0).length}
                  </div>
                  <p className="text-xs text-muted-foreground">exercícios em evolução</p>
                </CardContent>
              </Card>
            </div>

            {/* Exercise Details */}
            <Card className="border-gray-200 dark:border-zinc-700/50">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">Detalhes por Exercício</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Estatísticas detalhadas dos seus exercícios no período selecionado
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredStats.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      Nenhum dado encontrado para o período selecionado.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredStats.map((stat) => (
                      <div
                        key={stat.exerciseId}
                        className="border border-gray-200 dark:border-zinc-700/50 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                            {stat.exerciseName}
                          </h3>
                          <div
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              stat.progression > 0
                                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                : stat.progression < 0
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                            }`}
                          >
                            {stat.progression > 0 ? "+" : ""}
                            {stat.progression}kg
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Treinos</p>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{stat.totalWorkouts}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Carga Máxima</p>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{stat.maxWeight}kg</p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Carga Média</p>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                              {Math.round(stat.avgWeight * 10) / 10}kg
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Volume Total</p>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                              {Math.round(stat.totalVolume).toLocaleString()}kg
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                          Último treino: {new Date(stat.lastWorkout).toLocaleDateString("pt-BR")}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {workouts.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-white dark:bg-zinc-800 rounded-lg p-8 shadow-sm max-w-md mx-auto border border-gray-200 dark:border-zinc-700/50">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    Nenhum treino registrado
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Crie alguns treinos para visualizar suas estatísticas e progresso.
                  </p>
                  <Link href="/treinos">
                    <Button>
                      <Calendar className="h-4 w-4 mr-2" />
                      Criar Treinos
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    </ProtectedRoute>
  )
}
