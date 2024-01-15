// https://afeather123.github.io/posts/creating-interactive-dialogue-w-json-intro/
// Helpful ^

/**
 * TODO:
 * 
 * Get clicking to the next dialogue working
 * 
 */
const main_menu = document.getElementById("main-menu");
const type_speed = 50;
const dialogue_element = document.getElementById("dialouge");
const dialogue_container = document.querySelector("dialouge-container");

let character = document.getElementById("character");
let isMoving = false;
let clickCallback;

// Load and cache dialogue.json
let dialogueJson;
fetch("./dialogue.json")
  .then((response) => response.json())
  .then((json) => {
    dialogueJson = json;
});

function waitForClick() {
  return new Promise(resolve => clickCallback = resolve);
}

function clickResolver() {
  if (waitForClick) {
    waitForClick();
  }
}

function StartGame() {
  //Remove main menu
  main_menu.style.display = "none";

  //Load scene 1
  loadScene(1);
}

async function loadScene(sceneID) {
  //Load background, to the number of the scene
  let sceneElement = document.getElementById("scene-container");
  sceneElement.style.display = "flex";
  sceneElement.style.backgroundImage = "url('scenes/scene-" + sceneID + ".png')";

  //dialogue_container.addEventListener("click", console.log("hi"));
  // Loop through the people in the scene and interpret their dialogue
  let people = Object.keys(dialogueJson.scene[sceneID]);
  for (let index = 0; index < people.length; index++) {
    let person = people[index];
    await InterpretDialogue(person, sceneID);
  }

 //dialogue_container.addEventListener('click', console.log("hi"))

}

function setCharacter(person) {
  //Set person image and set the speaking title to the person
  character.src = "scenes/" + String(person).toLowerCase() + ".png";
  document.getElementById("person-title").innerHTML = person;
}

// Returns the dialogue for the given person 
async function InterpretDialogue(person, ID) {

  setCharacter(person);
  // Access the specific person's dialog array
  let dialog = dialogueJson.scene[ID][person].dialog;
  // Print the person's name
  console.log(person + "'s Dialog:");

  dialogue_container.addEventListener("click", function() {
    alert("AA");
  });
  //TODO: make the person speak here
  // Loop through the dialog array and print each line in the array, also wait for each line to be printed
  for (let i = 0; i < dialog.length; i++) {
    console.log(dialog[i]);
    await typeDialogue(dialog[i], true);
    await waitForClick();
  }
}

// Speed 50
// Type out dialogue
function typeDialogue(dialogueText, shouldMove) {
  return new Promise(resolve => {
    if (shouldMove) {
      character.style = "animation: talk-Animation 0.3s infinite;";
      isMoving = !isMoving;
    }

    let index = 0;

    dialogue_element.innerHTML = ""; // Clear the dialogue element for each new line

    function typeNextCharacter() {
      if (index < dialogueText.length) {
        dialogue_element.innerHTML += dialogueText.charAt(index);
        index++;
        setTimeout(typeNextCharacter, type_speed);
      } else {
        isMoving = !isMoving;
        console.log("done");
        // Stop moving when we're done with the loop
        character.style = "animation: none;";
        resolve(); // Resolve the promise when typing is done
      }
    }

    // Start typing the dialogue
    typeNextCharacter();
  });
}