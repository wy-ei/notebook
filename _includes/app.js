requestAnimationFrame = requestAnimationFrame || webkitRequestAnimationFrame || mozRequestAnimationFrame || function(fn){
    setTimeout(fn, 16);
};

var lib = {
    mathjax: 'https://cdn.jsdelivr.net/npm/mathjax@2.7.5/MathJax.js'
};
var MathJaxLoaded = false;

window.MathJax = {
    extensions: ['tex2jax.js'],
    jax: ['input/TeX', 'output/SVG'],
    tex2jax: {
        inlineMath: [ ['$','$'], ["\\(","\\)"] ],
        displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
        processEscapes: true
    },
    TeX: {
        extensions: ['autoload-all.js']
    },
    showMathMenu: false,
    styles: {
        '.MathJax_SVG': {
            outline: 'none'
        }
    },
    SVG: {
        font: "TeX"
    }
};


function APP(){
    this.seen_slug = {};

    this.init();
}

APP.prototype = window.WY;

APP.prototype.init = function(){
    var _this = this;
    window.addEventListener('DOMContentLoaded', function(){
        if(!window.__notebook__){
            _this.setImage();
            _this.renderMath();
        }    
        _this.addEventListener();
    });
}

APP.prototype.addEventListener = function(){
    // topTop
    var toTop = document.querySelector('.m-to-top');
    if(toTop){
        toTop.addEventListener('click', this.toTop);
    }
    if(window.Prism){
        Prism.highlightAll();
    }
};

APP.prototype.addServiceWorker = function(){
    if('serviceWorker' in navigator) {
        navigator.serviceWorker
           .register('/sw.js')
           .then(function() { console.log("Service Worker Registered"); });
    }
}

APP.prototype.toTop = function(){
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


APP.prototype.setImage = function () {
    var KEY_MAP = {
        'ml': 'margin-left',
        'w': 'width'
    };

    var imgs = document.querySelectorAll('.post img');
    for (var i = 0, len = imgs.length; i < len; i++) {
        var img = imgs[i];
        var alt = img.getAttribute('alt') || '';
        if(!alt){
            continue;
        }
        
        var params = getParam(alt);
        img.removeAttribute('alt');
        params.forEach(function(param){
            var key = param[0];
            var value = param[1];
            if(key in KEY_MAP){
                key = KEY_MAP[key];
            }

            if(key == 'text'){
                var div = document.createElement('div');
                div.setAttribute('class', 'img-alt');
                div.innerHTML = '<p>' + value + '</p>';
                img.parentElement.appendChild(div);
            }
            else if(key == 'class'){
                img.classList.add(value);
            }
            else{
                img.style[key] = value;
            }
        });
    }

    function getParam(s){
        var r = /<(.+?),(.+?)>/g;
        var params = []
        var match = r.exec(s)
        while(match){
            var key = match[1];
            var val = match[2];
            key = key.trim();
            val = val.trim();
            params.push([key, val])
            match = r.exec(s)
        }
        return params;
    }
}

APP.prototype.fetch = function(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';

    xhr.addEventListener('load', function(e){
        var status = xhr.status;
        if ((status >= 200 && status < 300) || status === 304) {
            var data = xhr.response;
            callback(null, data);
        }else{
            callback('error');
        }
    });

    xhr.addEventListener('error', function(){
        callback('error');
    });
    xhr.send();
}

APP.prototype.load_from_github_issues = function(repo, issue_id, dom_id){
    var url = 'https://api.github.com/repos/wy-ei/' + repo + '/issues/' + issue_id;

    var dom = document.getElementById(dom_id);

    var issue_div = document.createElement('div');
    issue_div.innerHTML = '正在加载 ...';
    var comments_div = document.createElement('div');

    var fail_message = '加载失败，<a href="' + url + '">点此查看</a>。';

    dom.appendChild(issue_div);
    dom.appendChild(comments_div);

    this.fetch(url, function(error, data){
        if(!error){
            issue_div.innerHTML = marked(data['body']) + '<br>';
        }else{
            if(comments_div.dataset.status == 'fail'){
                issue_div.innerHTML = fail_message;
            }else{
                issue_div.dataset.status = 'fail';
            }
        }
    });

    this.fetch(url + '/comments', function(error, data){
        if(error){
            if(issue_div.dataset.status == 'fail'){
                issue_div.innerHTML = fail_message;
            }else{
                comments_div.dataset.status = 'fail';
            }
        }else{
            comments_div.innerHTML = data.map(function(item){
                var body = marked(item['body']);
                return '<div>' + body + '</div>';
            }).join('\n');
        }
    });
}


APP.prototype.render_notebook = function (ipynb, container) {
    var notebook = nb.parse(ipynb);
    container.innerHTML = '';
    var elem = notebook.render()

    // remove head
    var head = elem.querySelector('h1,h2');
    if(head){
        var title = head.innerText.trim();
        var path_title = document.querySelector('.page__title');
        if(path_title){
           head.remove();
        }else{
            document.head.title = title + " - WangYu's Notes";
        }
    }

    container.appendChild(elem);
    Prism.highlightAll();
    this.renderMath();
    this.buildTOC();
    this.setImage();

};

APP.prototype.render_jupyter_notebook = function(url, dom_id){
    var fail_message = '加载失败，<a href="' + url + '">点此下载</a>。';

    var container = document.getElementById(dom_id);
    container.innerHTML = '<div class="loading"></div>';

    var _this = this;

    this.fetch(url, function(error, data){
        if(!error){
            _this.render_notebook(data, container);
        }else{
            container.innerHTML = fail_message;
        }
    });
};

APP.prototype.run_pending_jobs = function(){
    for(var i=0;i<this.queue.length;i++){
        this.queue[i].apply(this);
    }
};

APP.prototype.renderMath = function(){
    var scripts = [].slice.call(document.getElementsByTagName('script'), 0);
    var hasBlockLaTex = scripts.some(function(script){
        return /math\/tex/.test(script.type);
    });

    var hasInlineLaTex = false;

    var codes = [].slice.call(document.querySelectorAll("p code"));
    codes.forEach(function(code){
        var text = code.innerText;
        if(text[0] == '$' && text[text.length-1] == '$'){
            hasInlineLaTex = true;
            text = text.slice(1, text.length-1);
            var script = document.createElement("script");
            script.type = "math/tex";
            script.innerText = text;

            code.parentElement.replaceChild(script, code);
        }
    });

    if(!(hasBlockLaTex || hasInlineLaTex || window.__notebook__ || window.__math__)){
        return;
    }

    if (MathJaxLoaded) {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub])
    }else{
        LazyLoad.js([lib.mathjax], function(){
            MathJaxLoaded = true;
            MathJax.Hub.Queue(["Typeset", MathJax.Hub])
        });
    }
};


APP.prototype.build_slug = function(value) {
    let slug = value
        .toLowerCase()
        .trim()
        .split(' ').join('-')
        .split(/[\|\$&`~=\\\/@+*!?\(\{\[\]\}\)<>=.,;:'"^。？！，、；：“”【】（）〔〕［］﹃﹄“”‘’﹁﹂—…－～《》〈〉「」]/g).join('')
        .replace(/\t/, '--');
  
    if (this.seen_slug.hasOwnProperty(slug)) {
      var original_slug = slug;
      do {
        this.seen_slug[original_slug]++;
        slug = original_slug + '-' + this.seen_slug[original_slug];
      } while (this.seen_slug.hasOwnProperty(slug));
    }
    this.seen_slug[slug] = 0;
  
    return slug;
  };

APP.prototype.buildTOC = function(){
    var container = document.querySelector('.post .content');
    var toc = document.querySelector('.toc');

    if(toc){
        toc = document.createElement('ul');
        toc.setAttribute('id', 'markdown-toc');
    }else{
        return;
    }

    
    var head = container.querySelector('h1,h2,h3');

    head.parentElement.insertBefore(toc, head.nextElementSibling)

    var hs = container.querySelectorAll('h2,h3,h4')
    var hx = []
    var top_level = 4;

    for(var i = 0;i<hs.length;i++){
        var h = hs[i];
        var level = parseInt(h.tagName[1]);

        var text = h.innerText;
        var slug = this.build_slug(text);

        if(level < top_level){
            top_level = level;
        }

        h.setAttribute('id', slug);
        
        hx.push({
            level: level,
            slug: slug,
            text: text
        });
        
        
    }

    hx = hx.map(function(h){
        h.level = h.level - top_level + 1;
        return h;
    });

    items = [];
    for(var i=0;i< hx.length;i++){
        var h = hx[i];

        var row = '<li class="toc-level-[level]"><a href="#[slug]">[text]</a></li>';
        row = row.replace('[level]', h.level);
        row = row.replace('[slug]', h.slug);
        row = row.replace('[text]', h.text);

        items.push(row);
    }

    if(items.length > 0){
        toc.innerHTML = items.join('\n');
    }
};

window.WY = new APP();

window.WY.run_pending_jobs()