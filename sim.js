import { WrappedGL, Transform, Face, SceneObject } from "./cis487.js";

let WHITE = [1, 1, 1];
let BLACK = [0,0,0];
let GRAY = [0.3, 0.3, 0.3];
let GREEN = [0, 0.6, 0.3];
let YELLOW = [1, 0.8, 0];
let RED = [1, 0, 0];
let BLUE = [0, 0, 1];

let pause = true;

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
  

  function setDefaultTransforms(){
    wgl.setProjectionTransform(pt);
    wgl.setViewingTransform(vt);
    wgl.setModelingTransform(mt);
    wgl.setFaceTransform(ft);
  }

  function gravity(gravityObjects, floorObj, noMove){
    let floorPosY = floorObj.getPosition()[1];
    let floorPosX = floorObj.getPosition()[0];
    let floorPosZ = floorObj.getPosition()[2] + 2;

    for(let c of gravityObjects){
      // Y bounce
      if(c.getPosition()[1] > floorPosY){
        if(!(c.vy < 0.01 && c.vy > -0.01 && c.getPosition()[1] < (floorPosY + 0.25))){
          c.translate(0,c.vy,0);
          c.vy -= gStrength;
        } else {
          if(!noMove.includes(c)){
            noMove.push(c);
          }
        }
      } else {
        c.vy = Math.abs(c.vy) * 0.75;
        c.translate(0,c.vy,0);
      }

      // X bounce
      if(c.getPosition()[0] > floorPosX){
        c.vx *= 0.995;
        c.translate(c.vx, 0, 0);
      } else {
        c.vx = Math.abs(c.vx) * 0.9;
        c.translate(c.vx,0,0);
      }

      // Z bounce
      if(c.getPosition()[2] > floorPosZ){
        c.vz *= 0.995;
        c.translate(0, 0, c.vz);
      } else {
        c.vz = Math.abs(c.vz) * 0.9;
        c.translate(0,0,c.vz);
      }
    }
  }

  let i = 0;
  let gStrength = 0.002;

  function go(){
    function draw() {
      i++;
      wgl.clear(); 
      setDefaultTransforms();

      gravity(gravityObjects, background, noMove);
  
      /*if(i % 100 == 0){
        cube.toggleLight();
      }*/
      
      cube.draw();
      cube2.draw();
      background.draw();
      mainLight.draw();

      //console.log(cube.transform);
      //console.log(cube.hitBox);
      console.log(cube.hitBox);

      if(pause || noMove.length == gravityObjects.length){
        return;
      }

      requestAnimationFrame(draw); 
    }

    let background = new SceneObject(wgl, "Background");
    background.setColor(GRAY);
    background.setGloss(1);
    background.translate(-3, -3, -3).scale(8,8,8);
    background.addFace();
    background.addFace().translate(0,0,1).rotateY(90);
    background.addFace().translate(0,0,1).rotateX(-90);

    let cube = new SceneObject(wgl, "Yellow Box");
    cube.setColor(YELLOW);
    cube.setGloss(2.0);
    cube.createCube();
    //cube.translate(1,2,2.5).scale(2,2,2);
    cube.lightColor = YELLOW;
    cube.lightBrightness = 0.8;
    cube.lightOffset = [1,1,-1];
    //cube.vy = -0.08;
    //cube.vx = -0.03;
    //cube.vz = -0.04;
    cube.lightOn();
    cube.translate(0,0,0);
    cube.scale(1,1,1);
    cube.rotateX(30);

    let cube2 = new SceneObject(wgl, "Red Box");
    cube2.setColor(RED);
    cube2.createCube();
    cube2.translate(0,0,0);
    cube2.scale(.2,.2,.2);
    //cube2.rotateX(30);    
    
    
 
    /*let cube2 = new SceneObject(wgl);
    cube2.setColor(WHITE);
    cube2.setGloss(1.0);
    cube2.createCube();
    cube2.translate(0,2,0);
    cube2.lightColor = WHITE;
    cube2.lightBrightness = .6;
    cube2.lightOffset = [0.5, 0.5, -0.5];
    cube2.vy = 0.05;
    cube2.vx = 0.01;
    cube2.vz = 0.02;
    cube2.lightOn();

    let cube3 = new SceneObject(wgl);
    cube3.setColor(RED);
    cube3.setGloss(0.4);
    cube3.createCube();
    cube3.translate(10,0,2).scale(0.5, 0.5, 0.5);
    cube3.lightColor = RED;
    cube3.lightBrightness = 0.5;
    cube3.lightOffset = [0.25, 0.25, -0.25];
    cube3.vx = -0.2;
    cube3.vy = 0.2;
    cube3.vz = -0.04;
    cube3.lightOn();*/

    /*let cube4 = new SceneObject(wgl);
    cube4.setColor(GREEN);
    cube4.createCube();*/

    let gravityObjects = [cube2/*, cube2, cube3*/];
    let noMove = [];

    draw();

    let pauseBtn = document.querySelector("#pause");
    pauseBtn.onclick = function(){
      pause = true;
    }
  
    let startBtn = document.querySelector("#start");
    startBtn.onclick = function(){
      pause = false;
      draw();
    }

    let xSlide = document.querySelector("#x");
    xSlide.oninput = function(){
      cube.vx = this.value / 200;
    }

    let ySlide = document.querySelector("#y");
    ySlide.oninput = function(){
      cube.vy = this.value / 200;
    }

    let zSlide = document.querySelector("#z");
    zSlide.oninput = function(){
      cube.vz = this.value / 200;
    }

    let gSlide = document.querySelector("#gravity");
    gSlide.oninput = function(){
      gStrength = this.value / 10000;
    }
  }

  go();
}


