var LazyLoad=(function(doc){var env,head,pending={},pollCount=0,queue={css:[],js:[]},styleSheets=doc.styleSheets;function createNode(name,attrs){var node=doc.createElement(name),attr;for(attr in attrs){if(attrs.hasOwnProperty(attr)){node.setAttribute(attr,attrs[attr])}}return node}function finish(type){var p=pending[type],callback,urls;if(p){callback=p.callback;urls=p.urls;urls.shift();pollCount=0;if(!urls.length){callback&&callback.call(p.context,p.obj);pending[type]=null;queue[type].length&&load(type)}}}function getEnv(){var ua=navigator.userAgent;env={async:doc.createElement("script").async===true};(env.webkit=/AppleWebKit\//.test(ua))||(env.ie=/MSIE|Trident/.test(ua))||(env.opera=/Opera/.test(ua))||(env.gecko=/Gecko\//.test(ua))||(env.unknown=true)}function load(type,urls,callback,obj,context){var _finish=function(){finish(type)},isCSS=type==="css",nodes=[],i,len,node,p,pendingUrls,url;env||getEnv();if(urls){urls=typeof urls==="string"?[urls]:urls.concat();if(isCSS||env.async||env.gecko||env.opera){queue[type].push({urls:urls,callback:callback,obj:obj,context:context})}else{for(i=0,len=urls.length;i<len;++i){queue[type].push({urls:[urls[i]],callback:i===len-1?callback:null,obj:obj,context:context})}}}if(pending[type]||!(p=pending[type]=queue[type].shift())){return}head||(head=doc.head||doc.getElementsByTagName("head")[0]);pendingUrls=p.urls.concat();for(i=0,len=pendingUrls.length;i<len;++i){url=pendingUrls[i];if(isCSS){node=env.gecko?createNode("style"):createNode("link",{href:url,rel:"stylesheet"})}else{node=createNode("script",{src:url});node.async=false}node.className="lazyload";node.setAttribute("charset","utf-8");if(env.ie&&!isCSS&&"onreadystatechange" in node&&!("draggable" in node)){node.onreadystatechange=function(){if(/loaded|complete/.test(node.readyState)){node.onreadystatechange=null;_finish()}}}else{if(isCSS&&(env.gecko||env.webkit)){if(env.webkit){p.urls[i]=node.href;pollWebKit()}else{node.innerHTML='@import "'+url+'";';pollGecko(node)}}else{node.onload=node.onerror=_finish}}nodes.push(node)}for(i=0,len=nodes.length;i<len;++i){head.appendChild(nodes[i])}}function pollGecko(node){var hasRules;try{hasRules=!!node.sheet.cssRules}catch(ex){pollCount+=1;if(pollCount<200){setTimeout(function(){pollGecko(node)},50)}else{hasRules&&finish("css")}return}finish("css")}function pollWebKit(){var css=pending.css,i;if(css){i=styleSheets.length;while(--i>=0){if(styleSheets[i].href===css.urls[0]){finish("css");break}}pollCount+=1;if(css){if(pollCount<200){setTimeout(pollWebKit,50)}else{finish("css")}}}}return{css:function(urls,callback,obj,context){load("css",urls,callback,obj,context)},js:function(urls,callback,obj,context){load("js",urls,callback,obj,context)}}})(window.document);

requestAnimationFrame = requestAnimationFrame || webkitRequestAnimationFrame || mozRequestAnimationFrame || function(fn){
    setTimeout(fn, 16);
};

var lib = {
    mathjax: 'https://cdn.jsdelivr.net/npm/mathjax@2.7.5/MathJax.js',
    highlight: 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.1.2/build/highlight.min.js',
    prism: '/assets/js/lib/prism.js'
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
            _this.highlight();
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
    this.handleKeyPressEvent();
};


APP.prototype.handleKeyPressEvent = function(){
    document.addEventListener('keypress', function(event){
        var key = event.key;
        console.log(key);
        if(key == 't'){
            var toc = document.querySelector('#markdown-toc');
            if(!toc){
                return;
            }
            if(toc.dataset['init'] != 1){
                toc.dataset['init'] = 1;
                var w = toc.clientWidth;
                var h = toc.clientHeight;
                toc.style.width = w + 'px';
                var div = document.createElement("div");
                div.classList.add("toc-placeholder");
                div.style.height = h + 'px';

                div.addEventListener('click', function(event){
                    toc.classList.remove("popup");
                });

                toc.parentElement.insertBefore(div, toc.nextElementSibling);
            }
            toc.classList.toggle("popup");
        }else if(key == 'u'){
            document.documentElement.scrollTop = document.body.scrollTop = 0;
        }else{
            
        }
    });
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
        if(top < 10){
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




APP.prototype.highlight = function(){
    let codeblocks = document.querySelectorAll('pre code');
    if(codeblocks.length == 0){
        return;
    }
    LazyLoad.js(lib.prism);
};

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
    this.renderMath();
    this.highlight();
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
window.WY.run_pending_jobs();