import express, {Router} from "express";

export const path = '/views/admin';

export function init(): Router {
    const router = express.Router();

    router.get("/", (req, res) => {
        res.render("admin/results");
    });

    console.debug(`initialized route ${path}`);
    return router;
}

