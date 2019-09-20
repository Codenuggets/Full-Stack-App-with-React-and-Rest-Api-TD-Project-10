import config from './config';

export default class Data {
  api(path, method= 'GET', body= null, requiresAuth = false, credentials = null) {
    const url = config.apiBaseUrl + path;

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };
    if(body !== null) {
      options.body = JSON.stringify(body);
    }

    if(requiresAuth) {
      let encodedCredentials = null;
      if(credentials.email && credentials.password){
        encodedCredentials = btoa(`${credentials.email}:${credentials.password}`);
      } else {
        encodedCredentials = credentials;
      }
      options.headers['Authorization'] = `Basic ${encodedCredentials}`;
    }

    return fetch(url, options);
  }

  async getUser(email, password) {
    const response = await this.api(`/users`, 'GET', null, true, { email, password });
    if (response.status === 200) {
      return response.json().then(data => data);
    }
    else if (response.status === 401) {
      return null;
    }
    else {
      throw new Error();
    }
  }

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
        throw new Error();
      }
  }

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
      throw new Error();
    }
  }

  async getCourses() {
    const courses = await this.api('/courses')
    if(courses.status === 200) {
      return courses.json().then(data => data);
    } else if (courses.status === 401) {
      return null;
    } else {
      throw new Error();
    }
  }

  async getCourse(id) {
    const course = await this.api(`/courses/${id}`);
    if(course.status === 200) {
      return course.json().then(data => data);
    } else if (course.status === 401) {
      return null;
    } else {
      throw new Error();
    }
  }
}
