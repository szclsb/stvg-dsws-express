import React, {useEffect, useState} from 'react';
import './App.css';
import {EventConfig} from "../../server/src/models/event-config";
import ConfigComponent from "../components/ConfigComponent";

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
            <ul className="list-group">
                {configs?.map(config => <li className="list-group-item">
                        <ConfigComponent config={config} />
                    </li>)}
            </ul>
        </div>
    );
}

export default Event;
