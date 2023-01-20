import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { Course } from "../domain/course";
import { ReceiveAnnouncement } from "../domain/receive-announcement";
import { SortCoursesEnum } from "../domain/sort-courses";

const { persistAtom } = recoilPersist();

export const authAtom = atom<Array<string>>({
  key: "authToken",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const coursesAtom = atom<Course[]>({
  key: "courses",
  default: [],
});

export const filteredCoursesAtom = atom<Course[]>({
  key: "filteredCourses",
  default: [],
});

export const searchStringAtom = atom<string>({
  key: "searchString",
  default: "",
});

export const sortCoursesAtom = atom<SortCoursesEnum>({
  key: "sortCoursesType",
  default: SortCoursesEnum.Default,
});

export const announcementsAtom = atom<ReceiveAnnouncement[]>({
  key: "announcements",
  default: [],
});

export const myCoursesAtom = atom<Course[]>({
  key: "myCourses",
  default: [],
});

export const isStudentAtom = atom<boolean>({
  key: "isStudent",
  default: true,
});
