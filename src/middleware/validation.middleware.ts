import express from "express";
import { ErrorEnum } from "../errors/httpErrors";
import { implementsInterface, OrderDetailCreateModel, OrderPlaceCreateModel, PostParameters, UserCreateModel } from "../util/parametersInterface";

/**
 * Checks if required POST parameters are supplied by the user
 * @param requiredParams An array of `PostParameters` to check 
 * @returns 
 */
export const validateParams = (requiredParams: PostParameters[]) => (req: express.Request, res: express.Response, next: express.NextFunction) => {

    let result: boolean[] = [];
    requiredParams.map((p) => {
        switch (p) {
            case PostParameters.USER:
                // change p
                result.push(implementsInterface<UserCreateModel, keyof UserCreateModel>(req.body, ["username", "password"], ["string", "string"]));
                break;

            case PostParameters.ORDER_DETAIL:
                console.log()
                req.body.foods.forEach((food: any) => {
                    result.push(implementsInterface<OrderDetailCreateModel, keyof OrderDetailCreateModel>(food, ["name", "quantity", "withdrawal_order"], ["string", "number", "number"]));
                });
                break;

            case PostParameters.ORDER_PLACE:
                req.body.places.forEach((place: any) => {
                    result.push(implementsInterface<OrderPlaceCreateModel, keyof OrderPlaceCreateModel>(place, ["name", "quantity_to_deliver"], ["string", "number"]));
                });
                break;

            default:
                break;
        }
    });
    if (result.some( elem => elem === false)) return next(ErrorEnum.PARAM_NOT_VALID)
    return next();
}