(function ($) {
    $.fn.animateMenu = function (userOptions) {

        var menuContainer = $(this); // object for the list of links
        var toggleButton;
        var startX; // position of first list item, or last item if sliding right
        var menuLength = menuContainer.find('li').length; // length of the list
        var options = {
            speed: 400, // time the animation lasts in milliseconds
            spacing: 20, // space between buttons after the animation is complete
            direction: 'left', //animation slides to the left or right. default is left
            width: 40,
            height: 40,
            backgroundImage: '',
            backgroundColor: 'blue',
            color: 'white',
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
                position: 'absolute',
                width: options.width * (menuContainer.find('li').length + 1) + options.spacing * menuContainer.find('li').length
            });
            if (options.direction == 'right') {
                menuContainer.css('right', '0px');
            }
            menuContainer.prepend('<li></li>'); // creates the toggle button
            toggleButton = menuContainer.find('li').first();
            toggleButton.html(options.buttonText);
            for (var i = 0; i < options.buttonClass.length; i++) {
                toggleButton.addClass(options.buttonClass[i]);
            }
            startX = 0;

            menuContainer.find('li').each(function () {
                $(this).css({
                    display: 'inline-block',
                    width: options.width,
                    height: options.height,
                    backgroundColor: options.backgroundColor,
                    color: options.color,
                    lineHeight: options.lineHeight,
                    textAlign: options.textAlign,
                    zIndex: z,
                    position: 'absolute'
                });
                if (options.direction == 'right') {
                    $(this).css({ right: startX });
                } else {
                    $(this).css({ left: startX });
                }
                $(this).hide();
                z++;
            });

            toggleButton.css({
                backgroundImage: options.backgroundImage,
                zIndex: z
            });
            toggleButton.show();
        }

        /* function to expand or collapse the menu whenever the toggle button is clicked */
        var lineAnimate = function () {
            if (menuContainer.hasClass('open')) { // the list is expanded
                toggleButton.unbind('click', lineAnimate);
                var delay = options.speed * menuLength - 2;
                menuContainer.find('li').each(function () {
                    if (!$(this).is(toggleButton)) {
                        slide($(this), delay, startX, true);
                    }
                    delay -= (0.6 * options.speed);
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
                    newPosition += (options.spacing + options.width);
                    delay += (0.6 * options.speed);
                });
                menuContainer.find('li').promise().done(function () {
                    toggleButton.bind('click', lineAnimate);
                });
                menuContainer.addClass('open');
            }
        }

        /* function to abstract animation code */
        var slide = function (item, delay, endPosition, shouldHide) {
            if (options.direction == 'right') {
                item.delay(delay).show().animate({
                    right: endPosition
                }, options.speed, 'linear', function () {
                    if (shouldHide) {
                        $(this).hide();
                    }
                });
            } else {
                item.delay(delay).show().animate({
                    left: endPosition
                }, options.speed, 'linear', function () {
                    if (shouldHide) {
                        $(this).hide();
                    }
                });
            }
        }

        createMenu();
        toggleButton.bind('click', lineAnimate);
    };
})(jQuery);