document.addEventListener("DOMContentLoaded", () => {
  lastLevel = localStorage.getItem("ocd-relief-js13k--last-level");
  if (!lastLevel) {
    lastLevel = "0";
  }
  lastLevel = parseInt(lastLevel);

  scope.startGame(lastLevel);
});

let timeout = null;
window.onresize = () => {
  if (timeout == null) {
    timeout = setTimeout(() => {
      window.location.reload();
    }, 500);
  }
};
