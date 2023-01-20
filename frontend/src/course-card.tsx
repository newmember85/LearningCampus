import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { CourseCardArgs } from "./domain/course-card-args";
import { authAtom } from "./application/Atoms";
import { StudentInfo, StudentPostEnrollment } from "./domain/student-info";

const CourseCard = (props: CourseCardArgs) => {

  const [token] = useRecoilState(authAtom);

  function enrollCourse() {
    fetch("http://localhost:8080/api/student/", {
      headers: {
        'Authorization': 'Baere ' + token[0]
      }
    })
      .then((response) => response.json())
      .then((json) => {
        const studentInfo: StudentInfo = JSON.parse(JSON.stringify(json));
        const courseName = props.title;

        const courseEnrollmentObject: StudentPostEnrollment = { matrikel_nr: studentInfo.matrikel_nr, course: courseName };

        fetch("http://localhost:8080/api/enrol/", {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(courseEnrollmentObject)
        }).then((resp) => {
          if (resp.status == 200) {
            console.log("Enrollment success!");
          }
          else {
            if (resp.status == 404) {
              console.log("You are already enrolled in this course!");
            }
            else {
              console.log(resp.status);
            }
          }
        });
      });
  }

  return (
    <li className={props.isAdded ? "course-card added" : "course-card"}>
      <Dropdown>
        <Dropdown.Toggle className="course-dropdown">
          <i className="fa-solid fa-ellipsis"></i>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href="/action-1">Details anzeigen</Dropdown.Item>
          <Dropdown.Item onClick={enrollCourse}>Einschreiben</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Link to={`/course/${props.id}`}>
        <figure>
          <img src={props.imageUrl} alt=""></img>
        </figure>
        <article>
          <div className="flex-container">
            <p>{props.semester}</p>
            <i className="fa-regular fa-square-check"></i>
          </div>
          <h2>{props.title}</h2>
        </article>
      </Link>
    </li>
  );
};

export default CourseCard;
