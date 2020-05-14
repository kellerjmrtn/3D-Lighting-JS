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
  let vt = new Transform().translate(0.5, -0.3, -60).rotateX(15).rotateY(-60).scale(0.8,0.8,0.8);
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
  globalScene.push(mainLight);

  function go(){
    function draw(step = false) {
      if(pause){
        return;
      } else {
        if(!step){
          setTimeout(draw, 12);
        } else {
          pause = true;
        }
      }

      wgl.clear(); 
      setDefaultTransforms();
      time += GlobalScene.timeStep;
      timer.innerHTML = time.toFixed(3);
  
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

    let cube = new SceneObject(wgl, "Yellow Box");
    cube.setColor(YELLOW);
    cube.setGloss(2.0);
    cube.createCube();
    cube.lightColor = YELLOW;
    cube.lightBrightness = 0.8;
    cube.lightOn();
    cube.translate(0,1.9,0);
    cube.mass = 1;
    cube.vx = -4;
    cube.vz = -4;
    cube.rotateX(0);
    cube.bounciness = .8;
    globalScene.push(cube);

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


