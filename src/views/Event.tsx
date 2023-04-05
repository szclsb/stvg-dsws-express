import React, {useEffect, useState} from 'react';
import {EventConfig} from "../../server/src/models/event-config";
import {Client, Method} from "../client";
import {Collapse, List, ListItem, ListItemText, Stack, TextField} from "@mui/material";
import {Discipline} from "../../server/src/models/discipline";

const eventClient = new Client("/api/v1/event-config");
const disciplineClient = new Client("/api/v1/disciplines");

function Event() {
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

    return (
        <Stack spacing={2}>
            <h3>Anlass Konfiguration</h3>
            <TextField label="Name" defaultValue="" value={config?.eventName} InputLabelProps={{
                shrink: true
            }} InputProps={{
                readOnly: true,
            }} />
            <TextField label="Bahnen" defaultValue="" value={config?.tracks} InputLabelProps={{
                shrink: true
            }} InputProps={{
                readOnly: true,
            }} />

            <List subheader="Disziplinen">
                {disciplines?.map(discipline => <div>
                    <ListItem>
                        <ListItemText primary={discipline.name} secondary={`${discipline.minRegistrations} - ${discipline.maxRegistrations} erforderliche Anmeldungen`} />
                    </ListItem>
                    <Collapse in={true}>
                        <List disablePadding>
                            {discipline.categories?.map(cat => <ListItem sx={{ pl: 4 }}>
                                <ListItemText primary={cat.name} secondary={`${cat.distance}m`} />
                            </ListItem>)}
                        </List>
                    </Collapse>
                </div>)}
            </List>
        </Stack>
    );
}

export default Event;
