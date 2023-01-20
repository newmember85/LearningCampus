import { body, param, query } from 'express-validator'

const courseContent_create = [
    body('titel')
        .notEmpty()
        .optional()
        .isString(),
    body('text')
        .optional()
        .isString(),
    body('content_type')
        .optional()
        .isString(),
    body('url_path')
        .isString()
        .optional(),
    body('course')
        .isString()
        .notEmpty()
];
const courseContent_update = [
    param('id')
        .notEmpty()
        .isNumeric(),
    body('titel')
        .notEmpty()
        .optional()
        .isString(),
    body('text')
        .optional()
        .isString(),
    body('content_type')
        .optional()
        .isString(),
    body('url_path')
        .isString()
        .optional()
];

const courseContent_destroy = [
    param('id')
        .isNumeric()
        .notEmpty()
];

export {
    courseContent_create,
    courseContent_destroy,
    courseContent_update
}