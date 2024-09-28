document.addEventListener('DOMContentLoaded', function () {
    // Select all video containers
    const videoContainers = document.querySelectorAll('.video-container');

    // Loop through each video container to handle its specific video
    videoContainers.forEach((container, index) => {
        const video = container.querySelector(`#video-${index + 1}`); // Select the video based on its unique ID

        // Ensure the video element exists before proceeding
        if (video) {
            // Elements within the video container
            const playPauseBtn = container.querySelector('.play-pause-btn');
            const seekBar = container.querySelector('.seek-bar');
            const volumeBar = container.querySelector('.volume-bar');
            const muteBtn = container.querySelector('.mute-btn');
            const fullscreenBtn = container.querySelector('.fullscreen-btn');
            const speedBtn = container.querySelector('.speed-btn');
            const captionsBtn = container.querySelector('.captions-btn');
            const pipBtn = container.querySelector('.pip-btn');
            const currentTimeDisplay = container.querySelector('.current-time');
            const durationDisplay = container.querySelector('.duration');
            const bufferBar = container.querySelector('.buffer-bar');
            const loadingIndicator = container.querySelector('.loading-indicator');

            let isDraggingSeekBar = false; // To handle seek bar dragging

            // Initialize video settings
            video.volume = 1; // Set default volume to 100%
            video.currentTime = 0; // Start from the beginning

            // Function to handle play and pause
            function togglePlayPause() {
                if (video.paused) {
                    video.play();
                    playPauseBtn.textContent = 'Pause';
                } else {
                    video.pause();
                    playPauseBtn.textContent = 'Play';
                }
            }

            // Play/Pause button event listener
            if (playPauseBtn) {
                playPauseBtn.addEventListener('click', togglePlayPause);
            }

            // Update seek bar and current time display as video plays
            video.addEventListener('timeupdate', () => {
                if (!isDraggingSeekBar) {
                    const progress = (video.currentTime / video.duration) * 100;
                    if (seekBar) {
                        seekBar.value = progress;
                    }
                    if (currentTimeDisplay) {
                        currentTimeDisplay.textContent = formatTime(video.currentTime);
                    }
                }
            });

            // Seek video when dragging the seek bar
            if (seekBar) {
                seekBar.addEventListener('input', () => {
                    const seekTime = (seekBar.value / 100) * video.duration;
                    video.currentTime = seekTime;
                    if (currentTimeDisplay) {
                        currentTimeDisplay.textContent = formatTime(video.currentTime);
                    }
                });

                seekBar.addEventListener('mousedown', () => {
                    isDraggingSeekBar = true;
                });

                seekBar.addEventListener('mouseup', () => {
                    isDraggingSeekBar = false;
                });
            }

            // Volume control
            if (volumeBar) {
                volumeBar.addEventListener('input', () => {
                    video.volume = volumeBar.value;
                    if (video.volume === 0) {
                        muteBtn.textContent = 'Unmute';
                    } else {
                        muteBtn.textContent = 'Mute';
                    }
                });
            }

            // Mute/Unmute button
            if (muteBtn) {
                muteBtn.addEventListener('click', () => {
                    video.muted = !video.muted;
                    muteBtn.textContent = video.muted ? 'Unmute' : 'Mute';
                });
            }

            // Fullscreen toggle
            if (fullscreenBtn) {
                fullscreenBtn.addEventListener('click', () => {
                    if (!document.fullscreenElement) {
                        container.requestFullscreen().catch(err => {
                            console.error(`Error attempting to enable fullscreen mode: ${err.message}`);
                        });
                    } else {
                        document.exitFullscreen();
                    }
                });
            }

            // Playback speed control
            if (speedBtn) {
                speedBtn.addEventListener('click', () => {
                    if (video.playbackRate < 2.0) {
                        video.playbackRate += 0.25;
                    } else {
                        video.playbackRate = 0.5;
                    }
                    speedBtn.textContent = `Speed: ${video.playbackRate}x`;
                });
            }

            // Captions toggle
            if (captionsBtn) {
                captionsBtn.addEventListener('click', () => {
                    const track = video.textTracks[0];
                    if (track) {
                        track.mode = (track.mode === 'showing') ? 'hidden' : 'showing';
                        captionsBtn.textContent = (track.mode === 'showing') ? 'Disable Captions' : 'Enable Captions';
                    }
                });
            }

            // Picture-in-Picture mode
            if (pipBtn) {
                pipBtn.addEventListener('click', () => {
                    if (document.pictureInPictureElement) {
                        document.exitPictureInPicture();
                    } else {
                        video.requestPictureInPicture().catch(err => {
                            console.error(`Error: ${err.message}`);
                        });
                    }
                });
            }

            // Update buffer bar
            video.addEventListener('progress', () => {
                if (bufferBar) {
                    const buffered = video.buffered;
                    if (buffered.length > 0) {
                        const bufferPercent = (buffered.end(buffered.length - 1) / video.duration) * 100;
                        bufferBar.style.width = `${bufferPercent}%`;
                    }
                }
            });

            // Show loading indicator
            video.addEventListener('waiting', () => {
                if (loadingIndicator) {
                    loadingIndicator.style.display = 'block';
                }
            });

            video.addEventListener('playing', () => {
                if (loadingIndicator) {
                    loadingIndicator.style.display = 'none';
                }
            });

            // Display total duration when metadata is loaded
            video.addEventListener('loadedmetadata', () => {
                if (durationDisplay) {
                    durationDisplay.textContent = formatTime(video.duration);
                }
            });

            // Handle video end
            video.addEventListener('ended', () => {
                if (playPauseBtn) {
                    playPauseBtn.textContent = 'Play';
                }
                video.currentTime = 0; // Reset video to start
                if (currentTimeDisplay) {
                    currentTimeDisplay.textContent = formatTime(0);
                }
            });

            // Ensure volume bar reflects current volume when loaded
            video.addEventListener('loadeddata', () => {
                if (volumeBar) {
                    volumeBar.value = video.volume;
                }
            });

            // Error handling for video playback
            video.addEventListener('error', (event) => {
                console.error(`Error occurred: ${event.target.error.message}`);
                alert('An error occurred while trying to play the video. Please try again.');
            });

            // Helper function to format time in mm:ss
            function formatTime(seconds) {
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = Math.floor(seconds % 60);
                return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
            }

            // Additional Features (Optional):
            // Slow motion effect
            const slowMotionBtn = document.createElement('button');
            slowMotionBtn.textContent = 'Slow Motion';
            container.appendChild(slowMotionBtn);

            slowMotionBtn.addEventListener('click', () => {
                if (video.playbackRate > 0.5) {
                    video.playbackRate = 0.5;
                    slowMotionBtn.textContent = 'Normal Speed';
                } else {
                    video.playbackRate = 1.0;
                    slowMotionBtn.textContent = 'Slow Motion';
                }
            });

            // Progress indicator on hover (optional)
            const progressIndicator = document.createElement('div');
            progressIndicator.className = 'progress-indicator';
            container.appendChild(progressIndicator);
            progressIndicator.style.position = 'absolute';
            progressIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            progressIndicator.style.color = 'white';
            progressIndicator.style.padding = '5px';
            progressIndicator.style.borderRadius = '5px';
            progressIndicator.style.display = 'none';

            container.addEventListener('mousemove', (event) => {
                const rect = video.getBoundingClientRect();
                const x = event.clientX - rect.left; // Get x position relative to the video
                const percentage = (x / rect.width) * 100; // Calculate percentage
                const time = (percentage / 100) * video.duration; // Calculate time in seconds
                progressIndicator.textContent = formatTime(time);
                progressIndicator.style.left = `${event.clientX - rect.left}px`;
                progressIndicator.style.display = 'block';
            });

            container.addEventListener('mouseleave', () => {
                progressIndicator.style.display = 'none';
            });

            // Buffer bar styling (optional)
            if (bufferBar) {
                bufferBar.style.height = '5px';
                bufferBar.style.backgroundColor = 'lightgrey';
                bufferBar.style.position = 'absolute';
                bufferBar.style.bottom = '30px';
                bufferBar.style.left = '0';
                bufferBar.style.width = '0%';
                bufferBar.style.transition = 'width 0.1s';
            }
        }
    });
});
