import { extendObservable, action } from "mobx";

class QuizModel {
  constructor() {
    extendObservable(this, {
      questions: [],
      loading: false,
      quizStarted: false,
      quizEnded: false,
      currentQuestionIdx: null,
      setLoader: action((status) => this.loading = status),
      setQuestions: action((questions) => this.questions = questions),
      setQuizStarted: action((status) => {
        this.quizStarted = status;
        this.currentQuestionIdx = 0;
      }),
      setQuizEnded: action((status) => this.quizEnded =status),
      setQstnIdx: action((idx) => this.currentQuestionIdx = idx)
    });
  }

}

export default QuizModel;
