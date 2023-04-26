import React, {ChangeEvent, useEffect, useState} from 'react';
import {EventConfig} from "../models/event-config";
import {Client, Method} from "../client";
import {Box, Button, Collapse, List, ListItem, ListItemText, Stack, Tab, Tabs, TextField} from "@mui/material";
import {Discipline} from "../models/discipline";
import {Planning} from "../models/planning";
import {Athlete} from "../models/athlete";
import Tracks from "../components/Tracks";
import {RunPlanning} from "../models/dto";
import '../main.css';

const eventClient = new Client("/api/v1/event-config");
const disciplineClient = new Client("/api/v1/disciplines");
const planningClient = new Client("/api/v1/planning");

function Event() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Stack spacing={2}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Konfiguration"/>
                <Tab label="Anmeldung"/>
                <Tab label="Planung"/>
            </Tabs>
            <Box sx={{p: 1}}>
                <ConfigTab active={value === 0}/>
                <PlanningTab active={value === 1}/>
            </Box>
        </Stack>
    );
}

function ConfigTab(props: { active: boolean }) {
    const [edit, setEdit] = useState<boolean>(false);
    const [eventName, setEventName] = useState<string>(undefined);
    const [eventTracks, setEventTracks] = useState<number>(undefined);
    const [disciplines, setDiscipline] = useState<Discipline[]>(undefined);

    useEffect(() => {
        if (props.active) {
            eventClient.fetch<EventConfig>(Method.GET, "63eea5bbc350bea3d7ada318")
                .then(data => {
                    setEventName(data.eventName);
                    setEventTracks(data.tracks);
                })
                .catch(err => console.warn(err));
            disciplineClient.fetch<Discipline[]>(Method.GET)
                .then(data => setDiscipline(data))
                .catch(err => console.warn(err));
        }
    }, [props]);

    const onEdit = () => setEdit(true);
    const onCancel = () => setEdit(false);
    const onConfirm = () => {
        // todo save
        setEdit(false);
    }

    const onEventNameChange = (e: ChangeEvent<HTMLInputElement>) =>  setEventName(e.target.value);
    const onEventTracksChange = (e: ChangeEvent<HTMLInputElement>) =>  setEventTracks(Number.parseInt(e.target.value, 10));

    const footer = !edit
        ? <Button variant="contained" color="primary" onClick={onEdit}>Bearbeiten</Button>
        : <Box display="flex"
               justifyContent="space-between"
               alignItems="center">
            <Button variant="outlined" color="error" onClick={onCancel}>Zurück</Button>
            <Button variant="contained" color="success" onClick={onConfirm}>Speichern</Button>
        </Box>

    return !props.active ? undefined : (
        <Stack spacing={2}>
            <h3>Anlass Konfiguration</h3>
            <TextField label="Name" value={eventName} onChange={onEventNameChange} InputLabelProps={{
                shrink: true
            }} InputProps={{
                disabled: !edit,
            }}/>
            <TextField label="Bahnen" value={eventTracks} onChange={onEventTracksChange} InputLabelProps={{
                shrink: true
            }} InputProps={{
                disabled: !edit,
            }}/>

            <List subheader="Disziplinen">
                {disciplines?.map(discipline => <div>
                    <ListItem>
                        <ListItemText primary={discipline.name}
                                      secondary={`${discipline.minRegistrations} - ${discipline.maxRegistrations} erforderliche Anmeldungen`}/>
                    </ListItem>
                    <Collapse in={true}>
                        <List disablePadding>
                            {discipline.categories?.map(cat => <ListItem sx={{pl: 4}}>
                                <ListItemText primary={cat.name} secondary={`${cat.distance}m`}/>
                            </ListItem>)}
                        </List>
                    </Collapse>
                </div>)}
            </List>
            {footer}
        </Stack>
    );
}

function RegistrationTab(props: { active: boolean }) {
    const [plannings, setPlannings] = useState<RunPlanning[]>([]);
}


function PlanningTab(props: { active: boolean }) {
    const [plannings, setPlannings] = useState<RunPlanning[]>([]);

    useEffect(() => {
        if (props.active) {
            planningClient.fetch<RunPlanning[]>(Method.GET, `app`)
                .then(data => setPlannings(data))
                .catch(err => console.warn(err));
        }
    }, [props])

    const onAutoPlanning = async () => {
        planningClient.fetch<RunPlanning[]>(Method.POST, `auto`)
            .then(data => setPlannings(data))
            .catch(err => console.warn(err));
    }

    return !props.active ? undefined : (
        <Stack spacing={2}>
            <h3>Anlass Planung</h3>
            <div className="scroll-area-x">
                <Tracks topHeaderHeight={2} leftHeaderWidth={6} itemHeight={6} itemWidth={12} tracks={4}
                        plannings={plannings}/>
            </div>
            <Button onClick={onAutoPlanning} variant="contained" color="primary">Automatisch planen</Button>
        </Stack>
    );
}

export default Event;
