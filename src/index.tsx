import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import './index.css';
import App from './views/App';
import reportWebVitals from './reportWebVitals';
import Event from "./views/Event";
import Recording from "./views/Recording";
import Register from "./views/Register";
import Results from "./views/Results";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/event",
        element: <Event />
    },
    {
        path: "/admin",
        element: <Recording />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/results",
        element: <Results />
    }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
