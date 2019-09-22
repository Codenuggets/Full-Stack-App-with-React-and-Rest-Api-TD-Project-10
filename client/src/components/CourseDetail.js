import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';

export default class CourseDetail extends Component {
  state = {
    title: null,
    description: null,
    estimatedTime: null,
    materialsNeeded: [],
    user: null,
    userId: null,
    course: null,
  }

  async componentDidMount() {
    const { context } = this.props;
    const course = await context.actions.loadCourse(this.props.match.params.id);
    if(course){
      this.setState({
        id: course.id,
        title: course.title,
        description: course.description,
        estimatedTime: course.estimatedTime,
        materialsNeeded: course.materialsNeeded,
        user: course.user.firstName + ' ' + course.user.lastName,
        userId: course.userId,
        course: course,
      });
    } else {
      this.props.history.push('/notfound');
    }
  }

  handleDelete = () => {
    const { context } = this.props;
    const credentials = JSON.parse(localStorage.getItem('user'));
    context.data.deleteCourse(this.state.id, credentials.authData)
      .then(this.props.history.push('/'));
  }

  render() {
    const { context } = this.props;
    let authenticatedUser = null;
    if(context.authenticatedUser){
      authenticatedUser = context.authenticatedUser;
    }
    const {
      userId,
      title,
      description,
      user,
      estimatedTime,
      materialsNeeded
    } = this.state;

    return (
      <div>
      <div className="actions--bar">
        <div className="bounds">
          <div className="grid-100">
            {authenticatedUser && authenticatedUser.id === userId &&
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
            <h3 className="course--title">{title}</h3>
            <p>By {user}</p>
          </div>
          <div className="course--description">
            <ReactMarkdown source={description} />
          </div>
        </div>
        <div className="grid-25 grid-right">
          <div className="course--stats">
            <ul className="course--stats--list">
              <li className="course--stats--list--item">
                <h4>Estimated Time</h4>
                <h3>{estimatedTime}</h3>
              </li>
              <li className="course--stats--list--item">
                <h4>Materials Needed</h4>
                  <ReactMarkdown source={materialsNeeded} escapeHtml={true} />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    );
  }
}
