Glow.provide(function(glow) {
	var undefined,
		NodeListProto = glow.NodeList.prototype,
		env = glow.env,
		// Mapping of HTML attribute names to DOM0 property names.
		dom0PropertyMapping = { // keys must be lowercase
			'class'     : 'className',
			'for'       : 'htmlFor',
			'maxlength' : 'maxLength'
		},
		// The property name added to the DomElement by the NodeList#data method.
		dataPropName = '_uniqueData' + glow.UID,
		// The value of the dataPropName added by the NodeList#data method.
		dataIndex = 1, // must be a truthy value
		/**
			@private
			@name glow.NodeList-dataCache
			@type Object
			@description Holds the data used by the NodeList#data method.
			
			The structure is like:
			[
				{
					myKey: "my data"
				}
			]
		*/
		dataCache = [];
			
	/**
	@name glow.NodeList#addClass
	@function
	@description Adds a class to each node.

	@param {string} name The name of the class to add.

	@returns {glow.NodeList}

	@example
		glow("#login a").addClass("highlight");
	*/
	NodeListProto.addClass = function(name) {
		var i = this.length;
		
		/*!debug*/
			if (arguments.length !== 1) {
				glow.debug.warn('[wrong count] glow.NodeList#addClass expects 1 argument, not '+arguments.length+'.');
			}
			else if (typeof arguments[0] !== 'string') {
				glow.debug.warn('[wrong type] glow.NodeList#addClass expects argument 1 to be of type string, not '+typeof arguments[0]+'.');
			}
		/*gubed!*/
		
		while (i--) {
			if (this[i].nodeType === 1) {
				_addClass(this[i], name);
			}
		}
		
		return this;
	};
	
	function _addClass(node, name) { // TODO: handle classnames separated by non-space characters?
		if ( (' ' + node.className + ' ').indexOf(' ' + name + ' ') === -1 ) {
			node.className += (node.className? ' ' : '') + name;
		}
	}
	
	/**
	@name glow.NodeList#attr
	@function
	@description Gets or sets attributes.

		When getting an attribute, it is retrieved from the first
		node in this NodeList. Setting attributes applies the change
		to each element in this NodeList.

		To set an attribute, pass in the name as the first
		parameter and the value as a second parameter.

		To set multiple attributes in one call, pass in an object of
		name/value pairs as a single parameter.

		For browsers that don't support manipulating attributes
		using the DOM, this method will try to do the right thing
		(i.e. don't expect the semantics of this method to be
		consistent across browsers as this is not possible with
		currently supported browsers).

	@param {string | Object} name The name of the attribute, or an object of name/value pairs
	@param {string} [value] The value to set the attribute to.

	@returns {string | undefined | glow.NodeList}

		When setting attributes this method returns its own NodeList, otherwise
		returns the attribute value. The attribute name is always treated as
		case-insensitive. When getting, the returned value will be of type string unless
		that particular attribute was never set and there is no default value, in which
		case the returned value will be an empty string.

	@example
		var myNodeList = glow("img");

		// get an attribute
		myNodeList.attr("src");

		// set an attribute
		myNodeList.attr("src", "whatever.jpg");

		// set multiple attributes
		myNodeList.attr({
		  src: "a.png",
		  alt: "Cat jumping through a field"
		});
	 */
	 // see: http://tobielangel.com/2007/1/11/attribute-nightmare-in-ie/
	NodeListProto.attr = function(name, value) {
		var thisLen = this.length,
			keyvals = (typeof name === 'object') && name,
			dom0Property = '',
			node,
			attrNode,
			i = thisLen;
		
		/*!debug*/
			if (arguments.length === 2 && typeof arguments[0] !== 'string') {glow.debug.warn('[wrong type] glow.NodeList#attr expects name to be of type string, not '+typeof arguments[0]+'.'); }
			else if (arguments.length === 1 && (typeof arguments[0] !== 'string' && arguments[0].constructor !== Object)) {glow.debug.warn('[wrong type] glow.NodeList#attr expects argument 1 to be of type string or an instance of Object.'); }
			else if (arguments.length === 0 ||  arguments.length > 2) { glow.debug.warn('[wrong count] glow.NodeList#attr expects 1 or 2 arguments, not '+arguments.length+'.'); }
		/*gubed!*/

		// quick exist if NodeList is empty
		if (thisLen === 0) { // is this an empty nodelist?
			return (value || keyvals) ? this : '';
		}

		if (typeof keyvals === 'object') { // SETting value from {name: value} object
			for (name in keyvals) {
				if (!keyvals.hasOwnProperty(name)) { continue; }
				this.attr( name, keyvals[name] );
			}
			
			return this;
		}

		if (value === undefined) { // GETting value from name. see http://reference.sitepoint.com/javascript/Element/getAttribute
			node = this[0];

			if (node.nodeType !== 1) {
				return '';
			}

			if ( env.ie && (name === 'href' || name === 'src') ) {
				value = node.getAttribute(name, 2); // IE flags, 0: case-insensitive + 2: exactly as set
				return (value === null)? '' : value;
			}
			else if (node.attributes[name]) { // in IE node.getAttributeNode sometimes returns unspecified default values so we look for specified attributes if we can
				return (!node.attributes[name].specified)? '' : node.attributes[name].value;
			}
			else if (node.getAttributeNode) { // in IE getAttribute() does not always work so we use getAttributeNode if we can
				attrNode = node.getAttributeNode(name, 0);
				return (attrNode === null)? '' : attrNode.value;
			}
			else {
				value = node.getAttribute(name, 2); // IE flags, 0: case-insensitive + 2: exactly as set
				return (value === null)? '' : value;
			}
		}
		else { // SETting a single value like attr(name, value), normalize to an keyval object
			if (env.ie < 8) {
				dom0Property = dom0PropertyMapping[name.toLowerCase()];
			}

			while (i--) {
				node = this[i];
				if (node.nodeType === 1) {
					if (dom0Property) {
						node[dom0Property] = value;
					}
					else {
						node.setAttribute(name, value, 0); // IE flags, 0: case-insensitive
					}
				}
			}
			return this;
		}
	};
	/**
		Copies the data from one nodelist to another
		@private
		@name glow.NodeList._copyData
		@see glow.NodeList#clone
		@function
	*/
	glow.NodeList._copyData = function(from, to){
		var i = to.length,
			data;
		
		while (i--) {
			data = dataCache[ from[i][dataPropName] ];
			data && to.slice(i, i+1).data(data);
		}
	}

	/**
	@name glow.NodeList#data
	@function
	@description Use this to safely attach arbitrary data to any DOM Element.
	
	This method is useful when you wish to avoid memory leaks that are possible when adding your own data directly to DOM Elements.
	
	When called with no arguments, will return glow's entire data store for the first node in this NodeList.
	
	Otherwise, when given a name, will return the associated value from the first node in this NodeList.
	
	When given both a name and a value, will store that data on every node in this NodeList.
	
	Optionally you can pass in a single object composed of multiple name, value pairs.
	
	@param {string|Object} [key] The name of the value in glow's data store.
	@param {Object} [val] The value you wish to associate with the given name.
	@see glow.NodeList#removeData
	@example
	
	glow("p").data("tea", "milky");
	var colour = glow("p").data("tea"); // milky
	@returns {Object} When setting a value this method can be chained, as in that case it will return itself.
	@see glow.NodeList#removeData
	*/
	NodeListProto.data = function (key, val) { /*debug*///console.log("data("+key+", "+val+")");
		var args = arguments,
			argsLen = args.length,
			keyvals = key, // like: data({key: val}) or data(key, val)
			index,
			node;
			
		/*!debug*/
			if (arguments.length === 2 && typeof arguments[0] !== 'string') {glow.debug.warn('[wrong type] glow.NodeList#data expects name argument to be of type string.'); }
			else if (arguments.length === 1 && (typeof arguments[0] !== 'string' && arguments[0].constructor !== Object)) {glow.debug.warn('[wrong type] glow.NodeList#data expects argument 1 to be of type string or an instance of Object.'); }
			else if (arguments.length > 2) { glow.debug.warn('[wrong count] glow.NodeList#data expects 0, 1 or 2 arguments.'); }
		/*gubed!*/
		
		if (argsLen > 1) { // SET key, val on every node
			var i = this.length;
			while (i--) {
				node = this[i];
				if (node.nodeType !== 1) { continue; }
				
				index = node[''+dataPropName];

				if (!index) { // assumes index is always > 0
					index = dataIndex++;
					
					node[dataPropName] = index;
					dataCache[index] = {};
				}
				dataCache[index][key] = val;
			}
			
			return this; // chainable with (key, val) signature
		}
		else if (typeof keyvals === 'object') { // SET keyvals on every node
			var i = this.length;
			while (i--) {
				node = this[i];
				if (node.nodeType !== 1) { continue; }
				
				index = node[dataPropName];
				if (!index) { // assumes index is always > 0
					index = dataIndex++;
					
					node[dataPropName] = index;
					dataCache[index] = {};
				}
				for (key in keyvals) {
					dataCache[index][key] = keyvals[key];
				}
			}
			
			return this; // chainable with ({key, val}) signature
		}
		else { // GET from first node
			node = this[0];
			if (node === undefined || node.nodeType !== 1) { return undefined; }
				
			if ( !(index = node[dataPropName]) ) {
				return undefined;
			}

			if (key !== undefined) {
				return dataCache[index][key];
			}
			
			// get the entire data cache object for this node
			return dataCache[index];
		}
	};
	
	/**
	@name glow.NodeList#hasAttr
	@function
	@description Does the node have a particular attribute?
		
		The first node in this NodeList is tested.
		
	@param {string} name The name of the attribute to test for.

	@returns {boolean|undefined} Returns undefined if the first node is not an element,
	or if the NodeList is empty, otherwise returns true/false to indicate if that attribute exists
	on the first element.

	@example
		if ( glow("#myImg").hasAttr("alt") ){
			// ...
		}
	*/
	NodeListProto.hasAttr = function(name) {
		var node;
		
		/*!debug*/
			if (arguments.length !== 1) { glow.debug.warn('[wrong count] glow.NodeList#hasAttr expects 1 argument.'); }
			else if (typeof arguments[0] !== 'string') {glow.debug.warn('[wrong type] glow.NodeList#hasAttr expects argument 1 to be of type string.'); }
		/*gubed!*/
		
		node = this[0];
		
		if (this.length && node.nodeType === 1) {
			if (node.attributes[name]) { // is an object in  IE, or else: undefined in IE < 8, null in IE 8
				return !!node.attributes[name].specified;
			}
			
			if (node.hasAttribute) { return node.hasAttribute(name); } // like FF, Safari, etc
			else { return node.attributes[name] !== undefined; } // like IE7
		}
	};
	
	/**
	@name glow.NodeList#hasClass
	@function
	@description Does the node have a particular class?

		The first node in this NodeList is tested.

	@param {string} name The name of the class to test for.

	@returns {boolean}

	@example
		if ( glow("#myInput").hasClass("errored") ){
			// ...
		}
	*/
	NodeListProto.hasClass = function (name) {
		/*!debug*/
			if (arguments.length !== 1) { glow.debug.warn('[wrong count] glow.NodeList#hasClass expects 1 argument.'); }
			else if (typeof arguments[0] !== 'string') {glow.debug.warn('[wrong type] glow.NodeList#hasClass expects argument 1 to be of type string.'); }
		/*gubed!*/
		
		if (this.length && this[0].nodeType === 1) {
			return ( (' ' + this[0].className + ' ').indexOf(' ' + name + ' ') > -1 );
		}
	};
	
	/**
	@name glow.NodeList#prop
	@function
	@description Gets or sets node properties.
	
		This function gets / sets node properties, to get attributes,
		see {@link glow.NodeList#attr NodeList#attr}.
		
		When getting a property, it is retrieved from the first
		node in this NodeList. Setting properties to each element in
		this NodeList.
		
		To set multiple properties in one call, pass in an object of
		name/value pairs.
		
	@param {string | Object} name The name of the property, or an object of name/value pairs
	@param {string} [value] The value to set the property to.

	@returns {string | glow.NodeList}

		When setting properties it returns the NodeList, otherwise
		returns the property value.

	@example
		var myNodeList = glow("#formElement");

		// get the node name
		myNodeList.prop("nodeName");

		// set a property
		myNodeList.prop("_secretValue", 10);

		// set multiple properties
		myNodeList.prop({
			checked: true,
			_secretValue: 10
		});
	*/
	NodeListProto.prop = function(name, val) {
		var hash = name,
			argsLen = arguments.length;
		
		/*!debug*/
			if (arguments.length === 1 && (typeof name !== 'string' && name.constructor !== Object)) {glow.debug.warn('[wrong type] glow.NodeList#prop expects argument 1 to be of type string or Object.'); }
			else if (arguments.length === 2 && typeof name !== 'string') {glow.debug.warn('[wrong type] glow.NodeList#prop expects name to be of type string.'); }
			else if (arguments.length === 0 || arguments.length > 2) { glow.debug.warn('[wrong count] glow.NodeList#prop expects 1 or 2 arguments.'); }
		/*gubed!*/
		
		if (this.length === 0) return;
		
		if (argsLen === 2 && typeof name === 'string') {
			for (var i = 0, ilen = this.length; i < ilen; i++) {
				if (this[i].nodeType === 1) { this[i][name] = val; }
			}
			return this;
		}
		else if (argsLen === 1 && hash.constructor === Object) {
			for (var key in hash) {
				for (var i = 0, ilen = this.length; i < ilen; i++) {
					if (this[i].nodeType === 1) { this[i][key] = hash[key]; }
				}
			}
			return this;
		}
		else if (argsLen === 1 && typeof name === 'string') {
			if (this[0].nodeType === 1) { return this[0][name]; }
		}
		else {
			throw new Error('Invalid parameters.');
		}
	};
	
	/**
	@name glow.NodeList#removeAttr
	@function
	@description Removes an attribute from each node.

	@param {string} name The name of the attribute to remove.

	@returns {glow.NodeList}

	@example
		glow("a").removeAttr("target");
	*/
	NodeListProto.removeAttr = function (name) {
		var dom0Property;
		
		/*!debug*/
			if (arguments.length !== 1) { glow.debug.warn('[wrong count] glow.NodeList#removeAttr expects 1 argument.'); }
			else if (typeof arguments[0] !== 'string') {glow.debug.warn('[wrong type] glow.NodeList#removeAttr expects argument 1 to be of type string.'); }
		/*gubed!*/
	
		for (var i = 0, leni = this.length; i < leni; i++) {
			if (this[i].nodeType === 1) {
				if (env.ie < 8) {
					if ( (dom0Property = dom0PropertyMapping[name.toLowerCase()]) ) {
						this[i][dom0Property] = '';
					}
				}
				
				if (this[i].removeAttribute) this[i].removeAttribute(name);
			}
		}
		return this;
	};
	
	/**
	@name glow.NodeList#removeClass
	@function
	@description Removes a class from each node.

	@param {string} name The name of the class to remove.

	@returns {glow.NodeList}

	@example
		glow("#footer #login a").removeClass("highlight");
	*/
	NodeListProto.removeClass = function(name) {
		var node;
					
		/*!debug*/
			if (arguments.length !== 1) { glow.debug.warn('[wrong count] glow.NodeList#removeClass() expects 1 argument.'); }
			else if (typeof arguments[0] !== 'string') {glow.debug.warn('[wrong type] glow.NodeList#removeClass() expects argument 1 to be of type string.'); }
		/*gubed!*/
		
		var i = this.length;
		while (i--) {
			node = this[i];
			if (node.className) {
				_removeClass(node, name);
			}
		}
		return this;
	};
	
	function _removeClass(node, name) {
		var oldClasses = node.className.split(' '),
			newClasses = [];
			
		oldClasses = node.className.split(' ');
		newClasses = [];
		
		var i = oldClasses.length;
		while (i--) {
			if (oldClasses[i] !== name) {
				oldClasses[i] && newClasses.unshift(oldClasses[i]); // unshift to maintain original order
			}
		}
		node.className = (newClasses.length)? newClasses.join(' ') : '';
	}
	
	/**
	@name glow.NodeList#removeData
	@function
	@description Removes data previously added by {@link glow.NodeList#data} from each node in this NodeList.
	
	When called with no arguments, will delete glow's entire data store for each node in this NodeList.
	
	Otherwise, when given a name, will delete the associated value from each node in this NodeList.
	
	@param {string} [key] The name of the value in glow's data store.
	@see glow.NodeList#data
	*/
	NodeListProto.removeData = function(key) {
		var elm,
			i = this.length,
			index;
			// uses private scoped variables: dataCache, dataPropName
		
		/*!debug*/
			if (arguments.length > 1) { glow.debug.warn('[wrong count] glow.NodeList#removeData expects 0 or 1 arguments.'); }
			else if (arguments.length === 1 && typeof arguments[0] !== 'string') {glow.debug.warn('[wrong type] glow.NodeList#removeData expects argument 1 to be of type string.'); }
		/*gubed!*/
		
		while (i--) {
			elm = this[i];
			index = elm[dataPropName];
			
			if (index !== undefined) {
				switch (arguments.length) {
					case 0:
						dataCache[index] = undefined;
						elm[dataPropName] = undefined;
						try {
							delete elm[dataPropName]; // IE 6 goes wobbly here
						}
						catch(e) { // remove expando from IE 6
							elm.removeAttribute && elm.removeAttribute(dataPropName);
						}
						break;
					case 1:
						dataCache[index][key] = undefined;
						delete dataCache[index][key];
						break;
				}
			}
		}
		
		return this; // chainable
	};
	
	/**
	@name glow.NodeList#toggleClass
	@function
	@description Toggles a class on each node.

	@param {string} name The name of the class to toggle.

	@returns {glow.NodeList}

	@example
		glow(".onOffSwitch").toggleClass("on");
	 */
	NodeListProto.toggleClass = function(name) {
		var node;
		
		/*!debug*/
			if (arguments.length !== 1) { glow.debug.warn('[wrong count] glow.NodeList#toggleClass() expects 1 argument.'); }
			else if (typeof arguments[0] !== 'string') {glow.debug.warn('[wrong type] glow.NodeList#toggleClass() expects argument 1 to be of type string.'); }
		/*gubed!*/
		
		for (var i = 0, leni = this.length; i < leni; i++) {
			node = this[i];
			if (node.className) {
				if ( (' ' + node.className + ' ').indexOf(' ' + name + ' ') > -1 ) {
					_removeClass(node, name);
				}
				else {
					_addClass(node, name);
				}
			}
		}
		
		return this;
	};
	
	/**
	@name glow.NodeList#val
	@function
	@description Gets or sets form values for the first node.
		The returned value depends on the type of element, see below:

		<dl>
		<dt>Radio button or checkbox</dt>
		<dd>If checked, then the contents of the value property, otherwise an empty string.</dd>
		<dt>Select</dt>
		<dd>The contents of value property of the selected option</dd>
		<dt>Select (multiple)</dt>
		<dd>An array of selected option values.</dd>
		<dt>Other form elements</dt>
		<dd>The value of the input.</dd>
		</dl>

		Getting values from a form:

		If the first element in the NodeList is a form, then an
		object is returned containing the form data. Each item
		property of the object is a value as above, apart from when
		multiple elements of the same name exist, in which case the
		it will contain an array of values.

		Setting values for form elements:

		If a value is passed and the first element of the NodeList
		is a form element, then the form element is given that value.
		For select elements, this means that the first option that
		matches the value will be selected. For selects that allow
		multiple selection, the options which have a value that
		exists in the array of values/match the value will be
		selected and others will be deselected.

		Checkboxes and radio buttons will be checked only if the value is the same
		as the one you provide.

		Setting values for forms:

		If the first element in the NodeList is a form and the
		value is an object, then each element of the form has its
		value set to the corresponding property of the object, using
		the method described above.

	@param {string | Object} [value] The value to set the form element/elements to.

	@returns {glow.NodeList | string | Object}

		When used to set a value it returns the NodeList, otherwise
		returns the value as described above.

	@example
		// get a value from an input with the id 'username'
		var username = glow("#username").val();

	@example			
		// get values from a form
		var userDetails = glow("form").val();

	@example
		// set a value
		glow("#username").val("example username");

	@example
		// set values in a form
		glow("form").val({
			username : "another",
			name     : "A N Other"
		});
	*/
	NodeListProto.val = function(){		
		var args = arguments,
			val = args[0],
			i = 0,
			length = this.length;

		if (args.length === 0) {
			return this[0].nodeName == 'FORM' ?
				formValues(this[0]) :
				elementValue(this[0]);
		}
		if (this[0].nodeName == 'FORM') {
			if (! typeof val == 'object') {
				throw 'value for FORM must be object';
			}
			setFormValues(this[0], val);
		} else {
			for (; i < length; i++) {
				setValue(this[i], val);
			}
		}
		return this;		
	};
	
	/*
	 @name elementValue
	 @private
	 @returns the value of the form element
	*/
	function elementValue (el) {
		var elType = el.type,
			elChecked = el.checked,
			elValue = el.value,
			vals = [],
			i = 0;

		if (elType == 'radio') {
			return elChecked ? elValue : '';
		}
			
		else if (elType == 'checkbox') {
			return elChecked ? elValue : '';
		}
			
		else if (elType == 'select-one') {
			return el.selectedIndex > -1 ? el.options[el.selectedIndex].value : '';
		}
			
		else if (elType == 'select-multiple') {
			for (var length = el.options.length; i < length; i++) {
				if (el.options[i].selected) {
					vals[vals.length] = el.options[i].value;
				}
			}
			return vals;
		}
			
		else {
			return elValue;
		}
	}
		
	/*
	@name: setValue
	@description Set the value of a form element.  Returns values that weren't able to set if array of vals passed (for multi select). Otherwise true if val set, false if not
	@returns val or bool
	@private
	*/
	function setValue (el, val) {
		var i = 0,
			length,
			n = 0,
			nlen,
			elOption,
			optionVal;

		if (el.type == 'select-one') {
			for (length = el.options.length; i < length; i++) {
				if (el.options[i].value == val) {
					el.selectedIndex = i;
					return true;
				}
			}
			return false;
		} else if (el.type == 'select-multiple') {
			var isArray = !!val.push;
			for (i = 0, length = el.options.length; i < length; i++) {
				elOption = el.options[i];
				optionVal = elOption.value;
				if (isArray) {
					elOption.selected = false;
					for (nlen = val.length; n < nlen; n++) {
						if (optionVal == val[n]) {
							elOption.selected = true;
							val.splice(n, 1);
							break;
						}
					}
				} else {
					return elOption.selected = val == optionVal;
				}
			}
			return false;
		} else if (el.type == 'radio' || el.type == 'checkbox') {
			el.checked = val == el.value;
			return val == el.value;
		} else {
			el.value = val;
			return true;
		}
	}
		
	/*
	@name setFormValues
	@description Set values of a form to those in passed in object.
	@private
	*/
	function setFormValues (form, vals) {
		var prop, currentField,
			fields = {},
			storeType, i = 0, n, len, foundOne, currentFieldType;

		for (prop in vals) {
			currentField = form[prop];
			if (currentField && currentField[0] && !currentField.options) { // is array of fields
				//normalise values to array of vals
				vals[prop] = vals[prop] && vals[prop].push ? vals[prop] : [vals[prop]];
				//order the fields by types that matter
				fields.radios = [];
				fields.checkboxesSelects = [];
				fields.multiSelects = [];
				fields.other = [];

				for (i = 0; currentField[i]; i++) {
					currentFieldType = currentField[i].type;
					if (currentFieldType == 'radio') {
						storeType = 'radios';
				} else if (currentFieldType == 'select-one' || currentFieldType == 'checkbox') {
						storeType = 'checkboxesSelects';
					} else if (currentFieldType == 'select-multiple') {
						storeType = 'multiSelects';
					} else {
						storeType = 'other';
					}
					//add it to the correct array
					fields[storeType][fields[storeType].length] = currentField[i];
				}

				for (i = 0; fields.multiSelects[i]; i++) {
					vals[prop] = setValue(fields.multiSelects[i], vals[prop]);
				}
				for (i = 0; fields.checkboxesSelects[i]; i++) {
					setValue(fields.checkboxesSelects[i], '');
					for (n = 0, len = vals[prop].length; n < len; n++) {
						if (setValue(fields.checkboxesSelects[i], vals[prop][n])) {
							vals[prop].slice(n, 1);
							break;
						}
					}
				}
				for (i = 0; fields.radios[i]; i++) {
					fields.radios[i].checked = false;
					foundOne = false;
					for (n = 0, len = vals[prop].length; n < len; n++) {
						if (setValue(fields.radios[i], vals[prop][n])) {
							vals[prop].slice(n, 1);
							foundOne = true;
							break;
						}
						if (foundOne) { break; }
					}
				}
				for (i = 0; fields.other[i] && vals[prop][i] !== undefined; i++) {
					setValue(fields.other[i], vals[prop][i]);
				}
			} else if (currentField && currentField.nodeName) { // is single field, easy
				setValue(currentField, vals[prop]);
			}
		}
	}

	/*
	@name formValues
	@description Get an object containing form data.
	@private
	*/
	function formValues (form) {
		var vals = {},
			radios = {},
			formElements = form.elements,
			i = formElements.length,
			name,
			formElement,
			j,
			radio,
			nodeName;
		while (i--) {
			formElement = formElements[i];
			nodeName = formElement.nodeName.toLowerCase();
			name = formElement.name;
				
			// fieldsets & objects come back as form elements, but we don't care about these
			// we don't bother with fields that don't have a name
			// switch to whitelist?
			if (
				nodeName == 'fieldset' ||
				nodeName == 'object' ||
				!name
			) { continue; }
			if (formElement.type == 'checkbox' && ! formElement.checked) {
				if (! name in vals) {
					vals[name] = undefined;
				}
			} else if (formElement.type == 'radio') {
				
				if (radios[name]) {
					radios[name][radios[name].length] = formElement;
				} else {
					radios[name] = [formElement];
				}
			} else {
				var value = elementValue(formElement);
				if (name in vals) {
					if (vals[name].push) {
						vals[name][vals[name].length] = value;
					} else {
						vals[name] = [vals[name], value];
					}
				} else {
					vals[name] = value;
				}
			}
		}
		for (i in radios) {
			var length,
			j = 0;
			for (length = radios[i].length; j < length; j++) {
				radio = radios[i][j];
				name = radio.name;
				if (radio.checked) {
					vals[radio.name] = radio.value;
					break;
				}
			}
			if (! name in vals) { alert('15 if name in vals'); vals[name] = undefined; }
		}
		return vals;
	}
});