
var navbar_initialized = false;

var seq = 0, delays = 80, durations = 500;
(function(){

       // if we are on windows OS we activate the perfectScrollbar function
       $(' .sidebar-wrapper, .sidebar-wrapper, .main-panel').perfectScrollbar();

       $('html').addClass('perfect-scrollbar-on');
  	
  		if($("html").hasClass("nav-open")){
  			$('.collapse').perfectScrollbar();
  		}
})();

$(document).ready(function(){
	window_width = $(window).width();

	hd.checkHeaderImage();
	
	if(window_width >= 992){
		$(document).on('ps-scroll-x', function () {
	  		hermesdashboard.checkScrollForParallax();
		});
	}
	
	if(window_width <= 991){
		hd.initRightMenu();
	}

	$(document).on('ps-scroll-x', function () {
  		hermesdashboard.checkScrollForParallax();
	});
	var scroll_start = 0;
	var startchange=$('.wave');
	var offset = startchange.offset();
	$(document).scroll(function(){
		scroll_start = $(this).scrollTop();
		if(scroll_start > offset.top){
			$(".navbar").css('background-color', 'black');
		} else {
			$(".navbar").css('background-color', 'transparent');
		}
	});

	$('a[data-toggle=tab').on('shown.bs.tab', function (e) {
 	 window.dispatchEvent(new Event('resize'));   
	});
});

$(window).resize(function(){
	if($(window).width() <= 991){
		hd.initRightMenu();
	}
})



hd = {

	misc:{
		navbar_menu_visible: 0 
	},

	checkHeaderImage: function(){
		$pageheader = $('.page-header');
		image_src = $pageheader.data('image');

		if(image_src !== undefined){
			pageheader_container = '<div class="page-header-background" style="background-image: url(' + image_src + ') "/>'
			$pageheader.append(pageheader_container);
		}
	},

	initRightMenu: function(){
		if(!navbar_initialized){
			$navbar = $('nav').find('.navbar-collapse').first().clone(true);

			$sidebar = $('.sidebar');

			$logo = $sidebar.find('.logo').first();
			logo_content = $logo[0].outerHTML;

			ul_content = '';


			//add the content from the regular header to the right
			$navbar.children('ul').each(function(){
				content_buff = $(this).html();
				ul_content = ul_content + content_buff;
			});

			//add the content from the sidebar to the right menu

			content_buff = $sidebar.find('.nav').html();
			ul_content = ul_content + content_buff;

			ul_content = '<div class="sidebar-wrapper">' +
							'<ul class="nav navbar-nav">' +
								ul_content +
							'</ul>'+
						'</div>';

			navbar_content = logo_content + ul_content;

			$navbar.html(navbar_content);

			$('body').append($navbar);

            $toggle = $('.navbar-toggler');

            $toggle.click(function(){
            	if(hd.misc.navbar_menu_visible == 1){
            		$('html').removeClass('nav-open');
            		hd.misc.navbar_menu_visible = 0;
            		$('#bodyClick').remove();
            		setTimeout(function(){
            			$toggle.removeClass('toggled');
            		}, 400);
            	} else {
            		setTimeout(function(){
            			$toggle.addClass('toggled');
            		},430);

            		div = '<div id="bodyClick"></div>';
            		$(div).appendTo("body").click(function(){
            			$('html').removeClass('nav-open');
            			hd.misc.navbar_menu_visible = 0;
            			$('#bodyClick').remove();
            			setTimeout(function(){
            				$toggle.removeClass('toggled');
            			}, 400);
            		});

            		$('html').addClass('nav-open');
                    hd.misc.navbar_menu_visible = 1;
            	}

            });
         	navbar_initialized = true;
		}
	},

	startAnimationForLineChart: function(chart){

        chart.on('draw', function(data) {
          if(data.type === 'line' || data.type === 'area') {
            data.element.animate({
              d: {
                begin: 600,
                dur: 700,
                from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                to: data.path.clone().stringify(),
                easing: Chartist.Svg.Easing.easeOutQuint
              }
            });
          } else if(data.type === 'ct-circle') {
                seq++;
                data.element.animate({
                  opacity: {
                    begin: seq * delays,
                    dur: durations,
                    from: 0,
                    to: 1,
                    easing: 'ease'
                  }
                });
            }
        });

        seq = 0;
    },
    //replace the point with a circle so you can add outline
    chartistPointWithMargin: function(chart){
	    	chart.on('draw', function(data) {
		      if(data.type === 'point') {
		        var circle = new Chartist.Svg('circle', {
		          cx: [data.x], cy:[data.y], r:[7],
		        }, 'ct-circle');
		        data.element.replace(circle);
	      }
	    });
    }


}
 
var big_image;
hermesdashboard = {
	checkScrollForParallax: debounce(function(){
		var curent_scroll = $('.main-panel').scrollTop();
		if($("html").hasClass("perfect-scrollbar-on")){
			oVal = ($('.main-panel').scrollTop() / 3);
		} else {
			oVal = ($(window).scrollTop() / 3);	
		}
		big_image.css({
            'transform':'translate3d(0,' + oVal +'px,0)',
            '-webkit-transform':'translate3d(0,' + oVal +'px,0)',
            '-ms-transform':'translate3d(0,' + oVal +'px,0)',
            '-o-transform':'translate3d(0,' + oVal +'px,0)'
        });
	}, 6)
};



function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		}, wait);
		if (immediate && !timeout) func.apply(context, args);
	};
};