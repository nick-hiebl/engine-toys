
var playerImg;
var slotImg;

function handleScenes(i) {
    if (i == 0) {
        myStateManager.horizontalLoad(new WalkingState(myStateManager));
    }
}

var myState;

var myStateManager;

function loadImage(src) {
    var img = new Image();
    img.src = src;
    return img;
}

function setup() {
    playerImg = loadImage('resources/player.png');
    slotImg = loadImage('resources/slot.png');

    myStateManager = new StateManager();
    myState = new IntroState(myStateManager);

    myStateManager.start();

    myStateManager.verticalLoad(myState);
}
