import { body, param, query } from 'express-validator'

const student_update = [
    param('matrikel_nr')
        .notEmpty(),
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

const student_create = [
    body('matrikel_nr')
        .isNumeric()
        .notEmpty(),
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
        .isString(),
    body('degree_name')
        .notEmpty()
        .isString()
];

const student_destroy = [
    param('matrikel_nr')
        .isNumeric()
        .notEmpty()
];

export {
    student_create,
    student_update,
    student_destroy
}