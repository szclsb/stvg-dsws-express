import {Box, Button, MenuItem, Select, SelectChangeEvent, Stack, TextField} from "@mui/material";
import React, {useState} from "react";
import {Category, Discipline} from "../models/event-config";


export function SingleRegistrationForm(props: {disciplines: Discipline[], onSave: (discipline: Discipline, category?: Category) => any, onCancel: () => any}) {
    const [discipline, setDiscipline] = useState<Discipline>(undefined);
    const [category, setCategory] = useState<Category>(undefined);

    const onDisciplineChange = (event: SelectChangeEvent) => {
        const index = Number.parseInt(event.target.value as string, 10);
        setDiscipline(props.disciplines[index])
        setCategory(undefined);
    };

    const onCategoryChange = (event: SelectChangeEvent) => {
        const index = Number.parseInt(event.target.value as string, 10);
        setCategory(discipline.categories[index]);
    };

    return (<Stack spacing={2}>
        <Select label="Diszipline" onChange={onDisciplineChange} value={discipline?.name}>
            {props.disciplines.map((d, i) => <MenuItem value={i}>{d.name}</MenuItem>)}
        </Select>
        <Select label="Kategorie" disabled={!discipline?.categories || discipline.categories.length === 0} onChange={onCategoryChange} value={category?.name}>
            {discipline?.categories.map((c, i) => <MenuItem value={i}>{c.name}</MenuItem>)}
        </Select>
        <Box display="flex"
             justifyContent="space-between"
             alignItems="center">
            <Button variant="outlined" color="error" onClick={props.onCancel}>Abbrechen</Button>
            <Button variant="contained" color="success" onClick={() => props.onSave(discipline, category)}>Speichern</Button>
        </Box>
    </Stack>);
}
