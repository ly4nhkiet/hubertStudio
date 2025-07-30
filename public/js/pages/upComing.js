function upComing() {
    const frameCount = 250;
    const images = [];
    let currentFrame = 0;
    
    // Get speed from URL parameter or use default value of 1
    const urlParams = new URLSearchParams(window.location.search);
    let speed = parseFloat(urlParams.get('speed')) || 1;
    if($("#sequence-canvas").attr("data-speed")) {
        speed = parseFloat($("#sequence-canvas").attr("data-speed"));
    }
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
      currentFrame += speed;
      if (currentFrame >= frameCount) currentFrame -= frameCount;
  
      render();
      requestAnimationFrame(animate);
    }
  
    // Init
    loadImages();
    images[0].onload = () => {
      resizeCanvas();
      animate();
    };
  
    window.addEventListener("resize", () => {
      resizeCanvas();
    });
  }
  

  $(document).ready(function() {
    upComing();
  });