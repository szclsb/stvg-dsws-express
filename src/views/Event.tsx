import React, {useEffect, useState} from 'react';
import './App.css';
import {EventConfig} from "../../server/src/models/event-config";

async function loadData(setConfig: (config: EventConfig[]) => void) {
    fetch("/api/v1/event-config", {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: "GET"
    })
        .then(res => res.json())
        .then(data => setConfig(data as EventConfig[]))
        .catch(err => console.warn(err));
}

function Event() {
    const [configs, setConfigs] = useState<EventConfig[]>(undefined);

    useEffect(() => {
        loadData(setConfigs);
    });

    return (
        <div className="App">
            <h3>Anlass Konfiguration</h3>
            <div className="flex-column">
                {configs?.map(config => <div>
                    <div>{config?.eventName}</div>
                    <p>{config?.tracks}</p>
                </div>)}
            </div>
        </div>
    );
}

export default Event;
