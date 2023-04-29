import {Discipline} from "../models/event-config";
import {ChangeEvent, useState} from "react";
import {Box, Button, Stack, TextField} from "@mui/material";
import React from "react";


export function DisciplineForm(props: {
    source: Discipline,
    onSave: (discipline: Discipline) => void,
    onCancel: () => void
}) {
    const [disciplineName, setDisciplineName] = useState<string>(props.source?.name);
    const [disciplineMinRegistrations, setDisciplineMinRegistration] = useState<number>(props.source?.minRegistrations);
    const [disciplineMaxRegistrations, setDisciplineMaxRegistration] = useState<number>(props.source?.maxRegistrations);

    const onDisciplineNameChange = (e: ChangeEvent<HTMLInputElement>) => setDisciplineName(e.target.value);
    const onDisciplineMinRegistrations = (e: ChangeEvent<HTMLInputElement>) => setDisciplineMinRegistration(Number.parseInt(e.target.value, 10));
    const onDisciplineMaxRegistrations = (e: ChangeEvent<HTMLInputElement>) => setDisciplineMaxRegistration(Number.parseInt(e.target.value, 10));

    return (<Stack spacing={2}>
        <TextField label="Name" fullWidth={true} onChange={onDisciplineNameChange}/>
        <TextField label="Min Registrierungen" type="number" fullWidth={true} onChange={onDisciplineMinRegistrations}/>
        <TextField label="Max Registrierungen" type="number" fullWidth={true} onChange={onDisciplineMaxRegistrations}/>
        <Box display="flex"
             justifyContent="space-between"
             alignItems="center">
            <Button variant="outlined" color="error" onClick={props.onCancel}>Abbrechen</Button>
            <Button variant="contained" color="success" onClick={() => props.onSave({
                name: disciplineName,
                minRegistrations: disciplineMinRegistrations,
                maxRegistrations: disciplineMaxRegistrations,
                categories: []
            })}>Speichern</Button>
        </Box>
    </Stack>);
}
