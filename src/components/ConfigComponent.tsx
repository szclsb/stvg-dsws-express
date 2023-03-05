import React from "react";
import {EventConfig} from "../../server/src/models/event-config";
import {Discipline} from "../../server/src/models/discipline";

function ConfigComponent(props: any) {
    const config = props.config as EventConfig;
    const disciplines = props.disciplines as Discipline[];
    return (<div className="container">
        <div className="row">
            <div className="col-4 text-end">Name</div>
            <div className="col-8 text-start">{config.eventName}</div>
        </div>
        <div className="row">
            <div className="col-4 text-end">Bahnen</div>
            <div className="col-8 text-start">{config.tracks}</div>
        </div>
        <div className="row">
            <div className="col-4 text-end">Disziplinen</div>
            <ul className="list-group">
                {disciplines?.map(discipline => <li className="list-group-item">
                    <div>{discipline.name}</div>
                    <ol className="list-group">
                        {discipline.categories.map(cat => <li className="list-group-item">
                            <div>{cat.name}</div>
                            <div>{cat.sex}</div>
                            <div>{cat.minAge} - {cat.maxAge}</div>
                            <div>{cat.distance} m</div>
                        </li>)}
                    </ol>
                </li>)}
            </ul>
        </div>
    </div>);
}

export default ConfigComponent;
