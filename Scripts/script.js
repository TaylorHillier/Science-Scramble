"use strict";

/////////////////////////////////////////////////////////////////////////////////

const normalWordPool = [
    "atom", "cell", "gene", "data", "virus", "acid", "DNA", "plant", "blood", "brain", "fungi", "force", "light", "magma", "organ", "insect", "space", "energy", "sound", "earth", "micro", "radio", "water", "taste", "sight", "smell", "touch", "phage", "stone", "metal", "glass", "solid", "liquid", "plasma", "matter", "phase", "image", "field", "level", "speed", "scale", "system", "power", "gravity", "theory", "chemical", "biology", "physics", "mathematics", "statistics", "atom", "bond", "mass", "spin", "heat", "wave", "light", "charge", "force", "field", "energy", "space", "time", "neutron", "proton", "element", "radiation", "astronomy", "compound", "molecule", "genetics", "evolution", "species", "fossil", "cell", "plasma", "organism", "respiration", "sympathy", "immune", "enzyme", "catalyst", "replication", "mutation", "germ", "clone", "chromosome", "heritage", "genome", "cytosol", "hormone", "chemistry", "organic", "ecology"
];

/////////////////////////////////////////////////////////////////////////////////

const hardWordPool = [
    "physics", "biology", "chemistry", "genetics", "ecology", "astronomy", "geology", "physics", "botany", "zoology", "anatomy", "organic", "molecule", "organism", "nucleus", "enzyme", "gravity", "radiation", "ecosystem", "evolution", "species", "fossil", "matter", "energy", "entropy", "virus", "gene", "cell", "atom", "nuclei", "plasma", "force", "light", "microbe", "climate", "phenomenon", "magnetic", "organ", "protein", "cancer", "mutation", "theory", "chemical", "carbon", "hydrogen", "oxygen", "nitrogen", "element", "periodic", "reaction", "catalyst", "compound", "magnetism", "gravity", "thermodynamics", "einstein", "newton", "quantum", "bacteria", "vaccine", "antibody", "ecosystem", "photosynthesis", "mitosis", "meiosis", "eukaryote", "prokaryote", "amphibian", "reptile", "mammal", "invertebrate", "vertebrate", "ecological", "biological", "biochemistry", "neuroscience", "geography", "paleontology", "bioinformatics", "microbiology", "immunology", "biotechnology", "astrophysics", "bioengineering", "geophysics", "botanical", "zoological"
];

/////////////////////////////////////////////////////////////////////////////////

const gameObject = {

    /////////////////////////////////////////////////////////////////////////////////
    //All game variables
    playerName: null,
    roundCount: 0,
    maxRound: 50,
    playerScore: 0,

    roundTimeRemaining: 20000,
    roundTimeMax: 20000,
    timerLoop: 1000,
    roundIntervals: [],

    difficulty: "",
    difficulties: ['normal', 'hard'],

    gameMode: "",
    allGameModes: ['frenzy', 'classic'],

    word: "",
    randomizedWord: "",
    wordPool: "",

    //Frenzy mode
    playerLives: 3,
    roundTimeDecrement: 5000,
    frenzyScore: 100,
    gameTimeMax: 121000,
    gameTimeRemaining: 121000,

    isRunning: false,
    /////////////////////////////////////////////////////////////////////////////////

    // Buttons and Inputs
    $guessBtn: $('#guessSubmit'),
    $addPlayerBtn: $('#addPlayerBtn'),
    $nameInput: $('#playerNames'),
    $myModal: $('#instructions-screen'),
    $startGameBtn: $('#startGameBtn'),


    /////////////////////////////////////////////////////////////////////////////////

    //displays username player is inputting on screen above the input
    displayPlayerOnType: function () {
        gameObject.$nameInput.off("click").on("click", function () {
            gameObject.$nameInput.val(''); //clears default value
            gameObject.$addPlayerBtn.prop("disabled", false); //enables add player button
        });

        gameObject.$nameInput.off("input").on('input', function () {
            $("#name-display div:nth-child(2)").html('<div>' + $(this).val() + '</div>'); //clone input to name display
            gameObject.$nameInput.css({ "border-color": "#5b7c99" }); //styling
        });

        this.isRunning = false; // stop running 
    },

    addPlayer: function () {
        this.playerName = gameObject.$nameInput.val(); //obtain player name

        if (this.playerName.trim() === '') {
            // Input field is empty, display an error message
            gameObject.$nameInput.css({ "border-color": "red" }); //add red border
            $('#errorMessage').removeClass("hidden");
            return;
        }

        //if player name was valid, hide input 
        $('#name-input-container div:first-child').addClass("hidden");
        $('#addPlayerBtn').addClass('hidden');
        $('#playerNames').addClass('hidden');

        //check if player had already been added from a prior round
        if (!this.isRunning) {
            this.selectDifficulty(); //if not enable difficulty selection

            //enable all selections for gamemode and difficulty
            $('#frenzyBtn').prop("disabled", false);
            $('#ClassicBtn').prop("disabled", false);
            $('#normalBtn').prop("disabled", false);
            $('#hardBtn').prop("disabled", false);

            this.isRunning = true;
        }
    },

    /////////////////////////////////////////////////////////////////////////////////

    //move event handlers outside of functions so they arent called each time they are clicked
    selectDifficulty: function () {
        $('#normalBtn').on("click", gameObject.selectNormalDifficulty);
        $('#hardBtn').on("click", gameObject.selectHardDifficulty);
    },

    selectNormalDifficulty: function () {
        //checks if difficulty is normal
        if (gameObject.difficulty !== gameObject.difficulties[0]) {
            gameObject.difficulty = gameObject.difficulties[0];

            gameObject.wordPool = normalWordPool;// sets word pool to easy word pool

            //displays normal difficulty as selected
            $('#normalBtn').prop("disabled", true);
            $('#hardBtn').prop("disabled", false);

            gameObject.checkStartGameBtn(); //checks if start game button should be enabled
        }
    },

    selectHardDifficulty: function () {
        //checks if difficulty is hard
        if (gameObject.difficulty !== gameObject.difficulties[1]) {
            gameObject.difficulty = gameObject.difficulties[1];

            gameObject.wordPool = hardWordPool;// sets word pool to hard word pool

            $('#hardBtn').prop("disabled", true);
            $('#normalBtn').prop("disabled", false);

            gameObject.checkStartGameBtn(); //checks if start game button should be enabled
        }
    },

    selectFrenzyMode: function () {
        //checks if gamemode is frenzy
        if (gameObject.gameMode !== gameObject.allGameModes[0]) {
            gameObject.gameMode = gameObject.allGameModes[0];

            $('#frenzyTimer').removeClass("hidden");
            $('#frenzyBtn').prop("disabled", true);
            $('#ClassicBtn').prop("disabled", false);

            gameObject.checkStartGameBtn(); //checks if start game button should be enabled
        };
    },

    selectClassicMode: function () {
        //checks if gamemode is classic
        if (gameObject.gameMode !== gameObject.allGameModes[1]) {
            gameObject.gameMode = gameObject.allGameModes[1];

            $('#ClassicBtn').prop("disabled", true);
            $('#frenzyBtn').prop("disabled", false);

            gameObject.checkStartGameBtn(); //checks if start game button should be enabled
        };
    },

    /////////////////////////////////////////////////////////////////////////////////

    //checks if start game button should be enabled
    checkStartGameBtn: function () {
        if (gameObject.gameMode !== '' && gameObject.difficulty !== '') {
            $('#startGameBtn').prop("disabled", false);
        } else {
            $('#startGameBtn').prop("disabled", true);
        }
    },

    startGame: function () {
        //Checks to see if a gamemmode and difficulty have been selected. If both have, the game is able to be started
        if (gameObject.gameMode === '' && gameObject.difficulty === '') {
            $('#startGameBtn').prop("disabled", true);
        } else {
            $('#startGameBtn').prop("disabled", false);
        };

        gameObject.playerScore = 0; // Reset player score
        gameObject.roundCount = 0; // Reset round count


        $('#scoreCounter').text(this.playerName + "  's Score: " + this.playerScore);
        gameObject.checkStartGameBtn();
    },

    //  Was having issues with start game not running. Moving the handling method outside of the start game reasoning fixed the issue
    handleStartGame: function () {
        if (gameObject.gameMode === "classic") {
            gameObject.generateWord(); //start round
            gameObject.roundTimer(); //start timer
            $('#frenzyTimer').addClass("hidden");
        } else if (gameObject.gameMode === "frenzy") {
            gameObject.frenzyMode(); // initiate frenzy mode
            gameObject.generateWord(); //start round
            gameObject.gameTimer(); //start timers
            gameObject.roundTimer();
        }

        setTimeout(() => { //change screens with small delay
            $('#splash-screen').addClass("hidden").removeClass("splashScreen");
            $('#game-screen').removeClass("hidden");
            $('#quitBtn').removeClass("hidden");
        }, 500);
    },

    /////////////////////////////////////////////////////////////////////////////////

    generateWord: function () {
        this.word = this.wordPool[Math.floor(Math.random() * this.wordPool.length)]; // pick a random word from selected wordpool
        this.randomizeWord(); //randomize the word
    },

    randomizeWord: function () {
        this.splitWord = this.word.split(''); // split word into seperate characters
        //Implementation of Durstenfeld shuffle to randomize letters
        for (let i = this.splitWord.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [this.splitWord[i], this.splitWord[j]] = [this.splitWord[j], this.splitWord[i]];
            this.randomizedWord = this.splitWord.join("");
        };
        gameObject.displayRandomizedWord(); //display the word
    },

    displayRandomizedWord: function () {
        $('#scrambledWord').html(this.randomizedWord);
        gameObject.round(); //start round after scrambled word is generated and displayed
    },

    round: function () {

        this.roundCount++; //iterates round (starts at 0)
        if (gameObject.gameMode === "classic") {
            if (this.roundCount === gameObject.maxRound) { //stops game if at round 50
                gameObject.continueOrQuitMenu();
                return;
            }
            $('#roundCounter').text("Round: " + this.roundCount); //iterates round
        } else if (gameObject.gameMode === "frenzy") {
            $('#roundCounter').text("Round: " + this.roundCount); //iterates round
        }

    },

    /////////////////////////////////////////////////////////////////////////////////

    frenzyMode: function () {
        //make sure player lives are initiated to 3
        this.playerLives = 3;

        //show game timer
        $('#mins').removeClass("hidden");
        $('#colon').removeClass("hidden");
        $('#playerLives').removeClass("hidden");


        gameObject.roundTimeRemaining = 10000; //set at 10 seconds for frenzy mode
        $('#secs').text(10);//display initial time
        gameObject.resetGameTimer();  //make sure game timer is reset

        this.updatePlayerLives(); //initialize the playerlives display to 3
    },

    updatePlayerLives: function () {
        $('#playerLives').text("Lives left: " + this.playerLives); //display current player lives
    },

    decreasePlayerLives: function () {
        this.playerLives--;
        this.updatePlayerLives(); //update player lives after they have lost one
        if (this.playerLives === 0) {
            this.continueOrQuitMenu(); //quit game if player has no lives left
        }

        this.isDecrementing = false; // make sure more than one life cant be taken per turn
    },

    gameTimer: function () {
        this.isRunning = true; //timer is running

        this.gameInterval = window.setInterval(() => {

            this.gameTimeRemaining -= this.timerLoop; //subtract time

            $('#minsF').text(Math.floor((this.gameTimeRemaining / 60000)));//mins calculation
            $('#secsF').text(Math.floor((this.gameTimeRemaining / 1000) % 60));//secs calculation
            if (Math.floor(((this.gameTimeRemaining / 1000) % 60) < 10)) {
                $('#secsF').text("0" + Math.floor((this.gameTimeRemaining / 1000) % 60)); //display extra 0 if seconds is less than 10
            }

            if (this.gameTimeRemaining < 1) {
                window.clearInterval(this.gameInterval); //pause game
                $('#secsF').text("0"); //set time to 0
                gameObject.resetGameTimer(); //ensure timer is reset if player restarts game
                gameObject.continueOrQuitMenu(); // quit game
            }
        }, this.timerLoop);
    },

    resetGameTimer: function () {
        this.isRunning = false;
        //find most recent interval ID by "popping" most recent ID that was "pushed" to back of array
        window.clearInterval(this.gameInterval); //pause game
        this.gameTimeRemaining = this.gameTimeMax; //reset game time
    },

    pauseGameFrenzy: function () {
        this.isRunning = false;
        window.clearInterval(this.gameInterval); // pause game
    },

    checkFrenzyAnswer: function () {
        this.playerGuess = $('#playerGuess').val(); // obtain player guess
        if (this.playerGuess.trim() === '') {
            // Ignore blank guesses
            $('#playerGuess').val('');
            return;
        };

        if (gameObject.word === this.playerGuess) { //if guess is right
            gameObject.scorePoints(); //score points
            gameObject.generateWord(); //new round
            gameObject.resetRoundTimer(); //reset timer
            gameObject.roundTimer(); //start timer
            $('#playerGuess').val(''); //clear input
            this.isDecrementing = false; // Reset the flag since the answer was correct
        } else {
            if (!this.isDecrementing) { // Check if lives have already been decreased
                gameObject.decreasePlayerLives(); //player loses life
                $('#playerGuess').val(''); //clear input
                this.isDecrementing = true; // Set the flag to indicate that lives has been decreased already
            }
        }
    },

    /////////////////////////////////////////////////////////////////////////////////

    checkClassicAnswer: function () {
        //obtain player guess
        this.playerGuess = $('#playerGuess').val();

        // Ignore blank guesses
        if (this.playerGuess.trim() === '') {
            $('#playerGuess').val('');
            return;
        };

        // if guess is correct, assign points, start new round
        if (gameObject.word === this.playerGuess) {
            gameObject.scorePoints(); //score points
            gameObject.generateWord(); //start round
            gameObject.resetRoundTimer(); //reset timer
            gameObject.roundTimer();//start timer
            $('#playerGuess').val('');//clear input
        } else {
            $('#playerGuess').val('');//clear input
        }
    },

    //delegates which parameters to use based on game mode
    checkAnswer: function () {
        if (gameObject.gameMode === "classic") {
            gameObject.checkClassicAnswer();
        } else if (gameObject.gameMode === "frenzy") {
            gameObject.checkFrenzyAnswer();
        }
    },

    //Iterates and displays changes in points for each game mode
    scorePoints: function () {
        if (gameObject.gameMode === "classic") {
            this.playerScore += Math.floor(100 * Math.pow(this.roundTimeRemaining / gameObject.roundTimeMax, 2));
            $('#scoreCounter').text(this.playerName + "  's Score: " + this.playerScore);
        } else if (gameObject.gameMode === "frenzy") {
            this.playerScore += this.frenzyScore;
            $('#scoreCounter').text(this.playerName + "  's Score: " + this.playerScore);
        }
    },

    //Keeps track of the round timer
    roundTimer: function () {
        //Sets is running property to true
        this.isRunning = true;

        //will set max round times based on time remaining left in the game if in frenzy mode
        if (gameObject.gameMode === "frenzy") {
            this.roundTimeMax = 10000;
            if (gameObject.gameTimeRemaining < 90000) {
                this.roundTimeMax = 10000;
            } else if (gameObject.gameTimeRemaining < 30000) {
                this.roundTimeMax = 5000;
            }
        };

        //keeps track of each new interval set by sending each new ID to array so that when rounds change and function is called again current ID is known
        const roundInterval = window.setInterval(() => {

            //handles calculation of minutes and seconds displays
            $('#mins').text(Math.floor((this.roundTimeRemaining / 60000))).addClass("hidden");
            $('#secs').text(Math.floor(((this.roundTimeRemaining) / 1000) % 60));
            if (Math.floor(((this.roundTimeRemaining / 1000) % 60) < 10)) {
                $('#secs').text("0" + Math.floor((this.roundTimeRemaining / 1000) % 60));
            };

            this.roundTimeRemaining -= this.timerLoop;

            if (this.roundTimeRemaining < 1) {
                window.clearInterval(roundInterval); //pause timer
                gameObject.resetRoundTimer(); // reset timer
                if (gameObject.gameMode === "classic")//exits to game over screen if time in round runs out
                    gameObject.continueOrQuitMenu();
                if (gameObject.gameMode === "frenzy") {//if player has lives left they will lose a life and new round will start
                    gameObject.decreasePlayerLives();
                    gameObject.resetRoundTimer();
                    gameObject.roundTimer();
                }
            }
        }, this.timerLoop);


        // Stores ID in array
        this.roundIntervals.push(roundInterval);

        // add score display after all other processes are finished to ensure playerscore and player name have been set, as well as no other functions can mess with the values
        $('#scoreCounter').text(this.playerName + "  's Score: " + this.playerScore);
    },

    resetRoundTimer: function () {
        //stop game running
        this.isRunning = false;
        // Clear all previous round intervals
        for (let i = 0; i < this.roundIntervals.length; i++) {
            window.clearInterval(this.roundIntervals[i]);
        }
        this.roundIntervals = []; // Clear the round intervals array
        this.roundTimeRemaining = this.roundTimeMax; //reset round time
    },

    pauseGame: function () {
        //stop game running
        this.isRunning = false;
        //clear interval of most recent round interval
        for (let i = 0; i < this.roundIntervals.length; i++) {
            window.clearInterval(this.roundIntervals[i]);
        };
    },

    /////////////////////////////////////////////////////////////////////////////////

    showInstructions: function () {
        if ($('body').hasClass("modal-open") && $('#splash-screen').hasClass("hidden")) {//check if modal is open and game is running
            if (gameObject.gameMode === "classic") {
                gameObject.pauseGame(); //pause round timer
            } else if (gameObject.gameMode === "frenzy") {
                //pause both timers if in frenzy mode
                gameObject.pauseGameFrenzy();
                gameObject.pauseGame();
            };
        };
    },

    closeInstructions: function () {
        //make sure to only start timers if in game
        if ($('#splash-screen').hasClass("hidden")) {
            if (gameObject.gameMode === "classic") {
                //start timer when instructions are closed
                gameObject.roundTimer();
                gameObject.isRunning = true;
            } else if (gameObject.gameMode === "frenzy") {
                if (!gameObject.isRunning) { // Add a check to prevent starting the timers multiple times
                    gameObject.gameTimer();// start both timers
                    gameObject.roundTimer();
                    gameObject.isRunning = true;
                };
            };
        };
    },


    /////////////////////////////////////////////////////////////////////////////////


    continueOrQuitMenu: function () {
        //change to game over screen
        $('#game-screen').addClass("hidden");
        $('.gameOver').removeClass("hidden");

        //update contents of game over screen
        $('#game-over h1:first-child').html("Game Over, " + gameObject.playerName + ".")
        $('#scoreStat').text("Your score was: " + gameObject.playerScore);
        $('#roundStat').text("You made it to round: " + gameObject.roundCount);

        //stop game running
        gameObject.isRunning = false;

        //logic for back to menu
        $('#backToMenu').on("click", function () {

            //handle hiding and showing necessary elements
            $('.gameOver').addClass("hidden");
            $('#quitBtn').addClass("hidden");
            $('#splash-screen').removeClass("hidden").addClass("splashScreen");
            $('#addPlayerBtn').removeClass('hidden');
            $('#playerNames').removeClass('hidden');
            $('#playerLives').addClass("hidden");
            $('#frenzyTimer').addClass("hidden");

            //clear name input 
            gameObject.$nameInput.val('');

            //reset score counter and prior name display
            $('#scoreCounter').text(gameObject.playerName + "  's Score: " + gameObject.playerScore);
            $("#name-display div:nth-child(2)").html('');

            // make sure all buttons are reset before heading back to splash screen
            $('#normalBtn').prop("disabled", false);
            $('#hardBtn').prop("disabled", false);
            $('#frenzyBtn').prop("disabled", false);
            $('#ClassicBtn').prop("disabled", false);
            $('#quitBtn').prop("disabled", false);

            //reset timers
            gameObject.resetGameTimer();
            gameObject.resetRoundTimer();
            gameObject.checkStartGameBtn(); // disable start game button
            gameObject.init(); //reset all variables
        });

        $('#restart').on("click", function () {
            //reset timers
            gameObject.resetGameTimer();
            gameObject.resetRoundTimer();
            //start game based on game mode
            gameObject.handleStartGame(); //start game again based on game mode
            gameObject.startGame(); // Reset the playerscore and round count
            gameObject.generateWord(); // generate word and start new round

            if (gameObject.gameMode === "frenzy") {
                gameObject.frenzyMode(); // start game in frenzy mode
                gameObject.gameTimer(); // start frenzy mode game timer
            };

            $('#playerGuess').val(''); //clear any previous characters
            $('#quitBtn').prop("disabled", false); //enable quit button

            //delay for user experience
            setTimeout(() => {
                $('#splash-screen').addClass("hidden").removeClass("splashScreen");
                $('#game-screen').removeClass("hidden");
                $('#game-over').addClass("hidden");
            }, 500);
        });
    },

    /////////////////////////////////////////////////////////////////////////////////

    init: function () {

        //set all variables to initial states
        /////////////////////////////////////////////////////////////////////////////////
        gameObject.isRunning = false;
        gameObject.playerName = null;
        gameObject.roundCount = 0;
        gameObject.maxRound = 50;
        gameObject.playerScore = 0;
        gameObject.roundTimeRemaining = 20000;
        gameObject.roundTimeMax = 20000;
        gameObject.timerLoop = 1000;
        gameObject.roundIntervals = [];

        gameObject.difficulty = "";
        gameObject.difficulties = ['normal', 'hard'];

        gameObject.gameMode = "";
        gameObject.allGameModes = ['frenzy', 'classic'];

        gameObject.word = "";
        gameObject.randomizedWord = "";
        gameObject.wordPool = "";

        //Frenzy mode
        gameObject.playerLives = 3;
        gameObject.roundTimeDecrement = 5000;
        gameObject.frenzyScore = 100;
        gameObject.gameTimeMax = 121000;
        gameObject.gameTimeRemaining = 121000;
        /////////////////////////////////////////////////////////////////////////////////

        //add player button to be initialized every time splash menu is opened
        gameObject.$addPlayerBtn.prop("disabled", true);
        gameObject.$addPlayerBtn.on("click", function () {
            gameObject.addPlayer();
        });

        //make sure players cannot select game modes or start game until player is added each round
        $('#startGameBtn').prop("disabled", true);
        $('#normalBtn').prop("disabled", true);
        $('#hardBtn').prop("disabled", true);
        $('#frenzyBtn').prop("disabled", true);
        $('#ClassicBtn').prop("disabled", true);
        $('#startGameBtn').off("click").on("click", gameObject.handleStartGame);
    },


}

gameObject.init();

//all event handlers that only need to be initialized once
/////////////////////////////////////////////////////////////////////////////////
gameObject.$guessBtn.off("click").on("click", function () {
    gameObject.checkAnswer();
});

$('#playerGuess').keyup(function (event) {
    if (event.keyCode === 13) {
        gameObject.$guessBtn.click();
    };
});
/////////////////////////////////////////////////////////////////////////////////
$('#playerNames').on("input", gameObject.displayPlayerOnType());
/////////////////////////////////////////////////////////////////////////////////
$('#frenzyBtn').off("click").on("click", gameObject.selectFrenzyMode);
$('#ClassicBtn').off("click").on("click", gameObject.selectClassicMode);
/////////////////////////////////////////////////////////////////////////////////
$('#quitBtn').off("click").on("click", function () {
    $('#quitBtn').prop("disabled", true);
    gameObject.continueOrQuitMenu();
    gameObject.pauseGame();
    gameObject.pauseGameFrenzy();
});
/////////////////////////////////////////////////////////////////////////////////
$('#helpBtn').on("click", function () {
    gameObject.showInstructions();
});

$('#closeInstructions').on("click", function () {
    setTimeout(gameObject.closeInstructions(), 250);
});
/////////////////////////////////////////////////////////////////////////////////