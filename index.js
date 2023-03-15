import * as local from "./modules/localStorage.js";
import * as core from "./modules/basicUsability.js";
import * as data from "./modules/convert.js";
import * as edit from "./modules/edit.js";

// Shortcuts List
import { Manipulation, Storage } from "./shortcuts.js";

let manipulation = Manipulation;
manipulation = manipulation.reduce((acc, { myId, ...x }) => {
  acc[myId] = x;
  return acc;
}, {});

let storage = Storage;
storage = storage.reduce((acc, { myId, ...x }) => {
  acc[myId] = x;
  return acc;
}, {});

console.group("Shortcuts");
console.group("Manipulation");
console.table(manipulation);
console.groupEnd();
console.group("Storage");
console.table(storage);
console.groupEnd();
console.groupEnd();

// * Double Click Makes Editable * //
document.addEventListener("dblclick", function (event) {
  if (getID() == -1) {
    return;
  } else {
    checkWrap(core.id(getID()));
    core.id(getID()).contentEditable = true;
    core.id(getID()).className = "el block";
    local.set("typing", 1);
  }
});

local.set("typing", 0);

//! START P Wrap Check
function checkWrap(editableDiv) {
  // add a "keydown" event listener to the <div> element
  editableDiv.addEventListener("keydown", function (event) {
    // check if the <div> element has a <p> element as its first child
    if (this.firstChild && this.firstChild.nodeName === "P") {
      // if it does, do nothing
      return;
    } else {
      // if it doesn't, wrap the contents of the <div> element in a new <p> element
      const newP = document.createElement("p");
      newP.innerHTML = this.innerHTML;
      this.innerHTML = "";
      this.appendChild(newP);
      edit.goToEnd(this);
      // addEvent(element,'focus',function(){
      //   var that = this;
      //   setTimeout(function(){ that.selectionStart = that.selectionEnd = 10000; }, 0);
      // });
    }
  });
}

// function addEvent(elem, event, fn){
//   if(elem.addEventListener){
//     elem.addEventListener(event, fn, false);
//   }else{
//     elem.attachEvent("on" + event,
//     function(){ return(fn.call(elem, window.event)); });
//   }}

var element = document.getElementById("el");

//! END P Wrap Check

function delEmptyP(divID) {
  const emptyChildren = document
    .getElementById(divID)
    .querySelectorAll("p:empty");

  // loop through the empty children and remove them from their parent element
  emptyChildren.forEach((child) => {
    child.parentNode.removeChild(child);
  });
}

// contenteditable="true"

function createDIV() {
  const divElement = document.createElement("div");
  divElement.className = "el";
  divElement.id = divNumGet();
  return divElement;
}

function append(div) {
  if (getID() != null) {
    core.id(getID()).appendChild(div);
  } else {
    core.body.appendChild(div);
  }
}

// * On click save div id to localstorage * //

function setID(event) {
  const div = event.target;
  let id = div.id;

  if (!div.id) {
    id = -1;
    if (div.parentNode.id) {
      id = div.parentNode.id;
    }
  }

  local.set("id", id);
}

// Get Current Div ID
function getID() {
  let id = local.get("id");
  if (id != null && id != -1) {
    return id;
  } else {
    return null;
  }
}

const myDiv = document.querySelector("body");
myDiv.addEventListener("click", function (event) {
  let El = core.id(getID());
  try {
    if (
      event.target.id != getID() &&
      event.target.parentElement.id != getID()
    ) {
      core.id(getID()).contentEditable = false;
      local.set("typing", 0);
    }
    core.id(getID()).style.resize = "none";
    core.id(getID()).style.borderColor = "lightgray";
  } catch {}
  setID(event);

  try {
    core.id(getID()).style.resize = "both";
    core.id(getID()).style.borderColor = "black";
  } catch {}

  CheckHW();
});

// * Record Number of Divs

function divNumAdd() {
  let divs = divNumGet();
  divs++;
  local.set("divs", divs.toString());
}

function divNumGet() {
  let result = 0;

  if (local.get("divs") != null) {
    result = local.get("divs");
  }

  return result;
}

//! When Press Shift+C, create colour picker

// ß ∂ ˜ ¬
// S D N L

document.addEventListener("keydown", function (event) {
  if (local.get("typing") == 1) {
    return;
  }

  if (event.shiftKey && event.key === "S") {
    save();
  }

  if (event.shiftKey && event.key === "D") {
    data.saveHTML();
  }

  if (event.shiftKey && event.key === "L") {
    load();
  }

  if (event.shiftKey && event.key == "N") {
    localStorage.clear();
    document.body.innerHTML = "";
  }

  // * SHIFT+A Creates New Div * //
  if (event.shiftKey && event.key === "A") {
    let div = createDIV();
    if (core.id(getID()).className == "el block") {
      return;
    } else {
      append(div);
      divNumAdd();
    }
    core.id(getID()).contentEditable = false;
    delEmptyP(getID());
  }

  // check if the Shift and C keys were pressed simultaneously
  if (event.shiftKey && event.key === "C") {
    let color = core.id(getID()).style.backgroundColor;
    // create a new <input> element with type="color"
    const colorPicker = document.createElement("div");
    colorPicker.classList.add("color-picker");
    const input = document.createElement("input");
    input.type = "color";
    input.id = "color-picker";
    colorPicker.appendChild(input);

    // add the color picker to the document
    core.id(getID()).appendChild(colorPicker);

    core.id("color-picker").addEventListener("change", function () {
      core.id(
        "color-picker"
      ).parentElement.parentElement.style.backgroundColor =
        core.id("color-picker").value;
    });

    // remove the color picker when the user clicks outside of it
    document.addEventListener("click", function (event) {
      if (!colorPicker.contains(event.target)) {
        colorPicker.remove();
      }
    });

    // prevent the default action for the Shift and C keys
    event.preventDefault();
  }

  //! ROTATE FLEX
  if (event.shiftKey && event.key === "R") {
    if (core.id(getID()).style.flexDirection == "column") {
      core.id(getID()).style.flexDirection = "row";
    } else {
      core.id(getID()).style.flexDirection = "column";
    }
  }

  //! Delete Div
  if (event.key === "Delete" || event.key === "Backspace") {
    if ((getID() != "edit" || getID() != -1) && local.get("typing") != 1) {
      console.log(local.get("typing"));
      core.id(getID()).remove();
    }
  }

  if (event.shiftKey && event.key === "G") {
    // TODO  Shift G to Group divs (nest inside a new div)
  }

  //! on selected div, h to auto height, w to auto width. (cycle from auto to 100%)

  if (event.shiftKey && event.key === "H") {
    if (core.id(getID()).style.height == "fit-content") {
      core.id(getID()).style.height = "100%";
    } else {
      core.id(getID()).style.height = "fit-content";
    }
    CheckHW();
  }

  if (event.shiftKey && event.key === "W") {
    if (core.id(getID()).style.width == "fit-content") {
      core.id(getID()).style.width = "100%";
    } else {
      core.id(getID()).style.width = "fit-content";
    }
    CheckHW();
  }

  //! Cycle through flex justify options

  if (event.shiftKey && event.key === "{") {
    let flexOption = 0;
    try {
      flexOption = local.get("flex");
    } catch {}
    const options = [
      "flex-start",
      "center",
      "flex-end",
      "space-between",
      "space-around",
    ];

    if (flexOption <= 0) {
      flexOption = 4;
    } else {
      flexOption--;
    }

    console.log(flexOption);

    core.id(getID()).style.justifyContent = options[flexOption];
    local.set("flex", flexOption);
  }

  if (event.shiftKey && event.key === "}") {
    let flexOption = 0;
    try {
      flexOption = local.get("flex");
    } catch {}
    const options = [
      "flex-start",
      "center",
      "flex-end",
      "space-between",
      "space-around",
    ];

    if (flexOption >= 4) {
      flexOption = 0;
    } else {
      flexOption++;
    }

    console.log(flexOption);

    core.id(getID()).style.justifyContent = options[flexOption];
    local.set("flex", flexOption);
  }
});

function CheckHW() {
  try {
    if (core.id(getID()).style.width == "fit-content") {
      if (core.id(getID()).style.height == "fit-content") {
        core.id(getID()).style.resize = "none";
      } else {
        core.id(getID()).style.resize = "vertical";
      }
    } else {
      if (core.id(getID()).style.height == "fit-content") {
        core.id(getID()).style.resize = "horizontal";
      }
    }
  } catch {}
}

//!  Inf. Scroll down

let prevScrollY = window.scrollY;
let bottomReached = false;

window.addEventListener("scroll", function () {
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;

  let heightAdj = scrollY + prevScrollY;

  if (heightAdj < windowHeight && getID() >= 0 && getID() != null) {
    document.body.style.paddingBottom = (scrollY + prevScrollY) / 2 + "px";
    prevScrollY = scrollY;
  } else if (heightAdj < windowHeight) {
    document.body.style.paddingBottom = 0;
  }
});

function save() {
  local.set("save", data.toJSON(document.body));
  console.log("file saved locally...");
}

function load() {
  try {
    let loadfile = JSON.parse(local.get("save")).html;
    document.body.innerHTML = loadfile;
  } catch {
    console.error("No save found...");
  }
}

// TODO  Change border-radius

//?  Shift F to Full Screen width or height
//?  Shift T to change text config.
//?  Shift ? to change div config.
//?  Shift {} to change align left/center/right.

//?  12 Column Design Support
//?  Max Width

// TODO  Shift Click to highlight multiple.

// TODO  Click to view settings
// TODO  Flex settings
// TODO  Click and Drag to rearrange
// TODO  Drag and Drop Images in specific Divs

// TODO  Save Components

//! BUGS
