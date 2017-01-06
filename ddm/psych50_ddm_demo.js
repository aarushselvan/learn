var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

////////////////////////////////
////////// ANIMATION /////////////
////////////////////////////////

var tick;

var trial = 0;

var trials = 20;

var onscreen = true;
var dots = [0,0];
dots[0] = initDots(500,400,400,0.25,0,0.15,3);
dots[1] = initDots(500,400,400,0.25,0,0.15,3);
dots[2] = initDots(500,400,400,0.25,0,0.15,3);
var cdots = 0;
var coherence = 0;
var direction = 0;
var t; // elapsed time tracker

var key = false; // tracks key situtation

var state = false; // false = waiting incoherent, true = currne trial

var tstart = NaN; // trial start tracker (for RT)

function draw() {
	t = elapsed();
	ctx.clearRect(0,0,canvas.width,canvas.height);

	(state) ? dots[cdots] = updateDots(dots[cdots],coherences[trial],directions[trial],t) : dots[cdots] = updateDots(dots[cdots],0,0,t);
	if (onscreen) {
		clipCtx(ctx,canvas);
		drawDots(dots[cdots],ctx);
		ctx.restore();
	}

	if (trial >= trials) {
		stop();
		ctx.clearRect(0,0,canvas.width,canvas.height);
		$("#canvas").hide();
		$("#prog").hide();
		$("#continue").show();
		next();
		return;
	}

	if (key) {
		switch (key) {
			case 37: // left
				if (state) {
					state = false;
					// cdots = (cdots+1)%3;
					calcVals(directions[trial]>0);
					trial++;
				}
				break;
			case 39: // right
				if (state) {
					state = false;
					// cdots = (cdots+1)%3;
					calcVals(directions[trial]==0);
					trial++;
				}
				break;
			case 38: // up
				if (!state) {
					state = true;
					// cdots = (cdots+1)%3;
					tstart = now();
				}
				break;
		}
	}

	// progress bar
	document.getElementById("prog").value = trial / trials;

	tick = window.requestAnimationFrame(draw);
}

///////////////////////////////////
////////// LOCAL CODE /////////////
///////////////////////////////////
var coherences = [];
var directions = [];

var RT = [];
var RTc = [];
var correct = [];
var correctc = [];

var option = 1;

var cohOpts = [0.15, 0.65];
var dirOpts = [0, Math.PI];

function setup() {
	for (var i=0; i<trials;i++) {
		coherences.push(cohOpts[option]);
		directions.push(dirOpts[Math.round(Math.random())]);
	}
}

function toggleCoherence() {
	option = (option+1)%2;
	if (option==1) {
		document.getElementById("toggle").innerHTML = "High coherence";
	} else {
		document.getElementById("toggle").innerHTML = "Low coherence";
	}
}

function calcVals(corr) {
	RT.push(now()-tstart);
	correct.push(corr);
	// if (coherences[trial-1]==cohOpts[0]) {
	// 	// incoherent condition
	// 	RTi.push(now()-tstart);
	// 	correcti.push(corr);
	// } else {
	// 	// coherent condition
	// 	RTc.push(now()-tstart);
	// 	correctc.push(corr);
	// }
}

document.addEventListener("keydown",keyPress,false);

function keyPress(event) {
	key = event.which;
	if (key==37 || key==39 || key==38 || key==40) {event.preventDefault();}
}

var done2 = false;

function stop() {
	window.cancelAnimationFrame(tick);

	document.getElementById("rti").value = "Reaction time: " + Math.round(mean(RT)) + " ms";
	// document.getElementById("rtc").value = "High coherence reaction time: " + Math.round(mean(RTc)) + " ms";
	document.getElementById("pci").value = "Percent correct: " + Math.round(mean(correct)*100) + "%";
	// document.getElementById("pcc").value = "High coherence % correct: " + Math.round(mean(correctc)*100) + "%";
}

function run(i) {
	// Runs each time a block starts incase that block has to do startup
	switch(i) {
		case 2:
			setup();
			$("#continue").hide();
			t = elapsed();
			draw();
			break;
 }
}

function launch_local() {
	// katex.render("y(t)=y_{0}+v_{y}t+\\frac{1}{2}at^{2}",document.getElementById("katex1"),{displayMode:true});
	// katex.render("y(t)=y_{0}+v_{y}t+\\frac{1}{2}at^{2}",document.getElementById("katex2"),{displayMode:true});	
}
