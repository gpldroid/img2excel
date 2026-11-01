// Google Analytics Script Loader (Entirely inside JS code)
        window.dataLayer = window.dataLayer || [];
        function gtag(){ dataLayer.push(arguments); }

        function initAnalytics() {
            const consent = window.ProToolsConsent && window.ProToolsConsent.getConsent();
            if (!consent || consent.analytics !== true) return;
            if (window.ProToolsConsent && typeof window.ProToolsConsent.loadAnalytics === 'function') {
                window.ProToolsConsent.loadAnalytics(localStorage.getItem('app_ga_id') || 'G-NCECK5F16F');
            }
        }
        document.addEventListener('protools:consent-updated', initAnalytics);

        // Safe Lucide icon rendering wrapper
        function safeCreateIcons() {
            if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
                lucide.createIcons();
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            safeCreateIcons();
            initAnalytics();
        });

        // Theme System
        let currentTheme = localStorage.getItem('app-theme') || 'light';

        function applyTheme(theme) {
            currentTheme = theme;
            localStorage.setItem('app-theme', theme);
            const html = document.documentElement;
            const themeIcon = document.getElementById('themeIcon');
            const themeLabel = document.getElementById('themeLabel');

            if (theme === 'light') {
                html.classList.remove('dark');
                html.classList.add('light');
                if (themeIcon) {
                    themeIcon.className = 'fa-solid fa-moon';
                }
                if (themeLabel) themeLabel.innerText = 'Switch to dark mode';
            } else {
                html.classList.remove('light');
                html.classList.add('dark');
                if (themeIcon) {
                    themeIcon.className = 'fa-solid fa-sun';
                }
                if (themeLabel) themeLabel.innerText = 'Switch to light mode';
            }
            safeCreateIcons();
        }

        function toggleTheme() {
            applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
        }
        window.toggleTheme = toggleTheme;
        applyTheme(currentTheme);

        function openLegalModal(tab = 'about') {
            document.getElementById('legalModal').classList.remove('hidden');
            switchLegalTab(tab);
        }

        function closeLegalModal() {
            document.getElementById('legalModal').classList.add('hidden');
        }

        function switchLegalTab(tabName) {
            const tabs = ['about', 'privacy', 'terms', 'contact'];
            tabs.forEach(t => {
                const btn = document.getElementById(`tabBtn${t.charAt(0).toUpperCase() + t.slice(1)}`);
                const content = document.getElementById(`legalTab${t.charAt(0).toUpperCase() + t.slice(1)}`);
                
                if (t === tabName) {
                    btn.className = "px-4 py-2.5 rounded-t-xl transition-all border-b-2 border-cyan-500 text-cyan-600 dark:text-cyan-400 bg-slate-100 dark:bg-slate-900 font-black flex items-center gap-1.5 whitespace-nowrap shadow-xs";
                    content.classList.remove('hidden');
                } else {
                    btn.className = "px-4 py-2.5 rounded-t-xl transition-all border-b-2 border-transparent text-slate-600 dark:text-slate-400 hover:text-cyan-500 flex items-center gap-1.5 whitespace-nowrap";
                    content.classList.add('hidden');
                }
            });
            safeCreateIcons();
        }

        function handleContactSubmit(e) {
            e.preventDefault();
            const name = document.getElementById('contactName').value;
            showToast(`Thanks, ${name}! Your message has been sent. We will get back to you soon.`, "success", "Message sent");
            document.getElementById('contactForm').reset();
            setTimeout(() => {
                closeLegalModal();
            }, 1500);
        }

        function openSettingsModal() {
            document.getElementById('gaInputId').value = localStorage.getItem('app_ga_id') || '';
            document.getElementById('settingsModal').classList.remove('hidden');
        }

        function closeSettingsModal() {
            document.getElementById('settingsModal').classList.add('hidden');
        }

        function saveAnalyticsSettings() {
            const gaId = document.getElementById('gaInputId').value.trim();

            if (gaId) localStorage.setItem('app_ga_id', gaId);

            initAnalytics();
            closeSettingsModal();
            showToast("Google Analytics settings saved successfully.", "success", "Connected");
        }

        // App Core State
        // OCR language packs remain independent of the site's future en/ru/ar interface locales.
        const OCR_LANGUAGE_OPTIONS = [["eng","English"],["ara","Arabic"],["rus","Russian"],["fra","French"],["spa","Spanish"],["deu","German"],["por","Portuguese"],["ita","Italian"],["nld","Dutch"],["pol","Polish"],["ukr","Ukrainian"],["tur","Turkish"],["vie","Vietnamese"],["tha","Thai"],["jpn","Japanese"],["chi_sim","Chinese (Simplified)"],["chi_tra","Chinese (Traditional)"],["kor","Korean"],["hin","Hindi"],["ben","Bengali"],["urd","Urdu"],["fas","Persian"],["heb","Hebrew"],["ell","Greek"],["swe","Swedish"],["dan","Danish"],["nor","Norwegian"],["fin","Finnish"],["ces","Czech"],["slk","Slovak"],["slv","Slovenian"],["hrv","Croatian"],["srp","Serbian"],["srp_latn","Serbian (Latin)"],["bul","Bulgarian"],["ron","Romanian"],["hun","Hungarian"],["est","Estonian"],["lav","Latvian"],["lit","Lithuanian"],["isl","Icelandic"],["gle","Irish"],["cym","Welsh"],["eus","Basque"],["cat","Catalan"],["glg","Galician"],["afr","Afrikaans"],["amh","Amharic"],["asm","Assamese"],["aze","Azerbaijani"],["aze_cyrl","Azerbaijani (Cyrillic)"],["bel","Belarusian"],["bod","Tibetan"],["bos","Bosnian"],["bre","Breton"],["mya","Burmese"],["khm","Khmer"],["kan","Kannada"],["kat","Georgian"],["guj","Gujarati"],["ori","Odia"],["pan","Punjabi"],["tam","Tamil"],["tel","Telugu"],["mal","Malayalam"],["mar","Marathi"],["nep","Nepali"],["sin","Sinhala"],["lao","Lao"],["kaz","Kazakh"],["kir","Kyrgyz"],["uzb","Uzbek"],["uzb_cyrl","Uzbek (Cyrillic)"],["tgk","Tajik"],["tat","Tatar"],["uig","Uyghur"],["pus","Pashto"],["sqi","Albanian"],["mkd","Macedonian"],["mlt","Maltese"],["swa","Swahili"],["ind","Indonesian"],["msa","Malay"],["jav","Javanese"],["sun","Sundanese"],["fil","Filipino"],["yid","Yiddish"],["syr","Syriac"],["div","Dhivehi"],["tir","Tigrinya"],["yor","Yoruba"],["que","Quechua"],["oci","Occitan"],["fry","Frisian"],["gla","Scottish Gaelic"],["fao","Faroese"],["ltz","Luxembourgish"],["mon","Mongolian"],["mri","Maori"],["iku","Inuktitut"],["chr","Cherokee"],["hat","Haitian Creole"],["epo","Esperanto"],["lat","Latin"],["san","Sanskrit"],["grc","Ancient Greek"],["enm","Middle English"],["frm","Middle French"],["ita_old","Italian (Old)"],["spa_old","Spanish (Old)"],["equ","Mathematical / Equations"]];
        const OCR_RTL_LANGUAGES = new Set(['ara', 'fas', 'urd', 'heb', 'pus', 'syr', 'yid', 'div', 'uig']);
        let selectedOcrLanguages = ['auto'];
        let activeOcrWorker = null;
        let activeOcrWorkerLanguages = '';
        let activeOcrDetector = null;
        let detectedOcrScript = '';

        let currentEngine = 'tesseract';
        let stream = null;
        let loadedImage = null;
        let rotationAngle = 0;
        let extractedGridData = [];
        let isSplitView = false;
        let scanHistory = [];

        // DOM Selectors
        const btnStartCamera = document.getElementById('btnStartCamera');
        const videoFeed = document.getElementById('videoFeed');
        const cameraGuide = document.getElementById('cameraGuide');
        const startPrompt = document.getElementById('startPrompt');
        const previewCanvas = document.getElementById('previewCanvas');
        const rawCaptureCanvas = document.getElementById('rawCaptureCanvas');
        const fileInput = document.getElementById('fileInput');
        const ocrLanguageSelect = document.getElementById('ocrLanguageSelect');
        
        const btnCapture = document.getElementById('btnCapture');
        const btnRetake = document.getElementById('btnRetake');
        const btnProcess = document.getElementById('btnProcess');
        const filterControls = document.getElementById('filterControls');
        const imageEditToolbar = document.getElementById('imageEditToolbar');
        const captureStatus = document.getElementById('captureStatus');
        
        const contrastSlider = document.getElementById('contrastSlider');
        const brightnessSlider = document.getElementById('brightnessSlider');
        const grayscaleToggle = document.getElementById('grayscaleToggle');
        const btnResetFilters = document.getElementById('btnResetFilters');
        const docPresetSelect = document.getElementById('docPresetSelect');
        
        const progressCard = document.getElementById('progressCard');
        const statusText = document.getElementById('statusText');
        const progressText = document.getElementById('progressText');
        const progressBar = document.getElementById('progressBar');
        
        const emptyState = document.getElementById('emptyState');
        const tableActions = document.getElementById('tableActions');
        const tableAnalyticsBar = document.getElementById('tableAnalyticsBar');
        const dataTable = document.getElementById('dataTable');
        const dataTableHead = document.getElementById('dataTableHead');
        const dataTableBody = document.getElementById('dataTableBody');
        const rowCountText = document.getElementById('rowCountText');
        const colCountText = document.getElementById('colCountText');

        function showToast(message, type = 'info', title = 'Notice') {
            const toast = document.getElementById('toast');
            const toastMsg = document.getElementById('toastMsg');
            const toastTitle = document.getElementById('toastTitle');
            const toastIcon = document.getElementById('toastIcon');
            const toastIconBg = document.getElementById('toastIconBg');

            toastTitle.innerText = title;
            toastMsg.innerText = message;
            
            if (type === 'error') {
                toastIcon.setAttribute('data-lucide', 'alert-circle');
                toastIconBg.className = 'p-2 rounded-xl bg-rose-500/20 text-rose-500 border border-rose-500/30';
            } else if (type === 'success') {
                toastIcon.setAttribute('data-lucide', 'check-circle-2');
                toastIconBg.className = 'p-2 rounded-xl bg-emerald-500/20 text-emerald-500 border border-emerald-500/30';
            } else {
                toastIcon.setAttribute('data-lucide', 'info');
                toastIconBg.className = 'p-2 rounded-xl bg-indigo-500/20 text-indigo-500 border border-indigo-500/30';
            }
            safeCreateIcons();

            toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
            setTimeout(() => {
                toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
            }, 4000);
        }

        async function startCamera() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
                });
                videoFeed.srcObject = stream;
                
                startPrompt.classList.add('hidden');
                previewCanvas.classList.add('hidden');
                filterControls.classList.add('hidden');
                imageEditToolbar.classList.add('hidden');
                
                videoFeed.classList.remove('hidden');
                cameraGuide.classList.remove('hidden');
                
                btnCapture.classList.remove('hidden');
                btnRetake.classList.add('hidden');
                btnProcess.classList.add('hidden');
                
                captureStatus.innerText = 'Camera is active';
                captureStatus.className = 'text-[11px] bg-emerald-500/20 text-emerald-500 px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/30';
            } catch (err) {
                console.error("Camera Access Error:", err);
                showToast("Unable to access the camera. Check browser permissions or upload an image.", "error", "Camera error");
            }
        }

        function stopCamera() {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                stream = null;
            }
        }

        window.addEventListener('pagehide', () => {
            stopCamera();
            if (activeOcrWorker) activeOcrWorker.terminate().catch(() => {});
            if (activeOcrDetector) activeOcrDetector.terminate().catch(() => {});
        });

        btnStartCamera.addEventListener('click', startCamera);

        btnCapture.addEventListener('click', () => {
            if (!stream) return;

            rawCaptureCanvas.width = videoFeed.videoWidth;
            rawCaptureCanvas.height = videoFeed.videoHeight;
            const ctx = rawCaptureCanvas.getContext('2d');
            ctx.drawImage(videoFeed, 0, 0);

            const img = new Image();
            img.onload = () => {
                loadedImage = img;
                rotationAngle = 0;
                applyFiltersAndPreview();
            };
            img.src = rawCaptureCanvas.toDataURL('image/png');

            stopCamera();
            videoFeed.classList.add('hidden');
            cameraGuide.classList.add('hidden');
            btnCapture.classList.add('hidden');

            btnRetake.classList.remove('hidden');
            btnProcess.classList.remove('hidden');
            imageEditToolbar.classList.remove('hidden');
            previewCanvas.classList.remove('hidden');
            
            captureStatus.innerText = 'Image captured';
            captureStatus.className = 'text-[11px] bg-indigo-500/20 text-indigo-500 px-2.5 py-0.5 rounded-full font-bold border border-indigo-500/30';
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        loadedImage = img;
                        rotationAngle = 0;
                        
                        rawCaptureCanvas.width = img.width;
                        rawCaptureCanvas.height = img.height;
                        const ctx = rawCaptureCanvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);

                        applyFiltersAndPreview();

                        startPrompt.classList.add('hidden');
                        videoFeed.classList.add('hidden');
                        cameraGuide.classList.add('hidden');
                        
                        previewCanvas.classList.remove('hidden');
                        imageEditToolbar.classList.remove('hidden');
                        btnRetake.classList.remove('hidden');
                        btnProcess.classList.remove('hidden');

                        stopCamera();
                        captureStatus.innerText = 'Image prepared';
                        captureStatus.className = 'text-[11px] bg-indigo-500/20 text-indigo-500 px-2.5 py-0.5 rounded-full font-bold border border-indigo-500/30';
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });

        btnRetake.addEventListener('click', () => {
            loadedImage = null;
            filterControls.classList.add('hidden');
            imageEditToolbar.classList.add('hidden');
            btnProcess.classList.add('hidden');
            startCamera();
        });

        function rotateImage(deg) {
            rotationAngle = (rotationAngle + deg) % 360;
            applyFiltersAndPreview();
        }

        function toggleFiltersPanel() {
            filterControls.classList.toggle('hidden');
        }

        function applyFiltersAndPreview() {
            if (!loadedImage) return;

            // Cap the working canvas to avoid allocating tens of millions of pixels
            // from high-resolution phone photos. The original image remains untouched.
            const maxDimension = 2400;
            const sourceScale = Math.min(1, maxDimension / Math.max(loadedImage.width, loadedImage.height));
            const sourceWidth = Math.max(1, Math.round(loadedImage.width * sourceScale));
            const sourceHeight = Math.max(1, Math.round(loadedImage.height * sourceScale));
            const isVertical = Math.abs(rotationAngle) === 90 || Math.abs(rotationAngle) === 270;
            const targetWidth = isVertical ? sourceHeight : sourceWidth;
            const targetHeight = isVertical ? sourceWidth : sourceHeight;

            previewCanvas.width = targetWidth;
            previewCanvas.height = targetHeight;
            document.getElementById('imgDimensionsText').innerText = `${loadedImage.width}x${loadedImage.height} px · optimized to ${targetWidth}x${targetHeight}`;

            const ctx = previewCanvas.getContext('2d', { willReadFrequently: false });
            ctx.clearRect(0, 0, targetWidth, targetHeight);
            ctx.save();
            ctx.translate(targetWidth / 2, targetHeight / 2);
            ctx.rotate((rotationAngle * Math.PI) / 180);
            const contrast = contrastSlider.value / 100;
            const brightness = brightnessSlider.value / 100;
            // Apply grayscale in the canvas pipeline; do not loop over every pixel on
            // the main thread (that caused visible freezes on large images).
            ctx.filter = `grayscale(${grayscaleToggle.checked ? 1 : 0}) contrast(${contrast}) brightness(${brightness})`;
            ctx.drawImage(loadedImage, -sourceWidth / 2, -sourceHeight / 2, sourceWidth, sourceHeight);
            ctx.restore();
        }

        contrastSlider.addEventListener('input', applyFiltersAndPreview);
        brightnessSlider.addEventListener('input', applyFiltersAndPreview);
        grayscaleToggle.addEventListener('change', applyFiltersAndPreview);

        btnResetFilters.addEventListener('click', () => {
            contrastSlider.value = 125;
            brightnessSlider.value = 105;
            grayscaleToggle.checked = true;
            rotationAngle = 0;
            applyFiltersAndPreview();
        });

        function getCompressedBase64Image(maxDimension = 1400) {
            const tempCanvas = document.createElement('canvas');
            let w = previewCanvas.width;
            let h = previewCanvas.height;

            if (w > maxDimension || h > maxDimension) {
                if (w > h) {
                    h = Math.round((h * maxDimension) / w);
                    w = maxDimension;
                } else {
                    w = Math.round((w * maxDimension) / h);
                    h = maxDimension;
                }
            }

            tempCanvas.width = w;
            tempCanvas.height = h;
            const ctx = tempCanvas.getContext('2d');
            ctx.drawImage(previewCanvas, 0, 0, w, h);

            return tempCanvas.toDataURL('image/jpeg', 0.88).split(',')[1];
        }

        function initializeOcrLanguageSelector() {
            if (!ocrLanguageSelect) return;
            const autoOption = document.createElement('option');
            autoOption.value = 'auto';
            autoOption.textContent = '✨ Auto-detect language (recommended)';
            ocrLanguageSelect.appendChild(autoOption);
            OCR_LANGUAGE_OPTIONS.forEach(([code, name]) => {
                const option = document.createElement('option');
                option.value = code;
                option.textContent = name + ' (' + code + ')';
                ocrLanguageSelect.appendChild(option);
            });
            let saved = '';
            try { saved = localStorage.getItem('app_ocr_languages') || ''; } catch (error) { saved = ''; }
            // Older versions stored English as the implicit default. Upgrade that
            // implicit choice to Auto-detect; explicit non-English choices are retained.
            const savedCodes = saved.split('+').filter(code => OCR_LANGUAGE_OPTIONS.some(item => item[0] === code));
            selectedOcrLanguages = !saved || saved === 'eng' || !savedCodes.length ? ['auto'] : [...new Set(savedCodes)].slice(0, 3);
            Array.from(ocrLanguageSelect.options).forEach(option => { option.selected = selectedOcrLanguages.includes(option.value); });
            ocrLanguageSelect.addEventListener('change', () => {
                let selected = Array.from(ocrLanguageSelect.selectedOptions).map(option => option.value);
                if (selected.includes('auto')) selected = ['auto'];
                else selected = [...new Set(selected.filter(code => code !== 'auto'))].slice(0, 3);
                if (!selected.length) selected = ['auto'];
                selectedOcrLanguages = selected;
                Array.from(ocrLanguageSelect.options).forEach(option => { option.selected = selectedOcrLanguages.includes(option.value); });
                try { localStorage.setItem('app_ocr_languages', selectedOcrLanguages.join('+')); } catch (error) { /* Storage is optional. */ }
                updateOcrLanguageSummary();
            });
            updateOcrLanguageSummary();
        }

        function updateOcrLanguageSummary() {
            const summary = document.getElementById('ocrLanguageSummary');
            if (!summary) return;
            if (selectedOcrLanguages.includes('auto')) {
                summary.textContent = 'Automatic detection enabled';
                return;
            }
            const names = selectedOcrLanguages.map(code => OCR_LANGUAGE_OPTIONS.find(item => item[0] === code)?.[1] || code);
            summary.textContent = names.join(' + ') + ' selected';
        }

        initializeOcrLanguageSelector();

        btnProcess.addEventListener('click', async () => {
            if (!previewCanvas || !previewCanvas.width || !previewCanvas.height) {
                showToast('Upload or capture an image before starting OCR.', 'error', 'No image selected');
                return;
            }
            if (typeof Tesseract === 'undefined') {
                showToast('The OCR engine could not be loaded. Check your connection and reload the page.', 'error', 'OCR engine unavailable');
                return;
            }

            btnProcess.disabled = true;
            btnProcess.classList.add('opacity-50', 'cursor-not-allowed');
            progressCard.classList.remove('hidden');
            progressBar.style.width = '0%';
            progressText.innerText = '0%';
            resetTable();

            try {
                const processed = await processTableWithTesseract();
                if (!processed) return;
                document.getElementById('btnToggleSplitView').classList.remove('hidden');
                saveCurrentToHistory();
                showToast('Document processed successfully. Review the extracted cells before exporting.', 'success', 'Processing complete');
                if (typeof gtag === 'function') gtag('event', 'document_scanned', { engine: 'tesseract' });
            } catch (err) {
                console.error('Processing Error:', err);
                const detail = err && err.message ? err.message : 'Unknown OCR error';
                showToast('OCR could not complete: ' + detail + '. Check the connection for the required language data, then retry.', 'error', 'OCR failed');
            } finally {
                btnProcess.disabled = false;
                btnProcess.classList.remove('opacity-50', 'cursor-not-allowed');
                progressCard.classList.add('hidden');
            }
        });

        function updateOcrProgress(message) {
            statusText.textContent = message;
        }

        function languageForDetectedScript(script) {
            const normalized = String(script || '').toLowerCase();
            const scriptMap = [
                [/arabic/, 'ara'], [/cyrillic/, 'rus'], [/han|chinese/, 'chi_sim'],
                [/japanese|hiragana|katakana/, 'jpn'], [/korean|hangul/, 'kor'],
                [/hebrew/, 'heb'], [/greek/, 'ell'], [/devanagari/, 'hin'],
                [/bengali/, 'ben'], [/tamil/, 'tam'], [/telugu/, 'tel'],
                [/malayalam/, 'mal'], [/gujarati/, 'guj'], [/gurmukhi/, 'pan'],
                [/oriya|odia/, 'ori'], [/thai/, 'tha'], [/lao/, 'lao'],
                [/georgian/, 'kat'], [/ethiopic/, 'amh']
            ];
            const match = scriptMap.find(([pattern]) => pattern.test(normalized));
            return match ? match[1] : 'eng';
        }

        async function withOcrTimeout(promise, timeoutMs, operation) {
            let timeoutId;
            try {
                return await Promise.race([
                    promise,
                    new Promise((_, reject) => {
                        timeoutId = setTimeout(() => reject(new Error(operation + ' timed out after ' + Math.round(timeoutMs / 1000) + ' seconds')), timeoutMs);
                    })
                ]);
            } finally {
                clearTimeout(timeoutId);
            }
        }

        async function detectOcrLanguage(imageData) {
            let detectorCreation = null;
            try {
                updateOcrProgress('Preparing automatic writing-system detection…');
                progressBar.style.width = '8%';
                progressText.innerText = 'Preparing…';

                if (!activeOcrDetector) {
                    detectorCreation = Tesseract.createWorker('eng', 1, {
                        legacyCore: true,
                        legacyLang: true,
                        logger: m => {
                            if (m.status === 'loading language traineddata' || m.status === 'initializing api') {
                                updateOcrProgress('Preparing automatic language detection…');
                                progressText.innerText = 'Preparing…';
                            }
                        }
                    });
                    try {
                        activeOcrDetector = await withOcrTimeout(detectorCreation, 12000, 'Writing-system detector initialization');
                    } catch (error) {
                        // If initialization completes after the timeout, release the unused worker.
                        detectorCreation.then(worker => worker.terminate()).catch(() => {});
                        throw error;
                    }
                }

                updateOcrProgress('Analyzing document writing system…');
                progressText.innerText = 'Analyzing…';
                const result = await withOcrTimeout(activeOcrDetector.detect(imageData), 12000, 'Writing-system detection');
                const script = result && result.data && result.data.script ? result.data.script : '';
                const confidence = Number(result && result.data && result.data.script_confidence);
                const language = languageForDetectedScript(script);
                // OSD identifies the writing system, not the exact natural language.
                // Latin-script text defaults to English; users can select an exact pack below.
                return { language, script, confidence };
            } catch (error) {
                console.warn('OCR script detection unavailable; using the English + Arabic fallback.', error);
                if (activeOcrDetector) {
                    const detector = activeOcrDetector;
                    activeOcrDetector = null;
                    detector.terminate().catch(() => {});
                }
                return { language: 'eng', script: 'unknown', confidence: 0, fallbackLanguages: ['eng', 'ara'] };
            }
        }

        async function terminateOcrWorker(worker) {
            if (!worker || typeof worker.terminate !== 'function') return;
            try { await worker.terminate(); } catch (error) {
                console.warn('Unable to terminate an OCR worker cleanly.', error);
            }
        }

        async function getOcrWorker(languages) {
            const languageKey = languages.join('+');
            if (activeOcrWorker && activeOcrWorkerLanguages === languageKey) return activeOcrWorker;
            if (activeOcrWorker) {
                const previousWorker = activeOcrWorker;
                activeOcrWorker = null;
                activeOcrWorkerLanguages = '';
                await terminateOcrWorker(previousWorker);
            }

            updateOcrProgress('Starting the OCR engine for ' + languageKey.replace(/\\+/g, ' + ') + '…');
            progressBar.style.width = '12%';
            progressText.innerText = 'Loading…';

            let workerCreation;
            try {
                workerCreation = Tesseract.createWorker(languageKey, 1, {
                    logger: m => {
                        if (m.status === 'loading language traineddata' || m.status === 'initializing api' || m.status === 'loading tesseract core') {
                            updateOcrProgress('Loading ' + languageKey.replace(/\\+/g, ' + ') + ' OCR resources…');
                            progressBar.style.width = '12%';
                            progressText.innerText = 'Loading…';
                        }
                        if (m.status === 'recognizing text') {
                            const pct = Math.max(0, Math.min(99, Math.round(m.progress * 100)));
                            progressBar.style.width = pct + '%';
                            progressText.innerText = pct + '%';
                            updateOcrProgress('Recognizing text locally… ' + pct + '%');
                        }
                    }
                });

                try {
                    activeOcrWorker = await withOcrTimeout(workerCreation, 90000, 'OCR engine initialization');
                    activeOcrWorkerLanguages = languageKey;
                    return activeOcrWorker;
                } catch (error) {
                    workerCreation.then(worker => terminateOcrWorker(worker)).catch(() => {});
                    throw error;
                }
            } catch (error) {
                activeOcrWorker = null;
                activeOcrWorkerLanguages = '';
                throw error;
            }
        }

        async function processTableWithTesseract() {
            const canvasData = previewCanvas.toDataURL('image/png');
            let languages;
            if (selectedOcrLanguages.includes('auto')) {
                updateOcrProgress('Detecting the document writing system…');
                const detected = await detectOcrLanguage(canvasData);
                detectedOcrScript = detected.script || '';
                languages = detected.fallbackLanguages || [detected.language];
                const detectedName = detected.fallbackLanguages ? 'English + Arabic fallback' : (OCR_LANGUAGE_OPTIONS.find(item => item[0] === detected.language)?.[1] || 'English');
                updateOcrProgress((detected.fallbackLanguages ? 'Automatic detection unavailable · ' : 'Detected ' + (detected.script || 'unknown') + ' script · ') + 'using ' + detectedName + ' OCR…');
                progressBar.style.width = '12%';
                progressText.innerText = 'Loading…';
                const summary = document.getElementById('ocrLanguageSummary');
                if (summary) summary.textContent = 'Detected: ' + detectedName;
            } else {
                languages = selectedOcrLanguages.filter(code => OCR_LANGUAGE_OPTIONS.some(item => item[0] === code)).slice(0, 3);
            }
            if (!languages.length) languages = ['eng'];
            const worker = await getOcrWorker(languages);
            updateOcrProgress('Recognizing text locally…');
            progressBar.style.width = '15%';
            progressText.innerText = 'Starting…';

            let recognition;
            try {
                recognition = await withOcrTimeout(worker.recognize(canvasData, {}, { blocks: true }), 120000, 'Text recognition');
            } catch (error) {
                if (activeOcrWorker === worker) {
                    activeOcrWorker = null;
                    activeOcrWorkerLanguages = '';
                }
                await terminateOcrWorker(worker);
                throw error;
            }
            progressBar.style.width = '100%';
            progressText.innerText = '100%';
            updateOcrProgress('Text recognition complete. Preparing the editable table…');
            return parseSpatialLayoutToGrid(recognition.data);
        }

        function parseSpatialLayoutToGrid(ocrData) {
            const blockWords = (ocrData.blocks || []).flatMap(block => (block.paragraphs || []).flatMap(paragraph => (paragraph.lines || []).flatMap(line => line.words || [])));
            const words = (ocrData.words && ocrData.words.length ? ocrData.words : blockWords).filter(word => word && word.text && word.text.trim() && word.bbox);
            if (!words.length) {
                const fallbackLines = (ocrData.lines || []).map(line => String(line.text || '').trim()).filter(Boolean);
                if (!fallbackLines.length) {
                    showToast('No readable text was detected. Try a sharper image, better lighting, or a higher contrast setting.', 'error', 'No text detected');
                    return false;
                }
                extractedGridData = fallbackLines.map(line => [line]);
                renderTableUI();
                return true;
            }

            const heights = words.map(word => Math.max(1, word.bbox.y1 - word.bbox.y0)).sort((a, b) => a - b);
            const medianHeight = heights[Math.floor(heights.length / 2)] || 16;
            const rowTolerance = Math.max(8, medianHeight * 0.65);
            const rows = [];
            words.sort((a, b) => ((a.bbox.y0 + a.bbox.y1) / 2) - ((b.bbox.y0 + b.bbox.y1) / 2) || a.bbox.x0 - b.bbox.x0);
            words.forEach(word => {
                const centerY = (word.bbox.y0 + word.bbox.y1) / 2;
                let row = rows.find(item => Math.abs(item.centerY - centerY) <= rowTolerance);
                if (!row) {
                    row = { centerY, words: [] };
                    rows.push(row);
                }
                row.words.push(word);
                row.centerY = row.words.reduce((sum, item) => sum + (item.bbox.y0 + item.bbox.y1) / 2, 0) / row.words.length;
            });
            rows.sort((a, b) => a.centerY - b.centerY);

            const isRightToLeft = selectedOcrLanguages.includes('ara') ||
                selectedOcrLanguages.some(code => OCR_RTL_LANGUAGES.has(code)) ||
                (selectedOcrLanguages.includes('auto') && /arabic|hebrew/i.test(String(detectedOcrScript || ocrData.script || '')));
            const cellGap = Math.max(18, medianHeight * 1.35);
            const rowCells = rows.map(row => {
                const ordered = row.words.slice().sort((a, b) => isRightToLeft ? b.bbox.x1 - a.bbox.x1 : a.bbox.x0 - b.bbox.x0);
                const cells = [];
                ordered.forEach(word => {
                    const previous = cells[cells.length - 1];
                    const gap = previous
                        ? (isRightToLeft ? previous.edge - word.bbox.x1 : word.bbox.x0 - previous.edge)
                        : Infinity;
                    if (!previous || gap > cellGap) {
                        cells.push({ text: word.text.trim(), edge: isRightToLeft ? word.bbox.x0 : word.bbox.x1, x0: word.bbox.x0, x1: word.bbox.x1 });
                    } else {
                        previous.text += ' ' + word.text.trim();
                        previous.edge = isRightToLeft ? word.bbox.x0 : word.bbox.x1;
                        previous.x0 = Math.min(previous.x0, word.bbox.x0);
                        previous.x1 = Math.max(previous.x1, word.bbox.x1);
                    }
                });
                return cells;
            }).filter(cells => cells.length);

            if (!rowCells.length) return false;
            const anchors = rowCells.flatMap(cells => cells.map(cell => isRightToLeft ? cell.x1 : cell.x0)).sort((a, b) => a - b);
            const anchorTolerance = Math.max(24, medianHeight * 2.2, previewCanvas.width * 0.012);
            const columns = [];
            anchors.forEach(anchor => {
                let column = columns.find(item => Math.abs(item.center - anchor) <= anchorTolerance);
                if (!column) {
                    column = { center: anchor, count: 0, total: 0 };
                    columns.push(column);
                }
                column.total += anchor;
                column.count++;
                column.center = column.total / column.count;
            });
            columns.sort((a, b) => isRightToLeft ? b.center - a.center : a.center - b.center);

            extractedGridData = rowCells.map(cells => {
                const row = new Array(columns.length).fill('');
                cells.forEach(cell => {
                    const anchor = isRightToLeft ? cell.x1 : cell.x0;
                    let index = 0, bestDistance = Infinity;
                    columns.forEach((column, columnIndex) => {
                        const distance = Math.abs(column.center - anchor);
                        if (distance < bestDistance) { bestDistance = distance; index = columnIndex; }
                    });
                    row[index] = row[index] ? row[index] + ' ' + cell.text : cell.text;
                });
                return row;
            });
            renderTableUI();
            return true;
        }

                function renderTableUI() {
            if (extractedGridData.length === 0) return resetTable();

            emptyState.classList.add('hidden');
            dataTable.classList.remove('hidden');
            tableActions.classList.remove('hidden');
            tableAnalyticsBar.classList.remove('hidden');

            dataTableHead.innerHTML = '';
            dataTableBody.innerHTML = '';

            const numCols = extractedGridData[0].length;

            // Header Row
            const trHead = document.createElement('tr');
            
            const thIndex = document.createElement('th');
            thIndex.className = 'p-3 border-b border-l w-10 text-center font-mono text-xs';
            thIndex.innerText = '#';
            trHead.appendChild(thIndex);

            for (let c = 0; c < numCols; c++) {
                const th = document.createElement('th');
                th.className = 'p-2.5 border-b border-l font-bold min-w-[120px] relative group';
                th.innerHTML = `
                    <div class="flex items-center justify-between px-1">
                        <span class="text-cyan-500 font-extrabold">Column ${c + 1}</span>
                        <button onclick="deleteColumn(${c})" class="text-rose-500 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity p-0.5" title="Delete column">
                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                        </button>
                    </div>
                `;
                trHead.appendChild(th);
            }
            dataTableHead.appendChild(trHead);

            // Data Rows
            extractedGridData.forEach((row, rIdx) => {
                const tr = document.createElement('tr');
                tr.className = 'hover:bg-indigo-500/10 transition-colors group data-row';

                const tdIndex = document.createElement('td');
                tdIndex.className = 'p-2 border-b border-l text-center text-xs font-mono font-medium';
                tdIndex.innerHTML = `
                    <span class="group-hover:hidden">${rIdx + 1}</span>
                    <button onclick="deleteRow(${rIdx})" class="hidden group-hover:inline-flex text-rose-500 hover:text-rose-600" title="Delete row">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                `;
                tr.appendChild(tdIndex);

                row.forEach((cellVal, cIdx) => {
                    const td = document.createElement('td');
                    td.className = 'p-0 border-b border-l';

                    const input = document.createElement('input');
                    input.type = 'text';
                    input.value = cellVal;
                    input.className = 'editable-cell-input w-full h-full py-2 px-2.5 outline-none focus:bg-indigo-500/10 focus:ring-1 focus:ring-cyan-500 text-xs font-medium transition-all';
                    input.oninput = (e) => {
                        extractedGridData[rIdx][cIdx] = e.target.value;
                        calculateTableStats();
                    };

                    td.appendChild(input);
                    tr.appendChild(td);
                });

                dataTableBody.appendChild(tr);
            });

            rowCountText.innerText = `Rows: ${extractedGridData.length}`;
            colCountText.innerText = `Columns: ${numCols}`;
            calculateTableStats();
            safeCreateIcons();
        }

        function cleanAndNormalizeNumbers() {
            if (extractedGridData.length === 0) return;

            const arabicDigits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
            
            for (let r = 0; r < extractedGridData.length; r++) {
                for (let c = 0; c < extractedGridData[r].length; c++) {
                    let str = extractedGridData[r][c];
                    if (str) {
                        for (let i = 0; i < 10; i++) {
                            str = str.replace(new RegExp(arabicDigits[i], 'g'), i);
                        }
                        extractedGridData[r][c] = str.trim();
                    }
                }
            }
            renderTableUI();
            showToast("All digits were converted to standard Western digits.", "success", "Normalize digits");
        }

        function cleanEmptyRowsCols() {
            if (extractedGridData.length === 0) return;

            extractedGridData = extractedGridData.filter(row => row.some(cell => cell && cell.toString().trim() !== ''));

            if (extractedGridData.length > 0) {
                const colCount = extractedGridData[0].length;
                const emptyCols = [];

                for (let c = 0; c < colCount; c++) {
                    const isEmpty = extractedGridData.every(row => !row[c] || row[c].toString().trim() === '');
                    if (isEmpty) emptyCols.push(c);
                }

                for (let i = emptyCols.length - 1; i >= 0; i--) {
                    const colIdx = emptyCols[i];
                    extractedGridData.forEach(row => row.splice(colIdx, 1));
                }
            }

            renderTableUI();
            showToast("Empty rows and columns were removed.", "success", "Table cleaned");
        }

        function calculateTableStats() {
            let totalSum = 0;
            let numericCount = 0;
            let totalCells = 0;

            extractedGridData.forEach(row => {
                row.forEach(val => {
                    totalCells++;
                    const cleaned = (val || '').toString().replace(/,/g, '');
                    const num = parseFloat(cleaned);
                    if (!isNaN(num)) {
                        totalSum += num;
                        numericCount++;
                    }
                });
            });

            document.getElementById('statSum').innerText = `Sum: ${totalSum.toLocaleString('en-US')}`;
            document.getElementById('statAvg').innerText = `Average: ${(numericCount ? (totalSum / numericCount) : 0).toFixed(2)}`;
            document.getElementById('statCount').innerText = `Cells: ${totalCells}`;
        }

        function filterTableRows() {
            const query = document.getElementById('tableSearchInput').value.toLowerCase();
            const rows = document.querySelectorAll('.data-row');

            rows.forEach((row, idx) => {
                const text = (extractedGridData[idx] || []).join(' ').toLowerCase();
                if (text.includes(query)) {
                    row.classList.remove('hidden');
                } else {
                    row.classList.add('hidden');
                }
            });
        }

        function resetTable() {
            extractedGridData = [];
            dataTable.classList.add('hidden');
            tableActions.classList.add('hidden');
            tableAnalyticsBar.classList.add('hidden');
            emptyState.classList.remove('hidden');
            rowCountText.innerText = 'Rows: 0';
            colCountText.innerText = 'Columns: 0';
        }

        document.getElementById('btnAddRow').addEventListener('click', () => {
            if (extractedGridData.length === 0) {
                extractedGridData = [['', '']];
            } else {
                extractedGridData.push(new Array(extractedGridData[0].length).fill(''));
            }
            renderTableUI();
        });

        document.getElementById('btnAddCol').addEventListener('click', () => {
            if (extractedGridData.length === 0) {
                extractedGridData = [['']];
            } else {
                extractedGridData.forEach(row => row.push(''));
            }
            renderTableUI();
        });

        window.deleteRow = (rIdx) => {
            extractedGridData.splice(rIdx, 1);
            if (extractedGridData.length === 0) resetTable();
            else renderTableUI();
        };

        window.deleteColumn = (cIdx) => {
            if (extractedGridData[0].length <= 1) {
                showToast("The last remaining column cannot be deleted.", "error", "Notice");
                return;
            }
            extractedGridData.forEach(row => row.splice(cIdx, 1));
            renderTableUI();
        };

        function toggleSplitView() {
            isSplitView = !isSplitView;
            const leftColumn = document.getElementById('leftColumn');
            const rightColumn = document.getElementById('rightColumn');
            const btnText = document.getElementById('splitViewBtnText');

            if (isSplitView) {
                leftColumn.className = "lg:col-span-6 flex flex-col gap-4 transition-all duration-300";
                rightColumn.className = "lg:col-span-6 flex flex-col transition-all duration-300";
                btnText.innerText = "Close comparison";
            } else {
                leftColumn.className = "lg:col-span-5 flex flex-col gap-4 transition-all duration-300";
                rightColumn.className = "lg:col-span-7 flex flex-col transition-all duration-300";
                btnText.innerText = "Side-by-side comparison";
            }
        }

        function saveCurrentToHistory() {
            if (extractedGridData.length === 0) return;
            const item = {
                id: Date.now(),
                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                data: JSON.parse(JSON.stringify(extractedGridData)),
                rows: extractedGridData.length,
                cols: extractedGridData[0].length
            };
            scanHistory.unshift(item);
            updateHistoryUI();
        }

        function updateHistoryUI() {
            const historyList = document.getElementById('historyList');
            document.getElementById('historyCount').innerText = scanHistory.length;

            if (scanHistory.length === 0) {
                historyList.innerHTML = `<p class="text-slate-500 text-center py-8">No saved scans yet</p>`;
                return;
            }

            historyList.innerHTML = scanHistory.map(item => `
                <div onclick="loadFromHistory(${item.id})" class="p-3 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700/50 cursor-pointer transition-all flex items-center justify-between group">
                    <div>
                        <span class="font-bold text-slate-800 dark:text-slate-200 block text-xs">Table scan (${item.rows} × ${item.cols})</span>
                        <span class="text-[10px] text-slate-500 font-mono">${item.timestamp}</span>
                    </div>
                    <i data-lucide="chevron-left" class="w-4 h-4 text-cyan-500 group-hover:-translate-x-1 transition-transform"></i>
                </div>
            `).join('');
            safeCreateIcons();
        }

        function loadFromHistory(id) {
            const found = scanHistory.find(h => h.id === id);
            if (found) {
                extractedGridData = JSON.parse(JSON.stringify(found.data));
                renderTableUI();
                toggleHistoryDrawer();
                showToast("The selected table was restored from history.", "info", "Restored from history");
            }
        }

        function clearHistory() {
            scanHistory = [];
            updateHistoryUI();
            showToast("Scan history cleared.", "info", "History cleared");
        }

        function toggleHistoryDrawer() {
            const drawer = document.getElementById('historyDrawer');
            drawer.classList.toggle('-translate-x-full');
        }

        function copyTableToClipboard() {
            if (extractedGridData.length === 0) return;

            const tsvContent = extractedGridData.map(row => row.join('\t')).join('\n');
            
            const textarea = document.createElement('textarea');
            textarea.value = tsvContent;
            document.body.appendChild(textarea);
            textarea.select();
            
            try {
                document.execCommand('copy');
                showToast("Table data copied. You can paste it into Excel or Google Sheets.", "success", "Copied");
            } catch (err) {
                showToast("Automatic copy failed.", "error", "Error");
            } finally {
                document.body.removeChild(textarea);
            }
        }

        document.getElementById('btnExportExcel').addEventListener('click', () => {
            if (extractedGridData.length === 0) return;
            if (typeof XLSX === 'undefined') {
                showToast('The Excel export library did not load. Reload the page and try again.', 'error', 'Export unavailable');
                return;
            }

            const ws = XLSX.utils.aoa_to_sheet(extractedGridData);
            if (!ws['!dir']) ws['!dir'] = 'rtl';

            const colWidths = extractedGridData[0].map((_, cIdx) => {
                const maxLen = extractedGridData.reduce((acc, row) => Math.max(acc, (row[cIdx] || '').toString().length), 10);
                return { wch: Math.min(maxLen + 8, 50) };
            });
            ws['!cols'] = colWidths;

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Extracted data");

            const fileName = `protools-table_${new Date().toISOString().slice(0,10)}.xlsx`;
            XLSX.writeFile(wb, fileName);

            showToast("The formatted Excel file was exported successfully.", "success", "Export complete");

            // Event to GA
            if (typeof gtag === 'function') {
                gtag('event', 'excel_exported', { rows: extractedGridData.length });
            }
        });
