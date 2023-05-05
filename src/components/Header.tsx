import {Alert, AlertColor, Box, IconButton, Snackbar, Stack} from "@mui/material";
import {Logout} from "@mui/icons-material";
import React, {useContext, useState} from "react";
import {Auth} from "../auth";
import {Navigate} from "react-router-dom";


export function Header(props: {title: string}) {
    const {auth, setAuth} = useContext(Auth);
    const [notification, setNotification] = useState<{
        show: boolean,
        message?: string,
        severity?: AlertColor
    }>({
        show: false
    });
    const logout = () => {
        localStorage.removeItem('api-key');
        setAuth({})
        setNotification({
            show: true,
            message: "erfolgreich ausgeloggt",
            severity: "success"
        });
    }

    const onNotificationClose = () => setNotification({
        show: false
    });

    return (<Stack>
        <Box display="flex"
             justifyContent="space-between"
             alignItems="center">
            <div>{props.title}</div>
            <IconButton disabled={!auth?.apiKey} onClick={logout}>
                <Logout color="primary"/>
            </IconButton>
        </Box>
        <Snackbar open={notification.show} autoHideDuration={5000} onClose={onNotificationClose}>
            <Alert severity={notification.severity} sx={{width: '100%'}}>
                {notification.message}
            </Alert>
        </Snackbar>
    </Stack>);
}
