import React, {ChangeEvent, useEffect, useState} from "react";
import {
    Alert,
    AlertColor,
    Box,
    Button,
    Collapse, Dialog, DialogContent, DialogTitle,
    IconButton,
    List,
    ListItem,
    Snackbar,
    Stack,
    TextField
} from "@mui/material";
import {Add} from "@mui/icons-material";
import {EventConfig, Category, Discipline} from "../../models/event-config";
import {Client, Method} from "../../client";
import {CategoryForm} from "../../components/CategoryForm";
import {DisciplineForm} from "../../components/DisciplineForm";
import {CategoryListItem} from "../../components/CategoryListItem";
import {DisciplineListItem} from "../../components/DisciplineListItem";
import '../../main.css';
import {LocalDate} from "../../models/models";

const eventClient = new Client("/api/v1/event-config");

function EventConfigTab(props: { active: boolean }) {
    const [edit, setEdit] = useState<boolean>(false);
    const [eventName, setEventName] = useState<string>(undefined);
    const [eventDate, setEventDate] = useState<LocalDate>(undefined);
    const [tracks, setTracks] = useState<number>(undefined);
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

    useEffect(() => {
        if (props.active) {
            fetchData();
        }
    }, [props]);

    const fetchData = () => {
        eventClient.fetch<EventConfig>(Method.GET, "63eea5bbc350bea3d7ada318")
            .then(data => {
                setEventName(data.name);
                setEventDate(data.date);
                setTracks(data.tracks);
                setDisciplines(data.disciplines);
            })
            .catch(err => console.warn(err));
    }

    const onEdit = () => setEdit(true);
    const onCancel = () => {
        fetchData();
        setEdit(false);
    }
    const onConfirm = () => {
        eventClient.fetch<EventConfig>(Method.PUT, "63eea5bbc350bea3d7ada318", {
            name: eventName,
            date: eventDate,
            tracks,
            disciplines
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
    const onEventTracksChange = (e: ChangeEvent<HTMLInputElement>) => setTracks(Number.parseInt(e.target.value, 10));

    const onNotificationClose = () => setNotification({
        show: false,
        message: notification.message,
        severity: notification.severity
    });

    const onDisciplineFormOpen = (discipline: Discipline, index: number) =>{
        console.debug(`editing discipline at ${index}`)
        console.debug(discipline);
        setDisciplineForm({
            show: true,
            index,
            source: discipline
        });
    }

    const onCategoryFormOpen = (category: Category, indexCategory: number, indexDiscipline: number) => {
        console.debug(`editing category at ${indexCategory} of discipline at ${indexDiscipline}`)
        console.debug(category);
        setCategoryForm({
            show: true,
            indexCategory,
            indexDiscipline,
            source: category
        });
    }

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
        let data: Discipline[];
        if (index < 0) {
            // new
            data = [...disciplines, discipline];
            console.debug(`Added internal discipline ${discipline.name}`)
        } else {
            // edit
            data = [...disciplines];
            discipline.categories = data[index].categories;
            data[index] = discipline;
        }
        setDisciplines(data);
        onDisciplineFormClose();
    };

    const onSaveCategory = (category: Category, indexCategory: number, indexDiscipline: number) => {
        const discipline = disciplines[indexDiscipline];
        if (indexCategory < 0) {
            // new
            discipline.categories = [...discipline.categories, category];
            console.debug(`Added internal category ${category.name} to discipline ${discipline.name}`)
        } else {
            // edit
            discipline.categories[indexCategory] = category;
        }
        setDisciplines([...disciplines]);
        onCategoryFormClose();
    };

    const onDeleteDiscipline = (index: number) => {
        const data = [...disciplines];
        data.splice(index, 1);
        setDisciplines(data);
    }

    const onDeleteCategory = (indexCategory: number, indexDiscipline: number) => {
        const discipline = disciplines[indexDiscipline];
        discipline.categories.splice(indexCategory, 1)
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
            <TextField label="Bahnen" value={tracks} type="number" onChange={onEventTracksChange}
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
                        <DisciplineListItem show={true}
                                            edit={edit}
                                            discipline={discipline}
                                            onDelete={() => onDeleteDiscipline(i)}
                                            onEdit={() => onDisciplineFormOpen(discipline, i)}
                                            onCategoryAdd={() => onCategoryFormOpen(undefined, -1, i)}/>
                    </ListItem>
                    <Collapse in={true}>
                        <List disablePadding>
                            {discipline.categories?.map((cat, j) => <ListItem sx={{
                                width: 1
                            }}>
                                <CategoryListItem show={true}
                                                  edit={edit}
                                                  category={cat}
                                                  onDelete={() => onDeleteCategory(j, i)}
                                                  onEdit={() => onCategoryFormOpen(cat, j, i)}/>
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

export default EventConfigTab;
