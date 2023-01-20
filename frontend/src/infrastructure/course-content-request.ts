import { CourseContent } from "../domain/course-content";
import refreshAuthToken from "./refresh-token";

const getCourseContents = async (
  token: string,
  refreshToken: string,
  courseId: string
): Promise<CourseContent | undefined> => {
  let courses: CourseContent[];

  try {
    const response = await fetch(
      "http://localhost:8080/api/courseContent?course=" + courseId,
      {
        method: "GET",
        headers: {
          "Content-Type": "Application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    if (response.status === 401) {
      token = await refreshAuthToken(refreshToken);

      return getCourseContents(token, refreshToken, courseId);
    }

    const data = await response.text();

    courses = JSON.parse(data);

    console.log(courses);

    return courses[0];
  } catch (error) {
    console.log(error);

    return undefined;
  }
};

export default getCourseContents;
