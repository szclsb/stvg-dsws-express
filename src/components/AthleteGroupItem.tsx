import {Athlete} from "../models/athlete";
import {Stack} from "@mui/material";
import React from "react";

function AthleteGroupItem(props: {groupName: string}, participants: {athlete: Athlete, age: number}[]) {
    // todo show athletes as overlay
    return !props ? undefined : (<Stack>
        <div>{props.groupName}</div>
    </Stack>)
}

export default AthleteGroupItem;