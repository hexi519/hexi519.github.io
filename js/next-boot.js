NexT.boot={},NexT.boot.registerEvents=function(){NexT.utils.registerScrollPercent(),NexT.utils.registerCanIUseTag(),document.querySelector(".site-nav-toggle .toggle").addEventListener("click",e=>{e.currentTarget.classList.toggle("toggle-close");const t=document.querySelector(".site-nav");if(!t)return;const i=t.classList.contains("site-nav-on")?"slideUp":"slideDown";"function"==typeof Velocity?Velocity(t,i,{duration:200,complete:function(){t.classList.toggle("site-nav-on")}}):t.classList.toggle("site-nav-on")});document.querySelectorAll(".sidebar-nav li").forEach((e,t)=>{e.addEventListener("click",e=>{if(e.currentTarget.matches(".sidebar-toc-active .sidebar-nav-toc, .sidebar-overview-active .sidebar-nav-overview"))return;const i=document.querySelector(".sidebar-inner"),o=document.querySelectorAll(".sidebar-panel"),n=["sidebar-toc-active","sidebar-overview-active"];window.anime({targets:o[1-t],duration:200,easing:"linear",opacity:0,complete:()=>{i.classList.remove(n[1-t]),o[t].style.opacity=0,i.classList.add(n[t]),window.anime({targets:o[t],duration:200,easing:"linear",opacity:1})}})})}),window.addEventListener("resize",NexT.utils.initSidebarDimension),window.addEventListener("hashchange",()=>{const e=location.hash;if(""!==e&&!e.match(/%\S{2}/)){const t=document.querySelector(`.tabs ul.nav-tabs li a[href="${e}"]`);t&&t.click()}})},NexT.boot.refresh=function(){CONFIG.prism&&window.Prism.highlightAll(),CONFIG.fancybox&&NexT.utils.wrapImageWithFancyBox(),CONFIG.mediumzoom&&window.mediumZoom(".post-body :not(a) > img, .post-body > img",{background:"var(--content-bg-color)"}),CONFIG.lazyload&&window.lozad(".post-body img").observe(),CONFIG.pangu&&window.pangu.spacingPage(),CONFIG.exturl&&NexT.utils.registerExtURL(),NexT.utils.registerCopyCode(),NexT.utils.registerTabsTag(),NexT.utils.registerActiveMenuItem(),NexT.utils.registerLangSelect(),NexT.utils.registerSidebarTOC(),NexT.utils.wrapTableWithBox(),NexT.utils.registerVideoIframe()},NexT.boot.motion=function(){CONFIG.motion.enable&&NexT.motion.integrator.add(NexT.motion.middleWares.logo).add(NexT.motion.middleWares.menu).add(NexT.motion.middleWares.postList).add(NexT.motion.middleWares.sidebar).add(NexT.motion.middleWares.footer).bootstrap(),NexT.utils.updateSidebarPosition()},document.addEventListener("DOMContentLoaded",()=>{NexT.boot.registerEvents(),NexT.boot.refresh(),NexT.boot.motion()});