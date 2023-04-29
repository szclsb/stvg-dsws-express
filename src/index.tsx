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

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
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
