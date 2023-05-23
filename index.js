import { TeapotGeometry } from "./TeapotGeometry.js";
import * as THREE from "./three.module.js";
import { GUI } from "./lil-gui.module.min.js";
import { OrbitControls } from "./OrbitControls1.js";

var solidTeapot, lineTeapot, pointTeapot;

function init(type) {
  var scene = new THREE.Scene();
  var gui = new GUI();

  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );

  camera.position.x = 1;
  camera.position.y = 2;
  camera.position.z = 5;

  camera.lookAt(new THREE.Vector3(0, 0, 0));

  if (type === "Solid") {
    solidTeapot = GetSolidTeaPot(0.5, 8);
    solidTeapot.name = "solidTeapot";
    scene.add(solidTeapot);
  }

  if (type === "Line") {
    lineTeapot = GetLineTeaPot(0.5, 8);
    lineTeapot.name = "lineTeapot";
    scene.add(lineTeapot);
  }

  if (type === "Point") {
    pointTeapot = GetPointTeaPot(0.5, 8);
    pointTeapot.name = "pointTeapot";
    scene.add(pointTeapot);
  }

  var plane = getPlane(20);
  plane.rotation.x = Math.PI / 2;
  plane.position.y = -2;

  var pointLight1 = getPointLight(1);
  pointLight1.position.y = 1.5;
  var sphere1 = getSphere(0.05);

  scene.add(pointLight1);
  scene.add(plane);
  pointLight1.add(sphere1);

  const pointLightFolder1 = gui.addFolder("pointLight1");
  const solidTeapotFolder = gui.addFolder("solidTeapot");
  const lineTeapotFolder = gui.addFolder("lineTeapot");
  const pointTeapotFolder = gui.addFolder("pointTeapot");

  pointLightFolder1.add(pointLight1, "intensity", 0, 10);
  pointLightFolder1.add(pointLight1.position, "x", 0, 5);
  pointLightFolder1.add(pointLight1.position, "y", 0, 5);
  pointLightFolder1.add(pointLight1.position, "z", 0, 5);

  if (solidTeapot) {
    solidTeapotFolder.add(solidTeapot.scale, "x", 0, 2);
    solidTeapotFolder.add(solidTeapot.scale, "y", 0, 2);
    solidTeapotFolder.add(solidTeapot.scale, "z", 0, 2);
  }

  if (lineTeapot) {
    lineTeapotFolder.add(lineTeapot.scale, "x", 0, 2);
    lineTeapotFolder.add(lineTeapot.scale, "y", 0, 2);
    lineTeapotFolder.add(lineTeapot.scale, "z", 0, 2);
  }

  if (pointTeapot) {
    pointTeapotFolder.add(pointTeapot.scale, "x", 0, 2);
    pointTeapotFolder.add(pointTeapot.scale, "y", 0, 2);
    pointTeapotFolder.add(pointTeapot.scale, "z", 0, 2);
  }

  var renderer = new THREE.WebGLRenderer;
  renderer.shadowMap.enabled = true;

  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.setClearColor("rgb(120, 120, 120)");

  document.getElementById("webgl").appendChild(renderer.domElement);

  var controls = new OrbitControls(camera, renderer.domElement);

  update(renderer, scene, camera, controls);
  return scene;
}

function getPlane(size) {
  var geometry = new THREE.PlaneGeometry(size, size);
  var material = new THREE.MeshPhongMaterial({
    color: 'rgb(120,120,120)',
    side: THREE.DoubleSide
  });
  var mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true;
  return mesh;
}

function getSphere(size) {
  var geometry = new THREE.SphereGeometry(size, 24, 24);
  var material = new THREE.MeshBasicMaterial({
    color: 'rgb(255, 255, 255)'
  });
  var mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getPointLight(intensity) {
  var light = new THREE.PointLight(0xffffff, intensity);
  light.castShadow = true;
  return light;
}

function update(renderer, scene, camera, controls) {
  renderer.render(scene, camera);

  if (solidTeapot) {
    solidTeapot.rotation.z += 0.01;
    solidTeapot.rotation.y += 0.01;
  }

  if (lineTeapot) {
    lineTeapot.rotation.z -= 0.01;
    lineTeapot.rotation.y -= 0.01;
  }

  if (pointTeapot) {
    pointTeapot.rotation.z += 0.01;
    pointTeapot.rotation.y += 0.01;
  }

  controls.update();

  requestAnimationFrame(function () {
    update(renderer, scene, camera, controls);
  });
}

function GetSolidTeaPot(size, tess) {
  var teapotGeometry = new TeapotGeometry(size, tess);
  var textureLoader = new THREE.TextureLoader();
  var image = textureLoader.load('./White.png');
  var teapotMaterial = new THREE.MeshPhongMaterial({
    color: 'rgb(255, 255, 255)',
    map: image
  });
  var teapotMesh = new THREE.Mesh(teapotGeometry, teapotMaterial);
  teapotMesh.position.x = 0;
  teapotMesh.castShadow = true;
  return teapotMesh;
}

function GetLineTeaPot(size, tess) {
  var teapotGeometry = new TeapotGeometry(size, tess);
  var wireframe = new THREE.WireframeGeometry(teapotGeometry);
  var line = new THREE.LineSegments(wireframe);
  line.material.depthTest = false;
  line.material.opacity = 0.25;
  line.material.transparent = true;
  line.material.color = 'rgb(255,255,255)';
  line.castShadow = true;

  return line;
}

function GetPointTeaPot(size, tess) {
  var teapotGeometry = new TeapotGeometry(size, tess);
  var material = new THREE.PointsMaterial({ color: 0x888888, size: 0.1 });
  var point = new THREE.Points(teapotGeometry, material);
  point.castShadow = true;
  return point;
}

var Solid = "Solid";
var Line = "Line";
var Point = "Point";

var scene = init(Solid);
scene.getObjectByName('solidTeapot').position.set(-2, 0, 0);

var scene1 = init(Line);
scene1.getObjectByName('lineTeapot').position.set(0, 0, 0);

var scene2 = init(Point);
scene2.getObjectByName('pointTeapot').position.set(2, 0, 0);

// Render the scenes
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function render() {
  renderer.render(scene, camera);
  renderer.render(scene1, camera);
  renderer.render(scene2, camera);
}

function animate() {
  requestAnimationFrame(animate);

  if (solidTeapot) {
    solidTeapot.rotation.z += 0.01;
    solidTeapot.rotation.y += 0.01;
  }

  if (lineTeapot) {
    lineTeapot.rotation.z -= 0.01;
    lineTeapot.rotation.y -= 0.01;
  }

  if (pointTeapot) {
    pointTeapot.rotation.z += 0.01;
    pointTeapot.rotation.y += 0.01;
  }

  controls.update();
  render();
}

animate();


