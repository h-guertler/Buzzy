import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import EventDetailPage from '../components/EventDetailPage';
import Layout from './Layout';
import ProfilePage from "../components/ProfilePage";
import LandingPage from '../components/LandingPage';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "/users/:userId",
        element: <ProfilePage/>
      },
      {
        path: "/events/:eventId",
        element: <EventDetailPage />
      },
      {
        path: "/users/:userId",
        element: <ProfilePage />
      },
      {
        path: "*",
        element: <h1>Page not found</h1>
      }
    ],
  },
]);
