(function(){'use strict';
const mount=document.getElementById('site-footer');
if(!mount)return;
mount.outerHTML='<footer class="site-footer"><div class="site-footer__inner">'+
'<div class="site-footer__intro"><a class="site-footer__brand" href="/"><img src="/assets/images/protools-mark.svg" alt="" width="38" height="38"><span>ProTools</span></a><p>Simple, practical tools that help you turn documents into useful, editable data. Start with image-to-Excel conversion, powered by in-browser OCR.</p></div>'+
'<div class="site-footer__columns">'+
'<section class="site-footer__column"><h2>Tools</h2><a href="/#main-content">Image to Excel</a><a href="/pages/ocr-table-extraction.html">OCR table extraction</a><a href="/pages/ocr-accuracy-guide.html">OCR accuracy tips</a></section>'+
'<section class="site-footer__column"><h2>Resources</h2><a href="/pages/image-to-excel-guide.html">Image to Excel guide</a><a href="/pages/ocr-table-extraction.html">How OCR works</a><a href="/pages/advertising.html">Advertising information</a></section>'+
'<section class="site-footer__column"><h2>Company</h2><a href="/pages/about.html">About ProTools</a><a href="/pages/contact.html">Contact</a><a href="mailto:info@larache.xyz">Email support</a></section>'+
'<section class="site-footer__column"><h2>Legal</h2><a href="/legal/privacy.html">Privacy policy</a><a href="/legal/terms.html">Terms of use</a><a href="/legal/disclaimer.html">Disclaimer</a></section>'+
'</div><div class="site-footer__bottom"><span>© '+new Date().getFullYear()+' ProTools. All rights reserved.</span><span>Review extracted data before relying on it for important decisions.</span></div></div></footer>';
})();