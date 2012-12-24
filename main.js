/*global Modernizr  */

var moveSound = new Audio();
moveSound.src = Modernizr.audio.ogg ? 'move.ogg' : 'move.mp3';

var finishSound = new Audio();
finishSound.src = Modernizr.audio.ogg ? 'finish.ogg' : 'finish.mp3';

var winSound = new Audio();
winSound.src = Modernizr.audio.ogg ? 'win.ogg' : 'win.mp3';

var hmmSound = new Audio();
hmmSound.src = Modernizr.audio.ogg ? 'hmm.ogg' : 'hmm.mp3';

var currentPlayer = 'X';
var moveCount = 0;
var backgroundColor = 'red';
var winner = false;
var numPlayers = 2;
var topLeft;
var topCenter;
var topRight;
var middleLeft;
var middleCenter;
var middleRight;
var bottomLeft;
var bottomCenter;
var bottomRight;
var computerTurnCount = 0;

$(function() {
	$('#reset').click(function() {
		moveCount = 0;
		$('.move').css({
			'-webkit-transform': '',
			'-moz-transform': '',
			'-o-transform': '',
			'-ms-transform': '',
			'transform': ''
		}).text('');

		if (backgroundColor === 'red') {
			backgroundColor = 'green';
		}
		else {
			backgroundColor = 'red';
		}
		$('body').css({
			'background-image': 'url(' + backgroundColor + 'Background.jpg)'
		});
		winner = false;
	});

	$('.cell').click(function(element) {
		if (winner) {
			return;
		}

		var move;
		if ($(element.target).hasClass('cell')) {
			move = $(element.target).find('.move');
		}
		else {
			move = $(element.target);
		}

		makeMove(move);

		if (numPlayers === 1) {
			if (computerTurnCount % 4 === 2) {
				setTimeout(function () {
					hmmSound.play();
				}, 800);
				setTimeout(function () {
					if (!winner) {
						computerTakeTurn();
					}
				}, 2000);
			}
			else {
				setTimeout(function () {
					if (!winner) {
						computerTakeTurn();
					}
				}, 800);
			}
		}
	});

	$('.onePlayer').click(function() {
		numPlayers = 1;
		$('.twoPlayer').removeClass('active');
		$('.onePlayer').addClass('active');
	});

	$('.twoPlayer').click(function() {
		numPlayers = 2;
		$('.onePlayer').removeClass('active');
		$('.twoPlayer').addClass('active');
	});

	topLeft = $('.top.left');
	topCenter = $('.top.center');
	topRight = $('.top.right');
	middleLeft = $('.middle.left');
	middleCenter = $('.middle.center');
	middleRight = $('.middle.right');
	bottomLeft = $('.bottom.left');
	bottomCenter = $('.bottom.center');
	bottomRight = $('.bottom.right');

	// Start background animation
	$('body').css({
		'background-position': '0px 380px'
	});
});

function makeMove(place) {
	place.text(currentPlayer);

	var color;
	if (currentPlayer === 'X') {
		color = '#36DD00';
	}
	else {
		color = 'red';
	}
	moveSound.play();
	place.css({
		'-webkit-transform': 'none',
		'-moz-transform': 'none',
		'-o-transform': 'none',
		'-ms-transform': 'none',
		'transform': 'none',
		'color': color
	});

	if (currentPlayer === 'X') {
		currentPlayer = 'O';
	}
	else {
		currentPlayer = 'X';
	}

	moveCount++;
	if (moveCount === 9) {
		finishSound.play();
	}

	if (someoneWon()) {
		finishSound.play();
		winSound.play();
		winner = true;
	}
}

function domToMatrix() {
	var matrix = [[],[],[]];
	matrix[0][0] = topLeft.text().trim();
	matrix[0][1] = topCenter.text().trim();
	matrix[0][2] = topRight.text().trim();
	matrix[1][0] = middleLeft.text().trim();
	matrix[1][1] = middleCenter.text().trim();
	matrix[1][2] = middleRight.text().trim();
	matrix[2][0] = bottomLeft.text().trim();
	matrix[2][1] = bottomCenter.text().trim();
	matrix[2][2] = bottomRight.text().trim();

	return matrix;
}

function checkForWinBy(letter, matrix) {
	if (matrix[0][1] === letter) {
		if (matrix[0][0] === letter && matrix[0][2] === letter) {
			return true;
		}
		if (matrix[1][1] === letter && matrix[2][1] === letter) {
			return true;
		}
	}

	if (matrix[1][0] === letter) {
		if (matrix[0][0] === letter && matrix[2][0] === letter) {
			return true;
		}
		if (matrix[1][1] === letter && matrix[1][2] === letter) {
			return true;
		}
	}

	if (matrix[2][1] === letter) {
		if (matrix[2][0] === letter && matrix[2][2] === letter) {
			return true;
		}
		if (matrix[1][1] === letter && matrix[0][1] === letter) {
			return true;
		}
	}

	if (matrix[1][2] === letter) {
		if (matrix[0][2] === letter && matrix[2][2] === letter) {
			return true;
		}
		if (matrix[1][1] === letter && matrix[1][0] === letter) {
			return true;
		}
	}

	if (matrix[1][1] === letter) {
		if (matrix[0][0] === letter && matrix[2][2] === letter) {
			return true;
		}
		if (matrix[2][0] === letter && matrix[0][2] === letter) {
			return true;
		}
	}
	return false;
}

function someoneWon() {
	var matrix = domToMatrix();
	if (checkForWinBy('X', matrix) || checkForWinBy('O', matrix)) {
		return true;
	}

	return false;
}

// Not necessarily the smartest AI.  :)
function findMoveFor(letter, m) {
	// The center is usually helpful, get it if is available
	if (m[1][1].length === 0) {
		return [1,1];
	}

	// Maybe a corner will help...
	if (m[0][0] === letter) {
		if (m[1][0].length === 0) {
			return [1,0];
		}
		if (m[0][1].length === 0) {
			return [0,1];
		}
	}
	else if (m[0][0].length === 0) {
		return [0,0];
	}
	if (m[0][2] === letter) {
		if (m[1][2].length === 0) {
			return [1,2];
		}
		if (m[0][1].length === 0) {
			return [0,1];
		}
	}
	else if (m[0][2].length === 0) {
		return [0,2];
	}
	if (m[2][0] === letter) {
		if (m[1][0].length === 0) {
			return [1,0];
		}
		if (m[2][1].length === 0) {
			return [2,1];
		}
	}
	else if (m[2][0].length === 0) {
		return [2,0];
	}
	if (m[2][2] === letter) {
		if (m[1][2].length === 0) {
			return [1,2];
		}
		if (m[2][1].length === 0) {
			return [2,1];
		}
	}
	else if (m[2][2].length === 0) {
		return [2,2];
	}

	// Who cares.  Take what we can find.
	if (m[0][1].length === 0) {
		return [0,1];
	}
	if (m[1][0].length === 0) {
		return [1,0];
	}
	if (m[1][2].length === 0) {
		return [1,2];
	}
	if (m[2][1].length === 0) {
		return [2,1];
	}
}

function computerTakeTurn() {
	var matrix = domToMatrix();
	var result = findMoveFor(currentPlayer, matrix);
	var requestedSpot = matrixToDom(result);
	makeMove(requestedSpot.find('.move'));
	computerTurnCount++;
}

function matrixToDom(requestedMove) {
	if (requestedMove[0] === 0) {
		if (requestedMove[1] === 0) {
			return topLeft;
		}
		else if (requestedMove[1] === 1) {
			return topCenter;
		}
		else {
			return topRight;
		}
	}
	else if (requestedMove[0] === 1) {
		if (requestedMove[1] === 0) {
			return middleLeft;
		}
		else if (requestedMove[1] === 1) {
			return middleCenter;
		}
		else {
			return middleRight;
		}
	}
	else {
		if (requestedMove[1] === 0) {
			return bottomLeft;
		}
		else if (requestedMove[1] === 1) {
			return bottomCenter;
		}
		else {
			return bottomRight;
		}
	}
}