import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import {
  authAtom,
  coursesAtom,
  filteredCoursesAtom,
  isStudentAtom,
  myCoursesAtom,
  searchStringAtom,
  sortCoursesAtom,
} from "./application/Atoms";
import CourseCard from "./course-card";
import { Course } from "./domain/course";
import { SortCoursesEnum } from "./domain/sort-courses";
import getCourses from "./infrastructure/course-request";
import Navigation from "./navigation";

const HomePage: React.FC = () => {
  const [token] = useRecoilState(authAtom);
  const [courses, setCourses] = useRecoilState(coursesAtom);
  const [filteredCourses, setFilteredCourses] =
    useRecoilState(filteredCoursesAtom);
  const [isStudent, setIsStudent] = useRecoilState(isStudentAtom);
  const [filteredSearchString] = useRecoilState(searchStringAtom);
  const navigate = useNavigate();
  const [sortCoursesType, setSortCoursesType] = useRecoilState(sortCoursesAtom);
  const [myCourses] = useRecoilState(myCoursesAtom);

  useEffect(() => {
    // check if we currently have myCourses active
    let isMyCoursesActive = false;
    let myCoursesElement = document.getElementById("my-courses-toggle");
    if (
      myCoursesElement != null &&
      myCoursesElement.classList.contains("active")
    ) {
      isMyCoursesActive = true;
    }

    let currentlyDisplayedCourses: Course[] = courses;

    if (isMyCoursesActive) {
      currentlyDisplayedCourses = myCourses;
    }

    if (filteredSearchString === "") {
      setFilteredCourses(currentlyDisplayedCourses);
    } else {
      const filteredCourses = currentlyDisplayedCourses.filter((course) => {
        return course.name
          .toLowerCase()
          .includes(filteredSearchString.toLowerCase());
      });
      setFilteredCourses(filteredCourses);
    }
  }, [courses, filteredSearchString, setFilteredCourses, myCourses]);

  useEffect(() => {
    if (token[0].trim() === "" || token[1].trim() === "") {
      return;
    }

    fetch("http://localhost:8080/api/student/verify", {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
        Authorization: "Bearer " + token[0],
      },
    }).then((response) => {
      response.text().then((r) => {
        if (r.length === 6) {
          setIsStudent(true);
        } else {
          setIsStudent(false);
        }
      });
    });
  }, [isStudent, setIsStudent, token]);

  useEffect(() => {
    // create copy to modify State Elements and update them later
    let filteredCoursesCopy: Array<Course> = [];
    filteredCourses.forEach((course) => {
      filteredCoursesCopy.push(course);
    });

    switch (sortCoursesType) {
      case SortCoursesEnum.Alphabetical:
        filteredCoursesCopy.sort((obj1, obj2) => {
          if (obj1.name > obj2.name) {
            return 1;
          }
          if (obj1.name < obj2.name) {
            return -1;
          }
          return 0;
        });
        setFilteredCourses(filteredCoursesCopy);
        break;

      case SortCoursesEnum.Semester:
        filteredCoursesCopy.sort((obj1, obj2) => {
          if (obj1.semester > obj2.semester) {
            return 1;
          }
          if (obj1.semester < obj2.semester) {
            return -1;
          }
          return 0;
        });
        setFilteredCourses(filteredCoursesCopy);
        break;
    }
    setSortCoursesType(SortCoursesEnum.Default);
  }, [
    courses,
    sortCoursesType,
    setSortCoursesType,
    setFilteredCourses,
    filteredCourses,
  ]);

  useEffect(() => {
    if (token[0].trim() === "" || token[1].trim() === "") {
      return;
    }

    getCourses(token[0], token[1]).then((courses) => {
      setCourses(courses);
    });
  }, [setCourses, token]);

  useEffect(() => {
    if (token[0].trim() === "") {
      navigate("/login");
    }
  }, [token, navigate]);

  /* ------  TODO  -----

Home:
 - "Semester" unter Kurs soll "FWPM" zeigen, wenn's ein FWPM ist
 - Falls man in Kurs eingeschrieben ist, soll beim options menu "Austragen" stehen, sonst "Eintragen"
 - Falls man in Kurs eingeschrieben ist, bekommt li.course-card die Klasse "added" -> checkmark anzeigen
*/

  return (
    <div className="content">
      <Navigation />
      <main className="course-list">
        <div className="bg-dimmer"></div>
        <section>
          <ul className="course-grid">
            {filteredCourses.map((course) => {
              return (
                <CourseCard
                  id={course.id}
                  key={course.id}
                  title={course.name}
                  imageUrl="https://cdn.pixabay.com/photo/2020/09/28/16/29/leaves-5610361__340.png"
                  semester={
                    !course.is_fwpm ? "Semester" + course.semester : "FWPM"
                  }
                  isAdded={false}
                />
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
