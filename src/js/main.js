/** ==========================================================================================

  Project :   Uniaro - Responsive Multi-purpose HTML5 Template
  Author :    Themetechmount

========================================================================================== */


/** ===============

01. Preloader
02. header_search
03. Datetimepicker
04. Fixed-header
05. Menu
06. Number rotator
07. Skillbar
08. Tab
09. Accordion
10. Isotope
11. Prettyphoto
12. Slick_slider
13. Back to top 

 =============== */


(function($) {

   'use strict'

/*------------------------------------------------------------------------------*/
/* Preloader
/*------------------------------------------------------------------------------*/
   // makes sure the whole site is loaded
    $(window).on("load",function() {
            // will first fade out the loading animation
         $("#preloader").fadeOut();
            // will fade out the whole DIV that covers the website.
         $("#status").fadeOut(9000);
    })

/*------------------------------------------------------------------------------*/
/* header_search
/*------------------------------------------------------------------------------*/
    
    $(".header_search").each(function(){  
        $(".search_btn", this).on("click", function(e){

            e.preventDefault();
            e.stopPropagation();

            $(".header_search_content").toggleClass("on");

                if ($('.header_search a').hasClass('open')) {

                    $( ".header_search a i" ).removeClass('ti-close').addClass('ti-search');
                    
                    $(this).removeClass('open').addClass('sclose');    

                } 

                else {
                    $(".header_search a").removeClass('sclose').addClass('open');

                    $( ".header_search a i" ).removeClass('ti-search').addClass('ti-close');  
                    
                    }
                });

    });

/*------------------------------------------------------------------------------*/
/* Datetimepicker
/*------------------------------------------------------------------------------*/

/* side-menu */
    $(".fbar-main").each(function(){  
        $(".fbar-btn > a", this).on("click", function(e){
            e.preventDefault();
            $(".fbar-main-inner").toggleClass("on");
            $("i", this).toggleClass("ti-menu ti-close");
        });
    });

/*------------------------------------------------------------------------------*/
/* Fixed-header
/*------------------------------------------------------------------------------*/

    $(window).scroll(function(){
        if ( matchMedia( 'only screen and (min-width: 1200px)' ).matches ) 
        {
            if ($(window).scrollTop() >= 50 ) {

                $('.ttm-stickable-header').addClass('fixed-header');
            }
            else {

                $('.ttm-stickable-header').removeClass('fixed-header');
            }
        }
    });

/*------------------------------------------------------------------------------*/
/* Menu
/*------------------------------------------------------------------------------*/

    var menu = {
        initialize: function() {
            this.Menuhover();
        },

        Menuhover : function(){
            var getNav = $("nav.main-menu"),
                getWindow = $(window).width(),
                getHeight = $(window).height(),
                getIn = getNav.find("ul.menu").data("in"),
                getOut = getNav.find("ul.menu").data("out");
            
            if ( matchMedia( 'only screen and (max-width: 1200px)' ).matches ) {
                                                     
                // Enable click event
                $("nav.main-menu ul.menu").each(function(){
                    
                    // Dropdown Fade Toggle
                    $("a.mega-menu-link", this).on('click', function (e) {
                        e.preventDefault();
                        var t = $(this);
                        t.toggleClass('active').next('ul').toggleClass('active');
                    });   

                    // Megamenu style
                    $(".megamenu-fw", this).each(function(){
                        $(".col-menu", this).each(function(){
                            $(".title", this).off("click");
                            $(".title", this).on("click", function(){
                                $(this).closest(".col-menu").find(".content").stop().toggleClass('active');
                                $(this).closest(".col-menu").toggleClass("active");
                                return false;
                                e.preventDefault();
                                
                            });

                        });
                    });  
                    
                }); 
            }
        },
    };

    $('.btn-show-menu-mobile').on('click', function(){
        $(this).toggleClass('is-active');
        $('.menu-mobile').slideToggle();
    });
    
    
    // Initialize
    $(document).ready(function(){
        menu.initialize();

    });

/*------------------------------------------------------------------------------*/
/* Tab
/*------------------------------------------------------------------------------*/ 

    $('.ttm-tabs').each(function() {
    $(this).children('.content-tab').children().hide();
    $(this).children('.content-tab').children().first().show();
    $(this).find('.tabs').children('li').on('click', function(e) {  
        var liActive = $(this).index(),
            contentActive = $(this).siblings().removeClass('active').parents('.ttm-tabs').children('.content-tab').children().eq(liActive);
        contentActive.addClass('active').fadeIn('slow');
        contentActive.siblings().removeClass('active');
        $(this).addClass('active').parents('.ttm-tabs').children('.content-tab').children().eq(liActive).siblings().hide();
        e.preventDefault();
    });
});

/*------------------------------------------------------------------------------*/
/* Isotope
/*------------------------------------------------------------------------------*/

   $(function () {

        if ( $().isotope ) {           
            var $container = $('.isotope-project');
            $container.imagesLoaded(function(){
                $container.isotope({
                    itemSelector: '.ttm-box-col-wrapper',
                    transitionDuration: '0.5s',
                    layoutMode: 'fitRows'
                });
            });

            $('.portfolio-filter li').on('click',function() {                           
                var selector = $(this).find("a").attr('data-filter');
                $('.portfolio-filter li').removeClass('active');
                $(this).addClass('active');
                $container.isotope({ filter: selector });
                return false;
            });
        };

   });

/*------------------------------------------------------------------------------*/
/* Slick_slider
/*------------------------------------------------------------------------------*/
    $(".slick_slider").slick({
        speed: 1000,
        infinite: true,
        arrows: false,
        dots: false,                   
        autoplay: true,
        centerMode : false,

        responsive: [{

            breakpoint: 1360,
            settings: {
            slidesToShow: 3,
            slidesToScroll: 3
            }
        },
        {

            breakpoint: 1024,
            settings: {
            slidesToShow: 3,
            slidesToScroll: 3
            }
        },
        {

            breakpoint: 680,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2
            }
        },
        {
            breakpoint: 575,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }]
    });

/*------------------------------------------------------------------------------*/
/* Back to top
/*------------------------------------------------------------------------------*/

// ===== Scroll to Top ==== 
jQuery('#totop').hide();

jQuery(window).scroll(function() {
    "use strict";
    if (jQuery(this).scrollTop() >= 1000) {        // If page is scrolled more than 50px
        jQuery('#totop').fadeIn(200);    // Fade in the arrow
        jQuery('#totop').addClass('top-visible');
    } else {
        jQuery('#totop').fadeOut(200);   // Else fade out the arrow
        jQuery('#totop').removeClass('top-visible');
    }
});

jQuery('#totop').on('click',function() {      // When arrow is clicked
    jQuery('body,html').animate({
        scrollTop : 0                       // Scroll to top of body
    }, 500);
    return false;
});

/*------------------------------------------------------------------------------*/
/* Hide cart count if 0
/*------------------------------------------------------------------------------*/
window.addEventListener('load', function () {
    var cart = document.getElementById('cartcount');
    
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var observer = new MutationObserver(hideCount);
    observer.observe(cart, {
        childList: true
    });

    function hideCount() {
        if (cart.innerText != '0') {
            cart.style.display = 'block';
        }
        else {
            cart.style.display = 'none';
        }
    }
});

$(function() {

    });

})(jQuery);

/*------------------------------------------------------------------------------*/
/* Disable rezervation button if not selected
/*------------------------------------------------------------------------------*/
$("#datumi").on('change', function () {
    if ($(this).find('option:selected').text() == "---")
        $("#rezervacija").attr('disabled', true)
    else
        $("#rezervacija").attr('disabled', false)
});

/*------------------------------------------------------------------------------*/
/* Light YouTube Embeds by @labnol. Credit: https://www.labnol.org/
/*------------------------------------------------------------------------------*/
function labnolIframe(div) {
    var iframe = document.createElement('iframe');
    iframe.setAttribute(
        'src',
        'https://www.youtube.com/embed/' + div.dataset.id + '?autoplay=1&rel=0'
    );
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', '1');
    iframe.setAttribute(
        'allow',
        'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
    );
    div.parentNode.replaceChild(iframe, div);
}

function initYouTubeVideos() {
    var playerElements = document.getElementsByClassName('youtube-player');
    for (var n = 0; n < playerElements.length; n++) {
        var videoId = playerElements[n].dataset.id;
        var div = document.createElement('div');
        div.setAttribute('data-id', videoId);
        var thumbNode = document.createElement('img');
        thumbNode.src = '//i.ytimg.com/vi/ID/hqdefault.jpg'.replace(
            'ID',
            videoId
        );
        div.appendChild(thumbNode);
        var playButton = document.createElement('div');
        playButton.setAttribute('class', 'play');
        div.appendChild(playButton);
        div.onclick = function () {
            labnolIframe(this);
        };
        playerElements[n].appendChild(div);
    }
}

document.addEventListener('DOMContentLoaded', initYouTubeVideos);

/*------------------------------------------------------------------------------*/
/* plugin bootstrap minus and plus
/*------------------------------------------------------------------------------*/
$('.btn-number').click(function (e) {
    e.preventDefault();

    fieldName = $(this).attr('data-field');
    type = $(this).attr('data-type');
    var input = $("input[name='" + fieldName + "']");
    var currentVal = parseInt(input.val());
    if (!isNaN(currentVal)) {
        if (type == 'minus') {

            if (currentVal > input.attr('min')) {
                input.val(currentVal - 1).change();
            }
            if (parseInt(input.val()) == input.attr('min')) {
                $(this).attr('disabled', true);
            }

        } else if (type == 'plus') {

            if (currentVal < input.attr('max')) {
                input.val(currentVal + 1).change();
            }
            if (parseInt(input.val()) == input.attr('max')) {
                $(this).attr('disabled', true);
            }

        }
    } else {
        input.val(0);
    }
});
$('.input-number').focusin(function () {
    $(this).data('oldValue', $(this).val());
});
$('.input-number').change(function () {

    minValue = parseInt($(this).attr('min'));
    maxValue = parseInt($(this).attr('max'));
    valueCurrent = parseInt($(this).val());

    name = $(this).attr('name');
    if (valueCurrent >= minValue) {
        $(".btn-number[data-type='minus'][data-field='" + name + "']").removeAttr('disabled')
    } else {
        alert('Sorry, the minimum value was reached');
        $(this).val($(this).data('oldValue'));
    }
    if (valueCurrent <= maxValue) {
        $(".btn-number[data-type='plus'][data-field='" + name + "']").removeAttr('disabled')
    } else {
        alert('Sorry, the maximum value was reached');
        $(this).val($(this).data('oldValue'));
    }


});
$(".input-number").keydown(function (e) {
    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode == 65 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
        // let it happen, don't do anything
        return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
});

/*------------------------------------------------------------------------------*/
/* Search funkcija
/*------------------------------------------------------------------------------*/
$(function () {
    // fetch JSON data
    const objave = [];
    fetch('/searchindex-objave.json')
        .then(blob => blob.json())
        .then(data => objave.push(...data));
    const edukacije = [];
    fetch('/searchindex-edukacije.json')
        .then(blob => blob.json())
        .then(data => edukacije.push(...data));
    const seminari = [];
    fetch('/searchindex-seminari.json')
        .then(blob => blob.json())
        .then(data => seminari.push(...data));
    
    //search functions
    function findRezObjave(wordToMatch, objave) {
        return objave.filter(rezObjave => {
            const regex = new RegExp(wordToMatch, 'gi');
            return rezObjave.title.match(regex);
        });
    }
    function findRezEdukacije(wordToMatch, edukacije) {
        return edukacije.filter(rezEdukacije => {
            const regex = new RegExp(wordToMatch, 'gi');
            return rezEdukacije.title.match(regex);
        });
    }
    function findRezSeminari(wordToMatch, seminari) {
        return seminari.filter(rezSeminari => {
            const regex = new RegExp(wordToMatch, 'gi');
            return rezSeminari.title.match(regex);
        });
    }

    // display search results
    function displayRez() {
        //objave
        const matchObjave = findRezObjave(this.value, objave);
        if ((matchObjave.length > 0) && (searchInput.value.length > 2)) {
            document.getElementById('objavebanner').style.display = "block";
            const htmlobjave = matchObjave.map(rezObjave => {
                const regex = new RegExp(this.value, 'gi');
                const posttitle = rezObjave.title.replace(regex, '<span class="hi">' + this.value + '</span>')
                return '<li><span class="name"><a href="' + rezObjave.url + '">' + posttitle + '</a></span>';
            }).join('');
            suggobjave.innerHTML = htmlobjave;
        }
        else {
            document.getElementById('objavebanner').style.display = "none";
            suggobjave.innerHTML = '';
        }

        // seminari
        const matchSeminari = findRezSeminari(this.value, seminari);
        if ((matchSeminari.length > 0) && (searchInput.value.length > 2)) {
            document.getElementById('seminaribanner').style.display = "block";
            const htmlseminari = matchSeminari.map(rezSeminari => {
                const regex = new RegExp(this.value, 'gi');
                const seminarititle = rezSeminari.title.replace(regex, '<span class="hi">' + this.value + '</span>')
                return '<li><span class="name"><a href="' + rezSeminari.url + '">' + seminarititle + '</a></span>';
            }).join('');
            suggseminari.innerHTML = htmlseminari;
        }
        else {
            document.getElementById('seminaribanner').style.display = "none";
            suggseminari.innerHTML = '';
        }
        
        // online edukacije
        const matchEdukacije = findRezEdukacije(this.value, edukacije);
        if ((matchEdukacije.length > 0) && (searchInput.value.length > 2)) {
            document.getElementById('edukacijebanner').style.display = "block";
            const htmledukacije = matchEdukacije.map(rezEdukacije => {
                const regex = new RegExp(this.value, 'gi');
                const edukacijetitle = rezEdukacije.title.replace(regex, '<span class="hi">' + this.value + '</span>')
                return '<li><span class="name"><a href="' + rezEdukacije.url + '">' + edukacijetitle + '</a></span>';
            }).join('');
            suggedukacije.innerHTML = htmledukacije;
        }
        else {
            document.getElementById('edukacijebanner').style.display = "none";
            suggedukacije.innerHTML = '';
        }
    }

    const searchInput = document.querySelector('#search_query_top');
    const suggobjave = document.querySelector('#suggObjave');
    const suggedukacije = document.querySelector('#suggEdukacije');
    const suggseminari = document.querySelector('#suggSeminari');

    searchInput.addEventListener('keyup', displayRez);
});

/*------------------------------------------------------------------------------*/
/* Valid email in form
/*------------------------------------------------------------------------------*/
$("#ttm-contactform").validate({
    rules: {
        email: {
            required: true,
            email: true
        }
    }
});
$.extend($.validator.messages, {
    required: "Obavezno polje",
    email: "Neispravna email adresa"
});