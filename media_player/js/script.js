{
  const videoWrapper = document.querySelector('.video-wrapper');
  const video = document.querySelector('video');
  const playProgress = document.querySelector('.video__progress-bar');
  const fakePlayProgress = document.querySelector('.video__progress-bar.fake');
  const playPauseButton = document.querySelector('.video__play-pause');
  const fastRewindButton = document.querySelector('.video__fast-rewind');
  const fastForwardButton = document.querySelector('.video__fast-forward');
  const skipValue = 2;
  const stopButton = document.querySelector('.video__stop');
  const videoTimeDisplay = document.querySelector('.video__time');
  const muteButton = document.querySelector('.video__mute');
  const volumeController = document.querySelector('.video__volume');
  let volume;
  const fullscreenButton = document.querySelector('.video__fullscreen');
  let isFullscreen = false;


  /**
   * Jumps to a particular spot in the video when progress bar is clicked
   * @param {DOMEvent} param0 
   */
  const seekVideoTimeOnClick = ({ offsetX }) => {
    video.currentTime = offsetX / fakePlayProgress.offsetWidth * video.duration;
  };

  /**
   * Sets the video volume using the range input value
   */
  const setVolume = () => {
    volume = volumeController.value / 10;
    video.volume = volume;
  };

  /**
   * Sets the appropriate icon on the mute button
   */
  const toggleMuteButtonIcon = () => {
    if (volume === 0) muteButton.classList.add('volume--off');
    else if (volume <= 0.5) muteButton.classList.add('volume--low');
    else muteButton.classList.add('volume--high');
  }

  /**
   * Clears icon manipulating classes of the mute button
   */
  const clearMuteButtonIconAlteringClasses = () => muteButton.classList
    .remove('volume--low', 'volume--high', 'volume--off');
  
  /**
   * Displays a pause icon on the play-pause button
   */
  const showPauseImage = element => {
    playPauseButton.classList.remove('video__play');
    playPauseButton.classList.add('video__pause');
  };

  /**
   * Displays a play icon on the play-pause button
   */
  const showPlayImage = () => {
    playPauseButton.classList.remove('video__pause');
    playPauseButton.classList.add('video__play');
  };

  /**
   * Plays or pauses the video
   * Sets the play button background accordingly
   */
  const playOrPauseVideo = () => {
    if (video.paused || video.ended) {
      // Play video
      video.play();
      // Alter target's class to display a Pause image as background
      showPauseImage();
    }
    else {
      // Pause video
      video.pause();
      // Alter target's class to display a play image as background
      showPlayImage();
    }
  };

  /**
   * Formats a number to be display appropritely in the video time
   * @param {Number} number
   * 
   * @returns {String|Number}
   */
  const formatNumberInTime = number => number < 10 ? '0' + number : number;

  /**
   * Updates the video time display and the play progress bar
   */
  const updateVideoTime = () => {
    const currentTime = video.currentTime;
    // In minute
    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.round(currentTime % 60);
    // Display current time
    videoTimeDisplay.textContent = `${formatNumberInTime(minutes)}:${
      formatNumberInTime(seconds)}`;

    // Set play progress bar width
    playProgress.style.width = `${currentTime / video.duration * 100}%`;
  }

  
  fakePlayProgress.addEventListener('click', seekVideoTimeOnClick);
  playProgress.addEventListener('click', seekVideoTimeOnClick);
  playPauseButton.addEventListener('click', playOrPauseVideo);
  video.addEventListener('ended', showPlayImage);
  video.addEventListener('timeupdate', updateVideoTime);
  
  // Implement the fast rewind functionality
  fastRewindButton.addEventListener('click', () => {
    const currentTime = video.currentTime;
    // If video has started and has not ended
    if (currentTime > 0 && !video.ended) currentTime - skipValue > 0 ? video.currentTime -= skipValue : video.currentTime = 0;
  });

  // Implement the fast forward functionality
  fastForwardButton.addEventListener('click', () => {
    const currentTime = video.currentTime;
    const duration = video.duration;
    if (currentTime < duration) currentTime + skipValue < duration ? video.currentTime += skipValue : video.currentTime = duration;
  });

  // Implement the stop functionality
  stopButton.addEventListener('click', () => video.currentTime = video.duration);

  // Implement the mute functionality
  muteButton.addEventListener('click', () => {
    setVolume()
    // If the volume is at zero return
    if (volume === 0) return;
    video.muted = !video.muted;
    clearMuteButtonIconAlteringClasses();
    if (video.muted) muteButton.classList.add('volume--off');
    else toggleMuteButtonIcon();
  });

  // Implement volume control
  volumeController.addEventListener('change', () => {
    setVolume();
    clearMuteButtonIconAlteringClasses();
    toggleMuteButtonIcon();
  });

  // Implement fullscreen functionality
  fullscreenButton.addEventListener('click', ({ target }) => {
    target.classList.remove('fullscreen--on', 'fullscreen--off');
    isFullscreen = !isFullscreen;
    if (isFullscreen) {
      videoWrapper.style.width = '100vw';
      videoWrapper.style.height = '100vh';
      target.classList.add('fullscreen--on');
    } else {
      videoWrapper.style.width = '60%';
      videoWrapper.style.height = 'unset';
      target.classList.add('fullscreen--off');
    }
  });


  // Set play progress width to '0px'
  playProgress.style.width = '0px';
  // Initialize video volume
  setVolume();
}
