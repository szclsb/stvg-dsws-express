import React, {useEffect, useState} from 'react';
import {EventConfig} from "../../server/src/models/event-config";
import {Client, Method} from "../client";
import {Collapse, List, ListItem, ListItemText, Stack, Tab, Tabs, TextField} from "@mui/material";
import {Discipline} from "../../server/src/models/discipline";
import Tracks from "../components/Tracks";
import {Planning} from "../../server/src/models/planning";
import {Athlete} from "../../server/src/models/athlete";

const eventClient = new Client("/api/v1/event-config");
const disciplineClient = new Client("/api/v1/disciplines");

function ConfigTab() {
    const [config, setConfig] = useState<EventConfig>(undefined);
    const [disciplines, setDiscipline] = useState<Discipline[]>(undefined);

    useEffect(() => {
        eventClient.fetch<EventConfig>(Method.GET, "63eea5bbc350bea3d7ada318")
            .then(data => setConfig(data))
            .catch(err => console.warn(err));
        disciplineClient.fetch<Discipline[]>(Method.GET)
            .then(data => setDiscipline(data))
            .catch(err => console.warn(err));
    }, []);

    useEffect(() => {
        eventClient.fetch<EventConfig>(Method.GET, "63eea5bbc350bea3d7ada318")
            .then(data => setConfig(data))
            .catch(err => console.warn(err));
        disciplineClient.fetch<Discipline[]>(Method.GET)
            .then(data => setDiscipline(data))
            .catch(err => console.warn(err));
    }, []);

    return (
        <Stack spacing={2}>
            <h3>Anlass Konfiguration</h3>
            <TextField label="Name" defaultValue="" value={config?.eventName} InputLabelProps={{
                shrink: true
            }} InputProps={{
                readOnly: true,
            }}/>
            <TextField label="Bahnen" defaultValue="" value={config?.tracks} InputLabelProps={{
                shrink: true
            }} InputProps={{
                readOnly: true,
            }}/>

            <List subheader="Disziplinen">
                {disciplines?.map(discipline => <div>
                    <ListItem>
                        <ListItemText primary={discipline.name}
                                      secondary={`${discipline.minRegistrations} - ${discipline.maxRegistrations} erforderliche Anmeldungen`}/>
                    </ListItem>
                    <Collapse in={true}>
                        <List disablePadding>
                            {discipline.categories?.map(cat => <ListItem sx={{pl: 4}}>
                                <ListItemText primary={cat.name} secondary={`${cat.distance}m`}/>
                            </ListItem>)}
                        </List>
                    </Collapse>
                </div>)}
            </List>
        </Stack>
    );
}

function PlanningTab() {
    const plannings: [Planning, Athlete[], string?][] = [
        [{track: 1, startTime: {hour: 10, minute: 0}, endTime: {hour: 10, minute: 10}, registrationId: null},
            [{firstName: 'Claudio', lastName: 'Seitz', sex: 'MALE', yearOfBirth: 1993}]]
    ];

    return (
        <Stack spacing={2}>
            <h3>Anlass Planung</h3>
            <div style={{width: "100%", overflow: "auto"}}>
                <Tracks topHeaderHeight={2} leftHeaderWidth={6} itemHeight={6} itemWidth={12} separator={0.1} tracks={4} plannings={plannings} />
            </div>
        </Stack>
    );
}

function Event() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    let content = <div>Invalid tab</div>;
    switch (value) {
        case 0: {
            content = <ConfigTab />;
            break;
        }
        case 1: {
            content =  <PlanningTab />;
            break;
        }
    }
    return (
        <Stack spacing={2}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Konfiguration"/>
                <Tab label="Planung"/>
            </Tabs>
            {content}
        </Stack>
    );
}

export default Event;
