(function($) {
    $.fn.animateMenu = function(){
        var menuContainer = $(this);
        var startX = menuContainer.find('li :first-child').css('marginLeft');
        var startY = menuContainer.find('li :first-child').css('marginTop');
        var speed = 400;
        var menuLength = menuContainer.find('li').length;
        var spacing = 4;

        var createMenu = function(){
            var z = 0;
            menuContainer.prepend('<li id="menu-language-toggle-button" style="display: inline-block; width: 2.5em; height: 2.5em;"></li>');
            menuContainer.find('li').each(function() {
                $(this).css({
                    display: 'inline-block',
                    width: 2.5 + 'em', // Javascript does dynamic typing, so you can write these out as strings '2.5em'
                    height: 2.5 + 'em',
                    lineHeight: 2.5 + 'em',
                    textAlign: 'center',
                    zIndex: z,
                    position: 'absolute'
                });
                $(this).hide();
                z++;
            });
            menuContainer.find('#menu-language-toggle-button').css({
                width: 2.5 + 'em',
                height: 2.5 + 'em',
                zIndex: z,
                position: 'absolute'
            });
            $('#menu-language-toggle-button').show();
        }

        var lineAnimate = function(){
            if(menuContainer.hasClass('closed')){
                $('#menu-language-toggle-button').unbind('click');
                var gap = 0;
                var delay = 0;
                menuContainer.find('li').each(function() {
                    $(this).delay(delay).show().animate({
                        marginLeft: gap + 'em'
                    }, speed);
                    gap += spacing;
                    delay += speed - (0.4 * speed);
                });
                menuContainer.find('li').promise().done(function(){
                    $('#menu-language-toggle-button').on("click", function(){
                        lineAnimate();
                    });
                });
                menuContainer.removeClass('closed');
                menuContainer.addClass('open');
            } else if(menuContainer.hasClass('open')){
                $('#menu-language-toggle-button').unbind('click');
                var gap = 0;
                var delay = speed * menuLength;
                menuContainer.find('li').each(function() {
                     $(this).delay(delay).animate({
                            marginLeft: startX
                        }, speed, function(){
                            if(!$(this).is('#menu-language-toggle-button')){
                               $(this).hide();
                            }
                    });
                    gap += spacing;
                    delay -= speed - (0.4 * speed);
                });
                menuContainer.find('li').promise().done(function(){
                    $('#menu-language-toggle-button').on("click", function(){
                        lineAnimate();
                    });
                });
                menuContainer.removeClass('open');
                menuContainer.addClass('closed');
            } else {
                menuContainer.addClass('closed');
                lineAnimate();
            }
        }

        createMenu();
        $('#menu-language-toggle-button').click(function (){
            lineAnimate();
        });
    };
})(jQuery);