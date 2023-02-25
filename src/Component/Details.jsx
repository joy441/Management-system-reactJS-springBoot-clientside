import axios from "axios";
import { filter, isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import fetchCourses from "../Fetchdata/fetchCourses";
import MultiSelectDropdown from "./MultiSelectDropdown";

const Details = (props) => {
  const location = useLocation();
  console.log("location", location);
  const showStudent = location.state.student;
  const data = location.state.courses;
  console.log("shwoStudent", showStudent.courses);
  //   const { data } = useQuery("courses", () => fetchCourses());

  const courseData = [];
  const [filterCourses, setFilterCourses] = useState(courseData);
  console.log("filterC", filterCourses);
  const departments = [];
  const [dptNames, setDptNames] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState([]);
  //   const [preSelectCourse, setPreSelectCourse] = useState(showStudent.courses);

  const [id, setId] = useState(showStudent.id);
  const [stdName, setStdName] = useState(showStudent.name);
  const [stdId, setStdId] = useState(showStudent.roll);
  const [Semester, setSemester] = useState(showStudent.semester);
  const [dptName, setDptName] = useState(showStudent.department);
  const [email, setEmail] = useState(showStudent.email);
  const [address, setAddress] = useState(showStudent.address);
  const [payable, setPayable] = useState(showStudent.payable);

  const submitHandler = (e) => {
    e.preventDefault();

    if (isEmpty(Semester && dptName && selectedCourse)) {
      return;
    }

    const info = {
      id: id,
      name: stdName,
      roll: stdId,
      email: email,
      semester: Semester,
      department: dptName,
      address: address,
      courses: selectedCourse,
      payable: payable,
    };

    const postStudent = async () => {
      await axios
        .post("http://localhost:8081/api/addstudent/update", info)
        .then((res) => console.log("addStudent:", res))
        .catch((err) => console.log("stdErr: ", err));
    };
    postStudent();
  };

  useEffect(() => {
    if (data) {
      data.forEach((course) => {
        const { department } = course;
        if (!departments.includes(department)) {
          departments.push(department);
        }
        courseData.push(course);
      });
    }
    // console.log("courseDta", courseData);
    setDptNames(departments);
    setFilterCourses(courseData);
    console.log("course", selectedCourse);
    const newCourses = Object.values(data).filter(
      (course) => course.department === dptName
    );
    setFilterCourses(newCourses);
  }, [data]);

  const selectedCourseData = (courses) => {
    setSelectedCourse(courses);

    selectedCourse.forEach((course) => {
      filterCourses.forEach((courseData) => {
        if (courseData.c_name === course) {
          let amount = Number(courseData.c_fee);
          setPayable((prev) => (prev += amount));
        }
      });
    });
  };

  const filterCourse = (e) => {
    setDptName(e.target.value);
    // if (dptName !== showStudent.departments) {
    //   setPreSelectCourse([]);
    // }

    const newCourses = Object.values(data).filter(
      (course) => course.department === e.target.value
    );
    setFilterCourses(newCourses);
  };

  return (
    <Form className="mt-4" onSubmit={submitHandler}>
      <Form.Group as={Col} controlId="formGridEmail" className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          //   placeholder="Enter your name"
          value={stdName}
          onChange={(e) => setStdName(e.target.value)}
          required
        />
      </Form.Group>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridEmail">
          <Form.Label>Roll No</Form.Label>
          <Form.Control
            type="text"
            // placeholder="Enter roll no"
            value={stdId}
            onChange={(e) => setStdId(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group as={Col} controlId="formGridState">
          <Form.Label>Enrolled Semester</Form.Label>
          <Form.Select
            value={Semester}
            onChange={(e) => setSemester(e.target.value)}
            required
          >
            <option className="d-none">Choose...</option>
            <option value="Fall 2023">Fall 2023</option>
            <option value="Spring 2023">Spring 2023</option>
            <option value="Summer 2023">Summer 2023</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            Please choose an option.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>

      <Form.Group as={Col} controlId="formGridEmail" className="mb-3">
        <Form.Label>Department</Form.Label>
        <Form.Select value={dptName} onChange={(e) => filterCourse(e)}>
          <option className="d-none">Choose...</option>
          {dptNames &&
            dptNames.map((department, index) => {
              return (
                <option key={index} value={department}>
                  {department}
                </option>
              );
            })}
        </Form.Select>
      </Form.Group>

      <Form.Group as={Col} controlId="formGridEmail" className="mb-3">
        <Form.Label>Courses</Form.Label>
        <MultiSelectDropdown
          courses={filterCourses}
          showStudent={showStudent}
          selectedCourses={selectedCourseData}
        />
      </Form.Group>

      <Form.Group as={Col} controlId="formGridCity" className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group as={Col} controlId="formGridCity" className="mb-4">
        <Form.Label>Address</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter your address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Update Student
      </Button>
    </Form>
  );
};

export default Details;