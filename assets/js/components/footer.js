(function(){'use strict';
const mount=document.getElementById('site-footer');
if(!mount)return;
mount.outerHTML='<footer class="site-footer"><div class="site-footer__inner">'+
'<div class="site-footer__brand"><a href="/" aria-label="IMG2EXCEL الصفحة الرئيسية">IMG2EXCEL</a><p>أداة ويب لاستخراج الجداول والبيانات من الصور ومراجعتها وتصديرها إلى ملفات قابلة للتحرير.</p></div>'+
'<nav class="site-footer__links" aria-label="روابط الموقع"><a href="/pages/image-to-excel-guide.html">دليل تحويل الصور إلى Excel</a><a href="/pages/ocr-accuracy-guide.html">تحسين دقة OCR</a><a href="/pages/ocr-table-extraction.html">كيف يعمل OCR</a><a href="/pages/about.html">من نحن</a><a href="/pages/contact.html">اتصل بنا</a><a href="/pages/advertising.html">معلومات الإعلانات</a><a href="/legal/privacy.html">سياسة الخصوصية</a><a href="/legal/terms.html">شروط الاستخدام</a><a href="/legal/disclaimer.html">إخلاء المسؤولية</a></nav>'+
'<div class="site-footer__bottom"><span>© '+new Date().getFullYear()+' IMG2EXCEL</span><a href="mailto:info@larache.xyz">info@larache.xyz</a><span>راجع البيانات المستخرجة قبل استخدامها في قرارات مهمة.</span></div>'+
'</div></footer>';
})();