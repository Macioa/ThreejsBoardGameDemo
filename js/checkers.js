
	material2 = new THREE.MeshToonMaterial( { color: 0x871511, map: checkerbumpmap } );

loader.load( './mesh/CheckerSmall.stl', function ( geometry ) {
		let checkmaterial = new THREE.MeshToonMaterial( { color: 0x871511, map: checkerbumpmap } );
		let checkerMesh = new THREE.Mesh( geometry, checkmaterial );
		checkerMesh.position.set( 0, 0, .125 );
		checkerMesh.rotation.set( Math.PI, 0, 0 );
		checkerMesh.scale.set( .25/6, .25/6, .25/6 );

		checkerMesh.castShadow = true;
		checkerMesh.receiveShadow = true;

		loadedMeshes.push(checkerMesh);
		//console.log(loadedMeshes);
	} );


class Checker extends Token {
	constructor(player, startingTile, mesh) {
		super("checker", player, startingTile, mesh);
		this.defaultAllowedMovement = [
			['nw','nw'],
			['ne','ne']
		];
	}
}

class Checkers extends Game {
	constructor(players){
		super(players);
		//name game
		this.game = "Checkers";

		//build board
		this.buildBoard(8,8);

		//build pieces
		for (let i =1; i<=3; i++){
			let s = 1;
			if (i%2==1)
				s = 2;
			for(let j = s; j<10; j+=2){
				let newToken = new Checker(this.players[0], this.board[i][j], loadedMeshes[0]);
				this.players[0].addToken(newToken);
			}
		}
	this.players[0].tokens[0].mesh.material.emissive.setHex(0x1f52a5);
	this.players[0].tokens[0].tile.mesh.material.emissive.setHex(0x1f52a5);
	this.players[0].tokens[0].tile.e.mesh.material.emissive.setHex(0xd409ef);
	console.log('asdf')
	console.log(this.players[0].tokens[0].tile.e);
	console.log('asdf');
	this.players[0].tokens[0].moveTo(this.players[0].tokens[0].tile.e);
	this.startNextPlayerTurn();
	}
}