//js/three.min.js
//js/OrbitControls.js

class Main {
	constructor(){
		console.log("Constructing game instance..");
		
		//create camera, scene, renderer, and controls
		var camera, scene, renderer, controls;
		
		this.camera = new THREE.PerspectiveCamera( 70, window.innderWidth / window.innerHeight, 0.01, 10 );
		this.camera.position.z = 1;
		this.scene = new THREE.Scene();
		
		this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( this.renderer.domElement );
		
		this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
		
		
		//update render on window resize
		window.addEventListener('resize', function() {
			this.width = window.innerWidth;
			this.height = window.innerHeight;
			this.renderer.setSize(this.width, this.height);
			this.camera.aspect = this.width/this.height;
			this.camera.updateProjectionMatrix();
		} );
		
		// add additional listeners (mouse down & scroll are used by OrbitControls)
	//	document.addEventListener('dblclick', this.dblClick, false);
	//	document.addEventListener('mousedown' this.mouseDown, false);
	
		console.log("Game instance constructed");
		this.animate();
	}
	/*
	mouseDown(event) {
		event.preventDefault();
		alert("Mouse Down");
	}
	
	dblClick(event) {
		event.preventDefault();
		alert("Double Clicked");
	}*/
	function animate() {
		requestAnimationFrame( animate );
		this.renderer.render( this.scene, this.camera);
	}
	
}

var instance = new Main();