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
 * when the code is compiled, they no longer exists. It checks both the existence and types of properties.
 * @param obj the object to check
 * @param props properties of the interface to check
 * @param types types that properties must have
 * @returns boolean that indicates if the object implements the `props` passed or not
 */
export function implementsInterface<T, K extends keyof T>(obj: any,  props: K[], types: string[]): obj is T {
    if (!obj) return false;
    // check if properties exists
    const checkExistence = props.reduce( (prevProp, nextProp) => prevProp && nextProp in obj, true);
    // check types of properties
    const checkType = Object.values(obj).reduce( (prevValue, nextValue, index) => typeof(nextValue) === types[index], true);
    if( checkExistence && checkType) return true;
    return false;
}