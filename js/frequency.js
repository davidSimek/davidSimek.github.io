window.addEventListener("load", function() {
  document.querySelectorAll(".frequency-canvas").forEach(canvas => {
    try {
      const ctx = canvas.getContext("2d");
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;

      let freqs = canvas.dataset.freqs.split(',')
        .map(f => parseFloat(f.trim()))
        .filter(f => !isNaN(f));
      let result = parseFloat(canvas.dataset.result);

      if(freqs.length === 0) return;

      const maxAmplitude = height / 4;
      const centerY = height / 2;
      const timeWindow = 1; // seconds

      // Default color palette
      const defaultColors = ["#FF6666","#66CC66","#6699FF","#FFCC66","#FF66CC","#66FFFF","#CC66FF","#FF9966"];

      // Count frequency occurrences
      const freqCounts = {};
      freqs.forEach(f => {
        freqCounts[f] = (freqCounts[f] || 0) + 1;
      });

      // Unique frequencies for drawing & legend
      const uniqueFreqs = Object.keys(freqCounts).map(f => parseFloat(f));
      const colors = uniqueFreqs.map((_, i) => defaultColors[i % defaultColors.length]);

      // Compute normalization factor so amplitude doesn't exceed maxAmplitude
      const maxCount = Math.max(...Object.values(freqCounts));
      const scaleFactor = maxAmplitude / maxCount;

      // Draw individual sinusoids
      uniqueFreqs.forEach((freq, i) => {
        ctx.beginPath();
        ctx.strokeStyle = colors[i];
        ctx.lineWidth = (freq === result) ? 4 : 2;

        const amplitude = scaleFactor * freqCounts[freq];

        for(let x = 0; x <= width; x++) {
          const t = (x / width) * timeWindow;
          const y = centerY - Math.sin(2 * Math.PI * freq * t) * amplitude;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      // Summed waveform
      let ySumArray = [];
      for(let x = 0; x <= width; x++) {
        const t = (x / width) * timeWindow;
        let ySum = 0;
        freqs.forEach(freq => {
          const amplitude = scaleFactor; // each occurrence contributes scaleFactor
          ySum += Math.sin(2 * Math.PI * freq * t) * amplitude;
        });
        ySumArray.push(centerY - ySum);
      }

      // Draw black border of sum
      ctx.beginPath();
      ctx.lineWidth = 7;
      ctx.strokeStyle = "#000000";
      ySumArray.forEach((y, x) => x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
      ctx.stroke();

      // Draw white sum line
      ctx.beginPath();
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#FFFFFF";
      ySumArray.forEach((y, x) => x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
      ctx.stroke();

      // Responsive timeline font
      const fontSize = Math.max(10, width / 40); // scales with canvas width
      ctx.font = `${fontSize}px sans-serif`;
      ctx.strokeStyle = "#888888";
      ctx.lineWidth = 1;
      ctx.fillStyle = "#888888";

      const parts = width < 300 ? 2 : 4; // fewer ticks on narrow screens
      for(let i = 0; i <= parts; i++) {
        const x = (i / parts) * width;
        ctx.beginPath();
        ctx.moveTo(x, height - 5);
        ctx.lineTo(x, height);
        ctx.stroke();
        const timeLabel = ((i / parts) * timeWindow).toFixed(2) + "s";
        ctx.fillText(timeLabel, x + 2, height - 7);
      }

      // Draw legend (unique frequencies only)
      const legendDiv = document.getElementById(canvas.id + "-legend");
      if(legendDiv) {
        legendDiv.innerHTML = "";

        uniqueFreqs.forEach((freq, i) => {
          const span = document.createElement("span");
          span.style.display = "inline-block";
          span.style.marginRight = "10px";
          span.style.color = colors[i];
          span.style.fontWeight = "bold";
          span.style.fontSize = `${Math.max(12, width / 50)}px`; // responsive
          span.style.textShadow = "1px 1px 1px rgba(0,0,0,0.3)"; // subtle shadow
          span.textContent = freq + " Hz";
          legendDiv.appendChild(span);
        });

        const sumSpan = document.createElement("span");
        sumSpan.style.display = "inline-block";
        sumSpan.style.marginLeft = "10px";
        sumSpan.style.color = "#FFFFFF";
        sumSpan.style.textShadow = "0 0 1px #000000";
        sumSpan.style.fontWeight = "bold";
        sumSpan.style.fontSize = `${Math.max(12, width / 50)}px`;
        sumSpan.textContent = "sum";
        legendDiv.appendChild(sumSpan);
      }

    } catch(e) {
      console.error("Frequency canvas drawing failed", e);
    }
  });
});

