(() => {
    if (window.fbq) return;

    const pixel = window.fbq = function () {
        if (pixel.callMethod) {
            pixel.callMethod.apply(pixel, arguments);
        } else {
            pixel.queue.push(arguments);
        }
    };

    if (!window._fbq) window._fbq = pixel;
    pixel.push = pixel;
    pixel.loaded = true;
    pixel.version = '2.0';
    pixel.queue = [];

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);

    pixel('init', '2348358635926004');
    pixel('track', 'PageView');
})();
