import React, {ChangeEvent, useEffect, useState} from 'react';
import {EventConfig} from "../models/event-config";
import {Client, Method} from "../client";
import {
    Alert, AlertColor,
    Box,
    Button,
    Collapse, Dialog, DialogContent, DialogContentText, DialogTitle, IconButton,
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
import {Category, Discipline} from "../models/discipline";
import Tracks from "../components/Tracks";
import {RunPlanning} from "../models/dto";
import '../main.css';
import {displaySex} from "../ui-utils";
import {DisciplineForm} from "../components/DisciplineForm";
import {ItemState} from "../models/models";
import {DisciplineListItem} from "../components/DisciplineListItem";
import {CategoryForm} from "../components/CategoryForm";
import {CategoryListItem} from "../components/CategoryListItem";

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
    const [disciplines, setDisciplines] = useState<Discipline[]>([]);
    const [notification, setNotification] = useState<{
        show: boolean,
        message: string,
        severity: AlertColor
    }>({
        show: false,
        message: "",
        severity: "info"
    });
    const [disciplineForm, setDisciplineForm] = useState<{
        show: boolean,
        index: number,
        source: Discipline
    }>({
        show: false,
        index: -1,
        source: undefined
    });
    const [categoryForm, setCategoryForm] = useState<{
        show: boolean,
        indexCategory: number,
        indexDiscipline: number
        source: Category
    }>({
        show: false,
        indexCategory: -1,
        indexDiscipline: -1,
        source: undefined
    });

    //todo usestate
    const stateMap: Map<number, ItemState> = new Map();

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
            .then(data => setDisciplines(data))
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

    const onDisciplineFormOpen = (discipline: Discipline, index: number) => setDisciplineForm({
        show: true,
        index,
        source: discipline
    });

    const onCategoryFormOpen = (category: Category, indexCategory: number, indexDiscipline: number) => setCategoryForm({
        show: true,
        indexCategory,
        indexDiscipline,
        source: category
    });

    const onDisciplineFormClose = () => setDisciplineForm({
        show: false,
        index: -1,
        source: undefined
    });

    const onCategoryFormClose = () => setCategoryForm({
        show: false,
        indexCategory: -1,
        indexDiscipline: -1,
        source: undefined
    });

    const onSaveDiscipline = (discipline: Discipline, index: number) => {
        let data: Discipline[] = [];
        if (index < 0) {
            // new
            data = [...disciplines, discipline];
            stateMap.set(index, "CREATED")
            console.debug(`Added internal discipline ${discipline.name}`)
        } else {
            // edit
            data = [...disciplines];
            stateMap.set(index, "EDITED")
        }
        setDisciplines(data);
        onDisciplineFormClose();
    };

    const onSaveCategory = (category: Category, indexCategory: number, indexDiscipline: number) => {
        const discipline = disciplines[indexDiscipline];
        if (indexCategory < 0) {
            // new
            discipline.categories = [...discipline.categories, category];
            if (stateMap.get(indexDiscipline) === undefined) {
                stateMap.set(indexDiscipline, "EDITED")
            }
            console.debug(`Added internal category ${category.name} to discipline ${discipline.name}`)
        } else {
            // edit
            discipline.categories[indexCategory] = category;
            if (stateMap.get(indexDiscipline) === undefined) {
                stateMap.set(indexDiscipline, "EDITED")
            }
        }
        setDisciplines([...disciplines]);
        onCategoryFormClose();
    };

    const onDeleteDiscipline = (index: number) => {
        const data = [...disciplines];
        if (stateMap.get(index) !== "CREATED") {
            stateMap.set(index, "DELETED");
        } else {
            data.splice(index, 1);
        }
        setDisciplines(data);
    }

    const onDeleteCategory = (indexCategory: number, indexDiscipline: number) => {
        const discipline = disciplines[indexDiscipline];
        discipline.categories.splice(indexCategory, 1)
        if (stateMap.get(indexDiscipline) === undefined) {
            stateMap.set(indexDiscipline, "EDITED")
        }
        setDisciplines([...disciplines]);
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
                {!edit ? undefined : <IconButton onClick={() => onDisciplineFormOpen(undefined, -1)}>
                    <Add color="primary"/>
                </IconButton>}
            </Box>}>
                {disciplines?.map((discipline, i) => <div>
                    <ListItem sx={{width: 1}}>
                        <DisciplineListItem show={stateMap.get(i) !== "DELETED"}
                                            edit={edit}
                                            discipline={discipline}
                                            onDelete={() => onDeleteDiscipline(i)}
                                            onEdit={() => onDisciplineFormOpen(discipline, i)}
                                            onCategoryAdd={() => onCategoryFormOpen(undefined, -1, i)}/>
                    </ListItem>
                    {stateMap.get(i) === "DELETED" ? undefined : <Collapse in={true}>
                        <List disablePadding>
                            {discipline.categories?.map((cat, j) => <ListItem sx={{
                                width: 1
                            }}>
                                <CategoryListItem show={true}
                                                  edit={edit}
                                                  category={cat}
                                                  onDelete={() => onDeleteCategory(j, i)}
                                                  onEdit={() => onCategoryFormOpen(cat, j, i)} />
                            </ListItem>)}
                        </List>
                    </Collapse>}
                </div>)}
            </List>
            {footer}
            <Snackbar open={notification.show} autoHideDuration={5000} onClose={onNotificationClose}>
                <Alert severity={notification.severity} sx={{width: '100%'}}>
                    {notification.message}
                </Alert>
            </Snackbar>
            <Dialog open={disciplineForm.show} onClose={onDisciplineFormClose}>
                <DialogTitle>Disziplin</DialogTitle>
                <DialogContent>
                    <DisciplineForm source={disciplineForm.source}
                                    onSave={(discipline) => onSaveDiscipline(discipline, disciplineForm.index,)}
                                    onCancel={onDisciplineFormClose}/>
                </DialogContent>
            </Dialog>
            <Dialog open={categoryForm.show} onClose={onCategoryFormClose}>
                <DialogTitle>Kategorie</DialogTitle>
                <DialogContent>
                    <CategoryForm source={categoryForm.source}
                                  onSave={(category) => onSaveCategory(category, categoryForm.indexCategory, categoryForm.indexDiscipline)}
                                  onCancel={onCategoryFormClose}/>
                </DialogContent>
            </Dialog>
        </Stack>
    );
}

function RegistrationTab(props: {
    active: boolean
}) {
    const [plannings, setPlannings] = useState<RunPlanning[]>([]);
}


function PlanningTab(props: {
    active: boolean
}) {
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
