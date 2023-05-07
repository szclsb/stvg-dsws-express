import {Db, WithId} from "mongodb";
import {ObjectID} from "bson";
import {
    Registration,
    validatePerformance,
    validateRegistration,
    validateRegistrationPlanning
} from "../../models/registration";
import {errorCallback} from "../../utils/route-utils"
import express, {Request, Router} from "express";
import {validateArray} from "../../validation/validation-utils";
import cors from "cors";

export const collectionName = 'registrations';
export const path = '/api/v1/registrations';

export function init(db: Db): Router {
    const router = express.Router();
    // router.use(cors())
    const collection = db.collection(collectionName);

    router.post("/", (req, res) => {
        validateRegistration(req.body).then(registration => {
            // todo validate references
            collection.insertOne(registration).then(result => {
                res.setHeader('Location', `${path}/${result.insertedId}`).status(201).send();
            })
        }).catch(errorCallback(res));
    });
    router.post("/many", (req, res) => {
        validateArray<Registration>(req.body?.map((reg: any) => validateRegistration(reg)))
            .then(registrations => collection.insertMany(registrations).then(result => {
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
    router.put("/:id/planning/set", (req, res) => {
        validateRegistrationPlanning(req.body).then(planning => {
            collection.findOneAndUpdate({
                _id: ObjectID.createFromHexString(req.params.id as string)
            }, {
                $set: {planning}
            }).then(() => {
                res.status(204).send();
            })
        }).catch(errorCallback(res));
    });
    router.put("/:id/planning/unset", (req, res) => {
        collection.findOneAndUpdate({
            _id: ObjectID.createFromHexString(req.params.id as string)
        }, {
            $unset: {planning: ""}
        }).then(() => {
            res.status(204).send();
        }).catch(errorCallback(res));
    });
    router.put("/:id/performance/set", (req, res) => {
        validatePerformance(req.body).then(performance => {
            collection.findOneAndUpdate({
                _id: ObjectID.createFromHexString(req.params.id as string)
            }, {
                $set: {performance}
            }).then(() => {
                res.status(204).send();
            })
        }).catch(errorCallback(res));
    });
    router.put("/:id/performance/unset", (req, res) => {
        collection.findOneAndUpdate({
            _id: ObjectID.createFromHexString(req.params.id as string)
        }, {
            $unset: {performance: ""}
        }).then(() => {
            res.status(204).send();
        }).catch(errorCallback(res));
    });
    router.put("/:id", (req, res) => {
        validateRegistration(req.body).then(registration => {
            collection.findOneAndUpdate({
                _id: ObjectID.createFromHexString(req.params.id as string)
            }, {
                $set: registration
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
