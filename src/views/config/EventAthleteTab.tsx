import React, {useEffect, useState} from "react";
import '../../main.css';
import {
    Alert,
    AlertColor,
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    Snackbar,
    Stack
} from "@mui/material";
import {Add} from "@mui/icons-material";
import {Athlete} from "../../models/athlete";
import EditableListItem from "../../components/EditableListItem";
import {AthleteItem} from "../../components/AthleteItem";
import {AthleteForm} from "../../forms/AthleteForm";
import {Client, Method} from "../../client";
import {WithID} from "../../models/models";
import StartNumberPicker from "../../components/StartNumberPicker";


const athleteClient = new Client("/api/v1/athletes");

function EventAthleteTab(props: { active: boolean }) {
    const [edit, setEdit] = useState<boolean>(true);
    const [year, setYear] = useState<number>(2023); // fixme
    const [athletes, setAthletes] = useState<WithID<Athlete>[]>([]);
    const [notification, setNotification] = useState<{
        show: boolean,
        message: string,
        severity: AlertColor
    }>({
        show: false,
        message: "",
        severity: "info"
    });
    const [athleteForm, setAthleteForm] = useState<{
        show: boolean,
        index: number,
        source?: Athlete
        id?: string
    }>({
        show: false,
        index: -1,
    });

    useEffect(() => {
        athleteClient.fetch<WithID<Athlete>[]>(Method.GET).then(data => {
            setAthletes(data)
        }).catch(err => {
            console.warn(err);
            setNotification({
                show: true,
                message: "Laden fehlgeschlagen.",
                severity: "error"
            })
        });
    }, [])

    const onAthleteFormOpen = (index: number, athlete?: WithID<Athlete>) => setAthleteForm({
        show: true,
        index,
        source: athlete,
        id: athlete?._id
    });
    const onAthleteFormClose = () => setAthleteForm({
        show: false,
        index: -1,
    });

    const onSaveAthlete = (athelete: Athlete, id: string, index: number) => {
        if (index < 0) {
            // new
            const insert: WithID<Athlete> = athelete;
            athleteClient.fetch<Athlete>(Method.POST, undefined, athelete, location => {
                insert._id = location.substring(location.lastIndexOf('/') + 1)
            }).then(() => {
                setNotification({
                    show: true,
                    message: "Athlet:in erfolgreich gespeichert",
                    severity: "success"
                });
                setAthletes([...athletes, insert]);
            }).catch(err => {
                console.warn(err);
                setNotification({
                    show: true,
                    message: "Speichern fehlgeschlagen.",
                    severity: "error"
                });
            });
        } else {
            // edit
            const update: WithID<Athlete> = athelete;
            athleteClient.fetch<Athlete>(Method.PUT, id, athelete).then(() => {
                setNotification({
                    show: true,
                    message: "Athlet:in erfolgreich gespeichert",
                    severity: "success"
                });
                const athletesCopy = [...athletes];
                update._id = id;
                athletesCopy[index] = update;
                setAthletes(athletesCopy)
            }).catch(err => {
                console.warn(err);
                setNotification({
                    show: true,
                    message: "Speichern fehlgeschlagen.",
                    severity: "error"
                });
            });
        }
        onAthleteFormClose();
    };

    const onDeleteAthlete = (index: number) => {
        const athletesCopy = [...athletes];
        const remove = athletesCopy.splice(index, 1)[0];
        athleteClient.fetch<Athlete>(Method.DELETE, remove._id).then(() => {
            setNotification({
                show: true,
                message: "Athlet:in erfolgreich gelöscht",
                severity: "success"
            });
            setAthletes(athletesCopy)
        }).catch(err => {
            console.warn(err);
            setNotification({
                show: true,
                message: "Löschen fehlgeschlagen.",
                severity: "error"
            });
        });
    }

    const onNotificationClose = () => setNotification({
        show: false,
        message: notification.message,
        severity: notification.severity
    });

    return !props.active ? undefined : (<Stack spacing={2}>
        <h3>Anlass Konfiguration</h3>
        <List subheader={<Box display="flex"
                              justifyContent="space-between"
                              alignItems="center">
            <div>Athlet:innen</div>
            {!edit ? undefined : <IconButton onClick={() => onAthleteFormOpen(-1, undefined)}>
                <Add color="primary"/>
            </IconButton>}
        </Box>}>
            {athletes?.map((athlete, i) => <div>
                <ListItem sx={{width: 1}}>
                    <EditableListItem edit={edit}
                                      onDelete={() => onDeleteAthlete(i)}
                                      onEdit={() => onAthleteFormOpen(i, athlete)}>
                        <AthleteItem athlete={athlete} age={year - athlete.yearOfBirth}/>
                        <StartNumberPicker startNumber={athlete.startNumber} onAssign={(startNumber) => {
                            athleteClient.fetch<any>(Method.PUT, `${athlete._id}/start-number`, {startNumber})
                                .then(() => {
                                    setNotification({
                                        show: true,
                                        message: "Startnummer erfolgreich gespeichert",
                                        severity: "success"
                                    });
                                    athlete.startNumber = startNumber;
                                    setAthletes([...athletes])
                                }).catch(err => {
                                console.warn(err);
                                setNotification({
                                    show: true,
                                    message: "Startnummer speichern fehlgeschlagen.",
                                    severity: "error"
                                });
                            })
                        }}/>
                    </EditableListItem>
                </ListItem>
            </div>)}
        </List>
        <Snackbar open={notification.show} autoHideDuration={5000} onClose={onNotificationClose}>
            <Alert severity={notification.severity} sx={{width: '100%'}}>
                {notification.message}
            </Alert>
        </Snackbar>
        <Dialog open={athleteForm.show} onClose={onAthleteFormClose}>
            <DialogTitle>Athlet:in</DialogTitle>
            <DialogContent>
                <AthleteForm source={athleteForm.source}
                             onSave={(athlete) => onSaveAthlete(athlete, athleteForm.id, athleteForm.index)}
                             onCancel={onAthleteFormClose}/>
            </DialogContent>
        </Dialog>
    </Stack>);
}

export default EventAthleteTab;
