HTMLElement.prototype.wrap=function(e){this.parentNode.insertBefore(e,this),this.parentNode.removeChild(this),e.appendChild(this)},NexT.utils={wrapImageWithFancyBox:function(){document.querySelectorAll(".post-body :not(a) > img, .post-body > img").forEach(e=>{const t=$(e),n=t.attr("data-src")||t.attr("src"),o=t.wrap(`<a class="fancybox fancybox.image" href="${n}" itemscope itemtype="http://schema.org/ImageObject" itemprop="url"></a>`).parent("a");t.is(".post-gallery img")?o.attr("data-fancybox","gallery").attr("rel","gallery"):t.is(".group-picture img")?o.attr("data-fancybox","group").attr("rel","group"):o.attr("data-fancybox","default").attr("rel","default");const a=t.attr("title")||t.attr("alt");a&&(o.append(`<p class="image-caption">${a}</p>`),o.attr("title",a).attr("data-caption",a))}),$.fancybox.defaults.hash=!1,$(".fancybox").fancybox({loop:!0,helpers:{overlay:{locked:!1}}})},registerExtURL:function(){document.querySelectorAll("span.exturl").forEach(e=>{let t=document.createElement("a");t.href=decodeURIComponent(atob(e.dataset.url).split("").map(e=>"%"+("00"+e.charCodeAt(0).toString(16)).slice(-2)).join("")),t.rel="noopener external nofollow noreferrer",t.target="_blank",t.className=e.className,t.title=e.title,t.innerHTML=e.innerHTML,e.parentNode.replaceChild(t,e)})},registerCopyCode:function(){document.querySelectorAll("figure.highlight").forEach(e=>{if(e.querySelectorAll(".code .line span").forEach(e=>{e.classList.forEach(t=>{e.classList.remove(t),e.classList.add(`hljs-${t}`)})}),!CONFIG.copycode)return;e.insertAdjacentHTML("beforeend",'<div class="copy-btn"><i class="fa fa-clipboard fa-fw"></i></div>');const t=e.querySelector(".copy-btn");t.addEventListener("click",e=>{const t=e.currentTarget,n=[...t.parentNode.querySelectorAll(".code .line")].map(e=>e.innerText).join("\n"),o=document.createElement("textarea");o.style.top=window.scrollY+"px",o.style.position="absolute",o.style.opacity="0",o.readOnly=!0,o.value=n,document.body.append(o),o.select(),o.setSelectionRange(0,n.length),o.readOnly=!1;const a=document.execCommand("copy");t.querySelector("i").className=a?"fa fa-check-circle fa-fw":"fa fa-times-circle fa-fw",o.blur(),t.blur(),document.body.removeChild(o)}),e.addEventListener("mouseleave",()=>{setTimeout(()=>{t.querySelector("i").className="fa fa-clipboard fa-fw"},300)})})},wrapTableWithBox:function(){document.querySelectorAll("table").forEach(e=>{const t=document.createElement("div");t.className="table-container",e.wrap(t)})},registerVideoIframe:function(){document.querySelectorAll("iframe").forEach(e=>{if(["www.youtube.com","player.vimeo.com","player.youku.com","player.bilibili.com","www.tudou.com"].some(t=>e.src.includes(t))&&!e.parentNode.matches(".video-container")){const t=document.createElement("div");t.className="video-container",e.wrap(t);let n=Number(e.width),o=Number(e.height);n&&o&&(t.style.paddingTop=o/n*100+"%")}})},registerScrollPercent:function(){const e=document.querySelector(".back-to-top"),t=document.querySelector(".reading-progress-bar");window.addEventListener("scroll",()=>{if(e||t){const n=document.querySelector(".container").offsetHeight,o=window.innerHeight,a=n>o?n-o:document.body.scrollHeight-o,r=Math.min(100*window.scrollY/a,100);e&&(e.classList.toggle("back-to-top-on",Math.round(r)>=5),e.querySelector("span").innerText=Math.round(r)+"%"),t&&(t.style.width=r.toFixed(2)+"%")}if(!Array.isArray(NexT.utils.sections))return;let n=NexT.utils.sections.findIndex(e=>e&&e.getBoundingClientRect().top>0);-1===n?n=NexT.utils.sections.length-1:n>0&&n--,this.activateNavByIndex(n)}),e&&e.addEventListener("click",()=>{window.anime({targets:document.scrollingElement,duration:500,easing:"linear",scrollTop:0})})},registerTabsTag:function(){document.querySelectorAll(".tabs ul.nav-tabs .tab").forEach(e=>{e.addEventListener("click",e=>{e.preventDefault();const t=e.currentTarget;if(!t.classList.contains("active")){[...t.parentNode.children].forEach(e=>{e.classList.toggle("active",e===t)});const e=document.getElementById(t.querySelector("a").getAttribute("href").replace("#",""));[...e.parentNode.children].forEach(t=>{t.classList.toggle("active",t===e)}),e.dispatchEvent(new Event("tabs:click",{bubbles:!0}))}})}),window.dispatchEvent(new Event("tabs:register"))},registerCanIUseTag:function(){window.addEventListener("message",({data:e})=>{if("string"==typeof e&&e.includes("ciu_embed")){const t=e.split(":")[1],n=e.split(":")[2];document.querySelector(`iframe[data-feature=${t}]`).style.height=parseInt(n,10)+5+"px"}},!1)},registerActiveMenuItem:function(){document.querySelectorAll(".menu-item a[href]").forEach(e=>{const t=e.pathname===location.pathname||e.pathname===location.pathname.replace("index.html",""),n=!CONFIG.root.startsWith(e.pathname)&&location.pathname.startsWith(e.pathname);e.classList.toggle("menu-item-active",e.hostname===location.hostname&&(t||n))})},registerLangSelect:function(){let e=document.querySelector(".lang-select");e&&(e.value=CONFIG.page.lang,e.addEventListener("change",()=>{let t=e.options[e.selectedIndex];document.querySelector(".lang-select-label span").innerText=t.text;let n=t.dataset.href;window.pjax?window.pjax.loadUrl(n):window.location.href=n}))},registerSidebarTOC:function(){this.sections=[...document.querySelectorAll(".post-toc li a.nav-link")].map(e=>{const t=document.getElementById(decodeURI(e.getAttribute("href")).replace("#",""));return e.addEventListener("click",e=>{e.preventDefault();const n=t.getBoundingClientRect().top+window.scrollY;window.anime({targets:document.scrollingElement,duration:500,easing:"linear",scrollTop:n+10})}),t})},activateNavByIndex:function(e){const t=document.querySelectorAll(".post-toc li a.nav-link")[e];if(!t||t.classList.contains("active-current"))return;document.querySelectorAll(".post-toc .active").forEach(e=>{e.classList.remove("active","active-current")}),t.classList.add("active","active-current");let n=t.parentNode;for(;!n.matches(".post-toc");)n.matches("li")&&n.classList.add("active"),n=n.parentNode;const o=document.querySelector(".post-toc-wrap");window.anime({targets:o,duration:200,easing:"linear",scrollTop:o.scrollTop-o.offsetHeight/2+t.getBoundingClientRect().top-o.getBoundingClientRect().top})},supportsPDFs:function(){let e=navigator.userAgent,t=e.includes("irefox")&&parseInt(e.split("rv:")[1].split(".")[0],10)>18,n=void 0!==navigator.mimeTypes["application/pdf"],o=/iphone|ipad|ipod/i.test(e.toLowerCase());return t||n&&!o},initSidebarDimension:function(){const e=document.querySelector(".sidebar-nav"),t=document.querySelector(".sidebar-inner .back-to-top"),n=t?t.offsetHeight:0,o=CONFIG.sidebar.offset||12;let a=2*CONFIG.sidebar.padding+e.offsetHeight+n;"Pisces"!==CONFIG.scheme&&"Gemini"!==CONFIG.scheme||(a+=2*o);const r=document.body.offsetHeight-a+"px";document.documentElement.style.setProperty("--sidebar-wrapper-height",r)},updateSidebarPosition:function(){if(NexT.utils.initSidebarDimension(),window.screen.width<992||"Pisces"===CONFIG.scheme||"Gemini"===CONFIG.scheme)return;const e=document.querySelector(".post-toc");let t=CONFIG.page.sidebar;"boolean"!=typeof t&&(t="always"===CONFIG.sidebar.display||"post"===CONFIG.sidebar.display&&e),t&&window.dispatchEvent(new Event("sidebar:show"))},getScript:function(e,t,n){if(n)t();else{let n=document.createElement("script");n.onload=n.onreadystatechange=function(e,o){(o||!n.readyState||/loaded|complete/.test(n.readyState))&&(n.onload=n.onreadystatechange=null,n=void 0,!o&&t&&setTimeout(t,0))},n.src=e,document.head.appendChild(n)}},loadComments:function(e,t){if(!CONFIG.comments.lazyload||!e)return void t();let n=new IntersectionObserver((e,n)=>{e[0].isIntersecting&&(t(),n.disconnect())});return n.observe(e),n}};