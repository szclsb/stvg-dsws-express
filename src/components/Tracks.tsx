import {dailyMinutes, Planning, Time} from "../models/planning";
import {Athlete} from "../models/athlete";
import {Collapse, List, ListItem, ListItemText, Stack, Tab, Tabs, TextField} from "@mui/material";
import React from "react";
import AthleteItem from "./AthleteItem";
import AthleteGroupItem from "./AthleteGroupItem";
import "../main.css"

interface TrackProperties {
    topHeaderHeight: number,
    leftHeaderWidth: number,
    itemHeight: number,
    itemWidth: number,
    tracks: number;
    plannings: [Planning, Athlete[], string?][];
}

function em(value: number): string {
    return value + "em";
}

function seq(count: number): number[] {
    return new Array(count).fill(1).map((_, i) => i + 1)
}

function pad(value: number, digits: number): string {
    return String(value).padStart(digits, '0')
}

function Tracks(props: TrackProperties) {
    const startTime: Time = {hour: 10, minute: 0}
    const sepTime: Time = {hour: 0, minute: 15}
    const timesCount: number = 4;
    const timesSeq = new Array(timesCount).fill(1).map((_, i): Time => {
        return {
            hour: startTime.hour + i * sepTime.hour,
            minute: startTime.minute + i * sepTime.minute,
        }
    });
    const getTimeM = (t: Time): number => {
        const start = dailyMinutes(startTime);
        const diff = dailyMinutes(sepTime);
        const x = dailyMinutes(t);
        return (x - start) / diff;
    }
    const width = props.leftHeaderWidth + timesCount * (props.itemWidth);
    const height = props.topHeaderHeight + props.tracks * (props.itemHeight);
    return (
        <div className="content-area" style={{
            width: em(width),
            height: `calc(${em(height)} + var(--app-separator-width) / 2)`
        }}>
            {timesSeq.map((t, i) => <div className="planning-header-top" style={{
                top: em(0),
                left: `calc(${em(props.leftHeaderWidth + (props.itemWidth * i))} - var(--app-planning-time-width) / 2)`,
                height: em(props.topHeaderHeight),
            }}>{pad(t.hour, 2)}:{pad(t.minute, 2)}</div>)}
            {seq(props.tracks).map(i => <div className="planning-header-left" style={{
                top: em(props.topHeaderHeight + (props.itemHeight) * (i - 1)),
                left: em(0),
                height: em(props.itemHeight),
                width: em(props.leftHeaderWidth),
                lineHeight: em(props.itemHeight)
            }}>Bahn {i}</div>)}
            {seq(props.tracks + 1).map(i => <div className="hline" style={{
                top: `calc(${em(props.topHeaderHeight + (props.itemHeight) * (i - 1))} - var(--app-separator-width) / 2)`,
                left: em(0),
                width: em(width),
            }}/>)}
            {timesSeq.map((_, i) => <div className="vline" style={{
                top: em(props.topHeaderHeight - 0.5),
                left: `calc(${em(props.leftHeaderWidth + (props.itemWidth) * i)} - var(--app-separator-width) / 2)`,
                height: em(height - props.topHeaderHeight + 0.5),
            }}/>)}
            {props.plannings.map(p => {
                const left = props.leftHeaderWidth + getTimeM(p[0].startTime) * props.itemWidth;
                const planningWidth = props.leftHeaderWidth + getTimeM(p[0].endTime) * props.itemWidth - left;
                return (<div className="planning-item" style={{
                    top: em(props.topHeaderHeight + (props.itemHeight * (p[0].track - 1))),
                    left: em(left),
                    width: `calc(${em(planningWidth)} - var(--app-separator-width))`,
                    height: `calc(${em(props.itemHeight)} - var(--app-separator-width))`,
                }}>{createItem(p[1], p[2])}</div>);
            })}
        </div>
    );
}

function createItem(athletes: Athlete[], groupName?: string): JSX.Element {
    return !groupName ? <AthleteItem athlete={athletes[0]}/> :
        <AthleteGroupItem groupName={groupName} athletes={athletes}/>
}

export default Tracks;
