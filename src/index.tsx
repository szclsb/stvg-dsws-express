import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import RecordingView from "./views/RecordingView";
import RegisterView from "./views/RegisterView";
import ResultsView from "./views/ResultsView";
import EventView from "./views/config/EventView";
import {LoginView} from "./views/LoginView";
import {Header} from "./components/Header";
import {AuthProvider, RequireAuth} from "./auth";
import WelcomeView from "./views/WelcomeView";

const router = createBrowserRouter([
    {
        path: "/",
        element: <WelcomeView/>,
    },
    {
        path: "/login",
        element: <LoginView/>,
    },
    {
        path: "/event",
        element: <RequireAuth>
            <EventView/>
        </RequireAuth>
    },
    {
        path: "/admin",
        element: <RequireAuth>
            <RecordingView/>
        </RequireAuth>
    },
    {
        path: "/register",
        element: <RequireAuth>
            <RegisterView/>
        </RequireAuth>
    },
    {
        path: "/results",
        element: <RequireAuth>
            <ResultsView/>
        </RequireAuth>
    }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <AuthProvider>
            <Header title="De schnellst Wasserschlössler"/>
            <RouterProvider router={router}/>
        </AuthProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
