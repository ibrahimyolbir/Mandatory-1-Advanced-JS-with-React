import React, { Component } from "react";

class Login extends Component {
    render() {
        return (
            <div className="login__page" style={{ display: this.props.hideLogin ? "none" : null }}>
              <form onSubmit={this.props.setUsername}>
                <h3>Whats your Username? </h3>
                <input
                  type="text"
                  placeholder="Username"
                  value={this.props.username}
                  onKeyDown={this.props.handelKeyPress}
                  onChange={this.props.onChangeUsername}
                  className="form-control" />
              </form>
              <small className="error">{this.props.usernameError}
                </small>
            </div>
        );
    }
}

export default Login