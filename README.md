#3D JavaScript Renderer w/ WebGL

####A few features of this project:
 - The code supports an indefinite number of light sources. Just call the lightOn() method on any object in the scene to turn that object into a point light source!
 - Vertex and Fragment shaders are dynamically rewritten and recompiled as lights are removed and added to the scene
 - Both Diffuse and Specular effects have been added
 - Light has color, and distance from the source is a factor in its intensity
 - Mild Physics simulation has been added, though it was added quickly in the end and is not robust. The meat of this project is in the lighting simulations
