import {Athlete} from "../models/athlete";
import {Stack} from "@mui/material";
import React from "react";

function AthleteItem(props: {athlete: Athlete}) {
    return !props ? undefined : (<Stack>
        <div>{props.athlete.firstName} {props.athlete.lastName}</div>
        <div>{props.athlete.sex} / {props.athlete.yearOfBirth}</div>
    </Stack>)
}

export default AthleteItem;
