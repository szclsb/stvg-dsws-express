import {Alert, AlertColor, Box, Button, Snackbar, Stack, TextField} from "@mui/material";
import React, {ChangeEvent, useState} from "react";
import {Client, Method} from "../client";
import {Buffer} from 'buffer'

const client = new Client("/api/login");

export function LoginView() {
    const [account, setAccount] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [notification, setNotification] = useState<{
        show: boolean,
        message?: string,
        severity?: AlertColor
    }>({
        show: false
    });

    const onAccountChange = (e: ChangeEvent<HTMLInputElement>) => setAccount(e.target.value);
    const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

    const login = () => {
        client.fetch<{apiKey: string}>(Method.POST, {
            validation: body => Promise.resolve(body as {apiKey: string}),
            headers: {
                "Authorization": `Basic ${Buffer.from(`${account}:${password}`, 'utf8').toString('base64')}`
            }
        }).then(data => {
            localStorage.setItem('api-key', data.apiKey);
            setNotification({
                show: true,
                message: "Erfolgreich eingeloggt",
                severity: "success"
            });
        }).catch(err => {
            console.error(err);
            setNotification({
                show: true,
                message: `Login fehlgeschlagen: ${err.message}`,
                severity: "success"
            });
        });
    }

    const onNotificationClose = () => setNotification({
        show: false
    });

    return (<Box alignContent="center" sx={{ m: 2 }}>
        <Stack spacing={2} maxWidth={0.5}>
            <TextField label="Account" value={account} onChange={onAccountChange} />
            <TextField label="Passwort" type="password" value={password} onChange={onPasswordChange} />
            <Button onClick={login}>Anmelden</Button>
        </Stack>
        <Snackbar open={notification.show} autoHideDuration={5000} onClose={onNotificationClose}>
        <Alert severity={notification.severity} sx={{width: '100%'}}>
            {notification.message}
        </Alert>
    </Snackbar>
    </Box>);
}
