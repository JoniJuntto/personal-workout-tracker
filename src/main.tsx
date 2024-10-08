import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import AddExercise from './pages/AddExercise.tsx';
import Analyze from './pages/Analyze.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Workout from './pages/Workout.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/add-exercise",
    element: <AddExercise />,
  },
  {
    path: "/analyze",
    element: <Analyze />,
  },
  {
    path: "/workout",
    element: <Workout />,
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
