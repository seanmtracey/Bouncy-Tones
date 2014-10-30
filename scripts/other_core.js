var __bouncy_tones = (function(){

	'use strict';

	var canvas = document.getElementsByTagName('canvas')[0],
		ctx = canvas.getContext('2d');

	var boxes = [],
		boxSize = 20,
		maxV = 50;

	var currentX = 0,
		currentY = 0;

	window.audioContext = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext);
	window.requestAnimationFrame = (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame);

	var webAudio = undefined,
		oscillator = undefined,
		amplifier = undefined;

	function update(){

		var g = 0;

		ctx.beginPath();

		while(g < boxes.length){

			boxes[g].y += boxes[g].v;
			if(boxes[g].down){
				boxes[g].v = boxes[g].v * 1.1;
			} else {
				boxes[g].v = boxes[g].v * 0.92;
			}
			
			if(boxes[g].v > 50){
				boxes[g].v = 50;
			} else if(boxes[g].v < -50){
				boxes[g].v = -50;
			}

			if(boxes[g].y + boxSize > canvas.height){
				boxes[g].v = boxes[g].v * -1;
				boxes[g].y = canvas.height - boxSize;
				boxes[g].color.a = 1;
				boxes[g].down = false;
				boxes[g].oscillator.frequency.value = boxes[g].x;

				(function(box){
					
					setTimeout(function(){
						box.oscillator.frequency.value = 0;
					}, 100);

				})(boxes[g]);

				

			}

			if(boxes[g].v < 0.1 && boxes[g].v > - 0.1){
				boxes[g].down = true;
				boxes[g].v = 1;
			}

			boxes[g].color.a = boxes[g].color.a * 0.9;

			g += 1;

		}


		draw();

	}

	function draw(){
		
		//ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

		ctx.fillStyle = "rgba(0,0,0,.01)";
		ctx.fillRect(0,0,canvas.width, canvas.height);

		var h = 0;

		ctx.strokeRect(currentX - boxSize / 2, 40, boxSize, boxSize);

		while(h < boxes.length){

			ctx.strokeRect(boxes[h].x, boxes[h].y, boxSize, boxSize);
			ctx.fillStyle = "rgba(" + boxes[h].color.r + "," + boxes[h].color.g + "," + boxes[h].color.b + "," + boxes[h].color.a + ")";
			ctx.fillRect(boxes[h].x, boxes[h].y, boxSize, boxSize);

			h += 1;

		}

		window.requestAnimationFrame(update);

	}

	function addEvents(){

		window.addEventListener('click', function(e){

			console.log(e);

			var box = {
					x : e.clientX - boxSize / 2,
					y : 40,
					maxY : e.clientY - boxSize / 2,
					down : true,
					v : 1,
					color : {
						r : Math.random() * 255 | 0,
						g : Math.random() * 255 | 0,
						b : Math.random() * 255 | 0,
						a : 0
					},
					oscillator :  webAudio.createOscillator(),
					amplifier : webAudio.createGain()
				};

			box.oscillator.frequency.value = 0;
			box.oscillator.connect(box.amplifier);
			box.amplifier.connect(webAudio.destination);

			box.oscillator.start(0);

			boxes.push(box);

		}, false);

		window.addEventListener('mousemove', function(e){
			currentX = e.clientX,
			currentY = e.clientY;
		}, false);

	}

	function init(){
		console.log("Initialised");
		
		var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		ctx.strokeStyle = "rgba(255,255,255, 1)";

		webAudio = new window.audioContext()
		
		/*oscillator = webAudio.createOscillator();
		amplifier = webAudio.createGain();

		oscillator.frequency.value = 0;

		oscillator.connect(amplifier);
		amplifier.connect(webAudio.destination);

		oscillator.start(0);

		//oscillator.frequency.value = 220;*/
			

		addEvents();

		update();
	
	}

	return{
		init : init
	};

})();

(function(){
	__bouncy_tones.init();
})();
