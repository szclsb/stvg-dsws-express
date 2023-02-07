import express from "express";
import {Datasource} from "./datasource";
import {loadConfig} from "./config";
import * as json from '../dsws-config.json';
import bodyParser from "body-parser";
import {path as athletePath, init as initAthleteRoute} from "./routes/athlete-route";
import {path as disciplinePath, init as initDisciplineRoute} from "./routes/discipline-route";
import {path as registrationPath, init as initRegistrationRoute} from "./routes/registration-route";

const app = express();
const config = loadConfig(json);
const datasource = new Datasource();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE');
    next();
});

datasource.connect(config).then(db => {
    app.use(athletePath, initAthleteRoute(db));
    app.use(disciplinePath, initDisciplineRoute(db));
    app.use(registrationPath, initRegistrationRoute(db));

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


