(function(){'use strict';
const mount=document.getElementById('site-header');
if(!mount)return;
const isApp=document.body.dataset.page==='app';
const path=window.location.pathname||'/';
const links=[
 ['/','Home'],
 ['/pages/image-to-excel-guide.html','Guides'],
 ['/pages/ocr-accuracy-guide.html','OCR Accuracy'],
 ['/pages/ocr-table-extraction.html','How It Works'],
 ['/pages/about.html','About'],
 ['/pages/contact.html','Contact']
];
const nav=links.map(([href,label])=>'<a href="'+href+'"'+(path===href?' aria-current="page"':'')+'>'+label+'</a>').join('');
const controls=isApp?'<div class="app-header-controls" aria-label="Application controls">'+
'<button id="btnThemeToggle" class="app-theme-toggle" type="button" onclick="toggleTheme()" title="Toggle color theme" aria-label="Toggle color theme"><i id="themeIcon" class="fa-solid fa-moon" aria-hidden="true"></i><span id="themeLabel" class="sr-only">Switch to dark mode</span></button>'+
'</div>':'';
const tabs=[
 ['/','fa-house','Home'],
 ['#main-content','fa-wand-magic-sparkles','Convert'],
 ['/pages/image-to-excel-guide.html','fa-book-open','Guides'],
 ['/pages/about.html','fa-circle-info','About']
];
const tabHtml=tabs.map(([href,icon,label],i)=>'<a class="mobile-tab'+((i===0&&path==='/')||(i===2&&path.includes('guide'))||(i===3&&path.includes('about'))?' is-active':'')+'" href="'+href+'"'+(((i===0&&path==='/')||(i===2&&path.includes('guide'))||(i===3&&path.includes('about')))?' aria-current="page"':'')+'><i class="fa-solid '+icon+'" aria-hidden="true"></i><span>'+label+'</span></a>').join('');
mount.outerHTML='<header class="site-header'+(isApp?' site-header--app':'')+'"><div class="site-header__inner">'+
'<a class="site-brand" href="/" aria-label="ProTools home"><img class="site-brand__mark" src="/assets/images/protools-mark.svg" alt="" width="42" height="42"><span><strong>ProTools</strong><small>Convert Smarter. Work Faster.</small></span></a>'+
'<nav class="site-nav" aria-label="Main navigation">'+nav+'</nav>'+controls+
'<button class="mobile-menu-toggle" id="mobileMenuToggle" type="button" aria-controls="mobileSiteMenu" aria-expanded="false" aria-label="Open navigation menu"><i class="fa-solid fa-bars" aria-hidden="true"></i></button>'+
'</div><nav class="mobile-site-menu" id="mobileSiteMenu" aria-label="Mobile navigation" hidden>'+nav+'</nav></header>'+
'<nav class="mobile-tab-bar" aria-label="Quick navigation">'+tabHtml+'</nav>';
const toggle=document.getElementById('mobileMenuToggle');
const menu=document.getElementById('mobileSiteMenu');
if(toggle&&menu){
 toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu');menu.hidden=!open;toggle.innerHTML='<i class="fa-solid '+(open?'fa-xmark':'fa-bars')+'" aria-hidden="true"></i>';});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation menu');toggle.innerHTML='<i class="fa-solid fa-bars" aria-hidden="true"></i>';toggle.focus();}});
 menu.addEventListener('click',e=>{if(e.target.closest('a')){menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.innerHTML='<i class="fa-solid fa-bars" aria-hidden="true"></i>';toggle.setAttribute('aria-label','Open navigation menu');}});
}
})();