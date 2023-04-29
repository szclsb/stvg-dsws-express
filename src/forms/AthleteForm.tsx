import {ChangeEvent, useEffect, useState} from "react";
import {Box, Button, Stack, TextField} from "@mui/material";
import React from "react";
import {Athlete, Sex} from "../models/athlete";
import SexPicker from "../components/SexPicker";

export function AthleteForm(props: {
    source: Athlete,
    onSave: (athlete: Athlete) => void,
    onCancel: () => void
}) {
    const [firstName, setFirstName] = useState<string>(props.source?.firstName);
    const [lastName, setLastName] = useState<string>(props.source?.lastName);
    const [sex, setSex] = useState<Sex>(props.source?.sex);
    const [yearOfBirth, setYearOfBirth] = useState<number>(props.source?.yearOfBirth);

    useEffect(() => {
        setFirstName(props.source?.firstName);
        setLastName(props.source?.lastName);
        setSex(props.source?.sex);
        setYearOfBirth(props.source?.yearOfBirth);
    }, [props.source])

    const onFirstNameChange = (e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value);
    const onLastNameChange = (e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value);
    const onYearOfBirthChange = (e: ChangeEvent<HTMLInputElement>) => setYearOfBirth(Number.parseInt(e.target.value, 10));

    return (<Stack spacing={2}>
        <TextField label="Vorname" fullWidth={true} onChange={onFirstNameChange} value={firstName}/>
        <TextField label="Nachname" fullWidth={true} onChange={onLastNameChange} value={lastName}/>
        <SexPicker readOnly={false} label="Geschlecht" onChange={setSex} value={sex}/>
        <TextField label="Jahrgang" type="number" fullWidth={true} onChange={onYearOfBirthChange} value={yearOfBirth} />
        <Box display="flex"
             justifyContent="space-between"
             alignItems="center">
            <Button variant="outlined" color="error" onClick={props.onCancel}>Abbrechen</Button>
            <Button variant="contained" color="success" onClick={() => props.onSave({
                firstName,
                lastName,
                sex,
                yearOfBirth,
            })}>Speichern</Button>
        </Box>
    </Stack>);
}
