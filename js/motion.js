window.$&&window.$.Velocity&&(window.Velocity=window.$.Velocity),NexT.motion={},NexT.motion.integrator={queue:[],cursor:-1,init:function(){return this.queue=[],this.cursor=-1,this},add:function(t){return this.queue.push(t),this},next:function(){this.cursor++;const t=this.queue[this.cursor];"function"==typeof t&&t(NexT.motion.integrator)},bootstrap:function(){this.next()}},NexT.motion.middleWares={logo:function(t){const e=[];function o(t,o=!1){e.push([{targets:t,opacity:1,top:0},o?"-=200":"-=0"])}var n;o(".header"),"Mist"===CONFIG.scheme&&(n=".logo-line",e.push([{targets:n,scaleX:[0,1],duration:500},"-=200"])),"Muse"===CONFIG.scheme&&o(".custom-logo-image"),o(".site-title"),o(".site-brand-container .toggle",!0),o(".site-subtitle"),("Pisces"===CONFIG.scheme||"Gemini"===CONFIG.scheme)&&o(".custom-logo-image"),e[e.length-1][0].complete=function(){t.next()};const i=window.anime.timeline({duration:200,easing:"linear"});e.forEach(t=>i.add(...t)),CONFIG.motion.async&&t.next()},menu:function(t){Velocity(document.querySelectorAll(".menu-item"),"transition.slideDownIn",{display:null,duration:200,complete:function(){t.next()}}),!CONFIG.motion.async&&document.querySelectorAll(".menu-item").length||t.next()},subMenu:function(t){const e=document.querySelectorAll(".sub-menu .menu-item");e.length>0&&e.forEach(t=>{t.style.opacity=1}),t.next()},postList:function(t){const e=document.querySelectorAll(".post-block, .pagination, .comments"),o=CONFIG.motion.transition.post_block,n=document.querySelectorAll(".post-header"),i=CONFIG.motion.transition.post_header,c=document.querySelectorAll(".post-body"),s=CONFIG.motion.transition.post_body,r=document.querySelectorAll(".collection-header"),u=CONFIG.motion.transition.coll_header;if(e.length>0){const l=window.postMotionOptions||{stagger:100,drag:!0,complete:function(){t.next()}};o&&Velocity(e,"transition."+o,l),i&&Velocity(n,"transition."+i,l),s&&Velocity(c,"transition."+s,l),u&&Velocity(r,"transition."+u,l)}"Pisces"!==CONFIG.scheme&&"Gemini"!==CONFIG.scheme||t.next()},sidebar:function(t){const e=document.querySelector(".sidebar"),o=CONFIG.motion.transition.sidebar;!o||"Pisces"!==CONFIG.scheme&&"Gemini"!==CONFIG.scheme||Velocity(e,"transition."+o,{display:null,duration:200}),t.next()},footer:function(t){const e=document.querySelector(".footer");Velocity(e,{opacity:1},{duration:200}),t.next()}};