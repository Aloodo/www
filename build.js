var metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');
var handlebars = require('handlebars');
var logger = require('metalsmith-logger');
var permalinks = require('metalsmith-permalinks');
var dateFormatter = require('metalsmith-date-formatter');

if(process.env['BUILD_ONCE']) {
        var serve = function(){};
        var watch = function(){};
} else {
        var serve = require('metalsmith-serve');
        var watch = require('metalsmith-watch');
}

metalsmith(__dirname)
	.clean(true)
	.metadata({
		site: {
			url: 'https://www.aloodo.org/',
			name: 'Aloodo',
			description: "Tracking protection for sites and brands"
    		}
  	})
	.source('./src')
	.destination('./public')
	.use(markdown())
	.use(dateFormatter({
		dates: [ { key: 'date', format: 'DD MMMM YYYY' } ]
	}))
	.use(permalinks({
		relative: false,
		pattern: ':permalink/',
	}))
	.use(layouts({
		engine: 'handlebars',
		directory: './layouts',
		default: 'index.html',
	        pattern: ["*/*/*html","*/*html","*html"],
		partials: {
			htmlhead: 'partials/htmlhead',
			header: 'partials/header',
			footer: 'partials/footer'
		}
	}))
	.use(serve({
		port: 8088,
		verbose: true
	}))
	.use(watch({
		paths: {
			"${source}/**/*": "**/*",
			"layouts/**/*": "**/*"
	        }
	}))
	.build(function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log('built!');
	}
});

