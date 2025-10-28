// Type videos
let alphabet = `abcdefghijklmnopqrstuvwxyz0123456789!>?;`.split('');
let content = document.querySelector('.content');
let cursor = document.querySelector('#cursor');
let index = 0;
let isMuted = true;
const MAX_PLAYING_VIDEOS = 3;

// Default text
let defaultText = "That which withers in the age of mechanical reproduction is the aura of the work of art.";

// Manage which videos should have sound (only the last 3)
function updateVideoSound() {
	const videos = Array.from(document.getElementsByTagName("video"));
	
	// Sort by index (newest first)
	videos.sort((a, b) => parseInt(b.dataset.index) - parseInt(a.dataset.index));
	
	// Mute all videos
	videos.forEach(video => {
		video.muted = true;
	});
	
	// Unmute the last 3 videos (but respect global mute state)
	for (let i = 0; i < Math.min(MAX_PLAYING_VIDEOS, videos.length); i++) {
		videos[i].muted = isMuted;
	}
}

// Initialize with default text
function initDefaultText() {
	index = 0;
	for (let char of defaultText) {
		if (char === ' ') {
			let space = document.createElement('div');
			space.dataset.index = index;
			index++;
			content.insertBefore(space, cursor);
		} else if (char === '\n') {
			let lineBreak = document.createElement('div');
			lineBreak.dataset.index = index;
			lineBreak.classList.add('line-break');
			index++;
			content.insertBefore(lineBreak, cursor);
		} else if (alphabet.includes(char.toLowerCase())) {
			let video = document.createElement('video');
			video.autoplay = true;
			video.loop = true;
			video.muted = true; // Will be updated by updateVideoSound
			video.setAttribute('playsinline', '');
			video.dataset.index = index;
			index++;
			video.src = `videos/${char.toLowerCase()}.mp4`;
			content.insertBefore(video, cursor);
			
			// Play video and update sound state
			video.play().catch(e => {
				// Handle play promise rejection
				console.error('Video play failed:', e);
			});
			
			video.addEventListener('loadeddata', () => {
				updateVideoSound();
			});
		}
	}
	content.scrollTop = content.scrollHeight;
}

document.addEventListener('keydown', (e) => {
	if (alphabet.includes(e.key.toLowerCase())) {
		let video = document.createElement('video');
		video.autoplay = true;
		video.loop = true;
		video.muted = true; // Will be updated by updateVideoSound
		video.setAttribute('playsinline', '');
		video.dataset.index = index;
		index++;
		video.src = `videos/${e.key.toLowerCase()}.mp4`;
		content.insertBefore(video, cursor);
		content.scrollTop = content.scrollHeight;
		
		// Play video and update sound state
		video.play().catch(e => {
			// Handle play promise rejection
			console.error('Video play failed:', e);
		});
		
		video.addEventListener('loadeddata', () => {
			updateVideoSound();
		});
	} else if (e.key == " ") {
		e.preventDefault();
		let space = document.createElement('div');
		space.dataset.index = index;
		index++;
		content.insertBefore(space, cursor);
		content.scrollTop = content.scrollHeight;
	} else if (e.key == "Enter") {
		e.preventDefault();
		let lineBreak = document.createElement('div');
		lineBreak.dataset.index = index;
		lineBreak.classList.add('line-break');
		index++;
		content.insertBefore(lineBreak, cursor);
		content.scrollTop = content.scrollHeight;
	} else if (e.key == "Backspace" && index > 0) {
		index--;
		let target = content.querySelector(`[data-index="${index}"`);
		content.removeChild(target);
		content.scrollTop = content.scrollHeight;
	} else if (e.key == "-" || e.key == "_") {
		sizeDown();
	} else if (e.key == "+" || e.key == "=") {
		sizeUp();
	} else if (e.key == "Escape") {
		empty();
	}
});

// Make sure videos autoplay
for (video of document.getElementsByTagName("video")) {
	video.setAttribute("playsinline", "");
	video.setAttribute("muted", "");
	video.play();
}

// Mute toggle functionality
function toggleMute() {
	isMuted = !isMuted;
	const button = document.getElementById('muteButton');
	
	// Update which videos should have sound
	updateVideoSound();
	
	button.classList.toggle('muted', isMuted);
	
	// Update button text
	if (isMuted) {
		button.textContent = 'Sound on';
	} else {
		button.textContent = 'Sound off';
	}
}

// Font size
let size = 2;
let sizes = [2, 3, 5, 8, 10, 12, 16, 20];
let root = document.querySelector(':root');
function sizeUp() {
	if (size < sizes.length-1) {
		size += 1;
		root.style.setProperty('--size', sizes[size] + "%");
		sizeSlider.value = size;
	}
}
function sizeDown() {
	if (size > 0) {
		size -= 1;
		root.style.setProperty('--size', sizes[size] + "%");
		sizeSlider.value = size;
	}
}

// Connect slider to size control
const sizeSlider = document.getElementById('sizeSlider');
sizeSlider.addEventListener('input', (e) => {
	size = parseInt(e.target.value);
	root.style.setProperty('--size', sizes[size] + "%");
});

// Clear text
function empty() {
	index = 0;
	const videos = content.querySelectorAll('video');
	
	// Stop all videos before removing
	for (let video of videos) {
		video.pause();
		video.src = '';
		video.load();
	}
	
	// Remove all elements with data-index
	for (let letter of content.querySelectorAll('[data-index]')) {
		letter.remove();
	}
}

// Add this JavaScript for the modal
function openModal() {
	document.getElementById('myModal').style.display = 'block';
  }
  
  function closeModal() {
	document.getElementById('myModal').style.display = 'none';
  }
  
  // Close the modal if the user clicks outside of it
  window.onclick = function (event) {
	var modal = document.getElementById('myModal');
	if (event.target == modal) {
	  closeModal();
	}
  };

// Initialize with default text when page loads
window.addEventListener('load', () => {
	initDefaultText();
	// Set mute button to initial muted state
	const muteButton = document.getElementById('muteButton');
	muteButton.classList.add('muted');
	muteButton.textContent = 'Sound on';
});
  