import {Box, Button, Stack, TextField} from "@mui/material";
import React, {ChangeEvent, useState} from "react";
import {Client, Method} from "../client";
import {Buffer} from 'buffer'

const client = new Client("/api/login");

export function LoginView() {
    const [account, setAccount] = useState<string>();
    const [password, setPassword] = useState<string>();

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
        }).catch(err => console.error(err));
    }

    return (<Box alignContent="center" sx={{ m: 2 }}>
        <Stack spacing={2} maxWidth={0.5}>
            <TextField label="Account" value={account} onChange={onAccountChange} />
            <TextField label="Passwort" type="password" value={password} onChange={onPasswordChange} />
            <Button onClick={login}>Anmelden</Button>
        </Stack>
    </Box>);
}
