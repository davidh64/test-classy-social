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
            menuContainer.find('#menu-language-toggle-button').css({ // Using this id everywhere could get messy. Could you use a variable instead? Is there a way to set the id value as an option on calling animateMenu() ?
                width: 2.5 + 'em',
                height: 2.5 + 'em',
                zIndex: z,
                position: 'absolute'
            });
            $('#menu-language-toggle-button').show();
        }

        var lineAnimate = function(){
            if(menuContainer.hasClass('closed')){
                $('#menu-language-toggle-button').unbind('click'); //what are some potential issues with unbinding click? I'd look in to event namespaces
                var gap = 0;
                var delay = 0;
                menuContainer.find('li').each(function() { // Is there any way you could abstract these slideIn/slideOut functions and merely pass them variables?
                    $(this).delay(delay).show().animate({
                        marginLeft: gap + 'em'
                    }, speed);
                    gap += spacing;
                    delay += speed - (0.4 * speed);
                });
                menuContainer.find('li').promise().done(function(){
                    $('#menu-language-toggle-button').on("click", function(){
                        lineAnimate(); // Is this inherently bound to an object? What potential issues could arise if there are multiple items using animateMenu? how could you fix that?
                    });
                });
                menuContainer.removeClass('closed'); // These can be chained together foo.removeClass('bar').addClass('bar1')
                menuContainer.addClass('open');
            } else if(menuContainer.hasClass('open')){
                $('#menu-language-toggle-button').unbind('click');
                var gap = 0;
                var delay = speed * menuLength;
                menuContainer.find('li').each(function() { // Is there shared code between this and the slideOut function that you could re-use/abstract some way to compress the code?
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