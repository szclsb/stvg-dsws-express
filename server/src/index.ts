import express from "express";
import {Datasource} from "./datasource";
import {loadConfig} from "./config";
import * as json from '../dsws-config.json';
import bodyParser from "body-parser";
import {path as athletePath, init as initAthleteRoute} from "./routes/api/athlete-route";
// import {path as disciplinePath, init as initDisciplineRoute} from "./routes/api/discipline-route";
import {path as registrationPath, init as initRegistrationRoute} from "./routes/api/registration-route";
import {path as eventConfigPath, init as initEventConfigRoute} from "./routes/api/event-config-route";
import {path as planningPath, init as initPlanningRoute} from "./routes/api/planning-route";
import {checkApiKey} from "./auth";
import * as path from "path";

const cwd = path.resolve();
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
app.use(express.static(path.join(cwd, "build")));
app.use(express.static(path.join(cwd, "public")));

const apiKeyMiddleware = checkApiKey(config);
datasource.connect(config).then(db => {
    // todo implement account and credential management using jwt
    app.post('/login', (req, res) => {
        const basicAuth = req.get('Authorization');
        if (basicAuth === undefined || !basicAuth.startsWith('Basic ')) {
            res.status(401).send();
        } else {
            const [user, password] = Buffer.from(basicAuth.substring(6), 'base64').toString('utf8').split(":");
            if (config.user === user && config.secret === password) {
                res.status(200).json({
                    apiKey: config.apiKey  // fixme implement jwt auth
                });
            } else {
                res.status(403).send();
            }
        }
    });
    app.use(eventConfigPath, apiKeyMiddleware, initEventConfigRoute(db));
    app.use(athletePath, apiKeyMiddleware, initAthleteRoute(db));
    // app.use(disciplinePath, apiKeyMiddleware, initDisciplineRoute(db));
    app.use(registrationPath, apiKeyMiddleware, initRegistrationRoute(db));
    app.use(planningPath, apiKeyMiddleware, initPlanningRoute(db));

    // react frontend
    app.use((req, res, next) => {
        res.sendFile(path.join(cwd, "build", "index.html"));
    });

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


