import {Db, WithId} from "mongodb";
import {ObjectID} from "bson";
import {Registration, validateRegistration} from "../models/registration";
import {errorCallback} from "../utils/route-utils"
import express, {Request, Router} from "express";
import {validateArray} from "../utils/validation-utils";
import {validatePlanning} from "../models/planning";

export const collectionName = 'plannings';
export const path = '/api/v1/planning';

export function init(db: Db): Router {
    const router = express.Router();
    const collection = db.collection(collectionName);

    router.post("/", (req, res) => {
        validatePlanning(req.body).then(planning => {
            // todo validate references
            collection.insertOne(planning).then(insertedId => {
                res.setHeader('Location', `${path}/${insertedId}`).status(201).send();
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
