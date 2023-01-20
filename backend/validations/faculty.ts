import { body, param, query } from 'express-validator'

const faculty_create = [
    body('name')
        .notEmpty()
        .isString()
];
const faculty_update = [
    param('name')
        .notEmpty()
        .isString(),
    body('name')
        .notEmpty()
        .isString()
];

const faculty_destroy = [
    param('name')
        .isString()
        .notEmpty()
];

export {
    faculty_create,
    faculty_destroy,
    faculty_update
}