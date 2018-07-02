//js/three.min.js
//js/OrbitControls.js

var raycaster = new THREE.Raycaster(), INTERSECTED, intersects;

var camera, scene, renderer, mouse = new THREE.Vector2();
var geometry, material, loadedMeshes=[];
var controls, dragControls, selectableObjects = [];

var texture, blacktiletexture, whitetiletexture, bordertexture;
//var blacktilecolor = 0x663300, whitetilecolor = 0xffffff, bordercolor = 0x003300;
var blacktiletexture = 'black', whitetiletexture = 'white', bordertexture = 'border';
var checkerbumpmap;

var blacktilematerial, whitetilematerial, bordermaterial, checkermaterial, shadMaterial, greenMaterial;

var loader = new THREE.STLLoader();


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
	bordertexture = new THREE.TextureLoader().load( "texture/11-seamless-leather-texture.jpg" );
	checkerbumpmap = new THREE.TextureLoader().load( "texture/bump_map.jpg" );

	whitetilematerial = new THREE.MeshPhongMaterial( { map: whitetiletexture } );
	blacktilematerial = new THREE.MeshPhongMaterial( { map: blacktiletexture } );
	bordermaterial = new THREE.MeshPhongMaterial( { map: bordertexture, bumpMap: bordertexture } );


//	var shader = THREE.FresnelShader;
//	var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

//	uniforms.value = bordermaterial;

/*	var shadMaterial = new THREE.ShaderMaterial( {
		uniforms: uniforms,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader
	} ); */



 
//	material2 = new THREE.MeshToonMaterial( { color: 0x871511, map: checkerbumpmap } );

/*	loader.load( './mesh/checker.stl', function ( geometry ) {

		var mesh = new THREE.Mesh( geometry, material2 );

		mesh.position.set( 0, 0, .125 );
		mesh.rotation.set( Math.PI, 0, 0 );
		mesh.scale.set( .25/6, .25/6, .25/6 );

		mesh.castShadow = true;
		mesh.receiveShadow = true;

		scene.add( mesh );
		objects.push( mesh );

	} );*/
 
 
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
	//document.addEventListener('dblclick', onMouseDown, false);

	//dragControls = new THREE.DragControls( objects, camera, renderer.domElement );
	//dragControls.addEventListener( 'dragstart', function ( event ) { controls.enabled = false; } );
	//dragControls.addEventListener( 'dragend', function ( event ) { controls.enabled = true; } );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

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



/*function onMouseDown(event) {
	event.preventDefault();
	mesh.translateX(1);
}*/






