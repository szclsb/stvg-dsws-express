import React from 'react';
import {
    Box,
    Stack,
    Tab,
    Tabs,
} from "@mui/material";
import EventConfigTab from "./EventConfigTab";
import EventAthleteTab from "./EventAthleteTab";
import EventPlanningTab from "./EventPlanningTab";
import '../../main.css';

function EventView() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Stack spacing={2}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Konfiguration"/>
                <Tab label="Athlet:innen"/>
                <Tab label="Planung"/>
            </Tabs>
            <Box sx={{p: 1}}>
                <EventConfigTab active={value === 0}/>
                <EventAthleteTab active={value === 1}/>
                <EventPlanningTab active={value === 2}/>
            </Box>
        </Stack>
    );
}

export default EventView;
