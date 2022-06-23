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
    USER,
    ORDER_DETAIL,
    ORDER_PLACE
};

/**
 * Function to check if an object implements an interface T at runtime. Since interfaces only exists in typescript,
 * when the code is compiled, they no longer exists. It only checks if all the properties are in the object but 
 * it doesn't do any type checks.
 * @param obj the object to check
 * @param props an array of properties of the interface
 * @returns boolean that indicates if the interface is implemented by the object or not
 */
export function implementsInterface<T, K extends keyof T>(obj: any,  props: K[]): obj is T {
    if (!obj) return false;
    return props.reduce( (prevProp, nextProp) => prevProp && nextProp in obj, true);
}