import React from 'react';
import { Link } from 'react-router-dom';
import { createBrowserHistory } from 'history';

export default class extends React.PureComponent {
  render() {
    const { context } = this.props;
    const authenticatedUser = context.authenticatedUser;
    //Sets up history object to set pathname for when user chooses to sign in and then return to their previous viewed page
    const history = createBrowserHistory();
    return (
      <div className="header">
        <div className="bounds">
          <h1 className="header--logo">Courses</h1>
          <nav>
          {
            authenticatedUser ?
              <React.Fragment>
                <span>Welcome, {authenticatedUser.firstName}!</span>
                <Link to="/signout">Sign Out</Link>
              </React.Fragment>
            :
              <React.Fragment>
                <Link className="signup" to="/signup">Sign Up</Link>
                <Link className="signin" to={{ pathname: '/signin', state: {from: history.location}, }}>Sign In</Link>
              </React.Fragment>
          }
          </nav>
        </div>
      </div>
    )
  }
}
