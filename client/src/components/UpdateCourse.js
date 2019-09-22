import React, { Component } from 'react';
import Form from './Form';

export default class UpdateCourse extends Component {
  state = {
    id: '',
    title: '',
    description: '',
    estimatedTime: '',
    materialsNeeded: '',
    user: '',
    userId: '',
    errors: [],
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
      });
      if(context.authenticatedUser.id !== this.state.userId) {
        this.props.history.push('/forbidden');
      }
    } else {
      this.props.history.push('/notfound');
    }
  }

  cancel = () => {
    this.props.history.push('/');
  }

  submit = () => {
    const { context } = this.props;
    const userId = context.authenticatedUser.id;
    const { title, description, estimatedTime, materialsNeeded } = this.state;

    const course = { title, description, estimatedTime, materialsNeeded };
    const credentials = JSON.parse(localStorage.getItem('user'));
    context.data.updateCourse(course, credentials.authData, this.state.id)
      .then(errors => {
        if(errors.length) {
          console.log(errors);
          this.setState({ errors });
        } else {
          this.props.history.push('/');
          console.log('Course successfully updated!');
        }
      })
      .catch(err => {
        console.log(err);
        //this.props.history.push('/error');
      });

  }

  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  render() {
    const {
      errors,
      title,
      description,
      estimatedTime,
      materialsNeeded,
     } = this.state;
     const { context } = this.props;
     const authenticatedUser = context.authenticatedUser;
    return (
      <div className="bounds course--detail">
              <h1>Update Course</h1>
              <div>
                <Form
                  cancel={this.cancel}
                  errors={errors}
                  submit={this.submit}
                  submitButtonText="Update Course"
                  elements={() => (
                    <React.Fragment>
                      <div className="grid-66">
                      <div className="course--header">
                        <h4 className="course--label">Course</h4>
                        <div>
                          <input
                            id="title"
                            name="title"
                            type="text"
                            className="input-title course--title--input"
                            placeholder="Course title..."
                            onChange={this.change}
                            value={title} />
                        </div>
                        <p>By {authenticatedUser.firstName} {authenticatedUser.lastName}</p>
                      </div>
                      <div className="course--description">
                        <div>
                          <textarea
                            id="description"
                            name="description"
                            value={description}
                            className=""
                            onChange={this.change}
                            placeholder="Course description..." />
                        </div>
                      </div>
                    </div>
                    <div className="grid-25 grid-right">
                      <div className="course--stats">
                        <ul className="course--stats--list">
                          <li className="course--stats--list--item">
                            <h4>Estimated Time</h4>
                            <div>
                              <input
                                id="estimatedTime"
                                name="estimatedTime"
                                value={estimatedTime}
                                type="text"
                                className="course--time--input"
                                onChange={this.change}
                                placeholder="Hours" />
                            </div>
                          </li>
                          <li className="course--stats--list--item">
                            <h4>Materials Needed</h4>
                            <div>
                              <textarea
                                id="materialsNeeded"
                                name="materialsNeeded"
                                value={materialsNeeded}
                                className=""
                                onChange={this.change}
                                placeholder="List materials..." />
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </React.Fragment>

                  )} />
                  </div>
                </div>
    );
  }
}
