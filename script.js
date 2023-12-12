let main_menu = document.getElementById("main-menu");

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
  sceneElement.style.backgroundImage = "url('scenes/scene-" + scene + ".jpg')";

  //Load dialogue
  currentScene = document.getElementById("scene-" + scene);
  currentSceneId = scene;
  typeWriter(scene);
}

dialogue_scene_1 = ["Hello moneymaster!!!!!", "Hello shithead"];
dialogue_scene_2 = ["moneymaster!!!!!", "shwegreewfefithead"];

function typeWriter(sceneId) {
  if (index < dialogue_scene_1[0].length) {
    document.getElementById("dialouge-box").innerHTML +=
      dialogue_scene_1[0].charAt(index);
    index++;
    setTimeout(typeWriter, speed);
  }
}
