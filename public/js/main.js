
const vh = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    window.addEventListener('resize', () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
}
const header = () => {
    $(window).on('scroll load', function() {
        if ($(window).scrollTop() > 120) {
            $('.header').addClass('active');
            if($('.world-work').length > 0) {
                $('.world-work').addClass('active');
            }
        } else {
            $('.header').removeClass('active');
            $('.nav-trigger, .nav-trigger .hammer-menu').removeClass('active');
            $('.overlay-menu').removeClass('active');
            if($('.world-work').length > 0) {
                $('.world-work').removeClass('active');
            }
        }
    });
}
const hammerMenu = () => {
    $('.header-hammer-menu').click(function() {
        $(this).toggleClass('active');
        $('.navigation').toggleClass('active');
    });
    $('.nav-trigger').click(function() {
        $(this).find('.hammer-menu').toggleClass('active');
        $('.overlay-menu').toggleClass('active');
    });
}
$(document).ready(function() {
    vh();
    header();
    hammerMenu();
    Fancybox.bind('[data-fancybox="gallery"]', {
      });
});