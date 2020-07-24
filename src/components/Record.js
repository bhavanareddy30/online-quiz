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
        },
        postData: {}
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
      this.props.store.setLoader(true);
      var fd = new FormData();
      fd.append('fname', 'Audioresponse.wav');
      fd.append('data', recordedBlob.blob);
      fd.append('questionId', this.props.question.id);
      fd.append('userId', 'User3');
      fd.append('responseText', this.state.text);
      const requestOptions = {
        method: 'POST',
        body: fd,
        processData: false,
        contentType: false
      };
      fetch('https://3e7a4b8f1aa9.ngrok.io/quiz/saveAnswers', requestOptions)
        .then((response) => response.blob())
        .then(data => {
          // this.nextQuestion();
          this.props.store.setQstnIdx(this.props.store.currentQuestionIdx + 1);
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
      if(this.state.audioDetails.blob !== null)
        this.postToServer(this.state.audioDetails)
      else
        this.props.store.setQstnIdx(this.props.store.currentQuestionIdx + 1);
    }

    prevQuestion(){
      this.props.store.currentQuestionIdx === 0  ? this.endQuiz() : this.props.store.setQstnIdx(this.props.store.currentQuestionIdx - 1);
    }

    handleAudioStop(data){
      console.log(data)
      recognition.stop();
      this.setState({ audioDetails: data });

      // this.postToServer(data)
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
      recognition.stop();
      this.setState({ audioDetails: reset, text: "", record: false });
    }
    handleStart(){
      var that = this;
      recognition.continuous = true;
      recognition.start();
      recognition.onresult = function(event) {
        var current = event.resultIndex;
        var transcript = event.results[current][0].transcript;
        var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);
        var noteContent='';
        if(!mobileRepeatBug) {
          noteContent += transcript;
          that.setState({text: that.state.text + " " + noteContent});
        }
      };
      recognition.onstart = function() { 

      }
      
      recognition.onspeechend = function() {

      }
      
    }
    render() {
      return (
        <div>
          <div className={`${this.props.store.loading ? "" : "hidden"} fade-bg`}>
              <Loader type="ball-scale-multiple" />
          </div>
        <div style={{width: '35%', margin: '10px auto'}}>
          <Recorder
            title={"To start recording your answer, please click on the mic symbol"}
            audioURL={this.state.audioDetails.url}
            showUIAudio
            handleStart={() => this.handleStart()}
            handleAudioStop={data => this.handleAudioStop(data)}
            handleAudioUpload={data => this.handleAudioUpload(data)}
            handleRest={() => this.handleRest()} /></div>
          <div>
              <textarea value={this.state.text} rows={5} className='text-input' onChange={(evt => this.setState({text: evt.target.value}))}
                placeholder="Answer auto fills once you start talking for 5 - 10 secs!"/></div>
          <div style={{position: 'absolute', left: '25%', top: '50%', fontSize: '2.25rem'}} className='nav-btn' 
                  onClick={() => this.prevQuestion()}><span className='fa fa-chevron-circle-left' style={{color:'white'}}/></div>
           <div style={{position: 'absolute', right: '25%', top: '50%', fontSize: '2.25rem'}} className='nav-btn' 
                  onClick={() => this.nextQuestion()}><span className='fa fa-chevron-circle-right' style={{color:'white'}}/> </div>
            <div style={{ margin: '3% auto 0% auto',width: '60%', textAlign: 'left'}}>
              <div style={{fontSize: '0.9rem', padding: '5px 0px'}}><span style={{fontWeight: 'bold', fontStyle: 'italic', color: 'darkred'}}>For Submission: </span>Please click on the stop button, make sure you review your answer and then proceed to next question. If not, your answer will not be submitted!</div>
              <div style={{fontSize: '0.9rem', padding: '5px 0px'}}> <span style={{fontWeight: 'bold', fontStyle: 'italic', color: 'darkred'}}>For Re-recording: </span> To re-record your answer, you can clear your answer using clear button and then proceed.</div>
             </div>
             {/* <div className='start-btn' onClick={() => this.postToServer(this.state.audioDetails)}
                    style={{ margin: '100px auto', border: '1px solid lightgray', color: 'black', background: 'none' }}> Submit </div> */}
        </div>
      );
    }
  }
