import {Validation} from "../models/models";
import {ValidationError} from "../errors/validation-error";

const nameChecker =  new RegExp('^[A-Za-zÀ-ÿČčĎďĚěŇňŘřŠšŤťŮůŽžŐőŰűĞğİıŞş]+$');
const emailChecker = new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$');

export async function validateName(name: any): Promise<string> {
    return new Promise((resolve, reject) => {
        if (typeof name === "string" && nameChecker.test(name as string)) {
            resolve(name.trim())
        } else {
            reject(`name ${name} does not match`)
        }
    });
}

export async function validateEmail(email: any): Promise<string> {
    return new Promise((resolve, reject) => {
        if (typeof email === "string" && emailChecker.test(email as string)) {
            resolve(email.trim())
        } else {
            reject(`email ${email} does not match`)
        }
    });
}

export async function validateInteger(value: any, min?: number, max?: number): Promise<number> {
    return new Promise((resolve, reject) => {
        try {
            const n = parseInt(value as string, 10);
            if (!!min && n < min) {
                reject(`${n} < ${min}`);
            }
            if (!!max && n > max) {
                reject(`${n} > ${max}`);
            }
            resolve(n);
        } catch (err: any) {
            reject(`${value} is not an integer`);
        }
    });
}

export async function validateNumber(value: any, min?: number, max?: number): Promise<number> {
    return new Promise((resolve, reject) => {
        try {
            const n = parseFloat(value as string);
            if (!!min && n < min) {
                reject(`${n} < ${min}`);
            }
            if (!!max && n > max) {
                reject(`${n} > ${max}`);
            }
            resolve(n);
        } catch (err: any) {
            reject(`${value} is not a number`);
        }
    });
}

export async function validateIn<E>(value: any, values: any): Promise<E> {
    return new Promise((resolve, reject) => {
        if (values.some((key: E) => key === value)) {
            resolve(value as E)
        } else {
            reject(`${value} is not in [${values.join(", ")}]`)
        }
    });
}

export async function validate<T>(validation: Validation<T>): Promise<T> {
        const errors: Record<string, any> = {};
        const result: Record<string, any> = {};
        for (const property in validation) {
            if (validation.hasOwnProperty(property)) {
                try {
                    result[property] = await validation[property];
                } catch(err: any) {
                    errors[property] = err
                }
            }
        }
        if (Object.keys(errors).length > 0) {
            throw new ValidationError(errors)
        }
        return result as T;
}
