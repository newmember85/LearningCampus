import { body, param, query } from 'express-validator'

const lecturer_update = [
    query('current_surname')
        .notEmpty()
        .isString(),
    query('current_name')
        .notEmpty()
        .isString(),
    body('surname')
        .optional()
        .notEmpty()
        .isString(),
    body('name')
        .optional()
        .notEmpty()
        .isString(),
    body('username')
        .optional()
        .notEmpty()
        .isString(),
    body('passwort')
        .optional()
        .notEmpty()
        .isString()
];

const lecturer_create = [
    body('title')
        .optional()
        .notEmpty()
        .isString(),
    body('surname')
        .optional()
        .notEmpty()
        .isString(),
    body('name')
        .optional()
        .notEmpty()
        .isString(),
    body('username')
        .optional()
        .notEmpty()
        .isString(),
    body('passwort')
        .optional()
        .notEmpty()
        .isString()
];

const lecturer_destroy = [
    query('current_surname')
        .notEmpty()
        .isString(),
    query('current_name')
        .notEmpty()
        .isString(),
];

export {
    lecturer_create,
    lecturer_update,
    lecturer_destroy
}