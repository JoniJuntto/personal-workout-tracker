import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { motion } from "framer-motion"
import Navigation from "@/components/Navigation"
import JoyRide from "@/lib/JoyRide"

type ExerciseSet = {
  weight: number;
  reps: number;
}

type Exercise = {
  name: string;
  sets: ExerciseSet[];
}

type Workout = {
  name: string;
  exercises: Exercise[];
  startedAt: Date;
  finishedAt: Date | null;
}

type WorkoutType = "Push" | "Pull" | "Legs" | "Full Body" | "Cardio";

const knownExercises = ["Squats", "Bench Press", "Deadlift", "Overhead Press", "Rows"];

export default function WorkoutTracker() {
  const [workout, setWorkout] = useState<Workout>({
    name: "",
    exercises: [],
    startedAt: new Date(),
    finishedAt: null
  })
  const [workoutType, setWorkoutType] = useState<WorkoutType | "">("")
  const [newExercise, setNewExercise] = useState<Exercise>({ name: "", sets: [] })
  const [customExercise, setCustomExercise] = useState("")
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - workout.startedAt.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [workout.startedAt]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };
  
  useEffect(() => {
    // Start the workout timer when the component mounts
    setWorkout(prev => ({ ...prev, startedAt: new Date() }))
  }, [])

  const handleWorkoutTypeSelect = (value: WorkoutType) => {
    setWorkoutType(value)
    const today = new Date()
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`
    const workoutName = `${formattedDate}-${value}`
    setWorkout(prev => ({ ...prev, name: workoutName }))
  }

  const handleExerciseSelect = (value: string) => {
    if (value === "custom") {
      setNewExercise({ name: customExercise, sets: [] })
    } else {
      setNewExercise({ name: value, sets: [] })
    }
  }

  const handleAddSet = () => {
    const lastSet = newExercise.sets[newExercise.sets.length - 1];
    setNewExercise((prev) => ({
      ...prev,
      sets: [
        ...prev.sets,
        {
          weight: lastSet ? lastSet.weight : 0,
          reps: lastSet ? lastSet.reps : 0,
        },
      ],
    }));
  };
  

  const handleSetChange = (index: number, field: 'weight' | 'reps', value: number) => {
    setNewExercise(prev => ({
      ...prev,
      sets: prev.sets.map((set, i) => i === index ? { ...set, [field]: value } : set)
    }))
  }

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault()
    if (newExercise.name && newExercise.sets.length > 0) {
      setWorkout(prev => ({
        ...prev,
        exercises: [...prev.exercises, newExercise]
      }))
      setNewExercise({ name: "", sets: [] })
      setCustomExercise("")
    }
  }

  const handleFinishWorkout = () => {
    setWorkout(prev => ({ ...prev, finishedAt: new Date() }))
  }

  const totalVolume = workout.exercises.reduce((sum, exercise) => 
    sum + exercise.sets.reduce((setSum, set) => setSum + set.weight * set.reps, 0), 0)

  const workoutDuration = workout.finishedAt 
    ? Math.round((workout.finishedAt.getTime() - workout.startedAt.getTime()) / 60000) 
    : Math.round((new Date().getTime() - workout.startedAt.getTime()) / 60000)

  return (
    <div className="container mx-auto p-4 lg:max-w-5xl xl:max-w-6xl">
      <Navigation />
      <div className="lg:flex lg:space-x-6">
        <Card className="lg:w-2/3 mb-6 lg:mb-0">
          <CardHeader>
            <CardTitle>Gym Workout Tracker</CardTitle>
            <CardDescription>Track your full workout session</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddExercise} className="space-y-4">
              <p>Elapsed Time: {formatTime(elapsedTime)}</p>
              {!workoutType ? (
                <div>
                  <Label htmlFor="workoutType">Choose Workout Type</Label>
                  <Select onValueChange={(value) => handleWorkoutTypeSelect(value as WorkoutType)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select workout type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Push">Push</SelectItem>
                      <SelectItem value="Pull">Pull</SelectItem>
                      <SelectItem value="Legs">Legs</SelectItem>
                      <SelectItem value="Full Body">Full Body</SelectItem>
                      <SelectItem value="Cardio">Cardio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <h2 className="text-2xl font-bold mb-4">{workout.name}</h2>
              )}
              <div className="sm:flex sm:space-x-2">
                <div className="flex-grow mb-4 sm:mb-0">
                  <Label htmlFor="exercise">Choose Exercise</Label>
                  <Select onValueChange={handleExerciseSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an exercise" />
                    </SelectTrigger>
                    <SelectContent>
                      {knownExercises.map(exercise => (
                        <SelectItem key={exercise} value={exercise}>{exercise}</SelectItem>
                      ))}
                      <SelectItem value="custom">Custom Exercise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newExercise.name === "custom" && (
                  <div className="flex-grow">
                    <Label htmlFor="customExercise">Custom Exercise Name</Label>
                    <Input
                      id="customExercise"
                      value={customExercise}
                      onChange={(e) => setCustomExercise(e.target.value)}
                      placeholder="Enter custom exercise name"
                    />
                  </div>
                )}
              </div>
              {newExercise.sets.map((set, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-100 p-4 rounded-lg"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">Set {index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setNewExercise(prev => ({
                          ...prev,
                          sets: prev.sets.filter((_, i) => i !== index)
                        }))
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`weight-${index}`}>Weight (kg)</Label>
                      <Input
                        id={`weight-${index}`}
                        type="number"
                        value={set.weight || ""}
                        onChange={(e) => handleSetChange(index, 'weight', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`reps-${index}`}>Reps</Label>
                      <Input
                        id={`reps-${index}`}
                        type="number"
                        value={set.reps || ""}
                        onChange={(e) => handleSetChange(index, 'reps', parseInt(e.target.value) || 0)}
                        min="0"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
              <div className="sm:flex sm:space-x-2">
                <Button type="button" onClick={handleAddSet} className="w-full mb-2 sm:mb-0">Add Set</Button>
                <Button type="submit" className="w-full">Add Exercise</Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Card className="lg:w-full">
          <CardHeader>
            <CardTitle>Workout Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {workout.exercises.length > 0 ? (
              <ul className="w-full space-y-4">
                {workout.exercises.map((exercise, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border p-4 rounded-lg shadow-sm"
                  >
                    <h4 className="font-medium text-lg mb-2">{exercise.name}</h4>
                    <ul className="space-y-2">
                      {exercise.sets.map((set, setIndex) => (
                        <li key={setIndex} className="flex justify-between items-center">
                          <span>Set {setIndex + 1}</span>
                          <span> @ {set.weight} kg x {set.reps} reps</span>
                        </li>
                      ))}
                    </ul>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p>No exercises added yet.</p>
            )}
            <div className="w-full mt-4">
              <Progress value={(workout.exercises.length / 5) * 100} className="mb-2" />
              <p className="text-sm text-gray-600 mb-4">Progress: {workout.exercises.length} exercises completed</p>
              <p className="font-semibold">Total Volume: {totalVolume.toFixed(1)} kg</p>
              <p>Workout Duration: {workoutDuration} minutes</p>
            </div>
            {!workout.finishedAt && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-full mt-4">Finish Workout</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Finish Workout</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to finish this workout? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleFinishWorkout}>Finish</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}