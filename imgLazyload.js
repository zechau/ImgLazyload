    var LazyLoad = (function (){
        var inited = false,
        images = [],
        timer,
        config = {
            "threshold": 100, //load image in advance
            "throttle_delay": 200, //delay between each unloaded images check
            "container": document.body //the container in which images should be lazy-loaded
        },

        elementInViewport = function(el) {
            var offset = el.getBoundingClientRect();
            var is_visible = offset.top + offset.bottom > 0;
            var is_on_screen =  (offset.top    >= -(offset.height + config.threshold) &&
                    offset.top <= (document.documentElement.clientHeight || window.innerHeight) + config.threshold);

            return is_visible && is_on_screen;
        },

        showImg = function(el){
            var src = el.getAttribute('data-src'),
                isBg = el.getAttribute('data-bg'),
                parent,
                onload;

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

                }, false);

                el.addEventListener('error', onload, false);
                el.src = src;
            }

            el.removeAttribute('data-src');
        },

        processScroll = function(){
            var targetIndex;

            for (var i = 0; i < images.length; i++) {
                (function(index){
                    var img = images[index];
                    if (elementInViewport(img)) {
                        targetIndex = images.indexOf(img);
                        if(targetIndex >= 0){
                            showImg(img);
                            images.splice(targetIndex, 1);
                        }
                    }
                })(i);
            };

            if(images.length === 0){
                clearInterval(timer);
                inited = false;
            }
        },

        LazyLoad = function(options){
            options = options || {};
            for(var key in options){
                config[key] = options[key];
            }
        };

        LazyLoad.prototype.run = function(container){
            container = container || config.container;
            images = images.concat(Array.prototype.slice.call(config.container.querySelectorAll('img[data-src]'), 0));
            processScroll();

            if(!inited){
                setInterval(processScroll, config.throttle_delay);
                inited = true;
            }
        };

        return LazyLoad;
    })();