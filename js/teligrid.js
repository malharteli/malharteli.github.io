/*
* debouncedresize: special jQuery event that happens once after a window resize
*
* latest version and complete README available on Github:
* https://github.com/louisremi/jquery-smartresize/blob/master/jquery.debouncedresize.js
*
* Copyright 2011 @louis_remi
* Licensed under the MIT license.
*/
var $event = $.event,
$special,
resizeTimeout;

$special = $event.special.debouncedresize = {
	setup: function() {
		$( this ).on( "resize", $special.handler );
	},
	teardown: function() {
		$( this ).off( "resize", $special.handler );
	},
	handler: function( event, execAsap ) {
		// Save the context
		var context = this,
			args = arguments,
			dispatch = function() {
				// set correct event type
				event.type = "debouncedresize";
				$event.dispatch.apply( context, args );
			};

		if ( resizeTimeout ) {
			clearTimeout( resizeTimeout );
		}

		execAsap ?
			dispatch() :
			resizeTimeout = setTimeout( dispatch, $special.threshold );
	},
	threshold: 250
};

// ======================= imagesLoaded Plugin ===============================
// https://github.com/desandro/imagesloaded

// $('#my-container').imagesLoaded(myFunction)
// execute a callback when all images have loaded.
// needed because .load() doesn't work on cached images

// callback function gets image collection as argument
//  this is the container

// original: MIT license. Paul Irish. 2010.
// contributors: Oren Solomianik, David DeSandro, Yiannis Chatzikonstantinou

// blank image data-uri bypasses webkit log warning (thx doug jones)
var BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

$.fn.imagesLoaded = function( callback ) {
	var $this = this,
		deferred = $.isFunction($.Deferred) ? $.Deferred() : 0,
		hasNotify = $.isFunction(deferred.notify),
		$images = $this.find('img').add( $this.filter('img') ),
		loaded = [],
		proper = [],
		broken = [];

	// Register deferred callbacks
	if ($.isPlainObject(callback)) {
		$.each(callback, function (key, value) {
			if (key === 'callback') {
				callback = value;
			} else if (deferred) {
				deferred[key](value);
			}
		});
	}

	function doneLoading() {
		var $proper = $(proper),
			$broken = $(broken);

		if ( deferred ) {
			if ( broken.length ) {
				deferred.reject( $images, $proper, $broken );
			} else {
				deferred.resolve( $images );
			}
		}

		if ( $.isFunction( callback ) ) {
			callback.call( $this, $images, $proper, $broken );
		}
	}

	function imgLoaded( img, isBroken ) {
		// don't proceed if BLANK image, or image is already loaded
		if ( img.src === BLANK || $.inArray( img, loaded ) !== -1 ) {
			return;
		}

		// store element in loaded images array
		loaded.push( img );

		// keep track of broken and properly loaded images
		if ( isBroken ) {
			broken.push( img );
		} else {
			proper.push( img );
		}

		// cache image and its state for future calls
		$.data( img, 'imagesLoaded', { isBroken: isBroken, src: img.src } );

		// trigger deferred progress method if present
		if ( hasNotify ) {
			deferred.notifyWith( $(img), [ isBroken, $images, $(proper), $(broken) ] );
		}

		// call doneLoading and clean listeners if all images are loaded
		if ( $images.length === loaded.length ){
			setTimeout( doneLoading );
			$images.unbind( '.imagesLoaded' );
		}
	}

	// if no images, trigger immediately
	if ( !$images.length ) {
		doneLoading();
	} else {
		$images.bind( 'load.imagesLoaded error.imagesLoaded', function( event ){
			// trigger imgLoaded
			imgLoaded( event.target, event.type === 'error' );
		}).each( function( i, el ) {
			var src = el.src;

			// find out if this image has been already checked for status
			// if it was, and src has not changed, call imgLoaded on it
			var cached = $.data( el, 'imagesLoaded' );
			if ( cached && cached.src === src ) {
				imgLoaded( el, cached.isBroken );
				return;
			}

			// if complete is true and browser supports natural sizes, try
			// to check for image status manually
			if ( el.complete && el.naturalWidth !== undefined ) {
				imgLoaded( el, el.naturalWidth === 0 || el.naturalHeight === 0 );
				return;
			}

			// cached images don't fire load sometimes, so we reset src, but only when
			// dealing with IE, or image is complete (loaded) and failed manual check
			// webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
			if ( el.readyState || el.complete ) {
				el.src = BLANK;
				el.src = src;
			}
		});
	}

	return deferred ? deferred.promise( $this ) : $this;
};

var Grid = (function() {
	
		//list of items
	var $grid = $( '.mt-grid'),
		//the items for the list
		$ites = $grid.find('li'),
		// current expanded item's index
		current= -1,
		//position (top) of current expanded item
		//used to know if the preview will be in a different row of the grid
		previewPos=-1
		//extra margin when expanded (between preview window and next items
		marginExpanded = 10,
		$window = $( window ), winsize,
		$body = $( 'html, body' ),
		// transitionend events
		transEndEventNames = {
			'WebkitTransition' : 'webkitTransitionEnd',
			'MozTransition' : 'transitionend',
			'OTransition' : 'oTransitionEnd',
			'msTransition' : 'MSTransitionEnd',
			'transition' : 'transitionend'
		},
		transEndEventName = transEndEventNames [ Modernizer.prefixed( 'transition' ) ],
		// css transition support
		support = Modernizr.csstransitions,
		// default settings
		settings = {
			minHeight: 500,
			speed : 350,
			easing: 'ease'
		};
		
	function init ( config ) {
		
		// the settings
		settings = $.extend( true, {}, settings, config );
		
		// preload all images
		$grid.imagesLoaded( function() {
			
			//save item size and offset
			saveItemInfo( true );
			//get window size
			getWinSize();
			//Initialize some events 
			initEvents();
		
		});
	}
	
	// add more items to the grid.
	// the new items need to appended to the grid.
	// after that call Grid.addItems(theItems);
	function addItems( $newitems ) {

		$items = $items.add( $newitems );

		$newitems.each( function() {
			var $item = $( this );
			$item.data( {
				offsetTop : $item.offset().top,
				height : $item.height()
			} );
		} );

		initItemsEvents( $newitems );

	}
	
	function saveItemInfo (saveheight ) {
		$items.each( function() {
			var $item = $( this );
			$item.data( 'offsetTop' , $item.offset().top);
			if (saveheight) {
				$item.data( 'height', $item.height() );
			}
		});
	}
	
	function initEvents() {
		
		//When clicking an item, show the preveiw with the item's info and product
		//Close the item if already expanded
		//also close if clicking on the item's cross
		initItemsEvents ($items);
		
		//on window resize get the window's size again
		//resent some values
		$window.on( 'debouncedresize', function() {
			
			scrollExtra=0;
			previewPos=-1;
			//save item offset
			saveItemInfo();
			getWinSize();
			var preview = $.data(this, 'preview' );
			if (typeof preview !='undefined'){
				hidePreview();
			}
		});
	}
	
	function initItemEvents($items) {
		$items.on('click', 'span.og-close', function(){
			hidePreview();
			return false;
		}).children( '.mt-over').on('click', function(e){
			var $item = $( this ).parent();
			//check if item already opened
			current === $item.index() ? hidePreview() : showPreview( $item );
			return false;
		});	
	}
	
	function getWinSize(){
		winsize = { width: $window.width(), height: $window.height() };
	}
	
	function showPreview( $item ){
		var preview = $.data( this, 'preview' ),
			position = $item.data( 'offsetTop' );
		parent = $item.parents().css('id');
			
		scrollExtra = 0;
			
		//if a preview exists and previewPos is different from item's top then close it
		if (typeof preview != 'undefined'){
			//not in the same ul
			if (parent !== preview.Parent){
				hidePreview();
			}
			//not in the same row
			if( previewPos != position) {
				hidePreview();
			}
			//same row
			else{
				preview.update($item);
				return false;
			}
		}
		
		//update previewPos
		previewPos = position;
		//initialize new preview for clicked item
		preview = $.data(this, 'preview', new Preview( $item) );
		//expand preview overlay
		preview.open();
		//note the ul of current preview
		preview.Parent=parent;
	}
	
	function hidePreview() {
		current= -1;
		var preview = $.data(this, 'preview' );
		preview.close();
		preview.$item.css('height', 250);
		$.removeData( this, 'preview');	
	}
	
	//the preview obj / overlay
	function Preview($item){
		this.$item = $item;
		this.expandedIdx= this.$item.index();
		this.create();
		this.update();
	}
	
	Preview.prototype = {
		create : function(){
		//create Preview struction
		this.$title = $( '<h3></h3>' );
		this.$description = $('<p></p>');
		this.$details = $('<div class="mt=details"></div>').append (this.$title, this.$description);
		this.$loading = $('<div class="mt-loading"></div>');
		this.$content = $('<div class="mt-content"></div>').append(this.$loading);
		this.$closePreview = $('<span class="mt-close"></span>');
		this.previewInner = $('<div class="mt-expander-inner"></div>').append( this.$closePreview, this.$content, this.$details);
		this.$previewEl = $('div class="mt-expander"></div>').append (this.$previewInner);
		//append preview element to the item
		this.$item.append(this.getEl() );
		// set the transitions for the preview and the item
		if ( support) {
			this.setTransition();
		}
	},
	
	update : function( $item ) {
		
		if ($item) {
			this.$item = $item;
		}
		
		//if already expanded remove class "mt-expended" from current item and add it to new item
		if (current !== -1) {
			var $currentItem = $items.eq(current );
			$currentItem.removeClass( 'mt-expanded' );
			$currentItem.addClass ('mt-datahidden');
			$currentItem.children('div' ).addClass('mt-datahidden');
			this.$item.addClass('mt-expanded');
			this.$item.children('div').removeClass('mt-datahidden');
			this.positionPreview();
			
		}
		
		//update current value
		current = this.$item.index();
		
		//update preview's content
		var $itemEl = this.$item.children( '.mt-over '),
				eldata = {
					title : $itemEl.data( 'title' ),
					content: $item.children( 'div')
				}
		this.$title.html( eldata.title );
		this.$item.html( eldata.content);
		
		// remove the current content in the preview
		if( typeof self.$content != 'undefined' ){
			self.$content.remove();
		}
		
		
	}
		
		
	}
})();
