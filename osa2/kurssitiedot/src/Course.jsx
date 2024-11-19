import React from "react";

const Header = ({ course }) => {
  return <h1>{course}</h1>;
};

const Total = (total) => {
  return (
    <p>
      <strong>Number of exercises {total.total}</strong>
    </p>
  );
};

const Part = ({ part, exercises1 }) => {
  return (
    <p>
      {part} {exercises1}
    </p>
  );
};

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map((part) => (
        <Part key={part.id} part={part.name} exercises1={part.exercises} />
      ))}
    </div>
  );
};

const Course = ({ course }) => {
  return (
    <>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total
        total={course.parts.reduce((sum, part) => sum + part.exercises, 0)}
      />
    </>
  );
};

export default Course;
