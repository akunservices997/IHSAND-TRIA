+ function ($) {
    'use strict';

    if (!window.WEDEW_BACKGROUND_MUSIC) return;

    var source = window.WEDEW_BACKGROUND_MUSIC.source
    var backgroundMusic;

    // Played
    function musicPlayed() {
        isMusicPlayed = true;
        $('.background-music').removeClass('is-loading is-paused').addClass('is-played');
        setTimeout(function () {
            $('.background-music').addClass('is-expanded');
            setTimeout(function () {
                $('.background-music').removeClass('is-expanded');
            }, 5000);
        }, 500);
    }

    // Paused
    function musicPaused() {
        isMusicPlayed = false;
        $('.background-music').removeClass('is-loading is-played').addClass('is-paused');
    }

    if (source == 'soundcloud') {
        var iframe = $('#sc-wrapper iframe')[0];

        backgroundMusic = SC.Widget(iframe);

        backgroundMusic.bind(SC.Widget.Events.PLAY, function (e) {
            musicPlayed();
        });

        backgroundMusic.bind(SC.Widget.Events.PAUSE, function (e) {
            musicPaused();
        });
    }

    if (source == 'file') {
        backgroundMusic = document.createElement("audio");
        backgroundMusic.autoplay = true;
        backgroundMusic.loop = true;
        backgroundMusic.load();
        backgroundMusic.src = window.WEDEW_BACKGROUND_MUSIC.url;

        var isMusicPlayed = false
    }

    window.pauseMusic = function () {
        backgroundMusic.pause();
        musicPaused();
    }

    window.playMusic = function () {
        var promise = backgroundMusic.play();
        if (promise instanceof Promise) {
            promise.then(_ => {
                musicPlayed();
            }).catch(error => {
                musicPaused();
            });
        }
    }

    $('.background-music .btn').click(function () {
        if (isMusicPlayed) {
            pauseMusic();
        } else {
            playMusic();
        }
    });

    setTimeout(playMusic, 500)

    $(document).on('music:mute', function () {
        if (source == 'soundcloud') {
            backgroundMusic.setVolume(0);

            backgroundMusic.bind(SC.Widget.Events.READY, function (e) {
                backgroundMusic.setVolume(0);
            })
        }
        if (source == 'file') {
            backgroundMusic.muted = true;
        }
    });

    $(document).on('music:unmute', function () {
        if (source == 'soundcloud') {
            backgroundMusic.setVolume(100);
        }
        if (source == 'file') {
            backgroundMusic.muted = false;
        }
    });

}(window.jQuery);