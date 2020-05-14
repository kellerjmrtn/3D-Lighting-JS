# 3D Physics 

This project is a 3D Physics and Lighting simulator written in JavaScript, using WebGL. 
### Features:

 - Physics
    - Can model forces in arbitrary direction, though gravity is the only force applied in the demos
    - Collisions occur between all objects in the scene, and are modelled as perfectly rigid bodies undergoing perfectly elastic collisions
    - Motion is real-world accurate, as calulated by standard kinematic equations of motion
 - Lighting
    - The code supports an indefinite number of light sources. Any object in the scene can be turned into a point light source by calling the "lightOn()" method on that object
    - Vertex and Fragment shaders are dynamically rewritten and recompiled as lights are removed and added to the scene
    - Both Diffuse and Specular effects have been added
    - Light has color, and distance from the source is a factor in its intensity

### Installation
There are two methods of installation. The first is the intended method of use, and works much more smoothly. The second is an alternate form of installation that could be a bit easier, though I make no guarentees for it to work (although it did work when I tested it myself)

#### Method 1 (Recommended)
This works for any browser, though a Chromium-based browser is recommended due to its superior JavaScript engine. 
1. Download code using the green "Clone or Download" button
2. Install npm if you do not already have it installed (See Appendeix A for installation guide)
3. Once you have npm installed, run the command "npm install -g browser-sync"
4. Navigate to the code you downloaded in step 1 using file explorer.
5. Open a command line prompt *in that folder*. I recommend doing this by typing "cmd" in the folder path bar at the top and hitting enter. The current directory of the command line should be set to the root directory of the repository (in my case, this is the path: "C:\Users\kelle\Desktop\Classes\Programming\3D Physics")
6. Once you have this open, type "browser-sync -w" and hit enter. This will automatically start a server at localhost:3000/ and open up your browser. 
7. The homepage should open up. Click on any of the links to view a demo.
8. Once you are viewing a demo, use the pause, step, and start buttons, as well as the other options, as you please.
9. To reset the simulation, just refresh the page.

#### Method 2 (Easier, Firefox Only):
1. Download code using the green "Clone or Download" button
2. Open up Firefox and type "about:config" in the search bar. If a warning pops up, press continue
3. Here, search for "privacy.file_unique_origin" on this page. Set the value of this variable to "false" using the button on the right. **Note: this will cause security risks when visiting other websites, so is not recommended**
4. Navigate to the code you downloaded in step 1 using file explorer. Right click on the "index.html" file, and open it with Firefox.
5. The homepage should open up. Click on any of the links to view a demo.
6. Once you are viewing a demo, use the pause, step, and start buttons, as well as the other options, as you please.
7. To reset the simulation, just refresh the page.

#### Appendix A - Installing npm
1. Navigate to https://nodejs.org/en/ and download
2. Run the executable and follow the setup wizard.
3. The fourth slide of the setup wizard has a couple options you can select for a custom install. Ensure that the install will include the "npm package manager"
4. Once you've finished the wizard, node.js and npm have been installed. Type "npm -v" into the command line, and a version number should be output. This means that npm is working!
5. If this doesn't work, or isn't detailed enough for you, Google how to install npm, or follow the steps [here](https://www.guru99.com/download-install-node-js.html)

#### Appendix B - Adding A New Object To The Scene
If you're interesting in changing some of the code yourself, this is a small example of how to do so!

1. Locate one of the sim.js files in the repo. These are the files which define the objects and stuff going on in the simulation.
2. Scrolling down, you should find a line that looks like this:
    ```let background = new SceneObject(wgl, "background");```
3. This line creates a new object. This object is later added to the scene with the line:
    ```globalScene.push(background);```
4. All of the lines of code in between these two lines define the appearence and behavior of the object. The only requirement is that you give the object some sort of shape. Here is a list of properties you can change:
    - define shape - currently, you can do this by manually adding faces:
        ```background.addFace();```
        ```background.addFace().translate(0,0,1).rotateY(90);```
        ```background.addFace().translate(0,0,1).rotateX(-90);```
    which will generate half of a cube, or by calling the "createCube() function, which is currently the only supported function of its type:
        ```background.createCube();```
    **You must use one of these methods for the object to render**
    - color 
        - ```background.setColor([red, green, blue]);```
        - rgb coefficients should be 0-1
    - glossiness 
        - ```background.setGloss(1);```
        - multiplicative factor. Use any number
    - mass 
        - ```background.mass = 100```
        - units of kg
    - scale 
        - ```background.scale(scaleFactor, scaleFactor, scaleFactor);```
        - scaleFactor is a multiplicative number. Cubes are 1 meter x 1 meter x 1 meter by default
    - gravity 
        - ```background.gravity = true;```
        - true by default. Set to false to ignore gravity
    - collision detection 
        - ```background.collisionDetection = true;```
        - true by default. Set to false to ignore collisions
    - bounciness 
        - ```background.bounciness = 0.99;```
        - Number, less than 1, which defines the coefficient of "bounce". Higher numbers are more bouncy
    - friction 
        - ```background.friction = 0.8;```
        - Number, less than 1, which defines a pseudo coefficient of friction. Higher number means *less* friction
    - toggle light 
        - ```background.lightOn();```
        - ```background.lightOff();```
        - Turns the object into a light source, or turns it off
    - light color 
        - ```background.lightColor = [red, green, blue];```
        - rgb coefficients should be 0-1
        - defines color of light radiated by object, if its light is turned on
    - light brightness
        - ```background.lightBrightness = 1.0;```
        - Can be any number, multiplicative factor of radiated light strength
    - velocity & acceleration
        - ```background.vx = 1;```
        - The above sets the *initial* x velocity to 1 m/s.
        - You can also set the "vy", "vz", "ax", "ay", and "az" properties, where the "a" properties are acceleration
5. You don't need to define all of these, most are set to defaults. You can create your own object right next to the code for the objects that already exist, it's that easy! Simply save your code and refresh the page, and your object should show up and animate!