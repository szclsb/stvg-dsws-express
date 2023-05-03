import React, {useEffect, useState} from "react";
import {Button, Stack} from "@mui/material";
import {RunPlanning} from "../../models/dto";
import {Client, Method} from "../../client";
import Tracks from "../../components/Tracks";
import '../../main.css';

const planningClient = new Client("/api/v1/planning");

function EventPlanningTab(props: { active: boolean }) {
    const [plannings, setPlannings] = useState<RunPlanning[]>([]);

    useEffect(() => {
        if (props.active) {
            planningClient.fetch<RunPlanning[]>(Method.GET, {
                validation: body => Promise.resolve(body as RunPlanning[]),
                path: `app`
            })
                .then(data => setPlannings(data))
                .catch(err => console.warn(err));
        }
    }, [props])

    const onAutoPlanning = async () => {
        planningClient.fetch<RunPlanning[]>(Method.POST, {
            path: `auto`
        })
            .then(data => setPlannings(data))
            .catch(err => console.warn(err));
    }

    return !props.active ? undefined : (
        <Stack spacing={2}>
            <h3>Anlass Planung</h3>
            <div className="scroll-area-x">
                <Tracks topHeaderHeight={2} leftHeaderWidth={6} itemHeight={6} itemWidth={12} tracks={4}
                        plannings={plannings}/>
            </div>
            <Button onClick={onAutoPlanning} variant="contained" color="primary">Automatisch planen</Button>
        </Stack>
    );
}

export default EventPlanningTab;
