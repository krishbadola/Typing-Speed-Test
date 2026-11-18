/* =========================================
   SPEED TYPING TEST
   HTML + CSS + JAVASCRIPT
========================================= */


/* =========================================
   TYPING PASSAGES
========================================= */

/* =========================================
   TYPING PASSAGES
========================================= */

const passages = {
    easy: [
        "Typing is an important computer skill. Practice regularly to improve your speed and accuracy.",
        "Learning to type faster can save time and make computer work easier and more productive.",
        "A good typing speed comes from practice, accuracy, and proper use of the keyboard.",
        "Regular typing practice helps you become faster and more confident while using a computer.",
        "Good typing skills are useful for students, programmers, writers, and office professionals.",
        "Daily typing practice can improve your speed and reduce the number of typing mistakes.",
        "The keyboard is one of the most important input devices used with a computer.",
        "Typing accurately helps you complete your work faster and more efficiently."
    ],

    medium: [
        "Web development combines creativity and programming to create interactive websites and useful digital applications.",
        "JavaScript allows developers to create dynamic web pages by responding to user actions and changing page content.",
        "HTML provides structure while CSS controls presentation and JavaScript adds behavior to modern web applications.",
        "Responsive web design allows websites to work properly on computers, tablets, and mobile devices.",
        "Frontend development focuses on creating the visual and interactive parts of a website.",
        "JavaScript can manipulate webpage elements and respond to different user interactions.",
        "Modern websites use multiple technologies to provide fast and interactive experiences.",
        "Learning HTML, CSS, and JavaScript provides a strong foundation for web development."
    ],

    hard: [
        "function calculateWPM(correctCharacters, timeInMinutes) { return (correctCharacters / 5) / timeInMinutes; }",
        "const numbers = [10, 20, 30, 40]; const total = numbers.reduce((sum, value) => sum + value, 0);",
        "document.getElementById('typing-input').addEventListener('input', function() { console.log('Typing detected'); });",
        "function greetUser(name) { const message = `Hello ${name}`; return message; } console.log(greetUser('Developer'));",
        "const scores = [45, 60, 72, 81]; const highest = Math.max(...scores); console.log(highest);",
        "function calculateAccuracy(correct, total) { return total === 0 ? 0 : (correct / total) * 100; }",
        "const user = { name: 'Developer', skills: ['HTML', 'CSS', 'JavaScript'] }; console.log(user.skills.length);",
        "const message = 'JavaScript is powerful'; console.log(message.toUpperCase());"
    ]
};

/* =========================================
   DOM ELEMENTS
========================================= */

const textDisplay =
    document.getElementById("text-display");

const typingInput =
    document.getElementById("typing-input");

const timerDisplay =
    document.getElementById("timer");

const wpmDisplay =
    document.getElementById("wpm");

const accuracyDisplay =
    document.getElementById("accuracy");

const errorsDisplay =
    document.getElementById("errors");

const restartButton =
    document.getElementById("restart-btn");

const result =
    document.getElementById("result");

const finalWpm =
    document.getElementById("final-wpm");

const finalAccuracy =
    document.getElementById("final-accuracy");

const finalErrors =
    document.getElementById("final-errors");

const finalTime =
    document.getElementById("final-time");

const leaderboardList =
    document.getElementById("leaderboard-list");

const difficultyButtons =
    document.querySelectorAll(".diff-btn");


/* =========================================
   VARIABLES
========================================= */

let currentDifficulty = "easy";

let currentText = "";

let timer = 60;

let timerInterval = null;

let testStarted = false;

let testFinished = false;

let startTime = null;

let correctCharacters = 0;

let totalTypedCharacters = 0;

let errors = 0;


/* =========================================
   LOAD RANDOM PASSAGE
========================================= */

function loadPassage() {

    const selectedPassages =
        passages[currentDifficulty];

    const randomIndex =
        Math.floor(
            Math.random() *
            selectedPassages.length
        );

    currentText =
        selectedPassages[randomIndex];

    textDisplay.innerHTML = "";

    /*Convert every character into an individual span.*/

    currentText.split("").forEach(
        (character, index) => {

            const span =
                document.createElement("span");

/*Preserve spaces.*/

            span.textContent =
                character === " "
                    ? "\u00A0"
                    : character;

            if (index === 0) {
                span.classList.add("active");
            }

            textDisplay.appendChild(span);

        }
    );
}


/* =========================================
   RESET TEST
========================================= */

function resetGame() {

    clearInterval(timerInterval);

    timer = 60;

    testStarted = false;

    testFinished = false;

    startTime = null;

    correctCharacters = 0;

    totalTypedCharacters = 0;

    errors = 0;

    timerDisplay.textContent = "60s";

    wpmDisplay.textContent = "0";

    accuracyDisplay.textContent = "100%";

    errorsDisplay.textContent = "0";

    timerDisplay.classList.remove("warning");

    typingInput.value = "";

    typingInput.disabled = false;

    result.classList.add("hidden");

    loadPassage();

    typingInput.focus();

}


/* =========================================
   START TIMER
========================================= */

function startTimer() {

    if (testStarted) {
        return;
    }

    testStarted = true;

    startTime = Date.now();

    timerInterval =
        setInterval(() => {

            timer--;

            timerDisplay.textContent =
                `${timer}s`;


            /*
               Final 10-second animation
            */

            if (timer <= 10) {

                timerDisplay.classList.add(
                    "warning"
                );

            }


            /*
               End test at zero
            */

            if (timer <= 0) {

                endGame();

            }


            updateStatistics();

        }, 1000);
}


/*HANDLE TYPING */

typingInput.addEventListener(
    "input",
    function () {

        if (testFinished) {
            return;
        }


        /*
           First keystroke starts timer.
        */

        if (!testStarted) {
            startTimer();
        }


        const typedText =
            typingInput.value;


        totalTypedCharacters =
            typedText.length;


        correctCharacters = 0;

        errors = 0;


        /*
           Get all character spans.
        */

        const characters =
            textDisplay.querySelectorAll(
                "span"
            );


        /*
           Compare each typed character
           with the original character.
        */

        characters.forEach(
            (span, index) => {

                span.classList.remove(
                    "correct",
                    "incorrect",
                    "active"
                );


                if (index < typedText.length) {

                    if (
                        typedText[index] ===
                        currentText[index]
                    ) {

                        span.classList.add(
                            "correct"
                        );

                        correctCharacters++;

                    } else {

                        span.classList.add(
                            "incorrect"
                        );

                        errors++;

                    }

                }

            }
        );


        /*
           Highlight current character.
        */

        if (
            typedText.length <
            currentText.length
        ) {

            characters[
                typedText.length
            ].classList.add("active");

        }


        updateStatistics();


        /*
           Automatically finish when
           complete passage is typed.
        */

        if (
            typedText.length >=
            currentText.length
        ) {

            endGame();

        }

    }
);


/* UPDATE WPM AND ACCURACY */

function updateStatistics() {

    /*
       Time used in minutes.
    */

    let elapsedSeconds;


    if (testStarted && startTime) {

        elapsedSeconds =
            (Date.now() - startTime) / 1000;

    } else {

        elapsedSeconds = 0;

    }


    /* Prevent division by zero.*/

    const elapsedMinutes =
        Math.max(
            elapsedSeconds / 60,
            1 / 60
        );


    /*
       WPM formula:

       WPM =
       (Correct Characters / 5)
       / Time in Minutes
    */

    const wpm =
        Math.round(
            (
                correctCharacters / 5
            ) /
            elapsedMinutes
        );

    /*
       Accuracy formula:

       Accuracy =
       Correct Characters /
       Total Typed Characters × 100
    */

    let accuracy = 100;

    if (totalTypedCharacters > 0) {

        accuracy =
            Math.round(
                (
                    correctCharacters /
                    totalTypedCharacters
                ) * 100
            );

    }


    wpmDisplay.textContent =
        Math.max(wpm, 0);

    accuracyDisplay.textContent =
        `${Math.max(accuracy, 0)}%`;

    errorsDisplay.textContent =
        errors;

}


/* =========================================
   END GAME
========================================= */

function endGame() {

    if (testFinished) {
        return;
    }

    testFinished = true;

    clearInterval(timerInterval);


    /*
       Disable typing input.
    */

    typingInput.disabled = true;


    /*
       Final calculations.
    */

    let elapsedSeconds;


    if (startTime) {

        elapsedSeconds =
            Math.min(
                (Date.now() - startTime) / 1000,
                60
            );

    } else {

        elapsedSeconds = 0;

    }


    const elapsedMinutes =
        Math.max(
            elapsedSeconds / 60,
            1 / 60
        );


    const finalWpmValue =
        Math.round(
            (
                correctCharacters / 5
            ) /
            elapsedMinutes
        );


    let finalAccuracyValue = 100;


    if (totalTypedCharacters > 0) {

        finalAccuracyValue =
            Math.round(
                (
                    correctCharacters /
                    totalTypedCharacters
                ) * 100
            );

    }


    /*
       Display final result.
    */

    finalWpm.textContent =
        Math.max(finalWpmValue, 0);

    finalAccuracy.textContent =
        `${Math.max(
            finalAccuracyValue,
            0
        )}%`;

    finalErrors.textContent =
        errors;

    finalTime.textContent =
        `${Math.round(
            elapsedSeconds
        )}s`;


    result.classList.remove("hidden");


    /*
       Save score to leaderboard.
    */

    saveScore(
        finalWpmValue,
        finalAccuracyValue
    );

}


/* =========================================
   SAVE SCORE
========================================= */

function saveScore(wpm, accuracy) {

    /*
       Get previous scores.
    */

    let leaderboard =
        JSON.parse(
            localStorage.getItem(
                "typingLeaderboard"
            )
        ) || [];


    /*
       Create new record.
    */

    const score = {

        wpm: Math.max(wpm, 0),

        accuracy: Math.max(
            accuracy,
            0
        ),

        difficulty:
            currentDifficulty,

        date:
            new Date().toLocaleDateString()

    };


    leaderboard.push(score);


    /*
       Sort by WPM.
    */

    leaderboard.sort(
        (a, b) => {

            if (b.wpm !== a.wpm) {

                return b.wpm - a.wpm;

            }

            return b.accuracy -
                   a.accuracy;

        }
    );


    /*
       Keep only top 5.
    */

    leaderboard =
        leaderboard.slice(0, 5);


    /*
       Save to browser.
    */

    localStorage.setItem(
        "typingLeaderboard",
        JSON.stringify(leaderboard)
    );


    displayLeaderboard();

}


/* =========================================
   DISPLAY LEADERBOARD
========================================= */

function displayLeaderboard() {

    const leaderboard =
        JSON.parse(
            localStorage.getItem(
                "typingLeaderboard"
            )
        ) || [];


    leaderboardList.innerHTML = "";


    if (leaderboard.length === 0) {

        const emptyItem =
            document.createElement("li");

        emptyItem.textContent =
            "No scores yet. Complete a test!";

        leaderboardList.appendChild(
            emptyItem
        );

        return;
    }


    leaderboard.forEach(
        (score, index) => {

            const li =
                document.createElement("li");


            const difficultyName =
                score.difficulty
                    .charAt(0)
                    .toUpperCase() +
                score.difficulty.slice(1);


            li.textContent =
                `${score.wpm} WPM — ` +
                `${score.accuracy}% — ` +
                `${difficultyName} — ` +
                `${score.date}`;


            leaderboardList.appendChild(
                li
            );

        }
    );

}


/* =========================================
   DIFFICULTY SELECTION
========================================= */

difficultyButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                /*
                   Remove active class
                   from all buttons.
                */

                difficultyButtons.forEach(
                    btn => {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                /*
                   Activate selected button.
                */

                button.classList.add(
                    "active"
                );


                /*
                   Change difficulty.
                */

                currentDifficulty =
                    button.dataset.difficulty;


                /*
                   Restart test.
                */

                resetGame();

            }
        );

    }
);


/* =========================================
   RESTART BUTTON
========================================= */

restartButton.addEventListener(
    "click",
    resetGame
);


/* =========================================
   INITIALIZE WEBSITE
========================================= */

loadPassage();

displayLeaderboard();

typingInput.focus();