window.addEventListener("load", function () {
  document.querySelectorAll(".rhythm-canvas-wrapper").forEach(wrapper => {
    try {
      const canvas = wrapper.querySelector(".rhythm-canvas");
      const ctx = canvas.getContext("2d");
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;

      const timestamps = canvas.dataset.timestamps
        .split(",")
        .map(t => parseFloat(t.trim()))
        .filter(t => !isNaN(t));

      if (timestamps.length === 0) return;

      const audio = wrapper.querySelector("audio");
      const playBtn = wrapper.querySelector(".rhythm-play-btn");

      const margin = 20;

      function draw(currentTime) {
        ctx.clearRect(0, 0, width, height);

        // Timeline line
        ctx.beginPath();
        ctx.moveTo(margin, height / 2);
        ctx.lineTo(width - margin, height / 2);
        ctx.strokeStyle = "#aaa";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw rhythm markers
        timestamps.forEach(ts => {
          const x = margin + (ts / audio.duration) * (width - 2 * margin);
          const isActive = Math.abs(currentTime - ts) < 0.15;

          ctx.beginPath();
          ctx.arc(x, height / 2, isActive ? 12 : 6, 0, 2 * Math.PI);
          ctx.fillStyle = isActive ? "#FF3366" : "#666";
          ctx.fill();
        });
      }

      function animate() {
        if (!isNaN(audio.duration) && !audio.paused) {
          draw(audio.currentTime);
        }
        requestAnimationFrame(animate);
      }


      draw();
        
      // Start the animation loop
      animate();
       

      // Play/pause button controls the hidden audio
      playBtn.addEventListener("click", () => {
        if (audio.paused) {
          audio.play();
          playBtn.textContent = "⏸ Pause";
        } else {
          audio.pause();
          playBtn.textContent = "▶ Play";
        }
      });

      audio.addEventListener("ended", () => {
        playBtn.textContent = "▶ Play";
      });

    } catch (e) {
      console.error("Rhythm canvas failed", e);
    }
  });
});
