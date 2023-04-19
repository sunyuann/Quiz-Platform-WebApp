/*
 For a given data structure of a question, produce another
 object that doesn't contain any important meta data (e.g. the answer)
 to return to a "player"
*/
// The object returned from GET /play/:playerid/question
export const quizQuestionPublicReturn = question => {
  const stripped = JSON.parse(JSON.stringify(question))
  for (const answer of stripped.answers) {
    delete answer.isCorrect;
  }
  return stripped;
};

/*
 For a given data structure of a question, get the IDs of
 the correct answers (minimum 1).
*/
export const quizQuestionGetCorrectAnswers = question => {
  // We assume isCorrect adheres to single/multi already
  const corrects = question.answers.reduce((total, item, index) => {
    if (item.isCorrect) {
      total.push(index);
    }
    return total;
  }, []);
  return corrects;
};

/*
 For a given data structure of a question, get the IDs of
 all of the answers, correct or incorrect.
*/
// The object returned from GET /play/:playerid/answer
// Only call after quizQuestionGetDuration() has elapsed since quizQuestionPublicReturn().isoTimeLastQuestionStarted
export const quizQuestionGetAnswers = question => {
  const ansIDs = question.reduce((total, index) => {
    total.push(index);
  });
  return ansIDs;
};

/*
 For a given data structure of a question, get the duration
 of the question once it starts. (Seconds)
*/
export const quizQuestionGetDuration = question => {
  const duration = Number(question.timeLimit)
  return duration;
};
