(function () {
  var track = document.getElementById('heroTrack');
  var dotsBox = document.getElementById('heroDots');
  var hero = track.parentNode;
  var total = track.children.length;
  var current = 0;
  var timer;
  var startX = null;
  var dots = [];

  // Create one dot per slide
  for (var k = 0; k < total; k++) {
    (function (index) {
      var dot = document.createElement('button');
      dot.className = 'hero-dot';
      dot.setAttribute('aria-label', 'Go to slide ' + (index + 1));
      dot.onclick = function () { goTo(index); restart(); };
      dotsBox.appendChild(dot);
      dots.push(dot);
    })(k);
  }

  // Move to a slide and update the dots
  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = 'translateX(' + (-100 * current) + '%)';
    dots.forEach(function (dot, j) {
      dot.setAttribute('aria-current', j === current);
    });
  }

  // Autoplay every 6 seconds (off if reduced motion is preferred)
  function restart() {
    clearInterval(timer);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      timer = setInterval(function () { goTo(current + 1); }, 6000);
    }
  }

  // Arrow buttons
  hero.querySelector('.prev').onclick = function () { goTo(current - 1); restart(); };
  hero.querySelector('.next').onclick = function () { goTo(current + 1); restart(); };

  // Pause on hover
  hero.addEventListener('mouseenter', function () { clearInterval(timer); });
  hero.addEventListener('mouseleave', restart);

  // Swipe on touch screens
  hero.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
  }, { passive: true });

  hero.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 40) {
      goTo(current + (diff < 0 ? 1 : -1));
      restart();
    }
    startX = null;
  });

  goTo(0);
  restart();
})();