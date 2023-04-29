import {Box, IconButton, Stack} from "@mui/material";
import {Delete, Edit} from "@mui/icons-material";
import React from "react";
import {Category, Discipline} from "../models/event-config";
import {displaySex} from "../ui-utils";

export function CategoryListItem(props: {
    show: boolean,
    edit: boolean,
    // index: number,
    // discipline: Discipline
    category: Category
    onDelete: () => void,
    onEdit: () => void
}) {
    return !props.show ? undefined : (<Stack sx={{
        ml: 4,
        border: '0.1em solid black',
        borderRadius: '1em',
        padding: '1em',
        width: 1
    }}>
        <Box display="flex"
             justifyContent="space-between"
             alignItems="center">
            <div>{props.category.name}</div>
            {!props.edit ? undefined : <Stack direction="row">
                <IconButton><Delete color="error" onClick={props.onDelete}/></IconButton>
                <IconButton><Edit color="secondary" onClick={props.onEdit}/></IconButton>
            </Stack>}
        </Box>
        <div>{displaySex(props.category.sex) ?? "Offen"}: {props.category.minAge ?? 0} - {props.category.maxAge ?? "∞"}</div>
        <div>{props.category.distance}m</div>
    </Stack>);
}
