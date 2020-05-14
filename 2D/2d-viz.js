let taPt = document.querySelector("#points");
let taTr = document.querySelector("#transforms");
let taMx = document.querySelector("#matrix");
let zoomIn = document.querySelector("#zoomIn");
let zoomOut = document.querySelector("#zoomOut");
let currZoom = 1;

taPt.value = "1 1\n3 1\n3 3\n2 4\n1 3";
taTr.value = "t: 1 1\ns: 2 2";

function trToMx(s) {
  // Argument string is a line from the transform textarea, e.g.,
  // "t: -2 -4" (t for translation, s for scale, r for rotation).
  
  // Function should return a 9-element array representing the
  // appropriate transformation matrix (in row major order).
  // Strings should be converted to numbers, so that the array
  // returned has elements like, e.g., 0 instead of "0".

  let b = s.split(":");
  let type = b[0];
  let args = b[1].trim().split(" ");
  let c = [];
  
  if(type.includes("t")){
    // translate
    c = [1, 0, Number(args[0]), 0, 1, Number(args[1]), 0, 0, 1];

  } else if(type.includes("r")){
    // rotate
    let pi = Math.PI;
    let sin = Math.sin(Number(args[0]) * (pi/180));
    let cos = Math.cos(Number(args[0]) * (pi/180));

    c = [cos, -1 * sin, 0, sin, cos, 0, 0, 0, 1];
  } else if(type.includes("s")){
    // scale

    c = [Number(args[0]), 0, 0, 0, Number(args[1]), 0, 0, 0, 1];
  } else if(type.includes("m")){
    for(let i in args){
      c.push(Number(args[i]));
    }
  }

  return c;
}

function mxMult(a, b) {
  // Argument a is a 9-element array representing a transformation
  // matrix (in row major order).  b may be a 9-element array,
  // representing another matrix, or a 2-element array, representing
  // a point.
  
  // If b represents a matrix, function should multiply matrix a
  // times matrix b and return a 9-element array representing the
  // product.
  
  // If b represents a point, function should add a third coordinate
  // (z = 1) to the point and then multiply matrix a times the
  // point.  The resulting three coordinate point [x, y, z] should
  // be converted back to two coordinates, dividing the first two
  // by the third; the result, [x/z, y/z] should then be returned.

  let c = [];

  if(b.length == 9){
    for(let i = 0; i < 9; i++){
      c.push(0);
    }
    
    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++){
        for(let k = 0; k < 3; k++){
          c[3 * i + j] += a[3 * i + k] * b[3 * k + j];
        }
      }
    }
  } else if(b.length == 2){
    b.push(1);

    for(let i = 0; i < 3; i++){
      c.push(0);
    }

    for(let i = 0; i < 3; i++){
      for(let k = 0; k < 3; k++){
        c[i] += a[3 * i + k] * b[k];
      }
    }

    c[0] = c[0] / c[2];
    c[1] = c[1] / c[2];
    c = c.slice(0, c.length - 1);
  }

  return c;
}

function readTr(str) {
  // This function should read the transform textarea (from
  // taTr.value), use trToMx to get the transformation matrix
  // corresponding to each line, and then use mxMult to multiply
  // these transformation matrices together, producing a single
  // composite transformation matrix.
  
  // The function should return this composite transformation
  // matrix.

  let a;

  if(str === undefined){
    a = taTr.value;
  } else {
    a = str;
  }
  
  a = a.split("\n").reverse();
  let b = [];
  b.push([1, 0, 0, 0, 1, 0, 0, 0, 1]);
  b.push([]);

  for(let s of a){
    b[1] = trToMx(s);
    b[0] = mxMult(b[0], b[1]);
  }

  return b[0];
}

function readPts() {
  let a = taPt.value.split("\n");
  let b = []
  
  for (let s of a) {
    let p = s.split(" ").filter((t) => t != "").map((s) => Number(s));
    b.push(p);
  }
  
  return b;
}

function updateTaMx(m, d = 1) {
  let s = "";
  
  for (let i = 0; i < 9; i++) {
    s += m[i].toFixed(d) + " ";
    if (i % 3 == 2) s += "\n";
  }
  
  taMx.value = s;
}

let cv = document.querySelector("canvas");
let ct = cv.getContext("2d");
ct.translate(cv.width / 2, cv.height / 2);

function clear() {
  ct.clearRect(
      -cv.width / 2, -cv.height / 2, cv.width, cv.height);
}

function drawAxes() {
  ct.beginPath();
  ct.moveTo(-cv.width, 0);
  ct.lineTo(cv.width, 0);
  ct.stroke();

  for (let i = -cv.width / 2 + 20; i < cv.width / 2; i += 20) {
    ct.beginPath();
    ct.moveTo(i, -5);
    ct.lineTo(i, 5);
    ct.stroke();
  }
  
  ct.beginPath();
  ct.moveTo(0, -cv.height);
  ct.lineTo(0, cv.height);
  ct.stroke();

  for (let i = -cv.height / 2 + 20; i < cv.height / 2; i += 20) {
    ct.beginPath();
    ct.moveTo(-5, i);
    ct.lineTo(5, i);
    ct.stroke();
  }
}

function draw(a, fill = "#ccc") {
  let b = a.map(([x, y]) => [20 * x, -20 * y]);

  ct.fillStyle = fill;
  ct.beginPath();
  ct.moveTo(b[0][0], b[0][1]);
  
  for (let [x, y] of b.slice(1)) {
    ct.lineTo(x, y);
  }
  
  ct.closePath();
  ct.stroke();
  ct.fill();
  ct.fillStyle = "#000";

  for (let [x, y] of b) {
    ct.beginPath();
    ct.arc(x, y, 2, 0, 2 * Math.PI);
    ct.fill();
  }
}

function update(tr) {
  let p = readPts();
  let w;

  if(tr === undefined){
    tr = readTr();
    w = p;
  } else {
    tr = readTr(tr);
    /*w = [];

    for(let s of p){
      w.push(mxMult([currZoom, 0, 0, 0, currZoom, 0, 0, 0, 1], s));
    }

    console.log(w);
    console.log(p);*/
  }

  clear();
  drawAxes();
  
  draw(p, "rgb(250, 240, 120, 0.5)");
  updateTaMx(tr);
  console.log(tr);
  let q = p.map((e) => mxMult(tr, e));
  draw(q, "rgb(150, 180, 250, 0.5)");
}

taPt.onkeyup = taPt.onchange = function(){update(); currZoom = 1};
taTr.onkeyup = taTr.onchange = function(){update(); currZoom = 1};
update();

zoomIn.addEventListener("click", function(){
  currZoom += .125;
  update(taTr.value + "\ns: " + currZoom + " " + currZoom);
});

zoomOut.addEventListener("click", function(){
  currZoom -= .125;
  update(taTr.value + "\ns: " + currZoom + " " + currZoom);
});