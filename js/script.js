
/* scroll controllers*/
var controller = new ScrollMagic.Controller();

var scene = new ScrollMagic.Scene({triggerElement: "#trigger2"})
					// trigger animation by adding a css class
.setClassToggle("#animate2", "topBarA")
					//.addIndicators({name: "1 - add a class"}) // add indicators (requires plugin)
					.addTo(controller);







var scene = new ScrollMagic.Scene({triggerElement: "#trigger2"})
					// trigger animation by adding a css class
                    .setClassToggle("#headd", "he2")
					.addTo(controller);


var scene = new ScrollMagic.Scene({triggerElement: "#trigger2"})
					// trigger animation by adding a css class
                    .setClassToggle("#te", "te2")
					.addTo(controller);

/* scroll controllers*/





































/*dots navigation*/
;( function( window ) {

	'use strict';

	function extend( a, b ) {
		for( var key in b ) { 
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	function DotNav( el, options ) {
		this.nav = el;
		this.options = extend( {}, this.options );
  		extend( this.options, options );
  		this._init();
	}

	DotNav.prototype.options = {};

	DotNav.prototype._init = function() {
		// special case "dotstyle-hop"
		var hop = this.nav.parentNode.className.indexOf( 'dotstyle-hop' ) !== -1;

		var dots = [].slice.call( this.nav.querySelectorAll( 'li' ) ), current = 0, self = this;

		dots.forEach( function( dot, idx ) {
			dot.addEventListener( 'click', function( ev ) {
				ev.preventDefault();
				if( idx !== current ) {
					dots[ current ].className = '';

					// special case
					if( hop && idx < current ) {
						dot.className += ' current-from-right';
					}

					setTimeout( function() {
						dot.className += ' current';
						current = idx;
						if( typeof self.options.callback === 'function' ) {
							self.options.callback( current );
						}
					}, 25 );						
				}
			} );
		} );
	}

	// add to global namespace
	window.DotNav = DotNav;

})( window );
/*dots navigation*/

































/*blob ball*/

console.clear();
var canvas = document.getElementById('canvas1'),
    context = canvas.getContext('2d'),
    circle, rafId;

var mouse = {
  x: 0,
  y: 0,
  onMove: function(e) {
    this.x = e.screenX;
    this.y = e.screenY;
  }
};

window.addEventListener('mousemove', mouse.onMove.bind(mouse));

var resizer = {
  w: 0,
  h: 0,
  onResize: function() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    canvas.width = this.w;
    canvas.height = this.h;
    resize();
  }
};

window.addEventListener('resize', resizer.onResize.bind(resizer));

var Point = {
  x: 0, // used to draw
  y: 0,
  ox: 0, // origin
  oy: 0,
  targetX: 0, // For bounciness
  targetY: 0,
  maxX: 0,
  maxY: 0,
  dist: 0,
  maxDist: 0,
  velocityX: 0,
  velocityY: 0,
  
  update: function(x, y) {
    var dx = x - this.ox,
        dy = y - this.oy;
    this.dist = Math.sqrt(dx * dx + dy * dy);
    
    if(this.dist < this.maxDist) {
      
      /*
        Moves the point between it's originX and maxX
        according to the dist between mouseX and originX
        (so the closer the farther).
        Formula taken from the minimalmonkey wobble ball
        http://www.flashmonkey.co.uk/wobblewall/
      */
      
      var distRatio = 1 - (this.dist / this.maxDist);
      this.targetX = this.ox + ((this.maxX - this.ox) * distRatio);
      this.targetY = this.oy + ((this.maxY - this.oy) * distRatio);
    }
    else {
      this.targetX = this.ox;
      this.targetY = this.oy;
    }
        
    /*
      A good explanation here:
      Gives the "bounciness" to the shape
      https://medium.com/@gordonnl/interactive-elastic-ease-ca3815fda572
    */
    
    var accelerationX = (this.targetX - this.x) * this.spring;
    this.velocityX += accelerationX;
    this.velocityX *= this.friction;
    this.x += this.velocityX;

    var accelerationY = (this.targetY - this.y) * this.spring;
    this.velocityY += accelerationY;
    this.velocityY *= this.friction;
    this.y += this.velocityY;
  }
};

var Bouncy = function(context, params) {
  this.context = context;
  this.context.lineWidth = 2;
  this.drawDots = params.drawDots;
  this.drawFill = params.drawFill;
  this.dotsRadius = params.dotsRadius;
  this.x = 0;
  this.y = 0;
  this.radius = params.radius;
  this.number = params.number;
  
  this.lineWidth = params.lineWidth;
  this.backgroundColor = params.backgroundColor;
  this.fillStyle = params.fillColor;
  this.strokeStyle = params.color;
  this.points = [];

  var maxDist = params.maxDist * this.radius;
  
  for(var i = 0; i < this.number; i++) {
    var p = Object.create(Point);  

    // Circular distribution
    p.x = p.ox = p.targetX = this.radius * Math.cos(Math.PI * 2 / this.number * i);
    p.y = p.oy = p.targetY = this.radius * Math.sin(Math.PI * 2 / this.number * i);
    
    // Max target for the point
    p.maxX = Math.cos(Math.PI * 2 / this.number * i) * maxDist;
    p.maxY = Math.sin(Math.PI * 2 / this.number * i) * maxDist;
    
    p.maxDist = maxDist;
    p.friction = params.friction;
    p.spring = params.spring;
    this.points.push(p);
  }
};

Bouncy.prototype.update = function() {
  var ctx = this.context;
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, resizer.w, resizer.h);
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.lineWidth = params.lineWidth;
  ctx.fillStyle = params.fillColor;
  ctx.strokeStyle = params.color;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  ctx.beginPath();
  
  var mouseX = mouse.x - this.x,
      mouseY = mouse.y - this.y;
  
  var firstPoint = this.points[0];
  
  // Link all points to the next one
  for(var i = 0; i < this.points.length; i++) {
    var p = this.points[i];
    p.update(mouseX, mouseY);
    
    ctx.lineTo(p.x, p.y);
    //if(this.drawDots) ctx.arc(p.x, p.y, this.dotsRadius, 0, Math.PI * 2);
  }
    
    ctx.lineTo(firstPoint.x, firstPoint.y);
    if(this.drawFill) ctx.fill();
    ctx.stroke();
    ctx.restore();
};




var params = {
  color: '#ffffff',
  fillColor: '#c7ad88',
  backgroundColor: '#000000',
  number: 100,
  lineWidth: 1,
  radius: 250,
  maxDist: 1.1,
  drawDots: true,
  dotsRadius: 1,
  drawFill: false,
  spring: 0.08,
  friction: 0.86
};

function update() {
  rafId = requestAnimationFrame(update);
  circle.update();
}

function resize() {
  if(!circle) return;
  circle.x = resizer.w / 2;
  circle.y = resizer.h / 2;
}
function start() {
  init();
  mouse.x = resizer.w / 2;
  mouse.y = resizer.h / 2;
  update();
}

function init() {
  circle = new Bouncy(context, params);
  resizer.onResize();
}

start();

















































































/**
 * hovers.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2014, Codrops
 * http://www.codrops.com
 */
(function() {
	
	function init() {
		var speed = 250,
			easing = mina.easeinout;

		[].slice.call ( document.querySelectorAll( '#grid > a' ) ).forEach( function( el ) {
			var s = Snap( el.querySelector( 'svg' ) ), path = s.select( 'path' ),
				pathConfig = {
					from : path.attr( 'd' ),
					to : el.getAttribute( 'data-path-to' )
				};

			el.addEventListener( 'mouseenter', function() {
				path.animate( { 'path' : pathConfig.to }, speed, easing );
			} );

			el.addEventListener( 'mouseleave', function() {
				path.animate( { 'path' : pathConfig.from }, speed, easing );
			} );
		} );
	}

	init();

})();










































