setTimeout(
	function() {
			
			Brew.provide(
			function($) {
				if (!$.more) { throw new Error('Cannot build widgets before more.'); }
				
				$.widgets = {};
				window.log.push(' [3] built widgets 2.1.1');
			}
		);
		
		Brew.complete('widgets', '2.1.1');
	},
	100 + Math.floor(Math.random()*1000)
);