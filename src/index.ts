import express from "express";
import {Datasource} from "./datasource";
import {loadConfig} from "./config";
import * as json from '../dsws-config.json';

const app = express();
const config = loadConfig(json);

const datasource = new Datasource();

datasource.connect(config).then(db => {
    app.get('/', (req, res) => res.send('hello world'));
    const server = app.listen(config.port, () => {
        console.log(`server started at http://localhost:${config.port}`);
    });
    process.on('exit', () => {
        console.log(`terminating`)
        server.close(() => {
            console.log(`server closed`)
        });
        datasource.close().then(() => {
            console.log(`db connection closed`)
        });
    });
})


