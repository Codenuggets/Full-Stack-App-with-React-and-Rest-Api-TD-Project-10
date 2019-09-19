import React, { Component } from 'react';

export default class Courses extends Component {
  state = {
    courses: null
  }
  async componentDidMount() {
    const { context } = this.props;
    const courses = await context.actions.loadCourses();
    let coursesArray = [];
    for(let course of courses) {
      coursesArray.push(
        <div className="grid-33">
          <a className="course--module course--link" href="">
            <h4 className="course--label">Course</h4>
            <h3 className="course--title">{course.title}</h3>
          </a>
        </div>
      );
    }
    this.setState({
      courses: coursesArray
    });
  }
  render() {
    return (
      <div className="bounds">
        {this.state.courses}
        <div className="grid-33">
          <a className="course--module course--add--module" href="">
            <h3 className="course--add--title">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 13 13" class="add">
                <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
              </svg>
              New Course
            </h3>
          </a>
        </div>
      </div>
    );
  }
}
