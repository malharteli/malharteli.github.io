var Grid = (function () {

// List of items
var $grid = $( 'og-grid' ),
// children/items of  the list
$items = $grid.children( 'li' ),
// current active item's index
current = -1,
//position (top-align) of the expanded item
//needed if preview will expand in different row
scrollExtra = 0,
//extra margin when expanded between preview element and next row of items
marginExpanded= 10,
$window = $( window ), winsize,
$body = $ ('html, body'),
//transitioned events
transEndEventNames = {
	'WebkitTransition' : 'webkitTransitionEnd',
	'MozTransition' : 'transitionend',
	'OTransition' : 'oTransitionEnd',
	'msTransition' : 'MSTransitionEnd',
	'transition': 'transitionend'
},
transEndEventName = transEndEventNames [ Modernizr.prefixed ('transition') ],
//support for css transitions
support = Modernizr.csstransitions,
//default settings
settings = {
	minHeight: 500,
	speed: 350,
	easing: 'ease'
};


//Preload function
function init( config ) {
	
	//the settings
	settings = $.extend (true, {}, settings, config );
	
	//preload all images
	$grid.imagesLoaded( function() {
		//save item's size and offset
		saveItemInfo(true);
		//get window size
		getWinSize();
		//initialize some events
		initEvents();
	});
	
}

//save the item's offset top and height if saveheight==true
function saveItemInfo (saveheight) {
	$items.each (function () {
		var item = $( this );
		$item.data( 'offsetTop', $item.offset().top );
		if (saveheight) {
			$item.data('height', $item.height() );
		}
	});
}

//get Window's size
function getWinSize (){
	winsize = {
		width: $window.width(),
		height: $window.height()
	};
}

//initialize events

//onClick, show the preview with the selected item's info and Large image;
//close the item if already expanded, or if on the item's cross
$items.on( 'click' , 'span.og-close' , function() {
	hidePreview();
	return false;
})
	.children( 'a' ).on('click', function(e) {
		var $item = $(this).parent();
		//check if item is already expanded
		current === $item.index() ? hidePreview() : showPreview ($item);
		return false;	
	});

//on window resize get the window's size again, adjust values
$window.on( 'debouncedresize', function() {
	scrollExtra=0;
	previewPos=-1;
	//save item's offset
	saveItemInfo();
	getWinSize();
	var preview = $.data( this, 'preview');
	if( typeof preview != 'undefined'){
		hidePreview();
	}
});	

//show a preview of the full item
function showPreview( $item) {
	var preview = $.data( this, 'preview'),
	position = $item.data( 'offsetTop');
	
	scrollExtra=0;
	
	//if a preview exists and previewPos is in a different row from item's top, then close it
	if (typeof preview != 'undefined'){
		//not in same row
		if ( previewPos !== position) {
			//if position > previewPos then check current preview's height
			if (position > previewPos ){
				scrollExtra=preview.height;
			}
			hidePreview();
		}
		//in same row
		else {
			preview.update( $item );
			return false;
		}
		
	}
	
	//update preview position
	previewPos= position;
	//initialize new preview for the clicked item
	preview= $.data( this, 'preview', new Preview($item) ) ;
	//expand preview overlay
	preview.open();
};

// the preview obj / overlay
function Preview( $item ) {
	this.$item = $item;
	this.expandedIdx = this.$item.index();
	this.create();
	this.update();
};

// create Preview structure:
Preview.prototype = {
create : function () {
	this.$title = $( '<h3></h3>' );
	this.$description = $( '<p></p>' );
	this.$href = $( '<a href="#">Visit website</a>' );
	this.$details = $( '<div class="og-details"></div>' ).append( this.$title, this.$description, this.$href );
	this.$loading = $( '<div class="og-loading"></div>' );
	this.$fullimage = $( '<div class="og-fullimg"></div>' ).append( this.$loading );
	this.$closePreview = $( '<span class="og-close"></span>' );
	this.$previewInner = $( '<div class="og-expander-inner"></div>' ).append( this.$closePreview, this.$fullimage, this.$details );
	this.$previewEl = $( '<div class="og-expander"></div>' ).append( this.$previewInner );
	// append preview element to the item
	this.$item.append( this.getEl() );
	// set the transitions for the preview and the item
	if( support ) {
		this.setTransition();
	}
},

update : function( $item ) {

	// update with new item´s details 
	if( $item ) {
		this.$item = $item;
	}
	
	// if already expanded, remove class "og-expanded" from current item and add it to new item
	if( current !== -1 ) {
		var $currentItem = $items.eq( current );
		$currentItem.removeClass( 'og-expanded' );
		this.$item.addClass( 'og-expanded' );
		// position the preview correctly
		this.positionPreview();
	}

	// update current value
	current = this.$item.index();

	// update preview´s content
	var $itemEl = this.$item.children( 'a' ),
		eldata = {
			href : $itemEl.attr( 'href' ),
			largesrc : $itemEl.data( 'largesrc' ),
			title : $itemEl.data( 'title' ),
			description : $itemEl.data( 'description' )
		};

	this.$title.html( eldata.title );
	this.$description.html( eldata.description );
	this.$href.attr( 'href', eldata.href );

	var self = this;
	
	// remove the current image in the preview
	if( typeof self.$largeImg != 'undefined' ) {
		self.$largeImg.remove();
	}

	// preload large image and add it to the preview
	// for smaller screens we don´t display the large image (the last media query will hide the wrapper of the image)
	if( self.$fullimage.is( ':visible' ) ) {
		this.$loading.show();
		$( '<img/>' ).load( function() {
			self.$loading.hide();
			self.$largeImg = $( this ).fadeIn( 350 );
			self.$fullimage.append( self.$largeImg );
		} ).attr( 'src', eldata.largesrc );	
	}

},

open : function() {

	setTimeout( $.proxy( function() {	
		// set the height for the preview and the item
		this.setHeights();
		// scroll to position the preview in the right place
		this.positionPreview();
	}, this ), 25 );

},

setHeights : function() {

	var self = this,
		onEndFn = function() {
			if( support ) {
				self.$item.off( transEndEventName );
			}
			self.$item.addClass( 'og-expanded' );
		};

	this.calcHeight();
	this.$previewEl.css( 'height', this.height );
	this.$item.css( 'height', this.itemHeight ).on( transEndEventName, onEndFn );

	if( !support ) {
		onEndFn.call();
	}

},

calcHeight : function() {

	var heightPreview = winsize.height - this.$item.data( 'height' ) - marginExpanded,
		itemHeight = winsize.height;

	if( heightPreview < settings.minHeight ) {
		heightPreview = settings.minHeight;
		itemHeight = settings.minHeight + this.$item.data( 'height' ) + marginExpanded;
	}

	this.height = heightPreview;
	this.itemHeight = itemHeight;

},

positionPreview : function() {

	// scroll page
	// case 1 : preview height + item height fits in window´s height
	// case 2 : preview height + item height does not fit in window´s height and preview height is smaller than window´s height
	// case 3 : preview height + item height does not fit in window´s height and preview height is bigger than window´s height
	var position = this.$item.data( 'offsetTop' ),
		previewOffsetT = this.$previewEl.offset().top - scrollExtra,
		scrollVal = this.height + this.$item.data( 'height' ) + marginExpanded <= winsize.height ? position : this.height < winsize.height ? previewOffsetT - ( winsize.height - this.height ) : previewOffsetT;
	
	$body.animate( { scrollTop : scrollVal }, settings.speed );
},

close : function() {

	var self = this,
		onEndFn = function() {
			if( support ) {
				$( this ).off( transEndEventName );
			}
			self.$item.removeClass( 'og-expanded' );
			self.$previewEl.remove();
		};

	setTimeout( $.proxy( function() {

		if( typeof this.$largeImg !== 'undefined' ) {
			this.$largeImg.fadeOut( 'fast' );
		}
		this.$previewEl.css( 'height', 0 );
		// the current expanded item (might be different from this.$item)
		var $expandedItem = $items.eq( this.expandedIdx );
		$expandedItem.css( 'height', $expandedItem.data( 'height' ) ).on( transEndEventName, onEndFn );

		if( !support ) {
			onEndFn.call();
		}

	}, this ), 25 );
	
	return false;

}}
})();