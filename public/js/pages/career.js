
function marquee() {
  document.querySelectorAll('.marquee-container').forEach((container) => {
    const track = container.querySelector('.marquee-track');
    const content = container.querySelector('.marquee-content');
    
    if (!track || !content) return;
    
    // Clone content for seamless loop
    const clone = content.cloneNode(true);
    track.appendChild(clone);
    
    // Get options from data attributes
    const isReverse = container.dataset.reverse === "true";
    const speed = parseFloat(container.dataset.speed) || 20;
    
    // Calculate duration based on content width and speed
    const contentWidth = content.offsetWidth;
    const duration = contentWidth / speed;
    
    // Set initial position
    if (isReverse) {
      gsap.set(track, { x: -contentWidth });
    } else {
      gsap.set(track, { x: 0 });
    }
    
    // Create the animation
    const animation = gsap.to(track, {
      x: isReverse ? 0 : -contentWidth,
      duration: duration,
      ease: "none",
      repeat: -1
    });
    
    // Store animation reference for external control
    container.marqueeAnimation = animation;
    container.marqueeInstance = {
      animation: animation,
      reverse: isReverse,
      speed: speed,
      
      // Method to pause/resume
      toggle: function() {
        if (this.animation.isActive()) {
          this.animation.pause();
        } else {
          this.animation.resume();
        }
      },
      
      // Method to change speed
      setSpeed: function(newSpeed) {
        this.speed = newSpeed;
        const contentWidth = content.offsetWidth;
        const duration = contentWidth / this.speed;
        this.animation.duration(duration);
      },
      
      // Method to reverse direction
      reverse: function() {
        this.reverse = !this.reverse;
        const contentWidth = content.offsetWidth;
        const duration = contentWidth / this.speed;
        
        this.animation.kill();
        
        if (this.reverse) {
          gsap.set(track, { x: -contentWidth });
          this.animation = gsap.to(track, {
            x: 0,
            duration: duration,
            ease: "none",
            repeat: -1
          });
        } else {
          gsap.set(track, { x: 0 });
          this.animation = gsap.to(track, {
            x: -contentWidth,
            duration: duration,
            ease: "none",
            repeat: -1
          });
        }
      }
    };
  });
}

function careerModal() {
    
    $('.view-now').on('click', function(e) {
        e.preventDefault();
        const popup = $(this).data('popup');
        Fancybox.show([{ src: "#" + popup, type: "inline"}], {
            mainClass: 'no-backdrop fancybox-modal'
        });
        
    });
}



$(document).ready(function() {
    marquee();
    careerModal();
});