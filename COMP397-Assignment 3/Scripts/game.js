/// <reference path="typings/stats/stats.d.ts" />
/// <reference path="typings/easeljs/easeljs.d.ts" />
/// <reference path="typings/tweenjs/tweenjs.d.ts" />
/// <reference path="typings/soundjs/soundjs.d.ts" />
/// <reference path="typings/preloadjs/preloadjs.d.ts" />
/// <reference path="utility/utility.ts" />
/// <reference path="objects/gameobject.ts" />
/// <reference path="objects/ocean.ts" />
/// <reference path="objects/plane.ts" />
/// <reference path="objects/island.ts" />
/// <reference path="objects/cloud.ts" />
/// <reference path="objects/scoreboard.ts" />
/// <reference path="managers/collision.ts" />
// Game Framework Variables
var canvas = document.getElementById("canvas");
var stage;
var stats;
var assets;
var manifest = [
    { id: "ocean", src: "assets/images/ocean.gif" },
    { id: "plane", src: "assets/images/plane.png" },
    { id: "island", src: "assets/images/island.png" },
    { id: "cloud", src: "assets/images/cloud.png" },
    { id: "yay", src: "assets/audio/yay.ogg" },
    { id: "thunder", src: "assets/audio/thunder.ogg" },
    { id: "engine", src: "assets/audio/engine.ogg" },
    { id: "start", src: "assets/images/start.png" },
    { id: "again", src: "assets/images/again.png" },
    { id: "how", src: "assets/images/how.png" }
];
// Game Variables
var ocean;
var plane;
var island;
var clouds = [];
var start;
var again;
var how;
var scoreboard;
var inst1;
var inst2;
// Game Managers
var collision;
// Preloader Function
function preload() {
    assets = new createjs.LoadQueue();
    assets.installPlugin(createjs.Sound);
    // event listener triggers when assets are completely loaded
    assets.on("complete", init, this);
    assets.loadManifest(manifest);
    //Setup statistics object
    setupStats();
}
// Callback function that initializes game objects
function init() {
    stage = new createjs.Stage(canvas); // reference to the stage
    stage.enableMouseOver(20);
    createjs.Ticker.setFPS(60); // framerate 60 fps for the game
    // event listener triggers 60 times every second
    createjs.Ticker.on("tick", gameLoop);
    // calling main game function
    main();
}
// function to setup stat counting
function setupStats() {
    stats = new Stats();
    stats.setMode(0); // set to fps
    // align bottom-right
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '650px';
    stats.domElement.style.top = '10px';
    document.body.appendChild(stats.domElement);
}
// Callback function that creates our Main Game Loop - refreshed 60 fps
function gameLoop() {
    stats.begin(); // Begin measuring
    ocean.update();
    plane.update();
    island.update();
    for (var cloud = 0; cloud < 3; cloud++) {
        clouds[cloud].update();
        collision.check(clouds[cloud]);
    }
    collision.check(island);
    scoreboard.update();
    stage.update();
    stats.end(); // end measuring
}
//Our start game screen function
function startScreen() {
    ocean = new objects.Ocean(assets.getResult("ocean"));
    stage.addChild(ocean);
    start = new createjs.Bitmap(assets.getResult("start"));
    start.x = 180;
    start.y = 200;
    stage.addChild(start);
    how = new createjs.Bitmap(assets.getResult("how"));
    how.x = 180;
    how.y = 350;
    stage.addChild(how);
    start.on("click", startButtonClicked);
    start.on("mouseover", startButtonOver);
    start.on("mouseout", startButtonOut);
    how.on("click", howButtonClicked);
    how.on("mouseover", howButtonOver);
    how.on("mouseout", howButtonOut);
}
//move to game play screen on button click
function startButtonClicked() {
    stage.removeAllChildren();
    ocean = new objects.Ocean(assets.getResult("ocean"));
    stage.addChild(ocean);
    //add island object to stage
    island = new objects.Island(assets.getResult("island"));
    stage.addChild(island);
    // add plane object to stage
    plane = new objects.Plane(assets.getResult("plane"));
    stage.addChild(plane);
    // add 3 cloud objects to stage
    for (var cloud = 0; cloud < 3; cloud++) {
        clouds[cloud] = new objects.Cloud(assets.getResult("cloud"));
        stage.addChild(clouds[cloud]);
    }
    //add scoreboard
    scoreboard = new objects.ScoreBoard();
    //add collision manager
    collision = new managers.Collision();
}
function startButtonOver() { start.alpha = 0.8; }
function startButtonOut() {
    start.alpha = 1.0;
}
//display instructions when user clicks on how to play button
function howButtonClicked() {
    stage.removeAllChildren();
    ocean = new objects.Ocean(assets.getResult("ocean"));
    stage.addChild(ocean);
    inst1 = new createjs.Text("Scroll Up and Down.Get Coins.", "35px consolas", "#ffffff");
    inst1.x = 70;
    inst1.y = 180;
    stage.addChild(inst1);
    inst2 = new createjs.Text("Avoid accidents to save lives", "35px consolas", "#ffffff");
    inst2.x = 70;
    inst2.y = 250;
    stage.addChild(inst2);
    start = new createjs.Bitmap(assets.getResult("start"));
    start.x = 150;
    start.y = 350;
    stage.addChild(start);
    start.on("click", startButtonClicked);
    start.on("mouseover", startButtonOver);
    start.on("mouseout", startButtonOut);
}
function howButtonOver() { how.alpha = 0.8; }
function howButtonOut() { how.alpha = 1.0; }
function againButtonOver() {
    again.alpha = 0.8;
}
function againButtonOut() {
    again.alpha = 1.0;
}
// Our end screen(game over)Game Function
function endScreen() {
    stage.removeAllChildren();
    ocean = new objects.Ocean(assets.getResult("ocean"));
    stage.addChild(ocean);
    inst1 = new createjs.Text("GAME OVER", "39px consolas", "#ffffff");
    inst1.x = 150;
    inst1.y = 60;
    stage.addChild(inst1);
    inst2 = new createjs.Text("FINAL SCORE:" + scoreboard.score, "39px consolas", "#ffffff");
    inst2.x = 150;
    inst2.y = 100;
    stage.addChild(inst2);
    again = new createjs.Bitmap(assets.getResult("again"));
    again.x = 150;
    again.y = 250;
    stage.addChild(again);
    again.on("click", startButtonClicked);
    again.on("mouseover", againButtonOver);
    again.on("mouseout", againButtonOut);
}
function main() {
    //add ocean object to stage
    ocean = new objects.Ocean(assets.getResult("ocean"));
    stage.addChild(ocean);
    //add island object to stage
    island = new objects.Island(assets.getResult("island"));
    stage.addChild(island);
    // add plane object to stage
    plane = new objects.Plane(assets.getResult("plane"));
    stage.addChild(plane);
    // add 3 cloud objects to stage
    for (var cloud = 0; cloud < 3; cloud++) {
        clouds[cloud] = new objects.Cloud(assets.getResult("cloud"));
        stage.addChild(clouds[cloud]);
    }
    //add scoreboard
    scoreboard = new objects.ScoreBoard();
    //add collision manager
    collision = new managers.Collision();
    stage.removeAllChildren();
    startScreen();
}
//# sourceMappingURL=game.js.map