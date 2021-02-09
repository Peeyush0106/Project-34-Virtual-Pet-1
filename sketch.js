// Global Variables in our game
var dog_norm, dog_hap;

var database, stock_data;

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
    stock_data = database.ref("Dog/Food/inStock");
    stock_data.on("value", function (data) {
        food_stock = data.val();
    });

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

    inputName = createInput("").attribute("place-holder", "Name");
    inputName.position(500, 90);
    button = createButton("Play");
    button.position(430, 90);
    greeting = createElement('h2');
    greeting.position(500, 40);
    greeting.html("Enter your pet's name here");
    button.mousePressed(function () {
        inputName.hide();
        button.hide();
        greeting.html("Welcome, the Owner of " + inputName.value());
        greeting.position(400, 40);
    });

    dog = new Sprite(200, 200, 100, 100, "images/Dog.png", "images/happydog.png", 1);

    max_pet_satis_time = 15 * 30;
    pet_hungry_text = "Your pet's Hungry. Feed it milk by pressing up arrow";
    pet_satis_text = "You have fed your dog!"
    gameState = "hungry";
    gameText = pet_hungry_text;
    counter = max_pet_satis_time;
}

function draw() {
    console.log(inputName.value());
    if (stock_data !== undefined && playerCount_data !== undefined) {
        resetDogMoodTimer = Math.round(counter / 30);
        background(46, 139, 87);
        imageMode(CENTER);
        if (gameState === "hungry") {
            dog.changePicture(dog.image1);
            gameText = pet_hungry_text;
        }
        if (keyDown("up") && food_stock > 0 && gameState === "hungry") {
            food_stock -= 1;
            tossBottle();
            gameState = "satis";
            gameText = pet_satis_text;
        }
        if (gameState === "satis") {
            dog.changePicture(dog.image2);
            if (resetDogMoodTimer > 0) {
                counter -= 1;
                if (dog.x < 400 && dog.y === 200) {
                    dog.x += 0.2;
                }
                else if (dog.x >= 400 && dog.y < 400) {
                    dog.y += 0.2;
                }
                else if (dog.y >= 400 && dog.x < 200) {
                    dog.x -= 0.2;
                }
                else if (dog.y > 200) {
                    dog.y -= 0.2;
                }
            }
            else {
                gameState = "hungry";
                counter = max_pet_satis_time;
            }
        }
        updateFoodStockCount();
        updateName();
        dog.display();
        textSize(25);
        fill("blue");
        text("Food Left: " + food_stock, 30, 100);
        push();
        fill("yellow");
        text(gameText, 15, 430, 498, 500);
        pop();
        if (counter < 14.9 * 30) {
            push();
            textSize(17.5);
            fill("orange");
            text("Your pet get's hungry again in: " + resetDogMoodTimer + " seconds", 100, 150);
            pop();
        }
    }
}

// function moveDog(x, y) {
//     dog.sprite
// }

function tossBottle() {

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