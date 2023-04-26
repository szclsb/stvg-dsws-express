import {Box, IconButton, Stack} from "@mui/material";
import {Add, Delete, Edit} from "@mui/icons-material";
import React from "react";
import {Discipline} from "../models/discipline";

export function DisciplineListItem(props: {
    show: boolean,
    edit: boolean,
    // index: number,
    discipline: Discipline
    onDelete: () => void,
    onEdit: () => void,
    onCategoryAdd: () => void
}) {
    return !props.show ? undefined : (<Stack sx={{
        border: '0.1em solid black',
        borderRadius: '1em',
        padding: '1em',
        width: 1
    }}>
        <Box display="flex"
             justifyContent="space-between"
             alignItems="center">
            <div>{props.discipline.name}</div>
            {!props.edit ? undefined : <Stack direction="row">
                <IconButton onClick={props.onDelete}><Delete
                    color="error"/></IconButton>
                <IconButton onClick={props.onEdit}><Edit color="secondary"/></IconButton>
                <IconButton onClick={props.onCategoryAdd}><Add color="primary"/></IconButton>
            </Stack>}
        </Box>
        <div>{props.discipline.minRegistrations ?? 0} - {props.discipline.maxRegistrations ?? "∞"} erforderliche
            Anmeldungen
        </div>
    </Stack>);
}
