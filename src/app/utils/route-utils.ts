import {Request, Response, Router} from "express";
import {HttpError} from "../errors/http-error";
import {ValidationError} from "../validation/validation-error";

export function errorCallback(res: Response): (error?: any) => any {
    return error => {
        console.warn(error);
        if (error instanceof ValidationError) {
            res.status(HttpError.BAD_REQUEST).json({
                message: error.message,
                falseProperties: error.falseProperties
            }).send();
        } else if (error instanceof HttpError) {
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
