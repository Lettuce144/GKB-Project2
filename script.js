/*
    Yucky code, ew
 */
const main_menu = document.getElementById("main-menu");
const type_speed = 25;
const dialogue_element = document.getElementById("dialouge");
const dialogue_container = document.getElementById("dialouge-container");
const settings_menu = document.getElementById("settings");
const talk = document.getElementById('talk');
const volumeSlider = document.getElementById('myRange');

let character = document.getElementById("character");
let isMoving = false;
let muteTalkingSound;
let showSettings = false;

//Clicking for next dialogue
let handleClick;

// Load and cache dialogue.json
let dialogueJson;
fetch("./dialogue.json")
  .then((response) => response.json())
  .then((json) => {
    dialogueJson = json;
});


//Checks if the user previously has vistied the website before
//So that we can get the options of the user
if (localStorage.getItem("muteTalkingSound") != null) {
  muteTalkingSound = localStorage.getItem("muteTalkingSound");
  document.getElementById("mute").innerHTML = muteTalkingSound ? 'Unmute' : 'Mute';
}
else{
  muteTalkingSound = false;
  document.getElementById("mute").innerHTML = muteTalkingSound ? 'Unmute' : 'Mute';
  localStorage.setItem("muteTalkingSound", muteTalkingSound);
}

function getClick() {
  return new Promise(acc => {
    function handleClick() {
      dialogue_container.removeEventListener('click', handleClick);
      acc();
    }
    dialogue_container.addEventListener('click', handleClick);
    return handleClick; // Return the reference to handleClick
  });
}

function ToggleSettings() {
  showSettings = !showSettings;
  
  if(showSettings)
  {
    settings_menu.style = "transform: translateY(1000px);";
  }
  else
  {
    settings_menu.style = "transform: translateY(0px);";
  }
}

// Add an event listener to the range input
volumeSlider.addEventListener('input', function() {
  // Update the volume of the audio element
  const volume = volumeSlider.value / 100; // Normalize the value to be between 0 and 1
  talk.volume = volume;
});

//Toggle for the mute button
function Mute() {
  muteTalkingSound = !muteTalkingSound; 
  document.getElementById("mute").innerHTML = muteTalkingSound ? 'Unmute' : 'Mute';
  localStorage.setItem("muteTalkingSound", muteTalkingSound);
}

function DoSceneEvent(sceneID) {
  switch (sceneID) {
    case 6:
      document.getElementById("choice-container").style = "display: unset";

      break;
    case 7:
    case 8:
      document.getElementById("choice-container").style = "display: none";
      console.log("removed event");
      break;

    default:
      console.warn("This scene doesn't have any event!");
      break;
  }
}

async function StartGame() {
  //Remove main menu
  main_menu.style.display = "none";

  //Load all the scene's and stop at scene 6
  //Again, a very bad way of getting the scenes.
  for (let index = 1; index <= 6; index++) {
    console.log("Playing scene:", index)
    await loadScene(index);
  }
}

async function loadScene(sceneID) {
  let sceneElement = document.getElementById("scene-container");
  sceneElement.style.display = "flex";
  sceneElement.style.backgroundImage = "url('scenes/scene-" + sceneID + ".png')";

  if (dialogueJson.scene[sceneID] != null && !isMoving) {
    DoSceneEvent(sceneID);

    let people = Object.keys(dialogueJson.scene[sceneID].people);
    for (let index = 0; index < people.length; index++) {
      let person = dialogueJson.scene[sceneID].people[index].character;
      let dialogue = dialogueJson.scene[sceneID].people[index].lines;

      // Set character only if it changes
      if (person !== character.alt) {
        setCharacter(person);
      }

      await InterpretDialogue(dialogue, person, sceneID);
    }
  } else {
    console.error("Next scene doesn't exist!");
    // TODO: Implement
    return;
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
  // Print the person's name
  console.log(person + "'s dialogue:");

  for (let i = 0; i < dialogue.length; i++) {
    console.log(dialogue[i]);
    await typeDialogue(dialogue[i], true);
    await getClick();
  }
}

// Speed 50
// Type out dialogue
function typeDialogue(dialogueText, shouldMove) {
  if (isMoving == true) {
    //We might end up getting gibberish text, so make sure we are not moving anymore.
    return Promise.reject(new Error("Cannot type dialogue while still moving"));
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
        if (muteTalkingSound == false) {
          console.log("talking")
          talk.play();
        }
        index++;
        setTimeout(typeNextCharacter, type_speed);
      } else {
        isMoving = !isMoving;
        // Stop moving when we're done with the loop
        character.style = " animation: none;";
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
}


function Credits() {
  // Verberg het hoofdmenu
  let mainMenu = document.getElementById("main-menu");
  mainMenu.style.display = "none";
  

  // Voeg twee afbeeldingen toe aan de pagina
  const imageContainer = document.createElement("div");
  imageContainer.classList.add("credit-images-container");

  // Eerste afbeelding
  const image1 = document.createElement("img");
  image1.src = "images/alfa.png"; 
  image1.alt = "Image 1";
  image1.classList.add("credit-image");
  imageContainer.appendChild(image1);

  // Tweede afbeelding
  const image2 = document.createElement("img");
  image2.src = "images/gkb.png"; 
  image2.alt = "Image 2";
  image2.classList.add("credit-image", "second"); 
  imageContainer.appendChild(image2);


  
  document.body.appendChild(imageContainer);

  // Maak een array met de credits tekst
  let creditsText = [
    "GKB-Project",
    "Door:",
    "Lorenzo",
    "Kerim",
    "Ismail",
    "Jens",
    "Hadi",
    "Nouk",
  ];

  // Voeg de tekst toe aan de pagina
  const creditsTextElement = document.createElement("div");
  creditsTextElement.classList.add("credits-text");

  creditsText.forEach((line) => {
    const p = document.createElement("p");
    p.textContent = line;
    creditsTextElement.appendChild(p);
  });

  // Voeg de credits div toe aan de body van de huidige pagina
  document.body.appendChild(creditsTextElement);
}
