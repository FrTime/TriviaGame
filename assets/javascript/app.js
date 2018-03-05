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
    if (triviaGameObj.questionsAnswered === 10) {
      // Clearing the content box for when the game is restarted after ending, this will not run if the user has not answered 10 questions
      $(".content-box").empty();
      triviaGameObj.answersArr = [];
      triviaGameObj.roundActive = false;
      // Building the content box
      $(".content-box").html(
        `
        <br>
        <h5> Game Over! </h5>
        <br>
        <p> Questions Answered: ${triviaGameObj.questionsAnswered} </p>
        <br>
        <p> Questions Correct: ${triviaGameObj.questionsRight} </p>
        <br>
        <p> Questions Incorrect: ${triviaGameObj.questionsWrong} </p>
        <br>
        <div class="btn game-start">Play Again?</div>
        `
      );
      // This will run every new question until the 10th question has been answered
    } else {
      // Emptying the content box
      $(".content-box").empty();
      triviaGameObj.answersArr = [];
      // Rebuilding the content box
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
      // Linking to an API to grab math-themed questions
      var queryURL = "https://opentdb.com/api.php?amount=1&category=19";
      // Using an AJAX function to extract the question data we want from a JSON object obtained from the API and setting them to our local variables
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
        // Pushing the incorrect answers into an empty array that will be used to generate dynamic buttons
        // The correct answer is then spliced into this array at a random index so that it is not always in the same position
        for (i = 0; i < response.results[0].incorrect_answers.length; i++) {
          triviaGameObj.answersArr.push(
            response.results[0].incorrect_answers[i]
          );
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
      // Creating  dynamic buttons for each answer to the question
      // This function is delayed by 1.5 seconds so that the AJAX function has time to grab a question through the API
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
        // Setting the game timer to an intial count of 20 seconds, this will increment down by one every second with another function
        triviaGameObj.countdownTimer = 20;
        triviaGameObj.roundActive = true;
        $(".game-timer").text(
          triviaGameObj.countdownTimer + " seconds remaining."
        );
        triviaGameObj.roundActive = true;
        triviaGameObj.questionTimer();
        // Grabbing the div that will display our score and updating with the current round's variables
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
      }, 1500);
      console.log("Question Picker Check");
    }
  },

  // This function will run when the user presses the 'Start Game' button and set all the inital parameters
  gameStart: function() {
    $(".start-div").empty();
    $(".content-box").empty();
    triviaGameObj.initializeGame();
    triviaGameObj.getQuestion();
    console.log("Game started!");
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
    triviaGameObj.questionsAnswered = 0;
    triviaGameObj.questionsRight = 0;
    triviaGameObj.questionsWrong = 0;
  },

  // This function will compare the user selected answer to the correct answer each round by grabbing the attribute of the button clicked
  compareAnswer: function() {
    triviaGameObj.chosenAnswer = $(this).attr("answer-text");
    console.log("Chosen answer: " + triviaGameObj.chosenAnswer);
    // This will run when the user is correct and increment the win counter
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
      // This will run when the user is incorrect and increment the loss counter
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

// These functions run outside of the game object so that they are always accessible
// They allow the nested functions to be called when the user clicks on an element within the HTML page
$(document).on("click", ".answer", triviaGameObj.compareAnswer);
$(document).on("click", ".game-start", triviaGameObj.gameStart);
