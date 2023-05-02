import React, {useEffect, useState} from 'react';
import {Box, Button, ButtonGroup, Stack, Tab, Tabs, TextField} from "@mui/material";
import {RunPlanning} from "../models/dto";
import Tracks from "../components/Tracks";
import {displaySex, printTime, seq} from "../ui-utils";
import {Client, Method} from "../client";
import {useNavigate} from "react-router-dom";
import '../main.css';

const planningClient = new Client("/api/v1/planning");
const recordingClient = new Client("/api/v1/recordingClient");


function RecordingView() {
    const queryParams = new URLSearchParams(window.location.search)
    const planningNumberParam = queryParams.get("pn")
    const planningNumber = Number.parseInt(planningNumberParam, 10);
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Stack>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Erfassung"/>
                <Tab label="Zeitplan"/>
            </Tabs>
            <Box sx={{p: 1}}>
                <RecordingTab active={value === 0} tracks={4} planningNumber={planningNumber}/>
                <PlanningTab active={value === 1} tracks={4}/>
            </Box>
        </Stack>
    );
}

function RecordingTab(props: { active: boolean, planningNumber: number, tracks: number }) {
    const navigate = useNavigate();
    const [planningGroup, setPlanningGroup] = useState<RunPlanning[]>([]);

    useEffect(() => {
        if (props.active) {
            planningClient.fetch<RunPlanning[]>(Method.GET, `app/group/${props.planningNumber}`)
                .then(data => setPlanningGroup(data))
                .catch(err => console.warn(err));
        }
    // }, [props.active, props.planningNumber])
    }, [props])

    const onBack = () => {
        navigate(`/admin?pn=${props.planningNumber - 1}`);
        navigate(0)  // refresh, triggers fetch  fixme
    }

    const onConfirm = () => {
        const seconds = seq(props.tracks).map(i => {
            const element = document.getElementById(`track-${i}`) as HTMLInputElement;
            return Number.parseFloat(element.value);
        });
        console.log(seconds);
        navigate(`/admin?pn=${props.planningNumber + 1}`);
        navigate(0)  // refresh, triggers fetch  fixme
    }

    return !props.active ? undefined : (
        <Stack spacing={3}>
            <h3>Zeiterfassung</h3>
            <h4>Planungsnummer {props.planningNumber}</h4>
            <Stack spacing={2}>
                {seq(props.tracks).map(i => {
                    const planning = planningGroup.find(p => p.beginTrack === i);
                    let text: string;
                    if (planning?.groupName) {
                        text = `Gruppe: ${planning.groupName}`;
                    } else if (planning) {
                        const participant = planning.participants[0];
                        text = `SN:${participant.athlete.startNumber} ${displaySex(participant.athlete.sex)}/${participant.age} ${participant.athlete.firstName} ${participant.athlete.lastName}`;
                    }
                    return (<Stack direction={"row"} spacing={2} alignContent={"center"}>
                        <Stack spacing={1}>
                            <div>{printTime(planning?.startTime)}</div>
                            <div>{printTime(planning?.endTime)}</div>
                        </Stack>
                        <TextField id={`track-${i}`} disabled={!planning} label={`Bahn ${i}`} InputLabelProps={{shrink: true}}
                                   type={"number"}
                                   helperText={text}/>
                    </Stack>);
                })}
            </Stack>
            <Box display="flex"
                 justifyContent="space-between"
                 alignItems="center">
                <Button variant="outlined" color="secondary" onClick={onBack}>Zurück</Button>
                <Button variant="contained" color="primary" onClick={onConfirm}>Bestätigen und weiter</Button>
            </Box>
        </Stack>
    );
}

// return (<TextField id={`track-${i}`} error label={`Bahn ${i}`} InputLabelProps={{shrink: true}} type={"text"}
//                    inputProps={{inputMode: "numeric", pattern: "^[0-9]+(\\.[0-9]{1,3})?$"}}
//                    helperText="Ungültiges Format: Erwartet Zahl mit höchstens 3 Nachkommastellen"/>);

function PlanningTab(props: { active: boolean, tracks: number }) {
    const [plannings, setPlannings] = useState<RunPlanning[]>([]);

    useEffect(() => {
        if (props.active) {
            planningClient.fetch<RunPlanning[]>(Method.GET, `app`)
                .then(data => setPlannings(data))
                .catch(err => console.warn(err));
        }
    }, [props])

    return !props.active ? undefined : (
        <Stack spacing={2}>
            <h3>Zeitplan</h3>
            <div className="scroll-area-x">
                <Tracks topHeaderHeight={2} leftHeaderWidth={6} itemHeight={6} itemWidth={12} tracks={props.tracks}
                        plannings={plannings}/>
            </div>
        </Stack>
    );
}

export default RecordingView;
