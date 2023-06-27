// slectors
let questionCount = document.querySelector(".quiz-info .count");
let category = document.querySelector(".category span");
let questionBullets = document.querySelector(".bullets .spans");
let bullets = document.querySelector(".bullets");
let quizArea = document.querySelector(".quiz-area");
let ansewrsArea = document.querySelector(".answers-area");
let subBtn = document.querySelector(".submit-answer");
let resultContainer = document.querySelector(".result");
let countdownHolder = document.querySelector(".countdown");

// set options
let qCount = 0;
let rightAnswers = 0;
let countdownInterval;

// get questions from json file
function getQuestions() {
    
    var myRequest = new XMLHttpRequest();
    
    myRequest.onreadystatechange = function() {
        
        if (this.readyState === 4 && this.status === 200) {
            let questionsObj = JSON.parse(this.responseText);

            // function to create bullets
            createBullets(questionsObj.length);
            // function to get questions
            createQuestions(questionsObj[qCount], questionsObj.length);
            
            countDownFun(10, questionsObj.length);
            // check the answer
            subBtn.onclick = () => {
                // get right answer 
                let rightAnswer = questionsObj[qCount].right_answer;

                // indcrease index
                qCount++;
                
                // check the answer
                checkAnswer(rightAnswer, questionsObj.length);
                
                // write the new question
                quizArea.innerHTML = "";
                ansewrsArea.innerHTML = "";
                createQuestions(questionsObj[qCount], questionsObj.length);
                
                // countdown
                clearInterval(countdownInterval);
                countDownFun(10, questionsObj.length);

                // handle bullets
                handleBullets();

                // show result 
                showResult(questionsObj.length);
            }
        }
    }
    myRequest.open("GET", "json/questions.json", true);
    myRequest.send();
}
getQuestions();

// create questions count
function createBullets(number) {
    questionCount.innerHTML = number;
    for(let i = 0; i < number; i++) {
        let span = document.createElement("span");
        span.innerHTML = i+1;
        if (i === 0) {
            span.className = "active";
        }
        questionBullets.appendChild(span);
    }
}

function createQuestions(obj, count) {

    if (qCount < count) {
        category.innerHTML = obj['category'];
        // create h2 question
        let question = document.createElement("h2");
        let questionTxt = document.createTextNode(obj['question']);
        question.className = "question";
        question.appendChild(questionTxt);
        quizArea.appendChild(question);
        
        // create answers
        let answers = obj['answers'];
    
        for (let i = 0; i < 4; i++) {
            // create the answer
            let answersDiv = document.createElement("div");
            answersDiv.className = "answer";

            let answersInput = document.createElement("input");
            answersInput.type = "radio";
            answersInput.name = "answer";
            answersInput.id = `answer-${(i+1)}`;
            answersInput.setAttribute("data-answer", answers[`answer_${(i+1)}`]);
            
            let answersLabel = document.createElement("label");
            answersLabel.setAttribute("for", `answer-${(i+1)}`);
            answersLabel.textContent = answers[`answer_${(i+1)}`];
    
            answersDiv.appendChild(answersInput);
            answersDiv.appendChild(answersLabel);
            ansewrsArea.appendChild(answersDiv);
        }
    }
}

function checkAnswer(answer, count) {
    let answers = document.getElementsByName("answer");
    let checkedAnswer;
    for(let i = 0; i < 4; i++) {
        if (answers[i].checked) {
            checkedAnswer = answers[i].dataset.answer;
        }
    }
    
    if (checkedAnswer === answer) {
        rightAnswers++;
    }
}

function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);

    arrayOfSpans.forEach((span, index) => {
        
        if (qCount === index) {
            span.className = "active";
        }
    })
}

function showResult(count) {
    let finalResult;
    if (qCount === count) {
        quizArea.remove();
        ansewrsArea.remove();
        subBtn.remove();
        bullets.remove();
        
        if (rightAnswers > (count / 2) && rightAnswers < count) {
            finalResult = `<span>Good: ${rightAnswers} \\ ${count} </span>`
        } else if (rightAnswers === count) {
            finalResult = `<span>Excelent: ${rightAnswers} \\ ${count} </span>`
        } else if (rightAnswers < (count / 2 && rightAnswers > 0)) {
            finalResult = `<span>Try harder: ${rightAnswers} \\ ${count} </span>`
        } else {
            finalResult = `<span>Not good: ${rightAnswers} \\ ${count} </span>`
        }
        resultContainer.innerHTML = finalResult;
    }
}

function countDownFun(duration, count) {
    console.log(count);
    console.log(duration);
    if (qCount < count) {
        let minutes, seconds;
        countdownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countdownHolder.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {
                clearInterval(countdownInterval);
                subBtn.click();
            }
        }, 1000);
    }
}