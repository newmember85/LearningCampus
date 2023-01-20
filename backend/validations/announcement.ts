import { body, param, query } from 'express-validator'

const announcement_create = [
    body('text')
        .notEmpty()
        .isString(),
    body('course')
        .isString()
        .notEmpty(),
    body('degree')
        .isString()
        .notEmpty()
];
const announcement_update = [
    param('id')
        .isNumeric()
        .notEmpty(),
    body('text')
        .notEmpty()
        .isString()
];

const announcement_destroy = [
    param('id')
        .isNumeric()
        .notEmpty()
];

export {
    announcement_create,
    announcement_destroy,
    announcement_update
}