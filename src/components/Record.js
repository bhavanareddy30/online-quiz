import React, { Component } from "react";
import Loader from 'react-loaders';
import {Recorder} from '../models/customRecorder/voiceRecorder'
import 'react-voice-recorder/dist/index.css'
var recognition;

export class Record extends Component {
    constructor(props) {
      super(props);
      this.state = {
        text: "",
        record: false,
        currentNav: '',
        audioDetails: {
          url: null,
          blob: null,
          chunks: null,
          duration: {
            h: null,
            m: null,
            s: null
          }
        }
      }
      this.onStop = this.onStop.bind(this)
      this.postToServer = this.postToServer.bind(this)
    }
    componentDidMount(){
      try {
        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
      }
      catch(e) {
        console.error(e);
        alert("Your browser won't support speech-to-text conversion");
      }
    }
    startRecording = () => {
      this.setState({ record: true });
    }
   
    stopRecording = (navigation) => {
      this.setState({ record: false, currentNav: navigation });
    }

    postToServer(recordedBlob){
      // this.props.store.setLoader(true);
      var fd = new FormData();
      fd.append('fname', 'Audioresponse.wav');
      fd.append('data', recordedBlob.blob);
      fd.append('questionId', this.props.question.id);
      fd.append('userId', 'User2');
      fd.append('responseText', this.state.text);
      const requestOptions = {
        method: 'POST',
        body: fd,
        processData: false,
        contentType: false
      };
      fetch('http://localhost:8081/quiz/saveAnswers', requestOptions)
        .then((response) => response.blob())
        .then(data => {
          this.props.store.setLoader(false);
        },(error) => {
          this.props.store.setLoader(false);
        })
        
    }
   
    endQuiz() {
      this.props.store.setQuizEnded(true);
      this.props.store.setQuizStarted(false);
    }
   
    onStop(recordedBlob) {
      this.postToServer(recordedBlob);
    }
   
    nextQuestion(){
      this.props.store.setQstnIdx(this.props.store.currentQuestionIdx + 1);
    }

    prevQuestion(){
      this.props.store.currentQuestionIdx === 0  ? this.endQuiz() : this.props.store.setQstnIdx(this.props.store.currentQuestionIdx - 1);
    }

    handleAudioStop(data){
      console.log(data)
      this.setState({ audioDetails: data });
      this.postToServer(data)
    }
    handleAudioUpload(file) {
      console.log(file);
    }
    handleRest(){
      const reset = {
        url: null,
        blob: null,
        chunks: null,
        duration: {
          h: null,
          m: null,
          s: null 
        }
      }
      this.setState({ audioDetails: reset });
    }
    handleStart(){
      var that = this;
      recognition.start();
      recognition.onresult = function(event) {
        var current = event.resultIndex;
        var transcript = event.results[current][0].transcript;
        var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);
        var noteContent='';
        if(!mobileRepeatBug) {
          noteContent += transcript;
          that.setState({text: noteContent});
        }
      };
      
    }
    render() {
      console.log(".."+this.state.text)
      return (
        <div>
          <div className={`${this.props.store.loading ? "" : "hidden"} fade-bg`}>
              <Loader type="ball-scale-multiple" />
          </div>
        <div style={{width: '35%', margin: '10px auto'}}>
          <Recorder
            title={"To start recording your answer, please click on the mic symbol!"}
            audioURL={this.state.audioDetails.url}
            showUIAudio
            handleStart={() => this.handleStart()}
            handleAudioStop={data => this.handleAudioStop(data)}
            handleAudioUpload={data => this.handleAudioUpload(data)}
            handleRest={() => this.handleRest()} /></div>
          <div><textarea value={this.state.text} rows={4} style={{width: '500px'}}/></div>
          <div style={{position: 'relative', marginTop: '30px'}}> 
                <span style={{position: 'absolute', left: '35%'}} className='nav-btn' 
                  onClick={() => this.prevQuestion()}><span className='fa fa-chevron-circle-left' style={{color:'#30567A'}}/>{"  Previous"}</span>
                <span style={{position: 'absolute', right: '35%'}} className='nav-btn' 
                  onClick={() => this.nextQuestion()}>{"Next  "}<span className='fa fa-chevron-circle-right' style={{color:'#30567A'}}/> </span>
          </div>
        </div>
      );
    }
  }
