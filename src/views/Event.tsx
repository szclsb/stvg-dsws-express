import React, {useEffect, useState} from 'react';
import './App.css';
import {EventConfig} from "../../server/src/models/event-config";
import ConfigComponent from "../components/ConfigComponent";
import {Client, Method} from "../client";

const client = new Client("/api/v1/event-config");

function Event() {
    const [configs, setConfigs] = useState<EventConfig[]>(undefined);

    useEffect(() => {
        client.fetch<EventConfig[]>(Method.GET)
            .then(data => setConfigs(data))
            .catch(err => console.warn(err));
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
