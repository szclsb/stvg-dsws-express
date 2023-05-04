import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import './index.css';
import App from './views/App';
import reportWebVitals from './reportWebVitals';
import RecordingView from "./views/RecordingView";
import RegisterView from "./views/RegisterView";
import ResultsView from "./views/ResultsView";
import EventView from "./views/config/EventView";
import {LoginView} from "./views/LoginView";
import {Box, IconButton, Stack} from "@mui/material";
import {Logout} from "@mui/icons-material";

const router = createBrowserRouter([
    {
        path: "/",
        element: <LoginView />,
    },
    {
        path: "/login",
        element: <LoginView />,
    },
    {
        path: "/event",
        element: <EventView />
    },
    {
        path: "/admin",
        element: <RecordingView />
    },
    {
        path: "/register",
        element: <RegisterView />
    },
    {
        path: "/results",
        element: <ResultsView />
    }
]);

const logout = () => {
    localStorage.removeItem('api-key');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Box display="flex"
           justifyContent="space-between"
           alignItems="center">
          <div>De schnellst Wasserschlössler</div>
          <IconButton onClick={logout}>
              <Logout color="primary"/>
          </IconButton>
      </Box>
      <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
