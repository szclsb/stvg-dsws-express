import {Db, WithId} from "mongodb";
import {ObjectID} from "bson";
import {validateEventConfig} from "../../models/event-config";
import {errorCallback} from "../../utils/route-utils"
import express, {Request, Router} from "express";


export const collectionName = 'event-config';
export const path = '/api/v1/event-config';

export function init(db: Db): Router {
    const router = express.Router();
    const collection = db.collection(collectionName);

    router.post("/", (req, res) => {
        validateEventConfig(req.body).then(eventConfig => collection.insertOne(eventConfig).then(result => {
            res.setHeader('Location', `${path}/${result.insertedId}`).status(201).send();
        })).catch(errorCallback(res));
    });
    router.get("/", (req, res) => {
        collection.aggregate([]).toArray().then((doc: WithId<Document>[]) => {
            res.status(200)
                .setHeader('Content-Type', 'application/json')
                .json(doc)
        }).catch(errorCallback(res));
    });
    router.get("/:id", (req, res) => {
        collection.findOne({
            _id: ObjectID.createFromHexString(req.params.id as string)
        }).then((doc: WithId<Document>) => {
            res.status(200)
                .setHeader('Content-Type', 'application/json')
                .json(doc)
        }).catch(errorCallback(res));
    });
    router.put("/:id", (req, res) => {
        validateEventConfig(req.body).then(eventConfig => {
            collection.findOneAndUpdate({
                _id: ObjectID.createFromHexString(req.params.id as string)
            }, {
                $set: eventConfig
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
