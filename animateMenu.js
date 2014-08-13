(function($) {
    $.fn.animateMenu = function(userOptions){

        var menuContainer = $(this); // object for the list of links
        var toggleButton;
        var startX; // position of first list item, or last item if sliding right
        var menuLength = menuContainer.find('li').length; // length of the list
        var options = {
            speed: 400, // time the animation lasts in milliseconds SET THIS AS AN OPTION
            spacing: 70, // space between buttons after the animation is complete SET THIS AS AN OPTION
            direction: 'left', //animation slides to the left or right. default is left
            width: '2.5em',
            height: '2.5em',
            backgroundColor: 'blue',
            lineHeight: '2.5em',
            textAlign: 'center'
        }
        $.extend(options, userOptions);

        /* adds an item to the beginning of the list for the button that will expand and collapse the menu */
        /* arranges z-indices of list items to appear properly during animations */
        /* hides all items except the toggle button */
        var createMenu = function(){
            var z = 0;
            menuContainer.css({
                listStyleType: 'none'//,
                //margin: 'inherit',
                //padding: 'inherit'
            });
            // if(direction != 'right'){
            //     menuContainer.prepend('<li></li>'); // creates the toggle button
            //     toggleButton = menuContainer.find('li').first(); // Using this id everywhere could get messy. Could you use a variable instead? Is there a way to set the id value as an option on calling animateMenu() ?
            // } else {
            //     menuContainer.append('<li></li>'); // creates the toggle button
            //     toggleButton = menuContainer.find('li').last(); // Using this id everywhere could get messy. Could you use a variable instead? Is there a way to set the id value as an option on calling animateMenu() ?
            // }
            menuContainer.prepend('<li></li>'); // creates the toggle button
            toggleButton = menuContainer.find('li').first(); // Using this id everywhere could get messy. Could you use a variable instead? Is there a way to set the id value as an option on calling animateMenu() ?
            menuContainer.find('li').each(function() {
                $(this).css({
                    display: 'inline-block',
                    width: options.width,
                    height: options.height,
                    backgroundColor: options.backgroundColor,
                    lineHeight: options.lineHeight,
                    textAlign: options.textAlign,
                    zIndex: z,
                    position: 'absolute'
                });
                $(this).hide();
                z++;
            });
            toggleButton.css({
                zIndex: z
            });
            startX = toggleButton.position().left /* + toggleButton.outerWidth() */;
            toggleButton.show();
        }

        /* function to expand or collapse the menu whenever the toggle button is clicked */
        var lineAnimate = function(){
            if(menuContainer.hasClass('open')){ // the list is expanded
                toggleButton.unbind('click', lineAnimate);
                var delay = options.speed * menuLength - 1;
                menuContainer.find('li').each(function() { // Is there shared code between this and the slideOut function that you could re-use/abstract some way to compress the code?
                    if(!$(this).is(toggleButton)){
                        slide($(this), delay, startX, true);
                    }
                    delay -= options.speed - (0.4 * options.speed);
                });
                menuContainer.find('li').promise().done(function(){
                    toggleButton.bind('click', lineAnimate);
                });
                menuContainer.removeClass('open');
            } else { // the list is not expanded
                toggleButton.unbind('click', lineAnimate);
                var newPosition = 0;
                var delay = options.speed;
                menuContainer.find('li').each(function() { // Is there any way you could abstract these slideIn/slideOut functions and merely pass them variables?
                    slide($(this), delay, newPosition, false);
                    if(options.direction == 'right'){
                        newPosition -= options.spacing;
                    } else {
                        newPosition += options.spacing;
                    }
                    delay += options.speed - (0.4 * options.speed);
                });
                menuContainer.find('li').promise().done(function(){
                    toggleButton.bind('click', lineAnimate);
                });
                menuContainer.addClass('open');
            }
        }

        /* function to abstract animation code */
        var slide = function(item, delay, endPosition, shouldHide){
            item.delay(delay).show().animate({
                    left: startX + endPosition
                }, options.speed, function(){
                    if(shouldHide){
                       $(this).hide();
                    }
            });
        }

        createMenu();
        toggleButton.bind('click', lineAnimate);
    };
})(jQuery);