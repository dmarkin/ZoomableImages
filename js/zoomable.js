'use strict';

function makeZoomable(gallery) {
    var ESC_KEYCODE = 27;
    $('#modalWindow').hide();

    $('.' + gallery.classList + ' img').on('click', function (event) {
        var src = $(this).attr('src').replace('small', 'large');
        openModalImage(src);

        $(window).on('resize', function () {
            $('#modalWindow > div').css({
                left: '',
                top: '',
                width: '',
                height: ''
            });
            computeImageSizes();
        });

        $(window).on('keyup', function (event) {
            if (event.keyCode === ESC_KEYCODE) {
                closeModalWindow();
            }
        })
    });

    function openModalImage(src) {
        if ($('#modalWindow img').length === 0) {
            $('#modalWindow').append($('<div>').append($('<img>').attr('src', src)).append($('<div>').addClass('close-button').html('&times;')));
        }
        else {
            $('#modalWindow img').attr('src', src);
            $('#modalWindow > div').css({
                left: '',
                top: '',
                width: '',
                height: ''
            });
        }
        $('#modalWindow').show();
        $('#modalWindow img').off('load');
        $('#modalWindow img').on('load', function () {
            computeImageSizes();
        });
        $('#bgOverlay').append('<div id="gray-overlay"></div>');
        $('.close-button').on('click', function () {
            $('.close-button').off('click');
            closeModalWindow();
        })
    }

    function computeImageSizes(imageWidth, imageHeight) {
        var imageInWindowWidth;
        var imageInWindowHeight;
        var padding = 0.1;
        var imageWidth = $('#modalWindow img').width();
        var imageHeight = $('#modalWindow img').height();
        var viewportWidth = $(window).width() * (1 - 2 * padding);
        var viewportHeigth = $(window).height() * (1 - 2 * padding);
        var flexWidthCoefficient = imageWidth / viewportWidth;
        var flexHeightCoefficient = imageHeight / viewportHeigth;
        var flexMaxCoefficient = Math.max(flexWidthCoefficient, flexHeightCoefficient);

        if (flexMaxCoefficient <= 1) {
            imageInWindowWidth = imageWidth;
            imageInWindowHeight = imageHeight;
        } else {
            imageInWindowWidth = imageWidth / flexMaxCoefficient;
            imageInWindowHeight = imageHeight / flexMaxCoefficient;
        }
        var left = ($(window).width() - imageInWindowWidth) / 2;
        var top = ($(window).height() - imageInWindowHeight) / 2;

        $('#modalWindow > div').css({
            position: 'fixed',
            left: left,
            top: top,
            'z-index': '10',
            width: imageInWindowWidth,
            height: imageInWindowHeight
        });
    }

    function closeModalWindow() {
        $('#modalWindow').hide();
        $('#bgOverlay').empty();
    }
}