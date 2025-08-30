window.addEventListener("load", function() {
  document.querySelectorAll(".quiz").forEach(quiz => {
    const buttons = quiz.querySelectorAll(".quiz-answer");

    buttons.forEach(btn => {
      btn.addEventListener("click", function() {
        const correct = btn.dataset.correct === "true";

        // Temporary glow effect
        btn.style.transition = "box-shadow 0.3s";
        btn.style.boxShadow = correct
          ? "0 0 30px var(--color-success, #00ff00)"
          : "0 0 30px var(--color-error, #ff5555)";
        setTimeout(() => btn.style.boxShadow = "", 500);

        // Spawn shower particles
        spawnShower(correct);
      });
    });
  });
});

// Full-screen falling particles (enhanced)
function spawnShower(correct) {
  const numParticles = 60; // more particles
  for (let i = 0; i < numParticles; i++) {
    const particle = document.createElement("span");
    particle.className = "quiz-particle";
    particle.textContent = correct ? "❤️" : "😢";

    // Random horizontal position
    particle.style.position = "fixed";
    particle.style.left = Math.random() * window.innerWidth + "px";

    // Start above viewport
    particle.style.top = "-50px";

    // Random size
    const size = 30 + Math.random() * 40; // bigger
    particle.style.fontSize = size + "px";

    particle.style.pointerEvents = "none";
    particle.style.userSelect = "none";
    particle.style.zIndex = 9999;

    document.body.appendChild(particle);

    // Random fall distance and rotation
    const fallDistance = window.innerHeight + 200 + Math.random() * 200;
    const rotate = Math.random() * 720 - 360; // can rotate both ways
    const duration = 2000 + Math.random() * 1500;

    particle.animate([
      { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
      { transform: `translateY(${fallDistance}px) rotate(${rotate}deg)`, opacity: 0 }
    ], {
      duration: duration,
      easing: "ease-in"
    });

    setTimeout(() => particle.remove(), duration + 100);
  }
}
