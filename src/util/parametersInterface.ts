import { Role } from "../models/users";


export interface UserCreateModel {
    username: string;
    password: string;
    role: Role;
}

export interface OrderDetailCreateModel {
    name: string;
    quantity: number;
    withdrawal_order: number;
}

export interface OrderPlaceCreateModel {
    name: string;
    quantity_to_deliver: number;
}

export enum PostParameters {
    USER = "POST_USER",
    ORDER_DETAIL = "POST_ORDER_DETAIL",
    ORDER_PLACE = "POST_ORDER_PLACE"
};

export enum GetParameters {
    UUID = "GET_UUID",
    USER_ID = "GET_USER_ID",
}

/**
 * Checks if an object implements the (possibly partial) structure of an interface/class T at runtime. 
 * Since interfaces only exists in typescript, when the code is compiled, they no longer exists.
 * Furthermore, this is useful when you have a class with lots of properties and you want to check 
 * if the object implements few properties of that class.
 * It checks both the existence and types (if provided) of properties.
 * @param obj the object to check
 * @param props properties of the interface to check
 * @param types types that properties must have
 * @returns boolean that indicates if the object implements the `props` passed or not
 */
export function implementsStructure<T, K extends keyof T>(obj: any, props: K[], types?: string[]): obj is T {
    if (!obj) return false;
    // check if properties exists
    const checkExistence = props.reduce((prevProp, nextProp) => prevProp && nextProp in obj, true);
    if(!checkExistence) return false;
    // check types of properties, if types were provided
    if (types !== undefined) {
        const checkType = Object.values(obj).map((value, index) => typeof value === types[index]);
        if(checkType.some( (elem) => elem === false)) return false;
    }
    return true;
}

export function validateRegex(param: string, pattern: RegExp): boolean {
    return pattern.test(param);
}   