var audio = {
	analyser: {},
	buffer: {},
	buffer_effects: {},
	compatibility: {},
	convolver: {},
	files: ["./webaudio/0.mp3", "./webaudio/1.mp3", "./webaudio/2.mp3", "./webaudio/3.mp3", "./webaudio/4.mp3", "./webaudio/5.mp3", "./webaudio/6.mp3"],
	gain: {},
	gain_loop: {},
	gain_once: {},
	pause_vis: true,
	playing: 0,
	proceed: true,
	source_loop: {},
	source_once: {},
	volume_fade_time: 0,
	loadnum: 0,
	loadover: false,
	isSupported:true
};

audio.findSync = function (n) {
	var first = 0,
		current = 0,
		offset = 0;
	for (var i in audio.source_loop) {
		current = audio.source_loop[i]._startTime;
		if (current > 0) {
			if (current < first || first === 0) {
				first = current
			}
		}
	}
	if (audio.context.currentTime > first) {
		var duration = audio.buffer[n].duration;
		offset = (audio.context.currentTime - first) % duration
	}
	return offset
};
audio.play = function (n, volume, isLoop, isContinue) {
	if(audio.proceed)
	{
		//if (audio.source_loop[n]._playing) {
		//	//console.log("正在播放 "+n);
		//	if (!playOnly) {
		//		audio.stop(n)
		//	}
		//} else {
		//}
		audio.source_loop[n] = audio.context.createBufferSource();
		audio.source_loop[n].buffer = audio.buffer[n];
		audio.source_loop[n].connect(audio.gain_loop[n]);
		audio.source_loop[n].loop = isLoop;
		var offset = audio.findSync(n);
		audio.source_loop[n]._startTime = audio.context.currentTime;
		if (audio.compatibility.start === "noteOn") {
			console.log("play-start: "+audio.compatibility.start);
			audio.source_once[n] = audio.context.createBufferSource();
			audio.source_once[n].buffer = audio.buffer[n];
			audio.source_once[n].connect(audio.gain_once[n]);
			audio.source_once[n].noteGrainOn(0, offset, audio.buffer[n].duration - offset);
			console.log(offset+"play-offset: "+audio.buffer[n].duration);
			audio.gain_once[n].gain.setValueAtTime(0, audio.context.currentTime);
			console.log("currentTime: "+audio.context.currentTime);
			audio.gain_once[n].gain.linearRampToValueAtTime(1, audio.context.currentTime + audio.volume_fade_time);
			console.log("play-volume_fade_time: "+audio.volume_fade_time);
			audio.source_loop[n][audio.compatibility.start](audio.context.currentTime + (audio.buffer[n].duration - offset))
			console.log("play-duration: "+audio.buffer[n].duration);
		} else {
			//console.log("play-offset11: "+offset);
			var _offset = 0;
			if(isContinue)
			{
				_offset = offset;
			}
			else
			{
				_offset = 0;
			}
			audio.source_loop[n][audio.compatibility.start](0, _offset)
			//从offset开始播
			//audio.source_loop[n][audio.compatibility.start](0, offset)
			//从0开始播
			//audio.source_loop[n][audio.compatibility.start](0, 0)
		}
		audio.gain_loop[n].gain.setValueAtTime(0, audio.context.currentTime);
		//audio.gain_loop[n].gain.linearRampToValueAtTime(1, audio.context.currentTime + audio.volume_fade_time);

		//设置音量
		if(volume<0)
		{
			volume = 0;
		}
		//if(volume>1)
		//{
		//	volume = 1;
		//}
		audio.gain_loop[n].gain.linearRampToValueAtTime(volume, audio.context.currentTime + audio.volume_fade_time);

		//console.log(audio.context.currentTime+ "linearRampToValueAtTime: "+audio.volume_fade_time);
		audio.source_loop[n]._playing = true;
		audio.playing = audio.playing + 1;
		if (audio.playing === 1) {
			audio.pause_vis = false;
		}
	}
};
audio.playAll = function () {
	console.log(audio.source_loop.length);
	for (var a in audio.source_loop) {
		//console.log(a);
		audio.play(a, true)
	}
};
audio.stop = function (n) {
	if (audio.source_loop[n]._playing && !audio.source_loop[n]._stopping) {
		audio.source_loop[n].loop = false;
		audio.source_loop[n]._stopping = true;
		audio.source_loop[n][audio.compatibility.stop](audio.context.currentTime + audio.volume_fade_time);
		audio.source_loop[n]._startTime = 0;
		if (audio.compatibility.start === "noteOn") {
			audio.source_once[n][audio.compatibility.stop](audio.context.currentTime + audio.volume_fade_time);
			audio.gain_once[n].gain.setValueAtTime(1, audio.context.currentTime);
			audio.gain_once[n].gain.linearRampToValueAtTime(0, audio.context.currentTime + audio.volume_fade_time)
		}(function () {
			var num = n;
			setTimeout(function () {
				audio.source_loop[num]._playing = false;
				audio.source_loop[num]._stopping = false
			}, audio.volume_fade_time * 100)
		})();
		audio.gain_loop[n].gain.setValueAtTime(1, audio.context.currentTime);
		audio.gain_loop[n].gain.linearRampToValueAtTime(0, audio.context.currentTime + audio.volume_fade_time);
		audio.playing = audio.playing - 1;
		//if (audio.playing === 0) {
		//	setTimeout(function () {
		//		if (audio.playing === 0) {
		//			audio.pause_vis = true;
		//			jQuery(".widget-vis p").stop().fadeIn(3e3)
		//		}
		//	}, 5e3)
		//}
	}

};
audio.stopAll = function () {
	for (var a in audio.source_loop) {
		audio.stop(a)
	}
};
try {
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	audio.context = new window.AudioContext
} catch (e) {
	audio.proceed = false;
	audio.isSupported = false;
	//alert("Web Audio API not supported in this browser.")
}
if (audio.proceed) {
	(function () {
		var name = "createGain";
		if (typeof audio.context.createGain !== "function") {
			name = "createGainNode"
		}
		audio.compatibility.createGain = name
	})();
	(function () {
		var start = "start",
			stop = "stop",
			buffer = audio.context.createBufferSource();
		if (typeof buffer.start !== "function") {
			start = "noteOn"
		}
		audio.compatibility.start = start;
		if (typeof buffer.stop !== "function") {
			stop = "noteOff"
		}
		audio.compatibility.stop = stop
	})();
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
	audio.gain.booster = audio.context[audio.compatibility.createGain]();
	audio.gain.booster.gain.value = 3;
	audio.convolver = audio.context.createConvolver();
	audio.convolver.connect(audio.gain.booster);
	audio.gain.collapse = audio.context[audio.compatibility.createGain]();

	audio.analyser = audio.context.createAnalyser();
	audio.analyser.smoothingTimeConstant = .85;
	audio.analyser.fftSize = 256;
	audio.frequencyData = new Uint8Array(audio.analyser.frequencyBinCount);
	jQuery("#master-volume").prop("disabled", false).knob({
		angleArc: 360,
		angleOffset: 0,
		displayInput: true,
		height: 104,
		thickness: ".2",
		width: 104,
		change: function (v) {
			v = v / 100;
			audio.gain.master.gain.value = v * v
		}
	});
	audio.gain.master = audio.context[audio.compatibility.createGain]();
	audio.gain.master.gain.value = .8649;
	audio.gain.master.connect(audio.analyser);
	audio.gain.master.connect(audio.context.destination);
	audio.gain.collapse.connect(audio.gain.master);

	//(function loadaudio() {
	//	var req = new XMLHttpRequest;
	//	req.open("GET", audio.files[audio.loadnum], true);
	//	req.responseType = "arraybuffer";
	//	req.onload = function () {
	//		audio.context.decodeAudioData(req.response, function (buffer) {
	//			audio.buffer[audio.loadnum] = buffer;
	//			audio.source_loop[audio.loadnum] = {};
	//			console.log(audio.loadnum +"-"+ audio.loadover+"赋值了？" + audio.source_loop[audio.loadnum].name);
	//			audio.gain_loop[audio.loadnum] = audio.context[audio.compatibility.createGain]();
	//			audio.gain_loop[audio.loadnum].connect(audio.gain.collapse);
	//			if (audio.compatibility.start === "noteOn") {
	//				audio.gain_once[audio.loadnum] = audio.context[audio.compatibility.createGain]();
	//				audio.gain_once[audio.loadnum].connect(audio.gain.collapse)
	//			}
	//			++audio.loadnum;
    //
	//			if(audio.loadnum < audio.files.length)
	//			{
	//				loadaudio();
	//			}
	//			else
	//			{
	//				console.log(audio.loadnum+",loading over");
	//				audio.loadover = true;
	//			}
	//		}, function () {
	//			console.log('Error decoding audio "' + audio.files[audio.loadnum - 1] + '".')
	//		})
	//	};
	//	req.send()
	//})()

	for (var a in audio.files) {
		(function () {
			var i = parseInt(a);
			var req = new XMLHttpRequest;
			req.open("GET", audio.files[i], true);
			req.responseType = "arraybuffer";
			req.onload = function () {
				audio.context.decodeAudioData(req.response, function (buffer) {
					audio.buffer[i] = buffer;
					audio.source_loop[i] = {};
					//console.log(i +"-"+ audio.loadover+"赋值了？" + audio.source_loop[i].name);
					audio.gain_loop[i] = audio.context[audio.compatibility.createGain]();
					audio.gain_loop[i].connect(audio.gain.collapse);
					if (audio.compatibility.start === "noteOn") {
						audio.gain_once[i] = audio.context[audio.compatibility.createGain]();
						audio.gain_once[i].connect(audio.gain.collapse)
					}
					++audio.loadnum;
					if(audio.loadnum == audio.files.length)
					{
						console.log(audio.loadnum+",loading over");
						audio.loadover = true;
					}
				}, function () {
					console.log('Error decoding audio "' + audio.files[i - 1] + '".')
				})
			};
			req.send()
		})()
	}

	audio.AudioSupported = function()
	{
		return audio.isSupported;
	};
	audio.isover = function()
	{
		return audio.loadover;
	};

}