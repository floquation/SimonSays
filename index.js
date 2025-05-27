/* **** *\
 * Main *
 * **** */


// Variables
var gameState;
var level;
var memory;
var iPress;
var started = false;
reset();

var audioDefeat = new Audio('sounds/wrong.mp3');
var audioButtons = [
    new Audio('sounds/red.mp3'),
    new Audio('sounds/orange.mp3'),
    new Audio('sounds/yellow.mp3'),
    new Audio('sounds/green.mp3')
];

// Register buttons
$(".button").on("click", function(event){
    onButtonClick(event.target);
});




/* ********* *\
 * Functions *
 * ********* */

function reset(){
    // console.log("Restarting...");
    gameState = "waitForNext";
    level = 0;
    memory = [];
    iPress = 0;

    // Press any key to (re)start
    if(started){
        $("#levelNr").parent().slideUp("fast");
        $("#anykey").slideDown("fast");
    }else{
        setTimeout(function(){
            if(!started) $("#anykey").slideDown("slow");
        },2000);
    }
    started = false;
    $(document).one("keypress", function(event){
        if(started) return;
        started = true;
        $("#anykey").slideUp("fast");
        gameLoop();
    });
    // $(document).one("click", function(event){ // <-- this bugs, somehow, making the restart instant
    //     if(started) return;
    //     started = true;
    //     $("#anykey").slideUp("fast");
    //     gameLoop();
    // });
}

function gameLoop(){
    // Reset
    document.querySelector("body").classList.remove("errbg");

    // Init
    gameState = "waitForNext";
    level++;
    iPress = 0;

    // Text
    // console.log("Begin!");
    $("#levelNr").parent().
        slideUp("fast", function(){$("#levelNr").text(level);}).
        slideDown("fast", function(){nextMemoryButton();});
}

function nextMemoryButton(){// Show next-in-line
    let randNr = Math.floor(Math.random()*4+1);
    let randButton = document.getElementById("button" + randNr);
    // console.log("New random: #button" + randNr + " = " + randButton);

    setTimeout(function(){
        memory.push(randNr); // add to queue
        audioButtons[randNr-1].play();
        flashButton(randButton);
    }, 500);
}

function flashButton(button){
    // console.log(button);
    $(button).fadeOut(200).fadeIn(200);
    button.classList.add("pressed");
    setTimeout(function(){
        button.classList.remove("pressed");
        playerTurn();
    }, 200);
}

function playerTurn(){
    gameState = "player";
}

function onButtonClick(button){
    if(gameState !== "player") return;

    // Animate
    button.classList.add("pressed");
    setTimeout(function(){
        button.classList.remove("pressed");
    }, 100);

    // Functionality
    buttonNr = parseInt(button.id.substring(6,7));
    audioButtons[buttonNr-1].play();
    // console.log("Button " + buttonNr + " pressed at iteration " + iPress + "; correct would be: " + memory[iPress]);
    
    if(buttonNr !== memory[iPress]){
        defeat();
    }else{
        // console.log("Correct.");
        iPress++;
        if(iPress >= memory.length){
            // console.log("done");
            gameLoop();
        }
    }
}

function defeat(){
    // console.log("DEFEATED!");
    audioDefeat.play();
    document.querySelector("body").classList.add("errbg");
    let anykey = document.getElementById("anykey");
    anykey.innerHTML = anykey.innerHTML.replace("start", "try again");
    reset();
}

