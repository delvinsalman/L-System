// This L tree system uses the logic leanred and gain from both lab and Przemyslaw Prusinkiewicz book. What you see here is a L tree system that is interactive via a GUI by the user. The user can click the tree up too 5 times to form its final form. In which in the process they can change many things added to it. Such as leafs, leaf colour and size, branch, branch colour and size and adding branching, they can add wind, they can rotate the tree left to right, and they can click up too three different type of tree styles as well as a glow and animation while you move the tree As well a curve branch button that complicates the rule system to make the tree more complex. You can think of the project as a L tree system that is customizable by the user. So the idea is to give the user a more fun and creative experience rather then just a basic clicking tree. Those are some points of the overall project. The GUI is pretty easy to follow so have a go!

//"Include one or more additional features described in the article "Ch1. Graphical modeling using L-systems from The Algorithmic Beauty of Plants by Przemyslaw Prusinkiewicz et. al." The article describes many sophisticated L-systems with additional drawing rules and available alphabet characters." " The main features added are the 3 new trees rules, branch extension and the curve ness of the branch that was described by Przemyslaw in the chapter. They follow the logic and ideas he possesses.

// Please note that during the final click which is the 5th, the GUI gets a bit laggy due to all the data and code its getting, so I would recommed to pick your style like colours size and what not first, then make the final form, or even if you dont want a final form click a it a few times, its up to you. 

// I have made a gallery of up too 20 picture of different trees I made by using the GUI and trying to make something new each time as there are crazy amounts of ways u can make your tree.

// There are comments in the code that indcate what is what.

//There is also a sound system in which follows the extra requirement of having sound. As you will see, when u click the tree to sprout, it makes a magical noise I picked in doing so every time u click it when it grows and make the sound. 

// The animation dont exactly follow the tree sprouting and it being aniamted but rather, when u move the tree it has a more real and glow effect to enhance it. There is also a wind like button in which shakes the tree like there is wind. It would make the code way too laggy if I made it have a animation when sprouting but I hope those things can be considered as extra!


// If u click curve branches you can not reset the values, just clikc reset instead. The reset values only works for the sizez and branch movement, as I made it that way.

// Variables
// Variables
let axiom = "X";
let trees = [];
let angle;
let originalBranchThickness = 2;
let branchThickness = originalBranchThickness;
let sound;
let resetButton;
let resetColorsAndValuesButton;
let leafColorPicker;
let branchColorPicker;
let originalLeafColor;
let originalBranchColor;
let branchSizeInput;
let originalBranchSize = 2;
let leafSizeInput;
let leafWidthInput; // Add input for leaf width
let originalLeafSize = 10;
let originalLeafWidth = 10; // Set your desired original leaf width
let leftBranchAngleSlider;
let originalLeftBranchAngle = 25;
let addBranchesButton;
let branchesAdded = false;
let isWindActive = false;
let curveButton;

// Each iteration and our rules for the tree to form
const treeTypes = [
  {
    axiom: "X",
    rules: {
      X: "F[+X][-X]F[+X][-X]FX",
      F: "FF",
    },
  },
  {
    axiom: "X",
    rules: {
      X: "F[-X][X]F[+X]FX",
      F: "FF",
    },
  },
  {
    axiom: "X",
    rules: {
      X: "F(0.6)[-X(0.7)][X(0.7)]F(0.8)[+FX](-0.2)X",
      F: "FF",
      L: "FFL", 
      W: "[+F[-L]W]L", 
    },
  },
];


const treeCount = 2;
const treeSpacing = 350;
let currentTreeType = 0;
let backgroundOffset = 0;

function preload() {
  // Our sound when the tree is branching
  sound = loadSound('Sound.mp3');
}

function setup() {
  createCanvas(720, 500);

  angle = radians(originalLeftBranchAngle);

  originalLeafColor = color(20, 243, 76);
  originalBranchColor = color(139, 69, 19);

  for (let i = 0; i < treeCount; i++) {
    let tree = {
      sentence: axiom,
      len: 150,
      leaves: [],
      generationCount: 0,
      x: i * treeSpacing + treeSpacing / 2,
      y: height,
    };
    trees.push(tree);
  }

  // The GUI area in creating the workable functions
  resetButton = createButton('Reset');
  resetButton.position(10, height + 10);
  resetButton.mousePressed(resetSketch);

  addBranchesButton = createButton('New Tree');
  addBranchesButton.position(resetButton.x + resetButton.width + 10, height + 10);
  addBranchesButton.mousePressed(addNewTree);

  leafColorPicker = createColorPicker(originalLeafColor);
  leafColorPicker.position(10, height + 40);

  branchColorPicker = createColorPicker(originalBranchColor);
  branchColorPicker.position(10, height + 70);

  branchSizeInput = createInput(originalBranchSize.toString());
  branchSizeInput.position(10, height + 100);
  let branchSizeLabel = createP('Branch Size:');
  branchSizeLabel.position(branchSizeInput.x + branchSizeInput.width + 10, height + 85);
  branchSizeInput.input(updateBranchSize);

  leafSizeInput = createInput(originalLeafSize.toString());
  leafSizeInput.position(10, height + 130);
  let leafSizeLabel = createP('Leaf Size');
  leafSizeLabel.position(leafSizeInput.x + leafSizeInput.width + 10, height + 115);
  
  leafWidthInput = createInput(originalLeafWidth.toString());
  leafWidthInput.position(10, height + 160);
  let leafWidthLabel = createP('Leaf Width');
  leafWidthLabel.position(leafWidthInput.x + leafWidthInput.width + 10, height + 145);

  leftBranchAngleSlider = createSlider(0, 90, originalLeftBranchAngle, 1);
  leftBranchAngleSlider.position(10, height + 190); // Adjust the position

  resetColorsAndValuesButton = createButton('Reset Values');
  resetColorsAndValuesButton.position(leftBranchAngleSlider.x + leftBranchAngleSlider.width + 10, height + 10);
  resetColorsAndValuesButton.mousePressed(resetColorsAndValues);

  windButton = createButton('Toggle Wind');
  windButton.position(resetColorsAndValuesButton.x + resetColorsAndValuesButton.width + 10, height + 10);
  windButton.mousePressed(toggleWind);

  addBranchesButton = createButton('Add Branches');
  addBranchesButton.position(windButton.x + windButton.width + 10, height + 10);
  addBranchesButton.mousePressed(addBranches);

  // Create the "Curve Branches" button
  curveButton = createButton('Curve Branches');
  curveButton.position(addBranchesButton.x + addBranchesButton.width + 10, height + 10);
  curveButton.mousePressed(curveBranches);
}

let captureCanvas = false;

function keyPressed() {
  if (key === 's' || key === 'S') {
    captureCanvas = true;
  }
}

function draw() {
  backgroundOffset += 0.005;
  for (let y = 0; y < height; y++) {
    let n = noise(backgroundOffset) * 40;
    stroke(0, n);
    line(0, y, width, y);
  }

  // More logic for the tree
  for (let i = 0; i < treeCount; i++) {
    let tree = trees[i];
    push();
    translate(tree.x, tree.y);
    fill(branchColorPicker.color());
    noStroke();
    for (let j = 0; j < tree.sentence.length; j++) {
      let current = tree.sentence.charAt(j);
      if (current === "F") {
        fill(branchColorPicker.color());
        rect(-branchThickness / 2, 0, branchThickness, -tree.len);
        translate(0, -tree.len);
      } else if (current === "+") {
        rotate(angle);
      } else if (current === "-") {
        rotate(-angle);
      } else if (current === "[") {
        push();
      } else if (current === "]") {
        pop();
      } else if (current === "X") {
        fill(leafColorPicker.color());
        ellipse(0, 0, leafSizeInput.value(), leafWidthInput.value());
        stroke(0, 100, 0);
        tree.leaves.push(createVector(0, 0));
        if (captureCanvas) {
          saveCanvas('your_canvas', 'png');
          captureCanvas = false;
        }
      }
    }
    pop();
    tree.branchThickness *= 0.7;
  }
  // Wind effect
  if (isWindActive) {
    applyWind();
  }

  angle = radians(leftBranchAngleSlider.value());

  loop();
}

function addBranches() {
  if (!branchesAdded) {
    for (let tree of trees) {
      tree.sentence = expandSentence(tree.sentence);
    }
    branchesAdded = true;
  }
}

function expandSentence(s) {
  let nextSentence = '';
  for (let i = 0; i < s.length; i++) {
    let current = s.charAt(i);
    if (treeTypes[currentTreeType].rules[current]) {
      nextSentence += treeTypes[currentTreeType].rules[current];
    } else {
      nextSentence += current;
    }
  }
  return nextSentence;
}

// Our branch
function updateBranchSize() {
  const inputValue = branchSizeInput.value();
  if (inputValue !== "") {
    const parsedValue = parseFloat(inputValue);
    if (!isNaN(parsedValue)) {
      branchThickness = parsedValue;
    } else {
      branchSizeInput.value(branchThickness.toString());
    }
    redraw();
  }
}

// The new tree function
function addNewTree() {
  currentTreeType = (currentTreeType + 1) % treeTypes.length;
  resetSketch();
  redraw();
}

function generate() {
  let anyTreeCanGrow = false;
  for (let i = 0; i < treeCount; i++) {
    let tree = trees[i];
    if (tree.generationCount < 6) {
      anyTreeCanGrow = true;
      tree.branchThickness = parseFloat(branchSizeInput.value());
      tree.len *= 0.5;
      let nextSentence = "";
      for (let j = 0; j < tree.sentence.length; j++) {
        let current = tree.sentence.charAt(j);
        if (treeTypes[currentTreeType].rules[current]) {
          nextSentence += treeTypes[currentTreeType].rules[current];
        } else {
          nextSentence += current;
        }
      }
      tree.sentence = nextSentence;
      tree.leaves = [];
      tree.generationCount++;
    }
  }

  // Our animation sound when branching
  if (anyTreeCanGrow) {
    sound.play();
  } else {
    sound.stop();
  }
}

function updateLeafSize() {
  redraw();
}

function mouseClicked() {
  if (mouseX > 0 && mouseY > 0 && mouseX < width && mouseY < height) {
    generate();
  }
}

function resetSketch() {
  axiom = treeTypes[currentTreeType].axiom;
  for (let tree of trees) {
    tree.sentence = axiom;
    tree.len = 150;
    tree.leaves = [];
    tree.generationCount = 0;
  }
  if (sound.isPlaying()) {
    sound.stop();
  }

  branchesAdded = false;
  loop();
}

// Our reset value
function resetColorsAndValues() {
  branchThickness = originalBranchThickness;
  branchSizeInput.value(originalBranchSize.toString());
  leafSizeInput.value(originalLeafSize.toString());
  leafWidthInput.value(originalLeafWidth.toString()); // Reset leaf width
  branchColorPicker.color(originalBranchColor);
  leafColorPicker.color(originalLeafColor);
  leftBranchAngleSlider.value(originalLeftBranchAngle);
  redraw();
}

// Main function to make the wind move the trees
function toggleWind() {
  isWindActive = !isWindActive;

  if (isWindActive) {
    windButton.html('Turn Off Wind');
  } else {
    windButton.html('Turn On Wind');
  }
}

function applyWind() {
  for (let i = 0; i < trees.length; i++) {
    let tree = trees[i];
    tree.x += random(-1.5, 1.5);
  }
}

// Added function to curve the branches IN SWITCHING THE RULE LOGIC
function curveBranches() {
  for (let tree of trees) {
    tree.sentence = curveSentence(tree.sentence);
  }
  redraw();
}

function curveSentence(s) {
  let curvedSentence = '';
  for (let i = 0; i < s.length; i++) {
    let current = s.charAt(i);
    if (current === '+' || current === '-') {
      // Randomly curve the angles
      let curvedAngle = radians(random(-30, 30));
      if (current === '-') {
        curvedAngle *= -1; // Reverse the direction for '-'
      }
      curvedSentence += current + curvedAngle.toFixed(2);
    } else {
      curvedSentence += current;
    }
  }
  return curvedSentence;
}
