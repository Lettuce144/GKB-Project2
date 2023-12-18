let main_menu = document.getElementById("main-menu");
let character = document.getElementById("character");

let currentScene;
let currentSceneId;

//Dialogue
let index = 0;
let speed = 50;

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
  // Uncomment to enable dialogue
  typeWriter(scene);
  //For now
  setCharacter("Eamon");
}

dialogue_scene_3 = {
  Eamon: "Hello moneymaster!!!!!!",
  Money: "Hello dickhead",
};

dialogue_scene_1 = ["Hello moneymaster!!!!!", "Hello shithead"];
dialogue_scene_2 = ["moneymaster!!!!!", "shwegreewfefithead"];

function setCharacter(personImange) {
  character.src = "scenes/" + personImange + ".png";
}

function typeWriter(sceneId) {
  character.style = "animation: talk-Animation 0.3s infinite;";
  if (index < dialogue_scene_1[0].length) {
    document.getElementById("dialouge").innerHTML +=
      dialogue_scene_1[0].charAt(index);
    index++;
    setTimeout(typeWriter, speed);
  } else {
    console.log("done");
    character.style = "animation: none;";
  }
}
