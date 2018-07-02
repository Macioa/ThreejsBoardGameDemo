alert("game js reporting in");

var scale = .25;

class Game {
	constructor () {
		this.board = [];
		this.pieces = [];
	}
	buildBoard(sizeX,sizeY, center = new THREE.Vector3(0,0,0)){
		
		//build array
		for (let j = 0; j<=sizeY+1; j++)
			this.board.push([]);

		//build board
		for (var i = 0; i <= sizeX+1; i++){
			for (var j = 0; j <= sizeY+1; j++){
				let color = null;
				let isBorder = false;
				if ((i==0)||(j==-0)||(i==sizeX+1)||(j==sizeY+1)){
					color = 'border'; 
					isBorder = true;
				}
				else
				if ((i+j)%2==0)
					color = 'white';
				else 
					color = 'black';

				this.board[i][j] = new Tile(color, new THREE.Vector2(i,j), isBorder);
				}
			}

		//assign neighbors by reference to object, excluding border tiles
		for (var i = 1; i <= sizeX; i++){
				for (var j = 1; j <= sizeY; j++){
					if (i>1){
						this.board[i][j].w=this.board[i-1][j];
							if (j>1)
								this.board[i][j].sw=this.board[i-1][j-1];
							if (j<sizeY)
								this.board[i][j].nw=this.board[i-1][j+1];
					}
					if (i<sizeX){
						this.board[i][j].e=this.board[i+1][j];
						if (j>1)
							this.board[i][j].se=this.board[i+1][j-1];
						if (j<sizeY)
							this.board[i][j].ne=this.board[i+1][j+1];
					}
					if (j>1)
						this.board[i][j].s=this.board[i][j-1];
					if (j<sizeY)
						this.board[i][j].n=this.board[i][j+1];
				}
			}					
		
		
		this.board.forEach(function(row){
			row.forEach(function(tile){
				tile.translate(new THREE.Vector3(center.x-(sizeX+2)/2, center.y-(sizeY+2)/2, center.z*scale));
				tile.mesh.rotateZ((Math.PI/2)*(Math.floor(Math.random() * 4)+1));
			});
		});
	}
	
}

class Player {
	constructor(name,color){
		this.name = name;
		this.color = color;
	}
}

class Token {
	constructor(startingPosition){
		this.name = name;
		this.allowedMovement = [];
		this.position = startingPosition;
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
			this.geometry = new THREE.BoxGeometry( 1*scale,1*scale,1*scale );
		else 
			this.geometry = new THREE.BoxGeometry( 1*scale,1*scale,1.25*scale );
		if (typeof(color) !='string')
			this.material = new THREE.MeshLambertMaterial( { color: color } );
		else {
			switch (color) {
				case 'black': this.material = blacktilematerial; break;
				case 'white': this.material = whitetilematerial; break;
				case 'border': this.material = bordermaterial; break;
				}
			//this.material = checkermaterial;
			//new THREE.MeshLambertMaterial( { map: texture } );
			}
		this.mesh = new THREE.Mesh( this.geometry, this.material.clone() );
		
		scene.add(this.mesh);
		
		this.mesh.translateX(this.position.x*scale);
		this.mesh.translateY(this.position.y*scale);
	}
	
	translate(vector3){
		this.mesh.translateX(vector3.x*scale);
		this.mesh.translateY(vector3.y*scale);
		this.mesh.translateZ(vector3.z*scale);
	}
}


function orderWeight(strng) {
    var arry = strng.split(" ");
    arry.sort(function (a, b) {
      var at=0, bt=0, length = a.length;
      if (b.length>length)
        length = b.length; 
      for(i = 0; i < length; i++){
        if (a[i])
          at+=a[i];
        if (b[i])
          bt+=b[i];
        }
      });
      return at > bt;
}