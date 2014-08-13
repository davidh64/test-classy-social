(function ($) {
    $.fn.animateMenu = function (userOptions) {

        var menuContainer = $(this); // object for the list of links
        var toggleButton;
        var startX; // position of first list item, or last item if sliding right
        var menuLength = menuContainer.find('li').length; // length of the list
        var options = {
            speed: 400, // time the animation lasts in milliseconds
            spacing: 70, // space between buttons after the animation is complete
            direction: 'left', //animation slides to the left or right. default is left
            width: '2.5em',
            height: '2.5em',
            backgroundColor: 'blue',
            lineHeight: '2.5em',
            textAlign: 'center',
            buttonText: '',
            buttonClass: []
        }
        $.extend(options, userOptions);

        /* adds an item to the beginning of the list for the button that will expand and collapse the menu */
        /* arranges z-indices of list items to appear properly during animations */
        /* hides all items except the toggle button */
        var createMenu = function () {
            var z = 0;
            menuContainer.css({
                listStyleType: 'none',
                position: 'absolute'
            });
            menuContainer.prepend('<li></li>'); // creates the toggle button
            toggleButton = menuContainer.find('li').first();
            toggleButton.html(options.buttonText);
            for (var i = 0; i < options.buttonClass.length; i++) {
                toggleButton.addClass(options.buttonClass[i]);
            }
            if (options.direction == 'right') {
                startX = toggleButton.position().left + (menuContainer.find('li').length - 1) * options.spacing;
            } else {
                startX = toggleButton.position().left;
            }
            menuContainer.find('li').each(function () {
                $(this).css({
                    display: 'inline-block',
                    width: options.width,
                    height: options.height,
                    backgroundColor: options.backgroundColor,
                    lineHeight: options.lineHeight,
                    textAlign: options.textAlign,
                    zIndex: z,
                    position: 'absolute',
                    left: startX
                });
                $(this).hide();
                z++;
            });
            toggleButton.css({
                zIndex: z
            });
            toggleButton.show();
        }

        /* function to expand or collapse the menu whenever the toggle button is clicked */
        var lineAnimate = function () {
            startX = toggleButton.position().left;
            if (menuContainer.hasClass('open')) { // the list is expanded
                toggleButton.unbind('click', lineAnimate);
                var delay = options.speed * menuLength - 2;
                menuContainer.find('li').each(function () {
                    if (!$(this).is(toggleButton)) {
                        slide($(this), delay, startX, true);
                    }
                    delay -= options.speed - (0.4 * options.speed);
                });
                menuContainer.find('li').promise().done(function () {
                    toggleButton.bind('click', lineAnimate);
                });
                menuContainer.removeClass('open');
            } else { // the list is not expanded
                toggleButton.unbind('click', lineAnimate);
                var newPosition = startX;
                var delay = 0;
                menuContainer.find('li').each(function () {
                    slide($(this), delay, newPosition, false);
                    if (options.direction == 'right') {
                        newPosition -= options.spacing;
                    } else {
                        newPosition += options.spacing;
                    }
                    delay += options.speed - (0.4 * options.speed);
                });
                menuContainer.find('li').promise().done(function () {
                    toggleButton.bind('click', lineAnimate);
                });
                menuContainer.addClass('open');
            }
        }

        /* function to abstract animation code */
        var slide = function (item, delay, endPosition, shouldHide) {
            item.delay(delay).show().animate({
                left: endPosition
            }, options.speed, 'linear', function () {
                if (shouldHide) {
                    $(this).hide();
                }
            });
        }

        createMenu();
        toggleButton.bind('click', lineAnimate);
    };
})(jQuery);