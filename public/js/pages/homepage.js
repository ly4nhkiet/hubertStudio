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
  const md = new MobileDetect(window.navigator.userAgent);
  console.log(md)
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
  
    gsap.set(text, { x: 0 });
    const rect = text.getBoundingClientRect();
    const distance = rect.width - (window.innerWidth / 2);
  
    const tl = gsap.timeline({ defaults: { ease: "none" } });
    tl.to(text, { x: -distance })
    scrollTriggerInstance = ScrollTrigger.create({
      animation: tl,
      trigger: ".world-work",
      start: "top top",
      end: () => "+=" + distance,   // end đúng thời điểm chữ Y biến mất hoàn toàn
      scrub: true,
      pin: true,
      pinSpacing: true,              // bật lại để không bị overlap
      invalidateOnRefresh: true,     // tính lại khi resize/refresh
      anticipatePin: 1,
      // markers: true,
      onEnter: () => { isInsideWorldWork = true; lastAnimationScrollY = window.scrollY; $('.nav-trigger').removeClass('active'); $('.header').addClass('on-enter'); },
      onEnterBack: () => { isInsideWorldWork = true; lastAnimationScrollY = window.scrollY; $('.nav-trigger').removeClass('active'); $('.header').addClass('on-enter'); },
      onLeave: () => { isInsideWorldWork = false; currentSpeed = speed; $('.nav-trigger').addClass('active'); $('.header').removeClass('on-enter'); },
      onLeaveBack: () => { isInsideWorldWork = false; currentSpeed = speed; $('.nav-trigger').addClass('active'); $('.header').removeClass('on-enter'); },
    });
  }
  

  // Init
  loadImages();

  images[0].onload = () => {
    resizeCanvas();
    animate();
  };
  if(!md.mobile() || !md.tablet()) {
    createScrollAnimation();
  }
 

  window.addEventListener("resize", () => {
    resizeCanvas();
    if(!md.mobile() || !md.tablet()) {
      createScrollAnimation();
    }
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
  var md = new MobileDetect(window.navigator.userAgent);

  // Desktop (PC)
  if (!md.mobile() && !md.tablet()) {
    ScrollTrigger.matchMedia({
      "(min-width: 1024px)": function () {
        const vh = document.documentElement.clientHeight;
        const lines = gsap.utils.toArray(".abt-quote h3");
        const finalSection = document.querySelector(".abt-quote .abt-quote-sub");

        // Pin toàn section từ đầu
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".abt-quote",
            start: "top top",   // pin ổn định
            end: "+=" + vh * 3,
            scrub: 2,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            // markers: true,
          }
        });

        // set trạng thái ban đầu cho tất cả
        lines.forEach(line => gsap.set(line, { y: 80, autoAlpha: 0 }));
        if (finalSection) gsap.set(finalSection, { y: 80, autoAlpha: 0 });

        // tạo trigger riêng cho line đầu tiên -> xuất hiện khi section vào 50%
        ScrollTrigger.create({
          trigger: ".abt-quote",
          start: "top 50%",
          once: true,
          onEnter: () => {
            gsap.to(lines[0], {
              y: 0,
              autoAlpha: 1,
              duration: 0.8,
              ease: "power2.out"
            });
          }
        });

        // timeline chính (bỏ line đầu tiên đi vì đã xử lý riêng)
        lines.slice(1).forEach((line, i) => {
          tl.to(line, {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power2.out"
          }, i + 1);
        });

        if (finalSection) {
          tl.to(finalSection, {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power2.out"
          }, lines.length);

          tl.to({}, { duration: 1 });
        }
      }
    });
  }
  // Mobile / Tablet
  else {
    const items = gsap.utils.toArray(".abt-quote h3, .abt-quote .abt-quote-sub");
    items.forEach(item => {
      gsap.set(item, { y: 50, autoAlpha: 0 });
      gsap.to(item, {
        y: 0,
        autoAlpha: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top 90%",
          toggleActions: "play none none none",
          once: true,
          // markers: true,
        }
      });
    });
  }
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
    var md = new MobileDetect(window.navigator.userAgent);
    if(md.mobile()) {
      $('body').addClass('mobile');
    }
    worldWork();
    marquee();
    testimonial();
    animateFadeUpSequential();
    // animateHubertAboutUs();
    animationFadeIn();
    
    
    // init
    animateQuoteScroll();
    $('header').addClass('header-home');
    projectCarousel();
});