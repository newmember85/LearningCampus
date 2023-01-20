import { Router } from 'express'
import announcementRouter from './announcement'

import courseRouter from "./course"
import courseContentRouter from './courseContent'
import courseEnrolRouter from './courseEnrol'
import degreeProgrammRouter from "./degreeProgramme"
import fakultyRouter from "./faculty"
import LecturerRouter from "./lecturer"
import locationRouter from './location'
import studentRouter from "./student"
import LectureRouter from './lecture'
import databaseRouter from './databaseUpdate'

const router = Router()

router.use('/course', courseRouter)
router.use('/degreeProgrammes', degreeProgrammRouter)
router.use('/faculty', fakultyRouter)
router.use('/lecturer', LecturerRouter)
router.use('/student', studentRouter)
router.use('/announcement', announcementRouter)
router.use('/courseContent', courseContentRouter)
router.use('/enrol', courseEnrolRouter)
router.use('/location', locationRouter)
router.use('/lecture', LectureRouter)
router.use('/infoDB', databaseRouter)
export default router