import React, {ChangeEvent, useEffect, useState} from 'react';
import {EventConfig} from "../models/event-config";
import {Client, Method} from "../client";
import {
    Alert, AlertColor,
    Box,
    Button,
    Collapse, IconButton,
    List,
    ListItem,
    ListItemText,
    Snackbar,
    Stack,
    Tab,
    Tabs,
    TextField
} from "@mui/material";
import {Add, Edit, Delete} from '@mui/icons-material';
import {Discipline} from "../models/discipline";
import Tracks from "../components/Tracks";
import {RunPlanning} from "../models/dto";
import '../main.css';
import {displaySex} from "../ui-utils";

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
    const [notification, setNotification] = useState<{
        show: boolean,
        message: string,
        severity: AlertColor
    }>({
        show: false,
        message: "",
        severity: "info"
    });

    useEffect(() => {
        if (props.active) {
            fetchData();
        }
    }, [props]);

    const fetchData = () => {
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

    const onEdit = () => setEdit(true);
    const onCancel = () => {
        fetchData();
        setEdit(false);
    }
    const onConfirm = () => {
        eventClient.fetch<EventConfig>(Method.PUT, "63eea5bbc350bea3d7ada318", {
            eventName,
            tracks: eventTracks
        }).then(_ => setNotification({
            show: true,
            message: "Änderungen erfolgreich gespeichert",
            severity: "success"
        }))
            .catch(err => {
                console.warn(err);
                setNotification({
                    show: true,
                    message: "Änderungen können nicht gespeichert werden",
                    severity: "error"
                })
                fetchData();
            });
        setEdit(false);
    }

    const onEventNameChange = (e: ChangeEvent<HTMLInputElement>) => setEventName(e.target.value);
    const onEventTracksChange = (e: ChangeEvent<HTMLInputElement>) => setEventTracks(Number.parseInt(e.target.value, 10));

    const onNotificationClose = () => setNotification({
        show: false,
        message: notification.message,
        severity: notification.severity
    });

    const onAddDiscipline = () => {
        console.log("test")
    }

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
            <TextField label="Bahnen" value={eventTracks} type="number" onChange={onEventTracksChange}
                       InputLabelProps={{
                           shrink: true
                       }} InputProps={{
                disabled: !edit,
            }}/>

            <List subheader={<Box display="flex"
                                  justifyContent="space-between"
                                  alignItems="center">
                <div>Disziplinen</div>
                {!edit ? undefined : <IconButton onClick={onAddDiscipline}>
                    <Add color="primary"/>
                </IconButton>}
            </Box>}>
                {disciplines?.map(discipline => <div>
                    <ListItem sx={{width: 1}}>
                        <Stack sx={{
                            border: '0.1em solid black',
                            borderRadius: '1em',
                            padding: '1em',
                            width: 1
                        }}>
                            <Box display="flex"
                                 justifyContent="space-between"
                                 alignItems="center">
                                <div>{discipline.name}</div>
                                {!edit ? undefined : <Stack direction="row">
                                    <IconButton><Delete color="error"/></IconButton>
                                    <IconButton><Edit color="secondary"/></IconButton>
                                    <IconButton><Add color="primary"/></IconButton>
                                </Stack>}
                            </Box>
                            <div>{discipline.minRegistrations ?? 0} - {discipline.maxRegistrations ?? "∞"} erforderliche
                                Anmeldungen
                            </div>
                        </Stack>
                    </ListItem>
                    <Collapse in={true}>
                        <List disablePadding>
                            {discipline.categories?.map(cat => <ListItem sx={{
                                width: 1
                            }}>
                                <Stack sx={{
                                    ml: 4,
                                    border: '0.1em solid black',
                                    borderRadius: '1em',
                                    padding: '1em',
                                    width: 1
                                }}>
                                    <Box display="flex"
                                         justifyContent="space-between"
                                         alignItems="center">
                                        <div>{cat.name}</div>
                                        {!edit ? undefined : <Stack direction="row">
                                            <IconButton><Delete color="error"/></IconButton>
                                            <IconButton><Edit color="secondary"/></IconButton>
                                        </Stack>}
                                    </Box>
                                    <div>{displaySex(cat.sex) ?? "Offen"}: {cat.minAge ?? 0} - {cat.maxAge ?? "∞"}</div>
                                    <div>{cat.distance}m</div>
                                </Stack>
                            </ListItem>)}
                        </List>
                    </Collapse>
                </div>)}
            </List>
            {footer}
            <Snackbar open={notification.show} autoHideDuration={5000} onClose={onNotificationClose}>
                <Alert severity={notification.severity} sx={{width: '100%'}}>
                    {notification.message}
                </Alert>
            </Snackbar>
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
