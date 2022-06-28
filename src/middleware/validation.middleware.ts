import express from "express";
import { ErrorEnum } from "../errors/httpErrors";
import { GetParameters, implementsStructure, OrderDetailCreateModel, OrderPlaceCreateModel, PostParameters, UserCreateModel } from "../util/parametersInterface";
import { validateRegex } from "../util/parametersInterface";

/**
 * Checks if required POST parameters are supplied by the user
 * @param requiredParams An array of `PostParameters` to check 
 * @returns 
 */
export const validateParams = (requiredParams: PostParameters[] | GetParameters[]) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let result: boolean[] = [];
    requiredParams.map((p) => {
        switch (p) {
            case PostParameters.USER:
                result.push(implementsStructure<UserCreateModel, keyof UserCreateModel>(req.body, ["username", "password"], ["string", "string"]));
                break;

            case PostParameters.ORDER_DETAIL:
                console.log()
                req.body.foods.forEach((food: any) => {
                    result.push(implementsStructure<OrderDetailCreateModel, keyof OrderDetailCreateModel>(food, ["name", "quantity", "withdrawal_order"], ["string", "number", "number"]));
                });
                break;

            case PostParameters.ORDER_PLACE:
                req.body.places.forEach((place: any) => {
                    result.push(implementsStructure<OrderPlaceCreateModel, keyof OrderPlaceCreateModel>(place, ["name", "quantity_to_deliver"], ["string", "number"]));
                });
                break;

            case GetParameters.USER_ID:
                result.push(validateRegex(req.params.id, new RegExp(/^[0-9]+$/)));
                break;

            case GetParameters.UUID:
                result.push(validateRegex(req.params.uuid, new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/, "i")));
                break;

            default:
                break;
        }
    });
    if (result.some(elem => elem === false)) {
        console.log(result);
        return next(ErrorEnum.PARAM_NOT_VALID)
    }
    return next();
}