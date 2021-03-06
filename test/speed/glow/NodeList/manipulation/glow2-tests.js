woosh.addTests('glow2-src', {
	'$preTest': function(prevTest, nextTest) {
		if (!prevTest) {
			window.htmlForTest = document.getElementById('htmlForTest');
			window.htmlForTestHTML = htmlForTest.innerHTML;
		}
		htmlForTest.innerHTML = htmlForTestHTML;
		window.paragraphs = new glow.NodeList('p');
		window.paragraph = paragraphs.item(0);
		window.testBin = new glow.NodeList('#testBin');
		window.testCount = 0;
		switch (nextTest) {
			case 'destroy':
			case 'remove':
			case 'empty':
				paragraphs.appendTo(testBin);
				break;
			case 'unwrap':
				paragraphs.appendTo(testBin).wrap('<div class="wrappingToRemove"></div>');
				break;
		}
	},
	'after': new woosh.TimeTest(1, function(test) {
		paragraphs.after('<p>hello</p>');
		if (test.lastLoop) {
			return new glow.NodeList('p').length;
		}
		htmlForTest.innerHTML = htmlForTestHTML;
		paragraphs = new glow.NodeList('p');
	}),
	'before': new woosh.TimeTest(1, function(test) {
		paragraphs.before('<p>hello</p>');
		if (test.lastLoop) {
			return new glow.NodeList('p').length;
		}
		htmlForTest.innerHTML = htmlForTestHTML;
		paragraphs = new glow.NodeList('p');
	}),
	'append': new woosh.TimeTest(1, function(test) {
		paragraphs.append('<span>hello</span>');
		if (test.lastLoop) {
			return new glow.NodeList('span').length;
		}
		htmlForTest.innerHTML = htmlForTestHTML;
		paragraphs = new glow.NodeList('p');
	}),
	'prepend': new woosh.TimeTest(1, function(test) {
		paragraphs.prepend('<span>hello</span>');
		if (test.lastLoop) {
			return new glow.NodeList('span').length;
		}
		htmlForTest.innerHTML = htmlForTestHTML;
		paragraphs = new glow.NodeList('p');
	}),
	'appendTo': new woosh.TimeTest(1, function(test) {
		paragraphs.appendTo(testBin);
		if (test.lastLoop) {
			return new glow.NodeList('#testBin p').length;
		}
	}),
	'prependTo': new woosh.TimeTest(1, function(test) {
		paragraphs.prependTo(testBin);
		if (test.lastLoop) {
			return new glow.NodeList('#testBin p').length;
		}
	}),
	'insertAfter': new woosh.TimeTest(1, function(test) {
		paragraphs.insertAfter(testBin);
		if (test.lastLoop) {
			return new glow.NodeList('#testBin p').length;
		}
	}),
	'insertBefore': new woosh.TimeTest(1, function(test) {
		paragraphs.insertBefore(testBin);
		if (test.lastLoop) {
			return new glow.NodeList('#testBin p').length;
		}
	}),
	'destroy': new woosh.TimeTest(1, function(test) {
		var html = testBin[0].innerHTML;
		paragraphs.destroy();
		if (test.lastLoop) {
			return new glow.NodeList('#testBin p').length;
		}
		testBin[0].innerHTML = html;
		paragraphs = new glow.NodeList('p');
	}),
	'remove': new woosh.TimeTest(1, function(test) {
		var html = testBin[0].innerHTML;
		paragraphs.remove();
		if (test.lastLoop) {
			return new glow.NodeList('#testBin p').length;
		}
		testBin[0].innerHTML = html;
		paragraphs = new glow.NodeList('p');
	}),
	'empty': new woosh.TimeTest(1, function(test) {
		var html = testBin[0].innerHTML;
		paragraphs.empty();
		if (test.lastLoop) {
			return new glow.NodeList('p').children().length;
		}
		testBin[0].innerHTML = html;
		paragraphs = new glow.NodeList('p');
	}),
	'replaceWith': new woosh.TimeTest(1, function(test) {
		paragraphs.replaceWith('<p>Hello!</p>');
		if (test.lastLoop) {
			return new glow.NodeList('p').length;
		}
		paragraphs = new glow.NodeList('p');
	}),
	'wrap': new woosh.TimeTest(1, function(test) {
		paragraphs.wrap('<div><div class="wrapInner"></div></div>');
		if (test.lastLoop) {
			return new glow.NodeList('div.wrapInner').length;
		}
		htmlForTest.innerHTML = htmlForTestHTML;
		paragraphs = new glow.NodeList('p');
	}),
	'wrap single': new woosh.TimeTest(1, function(test) {
		paragraph.wrap('<div><div class="wrapInner"></div></div>');
		if (test.lastLoop) {
			return new glow.NodeList('div.wrapInner').length;
		}
		htmlForTest.innerHTML = htmlForTestHTML;
		paragraph = new glow.NodeList('p').item(0);
	}),
	'unwrap': new woosh.TimeTest(1, function(test) {
		var html = testBin[0].innerHTML;
		paragraphs.unwrap();
		if (test.lastLoop) {
			return new glow.NodeList('div.wrappingToRemove').length;
		}
		testBin[0].innerHTML = html;
		paragraphs = new glow.NodeList('p');
	}),
	'clone': new woosh.TimeTest(1, function(test) {
		paragraphs.clone();
		if (test.lastLoop) {
			return paragraphs.length;
		}
	}),
	'copy': new woosh.TimeTest(1, function(test) {
		paragraphs.copy();
		if (test.lastLoop) {
			return paragraphs.length;
		}
	}),
	'html getting': new woosh.TimeTest(1, function(test) {
		return paragraphs.html();
	}),
	'html setting': new woosh.TimeTest(1, function(test) {
		paragraphs.html('Hello!');
		if (test.lastLoop) {
			return paragraphs[0].innerHTML;
		}
	}),
	'text getting': new woosh.TimeTest(1, function(test) {
		return paragraph.text();
	}),
	'text setting': new woosh.TimeTest(1, function(test) {
		paragraphs.text('Hello!');
		if (test.lastLoop) {
			return paragraphs[0].innerHTML;
		}
	})
});