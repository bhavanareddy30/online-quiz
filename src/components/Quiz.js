import React, { Component } from "react";
import Loader from 'react-loaders';
import '../styles/loaders.css'
import { Record } from "./Record";
import { observer } from 'mobx-react'
import banner from '../banner.svg';
import queImg from '../que.svg';

class Quiz extends Component {
  componentDidMount() {
    this.props.store.setLoader(true);
    fetch("https://2522e91dd2f5.ngrok.io/quiz/questions")
      .then(res => res.json())
      .then(
        (result) => {
          this.props.store.setLoader(false);
          this.props.store.setQuestions(result)
        },
        (error) => {
            this.props.store.setLoader(false);
            alert("Failed to Fetch questions from server!");
        }
    )
    }

startQuiz() {
    this.props.store.setQuizStarted(true);
    this.props.store.setQuizEnded(false);
}
endQuiz() {
    this.props.store.setQuizEnded(true);
    this.props.store.setQuizStarted(false);
}
render() {
    var windowWidth = window.innerWidth - (20 / 100) + 'px';
    var queNumber = this.props.store.currentQuestionIdx + 1;
    return (
        <div>
            <div className={this.props.store.loading && !this.props.store.quizStarted ? "" : "hidden"}>
                <h2 className='loader-text'>Loading... Please Wait!</h2>
                <Loader type="ball-scale-multiple" />
            </div>
            {this.props.store.quizStarted && !this.props.store.quizEnded ? (
            <div className='quiz-container' style={{ width: windowWidth }}>
                {(this.props.store.currentQuestionIdx + 1) > this.props.store.questions.length ? (
                    <h2 style={{marginTop: '80px'}}> You're done with the Quiz! All your recordings are submitted successfully.</h2>
                ) : (
                    <div>
                        <div style={{textAlign: 'center'}}><img src={queImg} className="App-logo" alt="logo" style={{width: '250px'}}/></div>
                        <h2 style={{margin: '25px'}}>{"Q" + queNumber + ": " + this.props.store.questions[this.props.store.currentQuestionIdx].question}</h2>
                        <Record key={this.props.store.currentQuestionIdx} endQuiz={this.endQuiz}
                            question={this.props.store.questions[this.props.store.currentQuestionIdx]} store={this.props.store} />
                    </div>)}
                
                <div className='start-btn' onClick={() => this.endQuiz()}
                    style={{ margin: '100px auto', border: '1px solid lightgray', color: 'black', background: 'none' }}> End Quiz! </div>
            </div>) : !this.props.store.loading && this.props.store.quizStarted ? "" :
                    (<div>
                        <div style={{textAlign: 'center'}}><img src={banner} className="App-logo" alt="logo" style={{width: '250px'}}/></div>
                        <div className={`${this.props.store.loading && !this.props.store.quizStarted ? "hidden" : ""} start-btn`}
                        onClick={() => this.startQuiz()}>Start Quiz</div>
                        <div className='center'>
                            <span className='bold'>Note: </span> On starting the quiz, Recording starts automatically. Please answer the question and move onto the next question accordingly
                        </div>
                    </div>)}

        </div>
    );
}

}

export default observer(Quiz);
