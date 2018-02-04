function main() {

  //gets rid of old animation call
  //console.log(typeof(id));
  if (typeof(id) !== 'undefined') {
    cancelAnimationFrame(id);
  }

  //constants
  maxTemp = 40;
  particleCount = $('#partCount').val();
  roomSize = $('#size').val();
  absorptionCoeff = $('#abs').val();
  scatteringCoeff = $('#scatter').val();
  scaleFactor = 0.33 + $('#temp').val() / maxTemp * .15;
  x = Math.round($('#xPos').val()),
  y = Math.round($('#yPos').val()),
  z = Math.round($('#zPos').val());
  //variable to stop scene if there are no longer particles in the cube
  stillCounter = 0;

  //this sets up the scene, camera, renderer, and controls
  scene = new THREE.Scene();
  camera = initCamera();
  renderer = new THREE.WebGLRenderer({canvas: $('canvas')[0]});
  controls = initControls(camera,renderer);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //sets up everything going in the scene
  var cube = initCube();
  var axes = initAxes();
  particles = initParticles();
  particleSystem = initParticleSystem();
  
  //add everything in
  scene.add(camera);
  scene.add(cube);
  scene.add(axes);
  scene.add(particleSystem);
  
  //console.log(scene);
  animate();
}


function initCamera() {
  var camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,0.1,1000);
  camera.position.x = roomSize;
  camera.position.y = roomSize * 1.5;
  camera.position.z = roomSize * 2;
  return camera
}

function initControls() {
  var controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableKeys = false;
  return controls
}

//old version to get cube
/**
function initCube() {
  //creates a cube
  
  var geometry = new THREE.BoxGeometry(roomSize,roomSize,roomSize);
  var material = new THREE.MeshBasicMaterial({wireframe: true, color: 0xffffff});
  var cube = new THREE.Mesh(geometry,material);
  cube.position.x = roomSize/2;
  cube.position.y = roomSize/2;
  cube.position.z = roomSize/2;
  return cube 
}
*/

function initCube() {
  //creates a cube
  var geometry = new THREE.BoxGeometry(roomSize,roomSize,roomSize);
  //gets the hard edges from the cube
  var frame = new THREE.EdgesGeometry(geometry);
  //material for the wireframe
  var material = new THREE.LineBasicMaterial({color: 0xffffff, linewidth: 2});
  //puts geometry and material together
  var cube = new THREE.LineSegments( frame, material)
  //positions cube in scene
  cube.position.x = roomSize / 2;
  cube.position.y = roomSize / 2;
  cube.position.z = roomSize / 2;
  return cube 
}

function initAxes() {  
  //creates axes
  var axisSize = roomSize * 5 / 4;
  var axes = new THREE.AxisHelper(axisSize);
  return axes
}

function velocity() {
  //randomly create a 3-D unit vector
  theta = Math.random() * 2 * Math.PI;
  k = Math.random() * 2 - 1;
  i = Math.sqrt(1 - Math.pow(k,2)) * Math.cos(theta);
  j = Math.sqrt(1 - Math.pow(k,2)) * Math.sin(theta);
  //scales the unit vector
  vec = [i,j,k].map(function(t) { return t * scaleFactor; });
  return vec
}



function initParticles() {
  //creates all the particle parameters
  var particles = new THREE.Geometry();

  //create particles
  for (p = 0; p < particleCount; p++) {

    particle = new THREE.Vector3(x,y,z);
    velVector = velocity();
    particle.velocity = new THREE.Vector3(velVector[0],velVector[1],velVector[2]);     
    particles.vertices.push(particle);
  }
  return particles;
}

function initParticleSystem() {
  var particleMaterial = new THREE.PointsMaterial({color: 0xff0000})
  var particleSystem = new THREE.Points(particles,particleMaterial);
  return particleSystem;
}

function absorptionSimulator(particle) {
  if (Math.random() < absorptionCoeff) {
      particle.x = roomSize * 10;
      particle.y = roomSize * 10;
      particle.z = roomSize * 10;
      particle.velocity.x = 0;
      particle.velocity.y = 0;
      particle.velocity.z = 0;
    }
}
//TODO: fix the sideHit
function scatteringSimulator(particle) {
  if (Math.random() < scatteringCoeff) {
    vel = velocity();
    
    console.log(particle.velocity.x)
    particle.velocity.x = 0;
    particle.velocity.y = 0;
    particle.velocity.z = 0.5;
    console.log(particle.velocity.x)
  }
}

function animate() {

  var pCount = particleCount;
  while (pCount--) {
    //console.log(particle.velocity);
    particle = particles.vertices[pCount];
    //console.log(particle);

    //bounds for letting the particles move around

  
    if (particle.x > roomSize) {
      //particle.x = roomSize,
      particle.velocity.x *= -1;
      absorptionSimulator(particle);
      scatteringSimulator(particle);

    } else if (particle.x < 0) {
      //particle.x = 0,
      particle.velocity.x *= -1;
      absorptionSimulator(particle);
      scatteringSimulator(particle);

    }
    
    if (particle.y > roomSize) {
      //particle.y = roomSize,
      particle.velocity.y *= -1;
      absorptionSimulator(particle);
      scatteringSimulator(particle);

    } else if (particle.y < 0) {
      //particle.y = 0,
      particle.velocity.y *= -1;
      absorptionSimulator(particle);
      scatteringSimulator(particle);

    }
    
    if (particle.z > roomSize) {
      //particle.z = roomSize,
      particle.velocity.z *= -1;
      absorptionSimulator(particle);
      scatteringSimulator(particle);

    } else if (particle.z < 0) {
      //particle.z = 0,
      particle.velocity.z *= -1;
      absorptionSimulator(particle);
      scatteringSimulator(particle);

    }
    //gets particle offscreen if it is not moving fast enough
    if (particle.velocity.length() < .01) {
      particle.x = 100;
      particle.y = 100;
      particle.z = 100;
      particle.velocity.x = 0;
      particle.velocity.y = 0;
      particle.velocity.z = 0;
    }
    //updates particle position
    particle.add(particle.velocity);
    //counts up if nothing is happening on screen
    if (particle.x === roomSize * 10 & particle.y === roomSize * 10 & particle.z === roomSize * 10) {
      stillCounter += 1;
    } else {
      stillCounter = 0;
    }

  }
  //updates scene
  particleSystem.geometry.verticesNeedUpdate = true;

  //freezes scene if nothing is happening for 100 particles
  if (stillCounter < 100) {
    //updates controls
    controls.update();
    //animates frames
    renderer.render(scene,camera);
    
    id = requestAnimationFrame(animate);
  }    
}

$(document).ready(main);