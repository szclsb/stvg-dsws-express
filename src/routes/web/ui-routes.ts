import express, {Router} from "express";

export const path = '/views';

export function init(): Router {
    const router = express.Router();

    router.get("/", (req, res) => {
        res.render("index"); // index refers to index.ejs
    });

    console.debug(`initialized route ${path}`);
    return router;
}

