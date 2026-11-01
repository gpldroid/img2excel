// Google Analytics Script Loader (Entirely inside JS code)
        window.dataLayer = window.dataLayer || [];
        function gtag(){ dataLayer.push(arguments); }

        function initAnalytics() {
            const storedGAId = localStorage.getItem('app_ga_id');
            if (!storedGAId) return;

            let gaScript = document.getElementById('gaScript');
            if (!gaScript) {
                gaScript = document.createElement('script');
                gaScript.id = 'gaScript';
                gaScript.async = true;
                gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${storedGAId}`;
                document.head.appendChild(gaScript);
            } else {
                gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${storedGAId}`;
            }

            gtag('js', new Date());
            gtag('config', storedGAId, {
                send_page_view: true,
                cookie_flags: 'max-age=7200;secure;samesite=none'
            });
        }

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

            const isVertical = Math.abs(rotationAngle) === 90 || Math.abs(rotationAngle) === 270;
            const targetWidth = isVertical ? loadedImage.height : loadedImage.width;
            const targetHeight = isVertical ? loadedImage.width : loadedImage.height;

            previewCanvas.width = targetWidth;
            previewCanvas.height = targetHeight;

            document.getElementById('imgDimensionsText').innerText = `${targetWidth}x${targetHeight} px`;

            const ctx = previewCanvas.getContext('2d');
            ctx.clearRect(0, 0, targetWidth, targetHeight);

            ctx.save();
            ctx.translate(targetWidth / 2, targetHeight / 2);
            ctx.rotate((rotationAngle * Math.PI) / 180);

            const contrast = contrastSlider.value / 100;
            const brightness = brightnessSlider.value / 100;

            ctx.filter = `contrast(${contrast}) brightness(${brightness})`;
            ctx.drawImage(loadedImage, -loadedImage.width / 2, -loadedImage.height / 2);
            ctx.restore();

            if (grayscaleToggle.checked) {
                const imgData = ctx.getImageData(0, 0, previewCanvas.width, previewCanvas.height);
                const data = imgData.data;
                for (let i = 0; i < data.length; i += 4) {
                    const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                    data[i]     = avg;
                    data[i + 1] = avg;
                    data[i + 2] = avg;
                }
                ctx.putImageData(imgData, 0, 0);
            }
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

        btnProcess.addEventListener('click', async () => {
            if (!previewCanvas) return;

            btnProcess.disabled = true;
            btnProcess.classList.add('opacity-50', 'cursor-not-allowed');
            progressCard.classList.remove('hidden');

            try {
                await processTableWithTesseract();

                document.getElementById('btnToggleSplitView').classList.remove('hidden');
                saveCurrentToHistory();
                showToast("Document processed successfully.", "success", "Processing complete");

                // Send event to GA dynamically
                if (typeof gtag === 'function') {
                    gtag('event', 'document_scanned', { engine: 'tesseract' });
                }

            } catch (err) {
                console.error("Processing Error:", err);
                showToast("An error occurred while analyzing the image. Try again with improved contrast.", "error", "OCR failed");
            } finally {
                btnProcess.disabled = false;
                btnProcess.classList.remove('opacity-50', 'cursor-not-allowed');
                progressCard.classList.add('hidden');
            }
        });

        async function processTableWithTesseract() {
            const canvasData = previewCanvas.toDataURL('image/png');

            const worker = await Tesseract.createWorker('ara+eng', 1, {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        const pct = Math.round(m.progress * 100);
                        progressBar.style.width = pct + '%';
                        progressText.innerText = pct + '%';
                        statusText.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin text-cyan-500"></i> Recognizing text locally with Tesseract...`;
                        safeCreateIcons();
                    }
                }
            });

            const ret = await worker.recognize(canvasData);
            await worker.terminate();

            parseSpatialLayoutToGrid(ret.data);
        }

        function parseSpatialLayoutToGrid(ocrData) {
            const words = ocrData.words || [];

            if (words.length === 0) {
                showToast("No readable text was detected. Try a clearer image.", "error", "Notice");
                return;
            }

            const lines = [];
            const yTolerance = 18;

            words.forEach(word => {
                if (!word.text || !word.text.trim()) return;
                const centerY = (word.bbox.y0 + word.bbox.y1) / 2;
                let line = lines.find(l => Math.abs(l.centerY - centerY) < yTolerance);

                if (!line) {
                    line = { centerY, words: [] };
                    lines.push(line);
                }
                line.words.push(word);
            });

            lines.sort((a, b) => a.centerY - b.centerY);
            lines.forEach(l => l.words.sort((a, b) => a.bbox.x0 - b.bbox.x0));

            const xRanges = [];
            const xGapThreshold = 30;

            lines.forEach(l => {
                l.words.forEach(w => {
                    let range = xRanges.find(r => !(w.bbox.x1 < r.x0 - xGapThreshold || w.bbox.x0 > r.x1 + xGapThreshold));
                    if (range) {
                        range.x0 = Math.min(range.x0, w.bbox.x0);
                        range.x1 = Math.max(range.x1, w.bbox.x1);
                    } else {
                        xRanges.push({ x0: w.bbox.x0, x1: w.bbox.x1 });
                    }
                });
            });

            xRanges.sort((a, b) => a.x0 - b.x0);

            extractedGridData = lines.map(line => {
                const row = new Array(xRanges.length).fill('');
                line.words.forEach(w => {
                    const wordCenterX = (w.bbox.x0 + w.bbox.x1) / 2;
                    let colIdx = xRanges.findIndex(r => wordCenterX >= r.x0 - 15 && wordCenterX <= r.x1 + 15);
                    if (colIdx === -1) colIdx = 0;
                    row[colIdx] = (row[colIdx] + ' ' + w.text).trim();
                });
                return row;
            });

            renderTableUI();
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
