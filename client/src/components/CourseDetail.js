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
      id: course.id,
      title: course.title,
      description: course.description,
      estimatedTime: course.estimatedTime,
      materialsNeeded: course.materialsNeeded,
      user: course.user.firstName + ' ' + course.user.lastName,
      userId: course.userId,
    });
    if(this.state.materialsNeeded != null) {
      this.setState({
        materialsNeeded: this.seperateMaterials()
      });
    }
  }

  handleDelete = () => {
    const { context } = this.props;
    const credentials = JSON.parse(localStorage.getItem('user'));
    context.data.deleteCourse(this.state.id, credentials.authData)
      .then(this.props.history.push('/'));
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
    const { context } = this.props;
    let authenticatedUser = null;
    if(context.authenticatedUser){
      authenticatedUser = context.authenticatedUser;
    }

    return (
      <div>
      <div className="actions--bar">
        <div className="bounds">
          <div className="grid-100">
            {authenticatedUser && authenticatedUser.id === this.state.userId &&
              <span>
                <a className="button" href={'/courses/' + this.state.id + '/update'}>Update Course</a>
                <a className="button" href="#" onClick={this.handleDelete}>Delete Course</a>
              </span>
            }
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
