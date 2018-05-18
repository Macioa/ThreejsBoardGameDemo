//js/three.min.js
//js/OrbitControls.js

var camera, scene, renderer;
var geometry, material, mesh;
var controls;
var texture, blacktiletexture, whitetiletexture, bordertexture;
//var blacktilecolor = 0x663300, whitetilecolor = 0xffffff, bordercolor = 0x003300;
var blacktilecolor = 'black', whitetilecolor = 'white', bordercolor = 'border';
init();
animate();

window.addEventListener('resize', function() {
	var width = window.innerWidth;
	var height = window.innerHeight;
	renderer.setSize(width, height);
	camera.aspect = width/height;
	camera.updateProjectionMatrix();
	} );

 
function init() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
    camera.position.z = 5;
 
    scene = new THREE.Scene();
	
	whitetiletexture = new THREE.TextureLoader().load( "texture/awhite.jpg" );
	blacktiletexture = new THREE.TextureLoader().load( "texture/ablack.jpg" );
	bordertexture = new THREE.TextureLoader().load( "texture/bborder.jpg" );
	/*whitetiletexture = new THREE.CubeTextureLoader()
			.setPath( 'texture/' )
			.load( [
				'awhite.jpg',//px
				'awhite.jpg',//nx
				'awhite.jpg',//py
				'awhite.jpg',//ny
				'awhite.jpg',//pz
				'awhite.jpg' //nz
			] );*/
 
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
	document.addEventListener('dblclick', onMouseDown, false);

	controls = new THREE.OrbitControls( camera, renderer.domElement );
	//var light = new THREE.HemisphereLight( 1 );


	var spotlightA = new THREE.SpotLight( 0xffffff );
	spotlightA.position.set( 10, 0, 10 );
	scene.add( spotlightA );
	
	var spotlightB = new THREE.SpotLight( 0xffffff );
	spotlightB.position.set( 0, 10, 10 );
	scene.add( spotlightB );
	
	this.animate();
}
 
function animate() { 
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
	console.log("animating");
}

function onMouseDown(event) {
	event.preventDefault();
	mesh.translateX(1);
}






