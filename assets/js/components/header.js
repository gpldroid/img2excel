(function(){'use strict';
const mount=document.getElementById('site-header');
if(!mount)return;
const isApp=document.body.dataset.page==='app';
const path=window.location.pathname||'/';
const links=[
  ['/','الأداة'],
  ['/pages/image-to-excel-guide.html','دليل التحويل'],
  ['/pages/ocr-accuracy-guide.html','دقة OCR'],
  ['/pages/ocr-table-extraction.html','كيف يعمل OCR'],
  ['/pages/about.html','من نحن'],
  ['/pages/contact.html','اتصل بنا']
];
const nav=links.map(([href,label])=>'<a href="'+href+'"'+(path===href?' aria-current="page"':'')+'>'+label+'</a>').join('');
const controls=isApp?'<div class="app-header-controls" aria-label="إعدادات الأداة">'+
'<div class="app-engine-switcher" role="group" aria-label="محرك OCR">'+
'<button id="engineGemini" type="button" onclick="setEngine(\'gemini\')">Gemini AI</button>'+
'<button id="engineTesseract" type="button" onclick="setEngine(\'tesseract\')">OCR محلي</button>'+
'</div>'+
'<label class="app-preset-control"><span>نوع المستند</span><select id="docPresetSelect" aria-label="نوع المستند"><option value="auto">جدول عام</option><option value="receipt">فاتورة / إيصال</option><option value="attendance">كشف حضور</option><option value="financial">تقرير مالي</option></select></label>'+
'<button id="btnThemeToggle" class="app-theme-toggle" type="button" onclick="toggleTheme()" title="التبديل بين الوضع الفاتح والداكن" aria-label="تبديل المظهر"><i id="themeIcon" data-lucide="sun"></i><span id="themeLabel" class="sr-only">الوضع المضيء</span></button>'+
'</div>':'';
mount.outerHTML='<header class="site-header'+(isApp?' site-header--app':'')+'"><div class="site-header__inner">'+
'<a class="site-brand" href="/" aria-label="ProTools - الصفحة الرئيسية"><span class="site-brand__mark" aria-hidden="true">X</span><span><strong>ProTools</strong><small>Image to Excel Converter</small></span></a>'+
'<nav class="site-nav" aria-label="التنقل الرئيسي">'+nav+'</nav>'+controls+'</div></header>';
})();