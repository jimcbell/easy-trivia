var _username = "";
var _token = "";
var _answerMap = new Map();
var _questionMap = new Map();


/**************************
 **************************
       Table
 **************************
 **************************
 **************************/
// Append each question and answer to table, or clear table if passed empty strings for question, answer.
function createTable(numQuestions, questions, answers, allIncorrectAnswers) {
    var x = _username;
    let entryWay = document.getElementById('question-list');
    _answerMap.clear
    isClear = questions.length == 0;

    for (let i = 0; i < numQuestions; i++) {
        let newRow = document.createElement('div');
        let nodeQuestion = createNode(questions, i);
        nodeQuestion.classList.add(`question`);
        nodeQuestion.id = `question${i}`;
        _questionMap.set(`${i}`, `${answers[i]}`);


        let nodeAnswer = createNode(answers, i);
        nodeAnswer.classList.add('answer');
        nodeAnswer.id = `answer${i}`;
        _answerMap.set(`${i}`, `${answers[i]}`);

        if (isAnswersHidden()) {
            nodeAnswer.className = "hiddenAnswer";
            nodeAnswer.classList.add('ans-reveal');
        }
        newRow.append(nodeQuestion);
        nodeQuestion.after(createSave(i));

        if (isHints()) {
            if (allIncorrectAnswers[i].length == 1) {
                newRow.append(createTrueFalse());
            }
            else {
                newRow.append(createPossibleAnswers(allIncorrectAnswers, answers, i));
            }
        }
        newRow.append(nodeAnswer);
        if (!isClear && isAnswersHidden()) {
            let revealButton = createReveal(i);
            revealButton.classList.add('ans-reveal');
            newRow.append(revealButton);
        }
        entryWay.append(newRow);
    }
}
function createTrueFalse() {
    let newNodeBuffer = document.createElement('div');
    let newNodeTrue = document.createElement('span');
    let newNodeFalse = document.createElement('span');
    newNodeTrue.innerHTML = "True";
    newNodeBuffer.className = "hint-list";
    newNodeFalse.innerHTML = "False";
    newNodeBuffer.append(newNodeTrue);
    newNodeBuffer.append(newNodeFalse);
    return newNodeBuffer;
}
function createPossibleAnswers(incorrectAnswers, realAnswer, index) {
    let randomArr = createRandomArr();
    let incorrect1 = createNode(incorrectAnswers[index], 0);
    let incorrect2 = createNode(incorrectAnswers[index], 1);
    let incorrect3 = createNode(incorrectAnswers[index], 2);
    let realAnswerNode = createNode(realAnswer, index);
    let arrayNodes = [incorrect1, incorrect2, incorrect3, realAnswerNode];
    arrayNodes.forEach(node => {
        node.className = "hint";
    });
    let wrapperPossible = document.createElement('div');
    wrapperPossible.className = "hint-list";
    randomArr.forEach(randomIndex => {
        wrapperPossible.append(arrayNodes[randomIndex]);
    });
    return wrapperPossible;
}

async function clicked() {
    let numQuestions = document.getElementById("num-questions").value;
    numQuestions = numQuestions == 0 ? 10 : numQuestions;

    let questionList = document.getElementById("question-list");
    questionList.classList.add('add-border')
    await clear();
    getTriviaQuestions(numQuestions);
}

/**************************
 **************************
         Show Hints
 **************************
 **************************
 **************************/

 function isHints() {
    let hints = document.getElementById('hints');
    return hints.checked;
}

function createRandomArr() {
    for (var a = [], i = 0; i < 4; ++i) a[i] = i;
    a = shuffle(a);
    return a;

}
// http://stackoverflow.com/questions/962802#962890
function shuffle(array) {
    var tmp, current, top = array.length;
    if (top) while (--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
    }
    return array;
}
/**************************
 **************************
         Hide Answers
 **************************
 **************************
 **************************/

function revealAnswer(id) {
    let revealButton = document.getElementById(`${id}`);
    let answer = document.getElementById(`answer${id}`);
    revealButton.className = "hiddenReveal";
    answer.className = "shown-answer";
}

/**************************
 **************************
       Node Creation
 **************************
 **************************
 **************************/

 // This node is created to be a button that will reveal the answer.
// The logic will use the number of the question that this button was created for.
// These are created with a call back to an on click, that way we can reveal the answer when clicked.
function createReveal(id) {
    let revealNode = document.createElement('div');
    let revealText = document.createElement('span');
    revealText.innerHTML = "Show Answer?";
    revealNode.append(revealText);
    revealNode.id = `${id}`;
    revealNode.className = "reveal-button";
    revealNode.addEventListener("click", () => { revealAnswer(id) });
    return revealNode;
}
function createSave(index) {
    let newNodeBuffer = document.createElement('div');
    let newNode = document.createElement('span');
    newNode.innerHTML = "Save Question";
    newNodeBuffer.append(newNode);
    newNodeBuffer.className = "save-answer btn btn-primary centered";
    newNodeBuffer.id = `save${index}`;
    newNodeBuffer.onclick = () => {
        saveQuestion(newNodeBuffer, index);
    };
    return newNodeBuffer;
}


function saveQuestion (saveNode, index) {
    debugger;
    saveNode.onclick = null;
    saveNode.className = "saved";
    saveNode.innerHTML = "Saved!";
    let url = "https://easytriviafunction.azurewebsites.net/api/EasyTriviaAPI";
    let question = document.getElementById(`question${index}`).textContent;
    let answer = document.getElementById(`answer${index}`).textContent;
    jsonData =  createJsonPayload(question, answer);
    xhr = createXMLHTTP(url, "POST");
    xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
    xhr.onload = function () {
        
        return this.response;
    }
    xhr.send(jsonData);

}
function createJsonPayload (question, answer) {
    json = {
        "Username" : _username,
        "TriviaQuestion" : question,
        "TriviaAnswer" : answer
    }
    return JSON.stringify(json);
    
}

function createNode(arr, index) {
    let newNodeBuffer = document.createElement('div');
    let newNode = document.createElement('span');
    newNode.innerHTML = isClear ? "" : arr[index];
    newNodeBuffer.append(newNode);
    return newNodeBuffer;
}


function addQuestions(result) {
    let questions = [];
    let answers = [];
    let allIncorrectAnswers = [];
    let incorrectAnswers;
    result.forEach(element => {
        questions.push(element.question);
        answers.push(element.correct_answer);
        incorrectAnswers = element.incorrect_answers;
        allIncorrectAnswers.push(incorrectAnswers);
    });
    createTable(questions.length, questions, answers, allIncorrectAnswers);
}

function clear() {
    return new Promise(resolve => {
        let questionList = document.getElementById("question-list");
        questionList.innerHTML = "";
        setTimeout(() => {
            resolve('cleared');
        }, 250);
    })
}



function isAnswersHidden() {
    let hiddenAnswers = document.getElementById('hidden-answers');
    return hiddenAnswers.checked;
}

/**************************
 **************************
      Trivia DB Api
 **************************
 **************************
 **************************/

 function getAPIToken() {
    let url = "https://opentdb.com/api_token.php?command=request";
    let xhr =  createXMLHTTP(url, "GET");
    xhr.onload = function(){
        let jsonData = JSON.parse(this.response);
        _token = jsonData.token;
    };
        
    xhr.send();
}

function getTriviaQuestions(numQuestions) {
    let url = `https://opentdb.com/api.php?amount=${numQuestions}&token=${_token}`;
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        let responseObj = this.response;
        let results = responseObj.results;
        addQuestions(results);
    }
    xhttp.responseType = 'json';
    xhttp.open("GET", url);
    xhttp.send();
}



/**************************
 **************************
        Navigation
 **************************
 **************************
 **************************/
function indexPage() {
    location.href = "index.html";
}
function myTriviaPage(){
    location.href = "my-trivia.html";

}
function easyTriviaPage(){
    location.href = "easy-trivia.html";

}

function pageLoad() {
    const numQuestions = 10;
    getAPIToken();
    _username = sessionStorage.getItem("username");
}

/**************************
 **************************
      Session Storage
 **************************
 **************************
 **************************/

function checkUsername() {
    var potentialUsername = sessionStorage.getItem("username");
    if (potentialUsername != null && potentialUsername!= "") {
        
        document.getElementById("username").value = potentialUsername;
    }
}

function storeUsername() {
    var userNode = document.getElementById("username");
    var username = userNode.value;
    if (username == "" || username == null) {
        alert("Please Enter a Username!")
    } else {
        sessionStorage.setItem("username", username);
        location.href = "easy-trivia.html";
    }
    
}
/**************************
 **************************
      Http Requests
 **************************
 **************************
 **************************/

function createXMLHTTP(url, method) {
    let xhr = new XMLHttpRequest();
    // xhr.onload = function () {
    //     let jsonData = JSON.parse(this.response);
    //     return jsonData;
    // }
    xhr.open(method, url);
    return xhr;
}
/**************************
 **************************
      Easy Trivia API
 **************************
 **************************
 **************************/
function saveTrivia (triviaId) {
    document.getElementById()
}