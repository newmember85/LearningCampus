import { CourseDetails } from "../domain/course-details";
import refreshAuthToken from "./refresh-token";

const getCourseDetails = async (
  token: string,
  refreshToken: string,
  courseId: string
): Promise<CourseDetails | undefined> => {
  let courses: CourseDetails[];

  try {
    const response = await fetch(
      "http://localhost:8080/api/course/" + courseId,
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

      return getCourseDetails(token, refreshToken, courseId);
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

export default getCourseDetails;
