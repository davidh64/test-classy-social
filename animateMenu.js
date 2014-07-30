(function($) {
    $.fn.animateMenu = function(){

        var menuContainer = $(this); // object for the list of links
        var startX = menuContainer.find('li :first-child').css('marginLeft'); // position of first list item
        var speed = 400; // time the animation lasts in milliseconds
        var menuLength = menuContainer.find('li').length; // length of the list
        var spacing = 4; // space between buttons after the animation is complete

        /* adds an item to the beginning of the list for the button that will expand and collapse the menu */
        /* arranges z-indices of list items to appear properly during animations */
        /* hides all items except the toggle button */
        var createMenu = function(){
            var z = 0;
            menuContainer.prepend('<li id="menu-language-toggle-button" style="color: blue;"></li>'); // creates the toggle button
            menuContainer.find('li').each(function() {
                $(this).css({
                    display: 'inline-block',
                    width: 2.5 + 'em', // Javascript does dynamic typing, so you can write these out as strings '2.5em'
                    height: 2.5 + 'em',
                    lineHeight: 2.5 + 'em',
                    textAlign: 'center',
                    zIndex: z,
                    position: 'absolute',
                    float: 'left'
                });
                $(this).hide();
                z++;
            });
            menuContainer.find('#menu-language-toggle-button').css({ // Using this id everywhere could get messy. Could you use a variable instead? Is there a way to set the id value as an option on calling animateMenu() ?
                zIndex: z
            });
            $('#menu-language-toggle-button').show();
        }

        /* function to expand or collapse the menu whenever the toggle button is clicked */
        var lineAnimate = function(){
            if(menuContainer.hasClass('closed')){ // the list is not expanded
                $('#menu-language-toggle-button').unbind('click'); //what are some potential issues with unbinding click? I'd look in to event namespaces
                var newXPosition = 0;
                var delay = 0;
                menuContainer.find('li').each(function() { // Is there any way you could abstract these slideIn/slideOut functions and merely pass them variables?
                    $(this).delay(delay).show().animate({
                        left: newXPosition + 'em'
                    }, speed);
                    newXPosition += spacing;
                    delay += speed - (0.4 * speed);
                });
                menuContainer.find('li').promise().done(function(){
                    $('#menu-language-toggle-button').on("click", function(){
                        lineAnimate(); // Is this inherently bound to an object? What potential issues could arise if there are multiple items using animateMenu? how could you fix that?
                    });
                });
                menuContainer.removeClass('closed'); // These can be chained together foo.removeClass('bar').addClass('bar1')
                menuContainer.addClass('open');
            } else if(menuContainer.hasClass('open')){ // the list is expanded
                $('#menu-language-toggle-button').unbind('click');
                var newXPosition = 0;
                var delay = speed * menuLength;
                menuContainer.find('li').each(function() { // Is there shared code between this and the slideOut function that you could re-use/abstract some way to compress the code?
                     $(this).delay(delay).animate({
                            left: startX
                        }, speed, function(){
                            if(!$(this).is('#menu-language-toggle-button')){
                               $(this).hide();
                            }
                    });
                    newXPosition += spacing;
                    delay -= speed - (0.4 * speed);
                });
                menuContainer.find('li').promise().done(function(){
                    $('#menu-language-toggle-button').on("click", function(){
                        lineAnimate();
                    });
                });
                menuContainer.removeClass('open');
                menuContainer.addClass('closed');
            } else { // the list is being opened for the first time
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