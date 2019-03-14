import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import './App.css';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import Login from './Login';
const Linkify = require('linkifyjs/react');
///////////////////////////////////////////////////
///////////////// Scroll Bottom /////////////////
///////////////////////////////////////////////////
window.setInterval(function () {
  var elem = document.getElementById('card-bodyId');
  elem.scrollTop = elem.scrollHeight;
}, 3000);
///////////////////////////////////////////////////
///////////////// Clicable Links /////////////////
///////////////////////////////////////////////////
function clickableLinks(text) {
  var options = {/* … */ };
  return <Linkify tagName="span" options={options}>{text}</Linkify>;
}
///////////////////////////////////////////////////
///////////////// Close Dropdown /////////////////
///////////////////////////////////////////////////
// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      usernameError: "",
      message: '',
      messages: [],
      hideLogin: false,
      showEmojiArea: false,
    };

    this.hideShowEmojiArea = this.hideShowEmojiArea.bind(this);
    this.dropdownHideShow = this.dropdownHideShow.bind(this);
    this.logoutButton = this.logoutButton.bind(this);
    this.handelKeyPress = this.handelKeyPress.bind(this);
    this.socket = socketIOClient('http://ec2-13-53-66-202.eu-north-1.compute.amazonaws.com:3000');

    this.socket.on('messages', function (messages) {
      addMessage(messages);
      console.log(messages);
    });

    this.socket.on("new_message", (message) => {
      this.setState({
        messages: [...this.state.messages, message],
      })
      console.log(message);
    })

    this.sendMessage = ev => {
      ev.preventDefault();
      const mymessage = this.state.message
      if (mymessage.length !== 0) {
        this
          .socket
          .emit('message', {
            username: this.state.username,
            content: this.state.message
          }, (response) => {
            console.log(response);
          });
        this.setState({ message: '' });

      }
    }
    this.setUsername = ev => {
      const username = this.state.username
    }
    const addMessage = messages => {
      console.log(messages);
      const these_messages = messages;
      this.setState({ messages: these_messages });
      console.log(these_messages);
    };
  }
  ////////////////// END OF constructor ////////////////



  /////////////////////////////////////////////////////////////////////////////////////
  ///////////////// Username control and Keypress (login with enter) /////////////////
  /////////////////////////////////////////////////////////////////////////////////////
  handelKeyPress(e) {
    console.log(this.state.username);
    if (e.keyCode === 13) {
      e.preventDefault();
      if (this.state.username.length > 12) {
        this.setState({ usernameError: "Username must be less 12 characters." });
      } else if (this.state.username.match(/[^a-z0-9_ -]/i)) {
        this.setState({ usernameError: "The username can only contain alphanumeric characters, “-”, “_” and spaces" });
      } else {
        this.setState({ hideLogin: true, usernameError: "" });
      }
    }

  }
  ///////////////////////////////////////////////////
  ///////////////// Dropdown Show /////////////////
  ///////////////////////////////////////////////////

  dropdownHideShow() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  ///////////////////////////////////////////////////
  ///////////////// Logout  /////////////////
  ///////////////////////////////////////////////////
  logoutButton() {
    this.setState({ hideLogin: false });
  }
  ///////////////////////////////////////////////////
  ///////////////// Hide Show Emoji Area /////////////////
  ///////////////////////////////////////////////////
  hideShowEmojiArea() {
    console.log(this.state.showEmojiArea);
    this.setState({ showEmojiArea: !this.state.showEmojiArea });
    return;
  }

  ///////////////////////////////////////////////////
  ///////////////// Add Emoji /////////////////
  ///////////////////////////////////////////////////
  addEmoji = (e) => {
    //console.log(e.unified)
    if (e.unified.length <= 5) {
      let emojiPic = String.fromCodePoint(`0x${e.unified}`)
      this.setState({
        message: this.state.message + emojiPic
      })
    } else {
      let sym = e.unified.split('-')
      let codesArray = []
      sym.forEach(el => codesArray.push('0x' + el))
      console.log(codesArray.length)
      console.log(codesArray)  // ["0x1f3f3", "0xfe0f"]
      let emojiPic = String.fromCodePoint(...codesArray)
      this.setState({
        message: this.state.message + emojiPic
      })
    }

  }


  render() {
    return (
      <div className="container-fluid h-100">
        <h4 className="header__lesson">Mandatory Exercise 1 - Advanced JavaScript with React</h4>

        {/* ///////////////// Emoji Area ///////////////// */}
        <span style={{ display: this.state.showEmojiArea ? "block" : "none" }} className="emoji__area">
          <Picker onSelect={this.addEmoji} />
        </span>
        {/* ///////////////// Emoji Area ///////////////// */}

        <div className="row justify-content-center h-100">
          <div className="col-md-8 col-xl-6 chat">
            <div className="card" style={{ display: this.state.hideLogin ? "block" : null }}>
              <div className="card-header msg_head">
                <div className="d-flex bd-highlight">
                  <div className="user_info">
                    <span> Loggad in as: {this.state.username} </span>
                  </div>
                </div>
                <div className="dropdown">
                  <button onClick={this.dropdownHideShow} type="button" className="dropbtn" id="action_menu_btn"><i className="fas fa-ellipsis-v"></i></button>
                  <div id="myDropdown" className="dropdown-content">
                    <a href="#"><i className="fas fa-home"></i>   Home</a>
                    <a href="#"><i className="fas fa-cogs"></i>  Settings</a>
                    <a onClick={this.logoutButton} className="logout__button"><i className="fas fa-sign-out-alt"></i>  Logout [{this.state.username}]</a>
                  </div>
                </div>
              </div>
              <div className="card-body msg_card_body" id="card-bodyId">
                <ul className="msg_cotainer">
                  {this.state.messages.map((message, key) => {
                    return (
                      <li key={key}>
                        <p className="name__letter">{message.username.charAt(0)}</p>
                        <div className="chat__text">
                          <span className="user__name" >{message.username}</span>
                          <span className="message__content">{clickableLinks(message.content)}</span>
                          <span className="msg_time">{new Date(message.timestamp).toLocaleString("sv-SE")}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="card-footer">
                <div className="input-group">
                  <div className="input-group-append">
                    <button type="button" onClick={this.hideShowEmojiArea} className="input-group-text attach_btn" >
                      <i className="far fa-smile"></i></button>
                  </div>

                  <input
                    type="text"
                    placeholder="Message"
                    required
                    value={this.state.message}
                    onChange={ev => this.setState({ message: ev.target.value })}
                    style={{ top: 0, left: 0 }}
                    maxLength={200}
                    className="type_msg form-control " placeholder="Type your message..."></input>

                  <div className="input-group-append">
                    <button onClick={this.sendMessage} className="input-group-text send_btn"><i className="fas fa-location-arrow"></i></button>
                  </div>
                </div>
              </div>

            </div>
            <Login
              setUsername={this.setUsername}
              hideLogin={this.state.hideLogin}
              usernameError={this.state.usernameError}
              username={this.state.username}
              handelKeyPress={this.handelKeyPress}
              onChangeUsername={(e) => this.setState({ username: e.target.value })}
            />
          </div>
        </div>

      </div>

    )
  }
}

export default App;
