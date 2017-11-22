$('form.search a.submit').on('click', function(e) {
	e.preventDefault();
	$('form.search').submit();
});

var t, x;

$('form.search input').on('keyup', function(e) {
	var $el = $(this);

	if(e.keyCode == 13)
		$('form.search').submit();

	clearTimeout(t);

	var text = $el.val().trim();

	if(text.length >= 2) {
		t = setTimeout(function() {
			$.get('/handler/suggest?term=' + encodeURIComponent(text), function(data) {
				var suggestions = data.suggestionGroups[0].searchSuggestions;

				x = data;

				$('.suggestions-list').html('');

				for(var i = 0; i < suggestions.length && i < 5; i++) {
					$('.suggestions-list').append('<div class="suggestion">' + suggestions[i].query + '</div>');
				}

				var first = $('.suggestions-list').find('.suggestion')[0].innerHTML.toLowerCase().trim();
				var term = $('form.search input').val().toLowerCase().trim();
				if(first.indexOf(term) == 0 && term.length >= 1)
					$('form.search .input-container').attr('data-placeholder', first).addClass('show-prediction');
				else {
					$('form.search .input-container').attr('data-placeholder', ' ').removeClass('show-prediction');
					console.log(term.length);
				}
			})
		}, 300);
	}
});

$('.suggestions-list').on('click', '.suggestion', function() {
	$('form.search input').val($(this).html());
	$('.suggestions-list').html('');
	$('form.search').submit();
});

$('form.search input').on('focus', function() {
	$(this).parent().addClass('focus').parent().find('.suggestions-list').addClass('visible');
});

$('form.search input').on('blur', function() {
	var k = $(this).parent().removeClass('focus');
	setTimeout(function() {
		k.parent().find('.suggestions-list').removeClass('visible');
	},  250);
});

$('form.search').on('submit', function(e) {
	if($(this).find('.input-container').hasClass('show-prediction')) {
		e.preventDefault();
		$('form.search input').val($('form.search .input-container').attr('data-placeholder'));
		$('form.search .input-container').removeClass('show-prediction');
		$('form.search').submit();
	}
})