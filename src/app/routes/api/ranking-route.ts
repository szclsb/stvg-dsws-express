import {Db, WithId} from "mongodb";
import {errorCallback} from "../../utils/route-utils"
import express, {Request, Router} from "express";

import {collectionName as configCollectionName} from "./event-config-route";
import {collectionName as athleteCollectionName} from "./athlete-route";
import {collectionName as registrationCollectionName} from "./registration-route";
import {ObjectId} from "bson";

export const path = '/api/v1/ranking';

export function init(db: Db): Router {
    const router = express.Router();

    const configCollection = db.collection(configCollectionName);
    const athleteCollection = db.collection(athleteCollectionName);
    const registrationCollection = db.collection(registrationCollectionName);

    router.get("/", (req, res) => {
        const match: any = {
            'performance.state': 'VALID'
        }
        const disciplineName = req.query.discipline;
        if (disciplineName) {
            match['disciplineName'] = disciplineName as string
        }
        const categoryName = req.query.category;
        if (categoryName) {
            match['categoryName'] = categoryName as string;
        }
        registrationCollection.aggregate([
            {
                $match: match
            },
            {
                $addFields: {
                    time: {
                        $add: '$performance.time'
                    }
                }
            },
            {
                $lookup: {
                    from: athleteCollectionName,
                    localField: "athleteIds",
                    foreignField: "_id",
                    pipeline: [
                        {
                            $project: {
                                _id: 0
                            }
                        }
                    ],
                    as: "participants"
                }
            },
            {
                $project: {
                    _id: 0,
                    disciplineName: 1,
                    categoryName: 1,
                    groupName: 1,
                    participants: 1,
                    time: 1,
                }
            },
            {
                $sort: {
                    time: 1
                }
            }
        ]).toArray().then((doc: WithId<Document>[]) => {
            res.status(200)
                .json(doc)
        }).catch(errorCallback(res));
    });

    console.debug(`initialized route ${path}`);
    return router;
}
