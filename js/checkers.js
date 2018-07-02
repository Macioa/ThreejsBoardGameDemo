
	material2 = new THREE.MeshToonMaterial( { color: 0x871511, map: checkerbumpmap } );
	loader.load( './mesh/CheckerSmall.stl', function ( geometry ) {

		checkerMesh = new THREE.Mesh( geometry, material2 );
		checkerMesh.position.set( 0, 0, .125 );
		checkerMesh.rotation.set( Math.PI, 0, 0 );
		checkerMesh.scale.set( .25/6, .25/6, .25/6 );

		checkerMesh.castShadow = true;
		checkerMesh.receiveShadow = true;

		loadedMeshes.push(checkerMesh);
	} );


class Checker extends Token {
	constructor(player, startingTile, mesh) {
		super("checker", player, startingTile, mesh);
		this.allowedMovement = [
			['nw','nw'],
			['ne','ne']
		];
	}

}

class Checkers extends Game {
	constructor(){
		super();
		this.numPlayers = 2;
		this.players = [];
		//build board
		this.buildBoard(8,8);
		//build players
		for (let i =0; i<this.numPlayers; i++){
			this.players.push(new Player('Steve', '0x871511'))
		}


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

	}
}