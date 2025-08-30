document.addEventListener("DOMContentLoaded", () => {
  initQuizzes();
});

function initQuizzes() {
  document.querySelectorAll(".quiz").forEach(quiz => {
    const buttons = quiz.querySelectorAll(".quiz-answer");

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const isCorrect = btn.dataset.correct === "true";

        // glow effect
        btn.style.boxShadow = isCorrect
          ? "0 0 15px var(--color-success, #00ff00)"
          : "0 0 15px var(--color-error, #ff5555)";

        // spawn particles
        spawnParticles(btn, isCorrect);

        // disable buttons after click
        buttons.forEach(b => b.disabled = true);
      });
    });
  });
}

function spawnParticles(button, correct) {
  const num = 15;
  for (let i = 0; i < num; i++) {
    const particle = document.createElement("span");
    particle.className = "quiz-particle";
    particle.textContent = correct ? "❤️" : "🐶";
    particle.style.position = "absolute";
    particle.style.left = (button.offsetLeft + button.offsetWidth / 2) + "px";
    particle.style.top = (button.offsetTop + button.offsetHeight / 2) + "px";
    particle.style.fontSize = "16px";
    particle.style.pointerEvents = "none";
    document.body.appendChild(particle);

    const angle = Math.random() * 2 * Math.PI;
    const distance = 50 + Math.random() * 30;
    particle.animate([
      { transform: `translate(0,0)`, opacity: 1 },
      { transform: `translate(${Math.cos(angle)*distance}px, ${Math.sin(angle)*distance}px)`, opacity: 0 }
    ], { duration: 1000, easing: "ease-out" });

    setTimeout(() => particle.remove(), 1000);
  }
}

