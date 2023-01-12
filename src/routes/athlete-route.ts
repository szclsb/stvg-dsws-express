import {Db, WithId} from "mongodb";
import {ObjectID} from "bson";
import {Athlete} from "../models/athlete";
import {errorCallback} from "../utils/route-utils"
import express, {Router} from "express";

export const path = '/api/v1/athletes';
export function initAthleteRoute(db: Db): Router {
    const router = express.Router();
    const collection = db.collection('athletes');

    router.post("/", (req, res) => {
        const body = req.body as Athlete;
        collection.insertOne(body).then(insertedId => {
            res.setHeader('Location', `${path}/${insertedId}`).status(201).send();
        }).catch(errorCallback(res));
    });
    router.get("/", (req, res) => {
        collection.aggregate([]).toArray().then((body: WithId<Document>[]) => {
            res.status(200).json(body)
        }).catch(errorCallback(res));
    });
    router.get("/:id", (req, res) => {
        const id = req.params.id as string;
        collection.findOne({
            _id: ObjectID.createFromHexString(id)
        }).then((body: WithId<Document>) => {
            res.status(200).json(body)
        }).catch(errorCallback(res));
    });
    router.put("/:id", (req, res) => {
        const id = req.params.id as string;
        const body = req.body as Athlete;
        collection.findOneAndUpdate({
            _id: ObjectID.createFromHexString(id)
        }, {
            $set: body
        }).then(() => {
            res.status(204).send();
        }).catch(errorCallback(res));
    });
    router.delete("/:id", (req, res) => {
        const id = req.params.id as string;
        collection.findOneAndDelete({
            _id: ObjectID.createFromHexString(id)
        }).then(() => {
            res.status(204).send();
        }).catch(errorCallback(res));
    });
    console.debug(`initialized route ${path}`);
    return router;
}
