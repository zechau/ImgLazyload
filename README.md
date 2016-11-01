# ImgLazylod
lazy load images for mobile first. plus: you can add any image to be lazy loaded dynamically!

## Installation
```html
<script src="/path/to/ImgLazyload.js"></script>
```
## Usage
```javascript
//init
var oLazyload = new LazyLoad({
	"threshold" :100,
	"throttle_delay": 200
});
//after a template created
oLazyload.run(document.querySelector('#imageContiner1Id'))

//afet another template created
oLazyload.run(document.querySelector('#imageContiner2Id'))
```

## License
MIT
