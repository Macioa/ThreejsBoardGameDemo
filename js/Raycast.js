function rayCast(filteredObjects){
	//raycaster for mousehover
	//console.log(filteredObjects);
	raycaster.setFromCamera( mouse, camera );

	intersects = raycaster.intersectObjects( filteredObjects );

	if (intersects.length) {
		if ( intersected != intersects[ 0 ].object ) {
			if ( intersected ) 
				intersected.material.emissive.setHex( intersected.currentHex );
			intersected = intersects[ 0 ].object;
			intersected.currentHex = intersected.material.emissive.getHex();
			intersected.material.emissive.setHex( 0xff0000 );
		}
	} else {
		if ( intersected ) {
			console.log(intersected, material);
			intersected.material.emissive.setHex( intersected.currentHex );
		}
		intersected = null;
	}
}