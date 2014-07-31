(function($) {
    $.fn.animateMenu = function(speed ,spacing, direction, buttonStyle){

        // speed: time the animation lasts in milliseconds SET THIS AS AN OPTION
        // spacing: space between buttons after the animation is complete SET THIS AS AN OPTION
        // direction: animation slides to the left or right. default is left
        var menuContainer = $(this); // object for the list of links
        var toggleButton;
        var startX; // position of first list item
        var menuLength = menuContainer.find('li').length; // length of the list

        /* adds an item to the beginning of the list for the button that will expand and collapse the menu */
        /* arranges z-indices of list items to appear properly during animations */
        /* hides all items except the toggle button */
        var createMenu = function(){
            var z = 0;
            var defaultStyle = {
                display: 'inline-block',
                width: '2.5em',
                height: '2.5em',
                backgroundColor: 'blue',
                lineHeight: '2.5em',
                textAlign: 'center',
            };
            menuContainer.css({
                listStyleType: 'none',
                margin: 'inherit',
                padding: 'inherit'
            });
            menuContainer.prepend('<li></li>'); // creates the toggle button
            toggleButton = menuContainer.find('li').first(); // Using this id everywhere could get messy. Could you use a variable instead? Is there a way to set the id value as an option on calling animateMenu() ?
            //toggleButton = menuContainer.prepend('<li></li>');
            menuContainer.find('li').each(function() {
                $(this).css({
                    display: defaultStyle.display,
                    width: defaultStyle.width,
                    height: defaultStyle.height,
                    backgroundColor: defaultStyle.backgroundColor,
                    lineHeight: defaultStyle.lineHeight,
                    textAlign: defaultStyle.textAlign,
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
            if(direction == 'right'){
                startX = menuContainer.find('li').last().left;
            } else {
                startX = toggleButton.position().left;
            }
            toggleButton.show();
        }

        /* function to expand or collapse the menu whenever the toggle button is clicked */
        var lineAnimate = function(){
            if(menuContainer.hasClass('open')){ // the list is expanded
                toggleButton.unbind('click', lineAnimate);
                var delay = speed * menuLength;
                menuContainer.find('li').each(function() { // Is there shared code between this and the slideOut function that you could re-use/abstract some way to compress the code?
                    if(!$(this).is(toggleButton)){
                        slide($(this), delay, startX, true);
                    } else {
                        slide($(this), delay, startX, false);
                    }
                    delay -= speed - (0.4 * speed);
                });
                menuContainer.find('li').promise().done(function(){
                    toggleButton.bind('click', lineAnimate);
                });
                menuContainer.removeClass('open');
            } else { // the list is not expanded
                toggleButton.unbind('click', lineAnimate); //what are some potential issues with unbinding click? I'd look in to event namespaces
                var newPosition = 0;
                var delay = 0;
                menuContainer.find('li').each(function() { // Is there any way you could abstract these slideIn/slideOut functions and merely pass them variables?
                    slide($(this), delay, newPosition, false);
                    if(direction == 'right'){
                        newPosition -= spacing;
                    } else {
                        newPosition += spacing;
                    }
                    delay += speed - (0.4 * speed);
                });
                menuContainer.find('li').promise().done(function(){
                    toggleButton.bind('click', lineAnimate);
                    // Is this inherently bound to an object? What potential issues could arise if there are multiple items using animateMenu? how could you fix that?
                });
                menuContainer.addClass('open');
            }
        }

        /* function to abstract animation code, not working yet */
        var slide = function(item, delay, endPosition, shouldHide){
            item.delay(delay).show().animate({
                    left: endPosition
                }, speed, function(){
                    if(shouldHide){
                       $(this).hide();
                    }
            });
        }

        createMenu();
        toggleButton.bind('click', lineAnimate);
    };
})(jQuery);