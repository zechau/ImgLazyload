var oLazyload = (function (){
    var onload,
        inited = false,
        offset = 100,
        images = [],
        throttleDelay = 50,


        elementInViewport = function(el) {
            var rect = el.getBoundingClientRect();
            return (rect.top    >= -(rect.height + offset) &&
                    rect.top <= (document.documentElement.clientHeight || window.innerHeight) + offset);
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

                    fn ? fn(): null;
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
                removeEventListener('scroll', TProcessScroll);
                removeEventListener('touchmove', TProcessScroll);
                inited = false;
            }
        },
        
        TProcessScroll = throttle(processScroll, throttleDelay),

        init = function(context){
            context && (images = images.concat(Array.prototype.slice.call(context.querySelectorAll('img[data-src]'), 0)));
            processScroll();
            if(!inited){
                addEventListener('scroll', TProcessScroll);
                addEventListener('touchmove', TProcessScroll);
                inited = true;
            }
        };

    return {
        run: init
    }
})();