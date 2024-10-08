import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Navigation from '@/components/Navigation';

// Define the types
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

type UserWorkouts = {
  userId: string;
  workouts: Workout[];
}

// Mock data for demonstration
const mockUserWorkouts: UserWorkouts = {
  userId: "user123",
  workouts: [
    {
      name: "Full Body Workout",
      exercises: [
        { name: "Squats", sets: [{ weight: 100, reps: 10 }, { weight: 110, reps: 8 }, { weight: 120, reps: 6 }] },
        { name: "Bench Press", sets: [{ weight: 80, reps: 10 }, { weight: 85, reps: 8 }, { weight: 90, reps: 6 }] },
        { name: "Deadlifts", sets: [{ weight: 120, reps: 8 }, { weight: 130, reps: 6 }, { weight: 140, reps: 4 }] },
      ],
      startedAt: new Date("2023-10-01T10:00:00"),
      finishedAt: new Date("2023-10-01T11:30:00"),
    },
    {
      name: "Upper Body Focus",
      exercises: [
        { name: "Pull-ups", sets: [{ weight: 0, reps: 12 }, { weight: 0, reps: 10 }, { weight: 0, reps: 8 }] },
        { name: "Shoulder Press", sets: [{ weight: 60, reps: 10 }, { weight: 65, reps: 8 }, { weight: 70, reps: 6 }] },
        { name: "Bicep Curls", sets: [{ weight: 20, reps: 12 }, { weight: 22.5, reps: 10 }, { weight: 25, reps: 8 }] },
      ],
      startedAt: new Date("2023-10-03T15:00:00"),
      finishedAt: new Date("2023-10-03T16:15:00"),
    },
    // Add more mock workouts as needed
  ]
};

const GymAnalytics: React.FC = () => {
  // Calculate total workouts
  const totalWorkouts = mockUserWorkouts.workouts.length;

  // Calculate average workout duration
  const averageWorkoutDuration = mockUserWorkouts.workouts.reduce((acc, workout) => {
    if (workout.finishedAt) {
      return acc + (workout.finishedAt.getTime() - workout.startedAt.getTime());
    }
    return acc;
  }, 0) / totalWorkouts / (1000 * 60); // Convert to minutes

  // Calculate total weight lifted
  const totalWeightLifted = mockUserWorkouts.workouts.reduce((acc, workout) => {
    return acc + workout.exercises.reduce((exerciseAcc, exercise) => {
      return exerciseAcc + exercise.sets.reduce((setAcc, set) => {
        return setAcc + (set.weight * set.reps);
      }, 0);
    }, 0);
  }, 0);

  // Prepare data for charts
  const workoutDurationData = mockUserWorkouts.workouts.map(workout => ({
    name: workout.name,
    duration: workout.finishedAt ? (workout.finishedAt.getTime() - workout.startedAt.getTime()) / (1000 * 60) : 0
  }));

  const exerciseFrequencyData = mockUserWorkouts.workouts.reduce((acc, workout) => {
    workout.exercises.forEach(exercise => {
      if (acc[exercise.name]) {
        acc[exercise.name]++;
      } else {
        acc[exercise.name] = 1;
      }
    });
    return acc;
  }, {} as Record<string, number>);

  const exerciseFrequencyChartData = Object.entries(exerciseFrequencyData).map(([name, value]) => ({ name, value }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="p-4 space-y-6">
      <Navigation />
      <h1 className="text-3xl font-bold mb-6">Gym Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalWorkouts}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Avg. Workout Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{averageWorkoutDuration.toFixed(2)} min</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Weight Lifted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalWeightLifted.toFixed(2)} kg</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workout Duration</CardTitle>
          <CardDescription>Duration of each workout session</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              duration: {
                label: "Duration",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workoutDurationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="duration" fill="var(--color-duration)" name="Duration (minutes)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exercise Frequency</CardTitle>
          <CardDescription>Number of times each exercise was performed</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{
              duration: {
                label: "Duration",
                color: "hsl(var(--chart-1))",
              },
            }} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={exerciseFrequencyChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {exerciseFrequencyChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default GymAnalytics;