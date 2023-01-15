import {Db, WithId} from "mongodb";
import {ObjectID} from "bson";
import {validateAthlete} from "../models/athlete";
import {errorCallback} from "../utils/route-utils"
import express, {Request, Router} from "express";

export const path = '/api/v1/athletes';

export function initAthleteRoute(db: Db): Router {
    const router = express.Router();
    const collection = db.collection('athletes');

    router.post("/", (req, res) => {
        validateAthlete(req.body).then(athlete => collection.insertOne(athlete).then(insertedId => {
            res.setHeader('Location', `${path}/${insertedId}`).status(201).send();
        })).catch(errorCallback(res));
    });
    router.get("/", (req, res) => {
        collection.aggregate([]).toArray().then((doc: WithId<Document>[]) => {
            res.status(200).json(doc)
        }).catch(errorCallback(res));
    });
    router.get("/:id", (req, res) => {
        collection.findOne({
            _id: ObjectID.createFromHexString(req.params.id as string)
        }).then((doc: WithId<Document>) => {
            res.status(200).json(doc)
        }).catch(errorCallback(res));
    });
    router.put("/:id", (req, res) => {
        validateAthlete(req.body).then(athlete => {
            collection.findOneAndUpdate({
                _id: ObjectID.createFromHexString(req.params.id as string)
            }, {
                $set: athlete
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
