import express, {Router} from "express";

export const path = '/views/root';

export function init(): Router {
    const router = express.Router();

    router.get("/config", (req, res) => {
        res.render("root/event-config");
    });
    router.get("/planning", (req, res) => {
        res.render("root/planning");
    });

    console.debug(`initialized route ${path}`);
    return router;
}

