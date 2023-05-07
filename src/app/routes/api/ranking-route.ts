import {Db, WithId} from "mongodb";
import {ObjectID} from "bson";
import {errorCallback} from "../../utils/route-utils"
import express, {Request, Router} from "express";

import {collectionName as runCollectionName} from "./run-route";
import {collectionName as registrationCollectionName} from "./registration-route";

export const path = '/api/v1/ranking';

export function init(db: Db): Router {
    const router = express.Router();
    // router.use(cors())
    const runCollection = db.collection(runCollectionName);
    const registrationCollection = db.collection(registrationCollectionName);

    router.get("/:discipline", (req, res) => {
        const disciplineName = req.params.discipline as string;
        registrationCollection.aggregate([
            {
                $match: {disciplineName}
            },
            {
                $lookup: {
                    from: runCollectionName,
                    localField: '_id',
                    foreignField: 'registrationId',
                    pipeline: [
                        {
                            $project: {
                                performance: 1
                            }
                        }
                    ],
                    as: 'performance'
                }
            }
        ]).toArray().then((doc: WithId<Document>[]) => {
            res.status(200)
                .json(doc)
        }).catch(errorCallback(res));
    });
    // router.get("/:discipline/:category", (req, res) => {
    //     const disciplineName = req.params.discipline as string;
    //     const categoryName = req.params.category as string;
    //     collection.findOne({
    //         _id: ObjectID.createFromHexString(req.params.id as string)
    //     }).then((doc: WithId<Document>) => {
    //         res.status(200)
    //             .json(doc)
    //     }).catch(errorCallback(res));
    // });

    console.debug(`initialized route ${path}`);
    return router;
}
