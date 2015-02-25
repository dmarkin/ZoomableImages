'use strict';

function makeZoomable(gallery) {
    var ESC_KEYCODE = 27;
    $('#modalWindow').hide();

    //make preparation for opening modal window with zoomable image
    $('.' + gallery.classList + ' img').on('click', function () {
        var src = $(this).attr('src').replace('small', 'large');
        openModalImage(src);

        //if window resized make resizing of the image
        $(window).on('resize', function () {
            $('#modalWindow > div').css({
                left: '',
                top: '',
                width: '',
                height: ''
            });
            computeImageSizes();
        });

        //close modal window on ESC
        $(window).on('keyup', function (event) {
            if (event.keyCode === ESC_KEYCODE) {
                closeModalWindow();
            }
        })
    });

    //open modal window with zoomable image
    function openModalImage(src) {
        if ($('#modalWindow img').length === 0) {
            $('#modalWindow').append($('<div>').append($('<img>').attr('src', src)).append($('<div>').addClass('close-button').html('&times;')));
        }
        else {
            //if img-nod� was created - change source link on image inside it and clear position parameters
            $('#modalWindow img').attr('src', src);
            $('#modalWindow > div').css({
                left: '',
                top: '',
                width: '',
                height: ''
            });
        }
        $('#modalWindow').show();

        //recalculate images sizes and position
        $('#modalWindow img').off('load');
        $('#modalWindow img').on('load', function () {
            computeImageSizes();
        });
        $('#bgOverlay').append('<div id="gray-overlay"></div>');

        //set listener for close button
        $('.close-button').on('click', function () {
            $('.close-button').off('click');
            closeModalWindow();
        })
    }

    //calculate image sizes and position parameters
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

        //case if large image have been placed fully at viewport
        if (flexMaxCoefficient <= 1) {
            imageInWindowWidth = imageWidth;
            imageInWindowHeight = imageHeight;
        } else {

        //case if large image not have been placed fully at viewport - zooming image
            imageInWindowWidth = imageWidth / flexMaxCoefficient;
            imageInWindowHeight = imageHeight / flexMaxCoefficient;
        }

        //centering large image at viewport
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