import { WrappedGL, Transform, Face, SceneObject, GlobalScene } from "../engine.js";

let WHITE = [1, 1, 1];
let BLACK = [0,0,0];
let GRAY = [0.3, 0.3, 0.3];
let GREEN = [0, 0.6, 0.3];
let YELLOW = [1, 0.8, 0];
let RED = [1, 0, 0];
let BLUE = [0, 0, 1];

let pause = true;

let globalScene = new GlobalScene();
window.globalScene = globalScene;
let wgl = new WrappedGL();
wgl.setup("shader.vert", "shader.frag").then(main);

function main() {
  wgl.gl.clearColor(...WHITE, 1);
  wgl.clear();
  
  let pt = new Transform().frustum(4, 3, 40, 80);
  let vt = new Transform().translate(0.5, -0.3, -60).rotateX(75).rotateY(-60).scale(0.8,0.8,0.8);
  let mt = new Transform();
  let ft = new Transform();
  setDefaultTransforms();

  let mainLight = new SceneObject(wgl, "Main Light");
  mainLight.translate(10,15,10);
  mainLight.lightColor = [.6,.6,.6];
  mainLight.lightBrightness = 3;
  mainLight.lightOn();
  mainLight.gravity = false;
  mainLight.collisionDetection = false;
  

  function setDefaultTransforms(){
    wgl.setProjectionTransform(pt);
    wgl.setViewingTransform(vt);
    wgl.setModelingTransform(mt);
    wgl.setFaceTransform(ft);
  }

  let time = 0;
  let timer = document.querySelector("#time");
  let timeStep = GlobalScene.timeStep;
  let timeAdd = GlobalScene.timeStep;
  let rotate = false;
  globalScene.push(mainLight);

  function go(){
    function draw(step = false) {
      if(pause){//|| noMove.length == gravityObjects.length){
        return;
      } else {
        if(!step){
          setTimeout(draw, timeStep * 1000);
        } else {
          pause = true;
        }
      }

      wgl.clear(); 
      setDefaultTransforms();
      time += timeAdd;
      timer.innerHTML = time.toFixed(3);
      if(rotate){
        vt.rotateY(0.125);
      }
      
      globalScene.update();
      globalScene.draw();
    }

    let background = new SceneObject(wgl, "background");
    background.setColor(GRAY);
    background.setGloss(1);
    background.translate(-3, -3, -3).scale(8,8,8);
    //background.addFace();
    //background.addFace().translate(0,0,1).rotateY(90);
    background.addFace().translate(0,0,1).rotateX(-90);
    background.gravity = false;
    background.mass = 100000000000;
    background.bounciness = .99;
    globalScene.push(background);

    let background2 = new SceneObject(wgl, "background2");
    background2.setColor(GRAY);
    background2.setGloss(1);
    background2.translate(-3, -3, -3).scale(8,8,8);
    background2.addFace();
    //background2.addFace().translate(0,0,1).rotateY(90);
    //background2.addFace().translate(0,0,1).rotateX(-90);
    background2.gravity = false;
    background2.mass = 1000000000000;
    background2.bounciness = 0.99;
    globalScene.push(background2);

    let background3 = new SceneObject(wgl, "background3");
    background3.setColor(GRAY);
    background3.setGloss(1);
    background3.translate(-3, -3, -3).scale(8,8,8);
    //background3.addFace();
    background3.addFace().translate(0,0,1).rotateY(90);
    //background3.addFace().translate(0,0,1).rotateX(-90);
    background3.gravity = false;
    background3.mass = 10000000000000;
    background3.bounciness = 0.99;
    globalScene.push(background3);

    let background4 = new SceneObject(wgl, "background4");
    background4.setColor(GRAY);
    background4.setGloss(1);
    background4.translate(-3, -3, -3).scale(8,8,8);
    background4.addFace().translate(1,0,0).rotateY(-90);
    //background4.addFace().translate(0,0,1).rotateY(90);
    //background4.addFace().translate(0,0,1).rotateX(-90);
    background4.gravity = false;
    background4.mass = 10000000000000;
    background4.bounciness = 0.99;
    globalScene.push(background4);

    let background5 = new SceneObject(wgl, "background5");
    background5.setColor(GRAY);
    background5.setGloss(1);
    background5.translate(-3, -3, -3).scale(8,8,8);
    background5.addFace().translate(1,0,1).rotateY(-180);
    //background5.addFace().translate(0,0,1).rotateY(90);
    //background5.addFace().translate(0,0,1).rotateX(-90);
    background5.gravity = false;
    background5.mass = 100000000000000;
    background5.bounciness = 0.99;
    globalScene.push(background5);

    let cube = new SceneObject(wgl, "Yellow Box");
    cube.createCube();
    cube.translate(0,-2.5,0);
    globalScene.push(cube);

    let cube2 = new SceneObject(wgl, "Red Box");
    cube2.setColor(RED);
    cube2.createCube();
    cube2.translate(.45,4,-.45);
    cube2.scale(.2,.2,.2);
    cube2.mass = 1;
    cube2.vx = -5.5;
    cube2.vz = -4;
    cube2.gravity = true;
    cube2.bounciness = .8;
    globalScene.push(cube2);
    //cube2.rotateX(30);
    
    
 
    let cube4 = new SceneObject(wgl, "White Box");
    cube4.setColor(WHITE);
    cube4.setGloss(1.0);
    cube4.createCube();
    cube4.translate(2,2,0);
    cube4.lightColor = WHITE;
    cube4.lightBrightness = .3;
    //cube4.lightOffset = [0.5, 0.5, -0.5];
    cube4.vy = -5;
    cube4.vx = -8;
    cube4.vz = -1;
    cube4.bounciness = 0.8;
    cube4.lightOn();
    globalScene.push(cube4);

    let cube3 = new SceneObject(wgl, "Red Box Large");
    cube3.setColor(RED);
    cube3.setGloss(0.4);
    cube3.createCube();
    cube3.translate(1,0,2).scale(0.5, 0.5, 0.5);
    cube3.lightColor = RED;
    cube3.lightBrightness = 0.5;
    cube3.vx = -4;
    cube3.vy = 2;
    cube3.vz = 5;
    cube3.bounciness = 0.8;
    cube3.lightOn();
    globalScene.push(cube3);

    /*let cube4 = new SceneObject(wgl);
    cube4.setColor(GREEN);
    cube4.createCube();*/

    let pauseBtn = document.querySelector("#pause");
    pauseBtn.onclick = function(){
      pause = true;
    }

    let stepBtn = document.querySelector("#step");
    stepBtn.onclick = function(){
      if(pause){
        pause = false;
        draw(true);
      }
    }
  
    let startBtn = document.querySelector("#start");
    startBtn.onclick = function(){
      if(pause){
        pause = false;
        draw();
      }
    }

    let gSlide = document.querySelector("#gravity");
    gSlide.oninput = function(){
      GlobalScene.gravityStrength = -1 * this.value;
    }

    let speedSlide = document.querySelector("#speed");
    speedSlide.oninput = function(){
      timeStep = (400 - this.value) * 0.00025;
      timeAdd = this.value * 0.00025;
    }

    let rotateCheck = document.querySelector("#rotate");
    rotateCheck.oninput = function(){
      if(this.checked){
        rotate = true;
      } else {
        rotate = false;
      }
    }

    let randomCheck = document.querySelector("#random");
    randomCheck.oninput = function(){
      if(this.checked){
        for(let c of globalScene.getSceneObjects()){
          if(c.name.includes("Box")){
            c.vx = (Math.random() - .5) * 20;
            c.vy = (Math.random() - .5) * 20;
            c.vz = (Math.random() - .5) * 20;
          }
        }
      }
    }

    // Draw scene once on page load
    wgl.clear(); 
    setDefaultTransforms();
    for(let c of globalScene.getSceneObjects()){
      c.updateHitbox();
    }
    globalScene.update();
    globalScene.draw();
  }

  go();
}


