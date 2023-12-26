var _username = "";
function indexPage() {
    location.href = "index.html";
}
function easyTriviaPage(){
    location.href = "easy-trivia.html";

}
function onLoadMyTrivia () {
    _username = sessionStorage.getItem("username");
    let url = ` https://easytriviafunction.azurewebsites.net/api/${_username}`;
    xhr = createXMLHTTP(url, "GET");
    xhr.onload = function () {
        let json = JSON.parse(this.response);
        var triviaList = json.triviaList;
        displayTrivia(triviaList);
    }
    xhr.send();
}

function displayTrivia (triviaList) {
    let displayArea =  document.getElementById("display-area");

    let questionNodeBuffer = document.createElement('div');
    questionNodeBuffer.className = "questions";    
    let newNodeQuestionLabel = document.createElement('span');
    newNodeQuestionLabel.innerHTML = "Question";
    questionNodeBuffer.append(newNodeQuestionLabel);

    let answerNodeBuffer = document.createElement('div');
    answerNodeBuffer.className = "answers";
    let newNodeAnswerLabel = document.createElement('span');
    newNodeAnswerLabel.innerHTML = "Answer";
    answerNodeBuffer.append(newNodeAnswerLabel);
    
    triviaList.forEach(trivia => {
        
        let newNodeQuestion = document.createElement('span');
        newNodeQuestion.innerHTML = trivia.TriviaQuestion;
        questionNodeBuffer.append(newNodeQuestion);

        
        let newNodeAnswer = document.createElement('span');
        newNodeAnswer.innerHTML = trivia.TriviaAnswer;
        answerNodeBuffer.append(newNodeAnswer);

        displayArea.append(questionNodeBuffer);
        displayArea.append(answerNodeBuffer);
        // let answerNodeBuffer = document.createElement('div');
        // let newNodeAnswerLabel = document.createElement('span');
        // let newNodeAnswer = document.createElement('span');
        // newNodeQuestionLabel.innerHTML = "Answer";
        // newNodeQuestion.innerHTML = trivia.Answer;

    });
}
function createXMLHTTP(url, method) {
    let xhr = new XMLHttpRequest();
    // xhr.onload = function () {
    //     let jsonData = JSON.parse(this.response);
    //     return jsonData;
    // }
    xhr.open(method, url);
    return xhr;
}