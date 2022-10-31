var map = [], helper = false;
var controls;
var ballSpeed = 0;
var ballAceleration = 0;
var paused = false;
var bkeyDown = false;
var skeyDown = false;
var rkeyDown = false;
var lkeyDown = false;
var clock = new THREE.Clock(true);
/*************************************************
*		          UPDATE/DISPLAY CICLE               *
*************************************************/
var scene, renderer;

function createScene() {
  'use strict';
  scene = new THREE.Scene();
  scene.add(new THREE.AxesHelper(30));
}

function render() {
  'use strict';
  renderer.render(scene, cameras.mainCamera);
}

function animate() {
  'use strict';
  //controls.update();
  chessboard.zaWarudo();
  render();
  requestAnimationFrame(animate);
}


/*************************************************
*				        RESIZE FUNCTION                  *
*************************************************/
resizeWindow = function(){
		console.log(cameras.mainCamera);
		'use strict';
		renderer.setSize(window.innerWidth, window.innerHeight);
		if(cameras.currentCamera == 1){
			if(window.innerHeight > 0 && window.innerWidth > 0)
				cameras.mainCamera.aspect = window.innerWidth / window.innerHeight;
			cameras.mainCamera.updateProjectionMatrix();
		} else {
			if(window.innerHeight > 0 && window.innerWidth > 0) {
				let newAspect = window.innerWidth / window.innerHeight;
				let changeAspect = cameras.aspectRatio / newAspect;
				let newSize = cameras.viewSizeOrt * changeAspect;
				cameras.mainCamera.left = -newAspect * newSize / 2;
				cameras.mainCamera.right = newAspect * newSize  / 2;
				cameras.mainCamera.top = newSize / 2;
				cameras.mainCamera.bottom = -newSize / 2;
				cameras.mainCamera.updateProjectionMatrix();
			}
		}
};


/*************************************************
*					           Chess            *
*************************************************/
var chessboard = new function() {

	this.chessObject = new THREE.Object3D();
	this.ballObject = new THREE.Object3D();
	this.diceObject = new THREE.Object3D();
  this.pauseRectangleObject = new THREE.Object3D();

	this.Basic = false;
	this.textureloader = new THREE.TextureLoader();
	this.chessTexture = this.textureloader.load("js/vaporwaveboard2.jpg");
	this.ballTexture = this.textureloader.load("js/MonaLisaVaporwave.jpg");
	this.boardTexture = this.textureloader.load("js/wood.jpg");
	this.boardBumpMap = this.textureloader.load("js/woodBumpMap.jpg");
	this.diceMap = [this.textureloader.load("js/Dice1Vaporwave.png"),
						this.textureloader.load("js/Dice2Vaporwave.png"),
						this.textureloader.load("js/Dice3Vaporwave.png"),
						this.textureloader.load("js/Dice4Vaporwave.png"),
						this.textureloader.load("js/Dice5Vaporwave.png"),
						this.textureloader.load("js/Dice6Vaporwave.png")];

  this.pauseTexture = this.textureloader.load("js/PauseVaporwave.png");

	this.dice = {
		geometry: new THREE.BoxGeometry(4, 4, 4, 5, 5, 5),
		material: [new THREE.MeshPhongMaterial({color: 0xffffff, wireframe: false, map: this.diceMap[0], bumpMap: this.diceMap[0], bumpScale: 0.1}),
				   new THREE.MeshPhongMaterial({color: 0xffffff, wireframe: false, map: this.diceMap[1], bumpMap: this.diceMap[1], bumpScale: 0.1}),
				   new THREE.MeshPhongMaterial({color: 0xffffff, wireframe: false, map: this.diceMap[2], bumpMap: this.diceMap[2], bumpScale: 0.1}),
				   new THREE.MeshPhongMaterial({color: 0xffffff, wireframe: false, map: this.diceMap[3], bumpMap: this.diceMap[3], bumpScale: 0.1}),
				   new THREE.MeshPhongMaterial({color: 0xffffff, wireframe: false, map: this.diceMap[4], bumpMap: this.diceMap[4], bumpScale: 0.1}),
				   new THREE.MeshPhongMaterial({color: 0xffffff, wireframe: false, map: this.diceMap[5], bumpMap: this.diceMap[5], bumpScale: 0.1})],
		basicMaterial: [new THREE.MeshBasicMaterial({color:0xffffff, wireframe: false, map: this.diceMap[0], bumpMap: this.diceMap[0], bumpScale: 0.1}),
				   new THREE.MeshBasicMaterial({color:0xffffff, wireframe: false, map: this.diceMap[1], bumpMap: this.diceMap[1], bumpScale: 0.1}),
				   new THREE.MeshBasicMaterial({color:0xffffff, wireframe: false, map: this.diceMap[2], bumpMap: this.diceMap[2], bumpScale: 0.1}),
				   new THREE.MeshBasicMaterial({color:0xffffff, wireframe: false, map: this.diceMap[3], bumpMap: this.diceMap[3], bumpScale: 0.1}),
				   new THREE.MeshBasicMaterial({color:0xffffff, wireframe: false, map: this.diceMap[4], bumpMap: this.diceMap[4], bumpScale: 0.1}),
				   new THREE.MeshBasicMaterial({color:0xffffff, wireframe: false, map: this.diceMap[5], bumpMap: this.diceMap[5], bumpScale: 0.1})],
		position: {x:0, y: 3.5, z: 0}
	}

	this.chess = {
		geometry: new THREE.PlaneGeometry(60,60,64),
		material: new THREE.MeshPhongMaterial({color: 0xFFFFFF, wireframe: false, side: THREE.DoubleSide, map: this.chessTexture, bumpMap: this.boardBumpMap, bumpScale: 0.05}),
		basicMaterial: new THREE.MeshBasicMaterial({color: 0xFFFFFF, wireframe: false, side: THREE.DoubleSide, map: this.chessTexture, bumpMap: this.boardBumpMap, bumpScale: 0.05}),
		position: { x: 0, y: 0, z: 0 }
	}

	this.board = {
		geometry: new THREE.BoxGeometry(60,2,60,64,64,64),
		material: new THREE.MeshPhongMaterial({color: 0xAB6A00, wireframe: false, side: THREE.DoubleSide, map: this.boardTexture, bumpMap: this.boardBumpMap, bumpScale: 0.1}),
		basicMaterial : new THREE.MeshBasicMaterial({color: 0xAB6A00, wireframe: false, side: THREE.DoubleSide, map: this.boardTexture, bumpMap: this.boardBumpMap, bumpScale: 0.1}),
		position: {x: 0, y:-1.05, z: 0}
	}

	this.ball = {
		geometry : new THREE.SphereGeometry(4,32,32),
		material: new THREE.MeshPhongMaterial({color: 0xFFFFFF, specular: 0xFFFFFF, wireframe:false, side: THREE.DoubleSide, map: this.ballTexture}),
		basicMaterial : new THREE.MeshBasicMaterial({color: 0xFFFFFF, wireframe:false, side: THREE.DoubleSide, map: this.ballTexture}),
		position: {x: 15, y: 4, z: 0}
	}

  this.pauseBackground = {
    geometry: new THREE.BoxGeometry(60, 2, 60, 64, 64, 64),
    material: new THREE.MeshBasicMaterial({color: 0xFFFFFF, wireframe:false, side: THREE.DoubleSide, map: this.pauseTexture}),
    position: {x: 150, y: 0, z: 0}
  }

	this.diceMesh = new THREE.Mesh(this.dice.geometry, this.dice.material);
	this.diceMesh.rotateOnWorldAxis(new THREE.Vector3(0,0,1),Math.PI/4);
	this.diceMesh.rotateOnWorldAxis(new THREE.Vector3(1,0,0),0.615479708670387341067464589123993687855170004677547419527);

	this.chessMesh = new THREE.Mesh(this.chess.geometry, this.chess.material);
	this.chessMesh.rotation.set(-Math.PI/2, Math.PI/2000, Math.PI);

	this.boardMesh = new THREE.Mesh(this.board.geometry, this.board.material);

	this.ballMesh = new THREE.Mesh(this.ball.geometry, this.ball.material);
	this.ballMesh.material.shininess = 1000;

  this.pauseMesh = new THREE.Mesh(this.pauseBackground.geometry, this.pauseBackground.material);

	this.setup = function(){
		this.ballMesh.position.set(this.ball.position.x, this.ball.position.y, this.ball.position.z);
		this.diceMesh.position.set(this.dice.position.x, this.dice.position.y, this.dice.position.z);
		this.chessMesh.position.set(this.chess.position.x, this.chess.position.y, this.chess.position.z);
		this.boardMesh.position.set(this.board.position.x, this.board.position.y, this.board.position.z);
		this.ballObject.add(this.ballMesh);
		this.chessObject.add(this.chessMesh);
		this.chessObject.add(this.boardMesh);
		this.diceObject.add(this.diceMesh);
		this.dice.geometry.computeFaceNormals();
		this.chess.geometry.computeFaceNormals();
    this.pauseMesh.position.set(this.pauseBackground.position.x, this.pauseBackground.position.y, this.pauseBackground.position.z);
    this.pauseRectangleObject.add(this.pauseMesh);
		scene.add(this.ballObject);
		scene.add(this.chessObject);
		scene.add(this.diceObject);
    scene.add(this.pauseRectangleObject);
	}
	this.reset = function(){
		ballAceleration = 0;
    	ballSpeed = 0;
		  this.diceObject.rotation.set(0,0,0);
    	this.ballMesh.rotation.set(0,0,0);
    	this.ballObject.rotation.set(0,0,0);
    	this.ballMesh.position.set(15,4,0);
    	if(this.Basic){
    		this.turnOnLight();
    		this.Basic = false;
    	}

		for(let i = 0; i < this.diceMesh.material.length; i++){
			this.dice.material[i].wireframe = false;
			this.dice.basicMaterial[i].wireframe = false;
		}
		this.chess.material.wireframe = false;
		this.chess.basicMaterial.wireframe = false;
		this.board.material.wireframe = false;
		this.board.basicMaterial.wireframe = false;
		this.ball.material.wireframe = false;
		this.ball.basicMaterial.wireframe = false;

	}

	this.turnOffLight = function(){
		for(let i = 0; i < this.dice.basicMaterial.length; i++)
			this.dice.basicMaterial[i].wireframe = this.diceMesh.material[0].wireframe;
		this.diceMesh.material = this.dice.basicMaterial;

		this.board.basicMaterial.wireframe = this.boardMesh.material.wireframe;
		this.boardMesh.material = this.board.basicMaterial;

		this.chess.basicMaterial.wireframe = this.chessMesh.material.wireframe;
		this.chessMesh.material = this.chess.basicMaterial;

		this.ball.basicMaterial.wireframe = this.ballMesh.material.wireframe;
		this.ballMesh.material = this.ball.basicMaterial;
	}

	this.turnOnLight = function(){
		for(let i = 0; i < this.dice.basicMaterial.length; i++)
			this.dice.material[i].wireframe = this.diceMesh.material[i].wireframe;
		this.diceMesh.material = this.dice.material;

		this.board.material.wireframe = this.boardMesh.material.wireframe;
		this.boardMesh.material = this.board.material;

		this.chess.material.wireframe = this.chessMesh.material.wireframe;
		this.chessMesh.material = this.chess.material;

		this.ball.material.wireframe = this.ballMesh.material.wireframe;
		this.ballMesh.material = this.ball.material;
	}

	this.enableAbleWireframe = function() {
		for(let i = 0; i < this.diceMesh.material.length; i++){
			this.diceMesh.material[i].wireframe = !this.diceMesh.material[i].wireframe;
		}
		this.chessMesh.material.wireframe = !this.chessMesh.material.wireframe;

		this.boardMesh.material.wireframe = !this.boardMesh.material.wireframe;

		this.ballMesh.material.wireframe = !this.ballMesh.material.wireframe;

	}

  this.zaWarudo = function(){
    var deltaTime = clock.getDelta();
    if(paused){
    	deltaTime = 0;
    }
    this.diceObject.rotateY(+1*deltaTime);
    this.ballObject.rotateY(+ballSpeed*deltaTime);
    this.ballMesh.rotateY(+ballSpeed*deltaTime);

    if(!paused){
    	ballSpeed+=ballAceleration;
    }
    if(ballSpeed > 10 || ballSpeed < 0){
    	ballAceleration = 0;
    }
    if(ballSpeed < 0){
    		ballSpeed = 0;
    }
  }
}

/*************************************************
*				            lIGHTING             *
*************************************************/
var lighting = new function(){
  this.turnOffDirectionalLight = 0;
  this.turnOffPointLight = 0;

  this.directionalLight = new THREE.DirectionalLight(0xFFB23C, 1);
  this.pointLight = new THREE.PointLight(0xB53CFF, 1, 100);

  this.setup = function(){
    this.directionalLight.position.set(0,10,20);
   	this.directionalLight.target = chessboard.diceMesh;
   	this.directionalLight.castShadow = true;
    this.pointLight.position.set(0,30,0);

    scene.add(this.directionalLight);
    scene.add(this.pointLight);
  }

  this.reset = function(){
  	this.turnOffDirectionalLight = 0;
  	this.turnOffPointLight = 0;
  	this.directionalLight.intensity = 0.8;
  	this.pointLight.intensity = 1;
  }

}


/*************************************************
*			        ONKEYDOWN/ONKEYUP                  *
*************************************************/
onkeydown = onkeyup = function(e) {
  'use strict';
  e = e || event;
  map[e.keyCode] = e.type == 'keydown';
  switch (e.keyCode) {
  	case 66: //b, B Key
      if(!paused){
    		if(e.type == 'keydown' && !bkeyDown){
    			if(ballSpeed != 0){
    				ballAceleration = -0.1;
    			}
    			else if(ballSpeed == 0){
    				ballAceleration = 0.1;
    			}
    			bkeyDown = true;
    		}

    		if(e.type == 'keyup' && bkeyDown){
    			bkeyDown = false;
    		}
      }
  	break;

    case 68:  //d, D Key
      if(!paused){
        if(lighting.turnOffDirectionalLight){//Lighting was turned off, we want to turn on
          lighting.directionalLight.intensity = 0.8;
          lighting.turnOffDirectionalLight = 0;
        }
        else{//Lighting was turned on, we want to turn off
        	lighting.directionalLight.intensity = 0;
          lighting.turnOffDirectionalLight = 1;
        }
      }
      break;

    case 76:
      if(!paused){
      	if(e.type == 'keydown' && !lkeyDown){
      		(chessboard.Basic)?chessboard.turnOnLight() : chessboard.turnOffLight();
    			chessboard.Basic = !chessboard.Basic;
    			lkeyDown = true;
    		}

    		if(e.type == 'keyup' && lkeyDown){
    			lkeyDown = false;
    		}
      }
  	break;

    case 80:  //p, P Key
      if(!paused){
        if(lighting.turnOffPointLight){//Lighting was turned off, we want to turn on
          lighting.pointLight.intensity = 1;
          lighting.turnOffPointLight = 0;
        }
        else{//Lighting was turned on, we want to turn off
        	lighting.pointLight.intensity = 0;
          lighting.turnOffPointLight = 1;
        }
      }
      break;

    case 82: //r,R key
    	if(e.type == 'keydown' && !rkeyDown && paused){
    		rkeyDown = true;
    		chessboard.reset();
    		lighting.reset();
   		}
   		if(e.type == 'keyup' && rkeyDown){
   			rkeyDown = false;
   		}
    	break;

   	case 83: //s,S Key
   		if(e.type == 'keydown' && !skeyDown){
   			paused = !paused;
        cameras.changeCamera();
   			skeyDown = true;
   		}
   		if(e.type == 'keyup' && skeyDown){
   			skeyDown = false;
   		}
   		break;

    case 87: //w,W Key
		chessboard.enableAbleWireframe();
		break;
	}
}


/*************************************************
*					          CAMERAS                      *
*************************************************/
var cameras = new function() {

	this.mainCamera = null;

	this.sceneHeight = 720*(1/8);

	this.sceneWidth = 1380*(1/8);

	this.viewSizeOrt = 18;

	this.aspectRatio = window.innerWidth / window.innerHeight;

	this.currentCameras = {
		camera1: new THREE.PerspectiveCamera(45, this.sceneWidth/this.sceneHeight, 1, 1000),
    camera2: new THREE.PerspectiveCamera(45, this.sceneWidth/this.sceneHeight, 1, 1000)
	};

	this.setup = function(){
		this.currentCameras.camera1.position.set(0,20,80);
		this.currentCameras.camera1.lookAt(scene.position);
    this.currentCameras.camera2.position.set(150,80,0);
		this.currentCameras.camera2.lookAt(new THREE.Vector3(150, 10, 0));
		this.mainCamera = this.currentCameras.camera1;

	};

  this.changeCamera = function(){
    if(paused){
      this.mainCamera = this.currentCameras.camera2;
    }

    else{
      this.mainCamera = this.currentCameras.camera1;
    }
  }
}

/*************************************************
*				              INIT                       *
*************************************************/
function init() {
  'use strict';
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  createScene();
  chessboard.setup();
  cameras.setup();
  lighting.setup();
  render();
  window.addEventListener("keydown", onkeydown);
  window.addEventListener("resize", resizeWindow);
}
