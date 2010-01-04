function byId(id) {
	return document.getElementById(id);
}

var testHtml;

function setup() {
	testHtml = byId('testElmsContainer').innerHTML;
}

function teardown() {
	byId('testElmsContainer').innerHTML = testHtml;
}

module('glow.NodeList#clone', {setup:setup, teardown:teardown});

test('glow.NodeList#clone', 12, function() {
	var myNodeList = new glow.NodeList('#innerDiv1, #innerDiv2'),
		clones,
		divParent = myNodeList[0].parentNode;
	
	equal(typeof myNodeList.clone, 'function', 'glow.NodeList#clone is a function');
	
	clones = myNodeList.clone();
	
	equal(clones.constructor, glow.NodeList, 'returns nodelist');
	notEqual(clones, myNodeList, 'returns new nodelist');
	
	notEqual( clones[0], myNodeList[0], 'First elements aren\'t equal' );
	notEqual( clones[1], myNodeList[1], 'Second elements aren\'t equal' );
	equal( clones.length, myNodeList.length, 'Lengths are equal' );
	
	equal(clones[0].nodeName, 'DIV', 'copy is div');
	equal(clones[0].firstChild.nodeValue, 'D', 'copied inner text node');
	equal(myNodeList[0].parentNode, divParent, 'original hasn\'t moved');
	equal(clones[1].nodeName, 'DIV', 'copy is div');
	equal(clones[1].firstChild.nodeValue, 'C', 'copied inner text node');
	equal(myNodeList[1].parentNode, divParent, 'original hasn\'t moved');
});

test('glow.NodeList#clone data preserving', 0, function() {
	ok(false, 'todo, waiting for events & data');
});

test('glow.NodeList#clone events preserving', 0, function() {
	ok(false, 'todo, waiting for events & data');
});

module('glow.NodeList#after', {setup:setup, teardown:teardown});

test('glow.NodeList#after html string (single elm)', 6, function() {
	var myNodeList = new glow.NodeList('#twoInnerDivs div, #twoInnerEms em'),
		returnNodeList;
		
	equal(typeof myNodeList.after, 'function', 'glow.NodeList#after is a function');
	
	returnNodeList = myNodeList.after('<span>Hello</span>');
	
	strictEqual(returnNodeList, myNodeList, 'Same nodelist returned');
	
	myNodeList.each(function(i) {
		equal(this.nextSibling.innerHTML, 'Hello', 'Span #' + (i+1) + ' created');
	});
});

test('glow.NodeList#after html string (multiple elm)', 17, function() {
	var myNodeList = new glow.NodeList('#twoInnerDivs div, #twoInnerEms em'),
		returnNodeList;
		
	returnNodeList = myNodeList.after('<span>Hello</span>World<!-- comment --><span>Foobar</span>');
	strictEqual(returnNodeList, myNodeList, 'Same nodelist returned');
	
	new glow.NodeList('#twoInnerDivs div, #twoInnerEms em').each(function(i) {
		equal(this.nextSibling.nodeName, 'SPAN', 'Span 1 in elm #' + (i+1) + ' created');
		equal(this.nextSibling.nextSibling.nodeType, 3, 'Text node in elm #' + (i+1) + ' created');
		equal(this.nextSibling.nextSibling.nextSibling.nodeType, 8, 'Comment node in elm #' + (i+1) + ' created');
		equal(this.nextSibling.nextSibling.nextSibling.nextSibling.nodeName, 'SPAN', 'Span 1 in elm #' + (i+1) + ' created');
	});
});

test('glow.NodeList#after html element (single elm)', 7, function() {
	var myNodeList = new glow.NodeList('#twoInnerDivs div, #twoInnerEms em'),
		elementToMove = new glow.NodeList('span.elementToMove'),
		returnNodeList;

	returnNodeList = myNodeList.after( elementToMove[0] );
	
	strictEqual(returnNodeList, myNodeList, 'Same nodelist returned');
	
	equal( new glow.NodeList('span.elementToMove').length, 4, '4 elements with class "elementToMove"' );
	
	myNodeList.each(function(i) {
		equal(this.nextSibling.innerHTML, 'toMove', 'Span #' + (i+1) + ' created');
	});
	
	strictEqual( myNodeList[0].nextSibling, elementToMove[0], 'Element moved' );
});

test('glow.NodeList#after html element (multiple elms)', 21, function() {
	var myNodeList = new glow.NodeList('#twoInnerDivs div, #twoInnerEms em'),
		elementsToMove = new glow.NodeList('span.elementToMove, span.elementToMove2'),
		returnNodeList;

	returnNodeList = myNodeList.after(elementsToMove);
	
	strictEqual(returnNodeList, myNodeList, 'Same nodelist returned');
	
	equal( new glow.NodeList('span.elementToMove').length, 4, '4 elements with class "elementToMove"' );
	equal( new glow.NodeList('span.elementToMove2').length, 4, '4 elements with class "elementToMove2"' );
	
	new glow.NodeList('#twoInnerDivs div, #twoInnerEms em').each(function(i) {
		equal(this.nextSibling.nodeName, 'SPAN', 'Span 1 in elm #' + (i+1) + ' created');
		equal(this.nextSibling.innerHTML, 'toMove', 'Span 1 in elm #' + (i+1) + ' has correct innerHTML');
		equal(this.nextSibling.nextSibling.nodeName, 'SPAN', 'Span 2 in elm #' + (i+1) + ' created');
		equal(this.nextSibling.nextSibling.innerHTML, 'toMove2', 'Span 2 in elm #' + (i+1) + ' has correct innerHTML');
	});
	
	strictEqual( myNodeList[0].nextSibling, elementsToMove[0], 'Element moved' );
	strictEqual( myNodeList[0].nextSibling.nextSibling, elementsToMove[1], 'Element moved' );
});

test('glow.NodeList#after empty lists', 5, function() {
	var emptyList = new glow.NodeList(),
		populatedList = new glow.NodeList('#innerDiv1');
	
	equal(emptyList.after('<span></span>').constructor, glow.NodeList, 'Empty nodelist');
	equal(populatedList.after(undefined)[0].innerHTML, 'D', 'Undefined param results in no change to nodelist');
	equal(populatedList.after(null)[0].innerHTML, 'D', 'Null param results in no change to nodelist');
	equal(populatedList.after(emptyList)[0].innerHTML, 'D', 'Empty nodelist param results in no change to nodelist');
	equal(new glow.NodeList('<span>hey</span>').after('<b></b>')[0].innerHTML, 'hey', 'Node with no parent');
});

test('glow.NodeList#after on detatched elements & non-elements', 12, function() {
	var myNodeList = new glow.NodeList('<div><div></div>Hello<div></div><!--comment--><div></div></div>'),
		childNodeList,
		returnNodeList;
	
	// get child nodes of nodelist, including text and comment
	childNodeList = new glow.NodeList( myNodeList[0].childNodes );
	
	returnNodeList = childNodeList.after('<span>Hello</span>');
	
	strictEqual(returnNodeList, childNodeList, 'Same nodelist returned');
	
	// refresh child nodelist
	childNodeList = new glow.NodeList( myNodeList[0].childNodes );
	
	equal(childNodeList[0].nodeName, 'DIV', 'Correct Node');
	equal(childNodeList[1].nodeName, 'SPAN', 'Correct Node');
	equal(childNodeList[2].nodeName, '#text', 'Correct Node');
	equal(childNodeList[3].nodeName, 'SPAN', 'Correct Node');
	equal(childNodeList[4].nodeName, 'DIV', 'Correct Node');
	equal(childNodeList[5].nodeName, 'SPAN', 'Correct Node');
	equal(childNodeList[6].nodeName, '#comment', 'Correct Node');
	equal(childNodeList[7].nodeName, 'SPAN', 'Correct Node');
	equal(childNodeList[8].nodeName, 'DIV', 'Correct Node');
	equal(childNodeList[9].nodeName, 'SPAN', 'Correct Node');
	equal(childNodeList.length, 10, 'Correct length');
});

module('glow.NodeList#before', {setup:setup, teardown:teardown});

test('glow.NodeList#before html string (single elm)', 6, function() {
	var myNodeList = new glow.NodeList('#twoInnerDivs div, #twoInnerEms em'),
		returnNodeList;
		
	equal(typeof myNodeList.before, 'function', 'glow.NodeList#before is a function');
	
	returnNodeList = myNodeList.before('<span>Hello</span>');
	
	strictEqual(returnNodeList, myNodeList, 'Same nodelist returned');
	
	myNodeList.each(function(i) {
		equal(this.previousSibling.innerHTML, 'Hello', 'Span #' + (i+1) + ' created');
	});
});

test('glow.NodeList#before html string (multiple elm)', 17, function() {
	var myNodeList = new glow.NodeList('#twoInnerDivs div, #twoInnerEms em'),
		returnNodeList;
		
	returnNodeList = myNodeList.before('<span>Hello</span>World<!-- comment --><span>Foobar</span>');
	strictEqual(returnNodeList, myNodeList, 'Same nodelist returned');
	
	new glow.NodeList('#twoInnerDivs div, #twoInnerEms em').each(function(i) {
		equal(this.previousSibling.previousSibling.previousSibling.previousSibling.nodeName, 'SPAN', 'Span 1 in elm #' + (i+1) + ' created');
		equal(this.previousSibling.previousSibling.previousSibling.nodeType, 3, 'Text node in elm #' + (i+1) + ' created');
		equal(this.previousSibling.previousSibling.nodeType, 8, 'Comment node in elm #' + (i+1) + ' created');
		equal(this.previousSibling.nodeName, 'SPAN', 'Span 1 in elm #' + (i+1) + ' created');
	});
});

test('glow.NodeList#before html element (single elm)', 7, function() {
	var myNodeList = new glow.NodeList('#twoInnerDivs div, #twoInnerEms em'),
		elementToMove = new glow.NodeList('span.elementToMove'),
		returnNodeList;

	returnNodeList = myNodeList.before( elementToMove[0] );
	
	strictEqual(returnNodeList, myNodeList, 'Same nodelist returned');
	
	equal( new glow.NodeList('span.elementToMove').length, 4, '4 elements with class "elementToMove"' );
	
	myNodeList.each(function(i) {
		equal(this.previousSibling.innerHTML, 'toMove', 'Span #' + (i+1) + ' created');
	});
	
	strictEqual( myNodeList[0].previousSibling, elementToMove[0], 'Element moved' );
});

test('glow.NodeList#before html element (multiple elms)', 21, function() {
	var myNodeList = new glow.NodeList('#twoInnerDivs div, #twoInnerEms em'),
		elementsToMove = new glow.NodeList('span.elementToMove, span.elementToMove2'),
		returnNodeList;

	returnNodeList = myNodeList.before(elementsToMove);
	
	strictEqual(returnNodeList, myNodeList, 'Same nodelist returned');
	
	equal( new glow.NodeList('span.elementToMove').length, 4, '4 elements with class "elementToMove"' );
	equal( new glow.NodeList('span.elementToMove2').length, 4, '4 elements with class "elementToMove2"' );
	
	new glow.NodeList('#twoInnerDivs div, #twoInnerEms em').each(function(i) {
		equal(this.previousSibling.previousSibling.nodeName, 'SPAN', 'Span 1 in elm #' + (i+1) + ' created');
		equal(this.previousSibling.previousSibling.innerHTML, 'toMove', 'Span 1 in elm #' + (i+1) + ' has correct innerHTML');
		equal(this.previousSibling.nodeName, 'SPAN', 'Span 2 in elm #' + (i+1) + ' created');
		equal(this.previousSibling.innerHTML, 'toMove2', 'Span 2 in elm #' + (i+1) + ' has correct innerHTML');
	});
	
	strictEqual( myNodeList[0].previousSibling.previousSibling, elementsToMove[0], 'Element moved' );
	strictEqual( myNodeList[0].previousSibling, elementsToMove[1], 'Element moved' );
});

test('glow.NodeList#before empty lists', 5, function() {
	var emptyList = new glow.NodeList(),
		populatedList = new glow.NodeList('#innerDiv1');
	
	equal(emptyList.before('<span></span>').constructor, glow.NodeList, 'Empty nodelist');
	equal(populatedList.before(undefined)[0].innerHTML, 'D', 'Undefined param results in no change to nodelist');
	equal(populatedList.before(null)[0].innerHTML, 'D', 'Null param results in no change to nodelist');
	equal(populatedList.before(emptyList)[0].innerHTML, 'D', 'Empty nodelist param results in no change to nodelist');
	equal(new glow.NodeList('<span>hey</span>').before('<b></b>')[0].innerHTML, 'hey', 'Node with no parent');
	
});

test('glow.NodeList#before on detatched elements & non-elements', 12, function() {
	var myNodeList = new glow.NodeList('<div><div></div>Hello<div></div><!--comment--><div></div></div>'),
		childNodeList,
		returnNodeList;
	
	// get child nodes of nodelist, including text and comment
	childNodeList = new glow.NodeList( myNodeList[0].childNodes );
	
	returnNodeList = childNodeList.before('<span>Hello</span>');
	
	strictEqual(returnNodeList, childNodeList, 'Same nodelist returned');
	
	// refresh child nodelist
	childNodeList = new glow.NodeList( myNodeList[0].childNodes );
	
	equal(childNodeList[0].nodeName, 'SPAN', 'Correct Node');
	equal(childNodeList[1].nodeName, 'DIV', 'Correct Node');
	equal(childNodeList[2].nodeName, 'SPAN', 'Correct Node');
	equal(childNodeList[3].nodeName, '#text', 'Correct Node');
	equal(childNodeList[4].nodeName, 'SPAN', 'Correct Node');
	equal(childNodeList[5].nodeName, 'DIV', 'Correct Node');
	equal(childNodeList[6].nodeName, 'SPAN', 'Correct Node');
	equal(childNodeList[7].nodeName, '#comment', 'Correct Node');
	equal(childNodeList[8].nodeName, 'SPAN', 'Correct Node');
	equal(childNodeList[9].nodeName, 'DIV', 'Correct Node');
	equal(childNodeList.length, 10, 'Correct length');
});

module('glow.NodeList#append', {setup:setup, teardown:teardown});

test('glow.NodeList#append html string (single elm)', 6, function() {
	var myNodeList = new glow.NodeList('#twoInnerDivs div, #twoInnerEms em'),
		returnNodeList;
		
	equal(typeof myNodeList.append, 'function', 'glow.NodeList#append is a function');
	
	returnNodeList = myNodeList.append('<span>Hello</span>');
	
	strictEqual(returnNodeList, myNodeList, 'Same nodelist returned');
	
	myNodeList.each(function(i) {
		equal(this.lastChild.innerHTML, 'Hello', 'Span #' + (i+1) + ' created');
	});
});

test('glow.NodeList#append html string (multiple elm)', 17, function() {
	var myNodeList = new glow.NodeList('#twoInnerDivs div, #twoInnerEms em'),
		returnNodeList;
		
	returnNodeList = myNodeList.append('<span>Hello</span>World<!-- comment --><span>Foobar</span>');
	strictEqual(returnNodeList, myNodeList, 'Same nodelist returned');
	
	new glow.NodeList('#twoInnerDivs div, #twoInnerEms em').each(function(i) {
		var childNodes = this.childNodes,
			len = childNodes.length;
		
		equal(childNodes[len-4].nodeName, 'SPAN', 'Span 1 in elm #' + (i+1) + ' created');
		equal(childNodes[len-3].nodeType, 3, 'Text node in elm #' + (i+1) + ' created');
		equal(childNodes[len-2].nodeType, 8, 'Comment node in elm #' + (i+1) + ' created');
		equal(childNodes[len-1].nodeName, 'SPAN', 'Span 1 in elm #' + (i+1) + ' created');
	});
});

test('glow.NodeList#append html element (single elm)', 7, function() {
	var myNodeList = new glow.NodeList('#twoInnerDivs div, #twoInnerEms em'),
		elementToMove = new glow.NodeList('span.elementToMove'),
		returnNodeList;

	returnNodeList = myNodeList.append( elementToMove[0] );
	
	strictEqual(returnNodeList, myNodeList, 'Same nodelist returned');
	
	equal( new glow.NodeList('span.elementToMove').length, 4, '4 elements with class "elementToMove"' );
	
	myNodeList.each(function(i) {
		equal(this.lastChild.innerHTML, 'toMove', 'Span #' + (i+1) + ' created');
	});
	
	strictEqual( myNodeList[0].lastChild, elementToMove[0], 'Element moved' );
});

test('glow.NodeList#append html element (multiple elms)', 21, function() {
	var myNodeList = new glow.NodeList('#twoInnerDivs div, #twoInnerEms em'),
		elementsToMove = new glow.NodeList('span.elementToMove, span.elementToMove2'),
		returnNodeList;

	returnNodeList = myNodeList.append(elementsToMove);
	
	strictEqual(returnNodeList, myNodeList, 'Same nodelist returned');
	
	equal( new glow.NodeList('span.elementToMove').length, 4, '4 elements with class "elementToMove"' );
	equal( new glow.NodeList('span.elementToMove2').length, 4, '4 elements with class "elementToMove2"' );
	
	new glow.NodeList('#twoInnerDivs div, #twoInnerEms em').each(function(i) {
		var childNodes = this.childNodes,
			len = childNodes.length;
			
		equal(childNodes[len-2].nodeName, 'SPAN', 'Span 1 in elm #' + (i+1) + ' created');
		equal(childNodes[len-2].innerHTML, 'toMove', 'Span 1 in elm #' + (i+1) + ' has correct innerHTML');
		equal(childNodes[len-1].nodeName, 'SPAN', 'Span 2 in elm #' + (i+1) + ' created');
		equal(childNodes[len-1].innerHTML, 'toMove2', 'Span 2 in elm #' + (i+1) + ' has correct innerHTML');
	});
	
	strictEqual( myNodeList[0].childNodes[ myNodeList[0].childNodes.length-2 ], elementsToMove[0], 'Element moved' );
	strictEqual( myNodeList[0].lastChild, elementsToMove[1], 'Element moved' );
});

test('glow.NodeList#append empty lists', 5, function() {
	var emptyList = new glow.NodeList(),
		populatedList = new glow.NodeList('#innerDiv1');
	
	equal(emptyList.append('<span></span>').constructor, glow.NodeList, 'Empty nodelist');
	equal(populatedList.append(undefined)[0].innerHTML, 'D', 'Undefined param results in no change to nodelist');
	equal(populatedList.append(null)[0].innerHTML, 'D', 'Null param results in no change to nodelist');
	equal(populatedList.append(emptyList)[0].innerHTML, 'D', 'Empty nodelist param results in no change to nodelist');
	equal(new glow.NodeList('<span>hey</span>').append('<b></b>')[0].childNodes.length, 2, 'Node with no parent');
});

test('glow.NodeList#append on detatched elements & non-elements', 10, function() {
	var myNodeList = new glow.NodeList('<div><div></div>Hello<div></div><!--comment--><div></div></div>'),
		childNodeList,
		returnNodeList;
	
	// get child nodes of nodelist, including text and comment
	childNodeList = new glow.NodeList( myNodeList[0].childNodes );
	
	returnNodeList = childNodeList.append('<span>Hello</span>');
	
	strictEqual(returnNodeList, childNodeList, 'Same nodelist returned');
	
	// refresh child nodelist
	childNodeList = new glow.NodeList( myNodeList[0].childNodes );
	
	equal(childNodeList[0].nodeName, 'DIV', 'Correct Node');
	equal(childNodeList[1].nodeName, '#text', 'Correct Node');
	equal(childNodeList[2].nodeName, 'DIV', 'Correct Node');
	equal(childNodeList[3].nodeName, '#comment', 'Correct Node');
	equal(childNodeList[4].nodeName, 'DIV', 'Correct Node');
	equal(childNodeList.length, 5, 'Correct length');
	
	equal(childNodeList[0].lastChild.innerHTML, 'Hello', 'Span added');
	equal(childNodeList[2].lastChild.innerHTML, 'Hello', 'Span added');
	equal(childNodeList[4].lastChild.innerHTML, 'Hello', 'Span added');
});

module('glow.NodeList#prepend', {setup:setup, teardown:teardown});

test('glow.NodeList#prepend html string (single elm)', 6, function() {
	var myNodeList = new glow.NodeList('#twoInnerDivs div, #twoInnerEms em'),
		returnNodeList;
		
	equal(typeof myNodeList.prepend, 'function', 'glow.NodeList#prepend is a function');
	
	returnNodeList = myNodeList.prepend('<span>Hello</span>');
	
	strictEqual(returnNodeList, myNodeList, 'Same nodelist returned');
	
	myNodeList.each(function(i) {
		equal(this.firstChild.innerHTML, 'Hello', 'Span #' + (i+1) + ' created');
	});
});

test('glow.NodeList#prepend html string (multiple elm)', 17, function() {
	var myNodeList = new glow.NodeList('#twoInnerDivs div, #twoInnerEms em'),
		returnNodeList;
		
	returnNodeList = myNodeList.prepend('<span>Hello</span>World<!-- comment --><span>Foobar</span>');
	strictEqual(returnNodeList, myNodeList, 'Same nodelist returned');
	
	new glow.NodeList('#twoInnerDivs div, #twoInnerEms em').each(function(i) {
		var childNodes = this.childNodes;
		
		equal(childNodes[0].nodeName, 'SPAN', 'Span 1 in elm #' + (i+1) + ' created');
		equal(childNodes[1].nodeType, 3, 'Text node in elm #' + (i+1) + ' created');
		equal(childNodes[2].nodeType, 8, 'Comment node in elm #' + (i+1) + ' created');
		equal(childNodes[3].nodeName, 'SPAN', 'Span 1 in elm #' + (i+1) + ' created');
	});
});

test('glow.NodeList#prepend html element (single elm)', 7, function() {
	var myNodeList = new glow.NodeList('#twoInnerDivs div, #twoInnerEms em'),
		elementToMove = new glow.NodeList('span.elementToMove'),
		returnNodeList;

	returnNodeList = myNodeList.prepend( elementToMove[0] );
	
	strictEqual(returnNodeList, myNodeList, 'Same nodelist returned');
	
	equal( new glow.NodeList('span.elementToMove').length, 4, '4 elements with class "elementToMove"' );
	
	myNodeList.each(function(i) {
		equal(this.firstChild.innerHTML, 'toMove', 'Span #' + (i+1) + ' created');
	});
	
	strictEqual( myNodeList[0].firstChild, elementToMove[0], 'Element moved' );
});

test('glow.NodeList#prepend html element (multiple elms)', 21, function() {
	var myNodeList = new glow.NodeList('#twoInnerDivs div, #twoInnerEms em'),
		elementsToMove = new glow.NodeList('span.elementToMove, span.elementToMove2'),
		returnNodeList;

	returnNodeList = myNodeList.prepend(elementsToMove);
	
	strictEqual(returnNodeList, myNodeList, 'Same nodelist returned');
	
	equal( new glow.NodeList('span.elementToMove').length, 4, '4 elements with class "elementToMove"' );
	equal( new glow.NodeList('span.elementToMove2').length, 4, '4 elements with class "elementToMove2"' );
	
	new glow.NodeList('#twoInnerDivs div, #twoInnerEms em').each(function(i) {
		var childNodes = this.childNodes;
			
		equal(childNodes[0].nodeName, 'SPAN', 'Span 1 in elm #' + (i+1) + ' created');
		equal(childNodes[0].innerHTML, 'toMove', 'Span 1 in elm #' + (i+1) + ' has correct innerHTML');
		equal(childNodes[1].nodeName, 'SPAN', 'Span 2 in elm #' + (i+1) + ' created');
		equal(childNodes[1].innerHTML, 'toMove2', 'Span 2 in elm #' + (i+1) + ' has correct innerHTML');
	});
	
	strictEqual( myNodeList[0].childNodes[0], elementsToMove[0], 'Element moved' );
	strictEqual( myNodeList[0].childNodes[1], elementsToMove[1], 'Element moved' );
});

test('glow.NodeList#prepend empty lists', 5, function() {
	var emptyList = new glow.NodeList(),
		populatedList = new glow.NodeList('#innerDiv1');
	
	equal(emptyList.prepend('<span></span>').constructor, glow.NodeList, 'Empty nodelist');
	equal(populatedList.prepend(undefined)[0].innerHTML, 'D', 'Undefined param results in no change to nodelist');
	equal(populatedList.prepend(null)[0].innerHTML, 'D', 'Null param results in no change to nodelist');
	equal(populatedList.prepend(emptyList)[0].innerHTML, 'D', 'Empty nodelist param results in no change to nodelist');
	equal(new glow.NodeList('<span>hey</span>').prepend('<b></b>')[0].childNodes.length, 2, 'Node with no parent');
});

test('glow.NodeList#prepend on detatched elements & non-elements', 10, function() {
	var myNodeList = new glow.NodeList('<div><div></div>Hello<div></div><!--comment--><div></div></div>'),
		childNodeList,
		returnNodeList;
	
	// get child nodes of nodelist, including text and comment
	childNodeList = new glow.NodeList( myNodeList[0].childNodes );
	
	returnNodeList = childNodeList.prepend('<span>Hello</span>');
	
	strictEqual(returnNodeList, childNodeList, 'Same nodelist returned');
	
	// refresh child nodelist
	childNodeList = new glow.NodeList( myNodeList[0].childNodes );
	
	equal(childNodeList[0].nodeName, 'DIV', 'Correct Node');
	equal(childNodeList[1].nodeName, '#text', 'Correct Node');
	equal(childNodeList[2].nodeName, 'DIV', 'Correct Node');
	equal(childNodeList[3].nodeName, '#comment', 'Correct Node');
	equal(childNodeList[4].nodeName, 'DIV', 'Correct Node');
	equal(childNodeList.length, 5, 'Correct length');
	
	equal(childNodeList[0].firstChild.innerHTML, 'Hello', 'Span added');
	equal(childNodeList[2].firstChild.innerHTML, 'Hello', 'Span added');
	equal(childNodeList[4].firstChild.innerHTML, 'Hello', 'Span added');
});

module('glow.NodeList#appendTo', {setup:setup, teardown:teardown});

test('glow.NodeList#appendTo html string (single elm)', 8, function() {
	var myNodeList = new glow.NodeList('<span>Hello</span>'),
		returnNodeList;
		
	equal(typeof myNodeList.appendTo, 'function', 'glow.NodeList#appendTo is a function');
	
	returnNodeList = myNodeList.appendTo('#twoInnerDivs div, #twoInnerEms em');
	
	equal(returnNodeList.constructor, glow.NodeList, 'Nodelist returned');
	notEqual(returnNodeList, myNodeList, 'New nodelist returned');
	equal(returnNodeList.length, 4, 'Clones included');
	
	new glow.NodeList('#twoInnerDivs div, #twoInnerEms em').each(function(i) {
		equal(this.lastChild.innerHTML, 'Hello', 'Span #' + (i+1) + ' created');
	});
});

test('glow.NodeList#appendTo html string (multiple elm)', 19, function() {
	var myNodeList = new glow.NodeList('<span>Hello</span>World<!-- comment --><span>Foobar</span>'),
		returnNodeList;
		
	returnNodeList = myNodeList.appendTo('#twoInnerDivs div, #twoInnerEms em');
	
	equal(returnNodeList.constructor, glow.NodeList, 'Nodelist returned');
	notEqual(returnNodeList, myNodeList, 'New nodelist returned');
	equal(returnNodeList.length, 16, 'Clones included');
	
	new glow.NodeList('#twoInnerDivs div, #twoInnerEms em').each(function(i) {
		var childNodes = this.childNodes,
			len = childNodes.length;
		
		equal(childNodes[len-4].nodeName, 'SPAN', 'Span 1 in elm #' + (i+1) + ' created');
		equal(childNodes[len-3].nodeType, 3, 'Text node in elm #' + (i+1) + ' created');
		equal(childNodes[len-2].nodeType, 8, 'Comment node in elm #' + (i+1) + ' created');
		equal(childNodes[len-1].nodeName, 'SPAN', 'Span 1 in elm #' + (i+1) + ' created');
	});
});

test('glow.NodeList#appendTo html element (single elm)', 9, function() {
	var myNodeList = new glow.NodeList('#twoInnerDivs div, #twoInnerEms em'),
		elementToMove = new glow.NodeList('span.elementToMove'),
		returnNodeList;

	returnNodeList = elementToMove.appendTo(myNodeList);
	
	equal(returnNodeList.constructor, glow.NodeList, 'Nodelist returned');
	notEqual(returnNodeList, elementToMove, 'New nodelist returned');
	equal(returnNodeList.length, 4, 'Clones included');
	
	equal( new glow.NodeList('span.elementToMove').length, 4, '4 elements with class "elementToMove"' );
	
	myNodeList.each(function(i) {
		equal(this.lastChild.innerHTML, 'toMove', 'Span #' + (i+1) + ' created');
	});
	
	strictEqual( myNodeList[0].lastChild, elementToMove[0], 'Element moved' );
});

test('glow.NodeList#appendTo html element (multiple elms)', 23, function() {
	var myNodeList = new glow.NodeList('#twoInnerDivs div, #twoInnerEms em'),
		elementsToMove = new glow.NodeList('span.elementToMove, span.elementToMove2'),
		returnNodeList;

	returnNodeList = elementsToMove.appendTo(myNodeList);
	
	equal(returnNodeList.constructor, glow.NodeList, 'Nodelist returned');
	notEqual(returnNodeList, elementsToMove, 'New nodelist returned');
	equal(returnNodeList.length, 8, 'Clones included');
	
	equal( new glow.NodeList('span.elementToMove').length, 4, '4 elements with class "elementToMove"' );
	equal( new glow.NodeList('span.elementToMove2').length, 4, '4 elements with class "elementToMove2"' );
	
	new glow.NodeList('#twoInnerDivs div, #twoInnerEms em').each(function(i) {
		var childNodes = this.childNodes,
			len = childNodes.length;
			
		equal(childNodes[len-2].nodeName, 'SPAN', 'Span 1 in elm #' + (i+1) + ' created');
		equal(childNodes[len-2].innerHTML, 'toMove', 'Span 1 in elm #' + (i+1) + ' has correct innerHTML');
		equal(childNodes[len-1].nodeName, 'SPAN', 'Span 2 in elm #' + (i+1) + ' created');
		equal(childNodes[len-1].innerHTML, 'toMove2', 'Span 2 in elm #' + (i+1) + ' has correct innerHTML');
	});
	
	strictEqual( myNodeList[0].childNodes[ myNodeList[0].childNodes.length-2 ], elementsToMove[0], 'Element moved' );
	strictEqual( myNodeList[0].lastChild, elementsToMove[1], 'Element moved' );
});

test('glow.NodeList#appendTo empty lists', 5, function() {
	var emptyList = new glow.NodeList(),
		populatedList = new glow.NodeList('#innerDiv1');
	
	equal(emptyList.appendTo('<span></span>').constructor, glow.NodeList, 'Empty nodelist');
	equal(populatedList.appendTo(undefined)[0].innerHTML, 'D', 'Undefined param results in no change to nodelist');
	equal(populatedList.appendTo(null)[0].innerHTML, 'D', 'Null param results in no change to nodelist');
	equal(populatedList.appendTo(emptyList)[0].innerHTML, 'D', 'Empty nodelist param results in no change to nodelist');
	ok(new glow.NodeList('<span>hey</span>').appendTo('<b></b>')[0].parentNode, 'Node with no parent');
});

test('glow.NodeList#appendTo on detatched elements & non-elements', 11, function() {
	var myNodeList = new glow.NodeList('<div><div></div>Hello<div></div><!--comment--><div></div></div>'),
		childNodeList,
		returnNodeList;
	
	// get child nodes of nodelist, including text and comment
	childNodeList = new glow.NodeList( myNodeList[0].childNodes );
	
	returnNodeList = new glow.NodeList('<span>Hello</span>').appendTo(childNodeList);
	
	equal(returnNodeList.constructor, glow.NodeList, 'Nodelist returned');
	equal(returnNodeList.length, 3, 'Clones included');
	
	// refresh child nodelist
	childNodeList = new glow.NodeList( myNodeList[0].childNodes );
	
	equal(childNodeList[0].nodeName, 'DIV', 'Correct Node');
	equal(childNodeList[1].nodeName, '#text', 'Correct Node');
	equal(childNodeList[2].nodeName, 'DIV', 'Correct Node');
	equal(childNodeList[3].nodeName, '#comment', 'Correct Node');
	equal(childNodeList[4].nodeName, 'DIV', 'Correct Node');
	equal(childNodeList.length, 5, 'Correct length');
	
	equal(childNodeList[0].lastChild.innerHTML, 'Hello', 'Span added');
	equal(childNodeList[2].lastChild.innerHTML, 'Hello', 'Span added');
	equal(childNodeList[4].lastChild.innerHTML, 'Hello', 'Span added');
});

module('glow.NodeList#prependTo', {setup:setup, teardown:teardown});

test('glow.NodeList#prependTo html string (single elm)', 8, function() {
	var myNodeList = new glow.NodeList('<span>Hello</span>'),
		returnNodeList;
		
	equal(typeof myNodeList.prependTo, 'function', 'glow.NodeList#prependTo is a function');
	
	returnNodeList = myNodeList.prependTo('#twoInnerDivs div, #twoInnerEms em');
	
	equal(returnNodeList.constructor, glow.NodeList, 'Nodelist returned');
	notEqual(returnNodeList, myNodeList, 'New nodelist returned');
	equal(returnNodeList.length, 4, 'Clones included');
	
	new glow.NodeList('#twoInnerDivs div, #twoInnerEms em').each(function(i) {
		equal(this.firstChild.innerHTML, 'Hello', 'Span #' + (i+1) + ' created');
	});
});

test('glow.NodeList#prependTo html string (multiple elm)', 19, function() {
	var myNodeList = new glow.NodeList('<span>Hello</span>World<!-- comment --><span>Foobar</span>'),
		returnNodeList;
		
	returnNodeList = myNodeList.prependTo('#twoInnerDivs div, #twoInnerEms em');
	
	equal(returnNodeList.constructor, glow.NodeList, 'Nodelist returned');
	notEqual(returnNodeList, myNodeList, 'New nodelist returned');
	equal(returnNodeList.length, 16, 'Clones included');
	
	new glow.NodeList('#twoInnerDivs div, #twoInnerEms em').each(function(i) {
		var childNodes = this.childNodes;
		
		equal(childNodes[0].nodeName, 'SPAN', 'Span 1 in elm #' + (i+1) + ' created');
		equal(childNodes[1].nodeType, 3, 'Text node in elm #' + (i+1) + ' created');
		equal(childNodes[2].nodeType, 8, 'Comment node in elm #' + (i+1) + ' created');
		equal(childNodes[3].nodeName, 'SPAN', 'Span 1 in elm #' + (i+1) + ' created');
	});
});

test('glow.NodeList#prependTo html element (single elm)', 9, function() {
	var myNodeList = new glow.NodeList('#twoInnerDivs div, #twoInnerEms em'),
		elementToMove = new glow.NodeList('span.elementToMove'),
		returnNodeList;

	returnNodeList = elementToMove.prependTo(myNodeList);
	
	equal(returnNodeList.constructor, glow.NodeList, 'Nodelist returned');
	notEqual(returnNodeList, elementToMove, 'New nodelist returned');
	equal(returnNodeList.length, 4, 'Clones included');
	
	equal( new glow.NodeList('span.elementToMove').length, 4, '4 elements with class "elementToMove"' );
	
	myNodeList.each(function(i) {
		equal(this.firstChild.innerHTML, 'toMove', 'Span #' + (i+1) + ' created');
	});
	
	strictEqual( myNodeList[0].firstChild, elementToMove[0], 'Element moved' );
});

test('glow.NodeList#prependTo html element (multiple elms)', 23, function() {
	var myNodeList = new glow.NodeList('#twoInnerDivs div, #twoInnerEms em'),
		elementsToMove = new glow.NodeList('span.elementToMove, span.elementToMove2'),
		returnNodeList;

	returnNodeList = elementsToMove.prependTo(myNodeList);
	
	equal(returnNodeList.constructor, glow.NodeList, 'Nodelist returned');
	notEqual(returnNodeList, elementsToMove, 'New nodelist returned');
	equal(returnNodeList.length, 8, 'Clones included');
	
	equal( new glow.NodeList('span.elementToMove').length, 4, '4 elements with class "elementToMove"' );
	equal( new glow.NodeList('span.elementToMove2').length, 4, '4 elements with class "elementToMove2"' );
	
	new glow.NodeList('#twoInnerDivs div, #twoInnerEms em').each(function(i) {
		var childNodes = this.childNodes,
			len = childNodes.length;
			
		equal(childNodes[0].nodeName, 'SPAN', 'Span 1 in elm #' + (i+1) + ' created');
		equal(childNodes[0].innerHTML, 'toMove', 'Span 1 in elm #' + (i+1) + ' has correct innerHTML');
		equal(childNodes[1].nodeName, 'SPAN', 'Span 2 in elm #' + (i+1) + ' created');
		equal(childNodes[1].innerHTML, 'toMove2', 'Span 2 in elm #' + (i+1) + ' has correct innerHTML');
	});
	
	strictEqual( myNodeList[0].firstChild, elementsToMove[0], 'Element moved' );
	strictEqual( myNodeList[0].childNodes[1], elementsToMove[1], 'Element moved' );
});

test('glow.NodeList#prependTo empty lists', 5, function() {
	var emptyList = new glow.NodeList(),
		populatedList = new glow.NodeList('#innerDiv1');
	
	equal(emptyList.prependTo('<span></span>').constructor, glow.NodeList, 'Empty nodelist');
	equal(populatedList.prependTo(undefined)[0].innerHTML, 'D', 'Undefined param results in no change to nodelist');
	equal(populatedList.prependTo(null)[0].innerHTML, 'D', 'Null param results in no change to nodelist');
	equal(populatedList.prependTo(emptyList)[0].innerHTML, 'D', 'Empty nodelist param results in no change to nodelist');
	ok(new glow.NodeList('<span>hey</span>').prependTo('<b></b>')[0].parentNode, 'Node with no parent');
});

test('glow.NodeList#prependTo on detatched elements & non-elements', 11, function() {
	var myNodeList = new glow.NodeList('<div><div></div>Hello<div></div><!--comment--><div></div></div>'),
		childNodeList,
		returnNodeList;
	
	// get child nodes of nodelist, including text and comment
	childNodeList = new glow.NodeList( myNodeList[0].childNodes );
	
	returnNodeList = new glow.NodeList('<span>Hello</span>').prependTo(childNodeList);
	
	equal(returnNodeList.constructor, glow.NodeList, 'Nodelist returned');
	equal(returnNodeList.length, 3, 'Clones included');
	
	// refresh child nodelist
	childNodeList = new glow.NodeList( myNodeList[0].childNodes );
	
	equal(childNodeList[0].nodeName, 'DIV', 'Correct Node');
	equal(childNodeList[1].nodeName, '#text', 'Correct Node');
	equal(childNodeList[2].nodeName, 'DIV', 'Correct Node');
	equal(childNodeList[3].nodeName, '#comment', 'Correct Node');
	equal(childNodeList[4].nodeName, 'DIV', 'Correct Node');
	equal(childNodeList.length, 5, 'Correct length');
	
	equal(childNodeList[0].firstChild.innerHTML, 'Hello', 'Span added');
	equal(childNodeList[2].firstChild.innerHTML, 'Hello', 'Span added');
	equal(childNodeList[4].firstChild.innerHTML, 'Hello', 'Span added');
});

module('glow.NodeList#insertAfter', {setup:setup, teardown:teardown});

test('glow.NodeList#insertAfter html string (single elm)', 8, function() {
	var myNodeList = new glow.NodeList('<span>Hello</span>'),
		returnNodeList;
		
	equal(typeof myNodeList.insertAfter, 'function', 'glow.NodeList#insertAfter is a function');
	
	returnNodeList = myNodeList.insertAfter('#twoInnerDivs div, #twoInnerEms em');
	
	equal(returnNodeList.constructor, glow.NodeList, 'Nodelist returned');
	notEqual(returnNodeList, myNodeList, 'New nodelist returned');
	equal(returnNodeList.length, 4, 'Clones included');
	
	new glow.NodeList('#twoInnerDivs div, #twoInnerEms em').each(function(i) {
		equal(this.nextSibling.innerHTML, 'Hello', 'Span #' + (i+1) + ' created');
	});
});

test('glow.NodeList#insertAfter html string (multiple elm)', 19, function() {
	var myNodeList = new glow.NodeList('<span>Hello</span>World<!-- comment --><span>Foobar</span>'),
		returnNodeList;
		
	returnNodeList = myNodeList.insertAfter('#twoInnerDivs div, #twoInnerEms em');
	
	equal(returnNodeList.constructor, glow.NodeList, 'Nodelist returned');
	notEqual(returnNodeList, myNodeList, 'New nodelist returned');
	equal(returnNodeList.length, 16, 'Clones included');
	
	new glow.NodeList('#twoInnerDivs div, #twoInnerEms em').each(function(i) {
		equal(this.nextSibling.nodeName, 'SPAN', 'Span 1 in elm #' + (i+1) + ' created');
		equal(this.nextSibling.nextSibling.nodeType, 3, 'Text node in elm #' + (i+1) + ' created');
		equal(this.nextSibling.nextSibling.nextSibling.nodeType, 8, 'Comment node in elm #' + (i+1) + ' created');
		equal(this.nextSibling.nextSibling.nextSibling.nextSibling.nodeName, 'SPAN', 'Span 1 in elm #' + (i+1) + ' created');
	});
});

test('glow.NodeList#insertAfter html element (single elm)', 9, function() {
	var myNodeList = new glow.NodeList('#twoInnerDivs div, #twoInnerEms em'),
		elementToMove = new glow.NodeList('span.elementToMove'),
		returnNodeList;

	returnNodeList = elementToMove.insertAfter(myNodeList);
	
	equal(returnNodeList.constructor, glow.NodeList, 'Nodelist returned');
	notEqual(returnNodeList, elementToMove, 'New nodelist returned');
	equal(returnNodeList.length, 4, 'Clones included');
	
	equal( new glow.NodeList('span.elementToMove').length, 4, '4 elements with class "elementToMove"' );
	
	myNodeList.each(function(i) {
		equal(this.nextSibling.innerHTML, 'toMove', 'Span #' + (i+1) + ' created');
	});
	
	strictEqual( myNodeList[0].nextSibling, elementToMove[0], 'Element moved' );
});

test('glow.NodeList#insertAfter html element (multiple elms)', 23, function() {
	var myNodeList = new glow.NodeList('#twoInnerDivs div, #twoInnerEms em'),
		elementsToMove = new glow.NodeList('span.elementToMove, span.elementToMove2'),
		returnNodeList;

	returnNodeList = elementsToMove.insertAfter(myNodeList);
	
	equal(returnNodeList.constructor, glow.NodeList, 'Nodelist returned');
	notEqual(returnNodeList, elementsToMove, 'New nodelist returned');
	equal(returnNodeList.length, 8, 'Clones included');
	
	equal( new glow.NodeList('span.elementToMove').length, 4, '4 elements with class "elementToMove"' );
	equal( new glow.NodeList('span.elementToMove2').length, 4, '4 elements with class "elementToMove2"' );
	
	new glow.NodeList('#twoInnerDivs div, #twoInnerEms em').each(function(i) {
		equal(this.nextSibling.nodeName, 'SPAN', 'Span 1 in elm #' + (i+1) + ' created');
		equal(this.nextSibling.innerHTML, 'toMove', 'Span 1 in elm #' + (i+1) + ' has correct innerHTML');
		equal(this.nextSibling.nextSibling.nodeName, 'SPAN', 'Span 2 in elm #' + (i+1) + ' created');
		equal(this.nextSibling.nextSibling.innerHTML, 'toMove2', 'Span 2 in elm #' + (i+1) + ' has correct innerHTML');
	});
	
	strictEqual( myNodeList[0].nextSibling, elementsToMove[0], 'Element moved' );
	strictEqual( myNodeList[0].nextSibling.nextSibling, elementsToMove[1], 'Element moved' );
});

test('glow.NodeList#insertAfter empty lists', 5, function() {
	var emptyList = new glow.NodeList(),
		populatedList = new glow.NodeList('#innerDiv1');
	
	equal(emptyList.insertAfter('<span></span>').constructor, glow.NodeList, 'Empty nodelist');
	equal(populatedList.insertAfter(undefined)[0].innerHTML, 'D', 'Undefined param results in no change to nodelist');
	equal(populatedList.insertAfter(null)[0].innerHTML, 'D', 'Null param results in no change to nodelist');
	equal(populatedList.insertAfter(emptyList)[0].innerHTML, 'D', 'Empty nodelist param results in no change to nodelist');
	equal(new glow.NodeList('<span>hey</span>').insertAfter('<b></b>')[0].innerHTML, 'hey', 'Node with no parent');
});

test('glow.NodeList#insertAfter on detatched elements & non-elements', 13, function() {
	var myNodeList = new glow.NodeList('<div><div></div>Hello<div></div><!--comment--><div></div></div>'),
		childNodeList,
		returnNodeList;
	
	// get child nodes of nodelist, including text and comment
	childNodeList = new glow.NodeList( myNodeList[0].childNodes );
	
	returnNodeList = new glow.NodeList('<span>Hello</span>').insertAfter(childNodeList);
	
	equal(returnNodeList.constructor, glow.NodeList, 'Nodelist returned');
	equal(returnNodeList.length, 5, 'Clones included');
	
	// refresh child nodelist
	childNodeList = new glow.NodeList( myNodeList[0].childNodes );
	
	equal(childNodeList[0].nodeName, 'DIV', 'Correct Node');
	equal(childNodeList[1].nodeName, 'SPAN', 'Correct Node');
	equal(childNodeList[2].nodeName, '#text', 'Correct Node');
	equal(childNodeList[3].nodeName, 'SPAN', 'Correct Node');
	equal(childNodeList[4].nodeName, 'DIV', 'Correct Node');
	equal(childNodeList[5].nodeName, 'SPAN', 'Correct Node');
	equal(childNodeList[6].nodeName, '#comment', 'Correct Node');
	equal(childNodeList[7].nodeName, 'SPAN', 'Correct Node');
	equal(childNodeList[8].nodeName, 'DIV', 'Correct Node');
	equal(childNodeList[9].nodeName, 'SPAN', 'Correct Node');
	equal(childNodeList.length, 10, 'Correct length');
});

module('glow.NodeList#insertBefore', {setup:setup, teardown:teardown});

test('glow.NodeList#insertBefore html string (single elm)', 8, function() {
	var myNodeList = new glow.NodeList('<span>Hello</span>'),
		returnNodeList;
		
	equal(typeof myNodeList.insertBefore, 'function', 'glow.NodeList#insertBefore is a function');
	
	returnNodeList = myNodeList.insertBefore('#twoInnerDivs div, #twoInnerEms em');
	
	equal(returnNodeList.constructor, glow.NodeList, 'Nodelist returned');
	notEqual(returnNodeList, myNodeList, 'New nodelist returned');
	equal(returnNodeList.length, 4, 'Clones included');
	
	new glow.NodeList('#twoInnerDivs div, #twoInnerEms em').each(function(i) {
		equal(this.previousSibling.innerHTML, 'Hello', 'Span #' + (i+1) + ' created');
	});
});

test('glow.NodeList#insertBefore html string (multiple elm)', 19, function() {
	var myNodeList = new glow.NodeList('<span>Hello</span>World<!-- comment --><span>Foobar</span>'),
		returnNodeList;
		
	returnNodeList = myNodeList.insertBefore('#twoInnerDivs div, #twoInnerEms em');
	
	equal(returnNodeList.constructor, glow.NodeList, 'Nodelist returned');
	notEqual(returnNodeList, myNodeList, 'New nodelist returned');
	equal(returnNodeList.length, 16, 'Clones included');
	
	new glow.NodeList('#twoInnerDivs div, #twoInnerEms em').each(function(i) {
		equal(this.previousSibling.previousSibling.previousSibling.previousSibling.nodeName, 'SPAN', 'Span 1 in elm #' + (i+1) + ' created');
		equal(this.previousSibling.previousSibling.previousSibling.nodeType, 3, 'Text node in elm #' + (i+1) + ' created');
		equal(this.previousSibling.previousSibling.nodeType, 8, 'Comment node in elm #' + (i+1) + ' created');
		equal(this.previousSibling.nodeName, 'SPAN', 'Span 1 in elm #' + (i+1) + ' created');
	});
});

test('glow.NodeList#insertBefore html element (single elm)', 9, function() {
	var myNodeList = new glow.NodeList('#twoInnerDivs div, #twoInnerEms em'),
		elementToMove = new glow.NodeList('span.elementToMove'),
		returnNodeList;

	returnNodeList = elementToMove.insertBefore(myNodeList);
	
	equal(returnNodeList.constructor, glow.NodeList, 'Nodelist returned');
	notEqual(returnNodeList, elementToMove, 'New nodelist returned');
	equal(returnNodeList.length, 4, 'Clones included');
	
	equal( new glow.NodeList('span.elementToMove').length, 4, '4 elements with class "elementToMove"' );
	
	myNodeList.each(function(i) {
		equal(this.previousSibling.innerHTML, 'toMove', 'Span #' + (i+1) + ' created');
	});
	
	strictEqual( myNodeList[0].previousSibling, elementToMove[0], 'Element moved' );
});

test('glow.NodeList#insertBefore html element (multiple elms)', 23, function() {
	var myNodeList = new glow.NodeList('#twoInnerDivs div, #twoInnerEms em'),
		elementsToMove = new glow.NodeList('span.elementToMove, span.elementToMove2'),
		returnNodeList;

	returnNodeList = elementsToMove.insertBefore(myNodeList);
	
	equal(returnNodeList.constructor, glow.NodeList, 'Nodelist returned');
	notEqual(returnNodeList, elementsToMove, 'New nodelist returned');
	equal(returnNodeList.length, 8, 'Clones included');
	
	equal( new glow.NodeList('span.elementToMove').length, 4, '4 elements with class "elementToMove"' );
	equal( new glow.NodeList('span.elementToMove2').length, 4, '4 elements with class "elementToMove2"' );
	
	new glow.NodeList('#twoInnerDivs div, #twoInnerEms em').each(function(i) {
		equal(this.previousSibling.previousSibling.nodeName, 'SPAN', 'Span 1 in elm #' + (i+1) + ' created');
		equal(this.previousSibling.previousSibling.innerHTML, 'toMove', 'Span 1 in elm #' + (i+1) + ' has correct innerHTML');
		equal(this.previousSibling.nodeName, 'SPAN', 'Span 2 in elm #' + (i+1) + ' created');
		equal(this.previousSibling.innerHTML, 'toMove2', 'Span 2 in elm #' + (i+1) + ' has correct innerHTML');
	});
	
	strictEqual( myNodeList[0].previousSibling.previousSibling, elementsToMove[0], 'Element moved' );
	strictEqual( myNodeList[0].previousSibling, elementsToMove[1], 'Element moved' );
});

test('glow.NodeList#insertBefore empty lists', 5, function() {
	var emptyList = new glow.NodeList(),
		populatedList = new glow.NodeList('#innerDiv1');
	
	equal(emptyList.insertBefore('<span></span>').constructor, glow.NodeList, 'Empty nodelist');
	equal(populatedList.insertBefore(undefined)[0].innerHTML, 'D', 'Undefined param results in no change to nodelist');
	equal(populatedList.insertBefore(null)[0].innerHTML, 'D', 'Null param results in no change to nodelist');
	equal(populatedList.insertBefore(emptyList)[0].innerHTML, 'D', 'Empty nodelist param results in no change to nodelist');
	equal(new glow.NodeList('<span>hey</span>').insertBefore('<b></b>')[0].innerHTML, 'hey', 'Node with no parent');
});

test('glow.NodeList#insertBefore on detatched elements & non-elements', 13, function() {
	var myNodeList = new glow.NodeList('<div><div></div>Hello<div></div><!--comment--><div></div></div>'),
		childNodeList,
		returnNodeList;
	
	// get child nodes of nodelist, including text and comment
	childNodeList = new glow.NodeList( myNodeList[0].childNodes );
	
	returnNodeList = new glow.NodeList('<span>Hello</span>').insertBefore(childNodeList);
	
	equal(returnNodeList.constructor, glow.NodeList, 'Nodelist returned');
	equal(returnNodeList.length, 5, 'Clones included');
	
	// refresh child nodelist
	childNodeList = new glow.NodeList( myNodeList[0].childNodes );
	
	equal(childNodeList[0].nodeName, 'SPAN', 'Correct Node');
	equal(childNodeList[1].nodeName, 'DIV', 'Correct Node');
	equal(childNodeList[2].nodeName, 'SPAN', 'Correct Node');
	equal(childNodeList[3].nodeName, '#text', 'Correct Node');
	equal(childNodeList[4].nodeName, 'SPAN', 'Correct Node');
	equal(childNodeList[5].nodeName, 'DIV', 'Correct Node');
	equal(childNodeList[6].nodeName, 'SPAN', 'Correct Node');
	equal(childNodeList[7].nodeName, '#comment', 'Correct Node');
	equal(childNodeList[8].nodeName, 'SPAN', 'Correct Node');
	equal(childNodeList[9].nodeName, 'DIV', 'Correct Node');
	equal(childNodeList.length, 10, 'Correct length');
});

module('glow.NodeList#destroy', {setup:setup, teardown:teardown});

test('glow.NodeList#destroy removes elements', 5, function() {
	var myNodeList = new glow.NodeList( byId('elmWithMixedNodes').childNodes ),
		returnNodeList;
	
	equal(typeof myNodeList.destroy, 'function', 'glow.NodeList#destroy is a function');
	
	returnNodeList = myNodeList.destroy();
	
	equal(returnNodeList.constructor, glow.NodeList, 'Nodelist returned');
	notEqual(returnNodeList, myNodeList, 'New nodelist returned');
	strictEqual(returnNodeList.length, 0, 'New nodelist is empty');
	
	strictEqual( byId('elmWithMixedNodes').childNodes.length, 0, 'Elements have been removed from document' );
	
	myNodeList.each(function() {
		// IE (noticed in IE7) barfs when trying to access the parent node after it's been destroyed
		try {
			if (this.parentNode) {
				//ok(false, 'Node has no parent node');
			}
		} catch (e) {}
	});
});

test('glow.NodeList#destroy edge cases', 6, function() {
	// empty nodelist
	var myNodeList = new glow.NodeList(),
		returnNodeList;
	
	returnNodeList = myNodeList.destroy();
	
	equal(returnNodeList.constructor, glow.NodeList, 'Nodelist returned');
	notEqual(returnNodeList, myNodeList, 'New nodelist returned');
	strictEqual(returnNodeList.length, 0, 'New nodelist is empty');
	
	// elements with no parent
	myNodeList = new glow.NodeList('<div></div>Hello<!--comment-->');
	returnNodeList = myNodeList.destroy();
	
	equal(returnNodeList.constructor, glow.NodeList, 'Nodelist returned');
	notEqual(returnNodeList, myNodeList, 'New nodelist returned');
	strictEqual(returnNodeList.length, 0, 'New nodelist is empty');
});

test('glow.NodeList#destroy removes events', 1, function() {
	ok(false, 'Todo (waiting on DOM events)');
});

test('glow.NodeList#destroy removes data', 1, function() {
	ok(false, 'Todo (waiting on #data)');
});

module('glow.NodeList#remove', {setup:setup, teardown:teardown});

test('glow.NodeList#remove removes elements', 3, function() {
	var myNodeList = new glow.NodeList( byId('elmWithMixedNodes').childNodes ),
		returnNodeList;
	
	equal(typeof myNodeList.remove, 'function', 'glow.NodeList#remove is a function');
	
	returnNodeList = myNodeList.remove();
	
	equal(returnNodeList, myNodeList, 'Same Nodelist returned');
	
	strictEqual( byId('elmWithMixedNodes').childNodes.length, 0, 'Elements have been removed from parent' );
	
	myNodeList.each(function() {
		// Checking the length of the parent to catch and IE bug
		// If an element enters & leaves a document fragment, it'll have the fragment as its parentNode when it's supposed to be null
		if (this.parentNode && this.parentNode.length) {
			ok(false, 'Node has no parent node');
		}
	});
});

test('glow.NodeList#remove edge cases', 2, function() {
	var myNodeList = new glow.NodeList(),
		returnNodeList;
	
	returnNodeList = myNodeList.remove();
	
	equal(returnNodeList, myNodeList, 'Same Nodelist returned');
	
	// elements with no parent
	myNodeList = new glow.NodeList('<div></div>Hello<!--comment-->');
	returnNodeList = myNodeList.remove();
	
	equal(returnNodeList, myNodeList, 'Same Nodelist returned');
});

module('glow.NodeList#empty', {setup:setup, teardown:teardown});

test('glow.NodeList#empty', 5, function() {
	var myNodeList = new glow.NodeList('#twoInnerDivs, #elmWithMixedNodes'),
		checkElm = byId('innerDiv1'),
		returnNodeList;
	
	equal(typeof myNodeList.empty, 'function', 'glow.NodeList#empty is a function');	
	
	returnNodeList = myNodeList.empty();
	
	equal(returnNodeList, myNodeList, 'Same Nodelist returned');
	
	strictEqual(returnNodeList[0].childNodes.length, 0, '#twoInnerDivs has no child nodes');
	strictEqual(returnNodeList[1].childNodes.length, 0, '#elmWithMixedNodes has no child nodes');
	
	equal(checkElm.innerHTML, 'D', 'Removed element has retained inner nodes');
});

test('glow.NodeList#empty edge cases', 1, function() {
	var myNodeList = new glow.NodeList(),
		returnNodeList;
	
	returnNodeList = myNodeList.empty();
	
	equal(returnNodeList, myNodeList, 'Same Nodelist returned');
});

module('glow.NodeList#replaceWith', {setup:setup, teardown:teardown});

test('glow.NodeList#replaceWith html string (single elm)', 6, function() {
	var myNodeList = new glow.NodeList('#twoInnerDivs div, #twoInnerEms em'),
		returnNodeList;
		
	equal(typeof myNodeList.replaceWith, 'function', 'glow.NodeList#replaceWith is a function');
	
	returnNodeList = myNodeList.replaceWith('<span>Hello</span>');
	
	strictEqual(returnNodeList, myNodeList, 'Same nodelist returned');
	
	new glow.NodeList('#twoInnerDivs > *, #twoInnerEms > *').each(function(i) {
		equal(this.nodeName, 'SPAN', 'Span #' + (i+1) + ' created');
	});
});

test('glow.NodeList#replaceWith html string (multiple elm)', 19, function() {
	var myNodeList = new glow.NodeList('#twoInnerDivs div, #twoInnerEms em'),
		returnNodeList;
		
	returnNodeList = myNodeList.replaceWith('<span>Hello</span>World<!-- comment --><span>Foobar</span>');
	strictEqual(returnNodeList, myNodeList, 'Same nodelist returned');
	
	new glow.NodeList('#twoInnerDivs, #twoInnerEms').each(function(i) {
		// skip starting text node
		equal(this.childNodes[1].nodeName, 'SPAN', 'Span in elm #' + (i+1) + ' created');
		equal(this.childNodes[2].nodeType, 3, 'Text node in elm #' + (i+1) + ' created');
		equal(this.childNodes[3].nodeType, 8, 'Comment node in elm #' + (i+1) + ' created');
		equal(this.childNodes[4].nodeName, 'SPAN', 'Span in elm #' + (i+1) + ' created');
		// skip text node
		equal(this.childNodes[6].nodeName, 'SPAN', 'Span in elm #' + (i+1) + ' created');
		equal(this.childNodes[7].nodeType, 3, 'Text node in elm #' + (i+1) + ' created');
		equal(this.childNodes[8].nodeType, 8, 'Comment node in elm #' + (i+1) + ' created');
		equal(this.childNodes[9].nodeName, 'SPAN', 'Span in elm #' + (i+1) + ' created');
		equal(this.childNodes.length, 11, 'Correct length');
	});
});

test('glow.NodeList#replaceWith html element (single elm)', 7, function() {
	var myNodeList = new glow.NodeList('#twoInnerDivs div, #twoInnerEms em'),
		elementToMove = new glow.NodeList('span.elementToMove'),
		returnNodeList;

	returnNodeList = myNodeList.replaceWith( elementToMove[0] );
	
	strictEqual(returnNodeList, myNodeList, 'Same nodelist returned');
	
	equal( new glow.NodeList('span.elementToMove').length, 4, '4 elements with class "elementToMove"' );
	
	new glow.NodeList('#twoInnerDivs > *, #twoInnerEms > *').each(function(i) {
		equal(this.innerHTML, 'toMove', 'Span #' + (i+1) + ' created');
	});
	
	strictEqual( new glow.NodeList('#twoInnerDivs > *')[0], elementToMove[0], 'Element moved' );
});

test('glow.NodeList#replaceWith html element (multiple elms)', 21, function() {
	var myNodeList = new glow.NodeList('#twoInnerDivs div, #twoInnerEms em'),
		elementsToMove = new glow.NodeList('span.elementToMove, span.elementToMove2'),
		returnNodeList;

	returnNodeList = myNodeList.replaceWith(elementsToMove);
	
	strictEqual(returnNodeList, myNodeList, 'Same nodelist returned');
	
	equal( new glow.NodeList('span.elementToMove').length, 4, '4 elements with class "elementToMove"' );
	equal( new glow.NodeList('span.elementToMove2').length, 4, '4 elements with class "elementToMove2"' );
	
	new glow.NodeList('#twoInnerDivs > *, #twoInnerEms > *').each(function(i) {
		equal(this.nodeName, 'SPAN', 'Span 1 in elm #' + (i+1) + ' created');
		equal(this.innerHTML, i%2 ? 'toMove2' : 'toMove', 'Span 1 in elm #' + (i+1) + ' has correct innerHTML');
	});
	
	strictEqual( new glow.NodeList('#twoInnerDivs > *')[0], elementsToMove[0], 'Element moved' );
	strictEqual( new glow.NodeList('#twoInnerDivs > *')[1], elementsToMove[1], 'Element moved' );
});

test('glow.NodeList#replaceWith empty lists', 5, function() {
	var emptyList = new glow.NodeList(),
		populatedList = new glow.NodeList('#innerDiv1');
	
	equal(emptyList.replaceWith('<span></span>').constructor, glow.NodeList, 'Empty nodelist');
	equal(populatedList.replaceWith(undefined)[0].parentNode, null, 'Undefined param results in element being removed');
	equal(populatedList.replaceWith(null)[0].parentNode, null, 'Null param results in element being removed');
	equal(populatedList.replaceWith(emptyList)[0].parentNode, null, 'Empty nodelist param results in element being removed');
	equal(new glow.NodeList('<span>hey</span>').replaceWith('<b></b>')[0].innerHTML, 'hey', 'Node with no parent');
});

test('glow.NodeList#replaceWith on detatched elements & non-elements', 7, function() {
	var myNodeList = new glow.NodeList('<div><div></div>Hello<div></div><!--comment--><div></div></div>'),
		childNodeList,
		returnNodeList;
	
	// get child nodes of nodelist, including text and comment
	childNodeList = new glow.NodeList( myNodeList[0].childNodes );
	
	returnNodeList = childNodeList.replaceWith('<span>Hello</span>');
	
	strictEqual(returnNodeList, childNodeList, 'Same nodelist returned');
	
	// refresh child nodelist
	childNodeList = new glow.NodeList( myNodeList[0].childNodes );
	
	equal(childNodeList.length, 5, 'Correct length');
	equal(childNodeList[0].nodeName, 'SPAN', 'Correct Node');
	equal(childNodeList[1].nodeName, 'SPAN', 'Correct Node');
	equal(childNodeList[2].nodeName, 'SPAN', 'Correct Node');
	equal(childNodeList[3].nodeName, 'SPAN', 'Correct Node');
	equal(childNodeList[4].nodeName, 'SPAN', 'Correct Node');
});

test('glow.NodeList#replaceWith ID collision', 1, function() {
	// There's a Safari 2 issue where an element's ID attribute is ignored if it's added to the page when another element has the same ID
	// Although we don't support Safari 2 anymore, this test remains in case it crops up again
	
	var toAdd = new glow.NodeList('<span id="innerDiv1"></span>');
	new glow.NodeList('#innerDiv1').replaceWith(toAdd);
	equal(byId('innerDiv1').nodeName, 'SPAN', 'Correct Node');
});

module('glow.NodeList#wrap', {setup:setup, teardown:teardown});

test('glow.dom.NodeList#wrap html string', 4, function() {
	var myNodeList = new glow.NodeList('#gift'),
		returnNodeList;
		
	equal(typeof myNodeList.wrap, 'function', 'glow.NodeList#wrap is a function');
	
	returnNodeList = myNodeList.wrap('<div class="giftwrap"><span class="tissuepaper"></span></div>');
	
	strictEqual(returnNodeList, returnNodeList, 'Same nodelist returned');
	
	equal(myNodeList[0].parentNode.className, 'tissuepaper', 'Wrapped item has new correct parent');
	equal(myNodeList[0].parentNode.parentNode.className, 'giftwrap', 'Wrapped item has new correct parent parent');
});

test('glow.dom.NodeList#wrap html string (single elm)', 4, function() {
	var myNodeList = new glow.NodeList('#gift'),
		returnNodeList;
		
	equal(typeof myNodeList.wrap, 'function', 'glow.NodeList#wrap is a function');
	
	returnNodeList = myNodeList.wrap('<div class="giftwrap"><span class="tissuepaper"></span></div>');
	
	strictEqual(myNodeList, returnNodeList, 'Same nodelist returned');
	
	equal(myNodeList[0].parentNode.className, 'tissuepaper', 'Wrapped item has new correct parent');
	equal(myNodeList[0].parentNode.parentNode.className, 'giftwrap', 'Wrapped item has new correct parent parent');
});

test('glow.dom.NodeList#wrap complex html string (multiple elms)', 14, function() {
	var myNodeList = new glow.NodeList('#wrapTest span.toy'),
		returnNodeList;
	
	returnNodeList = myNodeList.wrap('<div class="giftwrap"><span class="tissuepaper"></span></div>');
	
	strictEqual(returnNodeList, myNodeList, 'Same nodelist returned');
	
	equal(new glow.NodeList('div.giftwrap').length, 3, 'Correct number of wraps');
	
	myNodeList.each(function() {
		equal(this.parentNode.className, 'tissuepaper', 'Wrapped item has new correct parent');
		equal(this.parentNode.childNodes.length, 1, 'Only one element in the wrap');
		equal(this.parentNode.parentNode.className, 'giftwrap', 'Wrapped item has new correct parent parent');
		equal(this.parentNode.parentNode.parentNode.nodeType, 1, 'Wrap has been added to document');
	});
});

test('glow.dom.NodeList#wrap detatched element', 2, function() {
	var myNodeList = new glow.NodeList('<div class="inner">inner</div>'),
		returnNodeList;
	
	returnNodeList = myNodeList.wrap('<div class="outer"></div>');
	
	strictEqual(returnNodeList, myNodeList, 'Same nodelist returned');
	
	equal(myNodeList[0].parentNode.className, 'outer', 'Detatched element wrapped');
});

test('glow.dom.NodeList#wrap element wrapper (multiple elements)', 6, function() {
	var myNodeList = new glow.NodeList('#wrapTest span.toy'),
		wrapperNode = new glow.NodeList('#wrapTests div.wrapper')[0],
		returnNodeList;
	
	returnNodeList = myNodeList.wrap(wrapperNode);
	
	strictEqual(returnNodeList, myNodeList, 'Same nodelist returned');
	
	equal(new glow.NodeList('#wrapTest div.wrapper').length, 3, 'Correct number of wraps');
	
	equal(myNodeList[0].parentNode, wrapperNode, 'Element moved');
	
	myNodeList.each(function() {
		equal(this.parentNode.className, 'wrapper', 'Element wrapped');
	});
});

test('glow.dom.NodeList#wrap edge cases', 5, function() {
	var emptyList = new glow.NodeList(),
		populatedList = new glow.NodeList('#innerDiv1');
	
	equal(emptyList.wrap('<span></span>').constructor, glow.NodeList, 'Empty nodelist');
	equal(populatedList.wrap(undefined)[0].parentNode, byId('twoInnerDivs'), 'Undefined param results in no change');
	equal(populatedList.wrap(null)[0].parentNode, byId('twoInnerDivs'), 'Null param results in no change');
	equal(populatedList.wrap(emptyList)[0].parentNode, byId('twoInnerDivs'), 'Empty nodelist param results in no change');
	equal(populatedList.wrap( document.createTextNode('blarg') )[0].parentNode, byId('twoInnerDivs'), 'Text node param results in no change');
});

module('glow.NodeList#unwrap', {setup:setup, teardown:teardown});

test('glow.dom.NodeList#unwrap multiple elements with same parent', 8, function() {
	var myNodeList = new glow.NodeList( byId('elmWithMixedNodes').childNodes ),
		returnNodeList;
	
	equal(typeof myNodeList.unwrap, 'function', 'glow.NodeList#unwrap is a function');
	
	returnNodeList = myNodeList.unwrap();
	
	strictEqual(returnNodeList, myNodeList, 'Same nodelist returned');
	
	myNodeList.each(function() {
		equal(this.parentNode.id, 'testElmsContainer', 'Node moved to parent');
	});
	
	equal(myNodeList[0].previousSibling.previousSibling.id, 'elmWithTextNodes', 'Node inserted in correct position');
});

test('glow.dom.NodeList#unwrap multiple elements with different parents', 5, function() {
	var myNodeList = new glow.NodeList('#innerDiv2, #innerEm1'),
		returnNodeList;
	
	returnNodeList = myNodeList.unwrap();
	
	strictEqual(returnNodeList, myNodeList, 'Same nodelist returned');
	
	myNodeList.each(function() {
		equal(this.parentNode.id, 'testElmsContainer', 'Node moved to parent');
	});
	
	equal(myNodeList.item(0).prev()[0].id, 'innerDiv1', 'Node inserted in correct position');
	equal(myNodeList.item(1).prev()[0].id, 'innerDiv2', 'Node inserted in correct position');
});

test('glow.dom.NodeList#unwrap element with single detatched parent', 2, function() {
	var myNodeList = new glow.NodeList('<div><span></span></div>'),
		returnNodeList;
	
	myNodeList = myNodeList.children();
	
	returnNodeList = myNodeList.unwrap();
	
	strictEqual(returnNodeList, myNodeList, 'Same nodelist returned');
	
	ok(!myNodeList[0].parentNode, 'Element has no parent');
});

test('glow.dom.NodeList#unwrap element with 2 parents (detatched)', 2, function() {
	var myNodeList = new glow.NodeList('<div class="outer"><div class="inner"><span></span></div></div>'),
		returnNodeList;
	
	myNodeList = myNodeList.children().children();
	
	returnNodeList = myNodeList.unwrap();
	
	strictEqual(returnNodeList, myNodeList, 'Same nodelist returned');
	
	equal(myNodeList[0].parentNode.className, 'outer', 'Element has no parent');
});

test('glow.dom.NodeList#wrap edge cases', 3, function() {
	var emptyList = new glow.NodeList(),
		populatedList = new glow.NodeList('<span></span>');
	
	equal(emptyList.unwrap(), emptyList, 'Empty nodelist');
	equal(populatedList.unwrap(), populatedList, 'orphan element');
	ok(!populatedList.unwrap()[0].parentNode, 'orphan element still no parent');
});