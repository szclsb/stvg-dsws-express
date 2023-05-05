import React, {useEffect, useState} from "react";
import {
    Alert,
    AlertColor,
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Snackbar,
    Stack
} from "@mui/material";
import {Run, RunPlanning} from "../../models/dto";
import {Client, Method} from "../../client";
import Tracks from "../../components/Tracks";
import '../../main.css';
import {Add} from "@mui/icons-material";
import PlanningForm from "../../forms/PlanningForm";
import {EventConfig, validateEventConfig} from "../../models/event-config";
import {WithID} from "../../models/models";
import {extendWithId} from "../../validation/validation-utils";
import {Planning} from "../../models/run";

const eventClient = new Client("/api/v1/event-config");
const planningClient = new Client("/api/v1/planning");

function EventPlanningTab(props: { active: boolean }) {
    const [config, setConfig] = useState<EventConfig>(undefined);
    const [runs, setRuns] = useState<RunPlanning[]>([]);
    const [notification, setNotification] = useState<{
        show: boolean,
        message: string,
        severity: AlertColor
    }>({
        show: false,
        message: "",
        severity: "info"
    });
    const [planningForm, setPlanningForm] = useState<{
        show: boolean,
        registrations?: RunPlanning[]
    }>({
        show: false
    })

    useEffect(() => {
        if (props.active) {
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
            planningClient.fetch<RunPlanning[]>(Method.GET, {
                validation: body => Promise.resolve(body as RunPlanning[]),
                path: `app`
            })
                .then(data => setRuns(data))
                .catch(err => console.warn(err));
        }
    }, [props])

    const onAutoPlanning = async () => {
        planningClient.fetch<RunPlanning[]>(Method.POST, {
            path: `auto`
        })
            .then(data => setRuns(data))
            .catch(err => console.warn(err));
    }

    const onFormClose = () => {
        setPlanningForm({
            show: false
        });
    }

    const onPlanningsSave = (plannings: Planning[]) => {
        console.log("")
    }

    const onNotificationClose = () => setNotification({
        show: false,
        message: notification.message,
        severity: notification.severity
    });

    return !props.active ? undefined : (
        <Stack spacing={2}>
            <Box display="flex"
                 justifyContent="space-between"
                 alignItems="center">
                <h3>Anlass Planung</h3>
                <IconButton onClick={() => setPlanningForm({show: true})}>
                    <Add color="primary"/>
                </IconButton>
            </Box>
            <div className="scroll-area-x">
                <Tracks topHeaderHeight={2} leftHeaderWidth={6} itemHeight={6} itemWidth={12} tracks={4}
                        plannings={runs}/>
            </div>
            <Button disabled={true} onClick={onAutoPlanning} variant="contained" color="primary">Automatisch
                planen</Button>

            <Snackbar open={notification.show} autoHideDuration={5000} onClose={onNotificationClose}>
                <Alert severity={notification.severity} sx={{width: '100%'}}>
                    {notification.message}
                </Alert>
            </Snackbar>
            <Dialog open={planningForm.show} onClose={onFormClose}>
                <DialogTitle>Planungsgruppe</DialogTitle>
                <DialogContent>
                    <PlanningForm year={config?.date.year}
                                  tracks={config?.tracks}
                                  disciplines={config?.disciplines}
                                  registrations={[]}
                                  onSave={onPlanningsSave}
                                  onCancel={onFormClose}/>
                </DialogContent>
            </Dialog>
        </Stack>
    );
}

export default EventPlanningTab;
