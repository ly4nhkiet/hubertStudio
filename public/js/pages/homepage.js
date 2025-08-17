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

  let speed = 0.2;
  let boostedSpeed = 2.0;
  let currentSpeed = speed;
  let isInsideWorldWork = false;
  let lastAnimationScrollY = window.scrollY;
  let scrollIdleTimeout = null;

  const canvas = document.getElementById("sequence-canvas");
  const context = canvas.getContext("2d");

  // Load sequence images
  function loadImages() {
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const index = String(i).padStart(4, "0");
      img.src = `/images/controller/${index}.png`;
      images.push(img);
    }
  }

  function resetScrollStopTimeout() {
    if (scrollIdleTimeout) clearTimeout(scrollIdleTimeout);
    scrollIdleTimeout = setTimeout(() => {
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
        currentSpeed = boostedSpeed;
        resetScrollStopTimeout();
      } else if (deltaY < 0) {
        currentSpeed = -boostedSpeed;
        resetScrollStopTimeout();
      }
    }

    currentFrame += currentSpeed;
    if (currentFrame < 0) currentFrame += frameCount;
    if (currentFrame >= frameCount) currentFrame -= frameCount;

    render();
    requestAnimationFrame(animate);
  }

  // ScrollTrigger cho text + overlay
  function createScrollAnimation() {
    if (scrollTriggerInstance) scrollTriggerInstance.kill();

    const text = document.querySelector(".world-world-horizontal img");
    const overlay = document.querySelector(".reveal-overlay");
    if (!text || !overlay) return;

    const distance = text.scrollWidth;
    const endDistance = "+=" + window.innerHeight * 3;

    const tl = gsap.timeline();
    tl.to(text, {
      x: -distance,
      ease: "linear",
      duration: 2,
    }).fromTo(
      overlay,
      { yPercent: 100 },
      { yPercent: 0, ease: "none", duration: 1 },
      ">+=0.2" // bắt đầu ngay sau text chạy
    );

    scrollTriggerInstance = ScrollTrigger.create({
      animation: tl,
      trigger: ".world-work",
      start: "top top",
      end: endDistance,
      scrub: true,
      pin: true,
      anticipatePin: 1,
      markers: true, // để debug
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
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}
function animateQuoteScroll() {
  // clear old triggers
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

  const vh = window.innerHeight; // viewport height
  const lineDuration = vh * 0.6; // mỗi line reveal chiếm 60% viewport
  const finalDuration = vh * 0.8; // phần cuối chiếm 80%
  const extraDelay = vh * 0.3;    // giữ thêm 30%

  const totalScroll = lines.length * lineDuration + finalDuration + extraDelay;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".abt-quote",
      start: "top top",
      end: "+=" + totalScroll,
      scrub: 2,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      // markers: true,
    }
  });

  lines.forEach((line, i) => {
    tl.from(line, {
      y: 80,
      autoAlpha: 0,
      duration: 0.8,
      ease: "power2.out"
    }, i);
  });

  if (finalSection) {
    tl.from(finalSection, {
      y: 80,
      autoAlpha: 0,
      duration: 0.8,
      ease: "power2.out"
    }, lines.length);

    tl.to({}, {duration: 1}); // giữ yên sau cùng
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

function projectCarousel() {
  $('.project-carousel').owlCarousel({
    items: 2,
    margin: 18,
    nav: true,
    dots: false,
    navText: [
      '<span class="icon-arrow-left"></span>',
      '<span class="icon-arrow-right"></span>'
    ],
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
    }
  })

  // get offset left and right from document
  $(window).on('load resize', function() {
    const owlNavOverlay = $('.project-carousel');
    const owlNavOverlayLeft = document.documentElement.scrollLeft + owlNavOverlay.offset().left;
    console.log(owlNavOverlayLeft);
    $('body').css('--offset', owlNavOverlayLeft + 'px');
    // $('.project-carousel .owl-stage').css('padding-left', owlNavOverlayLeft + 'px');
    // $('.project-carousel .owl-stage').css('padding-right', owlNavOverlayRight + 'px');
  });
  
}

$(document).ready(function() {
    // world work
    worldWork();
    marquee();
    testimonial();
    animateFadeUpSequential();
    // animateHubertAboutUs();
    animationFadeIn();
    window.addEventListener("resize", () => {
      animateQuoteScroll();
      ScrollTrigger.refresh();
    });
    
    // init
    animateQuoteScroll();
    $('header').addClass('header-home');
    projectCarousel();
});