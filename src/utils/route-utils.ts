import {Request, Response, Router} from "express";
import {HttpError} from "../http-error";

export function errorCallback(res: Response): (error?: any) => any {
    return error => {
        console.warn(error);
        if (error instanceof HttpError) {
            res.status(error.code).json({
                message: error.message
            }).send();
        } else {
            res.status(500).json({
                message: 'internal server error'
            }).send();
        }
    }
}
