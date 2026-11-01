(function(){'use strict';
const mount=document.getElementById('site-footer');if(!mount)return;
mount.outerHTML='<footer class="site-footer"><div class="site-footer__inner">'+
'<div class="site-footer__intro"><a class="site-footer__brand" href="/" aria-label="ProTools home"><img src="/assets/images/protools-mark.svg" alt="" width="38" height="38"><span>ProTools</span></a><p>Practical browser-based tools for turning information in images into editable spreadsheet data. Convert smarter. Work faster.</p></div>'+
'<div class="site-footer__columns">'+
'<section class="site-footer__column"><h2>Workspace</h2><a href="/#main-content">Image to Excel Converter</a><a href="/pages/ocr-table-extraction.html">OCR table extraction</a><a href="/pages/ocr-accuracy-guide.html">Improve OCR accuracy</a></section>'+
'<section class="site-footer__column"><h2>Learn</h2><a href="/pages/image-to-excel-guide.html">Conversion guide</a><a href="/pages/ocr-table-extraction.html">How OCR works</a><a href="/pages/advertising.html">Advertising information</a></section>'+
'<section class="site-footer__column"><h2>Company</h2><a href="/pages/about.html">About ProTools</a><a href="/pages/contact.html">Contact support</a><a href="mailto:info@larache.xyz">info@larache.xyz</a></section>'+
'<section class="site-footer__column"><h2>Policies</h2><a href="/legal/privacy.html">Privacy policy</a><a href="/legal/terms.html">Terms of use</a><a href="/legal/disclaimer.html">Disclaimer</a><a href="#cookie-settings" id="ptCookieSettings">Cookie settings</a></section>'+
'</div><div class="site-footer__bottom"><span>© '+new Date().getFullYear()+' ProTools. All rights reserved.</span><span>Always review extracted data before using it for important decisions.</span></div></div></footer>';
})();