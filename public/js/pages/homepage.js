// function worldWork() {
//     gsap.registerPlugin(ScrollTrigger);
  
//     let scrollTriggerInstance = null;
  
//     function createAnimation() {
//       // Kill trigger cũ nếu có
//       if (scrollTriggerInstance) {
//         scrollTriggerInstance.kill();
//       }
  
//       const text = document.querySelector(".world-world-horizontal img");
//       if (!text) return;
  
//       const distance = text.scrollWidth - window.innerWidth;
  
//       scrollTriggerInstance = ScrollTrigger.create({
//         animation: gsap.to(text, {
//           x: -distance,
//           ease: "none",
//         }),
//         trigger: ".world-work",
//         start: "top top",
//         end: "bottom top",
//         scrub: 1,
//         pin: true,
//         markers: true,
//         invalidateOnRefresh: true,
//       });
//     }
  
//     // Khởi tạo lần đầu
//     createAnimation();
  
//     // Khi resize, tính lại
//     window.addEventListener("resize", () => {
//       createAnimation();
//       ScrollTrigger.refresh(); // cập nhật lại layout scroll
//     });
//   }
gsap.registerPlugin(ScrollTrigger);

function worldWork() {
  let scrollTriggerInstance = null;
  const frameCount = 250;
  const images = [];
  let currentFrame = 0;

  let speed = 0.2;           // tốc độ chậm
  let boostedSpeed = 2.0;    // tốc độ nhanh khi scroll
  let currentSpeed = speed;  // tốc độ hiện tại
  let isInsideWorldWork = false;
  let lastAnimationScrollY = window.scrollY;
  let scrollIdleTimeout = null;

  const canvas = document.getElementById("sequence-canvas");
  const context = canvas.getContext("2d");

  function loadImages() {
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const index = String(i).padStart(4, '0');
      img.src = `/images/controller/${index}.png`;
      images.push(img);
    }
  }

  function resetScrollStopTimeout() {
    if (scrollIdleTimeout) clearTimeout(scrollIdleTimeout);

    scrollIdleTimeout = setTimeout(() => {
      // Khi ngừng scroll → quay chậm lại theo hướng hiện tại
      currentSpeed = currentSpeed > 0 ? speed : -speed;
    }, 200);
  }

  function resizeCanvas() {
    const wrapper = canvas.parentElement;
    const rect = wrapper.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    render();
  }

  function render() {
    const frameIndex = Math.floor(currentFrame) % frameCount;
    const img = images[frameIndex];
    if (!img || !img.complete) return;

    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgRatio > canvasRatio) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgRatio;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawHeight = canvas.height;
      drawWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }

  function animate() {
    const newScrollY = window.scrollY;
    const deltaY = newScrollY - lastAnimationScrollY;
    lastAnimationScrollY = newScrollY;

    if (isInsideWorldWork) {
      if (deltaY > 0) {
        // Scroll xuống → quay xuôi nhanh
        currentSpeed = boostedSpeed;
        resetScrollStopTimeout();
      } else if (deltaY < 0) {
        // Scroll lên → quay ngược nhanh
        currentSpeed = -boostedSpeed;
        resetScrollStopTimeout();
      }
      // deltaY = 0 → giữ nguyên currentSpeed (timeout sẽ giảm tốc)
    }

    currentFrame += currentSpeed;

    // Loop frames
    if (currentFrame < 0) currentFrame += frameCount;
    if (currentFrame >= frameCount) currentFrame -= frameCount;

    render();
    requestAnimationFrame(animate);
  }

  function createScrollAnimation() {
    if (scrollTriggerInstance) scrollTriggerInstance.kill();

    const text = document.querySelector(".world-world-horizontal img");
    if (!text) return;

    const distance = text.scrollWidth;
    const endDistance = "+=" + (window.innerHeight * 2); // chiều dài pin
    scrollTriggerInstance = ScrollTrigger.create({
      animation: gsap.to(text, {
        x: -distance,
        ease: 'linear',
      }),
      trigger: ".world-work",
      start: "top top",
      end: endDistance,
      scrub: 1.5,
      pin: true,
      markers: false,
      invalidateOnRefresh: true,
      onEnter: () => {
        isInsideWorldWork = true;
        lastAnimationScrollY = window.scrollY;
        $('.nav-trigger').removeClass('active');
        $('.header').addClass('on-enter');
      },
      onEnterBack: () => {
        isInsideWorldWork = true;
        lastAnimationScrollY = window.scrollY;
        $('.nav-trigger').removeClass('active');
        $('.header').addClass('on-enter');
      },
      onLeave: () => {
        isInsideWorldWork = false;
        currentSpeed = speed;
        $('.nav-trigger').addClass('active');
        $('.header').removeClass('on-enter');
      },
      onLeaveBack: () => {
        isInsideWorldWork = false;
        currentSpeed = speed;
        $('.nav-trigger').addClass('active');
        $('.header').removeClass('on-enter');
      },
    });
  }

  // Init
  loadImages();

  images[0].onload = () => {
    resizeCanvas();
    animate();
  };

  createScrollAnimation();

  window.addEventListener("resize", () => {
    resizeCanvas();
    createScrollAnimation();
    ScrollTrigger.refresh();
  });
}



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

function splitTextToSpans(el) {
  const chars = el.textContent.split('');
  el.innerHTML = chars.map(char => {
    const safeChar = char === ' ' ? '&nbsp;' : char;
    return `<span class="char inline-block">${safeChar}</span>`;
  }).join('');
}

function animateFadeUpSequential() {
  const textEls = Array.from(document.querySelectorAll('.animate-text'));

  textEls.forEach(splitTextToSpans);

  let master = gsap.timeline({
    scrollTrigger: {
      trigger: textEls[0], // trigger đoạn đầu tiên
      start: "top 80%",
      end: "bottom top",
      toggleActions: "play none none none",
    }
  });

  textEls.forEach((el, index) => {
    const chars = el.querySelectorAll('.char');

    let tl = gsap.timeline();

    tl.fromTo(chars, {
      opacity: 0,
      y: 20
    }, {
      opacity: 1,
      y: 0,
      ease: "power2.out",
      duration: 0.6,
      stagger: 0.03
    });

    master.add(tl, "+=0.2");
  });
}


// function animateHubertAboutUs() {

//   const section = document.querySelector('.hubert-about-us');
//   const textEls = section.querySelectorAll('.animate-text-about-us');

//   textEls.forEach(el => {
//     const words = el.textContent.trim().split(/\s+/); // tách từ theo dấu cách
//     el.innerHTML = words.map(word => {
//       const chars = word.split('').map(char => {
//         return `<span class="char">${char}</span>`;
//       }).join('');
//       return `<span class="word" style="display:inline-block;">${chars}</span>`;
//     }).join(' ');
//   });

//   const master = gsap.timeline({
//     scrollTrigger: {
//       trigger: section,
//       start: "top 80%",
//       toggleActions: "play none none none"
//     }
//   });

//   // Animate từng đoạn text
//   textEls.forEach((el) => {
//     const chars = el.querySelectorAll('.char');
//     master.from(chars, {
//       opacity: 0,
//       y: 20,
//       duration: 0.6,
//       ease: "power2.out",
//       stagger: 0.03
//     }, "+=0.2");
//   });

//   // Sau khi text xong → box-content
//   master.from(".box-content", {
//     opacity: 0,
//     y: 40,
//     duration: 0.8,
//     ease: "power2.out"
//   }, "+=0.3");

//   // Tiếp theo → box-img
//   master.from(".box-img", {
//     opacity: 0,
//     y: 40,
//     duration: 0.8,
//     ease: "power2.out"
//   }, "+=0.3");
//   console.log(master);
// }

function animateQuoteScroll() {
  // Kill các ScrollTrigger cũ
  ScrollTrigger.getAll().forEach(t => {
    if (t.trigger && t.trigger.classList.contains('abt-quote')) {
      t.kill();
    }
  });
  if (window.quoteScrollTL) {
    window.quoteScrollTL.kill();
    window.quoteScrollTL = null;
  }

  const lines = gsap.utils.toArray(".abt-quote h3");
  const finalSection = document.querySelector(".abt-quote .abt-quote-sub");

  // Tạo timeline lớn, pin section
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".abt-quote",
      start: "top top",
      end: "+=" + (lines.length * 200 + 500) + "px", // tổng độ dài scroll
      scrub: 1.5,
      pin: true,
      markers: true,
    }
  });

  // Animate từng line khi tới lượt
  lines.forEach((line, i) => {
    tl.from(line, {
      y: 80,
      autoAlpha: 0,
      duration: 0.8,
      ease: "power2.out"
    }, i); // i ở đây tạo khoảng cách giữa các line
  });

  // Animate phần cuối
  if (finalSection) {
    tl.from(finalSection, {
      y: 80,
      autoAlpha: 0,
      duration: 0.8,
      ease: "power2.out"
    }, lines.length);
  }

  window.quoteScrollTL = tl;
}

function animationFadeIn() {
  document.querySelectorAll("[data-animation]").forEach((el) => {
    const animationType = el.dataset.animation;
    const delay = parseFloat(el.dataset.delay) || 0;

    let x = 0;
    let y = 0;

    if (animationType === "fade-left") x = 100;
    if (animationType === "fade-right") x = -100;
    if (animationType === "fade-up" || animationType === "fadeIn-up") y = 100;
    if (animationType === "fade-down") y = -100;

    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        toggleActions: "play none none none",
      },
      x,
      y,
      opacity: 0,
      duration: 1.2,
      delay: delay,
      ease: "power3.out",
    });
  });

  window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
  });
}

function testimonial() {
    $('.testimonial-slide').owlCarousel({
        loop: true,
        items: 1,
        margin: 10,
        nav: false,
        dots: true,
    });
}
$(document).ready(function() {
    // world work
    worldWork();
    marquee();
    testimonial();
    animateFadeUpSequential();
    // animateHubertAboutUs();
    animateQuoteScroll();
    animationFadeIn();
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        animateQuoteScroll();
      }, 250);
    });
});