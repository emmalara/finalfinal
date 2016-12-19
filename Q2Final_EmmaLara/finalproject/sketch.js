var mover;
var boids = [];
var numBoids = 50;
var attractor;
var hit;
var snow;
var santa;

function setup() {
	fill(0, 0, 0,0);
	var cnv = createCanvas(windowWidth-480, windowHeight-200);
	cnv.parent('main');
	snow= loadImage("snow.gif");
	santa= loadImage("santa.gif");



	mover = new Mover();

	//attractor = new Mover(false);
	Boid.prototype = new Mover();
	Attractor.prototype = new Mover();
	//Repeller.prototype = new Mover();
	//Boid.prototype.constructor = Boid;
	b1 = new Boid(); // this must come after inherittance to receive
	attractor = new Attractor();
	loadBoids();
	noCursor();

}

function draw() {
	//background(62);
	clear();
	background(0,0, 0, 0);
	push();
		imageMode(CENTER);
	 image(santa, mouseX,mouseY,50,50);
	 pop();

	 hit = collideCircleCircle(mouseX,mouseY,150,200,200,100)

	 print("colliding? " + hit);

	push()
		fill(0, 0, 0, 0);
		rect(0, 0, width, height);
	pop();
	attractor.run();

	mover.run();
	//attractor.run();
	for (var i = 0; i < boids.length; i++) {
		boids[i].run();
	}

}

function changeReppelrForce() {
  mover.force = createVector(random(-1, 1), random(-1, 1));
}
setInterval(changeReppelrForce, 1000);


function loadBoids() {
	for (var i = 0; i < numBoids; i++) {
		boids.push(new Boid());
	}
}
var Repeller = function(x, y) {
  this.loc = new Mover(x, y);
}

Repeller.prototype.display = function() {
  stroke(255);
  strokeWeight(2);
  fill(0,0,0,0);
  image(snow, this.loc.x, this.loc.y, 32, 32);
}
function Mover() {
 this.force = createVector(random(.03), random(.03));
	this.rad  = 50;
	this.acc = createVector(random(.3), random(.3));
	this.vel = createVector(random(-3, 3), random(-3, 3));
	this.loc = createVector(random(width), random(height));
	this.clr = 1;
}

Mover.prototype.run = function() {
	this.update(this.force);// default = (0,0)
	this.checkEdges();
	this.render();
}

Mover.prototype.applyForce = function (f) {
		this.acc.add(f);
}

Mover.prototype.render = function() {
	push();
	  strokeWeight(5);
    fill(255,0,255);
		stroke(0,0,0,0);
		image(snow,this.loc.x, this.loc.y, this.rad, this.rad);
	pop();
}

Mover.prototype.update = function(force) {
	//setTimeout(changeMoverAcc, 500);
	this.force = force;
	this.applyForce(force);
	this.vel.add(this.acc);
	this.vel.limit(1);
	this.loc.add(this.vel);
}

Mover.prototype.checkEdges = function() {
	if (this.loc.x > width) this.loc.x = 0;
	if (this.loc.x < 0) this.loc.x = width;
	if (this.loc.y > height) this.loc.y = 0;
	if (this.loc.y < 0) this.loc.y = height;

}
function Boid() {
	this.force = createVector(0,0);
	this.force2 = createVector(0,0);
	this.acc = createVector(random(.1, .9), random(-.9, .1));
	this.vel = createVector(random(-3, 3), random(-3, 3));
	this.loc = createVector(random(width), random(height));



	this.render = function() {
		push();
  		fill(0, 0, 0, 0);
  		image(snow, this.loc.x, this.loc.y, 30, 30);
		pop();
		push();
  		fill(0, 0, 0, 0);
  		noStroke();
  		ellipse(this.loc.x, this.loc.y, 10, 10);
  	pop();

	}

	this.update = function(force) {
		this.force = force;
		this.force2= force;
	 // Incase we want to send f
		this.fear = random(1000, 1000);
		//calc force vector
		this.force = p5.Vector.sub(this.loc,mover.loc);
		this.force2 = p5.Vector.sub(this.loc,attractor.loc);
		this.force.normalize();
		this.force2.normalize();
		this.force.mult(.1);
		this.force2.mult(.1);
		// If in range of Mover--run for your life!
		if(this.loc.dist(mover.loc) < 50){
			this.applyForce(this.force);
			this.vel.add(this.force);
			this.vel.limit(random(3,6));
		} else if(this.loc.dist(mover.loc) < 30){
			this.applyForce(this.force);
			this.vel.add(this.force);
			this.vel.limit(random(5,10));
		}	else if(this.loc.dist(attractor.loc) < 70){
				this.applyForce(this.force2);
				this.vel.add(this.force2.mult(-1));
				this.vel.limit(random(3,6));
			} else if(this.loc.dist(attractor.loc) < 50){
				this.applyForce(this.force);
				this.vel.add(this.force2.mult(-1));
				this.vel.limit(random(5,10));
			}else{
			//this.vel.add(this.force);
			this.vel.limit(1);
		}
		this.loc.add(this.vel);
		this.acc.mult(0);
	}
	//attractor



	this.loc.add(this.vel.mult(-1));
	this.acc.mult(0);
}
	//bounce off walls
	this.checkEdges = function() {
		if (this.loc.x > width || this.loc.x < 0) this.vel.x *= -1;
		if (this.loc.y > height || this.loc.y < 0) this.vel.y *= -1;
	}
  function Attractor(){
    this.render = function(){
      stroke(255);
      strokeWeight(2);
      fill(127);
      image(snow, this.loc.x, this.loc.y, 32, 32);
    }
  }
