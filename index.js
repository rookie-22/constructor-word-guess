// advanced js Constructor Word Guess

var Word = require('./Word.js');

var inquirer = require('inquirer');

var picked;
var pickedWord;
var guesses;
var guessesLeft;

// random prhases and words
var wordBank = ["Quality Time", "Lickety Split", "Speed", "Knuckle Down", "Under the Weather", "What Goes Up Must Come Down", "Money Doesn't Grow On Trees", "Yada Yada", "Believe", "Super Bowl", "Drive Me Nuts", "Acupuncture", "Tom Brady", "Not the Sharpest Tool in the Shed", "Forever", "Foo Fighters", "Rams", "USA", "Unleash the Power Within", "Private Jet"];

// random selection of word for game play
function randomWord(wordBank) {
    var index = Math.floor(Math.random() * wordBank.length);
    return wordBank[index];
}

// prompts for guess
var questions = [{
        name: 'letterGuessed',
        message: 'Guess a letter',
        validate: function (value) {
            var valid = (value.length === 1) && ('abcdefghijklmnopqrstuvwxyz'.indexOf(value.charAt(0).toLowerCase()) !== -1);
            return valid || 'Please enter a letter';
        },
        when: function () {
            return (!picked.allGuessed() && guessesLeft > 0);
        }
    },
    // reference of professor falcon is from the film war games in the 80s
    {
        type: 'confirm',
        name: 'playAgain',
        message: 'Do you want to play again professor falcon?',

        when: function () {
            return (picked.allGuessed() || guessesLeft <= 0);
        }
    }
];

// game reset

function resetGame() {
    pickedWord = randomWord(wordBank);
    picked = new Word(pickedWord);
    picked.makeGuess(' ');
    guesses = [];
    guessesLeft = 10;
}

function game() {
    if (!picked.allGuessed() && guessesLeft > 0) {
        console.log(picked + '');
    }

    inquirer.prompt(questions).then(answers => {
        if ('playAgain' in answers && !answers.playAgain) {
            console.log('thanks for playing');
            process.exit();
        }
        if (answers.playAgain) {
            resetGame();
        }
        if (answers.hasOwnProperty('letterGuessed')) {
            var currentGuess = answers.letterGuessed.toLowerCase();

            if (guesses.indexOf(currentGuess) === -1) {
                guesses.push(currentGuess);
                picked.makeGuess(currentGuess);
                if (pickedWord.toLowerCase().indexOf(currentGuess.toLowerCase()) === -1) {
                    guessesLeft--;
                }
            } else {
                console.log('You have already guessed that letter', currentGuess);
            }
        }

        if (!picked.allGuessed()) {
            if (guessesLeft < 1) {
                console.log('sorry, no more guesses');
                console.log(pickedWord, 'that is correct.');

            } else {
                console.log('guesses so far:', guesses.join(' '));
                console.log('guesses remainig:', guessesLeft);
            }
        } else {
            console.log(pickedWord, 'is the correct word!');
        }

        game();
    });
}

resetGame();

game();