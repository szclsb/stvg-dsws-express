import {Db, WithId} from "mongodb";
import {ObjectID} from "bson";
import {Registration, validateRegistration} from "../../../../src/models/registration";
import {errorCallback} from "../../utils/route-utils"
import express, {Request, Router} from "express";
import {validateArray} from "../../../../src/validation/validation-utils";
import {validatePlanning} from "../../../../src/models/planning";
import {collectionName as registrationCollectionName} from "./registration-route"
import {RegistrationPlanning} from "../../../../src/models/dto";

export const collectionName = 'plannings';
export const path = '/api/v1/planning';

export function init(db: Db): Router {
    const router = express.Router();
    const collection = db.collection(collectionName);

    router.post("/auto", (req, res) => {
        // auto planning
        const regCollection = db.collection(registrationCollectionName);
        const registration = regCollection.aggregate([]);

        // todo planning per discipline category.

        res.status(204).send();
    });
    router.get("/app", (req, res) => {
        const regCollection = db.collection(registrationCollectionName);
        const registration = regCollection.aggregate([]);

        // todo all RegistrationPlanning.
        res.status(200).json([
            testPlanning(0),
            testPlanning(1),
            testPlanning(3),
        ]);
    });
    router.get("/app/group/:planningNumber", (req, res) => {
        const planningNumber = Number.parseInt(req.params.planningNumber as string, 10);
        const regCollection = db.collection(registrationCollectionName);
        // todo all RegistrationPlanning by planningNumber.
        const registration = regCollection.aggregate([]);

        if (Number.isNaN(planningNumber) || planningNumber < 0) {
            res.status(400).send("Invalid planning number");
        }

        res.status(200).json([
            testPlanning(planningNumber)
        ]);
    });

    router.post("/", (req, res) => {
        validatePlanning(req.body).then(planning => {
            // todo validate references
            collection.insertOne(planning).then(result => {
                res.setHeader('Location', `${path}/${result.insertedId}`).status(201).send();
            })
        }).catch(errorCallback(res));
    });
    router.post("/many", (req, res) => {
        validateArray<Registration>(req.body?.map((reg: any) => validatePlanning(reg)))
            .then(plannings => collection.insertMany(plannings).then(result => {
                res.setHeader('Location', Object.values(result.insertedIds).map(id => `${path}/${id}`)).status(201).send();
            })).catch(errorCallback(res));
    });
    router.get("/", (req, res) => {
        collection.aggregate([]).toArray().then((doc: WithId<Document>[]) => {
            res.status(200)
                .json(doc)
        }).catch(errorCallback(res));
    });
    router.get("/:id", (req, res) => {
        collection.findOne({
            _id: ObjectID.createFromHexString(req.params.id as string)
        }).then((doc: WithId<Document>) => {
            res.status(200)
                .json(doc)
        }).catch(errorCallback(res));
    });
    router.put("/:id", (req, res) => {
        validatePlanning(req.body).then(planning => {
            collection.findOneAndUpdate({
                _id: ObjectID.createFromHexString(req.params.id as string)
            }, {
                $set: planning
            }).then(() => {
                res.status(204).send();
            })
        }).catch(errorCallback(res));
    });
    router.delete("/:id", (req, res) => {
        collection.findOneAndDelete({
            _id: ObjectID.createFromHexString(req.params.id as string)
        }).then(() => {
            res.status(204).send();
        }).catch(errorCallback(res));
    });

    console.debug(`initialized route ${path}`);
    return router;
}


// fixme
function testPlanning(planningNumber: number): RegistrationPlanning {
    const track = (planningNumber % 4) + 1;
    return {
        disciplineName: "test",
        categoryName: undefined,
        beginTrack: track,
        endTrack: track,
        startTime: {hour: 10, minute: 0},
        endTime: {hour: 10, minute: 10},
        groupName: undefined,
        participants: [
            {
                athlete: {
                    firstName: 'Claudio',
                    lastName: 'Seitz',
                    sex: 'MALE',
                    yearOfBirth: 1993
                },
                age: 30
            }
        ]
    }
}
