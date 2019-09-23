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
    //Checks to make sure that courses was returned and that it's not a 500 status code
    if(course && course !== 500){
      this.setState({
        id: course.id,
        title: course.title,
        description: course.description,
        estimatedTime: course.estimatedTime,
        materialsNeeded: course.materialsNeeded,
        user: course.user.firstName + ' ' + course.user.lastName,
        userId: course.userId,
      });
      //Checks to see that the currently logged in user owns the course or not
      if(context.authenticatedUser.id !== this.state.userId) {
        this.props.history.push('/forbidden');
      }
    } else if(course === 500){
      // Redirects user to error page if there was a 500 status
      this.props.history.push('/error');
    } else {
      // If no course was found, the user is redirected to the 404 page
      this.props.history.push('/notfound');
    }
  }

  cancel = () => {
    this.props.history.push('/');
  }

  submit = () => {
    const { context } = this.props;
    //Sets the
    //const userId = context.authenticatedUser.id;
    // declares variables so save from writing this.state.* everywhere
    const { title, description, estimatedTime, materialsNeeded } = this.state;
    // Declares and fills course variable object
    const course = { title, description, estimatedTime, materialsNeeded };
    // Grabs credentials to authorize user in update request
    const credentials = JSON.parse(localStorage.getItem('user'));
    context.data.updateCourse(course, credentials.authData, this.state.id)
      .then(errors => {
        //Checks for validation errors and sets them if they exist
        if(errors.length) {
          this.setState({ errors });
        } else if(errors === 500){
          // Redirects user to error page if 500 error is returned
          this.props.history.push('/error');
        } else {
          // If no errors or 500 error, the course will be updated and user will be redirected to home page
          this.props.history.push('/');
          console.log('Course successfully updated!');
        }
      })
      .catch(err => {
        console.log(err);
        this.props.history.push('/error');
      });

  }
  //Handles updating the values in the input areas
  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    // Updates the state as the input values are changed
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
