Component/Unit tests
* AnswerBox tests the text appears, onClick works and onClick doesn't run when the props disabled equals to true.
* AnswerBoxes test the correct number of AnswerBoxes are rendered according to answers.length.
* BackButton tests it's a button with "back" text, test it goes back a history.
* ButtonFocus tests text shows correctly and onClick works.
* GameCard tests buttons change based on whether the Game/Quiz is active, tests buttons use correct handler.
* GamePopUp tests text set correctly and buttons work.
* MediaDisplay tests correct tag is used for no media, url and image.
* NavBar tests correct links show with and without token, tests logout button works with token.

UI tests
* Admin happy path as per spec.
* Admin/user path: tests other parts not tested in happy path like adding questions, adding answers, whether back button works, whether NavBar Dashboard link works and whether the Dashboard button for ending a game works. Tests playing the quiz, whether session id pre-populates and joining the lobby. 