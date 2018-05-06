//js/three.min.js
//js/OrbitControls.js

var camera, scene, renderer;
var geometry, material, mesh;
var controls;
 
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
    camera.position.z = 1;
 
    scene = new THREE.Scene();
 
    geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    material = new THREE.MeshNormalMaterial();
 
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
 
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
	document.addEventListener('dblclick', onMouseDown, false);

	controls = new THREE.OrbitControls( camera, renderer.domElement );
}
 
function animate() { 
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
	console.log("animating");
}

function onMouseDown(event) {
	event.preventDefault();
}



asdf


