import React, {ChangeEvent, useEffect, useState} from "react";
import {Sex} from "../models/athlete";
import {Radio, RadioGroup, FormControl, FormLabel, FormControlLabel} from '@mui/material';

function SexPicker(props: {label: string, data?: Sex, readOnly: boolean, onChange: (sex?: Sex) => any }) {
    const [sex, setSex] = useState<Sex>(props.data);

    useEffect(() => {
        setSex(props.data);
    }, [props.data]);

    const onSexChange = (e: ChangeEvent<HTMLInputElement>) => props.onChange(e.target.value as Sex);

    return (<FormControl>
        <FormLabel id="demo-row-radio-buttons-group-label">{props.label}</FormLabel>
        <RadioGroup value={sex} onChange={onSexChange} row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group">
            <FormControlLabel value="FEMALE" control={<Radio disabled={props.readOnly}/>} label="Mädchen"/>
            <FormControlLabel value="MALE" control={<Radio disabled={props.readOnly}/>} label="Knabe"/>
        </RadioGroup>
    </FormControl>);
}

export default SexPicker;
