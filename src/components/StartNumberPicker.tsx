import React, {ChangeEvent, useEffect, useState} from "react";
import {Button, Stack, TextField} from "@mui/material";


function StartNumberPicker(props: {startNumber?: number, onAssign: (startNumber: number) => any}) {
    const [startNumber, setStartNumber] = useState<number>(props.startNumber);

    useEffect(() => {
        setStartNumber(props.startNumber);
    }, [props.startNumber]);

    const onValueChange = (e: ChangeEvent<HTMLInputElement>) => setStartNumber(Number.parseInt(e.target.value, 10));

    return (<Stack spacing={2} direction="row">
        <TextField label="Startnummer" onChange={onValueChange} value={startNumber}/>
        <Button variant="contained" color="primary" disabled={startNumber === props.startNumber} onClick={() => props.onAssign(startNumber)}>Zuweisen</Button>
    </Stack>);
}

export default StartNumberPicker;
