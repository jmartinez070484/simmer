var project = {};

project.doc = $(document);
project.win = $(window);
project.page = $('main.page');

project.isTablet = (function() {
	return $(".responsive .tablet").css('display') === 'block' ? true : false;
});
project.isMobile = (function() {
	return $(".responsive .mobile").css('display') === 'block' ? true : false;
});

project.debounce = (function(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
});
project.index = {};

project.index.init = (function() {
	console.log('init');
});

if (project.page.hasClass('index')) {
	project.index.init();
}