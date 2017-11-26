import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from 'reactstrap';
import $ from 'jquery';
import ReactDOM from 'react-dom';

class ChatForm extends Component {
  // overrides default on-submit behaviour
  // to send message asynchronously (i.e. not reload page)
  submitHandler = (e) => {

    // prevent default action (i.e. form submission, page reloading)
    e.preventDefault();
    // TODO: add a sending indicator

    // gets url to submit to
    var action = this.props.action;
    // gets form data (same as in normal form submission)
    var formData = $(ReactDOM.findDOMNode(this)).serialize();

    // performs an async POST request
    $.post(action, formData, function(res){
        // Do something with the response `res`
        // console.log(res);
        // Don't forget to hide the sending indicator!
    });

    // clears the content field after attempting to send message
    $(ReactDOM.findDOMNode(this)).find('[name=content]').val('');


    return false;
  };



  render() {
    return (
      <form onSubmit={this.submitHandler} >
        <div class="form-group">
          <label for="content">Message</label>
          <input type="text" class="form-control" name="content" placeholder="" />
        </div>
        <button type="submit" class="btn btn-primary">Send</button>
      </form>
    );
  }
}

class MessageList extends React.Component {

  constructor(props) {
    super(props);
    this.state = { messages: [] }; //FIXME could get message history here

    //FIXME shouldn't do this for EACH message list
    var evtSource = new EventSource("http://127.0.0.1:3001/events");

    const msgList = this;
    evtSource.onmessage = (e) => {
      let newMessage = JSON.parse(e.data);
      msgList.state.messages.push(newMessage);
      msgList.setState(msgList.state.messages);
    };
  }
  render() {
    const messageItems = this.state.messages.map(
      (message, index) =>
        <p key={index}>{message}</p>
    );
    return (
      <div class="" id="messages">
        {messageItems}
      </div>
    );
  }
};

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Made with... React!</h1>
        </header>
        <div class="container mt-5">
          <h1>Welcome to BChat</h1>

          <MessageList />

          <ChatForm action="/chat" />



        </div>
      </div>
    );
  }
}

export default App;
