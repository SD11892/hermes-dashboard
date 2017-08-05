
var navbar_initialized = false;

$(document).ready(function(){
	window_width = $(window).width();

	if(window_width <= 991){
		lbd.initRightMenu();
	}
});

$(window).resize(function(){
	if($(window).width() <= 991){
		lbd.initRightMenu();
	}
})

lbd = {

	misc:{
		navbar_menu_visible: 0 
	},

	initRightMenu: function(){
		if(!navbar_initialized){
			$navbar = $('nav').find('.navbar-collapse').first().clone(true);

			$sidebar = $('.sidebar');
			sidebar_color = $sidebar;//.data('color');

			$logo = $sidebar.find('.logo').first();
			logo_content = $logo[0].outerHTML;

			ul_content = '';

			//$navbar.attr('data-color',sidebar_color);

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

			/*background_image = $sidebar.data('image');
			 if(background_image != undefined){
                $navbar.css('background',"url('" + background_image + "')")
                       .removeAttr('data-nav-image')
                       .addClass('has-image');
            }*/


            $toggle = $('.navbar-toggler');

            $toggle.click(function(){
            	if(lbd.misc.navbar_menu_visible == 1){
            		$('html').removeClass('nav-open');
            		lbd.misc.navbar_menu_visible = 0;
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
            			lbd.misc.navbar_menu_visible = 0;
            			$('#bodyClick').remove();
            			setTimeout(function(){
            				$toggle.removeClass('toggled');
            			}, 400);
            		});

            		$('html').addClass('nav-open');
                    lbd.misc.navbar_menu_visible = 1;
            	}

            });
         	navbar_initialized = true;
		}
	}
}
 
 
