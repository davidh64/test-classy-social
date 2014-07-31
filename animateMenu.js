(function($) {
    $.fn.animateMenu = function(){

        var menuContainer = $(this); // object for the list of links
        var toggleButton;
        var startX; // position of first list item
        var speed = 400; // time the animation lasts in milliseconds SET THIS AS AN OPTION
        var menuLength = menuContainer.find('li').length; // length of the list
        var spacing = 4; // space between buttons after the animation is complete SET THIS AS AN OPTION

        /* adds an item to the beginning of the list for the button that will expand and collapse the menu */
        /* arranges z-indices of list items to appear properly during animations */
        /* hides all items except the toggle button */
        var createMenu = function(){
            var z = 0;
            menuContainer.prepend('<li id="menu-toggle-button" style="color: blue;"></li>'); // creates the toggle button
            toggleButton = $('#menu-toggle-button'); // Using this id everywhere could get messy. Could you use a variable instead? Is there a way to set the id value as an option on calling animateMenu() ?
            menuContainer.find('li').each(function() {
                $(this).css({
                    display: 'inline-block',
                    width: '2.5em',
                    height: '2.5em',
                    lineHeight: '2.5em',
                    textAlign: 'center',
                    zIndex: z,
                    position: 'absolute'
                });
                $(this).hide();
                z++;
            });
            toggleButton.css({
                zIndex: z
            });
            startX = toggleButton.position().left;
            toggleButton.show();
        }

        /* function to expand or collapse the menu whenever the toggle button is clicked */
        var lineAnimate = function(){
            if(menuContainer.hasClass('closed')){ // the list is not expanded
                toggleButton.unbind('click', lineAnimate); //what are some potential issues with unbinding click? I'd look in to event namespaces
                var newPosition = 0;
                var delay = 0;
                menuContainer.find('li').each(function() { // Is there any way you could abstract these slideIn/slideOut functions and merely pass them variables?
                    $(this).delay(delay).show().animate({
                        left: newPosition + 'em'
                    }, speed);
                    //slide(this, delay, newPosition, false);
                    newPosition += spacing;
                    delay += speed - (0.4 * speed);
                });
                menuContainer.find('li').promise().done(function(){
                    toggleButton.bind('click', lineAnimate);
                    // Is this inherently bound to an object? What potential issues could arise if there are multiple items using animateMenu? how could you fix that?
                });
                menuContainer.removeClass('closed').addClass('open');
            } else if(menuContainer.hasClass('open')){ // the list is expanded
                toggleButton.unbind('click', lineAnimate);
                var newPosition = 0;
                var delay = speed * menuLength;
                menuContainer.find('li').each(function() { // Is there shared code between this and the slideOut function that you could re-use/abstract some way to compress the code?
                     $(this).delay(delay).animate({
                            left: startX
                        }, speed, function(){
                            if(!$(this).is('#menu-toggle-button')){
                               $(this).hide();
                            }
                    });
                    //slide(this, delay, startX, true);
                    newPosition += spacing;
                    delay -= speed - (0.4 * speed);
                });
                menuContainer.find('li').promise().done(function(){
                    toggleButton.bind('click', lineAnimate);
                });
                menuContainer.removeClass('open').addClass('closed');
            } else { // the list is being opened for the first time
                menuContainer.addClass('closed');
                lineAnimate();
            }
        }

        /* function to abstract animation code, not working yet */
        // var slide = function(item, delay, endPosition, shouldHide){
        //     $(this).delay(delay).animate({
        //             left: endPosition
        //         }, speed, function(){
        //             if(shouldHide){
        //                $(this).hide();
        //             }
        //     });
        // }

        createMenu();
        toggleButton.bind('click', lineAnimate);
    };
})(jQuery);