import React, { Component } from "react";
import './App.css'
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {FirstPersonControls} from "three/examples/jsm/controls/FirstPersonControls"
import sunTexture from './Assets/sunTexture.png';
import mercuryTexture from './Assets/mercuryTexture.jpg';
import venusTexture from './Assets/venusTexture.jpg';
import EarthTexture2 from './Assets/EarthTexture2.jpg'
import marsTexture from './Assets/marsTexture.png';
import jupiterTexture from './Assets/jupiterTexture.jpg';
import saturnTexture from './Assets/saturnTexture.jpg';
import plutoTexture from './Assets/plutoTexture.jpg';
import uranTexture from './Assets/uranTexture.png';
import neptuneTexture from './Assets/neptuneTexture.jpg';
import planets from "./data";

const style = {
// we can control scene size by setting container dimensions
  height: "100vh",
};

let createPlanet = function(radius,texture) {
  this.radius = radius;
  this.texture = texture;

  this.draw = () => {
    let planetGeometry = new THREE.SphereGeometry(this.radius,20,20);
    let planetTexture = new THREE.TextureLoader().load(this.texture);
    planetTexture.anisotropy = 8;
    let planetMaterialB = new THREE.MeshPhongMaterial({map: planetTexture});
 // const planetMaterial = new THREE.MeshNormalMaterial();
  
    let planet = new THREE.Mesh(planetGeometry,planetMaterialB);
    planet.castShadow = true;
    return planet;
  }
}



let createOrbit = function(radius,pointCount) {
  this.radius = radius;
  this.pointCount = pointCount;

  this.draw = (scene) => {
    let orbit_geom = new THREE.Geometry(); 
    let orbit_mat = new THREE.PointsMaterial({
      color: 0xbfbfbf,
      transparent: true,
      size: 1,
      opacity: 0.3,
      sizeAttenuation: false,
    });
    for (let i=0; i< this.pointCount; i++ ){
     const vertex = new THREE.Vector3();
     vertex.x = Math.sin(180/Math.PI*i)*this.radius;
     vertex.z = Math.cos(180/Math.PI*i)*this.radius;
     orbit_geom.vertices.push(vertex);
   }
   
   let orbit = new THREE.Points(orbit_geom,orbit_mat);
   orbit.castShadow = true;
   return scene.add(orbit);
  }
}

class App extends Component {

  state = {
    isStopPosition: false,
    isShowInfo: false,
    isShowSysInfo: false,
    planets: planets,
    currentInfo:"",
  }
 
  componentDidMount() {
    
    this.sceneSetup();
    this.addCustomSceneObjects();
    this.startAnimationLoop();
    window.addEventListener("resize", this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
    window.cancelAnimationFrame(this.requestID);
    // this.controls.dispose();   // +
  }

  sceneSetup = () => {

    const width = parseInt(this.el.clientWidth);
    const height = parseInt(this.el.clientHeight);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45, 
      width / height, // aspect ratio   
      1,      
      10000000
    );
    // this.camera.position.z = 20000;  
    this.camera.position.set(0,150000,150000);  
    this.camera.lookAt(0,0,30000);
    // this.controls = new FirstPersonControls(this.camera, this.el);  
    // this.controls.movementSpeed = 20000;
    // this.controls.lookSpeed = 0.05; // скорость вращения 
    this.renderer = new THREE.WebGLRenderer();
    // this.renderer.shadowMap.enabled = true; //включает карту теней
    // this.renderer.setClearColor(0xffffff);  // задний фон
    this.renderer.setSize(width, height);
    this.el.appendChild(this.renderer.domElement); 
    
  };

  
  addCustomSceneObjects = () => {

// система частиц 2 --->
const starsGeometry2 = new THREE.Geometry();
const starsMaterial2 = new THREE.PointsMaterial({
  color: 0xbbbbbb,
  transparent: true, 
  opacity: 0.6, 
  size:1, 
  sizeAttenuation: false
});
for (let i=0; i< 15000; i++ ){
   const vertex = new THREE.Vector3();
   vertex.x = Math.random()*2-1;
   vertex.y = Math.random()*2-1;
   vertex.z = Math.random()*2-1;
   vertex.multiplyScalar(6000);
   starsGeometry2.vertices.push(vertex);
}

this.stars2 = new THREE.Points(starsGeometry2,starsMaterial2);
this.stars2.scale.set(70,150,100)
this.scene.add(this.stars2);


// система частиц 1 --->
    const starsGeometry = new THREE.Geometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xbbbbbb,
      transparent: true, 
      opacity: 0.3, 
      size:1, 
      sizeAttenuation: false,
    });
    for (let i=0; i< 5500; i++ ){
       const vertex = new THREE.Vector3();
       vertex.x = Math.random()*2-1;
       vertex.y = Math.random()*2-1;
       vertex.z = Math.random()*2-1;
       vertex.multiplyScalar(6000);
       starsGeometry.vertices.push(vertex);
    }
 
    this.stars = new THREE.Points(starsGeometry,starsMaterial);
    this.stars.scale.set(100,100,100)
    this.scene.add(this.stars);


    // кольцо сатурна 1

    const ringGeom = new THREE.Geometry();
    const ringMat = new THREE.PointsMaterial({
      color: 0x3A3A3A,
      transparent: true, 
      opacity: 0.3,
      size: 1,
      sizeAttenuation: false,
    });
    for (let i=0; i< 20000; i++ ){
     const vertex = new THREE.Vector3();
     vertex.x = Math.sin(180/Math.PI*i)*(550-i/80);
     vertex.y = Math.random()*20;
     vertex.z = Math.cos(180/Math.PI*i)*(550-i/80);
     ringGeom.vertices.push(vertex);
   }
   
   this.saturnRing = new THREE.Points(ringGeom,ringMat);
   this.saturnRing.castShadow = true;
   this.scene.add(this.saturnRing);

    // кольцо сатурна 2

    const ringGeomSecond = new THREE.Geometry();
    const ringMatSecond = new THREE.PointsMaterial({
      color: 0x3A3A3A,
      transparent: true, 
      opacity: 0.3,
      size: 1,
      sizeAttenuation: false,
    });
    for (let i=0; i< 10000; i++ ){
     const vertex = new THREE.Vector3();
     vertex.x = Math.sin(180/Math.PI*i)*(550-i/120);
     vertex.y = Math.random()*20;
     vertex.z = Math.cos(180/Math.PI*i)*(550-i/120);
     ringGeomSecond.vertices.push(vertex);
   }
   
   this.saturnRingSecond = new THREE.Points(ringGeomSecond,ringMatSecond);
   this.saturnRingSecond.castShadow = true;
   this.scene.add(this.saturnRingSecond);

      // орбиты планет
      let earthOrbit = new createOrbit(30000,400);
      earthOrbit.draw(this.scene);
      let mercuryOrbit = new createOrbit(8000,500);
      mercuryOrbit.draw(this.scene);
      let venusOrbit = new createOrbit(17000,500);
      venusOrbit.draw(this.scene);
      let marsOrbit = new createOrbit(50000,500);
      marsOrbit.draw(this.scene);
      let jupiterOrbit = new createOrbit(-74000,500);
      jupiterOrbit.draw(this.scene);
      let saturnOrbit = new createOrbit(98000,500);
      saturnOrbit.draw(this.scene);
      let uranOrbit = new createOrbit(120000,500);
      uranOrbit.draw(this.scene);
      let neptuneOrbit = new createOrbit(180000,500);
      neptuneOrbit.draw(this.scene);
      let plutoOrbit = new createOrbit(200000,500);
      plutoOrbit.draw(this.scene);

    // light  --->
    this.point = new THREE.PointLight(0xffffff,1.7,210000);
    this.point.position.set(0,0,0);
    this.point.castShadow = true;
    this.point.shadow.mapSize.height = 2048;
    this.point.shadow.mapSize.height = 2048;
    this.scene.add(this.point);

    // Sun  --->
  this.sunGeometry = new THREE.SphereGeometry(2030,80,80);
  this.sunTexture = new THREE.TextureLoader().load(sunTexture);
  this.sunTexture.anisotropy = 8;
  this.sunMaterialB = new THREE.MeshPhongMaterial({emissiveMap: this.sunTexture, emissive:0xffffff});
  // this.sunMaterial = new THREE.MeshNormalMaterial();
   
  this.sun = new THREE.Mesh(this.sunGeometry,this.sunMaterialB);
  this.scene.add(this.sun);


  // Mercury --->
  this.mercury = new createPlanet(60,mercuryTexture).draw();
  this.scene.add(this.mercury);
      
  // Venus --->
  this.venus = new createPlanet(90,venusTexture).draw();
  this.scene.add(this.venus);

  // Mars --->
  this.mars = new createPlanet(80,marsTexture).draw();
  this.scene.add(this.mars);

  // Jupiter --->
  this.jupiter = new createPlanet(300,jupiterTexture).draw();
  this.scene.add(this.jupiter);

  // Saturn --->
  this.saturn = new createPlanet(230,saturnTexture).draw();
  this.scene.add(this.saturn);

  // Uran --->
  this.uran = new createPlanet(200,uranTexture).draw();
  this.scene.add(this.uran);

  // Neptune --->
 this.neptune = new createPlanet(200,neptuneTexture).draw();
 this.scene.add(this.neptune);

  // Pluto --->
 this.pluto = new createPlanet(200,plutoTexture).draw();
 this.scene.add(this.pluto);

  //Earth --->
  this.earth = new createPlanet(100,EarthTexture2).draw();
  this.scene.add(this.earth);

  this.t=0;
  this.y=0;

        

  // this.el.addEventListener('mousemove',(e) => { 
  //   this.y = parseInt(e.offsetY)
  // })

    // this.cameraHelper = new THREE.CameraHelper(this.light.shadow.camera);
    // this.scene.add(this.cameraHelper);

  };

  

  startAnimationLoop = () => {


    // this.controls.update(0.01); // +
    // rotation
    this.sun.rotation.y += 0.001;
    this.earth.rotation.y += 0.001;
    this.mercury.rotation.y += 0.001;
    this.venus.rotation.y += 0.001;
    this.mars.rotation.y += 0.001;
    this.jupiter.rotation.y += 0.001;
    this.saturn.rotation.y += 0.001;
    this.saturnRing.rotation.y -= 0.001;
    this.saturnRingSecond.rotation.y -= 0.001;
    this.uran.rotation.y += 0.001;
    this.neptune.rotation.y += 0.001;
    this.pluto.rotation.y += 0.001;

    // position

    if(!this.state.isStopPosition) {
      
      if(this.state.isShowSysInfo){

        if(this.camera.position.z < this.sun.position.z+150000){
          this.camera.position.z += 500;
          this.camera.lookAt(0,0,30000);
        } else {
          this.elText.style.display = "block";
        }
        if(this.camera.position.y < this.sun.position.y+150000) {
          this.camera.position.y += 500;
          this.camera.lookAt(0,0,30000);
        }
        this.sun.scale.set(2,2,2);
        this.saturn.scale.set(6,6,6);
        this.venus.scale.set(6,6,6);
        this.mercury.scale.set(6,6,6);
        this.mars.scale.set(6,6,6);
        this.jupiter.scale.set(6,6,6);
        this.uran.scale.set(6,6,6);
        this.neptune.scale.set(6,6,6);
        this.pluto.scale.set(6,6,6);
        this.earth.scale.set(6,6,6);
      }
    this.earth.position.x =Math.sin(this.t*0.1)*30000;
    this.earth.position.z =Math.cos(this.t*0.1)*30000;

    this.mercury.position.x =Math.sin(this.t*0.3)*8000;
    this.mercury.position.z =Math.cos(this.t*0.3)*8000;

    this.venus.position.x =Math.sin(this.t*0.2)*17000;
    this.venus.position.z =Math.cos(this.t*0.2)*17000;

    this.mars.position.x =Math.sin(this.t*0.08)*50000;
    this.mars.position.z =Math.cos(this.t*0.08)*50000;

    this.jupiter.position.x =Math.sin(this.t*0.07)*(74000);
    this.jupiter.position.z =Math.cos(this.t*0.07)*(74000);

    this.saturn.position.x =Math.sin(this.t*0.06)*98000;
    this.saturn.position.z =Math.cos(this.t*0.06)*98000;
    this.saturnRing.position.x= this.saturn.position.x;
    this.saturnRing.position.z= this.saturn.position.z;
    this.saturnRingSecond.position.x= this.saturn.position.x;
    this.saturnRingSecond.position.z= this.saturn.position.z;
  

    this.uran.position.x =Math.sin(this.t*0.05)*120000;
    this.uran.position.z =Math.cos(this.t*0.05)*120000;

    this.neptune.position.x =Math.sin(this.t*0.04)*180000;
    this.neptune.position.z =Math.cos(this.t*0.04)*180000;

    this.pluto.position.x =Math.sin(this.t*0.03)*200000;
    this.pluto.position.z =Math.cos(this.t*0.03)*200000;
    } else {
      if(this.state.isShowInfo){
        switch(this.state.currentInfo.name) {
        case 'Mercury' :
          
          this.sun.scale.set(1,1,1);
          this.saturn.scale.set(1,1,1);
          this.venus.scale.set(1,1,1);
          this.mercury.scale.set(1,1,1);
          this.mars.scale.set(1,1,1);
          this.jupiter.scale.set(1,1,1);
          this.uran.scale.set(1,1,1);
          this.neptune.scale.set(1,1,1);
          this.pluto.scale.set(1,1,1);
          this.earth.scale.set(1,1,1);
          
          if(this.camera.position.y > 0){
            this.camera.position.y -= 1000;
            this.camera.lookAt(this.mercury.position);
          }else if(this.camera.position.z > this.mercury.position.z-600){
              this.camera.position.z -= 150;
              this.camera.lookAt(this.mercury.position);
            } else {
              this.elText.style.display = "block";
            }
            if(this.camera.position.x < this.mercury.position.x-400) {
              this.camera.position.x += 200;
              this.camera.lookAt(this.mercury.position);} 
            break;

        case 'Venus' :
          
          this.sun.scale.set(1,1,1);
          this.saturn.scale.set(1,1,1);
          this.venus.scale.set(1,1,1);
          this.mercury.scale.set(1,1,1);
          this.mars.scale.set(1,1,1);
          this.jupiter.scale.set(1,1,1);
          this.uran.scale.set(1,1,1);
          this.neptune.scale.set(1,1,1);
          this.pluto.scale.set(1,1,1);
          this.earth.scale.set(1,1,1);
          
          if(this.camera.position.y > 0){
            this.camera.position.y -= 1000;
            this.camera.lookAt(this.venus.position);
          }else if(this.camera.position.z > this.venus.position.z-200){
              this.camera.position.z -= 200;
              this.camera.lookAt(this.venus.position);
            } else if(this.camera.position.z < this.venus.position.z-600){
              this.camera.position.z += 200;
              this.camera.lookAt(this.venus.position);
            } else {
              this.elText.style.display = "block";
            }
            if(this.camera.position.x < this.venus.position.x-675) {
              this.camera.position.x += 160;
              this.camera.lookAt(this.venus.position);
            } else if(this.camera.position.x > this.venus.position.x-500){
              this.camera.position.x -= 160;
              this.camera.lookAt(this.venus.position);
            }
            
            break;
        case 'Mars' :
          
          this.sun.scale.set(1,1,1);
          this.saturn.scale.set(1,1,1);
          this.venus.scale.set(1,1,1);
          this.mercury.scale.set(1,1,1);
          this.mars.scale.set(1,1,1);
          this.jupiter.scale.set(1,1,1);
          this.uran.scale.set(1,1,1);
          this.neptune.scale.set(1,1,1);
          this.pluto.scale.set(1,1,1);
          this.earth.scale.set(1,1,1);
          
          if(this.camera.position.y > 0){
            this.camera.position.y -= 1000;
            this.camera.lookAt(this.mars.position);
          }else if(this.camera.position.z > this.mars.position.z-200){
              this.camera.position.z -= 200;
              this.camera.lookAt(this.mars.position);
            } else if(this.camera.position.z < this.mars.position.z-600){
              this.camera.position.z += 200;
              this.camera.lookAt(this.mars.position);
            } else {
              this.elText.style.display = "block";
            }
            if(this.camera.position.x < this.mars.position.x-450) {
              this.camera.position.x += 80;
              this.camera.lookAt(this.mars.position);
            }  else if(this.camera.position.x > this.mars.position.x-350){
              this.camera.position.x -= 80;
              this.camera.lookAt(this.mars.position);
            }
            
            break;
        case 'Jupiter' :
          
          this.sun.scale.set(1,1,1);
          this.saturn.scale.set(1,1,1);
          this.venus.scale.set(1,1,1);
          this.mercury.scale.set(1,1,1);
          this.mars.scale.set(1,1,1);
          this.jupiter.scale.set(1,1,1);
          this.uran.scale.set(1,1,1);
          this.neptune.scale.set(1,1,1);
          this.pluto.scale.set(1,1,1);
          this.earth.scale.set(1,1,1);
          
          if(this.camera.position.y > 0){
            this.camera.position.y -= 1000;
            this.camera.lookAt(this.jupiter.position);
          }else if(this.camera.position.z < this.jupiter.position.z-1050){
              this.camera.position.z += 200;
              this.camera.lookAt(this.jupiter.position);
            } else if(this.camera.position.z > this.jupiter.position.z-800){
              this.camera.position.z -= 200;
              this.camera.lookAt(this.jupiter.position);
            } else {
              this.elText.style.display = "block";
            }
            if(this.camera.position.x < this.jupiter.position.x-1450) {
              this.camera.position.x += 200;
              this.camera.lookAt(this.jupiter.position);
            }  else if (this.camera.position.x > this.jupiter.position.x-1200){
              this.camera.position.x -= 200;
              this.camera.lookAt(this.jupiter.position);
            }
            
            break;
        case 'Saturn' :
          
          this.sun.scale.set(1,1,1);
          this.saturn.scale.set(1,1,1);
          this.venus.scale.set(1,1,1);
          this.mercury.scale.set(1,1,1);
          this.mars.scale.set(1,1,1);
          this.jupiter.scale.set(1,1,1);
          this.uran.scale.set(1,1,1);
          this.neptune.scale.set(1,1,1);
          this.pluto.scale.set(1,1,1);
          this.earth.scale.set(1,1,1);
          
          if(this.camera.position.y > 0){
            this.camera.position.y -= 1000;
            this.camera.lookAt(this.saturn.position);
          }else if(this.camera.position.z < this.saturn.position.z-450){
              this.camera.position.z += 150;
              this.camera.lookAt(this.saturn.position);
            } else if(this.camera.position.z > this.saturn.position.z-200){
              this.camera.position.z -= 150;
              this.camera.lookAt(this.saturn.position);
            } else {
              this.elText.style.display = "block";
            }
            if(this.camera.position.x < this.saturn.position.x-1200) {
              this.camera.position.x += 200;
              this.camera.lookAt(this.saturn.position);
            } else if (this.camera.position.x > this.saturn.position.x-900){
              this.camera.position.x -= 200;
              this.camera.lookAt(this.saturn.position);
            }
            
            break;
        case 'Uran' :
          
          this.sun.scale.set(1,1,1);
          this.saturn.scale.set(1,1,1);
          this.venus.scale.set(1,1,1);
          this.mercury.scale.set(1,1,1);
          this.mars.scale.set(1,1,1);
          this.jupiter.scale.set(1,1,1);
          this.uran.scale.set(1,1,1);
          this.neptune.scale.set(1,1,1);
          this.pluto.scale.set(1,1,1);
          this.earth.scale.set(1,1,1);
          
          if(this.camera.position.y > 0){
            this.camera.position.y -= 1000;
            this.camera.lookAt(this.uran.position);
          }else if(this.camera.position.z < this.uran.position.z-630){
              this.camera.position.z += 300;
              this.camera.lookAt(this.uran.position);
            } else if(this.camera.position.z > this.uran.position.z-300){
              this.camera.position.z -= 150;
              this.camera.lookAt(this.uran.position);
            } else {
              this.elText.style.display = "block";
            }
            if(this.camera.position.x < this.uran.position.x-950) {
              this.camera.position.x += 300;
              this.camera.lookAt(this.uran.position);
            } else if (this.camera.position.x > this.uran.position.x-600){
              this.camera.position.x -= 150;
              this.camera.lookAt(this.uran.position);
            }
            
            break;
        case 'Neptune' :
          
          this.sun.scale.set(1,1,1);
          this.saturn.scale.set(1,1,1);
          this.venus.scale.set(1,1,1);
          this.mercury.scale.set(1,1,1);
          this.mars.scale.set(1,1,1);
          this.jupiter.scale.set(1,1,1);
          this.uran.scale.set(1,1,1);
          this.neptune.scale.set(1,1,1);
          this.pluto.scale.set(1,1,1);
          this.earth.scale.set(1,1,1);
          
          if(this.camera.position.y > 0){
            this.camera.position.y -= 1000;
            this.camera.lookAt(this.neptune.position);
          }else if(this.camera.position.z < this.neptune.position.z-630){
              this.camera.position.z += 300;
              this.camera.lookAt(this.neptune.position);
            } else if(this.camera.position.z > this.neptune.position.z-300){
              this.camera.position.z -= 150;
              this.camera.lookAt(this.neptune.position);
            } else {
              this.elText.style.display = "block";
            }
            if(this.camera.position.x < this.neptune.position.x-950) {
              this.camera.position.x += 300;
              this.camera.lookAt(this.neptune.position);
            } else if (this.camera.position.x > this.neptune.position.x-600){
              this.camera.position.x -= 150;
              this.camera.lookAt(this.neptune.position);
            }
            
            break;
        case 'Pluto' :
          
          this.sun.scale.set(1,1,1);
          this.saturn.scale.set(1,1,1);
          this.venus.scale.set(1,1,1);
          this.mercury.scale.set(1,1,1);
          this.mars.scale.set(1,1,1);
          this.jupiter.scale.set(1,1,1);
          this.uran.scale.set(1,1,1);
          this.neptune.scale.set(1,1,1);
          this.pluto.scale.set(1,1,1);
          this.earth.scale.set(1,1,1);
          
          if(this.camera.position.y > 0){
            this.camera.position.y -= 1000;
            this.camera.lookAt(this.pluto.position);
          }else if(this.camera.position.z < this.pluto.position.z-900){
              this.camera.position.z += 300;
              this.camera.lookAt(this.pluto.position);
            } else if(this.camera.position.z > this.pluto.position.z-600){
              this.camera.position.z -= 150;
              this.camera.lookAt(this.pluto.position);
            } else {
              this.elText.style.display = "block";
            }
            if(this.camera.position.x < this.pluto.position.x-1200) {
              this.camera.position.x += 300;
              this.camera.lookAt(this.pluto.position);
            } else if (this.camera.position.x > this.pluto.position.x-900){
              this.camera.position.x -= 150;
              this.camera.lookAt(this.pluto.position);
            }
            
            break;
        case 'Earth' :
          
          this.sun.scale.set(1,1,1);
          this.saturn.scale.set(1,1,1);
          this.venus.scale.set(1,1,1);
          this.mercury.scale.set(1,1,1);
          this.mars.scale.set(1,1,1);
          this.jupiter.scale.set(1,1,1);
          this.uran.scale.set(1,1,1);
          this.neptune.scale.set(1,1,1);
          this.pluto.scale.set(1,1,1);
          this.earth.scale.set(1,1,1);
          
          if(this.camera.position.y > 0){
              this.camera.position.y -= 1000;
              this.camera.lookAt(this.earth.position);
            }else if(this.camera.position.z < this.earth.position.z-600){
              this.camera.position.z += 200;
              this.camera.lookAt(this.earth.position);
            } else if(this.camera.position.z > this.earth.position.z-400){
              this.camera.position.z -= 200;
              this.camera.lookAt(this.earth.position);
            } else {
              this.elText.style.display = "block";
            }
            if(this.camera.position.x < this.earth.position.x-250) {
              this.camera.position.x += 80;
              this.camera.lookAt(this.earth.position);
            } else if (this.camera.position.x > this.pluto.position.x-160){
              this.camera.position.x -= 80;
              this.camera.lookAt(this.pluto.position);
            }
            
            break;
        case 'Sun' :

          this.sun.scale.set(1,1,1);
          this.saturn.scale.set(1,1,1);
          this.venus.scale.set(1,1,1);
          this.mercury.scale.set(1,1,1);
          this.mars.scale.set(1,1,1);
          this.jupiter.scale.set(1,1,1);
          this.uran.scale.set(1,1,1);
          this.neptune.scale.set(1,1,1);
          this.pluto.scale.set(1,1,1);
          this.earth.scale.set(1,1,1);

            if(this.camera.position.y > 0){
              this.camera.position.y -= 1000;
              this.camera.lookAt(this.sun.position);
            } else if(this.camera.position.z > this.sun.position.z+6500){
              this.camera.position.z -= 500;
              this.camera.lookAt(this.sun.position);
              }else {
              this.elText.style.display = "block";
            }
            break;

            default:
              alert( "Error" );
          }
      }
    }

    this.t+= Math.PI/180*2*0.1;

    this.renderer.render(this.scene, this.camera);
    this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
  };

  handleWindowResize = () => {
    const width = this.el.clientWidth;
    const height = this.el.clientHeight;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;

    // Note that after making changes to most of camera properties you have to call
    // .updateProjectionMatrix for the changes to take effect.
    this.camera.updateProjectionMatrix();
  };
  
  showInfo = (planetName) => {
    this.camera.position.set(0,150000,150000);
    this.elText.style.display = "none";
      this.setState({
        isStopPosition: true,
        isShowInfo: true,
        isShowSysInfo: false,
        currentInfo: this.state.planets.find((planet)=> planet.name === planetName)
      }) 
    }
  showSystemInfo = (systemName) => {
    this.camera.position.set(0,0,50000);
    this.elText.style.display = "none";
      this.setState({
        isStopPosition: false,
        isShowInfo: false,
        isShowSysInfo: true,
        currentInfo: this.state.planets.find((sysData)=> sysData.name === systemName)
      }) 
    }
  

  render() {
    return (
    <div style={style} ref={ref => (this.el = ref)} >
      {this.state.planets.map((planet,index)=>(
        <input key={index} type="button" value={planet.name} className={`btn${planet.name}`} onClick={planet.type ==="planet" ? () =>{this.showInfo(`${planet.name}`)}:() =>{this.showSystemInfo(`${planet.name}`)}}></input>
      ))}
      <div id="planetDescription" ref={ref => (this.elText = ref)}>
        <h4>{this.state.currentInfo.name}</h4>
        <span>{this.state.currentInfo.description}</span>
      </div>
    </div>
    );
  }
}









export default class ContainerApp extends React.Component {
  state = { isMounted: true };

  render() {
    const { isMounted = true } = this.state;
    return (
      <>
        { <App />
        /* <button
          onClick={() =>
            this.setState(state => ({ isMounted: !state.isMounted }))
          }
        >
          {isMounted ? "Unmount" : "Mount"} */}
        {/* </button> */}
        {/*  {isMounted && <App />} */}
        {/* {isMounted && <div>Scroll to zoom, drag to rotate</div>} */}
      </>
    );
  }
}


