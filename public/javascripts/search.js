var doubleClick = false;

$('a.result').on('click', function(e) {
	var $el = $(this);

	if(!doubleClick && $el.attr('data-opened') != '1') {
		doubleClick = true;
		setTimeout(function() {
			doubleClick = false;
		}, 150);

		e.preventDefault();

		var url = $el.attr('href');

		$('[data-opened="1"]').attr('data-opened', '0');

		$el.attr('data-opened', '1');

		openLinkInFrame(url, $el.find('h1').text().trim());
	}
});

$('img.logo').on('click', function() {
	location.href = '/';
});

function openLinkInFrame(url, title) {
	if(url.indexOf('youtube.com/watch?v=') >= 0) {
		url = url.replace('watch?v=', 'embed/');
	}

	else if(url.indexOf('twitter.com') >= 0) {
		$.ajax({
			async: false,
			url: '/handler/twitter/?url=' + encodeURIComponent(url),
			success: function(data) {
				url = 'data:text/html, ' + escape(data.html);
				console.log(url);
			}
		})
	}

	else if(url.indexOf('wikipedia.org') >= 0 && $(window).width() < 1920) {
		url = url.replace('wikipedia.org', 'm.wikipedia.org');
	}

	$('iframe').attr('src', '/handler/loading').parent().addClass('visible');
	$('.iframe-title').html(title);

	$.ajax({
		url: '/handler/urlcheck/?url=' + encodeURIComponent(url),
		success: function(data) {
			if(data == 'false') {
				/*window.open(url, '_blank');
				$el.attr('data-opened', '0');*/
				$('iframe').attr('src', '/handler/loadurl?url=' + encodeURIComponent(url)).parent().addClass('visible');
				$('iframe').addClass('touchmenot').attr('data-link', url);
				$('.iframe-title').html(title);
				$('iframe').on('load', function() {
					var k = $(this);
					k.contents().find('body').on('click', function(e) {
						e.preventDefault();
						k.parent().removeClass('visible');
						window.open(url, '_blank');
						$('[data-opened="1"]').attr('data-opened', '0');
						k.contents().find('body').off('click');
					});
				});
			}
			else {
				$('iframe').removeClass('touchmenot').removeAttr('data-link');
				$('iframe').attr('src', url).parent().addClass('visible');
				$('.iframe-title').html(title);
			}
		}
	})
}

var linksCount = 0;

function addLink(url, title) {
	var html = $('.saved-links-container').html();
	html = '<div class="saved-link" data-link="' + url + '"><div class="saved-title">' + title + '</div><button class="remove-link"></button></div>' + html;
	$('.saved-links-container').html(html);
	$('.links-count').html(++linksCount);
}

$('img.add').on('click', function(e) {
	e.stopPropagation();
	e.preventDefault();

	var $el = $(this);
	
	if($el.parent().attr('data-saved') != '1') {
		addLink($el.attr('data-link'), $el.attr('data-title'));
		$el.parent().attr('data-saved', '1');
	}

	else {
		$('.links-container').find('.saved-link[data-link="' + $el.attr('data-link') + '"]').remove();
		$('.links-count').html(--linksCount);
		$el.parent().attr('data-saved', '0');
	}
});

$('.links-container').on('click', '.remove-link', function(e) {
	e.stopPropagation();
	var url = $(this).parent().attr('data-link');
	$(this).parent().remove();
	$('.links-count').html(--linksCount);
	$('a.result').each(function() {
		if($(this).attr('href') == url) {
			$(this).attr('data-saved', '0');
			return false;
		}
	});
});

$('.links-container').on('click', '.saved-link', function() {
	openLinkInFrame($(this).attr('data-link'), $(this).text().trim());
	$('.links-caller').click();
});

$('.links-caller').on('click', function() {
	$(this).toggleClass('visible');
	$('.links-container').toggleClass('visible');
})

var rem = parseInt($('html').css('font-size')) || 16;

var scrolling = setInterval(function() {
	var offset = $(window).scrollTop() > 7*rem ? 7*rem : $(window).scrollTop();
	$('.iframe-container').css({
		height: 'calc(100vh - ' + (13*rem - offset)  + 'px)',
		top: (7*rem - offset) + 'px'
	});
}, 10);

$('.iframe-close').on('click', function() {
	$('.iframe-container').removeClass('visible');
	$('iframe').attr('src', 'data:text/html, ');
	$('[data-opened="1"]').attr('data-opened', '0');
})

$('.links-container').on('click', 'button.save', function(e) {
	var $el = $(this);

	if(!$('input#bundle-title').val().length) {
		//alert('You must specify a name!');
	}
	else {
		e.preventDefault();
		e.stopPropagation();

		var links = [];

		$('.links-container').find('.saved-link').each(function() {
			links[links.length] = {
				url: $(this).attr('data-link'),
				title: $(this).text().trim()
			}
		}).promise().done(function() {

			if(links.length) {
				console.log(JSON.stringify({ links: links }));
				$.ajax({
					type: 'POST',
					url: '/addbundle',
					data: JSON.stringify({links: links, title: $('input#bundle-title').val()}),
					dataType: 'json',
					contentType: 'application/json',
					async: false
				});

				alert('Bundle added!');
			}

		});
	}
});