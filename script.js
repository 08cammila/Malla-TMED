
document.querySelectorAll(".ramo").forEach(ramo => {
  if (ramo.dataset.prer !== "none" && !localStorage.getItem("ramo_" + ramo.dataset.id)) {
    ramo.classList.add("bloqueado");
  }

  ramo.addEventListener("click", () => {
    if (!ramo.classList.contains("aprobado")) {
      ramo.classList.add("aprobado");
      localStorage.setItem("ramo_" + ramo.dataset.id, "aprobado");

      document.querySelectorAll(".ramo").forEach(r => {
        if (r.classList.contains("bloqueado")) {
          const prereq = r.dataset.prer;
          if (prereq && localStorage.getItem("ramo_" + prereq) === "aprobado") {
            r.classList.remove("bloqueado");
          }
        }
      });
    }
  });
});

function resetMalla() {
  localStorage.clear();
  location.reload();
}
