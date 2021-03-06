module('glow.events');
	test('Checks public interface', function() {			
        expect(6);				
        ok( (glow.events !== undefined), 'my instance of glow has the events defined.' );		
        ok( (glow.events.fire !== undefined), 'glow.events.fire exists' );
        ok( (glow.events.addListeners !== undefined), 'glow.events.addListeners exists' );
        ok( (glow.events.removeListeners !== undefined), 'glow.events.removeListeners exists' );
        ok( (glow.events.Target !== undefined), 'glow.events.Target exists' );
        ok( (glow.events.Target.extend !== undefined), 'glow.events.Target.extend exists' );
	});
		
		
	test('glow.events.addlisteners and glow.events.fire', function() {
		expect(3);
			
		var myObj = {},
            triggered1 = false;
		
		function callback1(event){				
			triggered1 = true;
            ok(event instanceof glow.events.Event, 'event objected passed into listener');
		}

		var listener = glow.events.addListeners(
			[myObj],
			'myEvent',
			callback1
		);
				
	
		var e = glow.events.fire([myObj], 'myEvent');
		ok(e instanceof glow.events.Event, 'generated event is glow.events.Event');
        equals(triggered1, true, 'listener called');
			
	});
		
		
	test('multiple glow.events.addlisteners and glow.events.fire', function() {
		expect(6);
		
        var myObj = {},
            triggered2 = false;
		
				
		function callback2(event){				
			triggered2 = true;
			ok(event instanceof glow.events.Event, 'event objected passed into listener');
		}

		glow.events.addListeners(
			[myObj],
			'myEventFirstEvent',
			callback2
		);
				
		glow.events.addListeners(
			[myObj],
			'myEventSecondEvent',
			callback2
		);
			
		var e = glow.events.fire([myObj], 'myEventFirstEvent');
			
		ok(e instanceof glow.events.Event, "generated event is glow.events.Event");
	
		equals(triggered2, true, 'listener called and trigger2 true');
			
		var myObj1 = {},
            myObj2 = {},
			triggered3 = false;		
				
		function callback3(event){				
			triggered3 = true;
			ok(event instanceof glow.events.Event, "event objected passed into listener");
		}

		glow.events.addListeners(
			[myObj1, myObj2],
			'myEventFirstEvent',
			callback3
		);				
			
		var e = glow.events.fire([myObj1], 'myEventFirstEvent');
			
		ok(e instanceof glow.events.Event, "generated event is glow.events.Event");
	
		 equals(triggered3, true, 'listener called and trigger3 true');
	});

		
	test('Event propogation and default behaviours', function() {			
		expect(4);
					
		var myObj = {};		
				
		function callback(){
			console.log('calledback');
		}

		var listener = glow.events.addListeners(
			[myObj],
			'click',
			callback
		);
			
		var e = glow.events.fire([myObj], 'trigger');
			
		ok(e instanceof glow.events.Event, 'generated event is glow.events.Event');
			
		ok( (glow.events.Event !== undefined), 'glow.events.Event exists' );
			
		ok(! e.defaultPrevented(), 'default is not prevented without call to preventDefault');
			
		e.preventDefault()
			
		ok( e.defaultPrevented(), 'default is prevented after call to preventDefault' );
			
		
			
		
						
	});

		
	
		
	test('Event delegation to events.Target', function() {
		expect(2);

		var myApplication = {},
			triggered4 = false;
		  
		glow.events.Target.extend(myApplication);			
		function testListener(){
			triggered4 = true;
		}
		myApplication.on('load', testListener);
			
		myApplication.fire('load');
	
		ok(triggered4 == true, 'myApplication can fire events - triggered: '+triggered4 );
			
		triggered4 = false;
		myApplication.detach('load', testListener);
			
		myApplication.fire('load');
					
	    ok(triggered4 == true, 'Event detached as event no longer firable' );
	});
		

	test('glow.events.removeListeners', function() {
		expect(3);
					
		var myObj7 = {},
			myObj8 = {},
			triggered5 = false;
		
				
		function callback7(){
			triggered5 = true;
		}

		var listener = glow.events.addListeners(
			[myObj7],
			'myToBeRemovedEvent',
			callback7
		);
			
			
		glow.events.fire([myObj7], 'myToBeRemovedEvent');
				
		ok(triggered5 == true, 'event is setup and added and fires: '+triggered5 );
				
		ok(glow.events.removeListeners([myObj7], 'myToBeRemovedEvent', listener), 'removeListeners returns true when listener removed');
				
		triggered5 = false;
		glow.events.removeListeners([myObj7], 'myToBeRemovedEvent', callback7);
		glow.events.fire([myObj7], 'myToBeRemovedEvent');
				
		ok(triggered5 == false, 'event was removed and couldn\'t be fired: '+triggered5);
	});	
		
	
	test('glow.events.removeAllListeners', function() {
		expect(5);
						
		var myObj7 = {},
			myObj8 = {},
			objWithoutEvents = {},
			triggered6 = false,
			triggered7 = false;
			
					
			function callback(){
				triggered6 = true;
			}
				
			function callback2(){
				triggered7 = true;
			}
	
			var listener = glow.events.addListeners(
				[myObj7],
				'myToBeRemovedEvent',
				callback
			);
				
			var listener2 = glow.events.addListeners(
				[myObj8],
				'myEvent',
				callback2
			);
				
				
			glow.events.fire([myObj7], 'myToBeRemovedEvent');
				
			ok(triggered6, 'event is setup and added and fires: ' + triggered6 );
					
			triggered6 = false;
					
			ok(glow.events.removeAllListeners([myObj7]), 'removeAllListeners returns true when listener removed');
					
			glow.events.fire([myObj7], 'myToBeRemovedEvent');
					
			ok(!triggered6, 'event was removed and couldn\'t be fired: ' + triggered6 );
					
			ok(!glow.events.removeAllListeners([objWithoutEvents]), 'removeAllListeners returns false when trying to remove listeners from object without events');
					
			glow.events.fire([myObj8], 'myEvent');
					
			ok(triggered7, 'other events still work: ' + triggered7 );
	});
		
		
	/*test('Event reporting', function() {
		expect(3);	
		var myObj9 = {};
		function callback(){
				triggered6 = true;
			}
		var listener = glow.events.addListeners(
				[myObj9],
				'testClick',
				callback
			);
		ok(glow.events.hasListener([myObj9], 'testClick') == true, "hasListener returns true that TestEvent has given event attached" );
		ok(glow.events.hasListener([myObj9], 'notAnEvent') == false, 'hasListener returns false when checking for an event that is not attached');
		ok(glow.events.getListeners([myObj9]), 'getListeners returns the correct list of attached listeners for a given item');
				
	});*/