import { body, param, query } from 'express-validator'
const lecture_update = [
    query('name')
        .notEmpty()
        .isString(),
    query('lecturer')
        .optional()
        .notEmpty()
        .isString(),
    query('day')
        .optional()
        .notEmpty()
        .isString(),
    query('range')
        .optional()
        .isString(),
];

const lecture_create = [
    body('time_range')
        .optional()
        .notEmpty()
        .isString(),
    body('day')
        .optional()
        .notEmpty()
        .isString(),
    body('course')
        .optional()
        .isString(),
    body('lecturer')
        .optional()
        .notEmpty()
        .isString(),
    body('location')
        .optional()
        .notEmpty()
        .isString()
];

const lecture_destroy = [
    query('name')
        .notEmpty()
        .isString(),
    query('lecturer')
        .optional()
        .notEmpty()
        .isString(),
    query('day')
        .optional()
        .notEmpty()
        .isString(),
    query('range')
        .optional()
        .isString(),
];

export {
    lecture_create,
    lecture_update,
    lecture_destroy
}