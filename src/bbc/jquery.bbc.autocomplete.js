/*
 * BBC jQuery UI Autocomplete 1.8.2
 *
 * Copyright (c) 2010 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Autocomplete
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.position.js
 *	jquery.ui.autocomplete.js
 */
(function( $ ) {

    $.widget( "custom.bbcautocomplete", $.ui.autocomplete, {
        /**
         * Overrides the _suggest method of $.ui.autocomplete
         * to account for padding by using outerWidth
         * @private
         * @param Array items list of items to display
         * @returns void
         */
        _suggest: function( items ) {
             $.ui.autocomplete.prototype._suggest.apply(this, arguments);
             var ul   = this.menu.element,
                 ulow = ul.outerWidth(),
                 elow = this.element.outerWidth();
             // only make width bigger by the difference in outer widths
             if ( ulow < elow ) ul.width( ul.width() + elow - ulow );
             this.menu.element.css({backgroundColor:'#ccc'});
         
        }
    });


}( jQuery ));