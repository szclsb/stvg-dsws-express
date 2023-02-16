import express from "express";
import {Datasource} from "./datasource";
import {loadConfig} from "./config";
import * as json from '../dsws-config.json';
import bodyParser from "body-parser";
import {path as athletePath, init as initAthleteRoute} from "./routes/api/athlete-route";
import {path as disciplinePath, init as initDisciplineRoute} from "./routes/api/discipline-route";
import {path as registrationPath, init as initRegistrationRoute} from "./routes/api/registration-route";
import {path as eventConfigPath, init as initEventConfigRoute} from "./routes/api/event-config-route";
import {path as planningPath, init as initPlanningRoute} from "./routes/api/planning-route";

import {path as uiPublicPath, init as initUiPublicRoute} from "./routes/web/public-routes";
import {path as uiAdminPath, init as initUiAdminRoute} from "./routes/web/admin-routes";
import {path as uiRootPath, init as initUiRootRoute} from "./routes/web/root-routes";
import * as path from "path";

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
app.set("view engine", "ejs");
app.use("/static", express.static(path.join(__dirname, "../public")))

datasource.connect(config).then(db => {
    app.use(athletePath, initAthleteRoute(db));
    app.use(disciplinePath, initDisciplineRoute(db));
    app.use(registrationPath, initRegistrationRoute(db));
    app.use(eventConfigPath, initEventConfigRoute(db));
    app.use(planningPath, initPlanningRoute(db));

    app.use(uiPublicPath, initUiPublicRoute());
    app.use(uiAdminPath, initUiAdminRoute());
    app.use(uiRootPath, initUiRootRoute());

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


