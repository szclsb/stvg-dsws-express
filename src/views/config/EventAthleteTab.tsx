import React, {useEffect, useState} from "react";
import '../../main.css';
import {
    Alert,
    AlertColor,
    Box, Chip,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    Snackbar,
    Stack
} from "@mui/material";
import {Add, Label} from "@mui/icons-material";
import {Athlete, validateAthlete} from "../../models/athlete";
import EditableListItem from "../../components/EditableListItem";
import {AthleteItem} from "../../components/AthleteItem";
import {AthleteForm} from "../../forms/AthleteForm";
import {Client, Method} from "../../client";
import {WithID} from "../../models/models";
import StartNumberPicker from "../../components/StartNumberPicker";
import {Registration, validateRegistration} from "../../models/registration";
import {SingleRegistrationForm} from "../../forms/SingleRegistrationForm";
import {Category, Discipline, EventConfig, validateEventConfig} from "../../models/event-config";
import {ObjectId} from "bson";
import {validateArray, extendWithId, extendArray} from "../../validation/validation-utils";


const eventClient = new Client("/api/v1/event-config");
const athleteClient = new Client("/api/v1/athletes");
const registrationClient = new Client("/api/v1/registrations");

function EventAthleteTab(props: { active: boolean }) {
    const [edit, setEdit] = useState<boolean>(true);
    const [config, setConfig] = useState<EventConfig>(undefined);
    const [athletes, setAthletes] = useState<WithID<Athlete>[]>([]);
    const [registrations, setRegistrations] = useState<WithID<Registration>[]>([]);
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
        id?: ObjectId
    }>({
        show: false,
        index: -1,
    });
    const [singleRegistrationForm, setSingleRegistrationForm] = useState<{
        show: boolean,
        athlete?: WithID<Athlete>
    }>({
        show: false
    });

    useEffect(() => {
        eventClient.fetch<WithID<EventConfig>>(Method.GET, {
            validation: extendWithId(validateEventConfig),
            path: "63eea5bbc350bea3d7ada318"
        })
            .then(data => {
                setConfig(data)
            })
            .catch(err => {
                console.warn(err)
                setNotification({
                    show: true,
                    message: "Konfiguration laden fehlgeschlagen.",
                    severity: "error"
                })
            });
        athleteClient.fetch<WithID<Athlete>[]>(Method.GET, {
            validation: extendArray(extendWithId(validateAthlete)),
        }).then(data => {
            setAthletes(data)
        }).catch(err => {
            console.warn(err);
            setNotification({
                show: true,
                message: "Athleten laden fehlgeschlagen.",
                severity: "error"
            })
        });
        registrationClient.fetch<WithID<Registration>[]>(Method.GET, {
            validation: extendArray(extendWithId(validateRegistration)),
        }).then(data => {
            setRegistrations(data)
        }).catch(err => {
            console.warn(err);
            setNotification({
                show: true,
                message: "Registrierungen laden fehlgeschlagen.",
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
    const onSingleRegistrationFormClose = () => setSingleRegistrationForm({
        show: false
    });

    const onSaveAthlete = (athelete: Athlete, id: ObjectId, index: number) => {
        if (index < 0) {
            // new
            const insert: WithID<Athlete> = athelete;
            athleteClient.fetch<Athlete>(Method.POST, {
                body: athelete,
                onLocation: location => {
                    insert._id = new ObjectId(location.substring(location.lastIndexOf('/') + 1))
                }
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
            athleteClient.fetch<Athlete>(Method.PUT, {
                path: id.toHexString(),
                body: athelete
            }).then(() => {
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
                    message: "Athlet:in speichern fehlgeschlagen.",
                    severity: "error"
                });
            });
        }
        onAthleteFormClose();
    };

    const onDeleteAthlete = (index: number) => {
        const athletesCopy = [...athletes];
        const remove = athletesCopy.splice(index, 1)[0];
        athleteClient.fetch<Athlete>(Method.DELETE, {
            path: remove._id.toHexString()
        }).then(() => {
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
                message: "Athlet:in löschen fehlgeschlagen.",
                severity: "error"
            });
        });
    }

    const onNotificationClose = () => setNotification({
        show: false,
        message: notification.message,
        severity: notification.severity
    });

    const onStartNumberAssign = (athlete: WithID<Athlete>, startNumber?: number) => {
        athleteClient.fetch<any>(Method.PUT, {
            path: `${athlete._id.toHexString()}/start-number`,
            body: {startNumber}
        }).then(() => {
            setNotification({
                show: true,
                message: "Startnummer erfolgreich zugeweisen",
                severity: "success"
            });
            athlete.startNumber = startNumber;
            setAthletes([...athletes])
        }).catch(err => {
            console.warn(err);
            setNotification({
                show: true,
                message: "Startnummer zuweisen fehlgeschlagen.",
                severity: "error"
            });
        });
    }

    const onSingleRegistrationSave = (athlete: WithID<Athlete>, discipline: Discipline, category?: Category) => {
        const insert: WithID<Registration> = {
            athleteIds: [new ObjectId(athlete._id)],
            disciplineName: discipline.name,
            categoryName: category?.name
        };
        registrationClient.fetch<any>(Method.POST, {
            body: insert,
            onLocation: location => {
                insert._id = new ObjectId(location.substring(location.lastIndexOf('/') + 1))
            }
        }).then(() => {
            setNotification({
                show: true,
                message: "Einzelregistrierung erfolgreich gespeichert",
                severity: "success"
            });
            setRegistrations([...registrations, insert])
        }).catch(err => {
            console.warn(err);
            setNotification({
                show: true,
                message: "Einzelregistrierung speichern fehlgeschlagen.",
                severity: "error"
            });
        });
    }

    const onSingleRegistrationDelete = (singleRegistration: WithID<Registration>) => {
        const index = registrations.findIndex(r => r._id.equals(singleRegistration._id));
        if (index >= 0) {
            registrationClient.fetch<any>(Method.DELETE, {
                path: singleRegistration._id.toHexString()
            }).then(() => {
                setNotification({
                    show: true,
                    message: "Einzelregistrierung erfolgreich gelöscht.",
                    severity: "success"
                });
                const registrationsCopy = [...registrations];
                registrationsCopy.splice(index, 1);
                setRegistrations(registrationsCopy);
            }).catch(err => {
                console.warn(err);
                setNotification({
                    show: true,
                    message: "Einzelregistrierung löschen fehlgeschlagen.",
                    severity: "error"
                });
            });
        }
    }

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
                    <EditableListItem spacing={2}
                                      edit={edit}
                                      onDelete={() => onDeleteAthlete(i)}
                                      onEdit={() => onAthleteFormOpen(i, athlete)}>
                        <AthleteItem athlete={athlete} age={config.date.year - athlete.yearOfBirth}/>
                        <StartNumberPicker startNumber={athlete.startNumber}
                                           onAssign={(startNumber) => onStartNumberAssign(athlete, startNumber)}/>
                        <List subheader={<Box display="flex"
                                              justifyContent="space-between"
                                              alignItems="center">
                            <div>Einzelanmeldung</div>
                            {!edit ? undefined :
                                <IconButton onClick={() => setSingleRegistrationForm({show: true, athlete})}>
                                    <Add color="primary"/>
                                </IconButton>}
                        </Box>}>
                            {registrations
                                .filter(r => !r.groupName && r.athleteIds[0].equals(athlete._id))
                                .map(r => (<ListItem>
                                    <Chip label={`${r.disciplineName}${r.categoryName ? ` / ${r.categoryName}` : undefined}`} />
                                </ListItem>))}
                        </List>
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
        <Dialog open={singleRegistrationForm.show} onClose={onSingleRegistrationFormClose}>
            <DialogTitle>Einzelregistrierung</DialogTitle>
            <DialogContent>
                <SingleRegistrationForm disciplines={config.disciplines}
                                        onSave={(discipline, category) => onSingleRegistrationSave(singleRegistrationForm.athlete, discipline, category)}
                                        onCancel={onSingleRegistrationFormClose}/>
            </DialogContent>
        </Dialog>
    </Stack>);
}

export default EventAthleteTab;
