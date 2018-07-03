function rayCast(filteredObjects){
	//standard raycaster
	raycaster.setFromCamera( mouse, camera );

	//run raycaster - only subset of filteredObjects is returned.
	intersects = raycaster.intersectObjects( filteredObjects );

	if (intersects.length) {
		if ( INTERSECTED != intersects[ 0 ].object ) {
			if ( INTERSECTED ) 
				INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
			INTERSECTED = intersects[ 0 ].object;
			INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
			INTERSECTED.material.emissive.setHex( 0xbeff6b );
			INTERSECTED.material.emissiveIntensity=.3;
		}
	} else {
		if ( INTERSECTED ) {
			INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
			INTERSECTED.material.emissiveIntensity=1;
		}
		INTERSECTED = null;
	}
}