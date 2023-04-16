/*
 For a given data structure of a question, produce another
 object that doesn't contain any important meta data (e.g. the answer)
 to return to a "player"
*/
export const quizQuestionPublicReturn = question => {
  console.log('quizQuestionPublicReturn: ', question);
  const stripped = {...question};
  for (const answer of stripped.answers) {
    delete answer.isCorrect;
  }
  console.log('quizQuestionPublicReturn stripped ', stripped);
  return stripped;
};

/*
 For a given data structure of a question, get the IDs of
 the correct answers (minimum 1).
*/
export const quizQuestionGetCorrectAnswers = question => {
  console.log('quizQuestionGetCorrectAnswers: ', question);
  // We assume isCorrect adheres to single/multi already
  const corrects = question.reduce((total, item, index) => {
    if (item.isCorrect) {
      total.push(index);
    }
  });
  console.log('quizQuestionGetCorrectAnswers corrects ', corrects);
  return corrects;
};

/*
 For a given data structure of a question, get the IDs of
 all of the answers, correct or incorrect.
*/
export const quizQuestionGetAnswers = question => {
  console.log('quizQuestionGetAnswers: ', question);
  const ansIDs = question.reduce((total, index) => {
    total.push(index);
  });
  console.log('quizQuestionGetAnswers ansIDs ', ansIDs);
  return ansIDs;
};

/*
 For a given data structure of a question, get the duration
 of the question once it starts. (Seconds)
*/
export const quizQuestionGetDuration = question => {
  console.log('quizQuestionGetDuration: ', question);
  const duration = question.timeLimit
  console.log('quizQuestionGetDuration duration ', duration);
  return duration;
};
