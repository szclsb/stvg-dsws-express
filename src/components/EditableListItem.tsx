import {Box, IconButton, Stack} from "@mui/material";
import {Add, Delete, Edit} from "@mui/icons-material";
import React from "react";
import {Discipline} from "../models/event-config";
import {jsx} from "@emotion/react";
import JSX = jsx.JSX;

function EditableListItem(props: {
    edit: boolean,
    children: JSX.Element,
    onDelete: () => void,
    onEdit: () => void,
    onAdd?: () => void
}) {
    return (<Stack sx={{
        border: '0.1em solid black',
        borderRadius: '1em',
        padding: '1em',
        width: 1
    }}>
        {!props.edit ? undefined : <Stack direction="row-reverse">
            <IconButton onClick={props.onDelete}><Delete
                color="error"/></IconButton>
            <IconButton onClick={props.onEdit}><Edit color="secondary"/></IconButton>
            {!props.onAdd ? undefined : <IconButton onClick={props.onAdd}><Add color="primary"/></IconButton>}
        </Stack>}
        {props.children}
    </Stack>);
}

export default EditableListItem;
