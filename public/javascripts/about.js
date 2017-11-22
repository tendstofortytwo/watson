setTimeout(function() {
	$('#main').removeClass('hidden');
}, 100);

setInterval(function() {
	$('section').each(function() {
		var section = $(this);
		if	( (scrollY > section.offset().top - (0.4 * $(window).height())) ||
			  (scrollY + ($(window).height()) > (section.offset().top + section.height())) ) {
			section.removeClass('hidden');

			setTimeout(function() {
				if(section.is('#try')) {
					section.find('a.button').css('transition-delay', '0');
				}
			}, 450);
		}
	});
}, 100);

var player;

function closeVideo(e) {
    if (e == 0 || e.data == 0) {
        $('#videoPlayer').fadeOut(300, function() {
            $(this).remove();
        });
        $('.video').removeClass('video-playing').css({
            paddingBottom: '30rem'
        });
        $(window).off('orientationchange resize');
    }
}
$('.video .text-container').on('click', function() {
    var $el = $(this);
    $el.parent().addClass('video-playing');
    var vidId = $el.parent().find('img').attr('src').split('/')[4];
    $el.parent().append('<iframe id="videoPlayer" src="https://www.youtube.com/embed/' + vidId + '?autoplay=1&enablejsapi=1" allowfullscreen frameborder="0"></iframe>');
    $el.parent().find('#videoPlayer').css({
        opacity: 1,
        pointerEvents: 'all'
    });
    player = new YT.Player('videoPlayer', {
        videoId: vidId,
        events: {
            'onStateChange': closeVideo
        }
    });

    function scrollToVideo() {
        setTimeout(function() {
            $('#main').animate({
                scrollTop: $('.hero').outerHeight() + $('.keynote').outerHeight()
            }, 300);
        }, 1000);
    }

    function resizer() {
        percentage = 100 * $(window).height() / $(window).width();
        $('.video').css({
            paddingBottom: percentage + '%'
        });
        scrollToVideo();
    }
    resizer();
    $(window).on('orientationchange resize', resizer);
});