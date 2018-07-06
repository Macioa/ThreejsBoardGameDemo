//js/three.min.js
//js/OrbitControls.js

var loadedMeshes=[];

var blacktiletexture, whitetiletexture, bordertexture;

var blacktiletexture = 'black', whitetiletexture = 'white', bordertexture = 'border';

var blacktilematerial, whitetilematerial, bordermaterial;


class RenderInstance {
	constructor(){
		this.intersected = null;
		this.intersects = null;
		this.selectableObjects=[];
		this.mouse = mouse;
		this.raycaster = new THREE.Raycaster();
		this.init();
		animate(this);
	}
	init() {
		let me = this;
		this.camera = camera
		
		this.camera.position.z = 2;
		this.camera.position.y = -2;
		
	 
		this.scene = new THREE.Scene();
	 
		this.renderer = renderer;
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		document.getElementById('renderArea').appendChild( this.renderer.domElement );
	
		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		window.addEventListener('resize',me.resizeRender);	
		//this.controls = new THREE.OrbitControls( camera, renderer.domElement );
	
		this.spotlightA = new THREE.SpotLight( 0xffffff );
		this.spotlightA.position.set( 0, -10, 10 );
		this.scene.add( this.spotlightA );
		
		this.spotlightB = new THREE.SpotLight( 0xffffff );
		this.spotlightB.position.set( 0, 10, 10 );
		this.scene.add( this.spotlightB );


		animate(this);
	}
	
	rayCast(screenPoint, filteredObjects){
		
		//standard raycaster
		this.raycaster.setFromCamera( screenPoint, this.camera )
		//run raycaster - only subset of filteredObjects is returned.
		this.intersects = this.raycaster.intersectObjects( filteredObjects );
		//console.log(this.intersects)
	
		if (this.intersects.length) {
			if ( this.intersected != this.intersects[ 0 ].object ) {
				if ( this.intersected ) 
					this.intersected.material.emissive.setHex( this.intersected.currentHex );
				this.intersected = this.intersects[ 0 ].object;
				if (this.intersected.material.emissive){
					this.intersected.currentHex = this.intersected.material.emissive.getHex();
					this.intersected.material.emissive.setHex( 0x287a30 );
					this.intersected.material.emissiveIntensity=0.9;
				}
			}
		} else {
			if ( this.intersected ) {
				this.intersected.material.emissive.setHex( this.intersected.currentHex );
				this.intersected.material.emissiveIntensity=1;
			}
			this.intersected = null;
		}
		return this.intersected;
	}
	resizeRender(){
		let width = window.innerWidth;
		let height = window.innerHeight;
		renderer.setSize(width, height);
		camera.aspect = width/height;
		camera.updateProjectionMatrix();
	}
}
const printTest = () => {
	console.log('print test');
}

const animate = (rInstance) => { 
	window.requestAnimationFrame(function(){animate(rInstance)});
	//console.log(rInstance)
	//console.log(rInstance.mouse)
	rInstance.rayCast(rInstance.mouse, rInstance.selectableObjects);
	rInstance.renderer.render( rInstance.scene, rInstance.camera );
}

var mouse = new THREE.Vector2();
var renderer = new THREE.WebGLRenderer( { antialias: true } );
var camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );

const onDocumentMouseMove = (event) => {
	event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

	
	whitetiletexture = new THREE.TextureLoader().load( "texture/awhite.png" );
	blacktiletexture = new THREE.TextureLoader().load( "texture/ablack.png" );
	bordertexture = new THREE.TextureLoader().load( "texture/aborder.png" );

	whitetilematerial = new THREE.MeshStandardMaterial( { map: whitetiletexture } );
	blacktilematerial = new THREE.MeshStandardMaterial( { map: blacktiletexture } );
	bordermaterial = new THREE.MeshLambertMaterial( { map: bordertexture, bumpMap: bordertexture } );
 
