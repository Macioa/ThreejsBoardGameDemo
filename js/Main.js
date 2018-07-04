//js/three.min.js
//js/OrbitControls.js

var raycaster = new THREE.Raycaster(), INTERSECTED, intersects;

var camera, scene, renderer, mouse = new THREE.Vector2();

var loadedMeshes=[];
//var controls, dragControls, 
var selectableObjects = [];

var blacktiletexture, whitetiletexture, bordertexture;

var blacktiletexture = 'black', whitetiletexture = 'white', bordertexture = 'border';


var blacktilematerial, whitetilematerial, bordermaterial;

//var loader = new THREE.STLLoader();


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
	
	whitetiletexture = new THREE.TextureLoader().load( "texture/awhite.png" );
	blacktiletexture = new THREE.TextureLoader().load( "texture/ablack.png" );
	//bordertexture = new THREE.TextureLoader().load( "texture/11-seamless-leather-texture.png" );
	bordertexture = new THREE.TextureLoader().load( "texture/aborder.png" );

	whitetilematerial = new THREE.MeshPhongMaterial( { map: whitetiletexture } );
	blacktilematerial = new THREE.MeshPhongMaterial( { map: blacktiletexture } );
	bordermaterial = new THREE.MeshLambertMaterial( { map: bordertexture, bumpMap: bordertexture } );
 
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );


	//let dragControls = new THREE.DragControls( objects, camera, renderer.domElement );
	//dragControls.addEventListener( 'dragstart', function ( event ) { controls.enabled = false; } );
	//dragControls.addEventListener( 'dragend', function ( event ) { controls.enabled = true; } );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	let controls = new THREE.OrbitControls( camera, renderer.domElement );

	var spotlightA = new THREE.SpotLight( 0xffffff );
	spotlightA.position.set( 10, 0, 10 );
	scene.add( spotlightA );
	
	var spotlightB = new THREE.SpotLight( 0xffffff );
	spotlightB.position.set( 0, 10, 10 );
	scene.add( spotlightB );
	
	this.animate();
}




function onDocumentMouseMove( event ) {
	event.preventDefault();

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}
 



function animate() { 
	requestAnimationFrame( animate );
	rayCast(selectableObjects);
    renderer.render( scene, camera );
}






