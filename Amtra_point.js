import { TeapotGeometry } from "./TeapotGeometry.js";
import * as THREE from "./three.module.js";
import {GUI} from "./lil-gui.module.min.js";
import {OrbitControls} from "./OrbitControls1.js"
function init() 
{
    var scene = new THREE.Scene();
    var gui = new GUI();

    var camera = new THREE.PerspectiveCamera(
        45,window.innerWidth/window.innerHeight,
        1,
        1000
    );

    camera.position.x = 1;
    camera.position.y = 2;
    camera.position.z = 5;

    camera.lookAt(new THREE.Vector3(0,0,0));

    var teapot = GetPointTeaPot(0.5, 8);

    var plane = getPlane(20);
    plane.rotation.x = Math.PI/2;
    plane.position.y = -2;

    var pointLight1 = getPointLight(1);
    pointLight1.position.y = 1.5;
    var sphere1 = getSphere(0.05);
    teapot.name = "teapot";

    scene.add(teapot);
    scene.add(pointLight1);
    scene.add(plane);
    pointLight1.add(sphere1);

    const pointLightFolder1 = gui.addFolder("pointLight1");
    const teapotFolder = gui.addFolder("teapot");
    pointLightFolder1.add(pointLight1, 'intensity', 0, 10);
    pointLightFolder1.add(pointLight1.position, 'x', 0, 5);
    pointLightFolder1.add(pointLight1.position, 'y', 0, 5);
    pointLightFolder1.add(pointLight1.position, 'z', 0, 5);

    teapotFolder.add(teapot.scale, 'x', 0, 2);
    teapotFolder.add(teapot.scale, 'y', 0, 2);
    teapotFolder.add(teapot.scale, 'z', 0, 2);

    var renderer = new THREE.WebGLRenderer();

    renderer.shadowMap.enabled = true;

    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.setClearColor('rgb(120, 120, 120)');

    document.getElementById('webgl').appendChild(renderer.domElement);

    var controls = new OrbitControls(camera, renderer.domElement);

    update(renderer, scene, camera, controls);
    return scene;
}

function getPlane(size)
{
    var geometry = new THREE.PlaneGeometry(size, size);
    var material = new THREE.MeshPhongMaterial({
        color: 'rgb(120,120,120)',
        side: THREE.DoubleSide
    })
    var mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    return mesh
}

function getSphere(size)
{
    var geometry = new THREE.SphereGeometry(size, 24, 24);
    // Tạo vật liệu cho hình cầu
    var material = new THREE.MeshBasicMaterial({
        color: 'rgb(255, 255, 255)'
    })
    var mesh = new THREE.Mesh(geometry,material);
    return mesh;
}

function getPointLight(intensity){
    var light = new THREE.PointLight(0xffffff, intensity);
    light.castShadow = true;
    return light;
}

function update(renderer, scene, camera, controls)
{
    renderer.render(scene,camera);

    var teapot = scene.getObjectByName('teapot');
    teapot.rotation.z += 0.01;
    teapot.rotation.y += 0.01;

    controls.update();
    requestAnimationFrame(function(){
        update(renderer, scene, camera, controls);
    })
}

function GetSolidTeaPot(size, tess){
    var teapotGeometry = new TeapotGeometry(size, tess);
    var textureLoader = new THREE.TextureLoader();
    var image = textureLoader.load('diffuse.jpg');
    var teapotMaterial = new THREE.MeshPhongMaterial({
        color: 'rgb(120, 120, 120)',
        map: image
    });
    var teapotMesh = new THREE.Mesh(teapotGeometry, teapotMaterial);
    teapotMesh.position.x = 0;
    teapotMesh.castShadow = true;
    return teapotMesh;
}

function GetLineTeaPot(size, tess){
    var teapotGeometry = new TeapotGeometry(size, tess);
    var wireframe = new THREE.WireframeGeometry( teapotGeometry );
    var line = new THREE.LineSegments( wireframe );
    line.material.depthTest = false;
    line.material.opacity = 0.25;
    line.material.transparent = true;
    line.material.color = 'rgb(120,120,120)';
    line.castShadow = true;

    return line;
}

function GetPointTeaPot(size, tess){
    var teapotGeometry = new TeapotGeometry(size, tess);
    var material = new THREE.PointsMaterial( { color: 0x888888, size: 0.1} );
    var point = new THREE.Points(teapotGeometry, material );
    point.castShadow = true;
    return point;
}

var scene = init();