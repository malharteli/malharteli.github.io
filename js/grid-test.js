var Grid (function() {
	
	var $grid = $( '.mt-grid'),
		$items = $grid.find('li'),
		current= -1,
		previewPos= -1,
		$body = $( 'html, body'),
		transEndEventNames = {
			'WebkitTransition' : 'webkitTransitionEnd',
			'MozTransition' : 'transitionend',
			'OTransition' : 'oTransitionEnd',
			'msTransition' : 'MSTransitionEnd',
			'transition' : 'transitionend'
		},
		
		transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
		support = Modernizr.csstransitions,
		settings = {
			minHeight: 500,
			speed : 350,
			easing : 'ease'
		};
		
	function init (config) {
		settings = $.extend( true , {} , settings, config );
		
		$grid.imagesLoaded( function() {
			
			saveItemInfo( true );
			getWinSize();
			initEvents();
		});
	}
	
	function saveItemInfo( saveheight) {
		$items.each( function() {
			var $item = $( this );
			$item.data('offsetTop', $item.offset().top );
			if ( saveheight) {
				$item.data ('height', $item.height() );
			}
		});
	}
	
	function initEvents() {
		initItemsEvents( $items);
		
		$window.on( 'debouncedresize', function() {
			previewPos = -1;
			saveItemInfo();
			var preview = $.data(this, 'preview' );
			if( typeof preview != 'undefined' ) {
				hidePreview();
			}
		});
	}
	
	function initItemsEvents ($items) {
		$items.on( 'click', 'span.mt-close', function() {
			hidePreview();
			return false;
		}
		).children('a').on( 'click', function(e) {
			var $item = $(this).parent();
			//check if item is already opened
			current === $item.index() ? hidePreview() : showPreview( $item );
			return false;
		});
	}
	
	function showPreview( $item ) {
		
		var preview = $.data ( this, 'preview' ),
		//item's offset top
		position = $item.data('offsetTop');
		parent= $item.parents().css('id');
		//if preview exists, but is not in the same row from item's top, close preview, open new one
		if (typeof preview !='undefined'){
			//not in same ul
			if (parent !==preview.Parent){
				hidePreview();
			}
			//not in same row
			if (previewPos !=position){
				hidePreview();
			}
			else{
				preview.update( $item );
				return false;
			}
			
		}
		
		//update Preview function
		
		previewPos = position;
		//initialize new preview for the clicked item
		preview = $.data(this, 'preview', new Preview ($item) );
		//expand preview overlay
		preview.open();
		//record ul of current preview
		preview.Parent=parent;
		
	}
	
	function hidePreview() {
		current = -1;
		car preview = $.data( this, 'preview' );
		preview.close();
		preview.$item.css('height' 250);
		$.removeData(this, 'preview' );
	}
	
	//the preview obj/ overlay
	
	function Preview($item){
		this.$item = $item;
		this.expandedIdx = this.$item.index();
		this.create();
		this.update();
	
	}
	
	Preview.prototype = {
		create : function() {
			this.$title = $('<h3><h3>');
			this.$content = $('');
			this.$loading =$('<div class="mt-loading"></div>');
			this.$closePreview = $('<span class="mt-close"></span>');
			this.$previewInner =$('<div class="mt-expander"></div>').append (this.$closePreview, this.$title,this.$loading, this.$content);
			this.$previewEl = $('<div class="mt-expander"></div>').append(this.$previewInner);
			//append preview element to the item
			this.$item.append (this.getEl() );
			//transitions
			if(support){
				this.setTransition();
			}
		},
		update : function( $item) {
			if($item){
				this.$item = $item;
			}
			//if already expanded, remove class "mt-expanded" from current item and add it to new item
			if (current !== -1){
				var $currentItem = $items.eq(current);
				$currentItem.removeClass('mt-expanded');
				$currentItem.addClass ('mt-hidden');
				this.$item.addClass('mt-expanded');
				this.$item.removeClass('mt-hidden');
				//position the preview correctly
				this.positionPrevew();
			}
			//update current value 
			current = this.$item.index();
			//update preview's content
			var $itemEl= this.$item.children('a'),
				$itemCt = this.$item.find('mt-content'),
				eldata ={
					title : $itemEl.data('title')
				};
			this.$title.html(eldata.title);
			this.$content = = this.$item.children('div').css('mt-content');
			
			var self= this;
			
			//remove current content in the preview
			if(typeof self.$content != 'undefined){self.$content.remove();}
		
			},
		
		open: function() {
			setTimeout( $.proxy(function (){
			this.$item.children('div').removeClass('mt-hidden');
			}, this), 25 );
			);
		},
		
		close: function() {
				var self = this,
					onEndFn = function(){
						if (support) {
							$(this).off(transEndEventName);
						}
						self.$item.removeClass('mt-expanded');
						self.$item.children('div').addClass('mt-hidden');
						self.$previewEl.remove();
						self.$item.css('height', 250);
					};
				setTimeout( $.proxy(function() {
					if (typeof this.$content !== 'undefined'){
						this.$content.fadeOut('fast');
					}
					this.$previewEl.css('height',0);
					//current expanded item *might be different from this.$item*
					var $expandedItem = $items.eq( this.expandedIdx);
					$expandedItem.css('height', $expandedItem.data('height')).on(transEndEventName, onEndFn);
					
					if (!support ){
						onEndFn.call();
					}
				}, this ), 25);
				return false;
		},
		setTransition  : function() {
			this.$previewEl.css( 'transition', 'height ' + settings.speed + 'ms ' + settings.easing );
			this.$item.css( 'transition', 'height ' + settings.speed + 'ms ' + settings.easing );
		},
		getEl : function() {
			return this.$previewEl;
		}		
			
	};
	return {
		init: init,
	};
})();