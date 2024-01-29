// https://afeather123.github.io/posts/creating-interactive-dialogue-w-json-intro/
// Helpful ^

/**
 * TODO:
 * 
 * Multiple choice answers
 */
const main_menu = document.getElementById("main-menu");
const type_speed = 50;
const dialogue_element = document.getElementById("dialouge");
const dialogue_container = document.getElementById("dialouge-container");

//Current scene
let sceneIndex = 1;
let character = document.getElementById("character");
let isMoving = false;

// Load and cache dialogue.json
let dialogueJson;
fetch("./dialogue.json")
  .then((response) => response.json())
  .then((json) => {
    dialogueJson = json;
});

function getClick() {
  return new Promise(acc => {
    function handleClick() {
      dialogue_container.removeEventListener('click', handleClick);
      acc();
    }
    dialogue_container.addEventListener('click', handleClick);
  });
}

function DoSceneEvent(sceneID) {
  switch (sceneID) {
    case 6:
    case 7:
    case 8:
      document.getElementById("choice-container").style = "display: unset"
      dialogue_container.removeEventListener('click', handleClick());
      break;
  
    default:
      break;
  }
}

function StartGame() {
  //Remove main menu
  main_menu.style.display = "none";
  loadScene(sceneIndex); 
}

async function loadScene(sceneID) {
  //Load background, to the number of the scene
  let sceneElement = document.getElementById("scene-container");
  sceneElement.style.display = "flex";
  sceneElement.style.backgroundImage = "url('scenes/scene-" + sceneID + ".png')";


  // Loop through the people in the scene and interpret their dialogue
  if(dialogueJson.scene[sceneID] != null && !isMoving)
  {
    DoSceneEvent(sceneID);

    let people = Object.keys(dialogueJson.scene[sceneID].people);
    for (let index = 0; index < people.length; index++) {
      let person = dialogueJson.scene[sceneID].people[index].character;
      let dialogue = dialogueJson.scene[sceneID].people[index].lines

      await InterpretDialogue(dialogue, person, sceneID);
    }

    sceneIndex++;
    //Load next scene
    loadScene(sceneIndex);
  }
  else
  {
    console.error("Next scene doesn't exist!");
    //TODO: Implement
    DoThing();
  }
  
}


function setCharacter(person) {
  //Set person image and set the speaking title to the person
  character.src = "scenes/" + person + ".png";
  character.alt = person;

  //Make the first letter of the person's name uppercase
  document.getElementById("person-title").innerHTML = String(person).charAt(0).toUpperCase() + String(person).slice(1);
}

async function InterpretDialogue(dialogue, person, ID) {

  setCharacter(person);
  // Print the person's name
  console.log(person + "'s dialogue:");

  // Loop through the dialogue array and print each string in the array, also wait for each string to be printed
  for (let i = 0; i < dialogue.length; i++) {
    console.log(dialogue[i]);
    //Wait untill the string has finished typing
    await typeDialogue(dialogue[i], true);
    await getClick();
  }
}

// Speed 50
// Type out dialogue
function typeDialogue(dialogueText, shouldMove) {
  if(isMoving == true)
  {
    return Promise.reject(console.error("We are still moving"));
  }
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


// Debug:
function SetScene(sceneID) {

  main_menu.style.display = "none";
  loadScene(sceneID);
  sceneIndex = sceneID;
}