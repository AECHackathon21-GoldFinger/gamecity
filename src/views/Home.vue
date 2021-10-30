<template>
  <!-- Three info stuff. -->
  <div id="info" class="select-none text-indigo-500 text-center pt-3">
    <strong>Ctrl + Click</strong>: Add Voxel <strong>Shift + Click</strong>:
    Remove Voxel
  </div>

  <div class="relative">
    <div id="scene"></div>
  </div>
</template>

<style>
body {
  background-color: 0xf9fafb;
  color: #444;
}
a {
  color: #08f;
}
#scene {
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.relative {
  position: relative;
}
</style>

<script type="module">
import * as THREE from "../../three.module.js";
import { BoxGeometry, MeshBasicMaterial, Mesh } from "../../three.module.js";
import { HemisphereLight } from "../../three.module.js";

import { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls.js";

let camera, controls, scene, renderer;
let plane;
let pointer,
  raycaster,
  isCtrlDown,
  isShiftDown = false;

let rollOverMesh, rollOverMaterial;
let cubeGeo, cubeMaterial;
let container;

const color = 0xf9fafb;

const objects = [];

init();
render();

function init() {
  container = document.getElementById("#scene");

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    20000
  );
  camera.position.set(750, 750, 1000);
  camera.lookAt(0, 0, 0);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(color);

  // roll-over helpers

  const rollOverGeo = new THREE.BoxGeometry(50, 50, 50);
  rollOverMaterial = new THREE.MeshBasicMaterial({
    color: 0x60a5fa,
    opacity: 0.3,
    transparent: true,
  });
  rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
  scene.add(rollOverMesh);

  // cubes

  cubeGeo = new THREE.BoxGeometry(50, 50, 50);
  const cubeMaterial = new MeshBasicMaterial({ color: 0x4b5563 });

  // grid

  const gridHelper = new THREE.GridHelper(1000, 20);
  gridHelper.material = new THREE.MeshBasicMaterial({
    color: 0x9ca3af,
    opacity: 0.3,
    transparent: true,
  });
  scene.add(gridHelper);

  //

  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();

  const geometry = new THREE.PlaneGeometry(1000, 1000);
  geometry.rotateX(-Math.PI / 2);

  plane = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ visible: false })
  );
  scene.add(plane);

  objects.push(plane);

  // Lights

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
  directionalLight.position.set(1000, 750, 500);

  const hemiLight = new HemisphereLight(0xffffff, 0x71748f, 0.2);
  scene.add(hemiLight);

  const r = 2000;

  //directional Light
  directionalLight.name = "Light";
  directionalLight.shadow.radius = 1;
  directionalLight.shadow.camera.near = 0.5 * r;
  directionalLight.shadow.camera.far = 3 * r;
  directionalLight.shadow.camera.right = r;
  directionalLight.shadow.camera.left = -r;
  directionalLight.shadow.camera.top = r;
  directionalLight.shadow.camera.bottom = -r;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;

  //to fix shadow acne
  directionalLight.shadow.bias = -0.002;
  directionalLight.shadow.normalBias = 0.05;
  directionalLight.castShadow = true;

  scene.add(directionalLight);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight - 150);
  document.body.appendChild(renderer.domElement);

  document.addEventListener("pointermove", onPointerMove);
  document.addEventListener("pointerdown", onPointerDown);
  document.addEventListener("keydown", onDocumentKeyDown);
  document.addEventListener("keyup", onDocumentKeyUp);

  //

  window.addEventListener("resize", onWindowResize);

  // controls

  controls = new OrbitControls(camera, renderer.domElement);
  controls.listenToKeyEvents(window); // optional

  //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.07;

  controls.screenSpacePanning = false;

  controls.minDistance = 100;
  controls.maxDistance = 3000;

  controls.maxPolarAngle = Math.PI / 2;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight - 150;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight - 150);

  render();
}

function onPointerMove(event) {
  pointer.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(objects, false);

  if (intersects.length > 0) {
    const intersect = intersects[0];

    rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
    rollOverMesh.position
      .divideScalar(50)
      .floor()
      .multiplyScalar(50)
      .addScalar(25);
  }

  render();
}

function onPointerDown(event) {
  pointer.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  if (!isCtrlDown) raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(objects, false);

  if (intersects.length > 0) {
    const intersect = intersects[0];

    // delete cube

    if (isShiftDown) {
      if (intersect.object !== plane) {
        scene.remove(intersect.object);

        objects.splice(objects.indexOf(intersect.object), 1);
      }

      // create cube
    } else if (isCtrlDown) {
      let cubeMat = new THREE.MeshLambertMaterial({ color: 0x4b5563 });
      const voxel = new THREE.Mesh(cubeGeo, cubeMat);
      voxel.position.copy(intersect.point).add(intersect.face.normal);
      voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
      scene.add(voxel);

      objects.push(voxel);
    }

    render();
  }
}

function onDocumentKeyDown(event) {
  switch (event.keyCode) {
    case 16:
      isShiftDown = true;
      break;

    case 17:
      isCtrlDown = true;
      break;
  }
}

function onDocumentKeyUp(event) {
  switch (event.keyCode) {
    case 16:
      isShiftDown = false;
      break;

    case 17:
      isCtrlDown = false;
      break;
  }
}

function render() {
  controls.update();
  renderer.render(scene, camera);
}
</script>
