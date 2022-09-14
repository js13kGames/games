function userInput() {
	//マウス操作
	document.getElementById('ArrowRight').addEventListener('mousedown', e => {
		$rightIntervalId = setInterval(function() {
			right();
		}, 40);
	});
	document.getElementById('ArrowRight').addEventListener('mouseup', e => {
		clearInterval($rightIntervalId);
	});
	document.getElementById('ArrowLeft').addEventListener('mousedown', e => {
		$leftIntervalId = setInterval(function() {
			left();
		}, 40);
	});
	document.getElementById('ArrowLeft').addEventListener('mouseup', e => {
		clearInterval($leftIntervalId);
	});
	document.getElementById('ArrowUp').addEventListener('mousedown', e => {
		$upIntervalId = setInterval(function() {
			up();
		}, 40);
	});
	document.getElementById('ArrowUp').addEventListener('mouseup', e => {
		clearInterval($upIntervalId);
	});
	document.getElementById('ArrowDown').addEventListener('mousedown', e => {
		$downIntervalId = setInterval(function() {
			down();
		}, 40);
	});
	document.getElementById('ArrowDown').addEventListener('mouseup', e => {
		clearInterval($downIntervalId);
	});
	document.getElementById('a').addEventListener('mousedown', e => {
		a();
	});
	document.getElementById('b').addEventListener('mousedown', e => {
		b();
	});

	//タッチ操作
	var touchstartX = 0;
	var touchstartY = 0;
	document.getElementById('ArrowRight').addEventListener('touchstart', e => {
		touchstartX = e.touches[0].clientX;
		$rightIntervalId = setInterval(function() {
			right();
		}, 40);
	});
	document.getElementById('ArrowRight').addEventListener('touchmove', e => {
		if (touchstartX - 50 > e.touches[0].clientX || touchstartX + 50 < e.touches[0].clientX) {
			clearInterval($rightIntervalId);
		}
	});
	document.getElementById('ArrowRight').addEventListener('touchend', e => {
			clearInterval($rightIntervalId);
	});
	document.getElementById('ArrowLeft').addEventListener('touchstart', e => {
		touchstartX = e.touches[0].clientX;
		$leftIntervalId = setInterval(function() {
			left();
		}, 40);
	});
	document.getElementById('ArrowLeft').addEventListener('touchmove', e => {
		if (touchstartX - 50 > e.touches[0].clientX || touchstartX + 50 < e.touches[0].clientX) {
			clearInterval($leftIntervalId);
		}
	});
	document.getElementById('ArrowLeft').addEventListener('touchend', e => {
		clearInterval($leftIntervalId);
	});
	document.getElementById('ArrowUp').addEventListener('touchstart', e => {
		touchstartY = e.touches[0].clientY;
		$upIntervalId = setInterval(function() {
			up();
		}, 40);
	});
	document.getElementById('ArrowUp').addEventListener('touchmove', e => {
		if (touchstartY - 50 > e.touches[0].clientY || touchstartY + 50 < e.touches[0].clientY) {
			clearInterval($upIntervalId);
		}
	});
	document.getElementById('ArrowUp').addEventListener('touchend', e => {
			clearInterval($upIntervalId);
	});
	document.getElementById('ArrowDown').addEventListener('touchstart', e => {
		touchstartY = e.touches[0].clientY;
		$downIntervalId = setInterval(function() {
			down();
		}, 40);
	});
	document.getElementById('ArrowDown').addEventListener('touchmove', e => {
		if (touchstartY - 50 > e.touches[0].clientY || touchstartY + 50 < e.touches[0].clientY) {
			clearInterval($downIntervalId);
		}
	});
	document.getElementById('ArrowDown').addEventListener('touchend', e => {
		clearInterval($downIntervalId);
	});
	document.getElementById('a').addEventListener('touchstart', e => {
		a();
	});
	document.getElementById('b').addEventListener('touchstart', e => {
		b();
	});

	//キーボード操作
	document.addEventListener('keydown', (event) => {
		if (event.key === 'ArrowRight') {
			right();
		}
		if (event.key === 'ArrowLeft') {
			left();
		}
		if (event.key === 'ArrowUp') {
			up();
		}
		if (event.key === 'ArrowDown') {
			down();
		}
		if (event.key === 'a') {
			a();
		}
		if (event.key === 'b') {
			b();
		}
	});
}
