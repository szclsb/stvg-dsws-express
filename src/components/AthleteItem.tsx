import {Athlete, Sex} from "../models/athlete";
import {Stack} from "@mui/material";
import React from "react";
import {displaySex} from "../ui-utils";

export function AthleteItem(props: {athlete: Athlete, age: number }) {
    return !props ? undefined : (<Stack spacing={1}>
        <div>{props.athlete.firstName} {props.athlete.lastName}</div>
        <div>{displaySex(props.athlete.sex)}/{props.age}</div>
    </Stack>)
}

export function AthleteItemReady(props: {athlete: Athlete, age: number }) {
    return !props ? undefined : (<Stack spacing={1}>
        <div>{props.athlete.firstName} {props.athlete.lastName}</div>
        <div>{displaySex(props.athlete.sex)}/{props.age}</div>
        <div>SN: {props.athlete.startNumber}</div>
    </Stack>)
}