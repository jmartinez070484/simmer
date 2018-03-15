project.index = {};

project.index.init = (function() {
	console.log('init');
});

if (project.page.hasClass('index')) {
	project.index.init();
}