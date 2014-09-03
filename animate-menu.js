(function ($) {
    $.fn.animateMenu = function (userOptions) {

        var menuContainer = $(this).addClass('animate-menu__container'); // object for the list of links
        var toggleButton;
        var startX; // position of first list item, or last item if sliding right
        var menuLength = menuContainer.find('li').length; // length of the list
        var options = {
            speed: 400, // time the animation lasts in milliseconds
            spacing: 20, // space between buttons after the animation is complete
            direction: 'left', //animation slides to the left or right. default is left
            buttonText: '',
            buttonClass: [],
            labelText: 'Languages'
        }
        $.extend(options, userOptions);

        /* adds an item to the beginning of the list for the button that will expand and collapse the menu */
        /* arranges z-indices of list items to appear properly during animations */
        /* hides all items except the toggle button */
        var createMenu = function () {
            var z = 0;
            /* Unnecessary because the placement in the page will be determined by CSS */
            // if (options.direction == 'right') {
            //     menuContainer.css('right', '0px');
            // }
            menuContainer.prepend('<li></li>'); // creates the toggle button
            toggleButton = menuContainer.find('li').first();
            toggleButton.html(options.buttonText);
            for (var i = 0; i < options.buttonClass.length; i++) {
                toggleButton.addClass(options.buttonClass[i]);
            }
            startX = 0;

            menuContainer.find('li').each(function () {
                $(this).css({
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
                zIndex: z
            });
            toggleButton.show();
            menuContainer.prepend('<p class="animate-menu__label"><strong>' + options.labelText + '</strong></p>');
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
                    menuContainer.find('.animate-menu__label').fadeIn();
                });
                menuContainer.removeClass('open');
            } else { // the list is not expanded
                menuContainer.find('.animate-menu__label').fadeOut();
                toggleButton.unbind('click', lineAnimate);
                var newPosition = startX;
                var delay = 0;
                menuContainer.find('li').each(function () {
                    var itemWidth = $(this).outerWidth();
                    slide($(this), delay, newPosition, false);
                    newPosition += (options.spacing + itemWidth);
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