import {Db, WithId} from "mongodb";
import {ObjectID} from "bson";
import {validateAthlete} from "../../models/athlete";
import {errorCallback} from "../../utils/route-utils"
import express, {Request, Router} from "express";
import {validateArray} from "../../utils/validation-utils";
import {Registration, validateRegistration} from "../../models/registration";


export const collectionName = 'athletes';
export const path = '/api/v1/athletes';

export function init(db: Db): Router {
    const router = express.Router();
    const collection = db.collection(collectionName);

    router.post("/", (req, res) => {
        validateAthlete(req.body).then(athlete => collection.insertOne(athlete).then(result => {
            res.setHeader('Location', `${path}/${result.insertedId}`).status(201).send();
        })).catch(errorCallback(res));
    });
    router.post("/many", (req, res) => {
        validateArray<Registration>(req.body?.map((athlete: any) => validateAthlete(athlete)))
            .then(athletes => collection.insertMany(athletes).then(result => {
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
