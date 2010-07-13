var Brew;
(function() {
	// there can be only one
	if (Brew) { return; }
	
	var brewMap,
		defaultBase,
		document = window.document,
		scripts = document.getElementsByTagName('script'),
		thisScriptSrc;
	
	// we need to be very explicit to defend against some browser
	// extensions which add elements to the document unexpectedly
	for (var i = scripts.length; i--;) { // find the most recent script tag for brew
		if ( /\bbrew\b/.test(scripts[i].src || '') ) {
			thisScriptSrc = scripts[i].src;
			break;
		}
	}
		
	// get default base from last script element
	defaultBase = thisScriptSrc? 
		thisScriptSrc.slice( 0, thisScriptSrc.lastIndexOf('/') +1 ) + '../'
		: '';
		
	// track when document is ready, must run before the page is finished loading
	if (!document.readyState && document.addEventListener) { // like Mozilla
		document.addEventListener('DOMContentLoaded', function () {
				document.readyState = 'complete';
		}, false);
	}
	
	/**
		@public
		@name Brew
		@function
		@description Creates an instance of the Brew JavaScript Library.
		@param {string} [version]
		@param {object} [opts]
		@param {string} [opts.base] The path to the base folder, in which the Brew versions are kept.
		@param {boolean} [opts.debug] Have all filenames modified to point to debug versions.
	*/
	Brew = function(version, opts) { /*debug*///log.info('new Brew("'+Array.prototype.join.call(arguments, '", "')+'")');
		opts = opts || {};
		
		var brew,
			debug = (opts.debug)? '.debug' : '',
			base = opts.base || defaultBase;

		brewMap = {
			versions: ['1.0.0a1', 'src'],
			'1.0.0a1': {
				'core': ['core'+debug+'.js'],
				'ui':   ['core', 'ui'+debug+'.js', 'ui'+debug+'.css']
			}
		};
		
		if (opts._map) { brewMap = opts._map; } // for testing purposes map can be overridden
		
		version = getVersion(version); /*debug*///log.info('Version is "'+version+'"');
		
		if (Brew._build.instances[version]) { /*debug*///log.info('instance for "'+version+'" already exists.');
			return Brew._build.instances[version];
		}
		
		// opts.base should be formatted like a directory
		if (base.slice(-1) !== '/') {
			base += '/';
		}
		
		brew = createInstance(version, base);
		Brew._build.instances[version] = brew;
		
		brew.UID = 'brew' + Math.floor(Math.random() * (1<<30));

 		if (!opts._noload) { brew.load('core'); } // core is always loaded;
 		 		
		return brew;
	}
	
	/**
		@private
		@name getVersion
		@function
		@param {string} version A (possibly imprecise) version identifier, like "1".
		@param {boolean} exact Force this function to only return exact matches for the requested version.
		@description Finds the most recent, available version of brew that matches the requested version.
		Versions that contain characters other than numbers and dots are never returned
		unless you ask for then exactly.
		@returns {string} The version identifier that best matches the given version.
		For example, given 1.1 this function could return 1.1.5 as the best match. 
	 */
	var getVersion = function(version, forceExact) { /*debug*///console.info('getVersion("'+version+'")');
		var versions = brewMap.versions,
			matchThis = version + '.',
			findExactMatch = forceExact || /[^0-9.]/.test(version); // like 1.1-alpha7

		// TODO: an empty version means: the very latest version?
		
		var i = versions.length;
		while (i--) {
			if (findExactMatch) {
				if (versions[i] === version) { return versions[i]; }
			}
			else if ( (versions[i] + '.').indexOf(matchThis) === 0 && !/[^0-9.]/.test(versions[i]) ) {
				return versions[i];
			}
		}

		throw new Error('Version "'+version+'" does not exist');
	}
	
	/**
		@private
		@name getMap
		@function
		@description Find the file map for a given version.
		@param {string} version Resolved identifier, like '1.0.0'.
		@returns {object} A map of package names to files list.
	 */
	var getMap = function(version) { /*debug*///log.info('getMap("'+version+'")');
		var versions = brewMap.versions,
			map = null,
			versionFound = false;
		
		var i = versions.length;
		while (--i > -1) {
			if (brewMap[versions[i]]) { map = brewMap[versions[i]]; }
			if (versions[i] === version) { versionFound = true; }
			if (versionFound && map) { return map; }
		}
		
		throw new Error('No map available for version "' + version + '".');
	}
	
	/**
		@private
		@name injectJs
		@function
		@description Start asynchronously loading an external JavaScript file.
	 */
	var injectJs = function(src) { /*debug*///log.info('injectJs("'+src+'")');
		var head,
			script;
		
		head = document.getElementsByTagName('head')[0];
		script = document.createElement('script');
		script.src = src;
		script.type = 'text/javascript';
		
		head.insertBefore(script, head.firstChild); // rather than appendChild() to avoid IE bug when injecting SCRIPTs after BASE tag opens. see: http://shauninman.com/archive/2007/04/13/operation_aborted
	}
	
	/**
		@private
		@name injectCss
		@function
		@description Start asynchronously loading an external CSS file.
	 */
	var injectCss = function(src) { /*debug*///log.info('injectCss("'+src+'")');
		var head,
			link;
			
		head = document.getElementsByTagName('head')[0];
		link = document.createElement('link');
		link.href = src;
		link.type = 'text/css';
		link.rel = 'stylesheet';
		
		head.insertBefore(link, head.firstChild);
	}
	
	/** @private */
	Brew._build = {
		provided: [], // provided but not yet complete
		instances: {} // built
	}
	
	/**
		@private
		@name Brew.provide
		@function
		@param {function} builder A function to run, given an instance of brew, and will add a feature to brew.
		@description Provide a builder function to Brew as part of a package.
	 */
	Brew.provide = function(builder) { /*debug*///console.log('Brew.provide('+typeof builder+')');
		Brew._build.provided.push(builder);
	}
	
	/**
		@private
		@name Brew.complete
		@function
		@param {string} name The name of the completed package.
		@param {string} version The version of the completed package.
		@description Signals that no more builder functions will be provided by this package.
	 */
	Brew.complete = function(name, version) { /*debug*///console.log('Brew.complete('+name+', '+version+')');
		var brew,
			loading,
			builders;
		
		if (version === '@'+'SRC@') { version = 'src'}
		// now that we have the name and version we can move the builders out of provided cache
		brew = Brew._build.instances[version];
		if (!brew) { /*debug*///log.info('Cannot complete, unknown version of brew: '+version);
			throw new Error('Cannot complete, unknown version of brew: '+version);
		}
		brew._bBuild.builders[name] = Brew._build.provided;
		Brew._build.provided = [];

		// shortcuts
		loading  = brew._bBuild.loading;
		builders = brew._bBuild.builders;
		
		// try to build packages, in the same order they were loaded
		for (var i = 0; i < loading.length; i++) { // loading.length may change during loop
			if (!builders[loading[i]]) { /*debug*///log.info(loading[i]+' has no builders.');
				break;
			}
			
			// run the builders for this package in the same order they were loaded
			for (var j = 0, jlen = builders[loading[i]].length; j < jlen; j++) { /*debug*///log.info('running builder '+j+ ' for '+loading[i]+' version '+brew.version);
				builders[loading[i]][j](brew); // builder will modify brew
			}
			
			// remove this package from the loaded and builders list, now that it's built
			if (brew._removeReadyBlock) { brew._removeReadyBlock('brew_loading_'+loading[i]); }
			builders[loading[i]] = undefined;
			loading.splice(i, 1);
			i--;
		}
		
		// try to run onLoaded callbacks
		brew._release();
	}
	
	/**
		@private
		@function
		@description Creates an instance of the Brew library. 
		@param {string} version
		@param {string} base
	 */
	var createInstance = function(version, base) { /*debug*///log.info('new brew("'+Array.prototype.join.call(arguments, '", "')+'")');
		var $ = function(selector, context) {
			return new $.fn.init(selector, context);
		};
		
		$._bVersion = version;
		$._bBase = base;
		$._bMap = getMap(version);
		$._bBuild = {
			loading: [],   // names of packages requested but not yet built, in same order as requested.
			builders: {},  // completed but not yet built (waiting on dependencies). Like _build.builders[packageName]: [function, function, ...].
			history: {},   // names of every package ever loaded for this instance
			callbacks: []
		};
		
		// copy properties from $Members
		for (var prop in $Members) {
			$[prop] = $Members[prop];
		}
		
		return $;
	}
	
	
	/**
		@name $Members
		@private
		@description All members of this object will be copied onto little-brew instances
		@type {Object}
	*/
	var $Members = {
		/**
			@public
			@name brew#load
			@function
			@description Add a package to this instance of the Brew library.
			@param {string[]} ... The names of 1 or more packages to add.
		 */
		load: function() { /*debug*///log.info('brew.load("'+Array.prototype.join.call(arguments, '", "')+'") for version '+this.version);
			var name = '',
				src,
				depends;
			
			for (var i = 0, len = arguments.length; i < len; i++) {
				name = arguments[i];
				
				if (this._bBuild.history[name]) { /*debug*///log.info('already loaded package "'+name+'" for version '+this.version+', skipping.');
					continue;
				}
				
				this._bBuild.history[name] = true;
				
				// packages have dependencies, listed in the map: a single js file, css files, or even other packages
				depends = this._bMap[name]; /*debug*///log.info('depends for '+name+' '+this.version+': "'+depends.join('", "')+'"');
				for (var j = 0, lenj = depends.length; j < lenj; j++) {
					
					if (depends[j].slice(-3) === '.js') { /*debug*///log.info('dependent js: "'+depends[j]+'"');
						src = this._bBase + this._bVersion + '/' + depends[j];
						
						// readyBlocks are removed in _release()
						if (this._addReadyBlock) { this._addReadyBlock('brew_loading_'+name); } // provided by core
						this._bBuild.loading.push(name);
						
						injectJs(src);
					}
					else if (depends[j].slice(-4) === '.css') { /*debug*///log.info('dependent css "'+depends[j]+'"');
						src = this._bBase + this._bVersion + '/' + depends[j];
						injectCss(src);
					}
					else { /*debug*///log.info('dependent package: "'+depends[j]+'"');
						this.load(depends[j]); // recursively load dependency packages
					}
				}
			}
			
			return this;
		},
		/**
			@public
			@name brew#loaded
			@function
			@param {function} onLoadCallback Called when all the packages load.
			@description Do something when all the packages load.
		 */
		loaded: function(onLoadCallback) { /*debug*///log.info('brew.loaded('+typeof onLoadCallback+') for version '+this.version);
			this._bBuild.callbacks.push(onLoadCallback);
			if (this._addReadyBlock) { this._addReadyBlock('brew_loading_loadedcallback'); }
			
			this._release();
			
			return this;
		},
		/**
			@private
			@name brew#_release
			@function
			@description If all loaded packages are now built, then run the onLoaded callbacks.
		 */
		_release: function() { /*debug*///log.info('brew._release("'+this.version+'")');
			var callback;
			
			if (this._bBuild.loading.length !== 0) { /*debug*///log.info('waiting for '+this._build.loading.length+' to finish.');
				return;
			}
			/*debug*///log.info('running '+this._build.callbacks.length+' loaded callbacks for version "'+this.version+'"');
			
			// run and remove each available _onloaded callback
			while (callback = this._bBuild.callbacks.shift()) {
				callback(this);
				if (this._removeReadyBlock) { this._removeReadyBlock('brew_loading_loadedcallback'); }
			}
		},
		/**
			@name brew#ready
			@function
			@param {function} onReadyCallback Called when all the packages load and the DOM is available.
			@description Do something when all the packages load and the DOM is ready.
		 */
		ready: function(onReadyCallback) { /*debug*///console.log('brew#ready('+typeof onReadyCallback+')');
			this.loaded(function(brew) {
				brew.ready(onReadyCallback);
			});
			
			return this;
		}
	}
})();