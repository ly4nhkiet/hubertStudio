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

function worldWork() {
  gsap.registerPlugin(ScrollTrigger);

  let scrollTriggerInstance = null;
  const frameCount = 250;
  const images = [];
  let currentFrame = 0;

  let speed = 1.0;
  let boostedSpeed = 4.0;
  let currentSpeed = speed;
  let isInsideWorldWork = false;
  let isScrolling = false;
  let scrollTimeout = null;
  
  
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
  function handleUserScroll() {
    if (!isInsideWorldWork) return;
  
    currentSpeed = boostedSpeed;
  
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      // Nếu không cuộn nữa sau 200ms thì giảm lại tốc độ
      currentSpeed = speed;
    }, 200);
  }
  window.addEventListener("scroll", handleUserScroll);
  function resizeCanvas() {
    const wrapper = canvas.parentElement;
    const rect = wrapper.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    render(); // vẽ lại khi resize
  }

  function render() {
    const frameIndex = Math.floor(currentFrame) % frameCount;
    const img = images[frameIndex];
    if (!img || !img.complete) return;

    // Fit ảnh theo kiểu "contain" vào canvas
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgRatio > canvasRatio) {
      // ảnh ngang hơn -> fit theo chiều rộng
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgRatio;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      // ảnh dọc hơn -> fit theo chiều cao
      drawHeight = canvas.height;
      drawWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }

  function animate() {
    currentFrame += currentSpeed;
    render();
    requestAnimationFrame(animate);
  }

  function createScrollAnimation() {
    if (scrollTriggerInstance) scrollTriggerInstance.kill();

    const text = document.querySelector(".world-world-horizontal img");
    if (!text) return;

    const distance = text.scrollWidth - window.innerWidth;

    scrollTriggerInstance = ScrollTrigger.create({
      animation: gsap.to(text, {
        x: -distance,
        ease: "none",
      }),
      trigger: ".world-work",
      start: "top top",
      end: "bottom top",
      scrub: 1,
      pin: true,
      markers: false,
      invalidateOnRefresh: true,
      onEnter: () => {
        isInsideWorldWork = true;
      },
      onEnterBack: () => {
        isInsideWorldWork = true;
      },
      onLeave: () => {
        isInsideWorldWork = false;
        currentSpeed = speed;
      },
      onLeaveBack: () => {
        isInsideWorldWork = false;
        currentSpeed = speed;
      },
    });
  }

  // Init logic
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


function animateHubertAboutUs() {
  gsap.registerPlugin(ScrollTrigger);

  const section = document.querySelector('.hubert-about-us');
  const textEls = section.querySelectorAll('.animate-text-about-us');

  // Tách ký tự thành span
  textEls.forEach(el => {
    const chars = el.textContent.split('');
    el.innerHTML = chars.map(char => {
      const safeChar = char === ' ' ? '&nbsp;' : char;
      return `<span class="char inline-block">${safeChar}</span>`;
    }).join('');
  });

  const master = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
      toggleActions: "play none none none"
    }
  });

  // Animate từng đoạn text
  textEls.forEach((el) => {
    const chars = el.querySelectorAll('.char');
    master.from(chars, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.03
    }, "+=0.2");
  });

  // Sau khi text xong → box-content
  master.from(".box-content", {
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: "power2.out"
  }, "+=0.3");

  // Tiếp theo → box-img
  master.from(".box-img", {
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: "power2.out"
  }, "+=0.3");
}

function animateQuoteScroll() {
  gsap.registerPlugin(ScrollTrigger);

  const lines = gsap.utils.toArray(".abt-quote h3");
  const finalSection = document.querySelector(".abt-quote .abt-quote-sub");

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".abt-quote",
      start: "top top",
      end: () => `+=${window.innerHeight * (lines.length + 1)}`, // cộng thêm cho box cuối
      scrub: true,
      pin: true,
      markers: false
    }
  });

  // Animate từng dòng chữ
  lines.forEach((line, i) => {
    tl.fromTo(line,
      {
        autoAlpha: 0,
        y: 100
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1
      },
      i
    )
  });

  // ✨ Thêm box cuối fadeUp sau dòng cuối cùng
  tl.fromTo(finalSection,
    {
      autoAlpha: 0,
      y: 100
    },
    {
      autoAlpha: 1,
      y: 0,
      duration: 1
    },
    lines.length + 0.5 // sau tất cả dòng chữ
  );
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
    animateHubertAboutUs();
    animateQuoteScroll();
});