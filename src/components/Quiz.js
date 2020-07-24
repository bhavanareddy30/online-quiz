import React, { Component } from "react";
import Loader from 'react-loaders';
import '../styles/loaders.css'
import { Record } from "./Record";
import { Summary } from "./Summary";
import { observer } from 'mobx-react'
import queImg from '../que.svg';
import learn from '../learn.svg';

class Quiz extends Component {
  componentDidMount() {
    this.props.store.setLoader(true);
    fetch("https://3e7a4b8f1aa9.ngrok.io/quiz/questions")
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
                    <div>
                        <Summary />
                    </div>
                ) : (
                    <div>
                        <div style={{textAlign: 'center'}}><img src={queImg} className="App-logo" alt="logo" style={{width: '175px'}}/></div>
                        <h2 style={{margin: '25px'}}>{"Q" + queNumber + ": " + this.props.store.questions[this.props.store.currentQuestionIdx].question}</h2>
                        <Record key={this.props.store.currentQuestionIdx} endQuiz={this.endQuiz}
                            question={this.props.store.questions[this.props.store.currentQuestionIdx]} store={this.props.store} />
                    </div>)}
                    
                
                <div onClick={() => this.endQuiz()} className='home-btn'> <span className='fa fa-arrow-left' style={{paddingRight: '10px'}}/>Back to home </div>
            </div>) : !this.props.store.loading && this.props.store.quizStarted ? "" :
                    (<div>
                        <div style={{textAlign: 'center', margin: '20px'}}><img src={learn} className="App-logo" alt="logo" style={{width: '250px'}}/></div>
                        <div style={{fontStyle: 'italic', color: 'white', textAlign: 'center', fontSize: '1.75rem'}}> Have a happy learning!</div>
                        <div className={`${this.props.store.loading && !this.props.store.quizStarted ? "hidden" : ""} start-btn`}
                        onClick={() => this.startQuiz()}>Start Quiz</div>
                    </div>)}

        </div>
    );
}

}

export default observer(Quiz);
