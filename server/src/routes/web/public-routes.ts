import express, {Router} from "express";

export const path = '/views/public';

export function init(): Router {
    const router = express.Router();

    router.get("/", (req, res) => {
        res.render("public/index"); // index refers to event-config.ejs
    });
    router.get("/registration", (req, res) => {
        res.render("public/registration"); // index refers to event-config.ejs
    });
    router.get("/results", (req, res) => {
        res.render("public/results"); // index refers to event-config.ejs
    });

    console.debug(`initialized route ${path}`);
    return router;
}

