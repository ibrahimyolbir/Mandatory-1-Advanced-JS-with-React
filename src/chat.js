import React, {Component} from 'react';
import socketIOClient from "socket.io-client";
import username from './components/Username';

class Chat extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            message: '',
            usernameError: "",
            set: 'Set',
            disable: 'show',
            disable2: false,
            intervalIsSet: false,
            messages: [],
            chatHistory: []
        };

        // this has to be something other than localhost.

        this.socket = socketIOClient('http://ec2-13-53-66-202.eu-north-1.compute.amazonaws.com:3000');

        this
            .socket
            .on('messages', function (messages) {
                //addMessage(data);
                console.log(messages);
            });

        this.socket.on("new_message", (message) => {
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

                this.setState({message: ''});

            }

        }
        this.setUsername = ev => {

            if (!this.isEnabled()) {
                ev.preventDefault();
                return;
            }

            const username = this.state.username

            const err = this.validate();

            if (!err) {
                this.setState({username: username, disable: 'hide', disable2: true, set: ''});

            }

        }

        const addMessage = data => {
            console.log(data);

            const these_messages = [
                ...this.state.messages,
                data
            ];
            this.setState({messages: these_messages});

            this
                .state
                .chatHistory
                .push(these_messages);
            localStorage.setItem('these_messages', JSON.stringify(this.state.chatHistory));
            localStorage.setItem('message', "");

        };

        this.isEnabled = () => {
            const {username} = this.state
            return (username.length > 0);

        }

        this.validate = () => {

            const errors = {
                usernameError: ""
            };

            let isError = false;

            if (this.state.username.length < 5) {
                isError = true;
                errors.usernameError = "Username must be at least 5 characters long";
            }

            this.setState({
                ...this.state,
                ...errors
            });

            return isError;

        }

        // end of constructor
    }

    hydrateStateWithLocalStorage() {
        // for all items in state
        for (let key in this.state) {
            // if the key exists in localStorage
            if (localStorage.hasOwnProperty(key)) {
                // get the key's value from localStorage
                let value = localStorage.getItem(key);

                // parse the localStorage string and setState
                try {
                    value = JSON.parse(value);
                    this.setState({[key]: value});
                } catch (e) {
                    // handle empty string
                    this.setState({[key]: value});
                }
            }
        }
    }

    saveStateToLocalStorage() {
        // for every item in React state
        for (let key in this.state) {
            // save to localStorage
            localStorage.setItem(key, JSON.stringify(this.state[key]));
        }
    }

    componentDidMount() {
        this.hydrateStateWithLocalStorage();

        // add event listener to save state to localStorage when user leaves/refreshes
        // the page
        window.addEventListener("beforeunload", this.saveStateToLocalStorage.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.saveStateToLocalStorage.bind(this));

        // saves if component has a chance to unmount
        this.saveStateToLocalStorage();
    }

    render() {

        const isEnab = this.isEnabled();

        return (

            <div className="chat">
                <h3 className="chat_head">Chat Demo Still Unsure</h3>
                <div className="container">
                    <div className="row">
                        <div className="card">
                            <div className="card-body">

                                <hr/>
                                <div className="messages">

                                    {this
                                        .state
                                        .messages
                                        .map((message, key) => {
                                            return (
                                                <div className="chat_text" key={key}>
                                                    {message.username}: {message.message}</div>

                                            );
                                        })}
                                    {/* <SimpleStorage parent={this}/> */}
                                </div>

                            </div>
                            <div className="card-footer">

                                <h6>
                                    {this.state.set}
                                    Username</h6>

                                <form onSubmit={this.setUsername}>
                                    <small className="error">{this.state.usernameError}
                                    </small>
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        value={this.state.username}
                                        
                                        onChange={ev => this.setState({username: ev.target.value})}
                                        className="form-control"/>
                                    <button
                                        id={this.state.disable}
                                        disabled={!isEnab}
                                        className="btn btn-primary btn-sm mt-3">Set</button>
                                </form>

                            </div>

                            <div className="card-footer">

                                <input
                                    type="text"
                                    placeholder="Message"
                                    required
                                    value={this.state.message}
                                    onChange={ev => this.setState({message: ev.target.value})}
                                    className="form-control"/>
                                <br/>
                                <button onClick={this.sendMessage} className="btn btn-primary form-control">Send</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        );
    }

}

export default Chat;
