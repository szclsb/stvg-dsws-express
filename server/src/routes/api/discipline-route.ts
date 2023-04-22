import {Db, WithId} from "mongodb";
import {ObjectID} from "bson";
import {validateDiscipline} from "../../../../src/models/discipline";
import {errorCallback} from "../../utils/route-utils"
import express, {Request, Router} from "express";

export const collectionName = 'disciplines';
export const path = '/api/v1/disciplines';

export function init(db: Db): Router {
    const router = express.Router();
    const collection = db.collection(collectionName);

    router.post("/", (req, res) => {
        validateDiscipline(req.body).then(discipline => {
            collection.insertOne(discipline).then(result => {
                res.setHeader('Location', `${path}/${result.insertedId}`).status(201).send();
            })
        }).catch(errorCallback(res));
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
        validateDiscipline(req.body).then(discipline => {
            collection.findOneAndUpdate({
                _id: ObjectID.createFromHexString(req.params.id as string)
            }, {
                $set: discipline
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
