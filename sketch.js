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

var txt1, txt2, txt3;

function setup() {
    createCanvas(700, 500);

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
    playerCount_data = database.ref("PlayerDat/Count").on("value", function (data) {
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

    inputName = createInput("Your pet").attribute("place-holder", "Name").size(80).attribute("maxlength", 10).position(600, 65).style("background-color", "yellow");
    up_arrow = createButton("Up Arrow").hide().position(690, 450).style("color", "blue").style("background-color", "yellow").mousePressed(function () {
        if (food_stock > 0 && gameState === "hungry") {
            food_stock -= 1;
            gameState = "satis";
            gameText = pet_satis_text;
        }
    });
    start_text = createElement('h2').position(400, 40).html("Your pet's name: ");
    button = createButton("Play").position(690, 65).style("background-color", "blue").style("color", "white").mousePressed(function () {
        inputName.hide();
        button.hide();
        start_text.hide();
        greeting = createElement('h3').html("Your virtual pet '" + inputName.value() + "' is waiting for you.").position(380, 40).hide();
        gameState = "hungry";
        pet_hungry_text = [(inputName.value() + "'s hungry."), ("Press the button above or 'Up Arrow' key on your keyboard to feed it milk.")];
        pet_satis_text = "You've fed " + inputName.value() + "! Get it on a walk using your mouse";
    });

    txt1 = createElement('h2').position(370, 430).style("color", "black").style("background-color", "orange");
    txt2 = createElement('h2').position(370, 460).style("color", "black").style("background-color", "orange");
    txt3 = createElement('h2').position(370, 490).style("color", "black").style("background-color", "orange");
    txt4 = createElement('h2').position(360, 480).style("color", "black").style("background-color", "orange");
    txt5 = createElement('h2').position(400, 100).style("color", "blue").html("Food Left: " + food_stock).hide();
    txt6 = createElement('h2').position(400, 150).style("color", "orange").html(inputName.value() + " will be hungry again in: " + resetDogMoodTimer + " seconds").hide();

    dog = new Sprite(200, 200, 100, 100, "images/Dog.png", "images/happydog.png", 1);
}

function draw() {
    txt6.html(inputName.value() + " will be hungry again in: " + resetDogMoodTimer + " seconds");
    if (playerCount_data !== undefined) {
        background(46, 139, 87);
        txt5.html("Food Left: " + food_stock);
        if (gameState !== "solving-form") {
            resetDogMoodTimer = Math.round(counter / 30);
            imageMode(CENTER);
            push();
            stroke("yellow");
            strokeWeight(3);
            // Right
            line(600 + (dog.width / 2), 200 - (dog.height / 2), 600 + (dog.width / 2), 370 + (dog.height / 2));
            // Left
            line(100 - (dog.width / 2), 200 - (dog.height / 2), 100 - (dog.width / 2), 370 + (dog.height / 2));
            // Up
            line(100 - (dog.width / 2), 200 - (dog.height / 2), 600 + (dog.width / 2), 200 - (dog.height / 2));
            // Down
            line(600 + (dog.width / 2), 370 + (dog.height / 2), 100 - (dog.width / 2), 370 + (dog.height / 2));
            pop();
            if (gameState === "hungry") {
                dog.changePicture(dog.image1);
                greeting.show();
                gameText = [pet_hungry_text[0], pet_hungry_text[1]];
                push();
                fill("yellow");
                textSize(17.5);
                txt1.html(gameText[0]);
                txt2.html(gameText[1].slice(0, 43));
                txt3.html(gameText[1].slice(44, 74));
                txt4.html("");
                pop();
                up_arrow.show();
            }
            else {
                push();
                textSize(25);
                fill("yellow");
                txt4.html(gameText);
                pop();
                up_arrow.hide();
                txt1.html("");
                txt2.html("");
                txt3.html("");
                greeting.hide();
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
                    if (mouseX < 600 && mouseX > 100 && mouseY < 370 && mouseY > 200) {
                        dog.sprite.x = mouseX;
                        dog.sprite.y = mouseY;
                    }
                }
                else {
                    gameState = "hungry";
                    counter = max_pet_satis_time;
                }
            }
            // updateFoodStockCount();
            updateName();
            txt5.show();
            if (counter < 14.9 * 30) {
                push();
                txt6.show();
                pop();
            }
            else {
                txt6.hide();
            }
            if (food_stock === 0) {
                txt1.hide();
                txt2.hide();
                txt3.hide();
                txt4.hide();
                txt5.hide();
                txt6.hide();
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