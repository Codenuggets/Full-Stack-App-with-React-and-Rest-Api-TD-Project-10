import React, { Component } from 'react';

export default class CourseDetail extends Component {
  state = {
    title: null,
    description: null,
    estimatedTime: null,
    materialsNeeded: []
  }

  async componentDidMount() {
    const { context } = this.props;
    const course = await context.actions.loadCourse(this.props.match.params.id);
    this.setState({
      title: course.title,
      description: course.description,
      estimatedTime: course.estimatedTime,
      materialsNeeded: course.materialsNeeded,
      user: course.user.firstName + ' ' + course.user.lastName,
    });
    if(this.state.materialsNeeded != null) {
      this.setState({
        materialsNeeded: this.seperateMaterials()
      });
    }
  }

  seperateMaterials = () => {
    const splitMaterials = this.state.materialsNeeded.split("*");
    let materials = [];
    let key = 0;
    for(let material of splitMaterials) {
      if(material !== ""){
        materials.push(
          <li key={key}>{material}</li>
        );
        key += 1;
      }
    }
    return materials;
  }
  render() {
    return (
      <div>
      <div className="actions--bar">
        <div className="bounds">
          <div className="grid-100">
            <span>
              <a className="button" href="#">Update Course</a>
              <a className="button" href="#">Delete Course</a>
            </span>
            <a className="button button-secondary" href="/">
              Return to List
            </a>
          </div>
        </div>
      </div>
      <div className="bounds course--detail">
        <div className="grid-66">
          <div className="course--header">
            <h4 className="course--label">Course</h4>
            <h3 className="course--title">{this.state.title}</h3>
            <p>By {this.state.user}</p>
          </div>
          <div className="course--description">
            <p>{this.state.description}</p>
          </div>
        </div>
        <div className="grid-25 grid-right">
          <div className="course--stats">
            <ul className="course--stats--list">
              <li className="course--stats--list--item">
                <h4>Estimated Time</h4>
                <h3>{this.state.estimatedTime}</h3>
              </li>
              <li className="course--stats--list--item">
                <h4>Materials Needed</h4>
                <ul>
                  {this.state.materialsNeeded}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    );
  }
}
