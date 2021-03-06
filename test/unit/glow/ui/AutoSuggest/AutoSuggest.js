module('glow.ui.AutoSuggest');

test('construction & basic destruction', 4, function() {
	equal(typeof glow.ui.AutoSuggest, 'function', 'glow.ui.AutoSuggest exists');
	
	var autoSuggest = new glow.ui.AutoSuggest();
	
	equal(autoSuggest.constructor, glow.ui.AutoSuggest, 'Has correct constructor');
	ok(autoSuggest instanceof glow.ui.Widget, 'Is instance of Widget');
	
	equal(typeof autoSuggest.destroy, 'function', '#destroy exists');
	autoSuggest.destroy();
});

test('Simple string[] data source find', 6, function() {
	var autoSuggest = new glow.ui.AutoSuggest();
	
	autoSuggest.on('data', function(e) {
		equal(e.data, glow1Aliases, 'data fired with correct data source');
	}).on('results', function(e) {
		same(e.results, [
			{name: 'glow.anim.Timeline#event:complete'},
			{name: 'glow.anim.Timeline#event:resume'},
			{name: 'glow.anim.Timeline#event:start'},
			{name: 'glow.anim.Timeline#event:stop'}
		], 'Correct results found');
	});
	
	equal(typeof autoSuggest.data, 'function', '#data exists');
	equal(autoSuggest.data(glow1Aliases), autoSuggest, '#data returns this');
	
	equal(typeof autoSuggest.find, 'function', '#find exists');
	equal(autoSuggest.find('glow.anim.Timeline#event:'), autoSuggest, '#find returns this');
	
	autoSuggest.destroy();
});

test('object[] data source find', 3, function() {
	var autoSuggest = new glow.ui.AutoSuggest();
	
	autoSuggest.on('data', function(e) {
		equal(e.data, glow1Api, 'data fired with correct data source');
	}).on('results', function(e) {
		same(e.results, [
			{name:"bounceBoth",alias:"glow.tweens.bounceBoth",memberOf:"glow.tweens",type:"Method",href:"glow.tweens.shtml#staticmethod:bounceboth"},
			{name:"bounceIn",alias:"glow.tweens.bounceIn",memberOf:"glow.tweens",type:"Method",href:"glow.tweens.shtml#staticmethod:bouncein"},
			{name:"bounceOut",alias:"glow.tweens.bounceOut",memberOf:"glow.tweens",type:"Method",href:"glow.tweens.shtml#staticmethod:bounceout"}
		], 'Correct results found');
	});
	
	equal(autoSuggest.data(glow1Api), autoSuggest, '#data returns this');
	
	autoSuggest.find('bounce');
	
	autoSuggest.destroy();
});

test('maxResults', 1, function() {
	var autoSuggest = new glow.ui.AutoSuggest({
		maxResults: 2
	}).on('results', function(e) {
		same(e.results, [
			{name:"add",alias:"glow.widgets.Mask#add",memberOf:"glow.widgets.Mask",type:"Method",href:"glow.widgets.mask.shtml#method:add"},
			{name:"addClass",alias:"glow.dom.NodeList#addClass",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:addclass"}
		], 'Correct results found');
	}).data(glow1Api)
		.find('add')
		.destroy();
});

test('minLength', 6, function() {
	var findFired, resultsFired,
		autoSuggest = new glow.ui.AutoSuggest().on('find', function() {
			findFired = true;
		}).on('results', function(e) {
			resultsFired = true;
		}).data(glow1Api)
			.find('ad')
			.destroy();
			
	ok( !findFired, 'Find doesn\'t fire for 2 char search' );
	ok( !resultsFired, 'Results doesn\'t fire for 2 char search' );
	
	findFired = resultsFired = false;
	
	autoSuggest = new glow.ui.AutoSuggest().on('find', function() {
		findFired = true;
	}).on('results', function(e) {
		resultsFired = true;
	}).data(glow1Api)
		.find('add')
		.destroy();
			
	ok( findFired, 'Find fires for 3 char search' );
	ok( resultsFired, 'Results fires for 3 char search' );
	
	findFired = resultsFired = false;
	
	autoSuggest = new glow.ui.AutoSuggest({
		minLength: 4
	}).on('find', function() {
		findFired = true;
	}).on('results', function(e) {
		resultsFired = true;
	}).data(glow1Api)
		.find('add')
		.destroy();
		
	ok( !findFired, 'Find doesn\'t fire for 3 char search with minLength set' );
	ok( !resultsFired, 'Results doesn\'t fire for 3 char search with minLength set' );
});

test('caseSensitive', 3, function() {
	var autoSuggest = new glow.ui.AutoSuggest().on('results', function(e) {
		same(e.results, [
			{name:"addClass",alias:"glow.dom.NodeList#addClass",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:addclass"}
		], 'Correct results found - case insensitive');
	}).data(glow1Api)
		.find('addclass')
		.destroy();
		
	autoSuggest = new glow.ui.AutoSuggest({
		caseSensitive: true
	}).on('results', function(e) {
		same(e.results, [], 'Correct results found - case sensitive');
	}).data(glow1Api)
		.find('addclass')
		.destroy();
		
	autoSuggest = new glow.ui.AutoSuggest({
		caseSensitive: true
	}).on('results', function(e) {
		same(e.results, [
			{name:"addClass",alias:"glow.dom.NodeList#addClass",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:addclass"}
		], 'Correct results found - case sensitive 2');
	}).data(glow1Api)
		.find('addClass')
		.destroy();
});

test('no data', 2, function() {
	var autoSuggest = new glow.ui.AutoSuggest().on('find', function(e) {
		ok(true, 'find fired');
	}).on('results', function(e) {
		same(e.results, [], 'Empty results returned');
	}).find('whatever')
		.destroy();
});

test('Altering events', 2, function() {
	var autoSuggest = new glow.ui.AutoSuggest().on('data', function(e) {
		//overwrite data
		e.data = ['hello', 'world', 'foo', 'bar'];
	}).on('results', function(e) {
		same(e.results, [
			{name: 'world'}
		], 'Expected results - data overwritten');
	}).data(glow1Api)
		.find('world')
		.destroy();
		
	autoSuggest = new glow.ui.AutoSuggest().on('find', function(e) {
		e.val = 'ajax';
	}).on('results', function(e) {
		same(e.results, [
			{name:"ajax",alias:"glow.forms.tests.ajax",memberOf:"glow.forms.tests",type:"Method",href:"glow.forms.tests.shtml#staticmethod:ajax"}
		], 'Expected results - find overwritten');
	}).data(glow1Api)
		.find('abort')
		.destroy();
});

test('Cancelling events', 2, function() {
	var autoSuggest = new glow.ui.AutoSuggest().on('data', function(e) {
		return false;
	}).on('results', function(e) {
		same(e.results, [], 'Expected results - data cancelled');
	}).data(glow1Api)
		.find('abort')
		.destroy();
	
	var resultsFired = false;
	
	autoSuggest = new glow.ui.AutoSuggest().on('find', function(e) {
		return false;
	}).on('results', function(e) {
		resultsFired = true;
	}).data(glow1Api)
		.find('abort')
		.destroy();
		
	ok(!resultsFired, 'Results didn\'t fire when find was cancelled')
});

test('Custom filters', 1, function() {
	var autoSuggest = new glow.ui.AutoSuggest().on('results', function(e) {
		same(e.results, [
			{name:"addScrollbar",alias:"glow.widgets.Timetable#addScrollbar",memberOf:"glow.widgets.Timetable",type:"Method",href:"glow.widgets.timetable.shtml#method:addscrollbar"}
		], 'Expected results');
	}).setFilter(function(val, caseSensitive) {
		var name = caseSensitive ? this.name : this.name.toLowerCase();
		return name.indexOf(val) !== -1;
	}).data(glow1Api)
		.find('Scrollbar')
		.destroy();
});

test('Function data source', 2, function() {
	stop(2000);
	
	var log = [],
		dataLoaded = false,
		loadTimeout,
		autoSuggest = new glow.ui.AutoSuggest().on('data', function(e) {
			log.push('data');
		}).on('find', function(e) {
			log.push('find: ' + e.val);
		}).on('results', function(e) {
			log.push('results');
			
			same(e.results, [
				{name: 'glow.anim.Timeline#event:complete'},
				{name: 'glow.anim.Timeline#event:resume'},
				{name: 'glow.anim.Timeline#event:start'},
				{name: 'glow.anim.Timeline#event:stop'}
			], 'Correct results found');
			
			setTimeout(function() {
				same(log, [
					'datafunc: blah',
					'starting interval',
					'datafunc: glow.anim.Timeline#event:',
					'starting interval',
					'calling callback with data',
					'data',
					'find: glow.anim.Timeline#event:',
					'results'
				], 'Correct event order');
				
				autoSuggest.destroy();
				start();
			}, 250);
		}).data(function(val, callback) {
			log.push('datafunc: ' + val);
			clearTimeout(loadTimeout);
			
			if ( dataLoaded ) {
				log.push('calling callback use existing data');
				callback();
			}
			else {
				log.push('starting interval');
				loadTimeout = setTimeout(function() {
					dataLoaded = true;
					log.push('calling callback with data');
					callback(glow1Aliases);
				}, 250);
			}
			
		}).find('blah')
			.find('glow.anim.Timeline#event:');
});

test('Function data source sync', 2, function() {
	stop(2000);
	
	var log = [],
		dataLoaded = false,
		autoSuggest = new glow.ui.AutoSuggest().on('data', function(e) {
			log.push('data');
		}).on('find', function(e) {
			log.push('find: ' + e.val);
		}).on('results', function(e) {
			log.push('results');
			
			same(e.results, [
				{name: 'glow.anim.Timeline#event:complete'},
				{name: 'glow.anim.Timeline#event:resume'},
				{name: 'glow.anim.Timeline#event:start'},
				{name: 'glow.anim.Timeline#event:stop'}
			], 'Correct results found');
			
			setTimeout(function() {
				same(log, [
					'datafunc: glow.anim.Timeline#event:',
					'data',
					'find: glow.anim.Timeline#event:',
					'results'
				], 'Correct event order');
				
				autoSuggest.destroy();
				start();
			}, 250);
		}).data(function(val, callback) {
			log.push('datafunc: ' + val);
			if ( dataLoaded ) {
				callback();
			}
			else {
				dataLoading = true;
				callback(glow1Aliases);
			}
		}).find('glow.anim.Timeline#event:');
});


// Some static data sources
var glow1Api = [
{name:"abort",alias:"glow.net.Request#abort",memberOf:"glow.net.Request",type:"Method",href:"glow.net.request.shtml#method:abort"},
{name:"abort",alias:"glow.net.Request#event:abort",memberOf:"glow.net.Request",type:"Event",href:"glow.net.request.shtml#event:event:abort"},
{name:"active",alias:"glow.dragdrop.DropTarget#event:active",memberOf:"glow.dragdrop.DropTarget",type:"Event",href:"glow.dragdrop.droptarget.shtml#event:event:active"},
{name:"add",alias:"glow.widgets.Mask#add",memberOf:"glow.widgets.Mask",type:"Method",href:"glow.widgets.mask.shtml#method:add"},
{name:"addClass",alias:"glow.dom.NodeList#addClass",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:addclass"},
{name:"addItem",alias:"glow.widgets.Timetable.Track#addItem",memberOf:"glow.widgets.Timetable.Track",type:"Method",href:"glow.widgets.timetable.track.shtml#method:additem"},
{name:"addItem",alias:"glow.widgets.Carousel#event:addItem",memberOf:"glow.widgets.Carousel",type:"Event",href:"glow.widgets.carousel.shtml#event:event:additem"},
{name:"addItems",alias:"glow.widgets.Sortable#addItems",memberOf:"glow.widgets.Sortable",type:"Method",href:"glow.widgets.sortable.shtml#method:additems"},
{name:"addItems",alias:"glow.widgets.Carousel#addItems",memberOf:"glow.widgets.Carousel",type:"Method",href:"glow.widgets.carousel.shtml#method:additems"},
{name:"addListener",alias:"glow.events.addListener",memberOf:"glow.events",type:"Method",href:"glow.events.shtml#staticmethod:addlistener"},
{name:"addLocaleModule",alias:"glow.i18n.addLocaleModule",memberOf:"glow.i18n",type:"Method",href:"glow.i18n.shtml#staticmethod:addlocalemodule"},
{name:"addLocalePack",alias:"glow.i18n.addLocalePack",memberOf:"glow.i18n",type:"Method",href:"glow.i18n.shtml#staticmethod:addlocalepack"},
{name:"addScale",alias:"glow.widgets.Timetable#addScale",memberOf:"glow.widgets.Timetable",type:"Method",href:"glow.widgets.timetable.shtml#method:addscale"},
{name:"addScrollbar",alias:"glow.widgets.Timetable#addScrollbar",memberOf:"glow.widgets.Timetable",type:"Method",href:"glow.widgets.timetable.shtml#method:addscrollbar"},
{name:"addTests",alias:"glow.forms.Form#addTests",memberOf:"glow.forms.Form",type:"Method",href:"glow.forms.form.shtml#method:addtests"},
{name:"addTrack",alias:"glow.widgets.Timetable#addTrack",memberOf:"glow.widgets.Timetable",type:"Method",href:"glow.widgets.timetable.shtml#method:addtrack"},
{name:"after",alias:"glow.dom.NodeList#after",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:after"},
{name:"afterDrop",alias:"glow.dragdrop.Draggable#event:afterDrop",memberOf:"glow.dragdrop.Draggable",type:"Event",href:"glow.dragdrop.draggable.shtml#event:event:afterdrop"},
{name:"afterHide",alias:"glow.widgets.Overlay#event:afterHide",memberOf:"glow.widgets.Panel",type:"Event",href:"glow.widgets.overlay.shtml#event:event:afterhide"},
{name:"afterHide",alias:"glow.widgets.Overlay#event:afterHide",memberOf:"glow.widgets.InfoPanel",type:"Event",href:"glow.widgets.overlay.shtml#event:event:afterhide"},
{name:"afterHide",alias:"glow.widgets.Overlay#event:afterHide",memberOf:"glow.widgets.Overlay",type:"Event",href:"glow.widgets.overlay.shtml#event:event:afterhide"},
{name:"afterScroll",alias:"glow.widgets.Carousel#event:afterScroll",memberOf:"glow.widgets.Carousel",type:"Event",href:"glow.widgets.carousel.shtml#event:event:afterscroll"},
{name:"afterShow",alias:"glow.widgets.Overlay#event:afterShow",memberOf:"glow.widgets.Panel",type:"Event",href:"glow.widgets.overlay.shtml#event:event:aftershow"},
{name:"afterShow",alias:"glow.widgets.Overlay#event:afterShow",memberOf:"glow.widgets.InfoPanel",type:"Event",href:"glow.widgets.overlay.shtml#event:event:aftershow"},
{name:"afterShow",alias:"glow.widgets.Overlay#event:afterShow",memberOf:"glow.widgets.Overlay",type:"Event",href:"glow.widgets.overlay.shtml#event:event:aftershow"},
{name:"ajax",alias:"glow.forms.tests.ajax",memberOf:"glow.forms.tests",type:"Method",href:"glow.forms.tests.shtml#staticmethod:ajax"},
{name:"altKey",alias:"glow.events.Event#altKey",memberOf:"glow.forms.ValidateResult",type:"Property",href:"glow.events.event.shtml#property:altkey"},
{name:"altKey",alias:"glow.events.Event#altKey",memberOf:"glow.events.Event",type:"Property",href:"glow.events.event.shtml#property:altkey"},
{name:"ancestors",alias:"glow.dom.NodeList#ancestors",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:ancestors"},
{name:"anim",alias:"glow.anim",memberOf:"glow",type:"Namespace",href:"glow.anim.shtml"},
{name:"Animation",alias:"glow.anim.Animation",memberOf:"glow.anim",type:"Class",href:"glow.anim.animation.shtml"},
{name:"append",alias:"glow.dom.NodeList#append",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:append"},
{name:"appendTo",alias:"glow.dom.NodeList#appendTo",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:appendto"},
{name:"apply",alias:"glow.lang.apply",memberOf:"glow.lang",type:"Method",href:"glow.lang.shtml#staticmethod:apply"},
{name:"attachedTo",alias:"glow.events.Event#attachedTo",memberOf:"glow.forms.ValidateResult",type:"Property",href:"glow.events.event.shtml#property:attachedto"},
{name:"attachedTo",alias:"glow.events.Event#attachedTo",memberOf:"glow.events.Event",type:"Property",href:"glow.events.event.shtml#property:attachedto"},
{name:"attr",alias:"glow.dom.NodeList#attr",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:attr"},
{name:"AutoComplete",alias:"glow.widgets.AutoComplete",memberOf:"glow.widgets",type:"Class",href:"glow.widgets.autocomplete.shtml"},
{name:"autoPosition",alias:"glow.widgets.Overlay#autoPosition",memberOf:"glow.widgets.InfoPanel",type:"Property",href:"glow.widgets.overlay.shtml#property:autoposition"},
{name:"autoPosition",alias:"glow.widgets.Overlay#autoPosition",memberOf:"glow.widgets.Panel",type:"Property",href:"glow.widgets.overlay.shtml#property:autoposition"},
{name:"autoPosition",alias:"glow.widgets.Overlay#autoPosition",memberOf:"glow.widgets.Overlay",type:"Property",href:"glow.widgets.overlay.shtml#property:autoposition"},
{name:"autosuggest",alias:"glow.widgets.AutoComplete#autosuggest",memberOf:"glow.widgets.AutoComplete",type:"Property",href:"glow.widgets.autocomplete.shtml#property:autosuggest"},
{name:"AutoSuggest",alias:"glow.widgets.AutoSuggest",memberOf:"glow.widgets",type:"Class",href:"glow.widgets.autosuggest.shtml"},
{name:"before",alias:"glow.dom.NodeList#before",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:before"},
{name:"body",alias:"glow.widgets.Panel#body",memberOf:"glow.widgets.Panel",type:"Property",href:"glow.widgets.panel.shtml#property:body"},
{name:"body",alias:"glow.widgets.Panel#body",memberOf:"glow.widgets.InfoPanel",type:"Property",href:"glow.widgets.panel.shtml#property:body"},
{name:"bounceBoth",alias:"glow.tweens.bounceBoth",memberOf:"glow.tweens",type:"Method",href:"glow.tweens.shtml#staticmethod:bounceboth"},
{name:"bounceIn",alias:"glow.tweens.bounceIn",memberOf:"glow.tweens",type:"Method",href:"glow.tweens.shtml#staticmethod:bouncein"},
{name:"bounceOut",alias:"glow.tweens.bounceOut",memberOf:"glow.tweens",type:"Method",href:"glow.tweens.shtml#staticmethod:bounceout"},
{name:"button",alias:"glow.events.Event#button",memberOf:"glow.forms.ValidateResult",type:"Property",href:"glow.events.event.shtml#property:button"},
{name:"button",alias:"glow.events.Event#button",memberOf:"glow.events.Event",type:"Property",href:"glow.events.event.shtml#property:button"},
{name:"capsLock",alias:"glow.events.Event#capsLock",memberOf:"glow.events.Event",type:"Property",href:"glow.events.event.shtml#property:capslock"},
{name:"capsLock",alias:"glow.events.Event#capsLock",memberOf:"glow.forms.ValidateResult",type:"Property",href:"glow.events.event.shtml#property:capslock"},
{name:"Carousel",alias:"glow.widgets.Carousel",memberOf:"glow.widgets",type:"Class",href:"glow.widgets.carousel.shtml"},
{name:"change",alias:"glow.widgets.Slider#event:change",memberOf:"glow.widgets.Slider",type:"Event",href:"glow.widgets.slider.shtml#event:event:change"},
{name:"change",alias:"glow.widgets.Timetable#event:change",memberOf:"glow.widgets.Timetable",type:"Event",href:"glow.widgets.timetable.shtml#event:event:change"},
{name:"charCode",alias:"glow.events.Event#charCode",memberOf:"glow.forms.ValidateResult",type:"Property",href:"glow.events.event.shtml#property:charcode"},
{name:"charCode",alias:"glow.events.Event#charCode",memberOf:"glow.events.Event",type:"Property",href:"glow.events.event.shtml#property:charcode"},
{name:"checkLocale",alias:"glow.i18n.checkLocale",memberOf:"glow.i18n",type:"Method",href:"glow.i18n.shtml#staticmethod:checklocale"},
{name:"children",alias:"glow.dom.NodeList#children",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:children"},
{name:"chr",alias:"glow.events.Event#chr",memberOf:"glow.forms.ValidateResult",type:"Property",href:"glow.events.event.shtml#property:chr"},
{name:"chr",alias:"glow.events.Event#chr",memberOf:"glow.events.Event",type:"Property",href:"glow.events.event.shtml#property:chr"},
{name:"clone",alias:"glow.lang.clone",memberOf:"glow.lang",type:"Method",href:"glow.lang.shtml#staticmethod:clone"},
{name:"clone",alias:"glow.dom.NodeList#clone",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:clone"},
{name:"combine",alias:"glow.tweens.combine",memberOf:"glow.tweens",type:"Method",href:"glow.tweens.shtml#staticmethod:combine"},
{name:"commit",alias:"glow.widgets.Editor#event:commit",memberOf:"glow.widgets.Editor",type:"Event",href:"glow.widgets.editor.shtml#event:event:commit"},
{name:"complete",alias:"glow.net.Request#complete",memberOf:"glow.net.Request",type:"Property",href:"glow.net.request.shtml#property:complete"},
{name:"complete",alias:"glow.anim.Timeline#event:complete",memberOf:"glow.anim.Timeline",type:"Event",href:"glow.anim.timeline.shtml#event:event:complete"},
{name:"complete",alias:"glow.anim.Animation#event:complete",memberOf:"glow.anim.Animation",type:"Event",href:"glow.anim.animation.shtml#event:event:complete"},
{name:"container",alias:"glow.widgets.Overlay#container",memberOf:"glow.widgets.InfoPanel",type:"Property",href:"glow.widgets.overlay.shtml#property:container"},
{name:"container",alias:"glow.embed.Flash#container",memberOf:"glow.embed.Flash",type:"Property",href:"glow.embed.flash.shtml#property:container"},
{name:"container",alias:"glow.widgets.Overlay#container",memberOf:"glow.widgets.Panel",type:"Property",href:"glow.widgets.overlay.shtml#property:container"},
{name:"container",alias:"glow.widgets.Overlay#container",memberOf:"glow.widgets.Overlay",type:"Property",href:"glow.widgets.overlay.shtml#property:container"},
{name:"containers",alias:"glow.widgets.Sortable#containers",memberOf:"glow.widgets.Sortable",type:"Property",href:"glow.widgets.sortable.shtml#property:containers"},
{name:"content",alias:"glow.widgets.Overlay#content",memberOf:"glow.widgets.Panel",type:"Property",href:"glow.widgets.overlay.shtml#property:content"},
{name:"content",alias:"glow.widgets.Overlay#content",memberOf:"glow.widgets.InfoPanel",type:"Property",href:"glow.widgets.overlay.shtml#property:content"},
{name:"content",alias:"glow.widgets.Overlay#content",memberOf:"glow.widgets.Overlay",type:"Property",href:"glow.widgets.overlay.shtml#property:content"},
{name:"count",alias:"glow.forms.tests.count",memberOf:"glow.forms.tests",type:"Method",href:"glow.forms.tests.shtml#staticmethod:count"},
{name:"create",alias:"glow.dom.create",memberOf:"glow.dom",type:"Method",href:"glow.dom.shtml#staticmethod:create"},
{name:"css",alias:"glow.dom.NodeList#css",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:css"},
{name:"css",alias:"glow.anim.css",memberOf:"glow.anim",type:"Method",href:"glow.anim.shtml#staticmethod:css"},
{name:"ctrlKey",alias:"glow.events.Event#ctrlKey",memberOf:"glow.forms.ValidateResult",type:"Property",href:"glow.events.event.shtml#property:ctrlkey"},
{name:"ctrlKey",alias:"glow.events.Event#ctrlKey",memberOf:"glow.events.Event",type:"Property",href:"glow.events.event.shtml#property:ctrlkey"},
{name:"currentPosition",alias:"glow.widgets.Timetable#currentPosition",memberOf:"glow.widgets.Timetable",type:"Method",href:"glow.widgets.timetable.shtml#method:currentposition"},
{name:"custom",alias:"glow.forms.tests.custom",memberOf:"glow.forms.tests",type:"Method",href:"glow.forms.tests.shtml#staticmethod:custom"},
{name:"data",alias:"glow.widgets.Timetable.Track#data",memberOf:"glow.widgets.Timetable.Track",type:"Property",href:"glow.widgets.timetable.track.shtml#property:data"},
{name:"data",alias:"glow.data",memberOf:"glow",type:"Namespace",href:"glow.data.shtml"},
{name:"data",alias:"glow.dom.NodeList#data",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:data"},
{name:"data",alias:"glow.widgets.Timetable.Item#data",memberOf:"glow.widgets.Timetable.Item",type:"Property",href:"glow.widgets.timetable.item.shtml#property:data"},
{name:"dataAbort",alias:"glow.widgets.AutoSuggest#event:dataAbort",memberOf:"glow.widgets.AutoSuggest",type:"Event",href:"glow.widgets.autosuggest.shtml#event:event:dataabort"},
{name:"dataError",alias:"glow.widgets.AutoSuggest#event:dataError",memberOf:"glow.widgets.AutoSuggest",type:"Event",href:"glow.widgets.autosuggest.shtml#event:event:dataerror"},
{name:"dataLoad",alias:"glow.widgets.AutoSuggest#event:dataLoad",memberOf:"glow.widgets.AutoSuggest",type:"Event",href:"glow.widgets.autosuggest.shtml#event:event:dataload"},
{name:"decodeJson",alias:"glow.data.decodeJson",memberOf:"glow.data",type:"Method",href:"glow.data.shtml#staticmethod:decodejson"},
{name:"decodeUrl",alias:"glow.data.decodeUrl",memberOf:"glow.data",type:"Method",href:"glow.data.shtml#staticmethod:decodeurl"},
{name:"defaultFeedback",alias:"glow.forms.feedback.defaultFeedback",memberOf:"glow.forms.feedback",type:"Method",href:"glow.forms.feedback.shtml#staticmethod:defaultfeedback"},
{name:"defaultPrevented",alias:"glow.events.Event#defaultPrevented",memberOf:"glow.forms.ValidateResult",type:"Method",href:"glow.events.event.shtml#method:defaultprevented"},
{name:"defaultPrevented",alias:"glow.events.Event#defaultPrevented",memberOf:"glow.events.Event",type:"Method",href:"glow.events.event.shtml#method:defaultprevented"},
{name:"destroy",alias:"glow.net.Request#destroy",memberOf:"glow.net.Request",type:"Method",href:"glow.net.request.shtml#method:destroy"},
{name:"destroy",alias:"glow.anim.Timeline#destroy",memberOf:"glow.anim.Timeline",type:"Method",href:"glow.anim.timeline.shtml#method:destroy"},
{name:"destroy",alias:"glow.dom.NodeList#destroy",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:destroy"},
{name:"destroy",alias:"glow.anim.Animation#destroy",memberOf:"glow.anim.Animation",type:"Method",href:"glow.anim.animation.shtml#method:destroy"},
{name:"disabled",alias:"glow.widgets.Timetable.Track#disabled",memberOf:"glow.widgets.Timetable.Track",type:"Property",href:"glow.widgets.timetable.track.shtml#property:disabled"},
{name:"disabled",alias:"glow.widgets.Slider#disabled",memberOf:"glow.widgets.Slider",type:"Method",href:"glow.widgets.slider.shtml#method:disabled"},
{name:"dom",alias:"glow.dom",memberOf:"glow",type:"Namespace",href:"glow.dom.shtml"},
{name:"drag",alias:"glow.dragdrop.Draggable#event:drag",memberOf:"glow.dragdrop.Draggable",type:"Event",href:"glow.dragdrop.draggable.shtml#event:event:drag"},
{name:"dragdrop",alias:"glow.dragdrop",memberOf:"glow",type:"Namespace",href:"glow.dragdrop.shtml"},
{name:"Draggable",alias:"glow.dragdrop.Draggable",memberOf:"glow.dragdrop",type:"Class",href:"glow.dragdrop.draggable.shtml"},
{name:"draggables",alias:"glow.widgets.Sortable#draggables",memberOf:"glow.widgets.Sortable",type:"Property",href:"glow.widgets.sortable.shtml#property:draggables"},
{name:"draw",alias:"glow.widgets.Timetable#draw",memberOf:"glow.widgets.Timetable",type:"Method",href:"glow.widgets.timetable.shtml#method:draw"},
{name:"drop",alias:"glow.dragdrop.DropTarget#event:drop",memberOf:"glow.dragdrop.DropTarget",type:"Event",href:"glow.dragdrop.droptarget.shtml#event:event:drop"},
{name:"drop",alias:"glow.dragdrop.Draggable#event:drop",memberOf:"glow.dragdrop.Draggable",type:"Event",href:"glow.dragdrop.draggable.shtml#event:event:drop"},
{name:"DropTarget",alias:"glow.dragdrop.DropTarget",memberOf:"glow.dragdrop",type:"Class",href:"glow.dragdrop.droptarget.shtml"},
{name:"dropTargets",alias:"glow.widgets.Sortable#dropTargets",memberOf:"glow.widgets.Sortable",type:"Property",href:"glow.widgets.sortable.shtml#property:droptargets"},
{name:"duration",alias:"glow.anim.Animation#duration",memberOf:"glow.anim.Animation",type:"Property",href:"glow.anim.animation.shtml#property:duration"},
{name:"duration",alias:"glow.anim.Timeline#duration",memberOf:"glow.anim.Timeline",type:"Property",href:"glow.anim.timeline.shtml#property:duration"},
{name:"each",alias:"glow.dom.NodeList#each",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:each"},
{name:"easeBoth",alias:"glow.tweens.easeBoth",memberOf:"glow.tweens",type:"Method",href:"glow.tweens.shtml#staticmethod:easeboth"},
{name:"easeIn",alias:"glow.tweens.easeIn",memberOf:"glow.tweens",type:"Method",href:"glow.tweens.shtml#staticmethod:easein"},
{name:"easeOut",alias:"glow.tweens.easeOut",memberOf:"glow.tweens",type:"Method",href:"glow.tweens.shtml#staticmethod:easeout"},
{name:"Editor",alias:"glow.widgets.Editor",memberOf:"glow.widgets",type:"Class",href:"glow.widgets.editor.shtml"},
{name:"elasticBoth",alias:"glow.tweens.elasticBoth",memberOf:"glow.tweens",type:"Method",href:"glow.tweens.shtml#staticmethod:elasticboth"},
{name:"elasticIn",alias:"glow.tweens.elasticIn",memberOf:"glow.tweens",type:"Method",href:"glow.tweens.shtml#staticmethod:elasticin"},
{name:"elasticOut",alias:"glow.tweens.elasticOut",memberOf:"glow.tweens",type:"Method",href:"glow.tweens.shtml#staticmethod:elasticout"},
{name:"element",alias:"glow.widgets.Carousel#element",memberOf:"glow.widgets.Carousel",type:"Property",href:"glow.widgets.carousel.shtml#property:element"},
{name:"element",alias:"glow.widgets.Timetable.Item#element",memberOf:"glow.widgets.Timetable.Item",type:"Property",href:"glow.widgets.timetable.item.shtml#property:element"},
{name:"element",alias:"glow.dragdrop.DropTarget#element",memberOf:"glow.dragdrop.DropTarget",type:"Property",href:"glow.dragdrop.droptarget.shtml#property:element"},
{name:"element",alias:"glow.widgets.Slider#element",memberOf:"glow.widgets.Slider",type:"Property",href:"glow.widgets.slider.shtml#property:element"},
{name:"element",alias:"glow.widgets.Timetable#element",memberOf:"glow.widgets.Timetable",type:"Property",href:"glow.widgets.timetable.shtml#property:element"},
{name:"element",alias:"glow.dragdrop.Draggable#element",memberOf:"glow.dragdrop.Draggable",type:"Property",href:"glow.dragdrop.draggable.shtml#property:element"},
{name:"embed",alias:"glow.embed.Flash#embed",memberOf:"glow.embed.Flash",type:"Method",href:"glow.embed.flash.shtml#method:embed"},
{name:"embed",alias:"glow.embed",memberOf:"glow",type:"Namespace",href:"glow.embed.shtml"},
{name:"empty",alias:"glow.dom.NodeList#empty",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:empty"},
{name:"encodeJson",alias:"glow.data.encodeJson",memberOf:"glow.data",type:"Method",href:"glow.data.shtml#staticmethod:encodejson"},
{name:"encodeUrl",alias:"glow.data.encodeUrl",memberOf:"glow.data",type:"Method",href:"glow.data.shtml#staticmethod:encodeurl"},
{name:"end",alias:"glow.widgets.Timetable.Item#end",memberOf:"glow.widgets.Timetable.Item",type:"Property",href:"glow.widgets.timetable.item.shtml#property:end"},
{name:"end",alias:"glow.widgets.Timetable#end",memberOf:"glow.widgets.Timetable",type:"Property",href:"glow.widgets.timetable.shtml#property:end"},
{name:"enter",alias:"glow.dragdrop.DropTarget#event:enter",memberOf:"glow.dragdrop.DropTarget",type:"Event",href:"glow.dragdrop.droptarget.shtml#event:event:enter"},
{name:"enter",alias:"glow.dragdrop.Draggable#event:enter",memberOf:"glow.dragdrop.Draggable",type:"Event",href:"glow.dragdrop.draggable.shtml#event:event:enter"},
{name:"env",alias:"glow.env",memberOf:"glow",type:"Property",href:"glow.shtml#staticproperty:env"},
{name:"eq",alias:"glow.dom.NodeList#eq",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:eq"},
{name:"error",alias:"glow.net.Request#event:error",memberOf:"glow.net.Request",type:"Event",href:"glow.net.request.shtml#event:event:error"},
{name:"errorCount",alias:"glow.forms.ValidateResult#errorCount",memberOf:"glow.forms.ValidateResult",type:"Property",href:"glow.forms.validateresult.shtml#staticproperty:errorcount"},
{name:"escapeHTML",alias:"glow.data.escapeHTML",memberOf:"glow.data",type:"Method",href:"glow.data.shtml#staticmethod:escapehtml"},
{name:"Event",alias:"glow.events.Event",memberOf:"glow.events",type:"Class",href:"glow.events.event.shtml"},
{name:"eventName",alias:"glow.forms.ValidateResult#eventName",memberOf:"glow.forms.ValidateResult",type:"Property",href:"glow.forms.validateresult.shtml#staticproperty:eventname"},
{name:"events",alias:"glow.events",memberOf:"glow",type:"Namespace",href:"glow.events.shtml"},
{name:"extend",alias:"glow.lang.extend",memberOf:"glow.lang",type:"Method",href:"glow.lang.shtml#staticmethod:extend"},
{name:"fadeIn",alias:"glow.anim.fadeIn",memberOf:"glow.anim",type:"Method",href:"glow.anim.shtml#staticmethod:fadein"},
{name:"fadeOut",alias:"glow.anim.fadeOut",memberOf:"glow.anim",type:"Method",href:"glow.anim.shtml#staticmethod:fadeout"},
{name:"fadeTo",alias:"glow.anim.fadeTo",memberOf:"glow.anim",type:"Method",href:"glow.anim.shtml#staticmethod:fadeto"},
{name:"FAIL",alias:"glow.forms.FAIL",memberOf:"glow.forms",type:"Property",href:"glow.forms.shtml#staticproperty:fail"},
{name:"feedback",alias:"glow.forms.feedback",memberOf:"glow.forms",type:"Namespace",href:"glow.forms.feedback.shtml"},
{name:"fields",alias:"glow.forms.ValidateResult#fields",memberOf:"glow.forms.ValidateResult",type:"Property",href:"glow.forms.validateresult.shtml#staticproperty:fields"},
{name:"filter",alias:"glow.dom.NodeList#filter",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:filter"},
{name:"fire",alias:"glow.events.fire",memberOf:"glow.events",type:"Method",href:"glow.events.shtml#staticmethod:fire"},
{name:"Flash",alias:"glow.embed.Flash",memberOf:"glow.embed",type:"Class",href:"glow.embed.flash.shtml"},
{name:"footer",alias:"glow.widgets.Panel#footer",memberOf:"glow.widgets.InfoPanel",type:"Property",href:"glow.widgets.panel.shtml#property:footer"},
{name:"footer",alias:"glow.widgets.Panel#footer",memberOf:"glow.widgets.Panel",type:"Property",href:"glow.widgets.panel.shtml#property:footer"},
{name:"Form",alias:"glow.forms.Form",memberOf:"glow.forms",type:"Class",href:"glow.forms.form.shtml"},
{name:"formNode",alias:"glow.forms.Form#formNode",memberOf:"glow.forms.Form",type:"Property",href:"glow.forms.form.shtml#property:formnode"},
{name:"forms",alias:"glow.forms",memberOf:"glow",type:"Namespace",href:"glow.forms.shtml"},
{name:"frame",alias:"glow.anim.Animation#event:frame",memberOf:"glow.anim.Animation",type:"Event",href:"glow.anim.animation.shtml#event:event:frame"},
{name:"get",alias:"glow.dom.get",memberOf:"glow.dom",type:"Method",href:"glow.dom.shtml#staticmethod:get"},
{name:"get",alias:"glow.net.get",memberOf:"glow.net",type:"Method",href:"glow.net.shtml#staticmethod:get"},
{name:"get",alias:"glow.dom.NodeList#get",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:get"},
{name:"getContent",alias:"glow.widgets.Timetable.Item#getContent",memberOf:"glow.widgets.Timetable.Item",type:"Method",href:"glow.widgets.timetable.item.shtml#method:getcontent"},
{name:"getFooter",alias:"glow.widgets.Timetable.Track#getFooter",memberOf:"glow.widgets.Timetable.Track",type:"Method",href:"glow.widgets.timetable.track.shtml#method:getfooter"},
{name:"getHeader",alias:"glow.widgets.Timetable.Track#getHeader",memberOf:"glow.widgets.Timetable.Track",type:"Method",href:"glow.widgets.timetable.track.shtml#method:getheader"},
{name:"getLocale",alias:"glow.i18n.getLocale",memberOf:"glow.i18n",type:"Method",href:"glow.i18n.shtml#staticmethod:getlocale"},
{name:"getLocaleModule",alias:"glow.i18n.getLocaleModule",memberOf:"glow.i18n",type:"Method",href:"glow.i18n.shtml#staticmethod:getlocalemodule"},
{name:"glow",alias:"glow",memberOf:"",type:"Namespace",href:"glow.shtml"},
{name:"goTo",alias:"glow.anim.Timeline#goTo",memberOf:"glow.anim.Timeline",type:"Method",href:"glow.anim.timeline.shtml#method:goto"},
{name:"goTo",alias:"glow.anim.Animation#goTo",memberOf:"glow.anim.Animation",type:"Method",href:"glow.anim.animation.shtml#method:goto"},
{name:"hasAttr",alias:"glow.dom.NodeList#hasAttr",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:hasattr"},
{name:"hasClass",alias:"glow.dom.NodeList#hasClass",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:hasclass"},
{name:"hasOwnProperty",alias:"glow.lang.hasOwnProperty",memberOf:"glow.lang",type:"Method",href:"glow.lang.shtml#staticmethod:hasownproperty"},
{name:"header",alias:"glow.net.Response#header",memberOf:"glow.net.Response",type:"Method",href:"glow.net.response.shtml#method:header"},
{name:"header",alias:"glow.widgets.Panel#header",memberOf:"glow.widgets.InfoPanel",type:"Property",href:"glow.widgets.panel.shtml#property:header"},
{name:"header",alias:"glow.widgets.Panel#header",memberOf:"glow.widgets.Panel",type:"Property",href:"glow.widgets.panel.shtml#property:header"},
{name:"height",alias:"glow.dom.NodeList#height",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:height"},
{name:"hide",alias:"glow.widgets.Overlay#hide",memberOf:"glow.widgets.InfoPanel",type:"Method",href:"glow.widgets.overlay.shtml#method:hide"},
{name:"hide",alias:"glow.widgets.Overlay#event:hide",memberOf:"glow.widgets.InfoPanel",type:"Event",href:"glow.widgets.overlay.shtml#event:event:hide"},
{name:"hide",alias:"glow.widgets.AutoSuggest#event:hide",memberOf:"glow.widgets.AutoSuggest",type:"Event",href:"glow.widgets.autosuggest.shtml#event:event:hide"},
{name:"hide",alias:"glow.widgets.Overlay#hide",memberOf:"glow.widgets.Panel",type:"Method",href:"glow.widgets.overlay.shtml#method:hide"},
{name:"hide",alias:"glow.widgets.Overlay#event:hide",memberOf:"glow.widgets.Panel",type:"Event",href:"glow.widgets.overlay.shtml#event:event:hide"},
{name:"hide",alias:"glow.widgets.Overlay#hide",memberOf:"glow.widgets.Overlay",type:"Method",href:"glow.widgets.overlay.shtml#method:hide"},
{name:"hide",alias:"glow.dom.NodeList#hide",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:hide"},
{name:"hide",alias:"glow.widgets.Overlay#event:hide",memberOf:"glow.widgets.Overlay",type:"Event",href:"glow.widgets.overlay.shtml#event:event:hide"},
{name:"highlight",alias:"glow.anim.highlight",memberOf:"glow.anim",type:"Method",href:"glow.anim.shtml#staticmethod:highlight"},
{name:"html",alias:"glow.dom.NodeList#html",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:html"},
{name:"i18n",alias:"glow.i18n",memberOf:"glow",type:"Namespace",href:"glow.i18n.shtml"},
{name:"id",alias:"glow.widgets.Timetable.Item#id",memberOf:"glow.widgets.Timetable.Item",type:"Property",href:"glow.widgets.timetable.item.shtml#property:id"},
{name:"id",alias:"glow.widgets.Timetable.Track#id",memberOf:"glow.widgets.Timetable.Track",type:"Property",href:"glow.widgets.timetable.track.shtml#property:id"},
{name:"id",alias:"glow.widgets.Timetable#id",memberOf:"glow.widgets.Timetable",type:"Property",href:"glow.widgets.timetable.shtml#property:id"},
{name:"inactive",alias:"glow.dragdrop.DropTarget#event:inactive",memberOf:"glow.dragdrop.DropTarget",type:"Event",href:"glow.dragdrop.droptarget.shtml#event:event:inactive"},
{name:"indexAt",alias:"glow.widgets.Timetable.Track#indexAt",memberOf:"glow.widgets.Timetable.Track",type:"Method",href:"glow.widgets.timetable.track.shtml#method:indexat"},
{name:"indicesAt",alias:"glow.widgets.Timetable.Track#indicesAt",memberOf:"glow.widgets.Timetable.Track",type:"Method",href:"glow.widgets.timetable.track.shtml#method:indicesat"},
{name:"indicesInRange",alias:"glow.widgets.Timetable.Track#indicesInRange",memberOf:"glow.widgets.Timetable.Track",type:"Method",href:"glow.widgets.timetable.track.shtml#method:indicesinrange"},
{name:"InfoPanel",alias:"glow.widgets.InfoPanel",memberOf:"glow.widgets",type:"Class",href:"glow.widgets.infopanel.shtml"},
{name:"inputChange",alias:"glow.widgets.AutoSuggest#event:inputChange",memberOf:"glow.widgets.AutoSuggest",type:"Event",href:"glow.widgets.autosuggest.shtml#event:event:inputchange"},
{name:"inputElement",alias:"glow.widgets.AutoSuggest#inputElement",memberOf:"glow.widgets.AutoSuggest",type:"Property",href:"glow.widgets.autosuggest.shtml#property:inputelement"},
{name:"inRange",alias:"glow.widgets.Timetable.Item#inRange",memberOf:"glow.widgets.Timetable.Item",type:"Method",href:"glow.widgets.timetable.item.shtml#method:inrange"},
{name:"insertAfter",alias:"glow.dom.NodeList#insertAfter",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:insertafter"},
{name:"insertBefore",alias:"glow.dom.NodeList#insertBefore",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:insertbefore"},
{name:"interpolate",alias:"glow.lang.interpolate",memberOf:"glow.lang",type:"Method",href:"glow.lang.shtml#staticmethod:interpolate"},
{name:"is",alias:"glow.forms.tests.is",memberOf:"glow.forms.tests",type:"Method",href:"glow.forms.tests.shtml#staticmethod:is"},
{name:"is",alias:"glow.dom.NodeList#is",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:is"},
{name:"isDomReady",alias:"glow.isDomReady",memberOf:"glow",type:"Property",href:"glow.shtml#staticproperty:isdomready"},
{name:"isEmail",alias:"glow.forms.tests.isEmail",memberOf:"glow.forms.tests",type:"Method",href:"glow.forms.tests.shtml#staticmethod:isemail"},
{name:"isNot",alias:"glow.forms.tests.isNot",memberOf:"glow.forms.tests",type:"Method",href:"glow.forms.tests.shtml#staticmethod:isnot"},
{name:"isNumber",alias:"glow.forms.tests.isNumber",memberOf:"glow.forms.tests",type:"Method",href:"glow.forms.tests.shtml#staticmethod:isnumber"},
{name:"isPlaying",alias:"glow.anim.Animation#isPlaying",memberOf:"glow.anim.Animation",type:"Method",href:"glow.anim.animation.shtml#method:isplaying"},
{name:"isPlaying",alias:"glow.anim.Timeline#isPlaying",memberOf:"glow.anim.Timeline",type:"Method",href:"glow.anim.timeline.shtml#method:isplaying"},
{name:"isReady",alias:"glow.isReady",memberOf:"glow",type:"Property",href:"glow.shtml#staticproperty:isready"},
{name:"isShown",alias:"glow.widgets.Overlay#isShown",memberOf:"glow.widgets.Panel",type:"Property",href:"glow.widgets.overlay.shtml#property:isshown"},
{name:"isShown",alias:"glow.widgets.Overlay#isShown",memberOf:"glow.widgets.InfoPanel",type:"Property",href:"glow.widgets.overlay.shtml#property:isshown"},
{name:"isShown",alias:"glow.widgets.Overlay#isShown",memberOf:"glow.widgets.Overlay",type:"Property",href:"glow.widgets.overlay.shtml#property:isshown"},
{name:"isSupported",alias:"glow.embed.Flash#isSupported",memberOf:"glow.embed.Flash",type:"Property",href:"glow.embed.flash.shtml#property:issupported"},
{name:"isSupported",alias:"glow.isSupported",memberOf:"glow",type:"Property",href:"glow.shtml#staticproperty:issupported"},
{name:"isWithin",alias:"glow.dom.NodeList#isWithin",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:iswithin"},
{name:"Item",alias:"glow.widgets.Timetable.Item",memberOf:"glow.widgets.Timetable",type:"Class",href:"glow.widgets.timetable.item.shtml"},
{name:"item",alias:"glow.dom.NodeList#item",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:item"},
{name:"itemAt",alias:"glow.widgets.Timetable.Track#itemAt",memberOf:"glow.widgets.Timetable.Track",type:"Method",href:"glow.widgets.timetable.track.shtml#method:itemat"},
{name:"itemClick",alias:"glow.widgets.Carousel#event:itemClick",memberOf:"glow.widgets.Carousel",type:"Event",href:"glow.widgets.carousel.shtml#event:event:itemclick"},
{name:"itemClick",alias:"glow.widgets.Timetable#event:itemClick",memberOf:"glow.widgets.Timetable",type:"Event",href:"glow.widgets.timetable.shtml#event:event:itemclick"},
{name:"items",alias:"glow.widgets.Timetable.Track#items",memberOf:"glow.widgets.Timetable.Track",type:"Property",href:"glow.widgets.timetable.track.shtml#property:items"},
{name:"items",alias:"glow.widgets.Carousel#items",memberOf:"glow.widgets.Carousel",type:"Property",href:"glow.widgets.carousel.shtml#property:items"},
{name:"itemsAt",alias:"glow.widgets.Timetable.Track#itemsAt",memberOf:"glow.widgets.Timetable.Track",type:"Method",href:"glow.widgets.timetable.track.shtml#method:itemsat"},
{name:"itemSelect",alias:"glow.widgets.AutoSuggest#event:itemSelect",memberOf:"glow.widgets.AutoSuggest",type:"Event",href:"glow.widgets.autosuggest.shtml#event:event:itemselect"},
{name:"itemsInRange",alias:"glow.widgets.Timetable.Track#itemsInRange",memberOf:"glow.widgets.Timetable.Track",type:"Method",href:"glow.widgets.timetable.track.shtml#method:itemsinrange"},
{name:"json",alias:"glow.net.Response#json",memberOf:"glow.net.Response",type:"Method",href:"glow.net.response.shtml#method:json"},
{name:"key",alias:"glow.events.Event#key",memberOf:"glow.forms.ValidateResult",type:"Property",href:"glow.events.event.shtml#property:key"},
{name:"key",alias:"glow.events.Event#key",memberOf:"glow.events.Event",type:"Property",href:"glow.events.event.shtml#property:key"},
{name:"keyCode",alias:"glow.events.Event#keyCode",memberOf:"glow.forms.ValidateResult",type:"Property",href:"glow.events.event.shtml#property:keycode"},
{name:"keyCode",alias:"glow.events.Event#keyCode",memberOf:"glow.events.Event",type:"Property",href:"glow.events.event.shtml#property:keycode"},
{name:"labelToVal",alias:"glow.widgets.Slider#labelToVal",memberOf:"glow.widgets.Slider",type:"Method",href:"glow.widgets.slider.shtml#method:labeltoval"},
{name:"lang",alias:"glow.lang",memberOf:"glow",type:"Namespace",href:"glow.lang.shtml"},
{name:"leave",alias:"glow.dragdrop.DropTarget#event:leave",memberOf:"glow.dragdrop.DropTarget",type:"Event",href:"glow.dragdrop.droptarget.shtml#event:event:leave"},
{name:"leave",alias:"glow.dragdrop.Draggable#event:leave",memberOf:"glow.dragdrop.Draggable",type:"Event",href:"glow.dragdrop.draggable.shtml#event:event:leave"},
{name:"length",alias:"glow.dom.NodeList#length",memberOf:"glow.dom.NodeList",type:"Property",href:"glow.dom.nodelist.shtml#property:length"},
{name:"linear",alias:"glow.tweens.linear",memberOf:"glow.tweens",type:"Method",href:"glow.tweens.shtml#staticmethod:linear"},
{name:"load",alias:"glow.net.Request#event:load",memberOf:"glow.net.Request",type:"Event",href:"glow.net.request.shtml#event:event:load"},
{name:"loadData",alias:"glow.widgets.AutoSuggest#loadData",memberOf:"glow.widgets.AutoSuggest",type:"Method",href:"glow.widgets.autosuggest.shtml#method:loaddata"},
{name:"loadScript",alias:"glow.net.loadScript",memberOf:"glow.net",type:"Method",href:"glow.net.shtml#staticmethod:loadscript"},
{name:"loop",alias:"glow.anim.Timeline#loop",memberOf:"glow.anim.Timeline",type:"Property",href:"glow.anim.timeline.shtml#property:loop"},
{name:"map",alias:"glow.lang.map",memberOf:"glow.lang",type:"Method",href:"glow.lang.shtml#staticmethod:map"},
{name:"Mask",alias:"glow.widgets.Mask",memberOf:"glow.widgets",type:"Class",href:"glow.widgets.mask.shtml"},
{name:"maskElement",alias:"glow.widgets.Mask#maskElement",memberOf:"glow.widgets.Mask",type:"Property",href:"glow.widgets.mask.shtml#property:maskelement"},
{name:"max",alias:"glow.forms.tests.max",memberOf:"glow.forms.tests",type:"Method",href:"glow.forms.tests.shtml#staticmethod:max"},
{name:"maxCount",alias:"glow.forms.tests.maxCount",memberOf:"glow.forms.tests",type:"Method",href:"glow.forms.tests.shtml#staticmethod:maxcount"},
{name:"maxLen",alias:"glow.forms.tests.maxLen",memberOf:"glow.forms.tests",type:"Method",href:"glow.forms.tests.shtml#staticmethod:maxlen"},
{name:"min",alias:"glow.forms.tests.min",memberOf:"glow.forms.tests",type:"Method",href:"glow.forms.tests.shtml#staticmethod:min"},
{name:"minCount",alias:"glow.forms.tests.minCount",memberOf:"glow.forms.tests",type:"Method",href:"glow.forms.tests.shtml#staticmethod:mincount"},
{name:"minLen",alias:"glow.forms.tests.minLen",memberOf:"glow.forms.tests",type:"Method",href:"glow.forms.tests.shtml#staticmethod:minlen"},
{name:"moveBy",alias:"glow.widgets.Carousel#moveBy",memberOf:"glow.widgets.Carousel",type:"Method",href:"glow.widgets.carousel.shtml#method:moveby"},
{name:"moveStart",alias:"glow.widgets.Timetable#event:moveStart",memberOf:"glow.widgets.Timetable",type:"Event",href:"glow.widgets.timetable.shtml#event:event:movestart"},
{name:"moveStop",alias:"glow.widgets.Timetable#event:moveStop",memberOf:"glow.widgets.Timetable",type:"Event",href:"glow.widgets.timetable.shtml#event:event:movestop"},
{name:"moveTo",alias:"glow.widgets.Carousel#moveTo",memberOf:"glow.widgets.Carousel",type:"Method",href:"glow.widgets.carousel.shtml#method:moveto"},
{name:"movie",alias:"glow.embed.Flash#movie",memberOf:"glow.embed.Flash",type:"Property",href:"glow.embed.flash.shtml#property:movie"},
{name:"nativeRequest",alias:"glow.net.Request#nativeRequest",memberOf:"glow.net.Request",type:"Property",href:"glow.net.request.shtml#property:nativerequest"},
{name:"nativeResponse",alias:"glow.net.Response#nativeResponse",memberOf:"glow.net.Response",type:"Property",href:"glow.net.response.shtml#property:nativeresponse"},
{name:"net",alias:"glow.net",memberOf:"glow",type:"Namespace",href:"glow.net.shtml"},
{name:"next",alias:"glow.dom.NodeList#next",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:next"},
{name:"next",alias:"glow.widgets.Carousel#next",memberOf:"glow.widgets.Carousel",type:"Method",href:"glow.widgets.carousel.shtml#method:next"},
{name:"NodeList",alias:"glow.dom.NodeList",memberOf:"glow.dom",type:"Class",href:"glow.dom.nodelist.shtml"},
{name:"numerical",alias:"glow.widgets.Timetable#numerical",memberOf:"glow.widgets.Timetable",type:"Property",href:"glow.widgets.timetable.shtml#property:numerical"},
{name:"offset",alias:"glow.dom.NodeList#offset",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:offset"},
{name:"onDomReady",alias:"glow.onDomReady",memberOf:"glow",type:"Method",href:"glow.shtml#staticmethod:ondomready"},
{name:"overlay",alias:"glow.widgets.AutoSuggest#overlay",memberOf:"glow.widgets.AutoSuggest",type:"Property",href:"glow.widgets.autosuggest.shtml#property:overlay"},
{name:"Overlay",alias:"glow.widgets.Overlay",memberOf:"glow.widgets",type:"Class",href:"glow.widgets.overlay.shtml"},
{name:"overshootBoth",alias:"glow.tweens.overshootBoth",memberOf:"glow.tweens",type:"Method",href:"glow.tweens.shtml#staticmethod:overshootboth"},
{name:"overshootIn",alias:"glow.tweens.overshootIn",memberOf:"glow.tweens",type:"Method",href:"glow.tweens.shtml#staticmethod:overshootin"},
{name:"overshootOut",alias:"glow.tweens.overshootOut",memberOf:"glow.tweens",type:"Method",href:"glow.tweens.shtml#staticmethod:overshootout"},
{name:"pageX",alias:"glow.events.Event#pageX",memberOf:"glow.forms.ValidateResult",type:"Property",href:"glow.events.event.shtml#property:pagex"},
{name:"pageX",alias:"glow.events.Event#pageX",memberOf:"glow.events.Event",type:"Property",href:"glow.events.event.shtml#property:pagex"},
{name:"pageY",alias:"glow.events.Event#pageY",memberOf:"glow.forms.ValidateResult",type:"Property",href:"glow.events.event.shtml#property:pagey"},
{name:"pageY",alias:"glow.events.Event#pageY",memberOf:"glow.events.Event",type:"Property",href:"glow.events.event.shtml#property:pagey"},
{name:"Panel",alias:"glow.widgets.Panel",memberOf:"glow.widgets",type:"Class",href:"glow.widgets.panel.shtml"},
{name:"parent",alias:"glow.dom.NodeList#parent",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:parent"},
{name:"parseCssColor",alias:"glow.dom.parseCssColor",memberOf:"glow.dom",type:"Method",href:"glow.dom.shtml#staticmethod:parsecsscolor"},
{name:"PASS",alias:"glow.forms.PASS",memberOf:"glow.forms",type:"Property",href:"glow.forms.shtml#staticproperty:pass"},
{name:"position",alias:"glow.anim.Animation#position",memberOf:"glow.anim.Animation",type:"Property",href:"glow.anim.animation.shtml#property:position"},
{name:"position",alias:"glow.dom.NodeList#position",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:position"},
{name:"post",alias:"glow.net.post",memberOf:"glow.net",type:"Method",href:"glow.net.shtml#staticmethod:post"},
{name:"prepend",alias:"glow.dom.NodeList#prepend",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:prepend"},
{name:"prependTo",alias:"glow.dom.NodeList#prependTo",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:prependto"},
{name:"prev",alias:"glow.dom.NodeList#prev",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:prev"},
{name:"prev",alias:"glow.widgets.Carousel#prev",memberOf:"glow.widgets.Carousel",type:"Method",href:"glow.widgets.carousel.shtml#method:prev"},
{name:"preventDefault",alias:"glow.events.Event#preventDefault",memberOf:"glow.forms.ValidateResult",type:"Method",href:"glow.events.event.shtml#method:preventdefault"},
{name:"preventDefault",alias:"glow.events.Event#preventDefault",memberOf:"glow.events.Event",type:"Method",href:"glow.events.event.shtml#method:preventdefault"},
{name:"prop",alias:"glow.dom.NodeList#prop",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:prop"},
{name:"propagationStopped",alias:"glow.events.Event#propagationStopped",memberOf:"glow.forms.ValidateResult",type:"Method",href:"glow.events.event.shtml#method:propagationstopped"},
{name:"propagationStopped",alias:"glow.events.Event#propagationStopped",memberOf:"glow.events.Event",type:"Method",href:"glow.events.event.shtml#method:propagationstopped"},
{name:"push",alias:"glow.dom.NodeList#push",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:push"},
{name:"range",alias:"glow.forms.tests.range",memberOf:"glow.forms.tests",type:"Method",href:"glow.forms.tests.shtml#staticmethod:range"},
{name:"ready",alias:"glow.ready",memberOf:"glow",type:"Method",href:"glow.shtml#staticmethod:ready"},
{name:"regex",alias:"glow.forms.tests.regex",memberOf:"glow.forms.tests",type:"Method",href:"glow.forms.tests.shtml#staticmethod:regex"},
{name:"relatedTarget",alias:"glow.events.Event#relatedTarget",memberOf:"glow.forms.ValidateResult",type:"Property",href:"glow.events.event.shtml#property:relatedtarget"},
{name:"relatedTarget",alias:"glow.events.Event#relatedTarget",memberOf:"glow.events.Event",type:"Property",href:"glow.events.event.shtml#property:relatedtarget"},
{name:"remove",alias:"glow.dom.NodeList#remove",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:remove"},
{name:"remove",alias:"glow.widgets.Mask#remove",memberOf:"glow.widgets.Mask",type:"Method",href:"glow.widgets.mask.shtml#method:remove"},
{name:"removeAllListeners",alias:"glow.events.removeAllListeners",memberOf:"glow.events",type:"Method",href:"glow.events.shtml#staticmethod:removealllisteners"},
{name:"removeAttr",alias:"glow.dom.NodeList#removeAttr",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:removeattr"},
{name:"removeClass",alias:"glow.dom.NodeList#removeClass",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:removeclass"},
{name:"removeData",alias:"glow.dom.NodeList#removeData",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:removedata"},
{name:"removeItem",alias:"glow.widgets.Carousel#removeItem",memberOf:"glow.widgets.Carousel",type:"Method",href:"glow.widgets.carousel.shtml#method:removeitem"},
{name:"removeItem",alias:"glow.widgets.Carousel#event:removeItem",memberOf:"glow.widgets.Carousel",type:"Event",href:"glow.widgets.carousel.shtml#event:event:removeitem"},
{name:"removeListener",alias:"glow.events.removeListener",memberOf:"glow.events",type:"Method",href:"glow.events.shtml#staticmethod:removelistener"},
{name:"removeScales",alias:"glow.widgets.Timetable#removeScales",memberOf:"glow.widgets.Timetable",type:"Method",href:"glow.widgets.timetable.shtml#method:removescales"},
{name:"replace",alias:"glow.lang.replace",memberOf:"glow.lang",type:"Method",href:"glow.lang.shtml#staticmethod:replace"},
{name:"replaceWith",alias:"glow.dom.NodeList#replaceWith",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:replacewith"},
{name:"Request",alias:"glow.net.Request",memberOf:"glow.net",type:"Class",href:"glow.net.request.shtml"},
{name:"required",alias:"glow.forms.tests.required",memberOf:"glow.forms.tests",type:"Method",href:"glow.forms.tests.shtml#staticmethod:required"},
{name:"Response",alias:"glow.net.Response",memberOf:"glow.net",type:"Class",href:"glow.net.response.shtml"},
{name:"resume",alias:"glow.anim.Timeline#resume",memberOf:"glow.anim.Timeline",type:"Method",href:"glow.anim.timeline.shtml#method:resume"},
{name:"resume",alias:"glow.anim.Timeline#event:resume",memberOf:"glow.anim.Timeline",type:"Event",href:"glow.anim.timeline.shtml#event:event:resume"},
{name:"resume",alias:"glow.anim.Animation#resume",memberOf:"glow.anim.Animation",type:"Method",href:"glow.anim.animation.shtml#method:resume"},
{name:"resume",alias:"glow.anim.Animation#event:resume",memberOf:"glow.anim.Animation",type:"Event",href:"glow.anim.animation.shtml#event:event:resume"},
{name:"returnTo",alias:"glow.widgets.Overlay#returnTo",memberOf:"glow.widgets.InfoPanel",type:"Property",href:"glow.widgets.overlay.shtml#property:returnto"},
{name:"returnTo",alias:"glow.widgets.Overlay#returnTo",memberOf:"glow.widgets.Panel",type:"Property",href:"glow.widgets.overlay.shtml#property:returnto"},
{name:"returnTo",alias:"glow.widgets.Overlay#returnTo",memberOf:"glow.widgets.Overlay",type:"Property",href:"glow.widgets.overlay.shtml#property:returnto"},
{name:"revertLocale",alias:"glow.i18n.revertLocale",memberOf:"glow.i18n",type:"Method",href:"glow.i18n.shtml#staticmethod:revertlocale"},
{name:"sameAs",alias:"glow.forms.tests.sameAs",memberOf:"glow.forms.tests",type:"Method",href:"glow.forms.tests.shtml#staticmethod:sameas"},
{name:"scroll",alias:"glow.widgets.Carousel#event:scroll",memberOf:"glow.widgets.Carousel",type:"Event",href:"glow.widgets.carousel.shtml#event:event:scroll"},
{name:"scrollLeft",alias:"glow.dom.NodeList#scrollLeft",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:scrollleft"},
{name:"scrollTop",alias:"glow.dom.NodeList#scrollTop",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:scrolltop"},
{name:"send",alias:"glow.net.Request#send",memberOf:"glow.net.Request",type:"Method",href:"glow.net.request.shtml#method:send"},
{name:"setBanding",alias:"glow.widgets.Timetable#setBanding",memberOf:"glow.widgets.Timetable",type:"Method",href:"glow.widgets.timetable.shtml#method:setbanding"},
{name:"setContext",alias:"glow.widgets.InfoPanel#setContext",memberOf:"glow.widgets.InfoPanel",type:"Method",href:"glow.widgets.infopanel.shtml#method:setcontext"},
{name:"setData",alias:"glow.widgets.AutoSuggest#setData",memberOf:"glow.widgets.AutoSuggest",type:"Method",href:"glow.widgets.autosuggest.shtml#method:setdata"},
{name:"setItemTemplate",alias:"glow.widgets.Timetable.Item#setItemTemplate",memberOf:"glow.widgets.Timetable.Item",type:"Method",href:"glow.widgets.timetable.item.shtml#method:setitemtemplate"},
{name:"setItemTemplate",alias:"glow.widgets.Timetable.Track#setItemTemplate",memberOf:"glow.widgets.Timetable.Track",type:"Method",href:"glow.widgets.timetable.track.shtml#method:setitemtemplate"},
{name:"setItemTemplate",alias:"glow.widgets.Timetable#setItemTemplate",memberOf:"glow.widgets.Timetable",type:"Method",href:"glow.widgets.timetable.shtml#method:setitemtemplate"},
{name:"setLocale",alias:"glow.i18n.setLocale",memberOf:"glow.i18n",type:"Method",href:"glow.i18n.shtml#staticmethod:setlocale"},
{name:"setPosition",alias:"glow.widgets.InfoPanel#setPosition",memberOf:"glow.widgets.InfoPanel",type:"Method",href:"glow.widgets.infopanel.shtml#method:setposition"},
{name:"setPosition",alias:"glow.widgets.Overlay#setPosition",memberOf:"glow.widgets.Panel",type:"Method",href:"glow.widgets.overlay.shtml#method:setposition"},
{name:"setPosition",alias:"glow.widgets.Overlay#setPosition",memberOf:"glow.widgets.Overlay",type:"Method",href:"glow.widgets.overlay.shtml#method:setposition"},
{name:"setTrackFooterTemplate",alias:"glow.widgets.Timetable.Track#setTrackFooterTemplate",memberOf:"glow.widgets.Timetable.Track",type:"Method",href:"glow.widgets.timetable.track.shtml#method:settrackfootertemplate"},
{name:"setTrackFooterTemplate",alias:"glow.widgets.Timetable#setTrackFooterTemplate",memberOf:"glow.widgets.Timetable",type:"Method",href:"glow.widgets.timetable.shtml#method:settrackfootertemplate"},
{name:"setTrackHeaderTemplate",alias:"glow.widgets.Timetable.Track#setTrackHeaderTemplate",memberOf:"glow.widgets.Timetable.Track",type:"Method",href:"glow.widgets.timetable.track.shtml#method:settrackheadertemplate"},
{name:"setTrackHeaderTemplate",alias:"glow.widgets.Timetable#setTrackHeaderTemplate",memberOf:"glow.widgets.Timetable",type:"Method",href:"glow.widgets.timetable.shtml#method:settrackheadertemplate"},
{name:"shiftKey",alias:"glow.events.Event#shiftKey",memberOf:"glow.forms.ValidateResult",type:"Property",href:"glow.events.event.shtml#property:shiftkey"},
{name:"shiftKey",alias:"glow.events.Event#shiftKey",memberOf:"glow.events.Event",type:"Property",href:"glow.events.event.shtml#property:shiftkey"},
{name:"show",alias:"glow.widgets.AutoSuggest#event:show",memberOf:"glow.widgets.AutoSuggest",type:"Event",href:"glow.widgets.autosuggest.shtml#event:event:show"},
{name:"show",alias:"glow.widgets.Overlay#show",memberOf:"glow.widgets.InfoPanel",type:"Method",href:"glow.widgets.overlay.shtml#method:show"},
{name:"show",alias:"glow.widgets.Overlay#event:show",memberOf:"glow.widgets.InfoPanel",type:"Event",href:"glow.widgets.overlay.shtml#event:event:show"},
{name:"show",alias:"glow.widgets.Overlay#show",memberOf:"glow.widgets.Panel",type:"Method",href:"glow.widgets.overlay.shtml#method:show"},
{name:"show",alias:"glow.widgets.Overlay#event:show",memberOf:"glow.widgets.Panel",type:"Event",href:"glow.widgets.overlay.shtml#event:event:show"},
{name:"show",alias:"glow.widgets.Overlay#show",memberOf:"glow.widgets.Overlay",type:"Method",href:"glow.widgets.overlay.shtml#method:show"},
{name:"show",alias:"glow.dom.NodeList#show",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:show"},
{name:"show",alias:"glow.widgets.Overlay#event:show",memberOf:"glow.widgets.Overlay",type:"Event",href:"glow.widgets.overlay.shtml#event:event:show"},
{name:"size",alias:"glow.widgets.Timetable.Track#size",memberOf:"glow.widgets.Timetable.Track",type:"Property",href:"glow.widgets.timetable.track.shtml#property:size"},
{name:"size",alias:"glow.widgets.Timetable#size",memberOf:"glow.widgets.Timetable",type:"Property",href:"glow.widgets.timetable.shtml#property:size"},
{name:"SKIP",alias:"glow.forms.SKIP",memberOf:"glow.forms",type:"Property",href:"glow.forms.shtml#staticproperty:skip"},
{name:"slice",alias:"glow.dom.NodeList#slice",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:slice"},
{name:"slideDown",alias:"glow.anim.slideDown",memberOf:"glow.anim",type:"Method",href:"glow.anim.shtml#staticmethod:slidedown"},
{name:"Slider",alias:"glow.widgets.Slider",memberOf:"glow.widgets",type:"Class",href:"glow.widgets.slider.shtml"},
{name:"slideStart",alias:"glow.widgets.Slider#event:slideStart",memberOf:"glow.widgets.Slider",type:"Event",href:"glow.widgets.slider.shtml#event:event:slidestart"},
{name:"slideStop",alias:"glow.widgets.Slider#event:slideStop",memberOf:"glow.widgets.Slider",type:"Event",href:"glow.widgets.slider.shtml#event:event:slidestop"},
{name:"slideToggle",alias:"glow.anim.slideToggle",memberOf:"glow.anim",type:"Method",href:"glow.anim.shtml#staticmethod:slidetoggle"},
{name:"slideUp",alias:"glow.anim.slideUp",memberOf:"glow.anim",type:"Method",href:"glow.anim.shtml#staticmethod:slideup"},
{name:"sort",alias:"glow.dom.NodeList#sort",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:sort"},
{name:"sort",alias:"glow.widgets.Sortable#event:sort",memberOf:"glow.widgets.Sortable",type:"Event",href:"glow.widgets.sortable.shtml#event:event:sort"},
{name:"Sortable",alias:"glow.widgets.Sortable",memberOf:"glow.widgets",type:"Class",href:"glow.widgets.sortable.shtml"},
{name:"source",alias:"glow.events.Event#source",memberOf:"glow.forms.ValidateResult",type:"Property",href:"glow.events.event.shtml#property:source"},
{name:"source",alias:"glow.events.Event#source",memberOf:"glow.events.Event",type:"Property",href:"glow.events.event.shtml#property:source"},
{name:"start",alias:"glow.widgets.Timetable.Item#start",memberOf:"glow.widgets.Timetable.Item",type:"Property",href:"glow.widgets.timetable.item.shtml#property:start"},
{name:"start",alias:"glow.anim.Timeline#start",memberOf:"glow.anim.Timeline",type:"Method",href:"glow.anim.timeline.shtml#method:start"},
{name:"start",alias:"glow.widgets.Timetable#start",memberOf:"glow.widgets.Timetable",type:"Property",href:"glow.widgets.timetable.shtml#property:start"},
{name:"start",alias:"glow.anim.Timeline#event:start",memberOf:"glow.anim.Timeline",type:"Event",href:"glow.anim.timeline.shtml#event:event:start"},
{name:"start",alias:"glow.anim.Animation#start",memberOf:"glow.anim.Animation",type:"Method",href:"glow.anim.animation.shtml#method:start"},
{name:"start",alias:"glow.anim.Animation#event:start",memberOf:"glow.anim.Animation",type:"Event",href:"glow.anim.animation.shtml#event:event:start"},
{name:"status",alias:"glow.net.Response#status",memberOf:"glow.net.Response",type:"Property",href:"glow.net.response.shtml#property:status"},
{name:"statusText",alias:"glow.net.Response#statusText",memberOf:"glow.net.Response",type:"Method",href:"glow.net.response.shtml#method:statustext"},
{name:"stop",alias:"glow.anim.Timeline#stop",memberOf:"glow.anim.Timeline",type:"Method",href:"glow.anim.timeline.shtml#method:stop"},
{name:"stop",alias:"glow.anim.Timeline#event:stop",memberOf:"glow.anim.Timeline",type:"Event",href:"glow.anim.timeline.shtml#event:event:stop"},
{name:"stop",alias:"glow.anim.Animation#stop",memberOf:"glow.anim.Animation",type:"Method",href:"glow.anim.animation.shtml#method:stop"},
{name:"stop",alias:"glow.anim.Animation#event:stop",memberOf:"glow.anim.Animation",type:"Event",href:"glow.anim.animation.shtml#event:event:stop"},
{name:"stopPropagation",alias:"glow.events.Event#stopPropagation",memberOf:"glow.forms.ValidateResult",type:"Method",href:"glow.events.event.shtml#method:stoppropagation"},
{name:"stopPropagation",alias:"glow.events.Event#stopPropagation",memberOf:"glow.events.Event",type:"Method",href:"glow.events.event.shtml#method:stoppropagation"},
{name:"tests",alias:"glow.forms.tests",memberOf:"glow.forms",type:"Namespace",href:"glow.forms.tests.shtml"},
{name:"text",alias:"glow.dom.NodeList#text",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:text"},
{name:"text",alias:"glow.net.Response#text",memberOf:"glow.net.Response",type:"Method",href:"glow.net.response.shtml#method:text"},
{name:"timedOut",alias:"glow.net.Response#timedOut",memberOf:"glow.net.Response",type:"Property",href:"glow.net.response.shtml#property:timedout"},
{name:"Timeline",alias:"glow.anim.Timeline",memberOf:"glow.anim",type:"Class",href:"glow.anim.timeline.shtml"},
{name:"timetable",alias:"glow.widgets.Timetable.Track#timetable",memberOf:"glow.widgets.Timetable.Track",type:"Property",href:"glow.widgets.timetable.track.shtml#property:timetable"},
{name:"Timetable",alias:"glow.widgets.Timetable",memberOf:"glow.widgets",type:"Class",href:"glow.widgets.timetable.shtml"},
{name:"title",alias:"glow.widgets.Timetable.Item#title",memberOf:"glow.widgets.Timetable.Item",type:"Property",href:"glow.widgets.timetable.item.shtml#property:title"},
{name:"title",alias:"glow.widgets.Timetable.Track#title",memberOf:"glow.widgets.Timetable.Track",type:"Property",href:"glow.widgets.timetable.track.shtml#property:title"},
{name:"toArray",alias:"glow.lang.toArray",memberOf:"glow.lang",type:"Method",href:"glow.lang.shtml#staticmethod:toarray"},
{name:"toggleClass",alias:"glow.dom.NodeList#toggleClass",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:toggleclass"},
{name:"track",alias:"glow.widgets.Timetable.Item#track",memberOf:"glow.widgets.Timetable.Item",type:"Property",href:"glow.widgets.timetable.item.shtml#property:track"},
{name:"Track",alias:"glow.widgets.Timetable.Track",memberOf:"glow.widgets.Timetable",type:"Class",href:"glow.widgets.timetable.track.shtml"},
{name:"tracks",alias:"glow.widgets.Timetable#tracks",memberOf:"glow.widgets.Timetable",type:"Property",href:"glow.widgets.timetable.shtml#property:tracks"},
{name:"trim",alias:"glow.lang.trim",memberOf:"glow.lang",type:"Method",href:"glow.lang.shtml#staticmethod:trim"},
{name:"tween",alias:"glow.anim.Animation#tween",memberOf:"glow.anim.Animation",type:"Property",href:"glow.anim.animation.shtml#property:tween"},
{name:"tweens",alias:"glow.tweens",memberOf:"glow",type:"Namespace",href:"glow.tweens.shtml"},
{name:"UID",alias:"glow.UID",memberOf:"glow",type:"Property",href:"glow.shtml#staticproperty:uid"},
{name:"unwrap",alias:"glow.dom.NodeList#unwrap",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:unwrap"},
{name:"useSeconds",alias:"glow.anim.Animation#useSeconds",memberOf:"glow.anim.Animation",type:"Property",href:"glow.anim.animation.shtml#property:useseconds"},
{name:"val",alias:"glow.dom.NodeList#val",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:val"},
{name:"val",alias:"glow.widgets.AutoSuggest#val",memberOf:"glow.widgets.AutoSuggest",type:"Method",href:"glow.widgets.autosuggest.shtml#method:val"},
{name:"val",alias:"glow.widgets.Slider#val",memberOf:"glow.widgets.Slider",type:"Method",href:"glow.widgets.slider.shtml#method:val"},
{name:"validate",alias:"glow.forms.Form#validate",memberOf:"glow.forms.Form",type:"Method",href:"glow.forms.form.shtml#method:validate"},
{name:"validate",alias:"glow.forms.Form#event:validate",memberOf:"glow.forms.Form",type:"Event",href:"glow.forms.form.shtml#event:event:validate"},
{name:"ValidateResult",alias:"glow.forms.ValidateResult",memberOf:"glow.forms",type:"Class",href:"glow.forms.validateresult.shtml"},
{name:"valToLabel",alias:"glow.widgets.Slider#valToLabel",memberOf:"glow.widgets.Slider",type:"Method",href:"glow.widgets.slider.shtml#method:valtolabel"},
{name:"value",alias:"glow.anim.Animation#value",memberOf:"glow.anim.Animation",type:"Property",href:"glow.anim.animation.shtml#property:value"},
{name:"version",alias:"glow.embed.Flash.version",memberOf:"glow.embed.Flash",type:"Method",href:"glow.embed.flash.shtml#staticmethod:version"},
{name:"VERSION",alias:"glow.VERSION",memberOf:"glow",type:"Property",href:"glow.shtml#staticproperty:version"},
{name:"viewRange",alias:"glow.widgets.Timetable#viewRange",memberOf:"glow.widgets.Timetable",type:"Method",href:"glow.widgets.timetable.shtml#method:viewrange"},
{name:"visibleIndexes",alias:"glow.widgets.Carousel#visibleIndexes",memberOf:"glow.widgets.Carousel",type:"Method",href:"glow.widgets.carousel.shtml#method:visibleindexes"},
{name:"visibleItems",alias:"glow.widgets.Carousel#visibleItems",memberOf:"glow.widgets.Carousel",type:"Method",href:"glow.widgets.carousel.shtml#method:visibleitems"},
{name:"wasSuccessful",alias:"glow.net.Response#wasSuccessful",memberOf:"glow.net.Response",type:"Property",href:"glow.net.response.shtml#property:wassuccessful"},
{name:"wheelDelta",alias:"glow.events.Event#wheelDelta",memberOf:"glow.forms.ValidateResult",type:"Property",href:"glow.events.event.shtml#property:wheeldelta"},
{name:"wheelDelta",alias:"glow.events.Event#wheelDelta",memberOf:"glow.events.Event",type:"Property",href:"glow.events.event.shtml#property:wheeldelta"},
{name:"widgets",alias:"glow.widgets",memberOf:"glow",type:"Namespace",href:"glow.widgets.shtml"},
{name:"width",alias:"glow.dom.NodeList#width",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:width"},
{name:"wrap",alias:"glow.dom.NodeList#wrap",memberOf:"glow.dom.NodeList",type:"Method",href:"glow.dom.nodelist.shtml#method:wrap"},
{name:"xml",alias:"glow.net.Response#xml",memberOf:"glow.net.Response",type:"Method",href:"glow.net.response.shtml#method:xml"}

]

// like above, but just an array of alias names
var glow1Aliases = [], i = glow1Api.length;

while (i--) {
	glow1Aliases[i] = glow1Api[i].alias;
}