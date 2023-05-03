import {
    Box,
    Button,
    Chip,
    List,
    ListItem,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Autocomplete,
    IconButton, Icon
} from "@mui/material";
import React, {ChangeEvent, useState} from "react";
import {Category, Discipline} from "../models/event-config";
import {Athlete} from "../models/athlete";
import {WithID} from "../models/models";
import {AthleteItem} from "../components/AthleteItem";
import {Run} from "../models/dto";
import {Registration} from "../models/registration";
import {Add} from "@mui/icons-material";


export function RegistrationForm(props: {disciplines: Discipline[], onSave: (discipline: Discipline, category?: Category) => any, onCancel: () => any}) {
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
        <Select label="Disziplin" onChange={onDisciplineChange} value={discipline?.name}>
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

export function GroupRegistrationForm(props: {year: number, disciplines: Discipline[], athletes: WithID<Athlete>[], registration?: WithID<Registration>, onSave: (registration: WithID<Registration>) => any, onCancel: () => any}) {
    const pd = props.registration ? props.disciplines?.find(d => props.registration.disciplineName === d.name): undefined;
    const pc = props.registration ? pd?.categories.find(c => props.registration.categoryName === c.name): undefined;
    const pm = props.registration?.athleteIds.map(athleteId => props.athletes.find(a => athleteId.equals(a._id)));

    const [groupName, setGroupName] = useState<string>(props.registration?.groupName);
    const [discipline, setDiscipline] = useState<Discipline>(pd);
    const [category, setCategory] = useState<Category>(pc);
    const [memberSearch, setMemberSearch] = useState<WithID<Athlete>>(undefined);
    const [members, setMembers] = useState<WithID<Athlete>[]>(!pm ? []: pm);

    const onGroupNameChange = (e: ChangeEvent<HTMLInputElement>) => setGroupName(e.target.value);

    const onDisciplineChange = (event: SelectChangeEvent) => {
        const index = Number.parseInt(event.target.value as string, 10);
        setDiscipline(props.disciplines[index])
        setCategory(undefined);
    };

    const onCategoryChange = (event: SelectChangeEvent) => {
        const index = Number.parseInt(event.target.value as string, 10);
        setCategory(discipline.categories[index]);
    };

    const onMemberAdd = () => {
        if (memberSearch) {
            setMembers([...members, memberSearch]);
        }
    }

    const onMemberDelete = (index: number) => {
        const membersCopy = [...members];
        membersCopy.splice(index, 1);
        setMembers(membersCopy);
    }

    return (<Stack spacing={2}>
        <TextField label="Gruppenname" fullWidth={true} onChange={onGroupNameChange} value={groupName}/>
        <Select label="Disziplin" onChange={onDisciplineChange} defaultValue={pd?.name} value={discipline?.name}>
            {props.disciplines.map((d, i) => <MenuItem value={i}>{d.name}</MenuItem>)}
        </Select>
        <Select label="Kategorie" disabled={!discipline?.categories || discipline.categories.length === 0} onChange={onCategoryChange} defaultValue={pc?.name} value={category?.name}>
            {discipline?.categories.map((c, i) => <MenuItem value={i}>{c.name}</MenuItem>)}
        </Select>
        <Box display="flex" flexDirection="row-reverse">
            <IconButton onClick={onMemberAdd}>
                <Add color="primary"/>
            </IconButton>
            <Autocomplete
                disablePortal
                fullWidth={true}
                options={props.athletes}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}, ${option.yearOfBirth}`}
                // renderOption={(p, option) => <AthleteItem athlete={option} age={props.year - option.yearOfBirth} />}
                renderInput={(params) => <TextField {...params} label="Athlet:in" />}
                onChange={(event, value) => setMemberSearch(value)}
            />
        </Box>
        <List>
            {members.map((member, i) => <ListItem>
                <Chip sx={{
                    height: 'auto',
                    '& .MuiChip-label': {
                        display: 'block',
                        whiteSpace: 'normal',
                    },
                }} label={
                    <AthleteItem athlete={member} age={props.year - member.yearOfBirth} />
                } onDelete={() => onMemberDelete(i)}/>
            </ListItem> )}
        </List>
        <Box display="flex"
             justifyContent="space-between"
             alignItems="center">
            <Button variant="outlined" color="error" onClick={props.onCancel}>Abbrechen</Button>
            <Button variant="contained" color="success" onClick={() => props.onSave({
                _id: props.registration?._id,
                groupName,
                disciplineName: discipline.name,
                categoryName: category.name,
                athleteIds: members.map(member => member._id)
            })}>Speichern</Button>
        </Box>
    </Stack>);
}
