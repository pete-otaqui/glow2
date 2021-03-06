function byId(id) {
	return document.getElementById(id);
}

module('glow.NodeList traversal');

test('glow.NodeList#get', 8, function() {
	
	var myNodeList = new glow.NodeList('#testElmsContainer');
	
	equal(typeof glow.NodeList, 'function', 'glow.NodeList is function');
	
	var nodes = myNodeList.get('span');
	equal(nodes.length, 3, "Returns nodeList with 3 items (match for span)");
	
	equal(nodes[2], byId('secondspan'), "Correct third matched item");
	equal(nodes[1], byId('firstspan'), "Correct second matched item");
	equal(nodes[0], byId('lonespan'), "Correct first matched item");
	
	var nodes = myNodeList.get('span, em');
	
	equal(nodes.length, 5, "Returns nodeList with 5 items (match for span and em)");
	
	var nodes = myNodeList.get('p');
	
	equal(nodes.length, 0, "Returns an empty NodeList if nothing matches");
	
	var myNodeList = new glow.NodeList('.toc');
	
	var nodes = myNodeList.get('li');
	equal(nodes.length, 60, "Returns nodeList with 60 items (match for li)");
	
});

test('glow.NodeList#parent', 6, function() {
	
	var myNodeList = new glow.NodeList('#innerDiv1');
	
	equals(typeof myNodeList.parent, 'function', 'glow.NodeList#parent is function');
	
	var nodes = myNodeList.parent();	
	
	equals(nodes[0], byId('twoInnerDivs'), "Gets direct parents");
	
	myNodeList = new glow.NodeList("#innerDiv1, #innerDiv2");
	
	correctNodes = new glow.NodeList('#twoInnerDivs');
	
	nodes = myNodeList.parent();

	equals(nodes[0], byId('twoInnerDivs'), "Gets only unique parents");
	//add len check
	ok(nodes instanceof glow.NodeList, "Returns NodeList");
	
	myNodeList = new glow.NodeList("document");

	nodes = myNodeList.parent();
	
	equals(nodes.length, 0, "Returns 0 when item has no parents");

	
	var myNodeList = new glow.NodeList('#twoInnerDivs');

	var nodes = myNodeList.parent('#body');
	
	equals(nodes[0], byId('body'), "Gets the first parent that matches the given search value (#testElmsContanier)");
});

test('glow.NodeList#prev', 6, function() {
	var myNodeList = new glow.NodeList('#innerEm2');
	
	equals(typeof myNodeList.prev, 'function', 'glow.NodeList#prev is function');
	
	var nodes = myNodeList.prev();
	
	equals(nodes[0], byId('innerEm1'), "Gets previous elements");	
	
	myNodeList = new glow.NodeList('#constructor');
	
	var nodes = myNodeList.prev();

	equal(nodes.length, 0, "Returns nothing if no previous element");
	
	ok(nodes instanceof glow.NodeList, "Returns NodeList");
	
	var myNodeList = new glow.NodeList('#secondspan');
	
	nodes = myNodeList.prev();
	
	equal(nodes[0], byId('firstspan'), "Skips comment nodes");
	
	var myNodeList = new glow.NodeList('.12sib');
	
	nodes = myNodeList.prev('.6sib');

	equal(nodes[0], byId('prevsibmatch'), "Finds the searched for sibling called 6sib");
});

test('glow.NodeList#next', 6, function() {
	var myNodeList = new glow.NodeList('#innerEm1');

	var nodes = myNodeList.next();
	
	equal(typeof myNodeList.next, 'function', 'glow.NodeList#next is function');
	
	equal(nodes[0], byId('innerEm2'), "Gets next element");
	
	myNodeList = new glow.NodeList('#constructor');
	
	nodes = myNodeList.next();

	equal(nodes.length, 0, "Returns nothing if no next element");
	
	ok(nodes instanceof glow.NodeList, "Returns NodeList");
	
	var myNodeList = new glow.NodeList('#firstspan');
	
	nodes = myNodeList.next();
	
	equal(nodes[0], byId('secondspan'), "Skips comment nodes");
	
	var myNodeList = new glow.NodeList('.6sib');
	
	nodes = myNodeList.next('.12sib');

	equal(nodes[0], byId('nextsibmatch'), "Finds the searched for sibling called 12sib");
});


test('glow.NodeList#ancestors', 14, function() {
	var myNodeList = new glow.NodeList('#innerDiv2');
	
	equal(typeof myNodeList.ancestors, 'function', 'glow.NodeList#ancestors is function');
	
	/* [*]innerDiv2 > [3]twoInnerDivs > [2]testElmsContainer > [1]body > [0]html*/
	
	var nodes = myNodeList.ancestors();
	
	equal(nodes.length, 4, "innerDiv2 has 4 ancestors");
	
	equal(nodes[0], byId('twoInnerDivs'), "Correct first ancestor");
	equal(nodes[1], byId('testElmsContainer'), "Correct second ancestor");
	equal(nodes[2], byId('body'), "Correct third ancestor");
	equal(nodes[3], byId('html'), "Correct fourth ancestor");
	
	/* [*]innerDiv2 > [3]twoInnerDivs > [2]testElmsContainer > [1]body > [0]html*/
	/* [*]innerEm1 > [3]twoInnerEms > [2]testElmsContainer > [1]body > [0]html*/
	var myNodeList = new glow.NodeList('#innerDiv2, #innerEm1');
	
	var nodes = myNodeList.ancestors();

	equal(nodes.length, 5, "innerDiv2 and innerEm1 have 5 ancestors");      
	
	equal(nodes[0], byId('twoInnerDivs'), "Correct first ancestor");
	equal(nodes[1], byId('testElmsContainer'), "Correct second ancestor");
	equal(nodes[2], byId('body'), "Correct third ancestor");
	equal(nodes[3], byId('html'), "Correct fourth ancestor");
	equal(nodes[4], byId('twoInnerEms'), "Correct fifth ancestor");	

	
	ok(nodes instanceof glow.NodeList, "Returns NodeList");
	
	var myNodeList = new glow.NodeList('#innerDiv2');
	var nodes = myNodeList.ancestors('div');
 
	equal(nodes.length, 2, "Ancestors with a filter for divs returns just 2 div elements");
});

test('glow.NodeList#children', 5, function() {
	
	var myNodeList = new glow.NodeList('#twoInnerDivs');
	
	equal(typeof myNodeList.children, 'function', 'glow.NodeList#children is function');
	
	/* [*]twoInnerDivs > innerDiv1 > innerDiv2*/
	var nodes = myNodeList.children();

	equal(nodes.length, 2, "twoInnerDivs has 2 child elements");
	
	equal(nodes[1], byId('innerDiv2'), "Correct first child");
	equal(nodes[0], byId('innerDiv1'), "Correct second child");
	

	
	ok(nodes instanceof glow.NodeList, "Returns NodeList");
	
});

test('glow.NodeList#contains', 5, function() {
	
	var myNodeList = new glow.NodeList('#testElmsContainer');
	
	var toFindNodeList = new glow.NodeList('#mixedcontents');
	
	var foundResults = myNodeList.contains(toFindNodeList);
	
	equal(typeof glow.NodeList, 'function', 'glow.NodeList is function');
	
	ok(foundResults, 'The toFindNodeList was found in myNodeList');
	
	var myNodeList = new glow.NodeList('#testElmsContainer');
	
	var toFindNodeList = new glow.NodeList('#testElmsContainer');
	
	var foundResults = myNodeList.contains(toFindNodeList);

	
	ok(foundResults, 'The toFindNodeList was found in myNodeList when two lists are the same');
	
	var foundResults = myNodeList.contains();
		
	ok(!foundResults, 'Returns false when no paramaters specified');
	
	var myNodeList = new glow.NodeList('#mixedcontents');
	
	var toFindNodeList = new glow.NodeList('#twoInnerEms');
	
	var foundResults = myNodeList.contains();
		
	ok(!foundResults, 'Returns false when items not in target list');
	
});