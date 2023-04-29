import React from "react";
import {useState} from "react";
import '../../main.css';

function EventRegistrationTab(props: {active: boolean}) {
    return !props.active ? undefined : (<div>test</div>);
}

export default EventRegistrationTab;
