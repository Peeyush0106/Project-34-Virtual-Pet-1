// Global Variables in our game
var dog_norm, dog_hap;

var database;

var food_stock;

var playerCount = 0;

var playerCount_data;

var gameState;

var gameText;

var resetDogMoodTimer;

var counter;

var pet_hungry_text;

var pet_satis_text;

var max_pet_satis_time;

var inputName;
var button;
var greeting;

function setup() {
    createCanvas(500, 500);

    food_stock = 20;

    database = firebase.database();
    // stock_data = database.ref("Dog/Food/inStock");
    // stock_data.on("value", function (data) {
    //     food_stock = data.val();
    // });

    // playerCount_data = database.ref("PlayerDat/Count");
    // playerCount_data.on("value", function (data) {
    //     playerCount = data.val();
    // });

    console.log(playerCount);
    playerCount_data = database.ref("PlayerDat/Count");
    playerCount_data.on("value", function (data) {
        playerCount = data.val();
        console.log(playerCount);
    });

    updatePlayerCount();
    console.log(playerCount);

    // "15 * 30" means 15 seconds. 30 is the universal framerate
    max_pet_satis_time = 15 * 30;
    gameState = "solving-form";
    gameText = pet_hungry_text;
    counter = max_pet_satis_time;

    inputName = createInput("Your pet").attribute("place-holder", "Name").size(80).attribute("maxlength", 10);
    inputName.position(600, 65);
    button = createButton("Play");
    button.position(690, 65);
    up_arrow = createButton("Up Arrow");
    up_arrow.position(690, 450);
    up_arrow.mousePressed(function () {
        if (food_stock > 0 && gameState === "hungry") {
            food_stock -= 1;
            gameState = "satis";
            gameText = pet_satis_text;
        }
    });
    start_text = createElement('h2');
    start_text.position(400, 40);
    start_text.html("Your pet's name: ");
    button.mousePressed(function () {
        inputName.hide();
        button.hide();
        start_text.hide();
        greeting = createElement('h3');
        greeting.html("Your virtual pet '" + inputName.value() + "' is waiting for you.");
        greeting.position(380, 40);
        gameState = "hungry";
        pet_hungry_text = [(inputName.value() + "'s hungry."), ("Press the button above or 'Up Arrow' key on your keyboard to feed it milk.")];
        pet_satis_text = "You have fed " + inputName.value() + "!";
    });

    dog = new Sprite(200, 200, 100, 100, "images/Dog.png", "images/happydog.png", 1);
}

function draw() {
    // console.log(inputName.value());
    console.log(gameState);
    if (playerCount_data !== undefined) {
        background(46, 139, 87);
        if (gameState !== "solving-form") {
            resetDogMoodTimer = Math.round(counter / 30);
            imageMode(CENTER);
            if (gameState === "hungry") {
                dog.changePicture(dog.image1);
                gameText = [pet_hungry_text[0], pet_hungry_text[1]];
                push();
                fill("yellow");
                textSize(17.5);
                text(gameText[0], 15, 430, 498, 500);
                text(gameText[1], 15, 460, 498, 500);
                pop();
            }
            else {
                push();
                textSize(25);
                fill("yellow");
                text(gameText, 15, 430, 498, 500);
                pop();
            }
            if (keyDown("up") && food_stock > 0 && gameState === "hungry") {
                food_stock -= 1;
                gameState = "satis";
                gameText = pet_satis_text;
            }
            if (gameState === "satis") {
                dog.changePicture(dog.image2);
                if (resetDogMoodTimer > 0) {
                    counter -= 1;
                }
                else {
                    gameState = "hungry";
                    counter = max_pet_satis_time;
                }
            }
            // updateFoodStockCount();
            updateName();
            textSize(25);
            fill("blue");
            text("Food Left: " + food_stock, 30, 100);
            if (counter < 14.9 * 30) {
                push();
                textSize(17.5);
                fill("orange");
                text(inputName.value() + " will be hungry again in: " + resetDogMoodTimer + " seconds", 100, 150);
                pop();
            }
        }
        dog.display();
    }
}

function updatePlayerCount() {
    playerCount += 1;
    database.ref("PlayerDat").update({
        Count: playerCount
    });
}

function updateFoodStockCount() {
    database.ref("Dog/Food").update({
        inStock: food_stock
    });
}

// function updateName() {
//     var player = "player" + playerCount;
//     var resource = database.ref("PlayerDat");
//     // var id = player;
//     resource.update({
//         Name: player
//     });
// }
function updateName() {
    var playerIndex = "Player" + playerCount;
    name_of_row = "Name" + playerCount
    database.ref("PlayerDat").update({
        name_of_row: playerIndex
    });
}