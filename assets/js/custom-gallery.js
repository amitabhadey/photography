(function () {
  var main = document.getElementById("main");

  if (!main) return;

  function getGridValue(name, fallback) {
    var style = window.getComputedStyle(main);
    var value = parseFloat(style.getPropertyValue(name));
    return Number.isFinite(value) && value > 0 ? value : fallback;
  }

  function promoteWideCards() {
    var cards = main.querySelectorAll(".thumb");

    cards.forEach(function (card) {
      var img = card.querySelector(".image > img");
      if (!img) return;

      card.classList.remove("is-wide");

      var naturalWidth = img.naturalWidth || 0;
      var naturalHeight = img.naturalHeight || 0;
      if (!naturalWidth || !naturalHeight) return;

      var ratio = naturalHeight / naturalWidth;
      if (window.innerWidth > 1100 && ratio < 0.72) {
        card.classList.add("is-wide");
      }
    });
  }

  function updateMasonryLayout() {
    var rowHeight = getGridValue("grid-auto-rows", 8);
    var gap = getGridValue("gap", 8);

    var cards = main.querySelectorAll(".thumb");

    cards.forEach(function (card) {
      var image = card.querySelector(".image");
      var img = card.querySelector(".image > img");
      if (!image) return;

      if (img) {
        image.style.backgroundImage = "none";
        img.style.display = "block";
      }

      var rect = image.getBoundingClientRect();
      var height = rect.height;
      if (!height || height <= 0) return;

      var span = Math.max(1, Math.ceil((height + gap) / (rowHeight + gap)));

      card.style.gridRowEnd = "span " + span;
    });
  }

  function scheduleMasonryUpdate() {
    window.requestAnimationFrame(function () {
      promoteWideCards();
      window.requestAnimationFrame(updateMasonryLayout);
    });
  }

  window.addEventListener("load", scheduleMasonryUpdate);
  window.addEventListener("resize", scheduleMasonryUpdate);
  document.addEventListener("DOMContentLoaded", scheduleMasonryUpdate);

  document.querySelectorAll("#main .thumb .image img").forEach(function (img) {
    if (!img.complete) {
      img.addEventListener("load", scheduleMasonryUpdate, { once: true });
    } else {
      scheduleMasonryUpdate();
    }
  });

  if (typeof ResizeObserver !== "undefined") {
    var resizeObserver = new ResizeObserver(scheduleMasonryUpdate);
    resizeObserver.observe(main);
  }

  setTimeout(scheduleMasonryUpdate, 300);
  setTimeout(scheduleMasonryUpdate, 900);
})();
