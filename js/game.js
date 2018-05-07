alert("game js reporting in");

class Game {
	constructor () {}
	buildBoard(sizeX,sizeY){
		this.board = [];
		var size = 8;
		
		//build board
		for (var i = 0; i <= sizeX+1; i++){
			for (var j = 0; j <= sizeY+1; j++){
				if ((i==0)||(j==0)||(i==sizeX+1)||(j==sizeY+1))
					this.board.push(new Tile(0x003300, new THREE.Vector2(i,j), true));
				else
				if ((i+j)%2==0)
					this.board.push(new Tile(0xffffff, new THREE.Vector2(i,j)));
				else 
					this.board.push(new Tile(0x663300, new THREE.Vector2(i,j)));
			}
		}
	
		
	}
}

class Player {
	constructor(name,color){
	this.name = name;
	this.color = color;
	}
}

class Token {
	constructor(name, allowedMovement){
		this.name = name;
		this.allowedMovement = allowedMovement;
	}
}

class Tile {
	constructor(color,position,border = false) {
		this.color = color;
		this.position = position;
		this.n = null;
		this.ne = null;
		this.e = null;
		this.se = null;
		this.s = null;
		this.sw = null;
		this.w = null;
		this.nw = null;
		this.u = null;
		this.d = null;
		this.isOpen = !border;
		
		if (!border)
			this.geometry = new THREE.BoxGeometry( 1,1,1 );
		else 
			this.geometry = new THREE.BoxGeometry( 1,1,1.25 );
		
		this.material = new THREE.MeshBasicMaterial( { color: color } );
		
		this.mesh = new THREE.Mesh( this.geometry, this.material );
		
		scene.add(this.mesh);
		
		this.mesh.translateX(this.position.x);
		this.mesh.translateY(this.position.y);
	}
}
