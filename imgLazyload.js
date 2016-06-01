var oLazyload = (function (){
    var onload,
        inited = false,
        threshold = 100, //load in advance
        images = [],
        throttleDelay = 50,
        scrollContainer = document.body,

        elementInViewport = function(el) {
            var offset = el.__offset || (el.__offset = el.getBoundingClientRect());
            return (offset.top    >= -(offset.height + threshold) &&
                    offset.top <= (document.documentElement.clientHeight || window.innerHeight) + threshold);
        },

        showImg = function(el, fn){
            var src = el.getAttribute('data-src'),
                isBg = el.getAttribute('data-bg'),
                parent;


            if(src){
                if(isBg){
                    parent = el.parentNode;
                    el = new Image();
                } else {
                    el.style.opacity = 0;
                }
                el.addEventListener('load', onload = function(){

                    if(isBg){
                        parent.style.backgroundImage = 'url(' + src + ')';
                    } else {
                        el.style.opacity = 1;
                        el.removeEventListener('load', onload, false);
                        el.removeEventListener('error', onload, false);
                    }

                    typeof fn === "function" && fn();
                }, false);

                el.addEventListener('error', onload, false);
                el.src = src;
            }

            el.removeAttribute('data-src');
        },

        throttle = function(fn, minDelay) {
            var lastCall = 0;

            return function() {
                var now = +new Date();
                if (now - lastCall < minDelay) {
                    return;
                }
                lastCall = now;
                fn.apply(this, arguments);
            }
        },

        processScroll = function(){
            var targetIndex;

            for (var i = 0; i < images.length; i++) {
                (function(index){
                    var img = images[index];
                    if (elementInViewport(img)) {
                        targetIndex = images.indexOf(img);
                        targetIndex >= 0 && showImg(img) && images.splice(targetIndex, 1);
                    }
                })(i);
            };

            if(images.length === 0){
                scrollContainer.removeEventListener('scroll', TProcessScroll);
                scrollContainer.removeEventListener('touchmove', TProcessScroll);
                inited = false;
            }
        },
        
        TProcessScroll = throttle(processScroll, throttleDelay),

        init = function(imgContainer){
            imgContainer = imgContainer || scrollContainer;
            images = images.concat(Array.prototype.slice.call(imgContainer.querySelectorAll('img[data-src]'), 0));
            processScroll();

            if(!inited){
                scrollContainer.addEventListener('scroll', TProcessScroll);
                scrollContainer.addEventListener('touchmove', TProcessScroll);
                inited = true;
            }
        };

    return {
        run: init
    }
})();