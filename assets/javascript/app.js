// The trivia game will be contained inside of the following object
var triviaGameObj = {
  // These will be the variables and counters used throughout the game
  countdownTimer: 0,
  questionsAnswered: 0,
  questionsRight: 0,
  questionsWrong: 0,
  answersArr: [],
  currentQuestion: "",
  correctAnswer: "",
  chosenAnswer: "",

  // This will change depending on the game conditions so that the timer can be paused and started without having to reset
  roundActive: false,

  // This will be used as a timer for window popups to display the correct answers
  newWindowTimer: 0,

  // This function will be used for placing the correct answer randomly among the incorrect answers
  getRandom: function(min, max) {
    // min = inclusive, max = exclusive
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  },

  // This function generates a random math-themed question from an online trivia API
  getQuestion: function() {
    $(".content-box").empty();
    triviaGameObj.answersArr = [];
    $(".content-box").html(
        `
        <div class="game-question"></div>
        <div class="game-timer"></div>
        <div class="game-score"></div>
        <br>
        <div class="game-answers"></div>
        <br>
        `
      );
    var queryURL = "https://opentdb.com/api.php?amount=1&category=19";
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      triviaGameObj.currentQuestion = response.results[0].question;
      triviaGameObj.correctAnswer = response.results[0].correct_answer;
      console.log(triviaGameObj.currentQuestion);
      console.log(response);
      $(".game-question").html(
        "<h5>" + triviaGameObj.currentQuestion + "</h5><br>"
      );
      for (i = 0; i < response.results[0].incorrect_answers.length; i++) {
        triviaGameObj.answersArr.push(response.results[0].incorrect_answers[i]);
        console.log(triviaGameObj.answersArr);
      }
      triviaGameObj.answersArr.splice(
        triviaGameObj.getRandom(0, triviaGameObj.answersArr.length),
        0,
        response.results[0].correct_answer
      );
      console.log(triviaGameObj.answersArr);
    });
    $(".game-answers").empty();
    // Creates buttons for each answer to the question
    setTimeout(function() {
      for (var k = 0; k < triviaGameObj.answersArr.length; k++) {
        var a = $("<button>");
        a.addClass("waves-effect waves-light btn answer");
        // Added an attribute that we will be able to call later as our variable
        a.attr("answer-text", triviaGameObj.answersArr[k]);
        // Setting the text of the button to our answers
        a.html(triviaGameObj.answersArr[k]);
        // Adding the buttons to the page so they can be clicked
        $(".game-answers").append(a);
        console.log("Button check");
      }
      triviaGameObj.countdownTimer = 20;
      triviaGameObj.roundActive = true;
      $(".game-timer").text(
        triviaGameObj.countdownTimer + " seconds remaining."
      );
      triviaGameObj.roundActive = true;
      triviaGameObj.questionTimer();

      $(".game-score").html(
        `
        <br>
        <p> Questions Answered: ${triviaGameObj.questionsAnswered} </p>
        <br>
        <p> Questions Correct: ${triviaGameObj.questionsRight} </p>
        <br>
        <p> Questions Incorrect: ${triviaGameObj.questionsWrong} </p>
        <br>
        `
      );
    }, 1250);
    console.log("Question Picker Check");
  },

  // This function will run when the user presses the 'Start Game' button and set all the inital parameters
  gameStart: function() {
      $(".start-div").empty();
      triviaGameObj.initializeGame();
      triviaGameObj.getQuestion();
  },

  // This function will decrease the question timer when run until it reaches zero
  timer: function() {
    if (triviaGameObj.countdownTimer > 0) {
      triviaGameObj.countdownTimer--;
      $(".game-timer").text(
        triviaGameObj.countdownTimer + " seconds remaining."
      );
      console.log("timer check true");
    }
    if (triviaGameObj.countdownTimer === 0) {
      triviaGameObj.roundActive = false;
      console.log("timer check false");
      triviaGameObj.compareAnswer();
    }
  },

  // This function will run the timer function every 1 second while the round is active
  questionTimer: function() {
    if (triviaGameObj.roundActive) {
      intervalID = setInterval(triviaGameObj.timer, 1000);
      console.log("question timer check");
    }
  },

  // This function will pause the stop the timer function and set the round to inactive
  timerStop: function() {
    clearInterval(intervalID);
    triviaGameObj.roundActive = false;
  },

  // This function will reset our parameters between questions
  initializeGame: function() {
    triviaGameObj.countdownTimer = 20;
    triviaGameObj.answersArr = [];
    triviaGameObj.currentQuestion = "";
    triviaGameObj.correctAnswer = "";
    triviaGameObj.chosenAnswer = "";
  },

  compareAnswer: function() {
    triviaGameObj.chosenAnswer = $(this).attr("answer-text");
    console.log("Chosen answer: " + triviaGameObj.chosenAnswer);
    if (triviaGameObj.chosenAnswer === triviaGameObj.correctAnswer) {
      console.log("Correct!");
      triviaGameObj.timerStop();
      triviaGameObj.questionsAnswered++;
      triviaGameObj.questionsRight++;
      $(".content-box").empty();
      $(".content-box").html(
        `
        <h2> Correct! </h2>
        `
      );
      intervalID = setTimeout(triviaGameObj.getQuestion, 3000);
    } else {
      console.log("Incorrect!");
      console.log("The correct answer is: " + triviaGameObj.correctAnswer);
      triviaGameObj.timerStop();
      triviaGameObj.questionsAnswered++;
      triviaGameObj.questionsWrong++;
      $(".content-box").empty();
      $(".content-box").html(
        `
        <h2> Incorrect! </h2> <br>
        <h3> The correct answer was ${triviaGameObj.correctAnswer}. </h3>
        `
      );
      intervalID = setTimeout(triviaGameObj.getQuestion, 3000);
    }
  }
};

// triviaGameObj.getQuestion();

$(document).on("click", ".answer", triviaGameObj.compareAnswer);
$(document).on("click", ".game-start", triviaGameObj.gameStart);
