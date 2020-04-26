function print4x4Matrix(matrix){
  let str = "";

  for(let i = 0; i < 4; i++){
    str += "|  ";

    for(let j = 0; j < 4; j++){
      let val = matrix[4 * i + j];

      if(val >= 0){
        str += val.toFixed(2) + "  ";
      } else {
        str += val.toFixed(2) + " ";
      }
      
    }

    str += "|\n";
  }

  console.log(str);
}


export class WrappedGL {

  setup(vertexShaderFileName, fragmentShaderFileName) {
  
    let vp = fetch(vertexShaderFileName).then(
        function(response) { return response.text(); });
    let fp = fetch(fragmentShaderFileName).then(
        function(response) { return response.text(); });
    let wp = new Promise(
        function(resolve) { window.onload = resolve; });
    let vertexShaderText, fragShaderText;

    // When page is loaded, start gl setup.
    wp = wp.then(
        () => {  // Arrow function allows access to outer "this."
          let cv = document.querySelector("#canvas");
          this.gl = cv.getContext("webgl");
          this.gl.enable(this.gl.DEPTH_TEST);
          this.gl.clearColor(0, 0, 0, 1);
        });
  
    // When vertex shader is loaded (and gl setup started)
    // compile it.
    vp = Promise.all([vp, wp]).then(
        ([vpResponseText]) => {
          vertexShaderText = vpResponseText;
          this.vertexShader = this.gl.createShader(
              this.gl.VERTEX_SHADER);
          this.compileShader(this.vertexShader, vpResponseText);
        });
  
    
    // When fragment shader is loaded (and gl setup started)
    // compile it.
    fp = Promise.all([fp, wp]).then(
        ([fpResponseText]) => {
          fragShaderText = fpResponseText;
          this.fragmentShader = this.gl.createShader(
              this.gl.FRAGMENT_SHADER);
          this.compileShader(this.fragmentShader, fpResponseText);
        });
  
    // When both shaders are compiled, create shader program
    // and finish gl setup.
    return Promise.all([vp, fp]).then(
        () => {
          this.shaderProgram = this.gl.createProgram();
          this.gl.attachShader(
              this.shaderProgram, this.vertexShader);
          this.gl.attachShader(
              this.shaderProgram, this.fragmentShader);
          this.gl.linkProgram(this.shaderProgram);
          this.gl.useProgram(this.shaderProgram);
          
          this.setupPositionAttribute();
          this.setupNormalAttribute();
          this.setupTransformUniforms();
          this.setupColorUniform();
          this.setupGlossyUniform();
          this.lightSources = [];
          this.vertexShaderText = vertexShaderText;
          this.fragShaderText = fragShaderText;
        });
  }

  compileShader(shader, source){
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    let status = this.gl.getShaderParameter(
        shader, this.gl.COMPILE_STATUS);
    
    if (!status) {
      let f = (shader == this.vertexShader) ?
          this.vertexShaderFileName : this.fragmentShaderFileName;
      let g = this.gl.getShaderInfoLog(shader);
      console.error(`Unable to compile ${f}...\n${g}`);
    }
  }
  
  setupPositionAttribute(name = "position") {
    this.positionAttribute = this.gl.getAttribLocation(
        this.shaderProgram, name);
    this.gl.enableVertexAttribArray(this.positionAttribute);
  }
  
  setupNormalAttribute(name = "normal") {
    this.normalAttribute = this.gl.getAttribLocation(
        this.shaderProgram, name);
    this.gl.enableVertexAttribArray(this.normalAttribute);
  }
 
  
  setupTransformUniforms(pName = "pTransform",
      vName = "vTransform", mName = "mTransform",
      fName = "fTransform") {
    this.projectionTransformUniform = this.gl.getUniformLocation(
        this.shaderProgram, pName);
    this.viewingTransformUniform = this.gl.getUniformLocation(
        this.shaderProgram, vName);
    this.modelingTransformUniform = this.gl.getUniformLocation(
        this.shaderProgram, mName);
    this.faceTransformUniform = this.gl.getUniformLocation(
        this.shaderProgram, fName);
  }
  
  setupColorUniform(name = "color") {
    this.colorUniform = this.gl.getUniformLocation(
        this.shaderProgram, name);
  }

  setupGlossyUniform(name = "glossy"){
    this.glossyUniform = this.gl.getUniformLocation(
      this.shaderProgram, name
    );
  }

  vertexData(positions, normals) {
    this.numVertices = positions.length / 3;
    
    this.vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER,
        new Float32Array(positions), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(
        this.positionAttribute, 3, this.gl.FLOAT, false, 12, 0);
        
    this.normalBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER,
        new Float32Array(normals), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(
        this.normalAttribute, 3, this.gl.FLOAT, false, 12, 0);
  }

  clear() {
    this.gl.clear(
        this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
  
  setProjectionTransform(t) {
    this.gl.uniformMatrix4fv(this.projectionTransformUniform,
        false, new Float32Array(t.matrix));
  }
  
  setViewingTransform(t) {
    this.gl.uniformMatrix4fv(this.viewingTransformUniform,
        false, new Float32Array(t.matrix));
  }
  
  setModelingTransform(t) {
    this.gl.uniformMatrix4fv(this.modelingTransformUniform,
        false, new Float32Array(t.matrix));
  }

  setLightingTransform(t){
    this.gl.uniformMatrix4fv(this.lightingTransformUniform,
        false, new Float32Array(t.matrix));
  }

  setFaceTransform(t){
    this.gl.uniformMatrix4fv(this.faceTransformUniform,
      false, new Float32Array(t.matrix));
  }
  
  setColor(r, g, b) {
    this.gl.uniform3f(this.colorUniform, r, g, b);
  }

  setGlossy(val){
    this.gl.uniform1f(this.glossyUniform, val);
  }

  recompileShaders(){
    this.compileShader(this.vertexShader, this.vertexShaderText);
    this.compileShader(this.fragmentShader, this.fragShaderText);

    this.shaderProgram = this.gl.createProgram();
    this.gl.attachShader(
      this.shaderProgram, this.vertexShader);
    this.gl.attachShader(
      this.shaderProgram, this.fragmentShader);
    this.gl.linkProgram(this.shaderProgram);
    this.gl.useProgram(this.shaderProgram);

    this.setupPositionAttribute();
    this.setupNormalAttribute();
    this.setupTransformUniforms();
    this.setupColorUniform();
    this.setupGlossyUniform();

    for(let i in this.lightSources){
      let uniforms = this.lightSources[i].uniforms;
      uniforms.position = this.gl.getUniformLocation(
        this.shaderProgram, "lightPosition" + (Number(i) + 1)
      );
      uniforms.color = this.gl.getUniformLocation(
        this.shaderProgram, "lightColor" + (Number(i) + 1)
      );
      uniforms.brightness = this.gl.getUniformLocation(
        this.shaderProgram, "lightBrightness" + (Number(i) + 1)
      );
    }
  }
  
  updateLightingShaders(){
    let numLights = this.lightSources.length;
    let fragReplaceText1 = "//----\nconst int lightLen = " + numLights + ";\n";
    let fragReplaceText2 = "//====\n";
    let vertexReplaceText1 = "//----\nconst int lightLen = " + numLights + ";\n";
    let vertexReplaceText2 = "//====\n";

    for(let i in this.lightSources){
      vertexReplaceText2 += "lights[" + i + "] = lightPosition" + (Number(i) + 1) + ";\n";
      vertexReplaceText1 += "uniform vec3 lightPosition" + (Number(i) + 1) + ";\n";
      fragReplaceText1 += "uniform lowp vec3 lightColor" + (Number(i) + 1) + ";\n";
      fragReplaceText1 += "uniform lowp float lightBrightness" + (Number(i) + 1) + ";\n";
      fragReplaceText2 += "lightColors[" + i + "] = lightColor" + (Number(i) + 1) + ";\n";
      fragReplaceText2 += "lightBrightness[" + i + "] = lightBrightness" + (Number(i) + 1) + ";\n";
    }

    vertexReplaceText2 += "//====\n";
    vertexReplaceText1 += "//----\n";
    fragReplaceText1 += "//----\n";
    fragReplaceText2 += "//====\n";
    
    this.fragShaderText = this.fragShaderText.replace(/\/\/----(.|\s)*?\/\/----/g, fragReplaceText1);
    this.fragShaderText = this.fragShaderText.replace(/\/\/====(.|\s)*?\/\/====/g, fragReplaceText2);
    this.vertexShaderText = this.vertexShaderText.replace(/\/\/----(.|\s)*?\/\/----/g, vertexReplaceText1);
    this.vertexShaderText = this.vertexShaderText.replace(/\/\/====(.|\s)*?\/\/====/g, vertexReplaceText2);
  }

  setLightPositions(){  
    for(let i in this.lightSources){
      this.gl.uniform3fv(this.lightSources[i].uniforms.position, this.lightSources[i].position);
    }
  }

  setLightColors(){
    for(let i in this.lightSources){
      this.gl.uniform3fv(this.lightSources[i].uniforms.color, this.lightSources[i].color);
    }
  }

  setLightBrightness(){
    for(let i in this.lightSources){
      this.gl.uniform1f(this.lightSources[i].uniforms.brightness, this.lightSources[i].brightness);
    }
  }

  draw(mode = this.gl.TRIANGLE_FAN, n = this.numVertices) {
    this.gl.drawArrays(mode, 0, n);
  }
  
  drawLines(mode = this.gl.LINE_LOOP, n = this.numVertices) {
    this.draw(mode, n);
  }
  
  addLightSource(sceneObject){
    this.lightSources.push({
      id: sceneObject.id,
      uniforms: {
        position: this.gl.getUniformLocation(this.shaderProgram, "lightPosition" + (this.lightSources.length + 1)),
        color: this.gl.getUniformLocation(this.shaderProgram, "lightColor" + (this.lightSources.length + 1)),
        brightness: this.gl.getUniformLocation(this.shaderProgram, "lightBrightness" + (this.lightSources.length + 1))
      },
      position: sceneObject.getLightPosition(),
      color: sceneObject.lightColor,
      brightness: sceneObject.lightBrightness
    });

    this.updateLightingShaders();
    this.recompileShaders();
    this.setLightPositions();
    this.setLightColors();
    this.setLightBrightness();
  }

  removeLightSource(sceneObject){
    for(let i in this.lightSources){
      if(this.lightSources[i].id == sceneObject.id){
        this.lightSources.splice(i, 1);
      }
    }

    this.updateLightingShaders();
    this.recompileShaders();
    this.setLightPositions();
    this.setLightColors();
    this.setLightBrightness();
  }

  getLightById(id){
    for(let i in this.lightSources){
      if(this.lightSources[i].id == id){
        return this.lightSources[i];
      }
    }

    return null;
  }

  updateLights(sceneObject){
    let light = this.getLightById(sceneObject.id);

    if(light){
      light.position = sceneObject.getLightPosition();
      light.color = sceneObject.lightColor;
      light.brightness = sceneObject.lightBrightness;
    }

    this.setLightPositions();
    this.setLightColors();
    this.setLightBrightness();
  }
}

export class Face {
  constructor(wgl){
    this.wgl = wgl;
    this.faceTransform = new Transform();
    this.color = [0,0,0];
    this.glossCoeffecient = 0.0;
    this.vertexData = [0,1,0,  0,0,0,  1,0,0,  1,1,0];
    this.normalData = [0,0,1,  0,0,1,  0,0,1,  0,0,1];
  }

  draw(){
    this.wgl.setFaceTransform(this.faceTransform);
    this.wgl.setColor(...this.color);
    this.wgl.setGlossy(this.glossCoeffecient);
    this.wgl.vertexData(this.vertexData, this.normalData);
    this.wgl.draw();
  }

  rotateX(deg){
    this.faceTransform.rotateX(deg);
    return this;
  }

  rotateY(deg){
    this.faceTransform.rotateY(deg);
    return this;
  }

  rotateZ(deg){
    this.faceTransform.rotateZ(deg);
    return this;
  }

  translate(x, y, z){
    this.faceTransform.translate(x,y,z);
    return this;
  }

  getVertexCoords(){
    let m = this.faceTransform.matrix;
    let v = this.vertexData;
    let vertices = [];

    for(let i = 0; i < 4; i++){
      let x = m[0] * v[3 * i] + m[1] * v[3 * i + 1] + m[2] * v[3 * i + 2] + m[3];
      let y = m[4] * v[3 * i] + m[5] * v[3 * i + 1] + m[6] * v[3 * i + 2] + m[7];
      let z = m[8] * v[3 * i] + m[9] * v[3 * i + 1] + m[10] * v[3 * i + 2] + m[11];

      vertices.push([x,y,z]);
    }
    
    return vertices;
  }
}

let i = 0;

export class SceneObject {
  constructor(wgl, name = ""){
    this.id = i++;
    this.name = name;
    this.faces = [];
    this.wgl = wgl;
    this.length = 0;
    this.shapeColor = [0,0,0];
    this.glossCoeffecient = 0.0;
    this.transform = new Transform();
    this.isLight = false;
    this.lightColor = [1.0, 1.0, 1.0];
    this.lightBrightness = 1.0;
    this.lightOffset = [0,0,0];
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;
    this.hitBox = {
      minX: 0,
      minY: 0,
      minZ: 0,

      maxX: 0,
      maxY: 0,
      maxZ: 0
    } 
  }

  update(){
    this.wgl.updateLights(this);
    this.updateHitbox();
  }

  updateHitbox(){
    let scaleXYZ = [Math.abs(this.transform.matrix[0]) + Math.abs(this.transform.matrix[4]) + Math.abs(this.transform.matrix[8]), 
                    Math.abs(this.transform.matrix[1]) + Math.abs(this.transform.matrix[5]) + Math.abs(this.transform.matrix[9]),
                    Math.abs(this.transform.matrix[2]) + Math.abs(this.transform.matrix[6]) + Math.abs(this.transform.matrix[10])];
    let objXYZ = this.getPosition();
    let hitBox = {
      minX: 0,
      minY: 0,
      minZ: 0,

      maxX: 0,
      maxY: 0,
      maxZ: 0
    }

    if(this.length > 0){
      if(this.name == "Yellow Box"){
        print4x4Matrix(this.transform.matrix);
      }
      let coords = this.faces[0].getVertexCoords();
      hitBox.minX = coords[0][0] * scaleXYZ[0] + objXYZ[0];
      hitBox.maxX = coords[0][0] * scaleXYZ[0] + objXYZ[0];
      hitBox.minY = coords[0][1] * scaleXYZ[1] + objXYZ[1];
      hitBox.maxY = coords[0][1] * scaleXYZ[1] + objXYZ[1];
      hitBox.minZ = coords[0][2] * scaleXYZ[2] + objXYZ[2];
      hitBox.maxZ = coords[0][2] * scaleXYZ[2] + objXYZ[2];

      for(let c of this.faces){
        coords = c.getVertexCoords();

        for(let p of coords){
          let x = p[0] * scaleXYZ[0] + objXYZ[0];
          let y = p[1] * scaleXYZ[1] + objXYZ[1];
          let z = p[2] * scaleXYZ[2] + objXYZ[2];

          if(x < hitBox.minX){
            hitBox.minX = x;
          } else if(x > hitBox.maxX){
            hitBox.maxX = x;
          }

          if(y < hitBox.minY){
            hitBox.minY = y;
          } else if(y > hitBox.maxY){
            hitBox.maxY = y;
          }

          if(z < hitBox.minZ){
            hitBox.minZ = z;
          } else if(z > hitBox.maxZ){
            hitBox.maxZ = z;
          }
        }
      }
    }

    this.hitBox = hitBox;
  }

  getPosition(){
    return [this.transform.matrix[3], this.transform.matrix[7], this.transform.matrix[11]];
  }

  getLightPosition(){
    return [this.transform.matrix[3] + this.lightOffset[0], this.transform.matrix[7] + this.lightOffset[1], this.transform.matrix[11] + this.lightOffset[2]];
  }

  addFace(){
    let face = new Face(this.wgl);
    face.color = this.shapeColor;
    face.glossCoeffecient = this.glossCoeffecient;
    this.faces.push(face);
    this.length++;
    return face;
  }

  translate(x, y, z){
    this.transform.translate(x, y, z);
    this.update();
    return this;
  }

  rotateX(deg){
    this.transform.rotateX(deg);
    this.update();
    return this;
  }

  rotateY(deg){
    this.transform.rotateY(deg);
    this.update();
    return this;
  }

  rotateZ(deg){
    this.transform.rotateZ(deg);
    this.update();
    return this;
  }

  scale(sx, sy, sz){
    this.transform.scale(sx, sy, sz);
    this.update();
    return this;
  }

  draw(){
    this.wgl.setModelingTransform(this.transform);

    for(let c of this.faces){
      c.draw();
    }
  }

  setColor(color, overwrite = false){
    this.shapeColor = color;

    if(overwrite){
      for(let c of this.faces){
        c.color = color;
      }
    }
  }

  setGloss(coeffecient, overwrite = false){
    this.glossCoeffecient = coeffecient;

    if(overwrite){
      for(let c of this.faces){
        c.glossCoeffecient = coeffecient;
      }
    }
  }

  createCube(){
    this.addFace();
    this.addFace().translate(0,0,-1).rotateY(-90);
    this.addFace().translate(1,0,0).rotateY(90);
    this.addFace().translate(0,0,-1).rotateX(90);
    this.addFace().translate(0,1,0).rotateX(-90);
    /this.addFace().translate(0,1,-1).rotateX(180);
  }

  lightOn(){
    if(!this.isLight){
      this.wgl.addLightSource(this);
    }

    this.isLight = true;
  }

  lightOff(){
    if(this.isLight){
      this.wgl.removeLightSource(this);
    }

    this.isLight = false;
  }

  toggleLight(){
    if(this.isLight){
      this.wgl.removeLightSource(this);
      this.isLight = false;
    } else {
      this.wgl.addLightSource(this);
      this.isLight = true;
    }
  }
}

export class Transform {

  constructor(matrix = [1,0,0,0,  0,1,0,0,  0,0,1,0,  0,0,0,1]) {
    this.matrix = matrix;
    this.history = [];
  }
  
  push() { this.history.push(this.matrix); }
  pop() { this.matrix = this.history.pop(); }
  
  static multiply(a, b) {
    let c = [0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0];

    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++)
        for (let k = 0; k < 4; k++)
          c[i * 4 + j] += a[i * 4 + k] * b[k * 4 + j];
    
    return c;
  }
  
  multiplyBy(that) {
    this.matrix = Transform.multiply(this.matrix, that.matrix);
  }
  
  transformVertex(v) {
    v.push(1);
    let tv = [0, 0, 0, 0];
    
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++)
        tv[i] += this.matrix[i * 4 + j] * v[j];
    
    return [tv[0] / tv[3], tv[1] / tv[3], tv[2] / tv[3]];
  }

  translate(tx, ty, tz) {
    this.matrix = Transform.multiply(this.matrix,
        [1,0,0,tx,  0,1,0,ty,  0,0,1,tz, 0,0,0,1]);
    return this;
  }
  
  scale(sx, sy, sz) {
    this.matrix = Transform.multiply(this.matrix,
        [sx,0,0,0,  0,sy,0,0,  0,0,sz,0,  0,0,0,1]);
    return this;
  }
 
  rotate(axis, a, pre = false) {
    a *= Math.PI / 180;
    let c = Math.cos(a), s = Math.sin(a);
    let m;
    
    if (axis == "X") {
      m = [1,0,0,0,  0,c,-s,0,  0,s,c,0,  0,0,0,1];
    } else if (axis == "Y") {
      m = [c,0,s,0,  0,1,0,0,  -s,0,c,0,  0,0,0,1];
    } else { // Z by default
      m = [c,-s,0,0,  s,c,0,0,  0,0,1,0,  0,0,0,1];
    }
    
    if (pre)
      this.matrix = Transform.multiply(m, this.matrix);
    else
      this.matrix = Transform.multiply(this.matrix, m);
    
    return this;
  }
  
  preRotate(axis, a) {
    this.rotate(axis, a, true);
  }
 
  rotateX(a) { return this.rotate("X", a); }
  rotateY(a) { return this.rotate("Y", a); }
  rotateZ(a) { return this.rotate("Z", a); }
  
  preRotateX(a) { return this.rotate("X", a, true); }
  preRotateY(a) { return this.rotate("Y", a, true); }
  preRotateZ(a) { return this.rotate("Z", a, true); }
  
  frustum(r, t, n, f) {
    let a = (n + f) / (n - f);
    let b = 2 * n * f / (n - f);
    
    this.matrix = Transform.multiply(this.matrix,
        [n/r,0,0,0,  0,n/t,0,0,  0,0,a,b,  0,0,-1,0]);

    return this;
  }
  
  static invert(transform) {
    let [m00, m01, m02, m03,
         m10, m11, m12, m13,
         m20, m21, m22, m23,
         m30, m31, m32, m33] = transform.matrix;
    
    let i00 =  m11 * m22 * m33  -  m11 * m23 * m32 -
               m21 * m12 * m33  +  m21 * m13 * m32 +
               m31 * m12 * m23  -  m31 * m13 * m22;

    let i10 = -m10 * m22 * m33  +  m10 * m23 * m32 +
               m20 * m12 * m33  -  m20 * m13 * m32 -
               m30 * m12 * m23  +  m30 * m13 * m22;

    let i20 =  m10 * m21 * m33  -  m10 * m23 * m31 -
               m20 * m11 * m33  +  m20 * m13 * m31 +
               m30 * m11 * m23  -  m30 * m13 * m21;

    let i30 = -m10 * m21 * m32  +  m10 * m22 * m31 +
               m20 * m11 * m32  -  m20 * m12 * m31 -
               m30 * m11 * m22  +  m30 * m12 * m21;

    let det = m00 * i00 + m01 * i10 + m02 * i20 + m03 * i30;
    
    // Assume det != 0 (i.e., matrix has an inverse).
      
    i00 = i00 / det;
    i10 = i10 / det;
    i20 = i20 / det;
    i30 = i30 / det;

    let i01 = (-m01 * m22 * m33  +  m01 * m23 * m32 +
                m21 * m02 * m33  -  m21 * m03 * m32 -
                m31 * m02 * m23  +  m31 * m03 * m22) / det;

    let i11 = ( m00 * m22 * m33  -  m00 * m23 * m32 -
                m20 * m02 * m33  +  m20 * m03 * m32 +
                m30 * m02 * m23  -  m30 * m03 * m22) / det;

    let i21 = (-m00 * m21 * m33  +  m00 * m23 * m31 +
                m20 * m01 * m33  -  m20 * m03 * m31 -
                m30 * m01 * m23  +  m30 * m03 * m21) / det;

    let i31 = ( m00 * m21 * m32  -  m00 * m22 * m31 -
                m20 * m01 * m32  +  m20 * m02 * m31 +
                m30 * m01 * m22  -  m30 * m02 * m21) / det;

    let i02 = ( m01 * m12 * m33  -  m01 * m13 * m32 -
                m11 * m02 * m33  +  m11 * m03 * m32 +
                m31 * m02 * m13  -  m31 * m03 * m12) / det;

    let i12 = (-m00 * m12 * m33  +  m00 * m13 * m32 +
                m10 * m02 * m33  -  m10 * m03 * m32 -
                m30 * m02 * m13  +  m30 * m03 * m12) / det;

    let i22 = ( m00 * m11 * m33  -  m00 * m13 * m31 -
                m10 * m01 * m33  +  m10 * m03 * m31 +
                m30 * m01 * m13  -  m30 * m03 * m11) / det;

    let i32 = (-m00 * m11 * m32  +  m00 * m12 * m31 +
                m10 * m01 * m32  -  m10 * m02 * m31 -
                m30 * m01 * m12  +  m30 * m02 * m11) / det;

    let i03 = (-m01 * m12 * m23  +  m01 * m13 * m22 +
                m11 * m02 * m23  -  m11 * m03 * m22 -
                m21 * m02 * m13  +  m21 * m03 * m12) / det;

    let i13 = ( m00 * m12 * m23  -  m00 * m13 * m22 -
                m10 * m02 * m23  +  m10 * m03 * m22 +
                m20 * m02 * m13  -  m20 * m03 * m12) / det;

    let i23 = (-m00 * m11 * m23  +  m00 * m13 * m21 +
                m10 * m01 * m23  -  m10 * m03 * m21 -
                m20 * m01 * m13  +  m20 * m03 * m11) / det;

    let i33 = ( m00 * m11 * m22  -  m00 * m12 * m21 -
                m10 * m01 * m22  +  m10 * m02 * m21 +
                m20 * m01 * m12  -  m20 * m02 * m11) / det;

    return new Transform([i00, i01, i02, i03,
                          i10, i11, i12, i13,
                          i20, i21, i22, i23,
                          i30, i31, i32, i33]);
  }
}
