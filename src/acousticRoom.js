function main() {
  //document.getElementById('jsOutput').innerHTML = 'this is a quick test.';
  
  
  //this sets up the scene, camera, and renderer
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
  var renderer = new THREE.WebGLRenderer();
  
  
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  
  
  //this creates a cube
  var roomSize = 20;
    
  var geometry = new THREE.BoxGeometry(roomSize,roomSize,roomSize);
  var material = new THREE.MeshBasicMaterial({wireframe: true, color: 0xffffff});
  var cube = new THREE.Mesh(geometry,material);
  cube.position.x = roomSize/2;
  cube.position.y = roomSize/2;
  cube.position.z = roomSize/2;
  scene.add(cube);
  
  //creates axes
  var axisSize = roomSize*5/4;
  var axes = new THREE.AxisHelper(axisSize);
  scene.add(axes);
  
  
//creates all the particles
  var particleMaterial = new THREE.PointsMaterial({color: 0xff0000})
  var particleCount = 10;
  var particles = new THREE.Geometry();
  
  
 // var particles = Array.apply(null, Array(particleCount)).map(Number.prototype.valueOf,0);
  
  //create particles
  for (p = 0; p <= particleCount; p++) {
    var x = Math.random()*20,
        y = Math.random()*20,
        z = Math.random()*20;
        particle = new THREE.Vector3(x,y,z);
        particle.velocity = new THREE.Vector3(Math.random(),Math.random(),Math.random());
        
    particles.vertices.push(particle);
  };
  
  var particleSystem = new THREE.Points(particles,particleMaterial);
  
  scene.add(particleSystem);
  /*
  function updatePart(particles){
    var pCount = particleCount;
    while (pCount--) {
      particle = particles.vertices[pCount];
      if (particle.position.x >= roomSize) {
        particle.position.x = roomSize,
        particle.velocity.x = -1*particle.velocity.x;
      };
      if (particle.position.y >= roomSize) {
        particle.position.y = roomSize,
          particle.velocity.y = -1*particle.velocity.y;
      };
      if (particle.position.z >= roomSize) {
        particle.position.z = roomSize,
          particle.velocity.z = -1*particle.velocity.z;
      };
      
      particle.position.addSelf(particle.velocity);
      
      
    };
  };
  */
  
  
  
 /* 
  for (i=0; i <= particleCount; i++){
    particles[i] = new THREE.Mesh(particleGeo,particleMaterial);
    
    particles[i].position.x = Math.random()*20;
    particles[i].position.y = Math.random()*20;
    particles[i].position.z = Math.random()*20;
    
    //console.log(particles[i]);
    
    particles[i].velocity = new THREE.Vector3(Math.random(),Math.random(),Math.random());
    scene.add(particles[i]);
  };
  */
  
  

  
  
  //var light = new THREE.PointLight(0xffff00);
  
  //light.position.set(10,10,10);
  //scene.add(light);
  camera.position.z = 50;
  //adds mouse control
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  
  
  function animate() {
    
    //updatePart(particles);
    var pCount = particleCount;
    while (pCount--) {
      
      particle = particles.vertices[pCount];
      
      //console.log(particle);
      
      if (particle.x >= roomSize) {
        particle.x = roomSize,
          particle.velocity.x = -1*particle.velocity.x;
      } else if (particle.x <= 0){
        particle.x = 0,
          particle.velocity.x = -1*particle.velocity.x
      };
      
      if (particle.y >= roomSize) {
        particle.y = roomSize,
        particle.velocity.y = -1*particle.velocity.y;
      } else if (particle.y <= 0){
        particle.y = 0,
        particle.velocity.y = -1*particle.velocity.y;
      };
      
      if (particle.z >= roomSize) {
        particle.z = roomSize,
        particle.velocity.z = -1*particle.velocity.z;
      } else if (particle.z <= 0){
        particle.z = 0,
        particle.velocity.z = -1*particle.velocity.z;
      };

      particle.add(particle.velocity);

    };
    //particleSystem.geometry.__dirtyVertices = true;
    particleSystem.geometry.verticesNeedUpdate = true;
    
    renderer.render(scene,camera);
    
    requestAnimationFrame(animate);
    //updates controls
    controls.update();
    
  };
  animate();
  
};


$(document).ready(main);