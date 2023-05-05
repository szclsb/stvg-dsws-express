import {Category, Discipline} from "../models/event-config";
import {ChangeEvent, useEffect, useState} from "react";
import {Box, Button, Stack, TextField} from "@mui/material";
import React from "react";
import {Sex} from "../models/athlete";

export function CategoryForm(props: {
    source: Category,
    onSave: (category: Category) => void,
    onCancel: () => void
}) {
    const [categoryName, setCategoryName] = useState<string>(props.source?.name);
    const [categorySex, setCategorySex] = useState<Sex>(props.source?.sex);
    const [categoryMinAge, setCategoryMinAge] = useState<number>(props.source?.minAge);
    const [categoryMaxAge, setCategoryMaxAge] = useState<number>(props.source?.maxAge);
    const [categoryDistance, setCategoryDistance] = useState<number>(props.source?.distance);

    useEffect(() => {
        console.debug(props.source);
        setCategoryName(props.source?.name);
        setCategorySex(props.source?.sex);
        setCategoryMinAge(props.source?.minAge);
        setCategoryMaxAge(props.source?.maxAge);
        setCategoryDistance(props.source?.distance);
    }, [props.source])

    const onCategoryNameChange = (e: ChangeEvent<HTMLInputElement>) => setCategoryName(e.target.value);
    const onCategorySexChange = (e: ChangeEvent<HTMLInputElement>) => setCategorySex(e.target.value as Sex);
    const onCategoryMinAgeChange = (e: ChangeEvent<HTMLInputElement>) => setCategoryMinAge(Number.parseInt(e.target.value, 10));
    const onCategoryMaxAgeChange = (e: ChangeEvent<HTMLInputElement>) => setCategoryMaxAge(Number.parseInt(e.target.value, 10));
    const onCategoryDistanceChange = (e: ChangeEvent<HTMLInputElement>) => setCategoryDistance(Number.parseInt(e.target.value, 10));

    return (<Stack spacing={2}>
        <TextField label="Name" fullWidth={true} onChange={onCategoryNameChange} value={categoryName}/>
        <TextField label="Geschlecht" fullWidth={true} onChange={onCategorySexChange} value={categorySex}/>
        <TextField label="Mindestalter" type="number" fullWidth={true} onChange={onCategoryMinAgeChange} value={categoryMinAge} />
        <TextField label="Maximumalter" type="number" fullWidth={true} onChange={onCategoryMaxAgeChange} value={categoryMaxAge}/>
        <TextField label="Distanz" type="number" fullWidth={true} onChange={onCategoryDistanceChange} value={categoryDistance}/>
        <Box display="flex"
             justifyContent="space-between"
             alignItems="center">
            <Button variant="outlined" color="error" onClick={props.onCancel}>Abbrechen</Button>
            <Button variant="contained" color="success" onClick={() => props.onSave({
                name: categoryName,
                sex: categorySex,
                minAge: categoryMinAge,
                maxAge: categoryMaxAge,
                distance: categoryDistance,
            })}>Speichern</Button>
        </Box>
    </Stack>);
}
