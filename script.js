let main_menu = document.getElementById("main-menu");
let character = document.getElementById("character");

let currentScene;
let currentSceneId;

//Dialogue
let index = 0;
let speed = 50;

// Load and cache dialogue.json
let dialogueJson;
fetch("./dialogue.json")
  .then((response) => response.json())
  .then((json) => {
    dialogueJson = json;
  });

function StartGame() {
  //Remove main menu
  main_menu.style.display = "none";

  //Load scene 1
  loadScene(1);
}

function loadScene(scene) {
  //Load scene
  let sceneElement = document.getElementById("scene-" + scene);
  sceneElement.style.display = "flex";
  sceneElement.style.backgroundImage = "url('scenes/scene-" + scene + ".png')";

  //Load dialogue
  currentScene = document.getElementById("scene-" + scene);
  currentSceneId = scene;

  //For now
  setCharacter("Lucas");

  character.onload = function () {
    // Uncomment to enable dialogue

    typeDialogue(scene, true);
  };
}

dialogue_scene_1 = ["Hello moneymaster!!!!!", "Hello shithead"];
dialogue_scene_2 = ["moneymaster!!!!!", "shwegreewfefithead"];

function setCharacter(person) {
  //Set person image and set the speaking title to the person
  character.src = "scenes/" + String(person).toLowerCase() + ".png";
  document.getElementById("person-title").innerHTML = person;
}

// Type out dialogue
function typeDialogue(sceneId, shouldMove) {
  if (shouldMove) {
    character.style = "animation: talk-Animation 0.3s infinite;";
  }

  //Loop for every char in the strinng
  if (index < dialogue_scene_1[0].length) {
    document.getElementById("dialouge").innerHTML +=
      dialogue_scene_1[0].charAt(index);
    index++;
    setTimeout(typeDialogue, speed);
  } else {
    console.log("done");
    character.style = "animation: none;";
  }
}
