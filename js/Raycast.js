function rayCast(filteredObjects){
	//raycaster for mousehover
	//console.log(filteredObjects);
	raycaster.setFromCamera( mouse, camera );

	intersects = raycaster.intersectObjects( filteredObjects );

	if (intersects.length) {
		if ( INTERSECTED != intersects[ 0 ].object ) {
			if ( INTERSECTED ) 
				INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
			INTERSECTED = intersects[ 0 ].object;
			INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
			INTERSECTED.material.emissive.setHex( 0xbeff6b );
			INTERSECTED.material.emissiveIntensity=.3;
			selected = INTERSECTED;
		}
	} else {
		if ( INTERSECTED ) {
			INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
			INTERSECTED.material.emissiveIntensity=1;
		}
		INTERSECTED = null;
	}
}