require.config({
    paths: {
        react: 'https://cdn.bootcss.com/react/15.4.1/react.min',
        'react-dom': 'https://cdn.bootcss.com/react/15.4.1/react-dom.min',
        config: './config',
        MathJax: 'https://cdn.bootcss.com/mathjax/2.7.0/MathJax'
        
    },
    map: {
        '*': {
            'css': 'https://cdn.bootcss.com/require-css/0.1.8/css.min.js'
        }
    }
});

requestAnimationFrame = requestAnimationFrame || function(fn){
    setTimeout(fn, 16);
};


function WY(){
    this.addEventListener();
    this.setImageStyle();
    this.renderMathJax();
}

WY.prototype.renderMathJax = function(){
    var scripts = [].slice.call(document.getElementsByTagName('script'), 0);
    var hasTex = scripts.some(function(script){
        return /math\/tex/.test(script.type);
    });

    if(!hasTex){
        return;
    }

    window.MathJax = {
        extensions: ['tex2jax.js'],
        jax: ['input/TeX', 'output/SVG'],
        tex2jax: {
            inlineMath: [ ['$','$'], ["\\(","\\)"] ],
            displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
            processEscapes: true
        },
        showMathMenu: false,
        styles: {
            '.MathJax_SVG': {
                outline: 'none'
            }
        },
        'HTML-CSS': { availableFonts: ['TeX'] }
    };

    require(['MathJax']);
}

WY.prototype.toTop = function(){
    function toTop(){
        var top = document.documentElement.scrollTop || document.body.scrollTop;
        if(top < 20){
            document.documentElement.scrollTop = document.body.scrollTop = 0;
        }else{
            var targetTop = top * (9 / 10);
            document.documentElement.scrollTop = document.body.scrollTop = targetTop;
            requestAnimationFrame(toTop);
        }
    }
    requestAnimationFrame(toTop);
};

WY.prototype.setImageStyle = function () {
    // 将图片的 alt 属性内容添加在图片下方
    var imgs = document.querySelectorAll('.m-post img');
    for (var i = 0, len = imgs.length; i < len; i++) {
        var alt = imgs[i].getAttribute('alt') || '';

        var params = {};
        var paramList = alt.split('&');
        paramList.forEach(function(param){
            var pair = param.split("=");
            var key = pair.shift();
            var value = pair.join('=');
            if(key === 'text'){
                var div = document.createElement('div');
                div = document.createElement('div');
                div.setAttribute('class', 'img-alt-wrap');
                div.innerHTML = '<p>' + value + '</p>';
                imgs[i].parentElement.appendChild(div);
                imgs[i].setAttribute('alt', value);
            } else {
                imgs[i].style[key] = value;
            }
        });
    }
};

WY.prototype.addEventListener = function(){
    // topTop
    var toTop = document.getElementsByClassName('to-top')[0];
    toTop.addEventListener('click', this.toTop);
};

new WY();
