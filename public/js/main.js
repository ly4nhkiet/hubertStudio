
const vh = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    window.addEventListener('resize', () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
}

const hammerMenu = () => {
    $('.hammer-menu').click(function() {
        $(this).toggleClass('active');
        $('.navigation').toggleClass('active');
    });
}
$(document).ready(function() {
    vh();
    hammerMenu();
});