import React, { Component } from "react";
import Loader from 'react-loaders';
import {Recorder} from '../models/customRecorder/voiceRecorder'
import 'react-voice-recorder/dist/index.css'
import { observer } from 'mobx-react'
import {AudioComponent} from './AudioComponent'

export class Summary extends Component {
  constructor(props){
    super(props);
    this.state = {
      answers: [
        {
          question: '',
          response: null,
          responseText: '',
        }
      ]
    }
  }

  componentDidMount() {
    fetch("http://localhost:8081/quiz/getAnswers?userId=User2")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({answers: result})
        },
        (error) => {
            alert("Failed to Fetch answers from server!");
        }
    )
  }
    
  render() {
    console.log(".."+this.state.answers)
    return (
      <div>
        {
          this.state.answers.length > 1 &&
          this.state.answers.map( answer => (
            <div>
            <div style={{boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', transition: '0.3s', width: '40%', display: 'inline-block', marginBottom:'20px'}}>
            <div style={{padding: '2px 16px', textAlign:'left'}}>
              <table>
                <tr>
                  <td style={{fontWeight: 'bold', paddingRight: '140px'}}>
                    Question: 
                  </td>
                  <td>
                  {answer.question}
                </td>
                </tr>
                <tr>
                  <td style={{fontWeight: 'bold', paddingRight: '140px'}}>
                    Audio
                  </td>
                  <td>
                  <AudioComponent answerId={answer.id}/>
                  </td>
                </tr>
                <tr>
                  <td style={{fontWeight: 'bold', paddingRight: '140px'}}>
                    Response Text:
                  </td>
                  <td>
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
