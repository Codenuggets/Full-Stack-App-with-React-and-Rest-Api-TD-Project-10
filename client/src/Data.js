import config from './config';
import { createBrowserHistory } from 'history';

export default class Data {
  // This serves as the base api request constructor
  api(path, method= 'GET', body= null, requiresAuth = false, credentials = null) {
    // config.js holds the base url for the api, with the path being supplied by the method call
    const url = config.apiBaseUrl + path;

    // Sets the options for method and headers
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };
    // Checks to see if there's anything in the body, else nothing is done
    if(body !== null) {
      options.body = JSON.stringify(body);
    }
    // Checks if the api request requires Authorization, if so an Authorization header is added with the user's credentials
    if(requiresAuth) {
      let encodedCredentials = null;
      //Checks to see if the credentials passed are the email and password
      if(credentials.email && credentials.password){
        encodedCredentials = btoa(`${credentials.email}:${credentials.password}`);
      } else {
        // Credentials are also passed from authData in local storage and are used to authorize requests
        encodedCredentials = credentials;
      }
      // Authorization header set once encodedCredentials is assigned either value
      options.headers['Authorization'] = `Basic ${encodedCredentials}`;
    }

    return fetch(url, options);
  }

  // Fetchs user from data base, used for signing a user in
  async getUser(email, password) {
    const response = await this.api(`/users`, 'GET', null, true, { email, password });
    if (response.status === 200) {
      return response.json().then(data => data);
    }
    else if (response.status === 401) {
      return null;
    }
    else {
      // Used for sending down a 500 error
      return response.status;
    }
  }
  // Creates user, used for signing up a user
  async createUser(user) {
      const response = await this.api('/users', 'POST', user);
      if (response.status === 201) {
        return [];
      }
      else if (response.status === 400) {
        return response.json().then(data => {
          return data.errors;
        });
      }
      else {
        // Used for sending down a 500 error
        return response.status;
      }
  }
  // Creates a course
  async createCourse(course, credentials) {
    const response = await this.api('/courses', 'POST', course, true, credentials);
    if (response.status === 201) {
      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      // Used for sending down a 500 error
      return response.status;
    }
  }
  // Retrieves all courses
  async getCourses() {
    const courses = await this.api('/courses')
    if(courses.status === 200) {
      return courses.json().then(data => data);
    } else if (courses.status === 401) {
      return null;
    } else {
      // Used for sending down a 500 error
      return  courses.status;
    }
  }
  // Retrieves a specific course
  async getCourse(id) {
    const course = await this.api(`/courses/${id}`);
    if(course.status === 200) {
      return course.json().then(data => data);
    } else if (course.status === 401) {
      return null;
    } else {
      // Used for sending down a 500 error
      return course.status;
    }
  }
  // Updates a specific course
  async updateCourse(course, credentials, id) {
    const response = await this.api(`/courses/${id}`, 'PUT', course, true, credentials);
    if (response.status === 204) {
      return [];
    }
    else if (response.status === 403) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      // Used for sending down a 500 error
      return response.status;
    }
  }

  // Deletes a course
  async deleteCourse(id, credentials) {
    const response = await this.api(`/courses/${id}`, 'DELETE', null , true, credentials);
    if (response.status === 204) {
      return [];
    }
    else if (response.status === 403) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      // Used for sending down a 500 error
      return response.status;
    }
  }
}
