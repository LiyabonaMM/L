"use strict";

(function ($) {
    "use strict";

    // Cache jQuery selectors
    const $window = $(window);
    const $loader = $('.loader');
    const $header = $('.header');
    const $sections = $('.js-sections');
    const $sectionScroll = $('.js-section-scroll');
    const $projectsImg = $(".js-projects-img");
    const $psImg = $(".ps-img");

    function loader() {
        $window.on('load', function () {
            $loader.fadeOut(1000);
        });
    }

    function pagepiling() {
        if ($sections.length) {
            $sections.pagepiling({
                anchors: ['home', 'about', 'education', 'projects', 'skill', 'testimonials', 'news', 'contact'],
                menu: '#navbar',
                navigation: false,
                onLeave: function (index, nextIndex, direction) {
                    const $scrollItems = $(".section-scroll-item");
                    $scrollItems.removeClass("active");
                    if (direction == "up") {
                        $scrollItems.eq(index - 1).prevAll().addClass("active");
                    } else {
                        if ($scrollItems.eq(nextIndex).length) {
                            $scrollItems.eq(nextIndex).prevAll().addClass("active");
                        } else {
                            $scrollItems.eq(nextIndex - 1).prevAll().addClass("active");
                            $scrollItems.eq(nextIndex - 1).addClass("active");
                        }
                    }
                },
                afterRender: function () {
                    const sectionCount = $('.section').length;
                    for (let i = 0; i < sectionCount; i++) {
                        $('<div/>', {
                            "class": 'section-scroll-item'
                        }).appendTo($sectionScroll);
                    }
                    $(".section-scroll-item").eq(0).addClass("active");
                    updateSectionScrollbar();
                }
            });
        }
    }

    function updateSectionScrollbar() {
        $sectionScroll.css({
            height: $window.innerHeight() / 2
        });
        $('.section-scroll-item').css({
            height: $sectionScroll.innerHeight() / $('.section-scroll-item').length
        });
    }

    function sectionScrollbar() {
        $window.on('resize', debounce(updateSectionScrollbar, 100));
    }

    function swiperSlider() {
        new Swiper('.js-education-slider, .js-reviews-slider', {
            resizeObserver: true,
            loop: false,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            }
        });
    }

    function headerMenu() {
        $('.js-header-burger').on('click', function () {
            clearTimeout(window.headerTimeout);
            $('.js-header-cnt').addClass("anime");
            window.headerTimeout = setTimeout(function () {
                $('.js-header-cnt').removeClass("anime");
            }, 300);
            $(this).toggleClass('clicked');
            $('.js-header-cnt').toggleClass('active');
        });
    }

    function videoPlayer() {
        $('.js-video-play').magnificPopup({
            disableOn: 700,
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false
        });
    }

    function labelAnim() {
        $('.form-control').on('focus blur', function (e) {
            const isFocused = e.type === 'focus';
            $(this).parents('.form-group').toggleClass('focused', isFocused);
            $(this).toggleClass('filled', $(this).val() !== "" && isFocused);
        });
    }

    function imageMoving() {
        $projectsImg.on("mousemove mouseout", function (e) {
            const $this = $(this);
            const pos = $this.offset();
            const elem_left = pos.left;
            const elem_top = pos.top;
            const isMouseOver = e.type === "mousemove";

            $this.css("opacity", isMouseOver ? "1" : "0");
            if (isMouseOver) {
                const Xinner = e.pageX - elem_left - $this.innerWidth() / 2 + 40;
                const Yinner = e.pageY - elem_top - $this.innerHeight() / 2 + 40;
                $this.find(".projects-list__img").css({
                    'transform': `translateY(${Yinner}px) translateX(${Xinner}px)`
                });
            } else {
                $this.find(".projects-list__img").css({
                    'transform': 'translateY(0) translateX(0)'
                });
            }
        });
    }

    function heroParalax() {
        if ($('.js-hero').length) {
            $window.on('scroll', throttle(function () {
                $('.js-hero').css({
                    'transform': `translateY(${($window.scrollTop() * 0.3)}px)`
                });
            }, 100));
        }
    }

    function isOnScreen(elem) {
        const $elem = $(elem);
        const viewport_top = $window.scrollTop();
        const viewport_height = $window.height();
        const viewport_bottom = viewport_top + viewport_height;
        const top = $elem.offset().top;
        const height = $elem.height();
        const bottom = top + height;

        return (top >= viewport_top && top < viewport_bottom) ||
               (bottom > viewport_top && bottom <= viewport_bottom) ||
               (height > viewport_height && top <= viewport_top && bottom >= viewport_bottom);
    }

    function imageView() {
        $window.on('scroll', throttle(function () {
            $psImg.each(function () {
                if (isOnScreen($(this))) {
                    $(this).addClass("active");
                }
            });
        }, 100));
    }

    function headerFixed() {
        $window.on('scroll', throttle(function () {
            $header.toggleClass('fixed', $window.scrollTop() >= 40);
        }, 100));
    }

    function throttle(func, limit) {
        let lastFunc;
        let lastRun;
        return function () {
            const context = this;
            const now = Date.now();
            if (!lastRun) {
                func.apply(context, arguments);
                lastRun = now;
            } else {
                clearTimeout(lastFunc);
                if (now - lastRun >= limit) {
                    func.apply(context, arguments);
                    lastRun = now;
                } else {
                    lastFunc = setTimeout(function () {
                        func.apply(context, arguments);
                        lastRun = now;
                    }, limit - (now - lastRun));
                }
            }
        }
    }

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Initialize functions
    loader();
    pagepiling();
    swiperSlider();
    headerMenu();
    videoPlayer();
    labelAnim();
    imageMoving();
    sectionScrollbar();
    heroParalax();
    imageView();
    headerFixed();

})(jQuery);
