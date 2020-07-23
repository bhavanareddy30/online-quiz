import React from 'react';
import ReactDOM from 'react-dom';
import Quiz from "./components/Quiz";
import QuizModel from "./models/QuizModel";
import './index.css';

const store = new QuizModel();

ReactDOM.render(
  <Quiz store={store} />,
  document.getElementById('root')
);




