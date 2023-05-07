import {Db, WithId} from "mongodb";
import {ObjectId, ObjectID} from "bson";
import {errorCallback} from "../../utils/route-utils"
import express, {Request, Router} from "express";
import {validateArray} from "../../validation/validation-utils";
import cors from "cors";
import {Run, validatePerformance, validateRun} from "../../models/run";

export const collectionName = 'run';
export const path = '/api/v1/runs';

export function init(db: Db): Router {
    const router = express.Router();
    // router.use(cors())
    const collection = db.collection(collectionName);

    router.post("/", (req, res) => {
        validateRun(req.body).then(runGroup => {
            // todo validate references
            collection.insertOne(runGroup).then(result => {
                res.setHeader('Location', `${path}/${result.insertedId}`).status(201).send();
            })
        }).catch(errorCallback(res));
    });
    router.post("/many", (req, res) => {
        validateArray<Run>(req.body?.map((runGroup: any) => validateRun(runGroup)))
            .then(runGroups => collection.insertMany(runGroups).then(result => {
                res.setHeader('Location', Object.values(result.insertedIds).map(id => `${path}/${id}`)).status(201).send();
            })).catch(errorCallback(res));
    });
    router.get("/:id", (req, res) => {
        collection.findOne({
            _id: ObjectID.createFromHexString(req.params.id as string)
        }).then((doc: WithId<Document>) => {
            res.status(200)
                .json(doc)
        }).catch(errorCallback(res));
    });
    router.get("/", (req, res) => {
        const match: any = {}
        const planningId= req.query.planning;
        if (planningId) {
            match.planningId = ObjectId.createFromHexString(planningId as string);
        }
        const registrationId = req.query.registration;
        if (registrationId) {
            match.registrationId = ObjectId.createFromHexString(registrationId as string);
        }
        collection.aggregate([{
            $match: match
        }]).toArray().then((doc: WithId<Document>[]) => {
            res.status(200)
                .json(doc)
        }).catch(errorCallback(res));
    });
    router.put("/:id", (req, res) => {
        validateRun(req.body).then(run => {
            collection.findOneAndUpdate({
                _id: ObjectID.createFromHexString(req.params.id as string)
            }, {
                $set: run
            }).then(() => {
                res.status(204).send();
            })
        }).catch(errorCallback(res));
    });
    router.put("/:id/performance", (req, res) => {
        validatePerformance(req.body).then(p => {
            collection.findOneAndUpdate({
                _id: ObjectID.createFromHexString(req.params.id as string)
            }, {
                $set: {performance: p}
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
