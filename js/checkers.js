
	
let loader = new THREE.STLLoader();
loader.load( './mesh/CheckerSmall.stl', function ( geometry ) {
		//load checker geometry from file and store to global cache
		let checkerGeometry = new THREE.Geometry().fromBufferGeometry(geometry);
		checkerGeometry.rotateX( Math.PI );
		checkerGeometry.scale( .25/6, .25/6, .25/6 );
		loadedMeshes.push(checkerGeometry);
	} );


class Checker extends Token {
	constructor(player, startingTile, geometry) {
		super("checker", player, startingTile, geometry);
		this.defaultAllowedMovement = [
			['nw'],
			['ne']
		];
		this.allowedMovement=this.defaultAllowedMovement;
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
				loadedMeshes[0].rotateZ( Math.random() * 2 * Math.PI );
				let newToken = new Checker(this.players[0], this.board[i][j], loadedMeshes[0]);
				this.players[0].addToken(newToken);
			}
		}
	this.players[0].tokens[0].displayMesh.material.emissive.setHex(0x1f52a5);
	this.players[0].tokens[0].tile.mesh.material.emissive.setHex(0x1f52a5);
	//this.players[0].tokens[0].tile.e.mesh.material.emissive.setHex(0xd409ef);


	this.players[0].tokens[0].moveTo(this.players[0].tokens[0].tile.e, 0xd409ef);
	this.startNextPlayerTurn();
	}
}