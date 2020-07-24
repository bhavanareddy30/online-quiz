import React, { Component } from "react";
import Loader from 'react-loaders';
import {Recorder} from '../models/customRecorder/voiceRecorder'
import 'react-voice-recorder/dist/index.css'
import {AudioComponent} from './AudioComponent'
import oops from '../oops.svg';
import thank from '../thank.svg';

export class Summary extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading:false,
      answers: [
        // {
        //   question: '',
        //   response: null,
        //   responseText: '',
        // }
      ]
    }
  }

  componentDidMount() {
    this.setState({loading: true});
    fetch("https://3e7a4b8f1aa9.ngrok.io/quiz/getAnswers?userId=User3")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({answers: result, loading: false})
        },
        (error) => {
          this.setState({loading: false})
            alert("Failed to Fetch answers from server!");
        }
    )
  }
    
  render() {
    var containerHeight = window.innerHeight - 40/100 + 'px';
    return (
      <div style={{height: containerHeight, overflowY: 'auto'}}>
      <div className={this.state.loading ? "" : "hidden"}>
                <h2 className='loader-text'>Loading... Please Wait!</h2>
                <Loader type="ball-scale-multiple" />
            </div>
      {!this.state.loading && this.state.answers.length === 0 && (<div style={{textAlign: 'center', color: 'white', fontSize: '1.1rem', margin: '120px'}}>                
        <div><img src={oops} className="App-logo" alt="logo" style={{width: '350px'}}/></div>
      It seems you haven't submitted any of your answers properly. Please go back to home page and take the quiz again! </div>) }
        { this.state.answers.length > 0 && <div style={{textAlign: 'center'}}><div><img src={thank} className="App-logo" alt="logo" style={{width: '175px'}}/></div>
          <h3 style={{fontStyle: 'italic', margin: '0px 0px 25px 0px', color: 'beige'}}> 
              You're done with the Quiz! All your recordings are submitted successfully.</h3> </div>}
        {
          this.state.answers.length > 0 &&
          this.state.answers.map( answer => (
            <div style={{marginTop: '7px'}}>
            <div style={{boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', transition: '0.3s', width: '40%', display: 'inline-block', marginBottom:'20px'}}
                className='summary-block'>
            <div style={{padding: '2px 16px', textAlign:'left'}}>
              <table style={{fontSize: '0.95rem'}}> 
                <tr>
                  <td style={{fontWeight: 'bold', paddingRight: '140px'}}>
                    Question
                  </td>
                  <td style={{padding: '7px'}}>
                  {answer.question}
                </td>
                </tr>
                <tr>
                  <td style={{fontWeight: 'bold', paddingRight: '140px'}}>
                    Audio
                  </td>
                  <td style={{padding: '7px'}}>
                  <AudioComponent answerId={answer.id} key={answer.id}/>
                  </td>
                </tr>
                <tr>
                  <td style={{fontWeight: 'bold', paddingRight: '140px'}}>
                    Response Text
                  </td>
                  <td style={{padding: '7px', color: 'gray'}}>
                    {answer.responseText}
                  </td>
                </tr>
              </table>
            </div>
            <br />
            </div>
          </div>
          )
          )
        }
      </div>
    );
  }
}

export default Summary;
