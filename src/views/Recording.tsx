import React from 'react';
import {Box, Button, Stack, Tab, Tabs, TextField} from "@mui/material";
import {RegistrationPlanning} from "../models/dto";
import Tracks from "../components/Tracks";
import {seq} from "../ui-utils";
import AthleteItem from "../components/AthleteItem";

// fixme
const testPlanning: RegistrationPlanning = {
    disciplineName: "test",
    categoryName: undefined,
    beginTrack: 1,
    endTrack: 1,
    startTime: {hour: 10, minute: 0},
    endTime: {hour: 10, minute: 10},
    groupName: undefined,
    participants: [
        {
            athlete: {
                firstName: 'Claudio',
                lastName: 'Seitz',
                sex: 'MALE',
                yearOfBirth: 1993
            },
            age: 30
        }
    ]
}

function Recording() {
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
                <RecordingTab active={value === 0} tracks={4}/>
                <PlanningTab active={value === 1} tracks={4}/>
            </Box>
        </Stack>
    );
}

function RecordingTab(props: { active: boolean, tracks: number }) {


    const onConfirm = () => {
        const seconds = seq(props.tracks).map(i => {
            const element = document.getElementById(`track-${i}`) as HTMLInputElement;
            return Number.parseFloat(element.value);
        });
        console.log(seconds);
    }

    return !props.active ? undefined : (
        <Stack spacing={3}>
            <h3>Zeiterfassung</h3>
            <Stack spacing={2}>
                {seq(props.tracks).map(i => {
                    return (<Stack direction={"row"} spacing={2} alignContent={"center"}>
                        <Stack spacing={1}>
                            <div>10:00</div>
                            <div>10:10</div>
                        </Stack>
                        <TextField id={`track-${i}`} label={`Bahn ${i}`} InputLabelProps={{shrink: true}} type={"number"}
                        helperText={"M/30 Claudio Seitz"}/>
                    </Stack>);
                })}
            </Stack>
            <Button onClick={onConfirm}>Bestätigen</Button>
        </Stack>
    );
}

                                          // return (<TextField id={`track-${i}`} error label={`Bahn ${i}`} InputLabelProps={{shrink: true}} type={"text"}
                                          //                    inputProps={{inputMode: "numeric", pattern: "^[0-9]+(\\.[0-9]{1,3})?$"}}
                                          //                    helperText="Ungültiges Format: Erwartet Zahl mit höchstens 3 Nachkommastellen"/>);

function PlanningTab(props: { active: boolean, tracks: number }) {
    const plannings: RegistrationPlanning[] = [
        testPlanning
    ];

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

export default Recording;
