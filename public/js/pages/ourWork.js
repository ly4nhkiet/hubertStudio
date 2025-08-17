function ourWork() {
    gsap.registerPlugin(ScrollTrigger);

    // Hiệu ứng background sáng / xám
    document.querySelectorAll(".ourwork-item").forEach((item) => {
        ScrollTrigger.create({
            trigger: item,
            start: "top 50%",   // trigger when item's top edge hits 50% of viewport
            end: "bottom 50%",   // trigger when item's bottom edge hits 50% of viewport
            onEnter: () => item.classList.add('active'),
            onLeave: () => item.classList.remove('active'),
            onEnterBack: () => item.classList.add('active'),
            onLeaveBack: () => item.classList.remove('active'),
        });
    });

   
}

$(document).ready(function() {
    ourWork();
});