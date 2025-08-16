  function postStageCarousel() {
    $('.post-stage-carousel__main').owlCarousel({
        loop: true,
        items: 1,
        margin: 10,
        nav: false,
        dots: true,
    }).on('changed.owl.carousel', function(e) {
        $('.post-stage-carousel__thumb').trigger('to.owl.carousel', [e.page.index, 300, true]);
    });
    $('.post-stage-carousel__thumb').owlCarousel({
        loop: true,
        items: 3.4,
        margin: 10,
        center: true,
        nav: false,
        dots: true,
        responsive: {
            0: {
                items: 2.4,
            },
            768: {
                items: 3.4,
            },
        }
    }).on('changed.owl.carousel', function(e) {
        $('.post-stage-carousel__main').trigger('to.owl.carousel', [e.page.index, 300, true]);
    });

    $('.post-stage-gallery').each(function() {
        $(this).owlCarousel({
            items: 3,
            margin: 14,
            nav: false,
            dots: true,
            responsive: {
                0: {
                    items: 1.4,
                },
                576: {
                    items: 3,
                },
            }
        });
    });
    
  }
  $(document).ready(function() {
    postStageCarousel();
  });