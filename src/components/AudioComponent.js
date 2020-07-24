import React, { Component } from "react";

export class AudioComponent extends Component {
  constructor(props){
    super(props);
    this.state = {
      responseBlob: null
    }
  }

  componentDidMount() {
    fetch("https://3e7a4b8f1aa9.ngrok.io/quiz/getAnswerById?answerId="+this.props.answerId)
      .then(res => res.blob())
      .then(
        (result) => {
          const url = window.URL.createObjectURL(new Blob([result]));
          var sourceElm = document.getElementById(this.props.answerId);
          sourceElm.setAttribute("src", url);
          var audioElm = document.getElementById(`audio_${this.props.answerId}`);
          audioElm.load();
        },
        (error) => {
            alert("Failed to Fetch answers from server!");
        }
    )
  }
    
  render() {
    return (
        <audio id={`audio_${this.props.answerId}`} controls> 
            <source id={this.props.answerId} src="" type="audio/wav"/>  
        </audio>
    );
  }
}

export default AudioComponent;










