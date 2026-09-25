/* INTERPIXAL app.js — semua interaksi (drawer, filter, modal, slider, form dummy, pengurus) */
// ---------- Helpers ----------
        const $ = (s, c=document) => c.querySelector(s);
        const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));
        let lastFocus = null;
        function showToast(msg){
            const t = $('#toast');
            if(!t) return;
            t.textContent = msg;
            t.classList.remove('hidden');
            clearTimeout(t._h);
            t._h = setTimeout(()=> t.classList.add('hidden'), 2600);
        }
        function openModal(modal){
            if(!modal) return;
            lastFocus = document.activeElement;
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            modal.setAttribute('aria-hidden','false');
            document.body.style.overflow = 'hidden';
            const btn = modal.querySelector('button');
            if(btn) btn.focus({preventScroll:true});
        }
        function refreshIcons(){ if(window.lucide && window.lucide.createIcons) window.lucide.createIcons(); }
        function closeModal(modal){
            if(!modal) return;
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            modal.setAttribute('aria-hidden','true');
            document.body.style.overflow = '';
            if(lastFocus && lastFocus.focus) lastFocus.focus({preventScroll:true});
        }

        // ---------- Year ----------
        $$('#year').forEach(el => { el.textContent = new Date().getFullYear(); });

        // ---------- Mobile Drawer ----------
        const mobileToggle = $('#mobile-toggle');
        const mobileDrawer = $('#mobile-drawer');
        function setDrawerIcon(open){
            if(!mobileToggle) return;
            mobileToggle.innerHTML = `<i data-lucide="${open ? 'x' : 'menu'}" class="w-6 h-6" aria-hidden="true"></i>`;
            refreshIcons();
        }
        function setDrawer(open){
            if(!mobileDrawer || !mobileToggle) return;
            mobileDrawer.classList.toggle('hidden', !open);
            mobileToggle.setAttribute('aria-expanded', String(open));
            mobileToggle.setAttribute('aria-label', open ? 'Tutup menu navigasi' : 'Buka menu navigasi');
            setDrawerIcon(open);
        }
        if(mobileToggle && mobileDrawer){
            mobileToggle.addEventListener('click', () => setDrawer(mobileDrawer.classList.contains('hidden')));
            $$('.mobile-link').forEach(link => link.addEventListener('click', () => setDrawer(false)));
        }

        // ---------- Reveal on scroll ----------
        const io = new IntersectionObserver((entries)=>{
            entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('revealed'); io.unobserve(e.target);} });
        }, {threshold: .12});
        $$('.reveal').forEach(el=> io.observe(el));

        // ---------- Active nav ----------
        const navLinks = $$('[data-nav]');
        if(navLinks.length){
            const secIO = new IntersectionObserver((entries)=>{
                entries.forEach(e=>{
                    if(e.isIntersecting){
                        navLinks.forEach(a=> a.classList.toggle('active', a.dataset.nav === e.target.id));
                    }
                });
            }, {rootMargin: '-40% 0px -55% 0px'});
            ['hero','tentang','dual-logo','sebaran','agenda','galeri','pengurus'].forEach(id=>{
                const s = document.getElementById(id);
                if(s) secIO.observe(s);
            });
        }

        // ---------- Count-up ----------
        const countEls = $$('[data-count]');
        if(countEls.length){
            const countIO = new IntersectionObserver((entries)=>{
                entries.forEach(e=>{
                    if(!e.isIntersecting) return;
                    const el = e.target;
                    const target = parseInt(el.dataset.count, 10);
                    if(isNaN(target)) return;
                    const dur = 1200; const start = performance.now();
                    function tick(now){
                        const p = Math.min((now-start)/dur, 1);
                        el.textContent = Math.floor(target * (0.2 + 0.8*p*p));
                        if(p<1) requestAnimationFrame(tick);
                        else el.textContent = target;
                    }
                    requestAnimationFrame(tick);
                    countIO.unobserve(el);
                });
            }, {threshold:.5});
            countEls.forEach(el=> countIO.observe(el));
        }

        // ---------- Region Filtering ----------
        const tabBtns = $$('#region-tabs .tab-btn');
        const regionCards = $$('.region-item');
        const regionEmpty = $('#region-empty');
        function styleTabs(active){
            tabBtns.forEach(b=>{
                const on = b===active;
                b.setAttribute('aria-selected', String(on));
                b.classList.toggle('bg-choco-dark', on);
                b.classList.toggle('text-gold-imperial', on);
                b.classList.toggle('border-gold-imperial/40', on);
                b.classList.toggle('shadow-md', on);
                b.classList.toggle('bg-cream-bg', !on);
                b.classList.toggle('text-choco-dark', !on);
                b.classList.toggle('border-sand-light', !on);
            });
        }
        if(tabBtns.length){
            tabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    styleTabs(btn);
                    const filter = btn.dataset.filter;
                    let shown = 0;
                    regionCards.forEach(card => {
                        const show = filter==='all' || card.dataset.region===filter;
                        card.classList.toggle('hidden', !show);
                        if(show) shown++;
                    });
                    if(regionEmpty) regionEmpty.classList.toggle('hidden', shown>0);
                });
            });
        }

        // ---------- Gallery Filtering ----------
        const gBtns = $$('.gfilter-btn');
        const gItems = $$('#gallery-grid .gallery-item');
        function styleGBtns(active){
            gBtns.forEach(b=>{
                const on = b===active;
                b.classList.toggle('bg-choco-dark', on);
                b.classList.toggle('text-gold-imperial', on);
                b.classList.toggle('bg-cream-bg', !on);
            });
        }
        if(gBtns.length){
            gBtns.forEach(btn=>{
                btn.addEventListener('click', ()=>{
                    styleGBtns(btn);
                    const f = btn.dataset.gfilter;
                    gItems.forEach(it=>{
                        const show = f==='all' || it.dataset.gcat===f;
                        it.classList.toggle('hidden', !show);
                    });
                });
            });
        }

        // ---------- Lightbox ----------
        const lightbox = $('#lightbox-modal');
        function openLightbox(imgSrc, title, desc) {
            const img = $('#lightbox-img');
            if(img) img.src = imgSrc;
            const t = $('#lightbox-title');
            if(t) t.textContent = title;
            const d = $('#lightbox-desc');
            if(d) d.textContent = desc;
            openModal(lightbox);
        }
        function closeLightbox() { closeModal(lightbox); }
        // expose for legacy inline onclick compatibility
        window.openLightbox = openLightbox;
        window.closeLightbox = closeLightbox;
        $$('[data-lightbox-src]').forEach(btn=>{
            btn.addEventListener('click', ()=> openLightbox(btn.dataset.lightboxSrc, btn.dataset.lightboxTitle||'Preview Dummy', btn.dataset.lightboxDesc||''));
        });
        $$('[data-close-lightbox]').forEach(b=> b.addEventListener('click', closeLightbox));
        if(lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

        // ---------- Logo Detail Modal ----------
        const logoModal = $('#logo-modal');
        function openLogoDetail(type) {
            const container = $('#logo-modal-content');
            if(!container) return;
            if (type === 'general') {
                container.innerHTML = `
                    <div class="text-center mb-6" id="logo-modal-title">
                        <div class="w-16 h-16 mx-auto rounded-xl bg-choco-dark text-gold-imperial flex items-center justify-center text-3xl mb-3 shadow-lg"><i data-lucide="earth" aria-hidden="true"></i></div>
                        <span class="px-2.5 py-0.5 rounded bg-choco-dark text-gold-imperial font-mono text-[10px] font-bold">KODE MARHALAH 698 • DUMMY</span>
                        <h3 class="font-cinzel font-bold text-2xl text-choco-dark mt-2">Logo General Integrated 2024</h3>
                        <p class="text-xs text-choco-medium">The Centennial Hijri of Gontor (1345 H – 1445 H) — teks dummy</p>
                    </div>
                    <div class="space-y-4 text-xs text-choco-medium leading-relaxed border-t border-sand-light pt-4">
                        <p><strong class="text-choco-dark font-bold">1. Globe & Syahadat (Dummy):</strong> Komitmen memancarkan nilai keislaman ke penjuru benua contoh.</p>
                        <p><strong class="text-choco-dark font-bold">2. Octagram (Dummy):</strong> Simetri kepribadian utuh contoh.</p>
                        <p><strong class="text-choco-dark font-bold">3. Pita Centennial (Dummy):</strong> Angkatan penutup abad pertama contoh.</p>
                        <p><strong class="text-choco-dark font-bold">4. Emas & Coklat (Dummy):</strong> Kemuliaan dan persaudaraan contoh.</p>
                        <p class="bg-cream-bg border border-dashed border-sand-light rounded-lg p-3">Ganti dengan file <code>assets/logo-general.png</code> + filosofi resmi saat data real masuk.</p>
                    </div>`;
            } else {
                container.innerHTML = `
                    <div class="text-center mb-6" id="logo-modal-title">
                        <div class="w-16 h-16 mx-auto rounded-xl bg-red-maroon text-gold-light flex items-center justify-center text-3xl mb-3 shadow-lg"><i data-lucide="shield-half" aria-hidden="true"></i></div>
                        <span class="px-2.5 py-0.5 rounded bg-red-maroon text-gold-light font-mono text-[10px] font-bold">KONSULAT PLAT G • DUMMY</span>
                        <h3 class="font-cinzel font-bold text-2xl text-choco-dark mt-2">Logo Konsulat Pekalongan 2024</h3>
                        <p class="text-xs text-choco-medium">Pekalongan, Batang, Pemalang, Tegal, Brebes — teks dummy</p>
                    </div>
                    <div class="space-y-4 text-xs text-choco-medium leading-relaxed border-t border-sand-light pt-4">
                        <p><strong class="text-choco-dark font-bold">1. Batik (Dummy):</strong> Kebanggaan warisan lokal contoh.</p>
                        <p><strong class="text-choco-dark font-bold">2. Perisai Lima (Dummy):</strong> 5 wilayah dalam ukhuwah contoh.</p>
                        <p><strong class="text-choco-dark font-bold">3. Menara (Dummy):</strong> Pegangan tauhid contoh.</p>
                        <p><strong class="text-choco-dark font-bold">4. Maroon-Emas (Dummy):</strong> Wibawa dan keberanian contoh.</p>
                        <p class="bg-cream-bg border border-dashed border-sand-light rounded-lg p-3">Ganti dengan file <code>assets/logo-konsulat.png</code> + filosofi resmi saat data real masuk.</p>
                    </div>`;
            }
            openModal(logoModal);
            refreshIcons();
        }
        function closeLogoModal() { closeModal(logoModal); }
        window.openLogoDetail = openLogoDetail;
        window.closeLogoModal = closeLogoModal;
        $$('[data-logo-detail]').forEach(b=> b.addEventListener('click', ()=> openLogoDetail(b.dataset.logoDetail)));
        $$('[data-close-logo]').forEach(b=> b.addEventListener('click', closeLogoModal));
        if(logoModal) logoModal.addEventListener('click', (e) => { if (e.target === logoModal) closeLogoModal(); });

        // ---------- Members dummy ----------
        const membersModal = $('#members-modal');
        const dummyMembers = {
            pekalongan: {title:'Pekalongan — 35 Alumni (Dummy)', names:['Dummy Ahmad Pekalongan 1','Dummy Ahmad Pekalongan 2','Dummy Siti Pekalongan 3','Dummy Bilal Pekalongan 4','Dummy Fulan Pekalongan 5 + 30 lainnya...']},
            batang: {title:'Batang — 22 Alumni (Dummy)', names:['Dummy Batang 1','Dummy Batang 2','Dummy Batang 3','Dummy Batang 4','Dummy Batang 5 + 17 lainnya...']},
            pemalang: {title:'Pemalang — 28 Alumni (Dummy)', names:['Dummy Pemalang 1','Dummy Pemalang 2','Dummy Pemalang 3','Dummy Pemalang 4','Dummy Pemalang 5 + 23 lainnya...']},
            tegal: {title:'Tegal — 32 Alumni (Dummy)', names:['Dummy Tegal 1','Dummy Tegal 2','Dummy Tegal 3','Dummy Tegal 4','Dummy Tegal 5 + 27 lainnya...']},
            brebes: {title:'Brebes — 25 Alumni (Dummy)', names:['Dummy Brebes 1','Dummy Brebes 2','Dummy Brebes 3','Dummy Brebes 4','Dummy Brebes 5 + 20 lainnya...']},
            perantauan: {title:'Perantauan — 12 Alumni (Dummy)', names:['Dummy Rantau Jakarta 1','Dummy Rantau Jogja 2','Dummy Rantau Surabaya 3','Dummy Rantau Bandung 4','Dummy Rantau 5 + 7 lainnya...']},
        };
        $$('[data-members]').forEach(b=> b.addEventListener('click', ()=>{
            if(!membersModal) return;
            const d = dummyMembers[b.dataset.members];
            if(!d) return;
            $('#members-title').textContent = d.title;
            $('#members-list').innerHTML = d.names.map((n,i)=> `<li class="flex items-center gap-3 bg-cream-bg border border-sand-light rounded-lg px-3 py-2"><span class="w-8 h-8 rounded-full bg-choco-dark text-gold-imperial flex items-center justify-center text-xs font-bold">${i+1}</span><span>${n}</span></li>`).join('');
            openModal(membersModal);
            refreshIcons();
        }));
        $$('[data-close-members]').forEach(b=> b.addEventListener('click', ()=> closeModal(membersModal)));
        if(membersModal) membersModal.addEventListener('click', e=>{ if(e.target===membersModal) closeModal(membersModal); });

        // ---------- Dummy download ----------
        $$('[data-dummy-download]').forEach(b=> b.addEventListener('click', ()=> showToast('Dummy: "' + b.dataset.dummyDownload + '" belum ada file asli.')));

        // ---------- Testimoni slider ----------
        const track = $('#testi-track');
        const dots = $('#testi-dots');
        const testiPrev = $('#testi-prev');
        const testiNext = $('#testi-next');
        if(track && dots && testiPrev && testiNext){
            let idx = 0; const total = track.children.length || 3;
            function renderTesti(){
                track.style.transform = `translateX(-${idx*100}%)`;
                dots.textContent = `${idx+1} / ${total} • Dummy`;
            }
            testiPrev.addEventListener('click', ()=>{ idx = (idx-1+total)%total; renderTesti(); });
            testiNext.addEventListener('click', ()=>{ idx = (idx+1)%total; renderTesti(); });
            renderTesti();
        }

        // ---------- Form dummy ----------
        const dummyForm = $('#dummy-form');
        if(dummyForm){
            dummyForm.addEventListener('submit', (e)=>{
                e.preventDefault();
                const namaEl = $('#f-nama');
                const nama = namaEl ? namaEl.value.trim() : '';
                if(!nama){ showToast('Dummy: isi nama dulu ya.'); if(namaEl) namaEl.focus(); return; }
                showToast(`Dummy terkirim! Terima kasih ${nama} (simulasi, tidak tersimpan).`);
                e.target.reset();
            });
        }

        // ---------- ESC global ----------
        document.addEventListener('keydown', (e)=>{
            if(e.key !== 'Escape') return;
            [lightbox, logoModal, membersModal].forEach(m=>{
                if(m && !m.classList.contains('hidden')) closeModal(m);
            });
            setDrawer(false);
        });

        // ---------- Back to top ----------
        const toTop = $('#to-top');
        if(toTop){
            window.addEventListener('scroll', ()=>{
                const show = window.scrollY > 600;
                toTop.classList.toggle('hidden', !show);
                toTop.classList.toggle('flex', show);
            }, {passive:true});
            toTop.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));
        }

        // ---------- Pengurus: render pimpinan teaser + grid + filter ----------
        function igUrl(handle){
            if(!handle) return '#';
            return 'https://instagram.com/' + String(handle).replace(/^@/, '');
        }
        function pimpinanCard(p, large){
            const imgCls = large ? 'w-36 h-36 sm:w-44 sm:h-44' : 'w-28 h-28';
            const badge = p.jabatan === 'ketua'
                ? '<span class="px-3 py-1 rounded-full bg-choco-dark text-gold-imperial text-[10px] font-bold uppercase tracking-wider">Ketua Umum</span>'
                : '<span class="px-3 py-1 rounded-full bg-red-maroon text-gold-light text-[10px] font-bold uppercase tracking-wider">Wakil Ketua Umum</span>';
            return `
            <div class="bg-cream-bg rounded-2xl border border-sand-light gold-border-glow shadow-royal p-6 text-center flex flex-col items-center">
                <img src="${p.foto}" alt="Foto ${p.nama}" width="400" height="400" loading="lazy" decoding="async" class="${imgCls} rounded-full object-cover border-4 border-gold-imperial shadow-lg mb-4">
                <h3 class="font-cinzel font-bold text-xl text-choco-dark">${p.nama}</h3>
                <div class="mt-2 mb-2">${badge}</div>
                <div class="flex flex-wrap justify-center gap-2 mb-3">
                    <span class="px-3 py-1 rounded-full bg-cream-soft text-choco-dark text-[10px] font-bold uppercase tracking-wider"><i data-lucide="map-pin" class="mr-1" aria-hidden="true"></i>${p.daerahLabel}</span>
                    <span class="px-3 py-1 rounded-full bg-choco-dark/5 text-choco-dark text-[10px] font-bold">MARHALAH 698</span>
                </div>
                ${p.quote ? `<p class="text-choco-medium text-xs leading-relaxed italic border-t border-sand-light pt-4 mb-4">“${p.quote}”</p>` : ''}
                <a href="${igUrl(p.ig)}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-choco-dark text-gold-imperial text-[11px] font-bold uppercase tracking-wider hover:bg-choco-medium transition-colors">
                    <i data-lucide="instagram" class="text-base" aria-hidden="true"></i> @${String(p.ig).replace(/^@/, '')}
                </a>
            </div>`;
        }
        function homeLeaderCard(p, index){
            return `
            <article class="leader-card reveal">
                <div class="leader-photo">
                    <img src="${p.foto}" alt="Foto ${p.nama}" width="400" height="400" loading="lazy" decoding="async">
                    <span class="leader-number">0${index + 1}</span>
                    <a href="${igUrl(p.ig)}" target="_blank" rel="noopener" class="leader-social" aria-label="Instagram ${p.nama}"><i data-lucide="instagram" aria-hidden="true"></i></a>
                </div>
                <div class="leader-info">
                    <span class="leader-role">${p.jabatanLabel}</span>
                    <h4>${p.nama}</h4>
                    <p>“${p.quote}”</p>
                    <div class="leader-meta"><span><i data-lucide="map-pin" aria-hidden="true"></i>${p.daerahLabel}</span><span>698</span></div>
                </div>
            </article>`;
        }
        function coreMemberCard(p){
            return `
            <article class="core-member">
                <img src="${p.foto}" alt="Foto ${p.nama}" width="200" height="200" loading="lazy" decoding="async">
                <div><strong>${p.nama}</strong><span>${p.jabatanLabel}</span><small><i data-lucide="map-pin" aria-hidden="true"></i>${p.daerahLabel}</small></div>
                <a href="${igUrl(p.ig)}" target="_blank" rel="noopener" aria-label="Instagram ${p.nama}"><i data-lucide="instagram" aria-hidden="true"></i></a>
            </article>`;
        }
        function pengurusCard(p){
            return `
            <article class="pengurus-item bg-cream-bg rounded-2xl border border-sand-light gold-border-glow shadow-royal overflow-hidden flex flex-col" data-jabatan="${p.jabatan}" data-daerah="${p.daerah}" data-nama="${p.nama.toLowerCase()}">
                <div class="relative h-64 overflow-hidden bg-cream-soft">
                    <img src="${p.foto}" alt="Foto ${p.nama}" width="400" height="400" loading="lazy" decoding="async" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-choco-dark/70 via-transparent to-transparent" aria-hidden="true"></div>
                    <span class="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-gold-imperial text-choco-dark font-bold text-[10px] uppercase tracking-wider shadow-md">${p.jabatanLabel}</span>
                </div>
                <div class="p-5 flex flex-col flex-1">
                    <h3 class="font-cinzel font-bold text-lg text-choco-dark leading-tight">${p.nama}</h3>
                    <p class="text-[11px] text-choco-medium mt-1 mb-3"><i data-lucide="map-pin" class="text-gold-imperial mr-1" aria-hidden="true"></i>Asal: <strong class="text-choco-dark">${p.daerahLabel}</strong></p>
                    <p class="text-[11px] text-choco-medium mb-4"><i data-lucide="briefcase" class="text-gold-imperial mr-1" aria-hidden="true"></i>Bagian: <strong class="text-choco-dark">${p.jabatanLabel}</strong></p>
                    <a href="${igUrl(p.ig)}" target="_blank" rel="noopener" class="mt-auto inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-sand-light bg-cream-surface text-choco-dark text-[11px] font-bold uppercase tracking-wider hover:bg-choco-dark hover:text-gold-imperial hover:border-choco-dark transition-colors">
                        <i data-lucide="instagram" class="text-base" aria-hidden="true"></i> @${String(p.ig).replace(/^@/, '')}
                    </a>
                </div>
            </article>`;
        }

        // Teaser di index.html (#pimpinan-grid)
        const pimpinanGrid = $('#pimpinan-grid');
        if(pimpinanGrid && window.PIMPINAN){
            pimpinanGrid.innerHTML = window.PIMPINAN.map(homeLeaderCard).join('');
            $$('.reveal', pimpinanGrid).forEach(el=> io.observe(el));
            refreshIcons();
        }
        // Featured di pengurus.html (#pimpinan-featured)
        const pimpinanFeatured = $('#pimpinan-featured');
        if(pimpinanFeatured && window.PIMPINAN){
            pimpinanFeatured.innerHTML = window.PIMPINAN.map(p => pimpinanCard(p, true)).join('');
            refreshIcons();
        }

        // Pengurus inti di halaman utama (index.html): sekretaris, bendahara, media
        if(window.PENGURUS){
            const intiMap = [
                ['#inti-sekretaris', 'sekretaris'],
                ['#inti-bendahara', 'bendahara'],
                ['#inti-media', 'media']
            ];
            intiMap.forEach(([sel, jab]) => {
                const el = $(sel);
                if(el) el.innerHTML = window.PENGURUS.filter(p => p.jabatan === jab).map(coreMemberCard).join('');
            });
            refreshIcons();
        }

        // Grid + filter di pengurus.html
        const pengurusGrid = $('#pengurus-grid');
        if(pengurusGrid && window.PENGURUS){
            const jabBtns = $$('[data-pjabatan]');
            const daerahSel = $('#filter-daerah');
            const searchInput = $('#filter-search');
            const countEl = $('#pengurus-count');
            const emptyEl = $('#pengurus-empty');
            let fJabatan = 'all';
            let fDaerah = 'all';
            let fSearch = '';
            function applyFilter(){
                const q = fSearch.trim().toLowerCase();
                let shown = 0;
                $$('.pengurus-item', pengurusGrid).forEach(card => {
                    const okJ = fJabatan === 'all' || card.dataset.jabatan === fJabatan;
                    const okD = fDaerah === 'all' || card.dataset.daerah === fDaerah;
                    const okQ = !q || (card.dataset.nama || '').includes(q);
                    const show = okJ && okD && okQ;
                    card.classList.toggle('hidden', !show);
                    if(show) shown++;
                });
                if(countEl) countEl.textContent = `Menampilkan ${shown} dari ${window.PENGURUS.length} pengurus`;
                if(emptyEl) emptyEl.classList.toggle('hidden', shown > 0);
            }
            function stylePJabatan(){
                jabBtns.forEach(b => {
                    const on = b.dataset.pjabatan === fJabatan;
                    b.setAttribute('aria-selected', String(on));
                    b.classList.toggle('bg-choco-dark', on);
                    b.classList.toggle('text-gold-imperial', on);
                    b.classList.toggle('border-gold-imperial/40', on);
                    b.classList.toggle('shadow-md', on);
                    b.classList.toggle('bg-cream-bg', !on);
                    b.classList.toggle('text-choco-dark', !on);
                    b.classList.toggle('border-sand-light', !on);
                });
            }
            pengurusGrid.innerHTML = window.PENGURUS.map(pengurusCard).join('');
            refreshIcons();
            jabBtns.forEach(b => b.addEventListener('click', () => { fJabatan = b.dataset.pjabatan; stylePJabatan(); applyFilter(); }));
            if(daerahSel) daerahSel.addEventListener('change', () => { fDaerah = daerahSel.value; applyFilter(); });
            if(searchInput) searchInput.addEventListener('input', () => { fSearch = searchInput.value; applyFilter(); });
            stylePJabatan();
            applyFilter();
        }

        // ---------- Init icons (statis + dinamis) ----------
        refreshIcons();
