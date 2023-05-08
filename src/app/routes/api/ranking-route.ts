import {Db, WithId} from "mongodb";
import {errorCallback} from "../../utils/route-utils"
import express, {Request, Router} from "express";

import {collectionName as configCollectionName} from "./event-config-route";
import {collectionName as athleteCollectionName} from "./athlete-route";
import {collectionName as registrationCollectionName} from "./registration-route";
import {Ranking, Result} from "../../models/ranking";

export const path = '/api/v1/ranking';

function toRanking(results: Result[]): Ranking[] {
    let time = 0;
    let rank = 0;
    return results.map(result => {
        if (result.time > time) {
            rank += 1;
            time = result.time;
        }
        return Object.assign({
            rank
        }, result);
    });
}

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
        registrationCollection.aggregate<Result>([
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
        ]).toArray().then(docs => {
            const rankings = toRanking(docs);
            res.status(200).json(rankings);
        }).catch(errorCallback(res));
    });

    console.debug(`initialized route ${path}`);
    return router;
}
