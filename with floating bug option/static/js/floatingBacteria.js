
document.addEventListener("DOMContentLoaded", function () {
    const floatingBacteria = document.getElementById('floatingBacteria');
  
    // Set initial position
    let x = Math.random() * window.innerWidth;
    let y = Math.random() * window.innerHeight;
    floatingBacteria.style.left = x + 'px';
    floatingBacteria.style.top = y + 'px';
  
    // Set initial speed
    let speedX = (Math.random() - 0.5) * 2;
    let speedY = (Math.random() - 0.5) * 2;
  
    // Update bacteria position
    function update() {
      x += speedX;
      y += speedY;
  
      // Check for collisions with window boundaries
      if (x + floatingBacteria.clientWidth > window.innerWidth || x < 0) {
        speedX = -speedX;
      }
  
      if (y + floatingBacteria.clientHeight > window.innerHeight || y < 0) {
        speedY = -speedY;
      }
  
      floatingBacteria.style.left = x + 'px';
      floatingBacteria.style.top = y + 'px';
  
      requestAnimationFrame(update);
    }
  
    update();
  });
  