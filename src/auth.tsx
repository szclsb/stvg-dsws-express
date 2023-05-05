import {jsx} from "@emotion/react";
import JSX = jsx.JSX;
import {Navigate, useLocation} from "react-router-dom";
import React, {createContext, Dispatch, SetStateAction, useContext, useEffect, useState} from "react";

export interface Auth {
    apiKey?: string;
}
export const Auth = createContext<{
    auth: Auth,
    setAuth: (auth: Auth) => any
}>(null);

export function AuthProvider(props: {children: JSX.Element[]}): JSX.Element {
    const [auth, setAuth] = useState<Auth>({})

    useEffect(() => {
        setAuth({
            apiKey: localStorage.getItem('api-key')
        })
    }, [])

    return <Auth.Provider value={{auth, setAuth}}>{props.children}</Auth.Provider>;
}

export function RequireAuth(props: { children: JSX.Element }): JSX.Element {
    const {auth} = useContext(Auth);
    const location = useLocation()
    if (!auth.apiKey) {
        return <Navigate to="/login" state={{from: location }} />
    }
    return props.children;
}

export function RequireNonAuth(props: { children: JSX.Element }): JSX.Element {
    const {auth} = useContext(Auth);
    const location = useLocation()
    const to = location.state?.from?.pathname || "/";

    if (auth.apiKey) {
        // Navigate to the "from" page (or home page) and reset the state.
        return <Navigate to={to} state={{}} />
    }
    return props.children;
}
