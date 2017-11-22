var col1 = document.createElement('div');
$(col1).addClass('grid-column').appendTo($('.bundles-container'));

var col2 = document.createElement('div');
$(col2).addClass('grid-column').appendTo($('.bundles-container'));

var i = 0;

$('.links-bundle').each(function() {
	if(i++ % 2)	$(this).appendTo($(col2));
	else		$(this).appendTo($(col1));
});

$('img.logo').on('click', function() {
	location.href = '/';
});