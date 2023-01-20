import { body, param, query } from 'express-validator'

const course_create = [
    body('name')
        .notEmpty()
        .optional()
        .isString(),
    body('abbreviation')
        .optional()
        .isString(),
    body('semester')
        .optional()
        .isNumeric(),
    body('is_fwpm')
        .isBoolean()
        .notEmpty(),
    body('degreeProgramme')
        .isString()
        .optional()
        .notEmpty()
];
const course_update = [
    query('course')
        .isString()
        .notEmpty(),
    query('degree')
        .isString()
        .notEmpty(),
    body('name')
        .notEmpty()
        .optional()
        .isString(),
    body('abbreviation')
        .optional()
        .isString(),
    body('semester')
        .optional()
        .isNumeric(),
    body('is_fwpm')
        .isBoolean()
        .optional()
        .notEmpty(),
    body('degreeProgramme')
        .isString()
        .optional()
        .notEmpty()
];

const course_destroy = [
    query('course')
        .isString()
        .notEmpty(),
    query('degree')
        .isString()
        .notEmpty(),
];

export {
    course_create,
    course_destroy,
    course_update
}