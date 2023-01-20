import { body, param, query } from 'express-validator'

const degreeProgramm_create = [
    body('name')
        .notEmpty()
        .isString(),
    body('abbreviation')
        .optional()
        .isString(),
    body('semester_count')
        .optional()
        .isNumeric(),
    body('splan_id')
        .optional()
        .isNumeric(),
    body('faculty')
        .isString()
        .notEmpty()
        .optional()
];
const degreeProgramm_update = [
    param('name')
        .notEmpty()
        .isString(),
    body('name')
        .notEmpty()
        .optional()
        .isString(),
    body('abbreviation')
        .optional()
        .isString(),
    body('semester_count')
        .optional()
        .isNumeric(),
    body('splan_id')
        .optional()
        .isNumeric(),
    body('faculty')
        .isString()
        .optional()
];

const degreeProgramm_destroy = [
    param('name')
        .isString()
        .notEmpty()
];

export {
    degreeProgramm_create,
    degreeProgramm_destroy,
    degreeProgramm_update
}