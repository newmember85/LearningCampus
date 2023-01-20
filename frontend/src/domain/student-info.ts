export type StudentInfo = {
    matrikel_nr: number,
    surname: string,
    name: string,
    username: string,
    password: string,
    degree_id: number
};

export type StudentPostEnrollment = {
    matrikel_nr: number,
    course: string
}