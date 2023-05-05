import React, {ChangeEvent, useState} from "react";
import {LocalTime, WithID} from "../models/models";
import {Discipline} from "../models/event-config";
import {Registration} from "../models/registration";
import {Autocomplete, Box, Button, Dialog, DialogContent, DialogTitle, Stack, TextField} from "@mui/material";
import LocalTimePicker from "../components/LocalTimePicker";
import {Planning} from "../models/run";
import {GroupRegistrationForm} from "./RegistrationForm";
import {seq} from "../ui-utils";
import {Run} from "../models/dto";


function PlanningForm(props: {year: number, tracks: number, disciplines: Discipline[], registrations: WithID<Registration>[],
    onSave: (plannings: Planning[]) => any, onCancel: () => any}) {
    const [planningNumber, setPlanningNumber] = useState<number>(undefined);
    const [startTime, setStartTime] = useState<LocalTime>(undefined);
    const [endTime, setEndTime] = useState<LocalTime>(undefined);
    const [registrations, setRegistrations] = useState<WithID<Run>[]>([]);

    const onPlanningNumberChange = (e: ChangeEvent<HTMLInputElement>) => setPlanningNumber(Number.parseInt(e.target.value, 10));

    return (<Stack spacing={2}>
        <TextField label="PLanungsnummer" type="number" fullWidth={true} onChange={onPlanningNumberChange} value={planningNumber} />
        <LocalTimePicker label="Startzeit" readOnly={false} onChange={setStartTime} value={startTime} />
        <LocalTimePicker label="Endzeit" readOnly={false} onChange={setEndTime} value={endTime} />


        <Box display="flex"
             justifyContent="space-between"
             alignItems="center">
            <Button variant="outlined" color="error" onClick={props.onCancel}>Abbrechen</Button>
            <Button variant="contained" color="success" onClick={() => props.onSave([
                {
                    planningNumber,
                    plannedStartTime: startTime,
                    plannedEndTime: endTime,
                    plannedBeginTrack: 1,
                    plannedEndTrack: 1,
                    registrationId: undefined
                }
            ])}>Speichern</Button>
        </Box>
    </Stack>);
}

export default PlanningForm;
