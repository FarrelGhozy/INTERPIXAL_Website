/* INTERPIXAL app.js — semua interaksi (drawer, filter, modal, slider, form dummy) */
// ---------- Helpers ----------
        const $ = (s, c=document) => c.querySelector(s);
        const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));
        let lastFocus = null;
        function showToast(msg){
            const t = $('#toast');
            t.textContent = msg;
            t.classList.remove('hidden');
            clearTimeout(t._h);
            t._h = setTimeout(()=> t.classList.add('hidden'), 2600);
        }
        function openModal(modal){
            lastFocus = document.activeElement;
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            modal.setAttribute('aria-hidden','false');
            document.body.style.overflow = 'hidden';
            const btn = modal.querySelector('button');
            if(btn) btn.focus({preventScroll:true});
        }
        function closeModal(modal){
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            modal.setAttribute('aria-hidden','true');
            document.body.style.overflow = '';
            if(lastFocus && lastFocus.focus) lastFocus.focus({preventScroll:true});
        }

        // ---------- Year ----------
        $('#year').textContent = new Date().getFullYear();

        // ---------- Mobile Drawer ----------
        const mobileToggle = $('#mobile-toggle');
        const mobileDrawer = $('#mobile-drawer');
        const menuIcon = $('#menu-icon');
        function setDrawer(open){
            mobileDrawer.classList.toggle('hidden', !open);
            mobileToggle.setAttribute('aria-expanded', String(open));
            mobileToggle.setAttribute('aria-label', open ? 'Tutup menu navigasi' : 'Buka menu navigasi');
            menuIcon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars-staggered';
        }
        mobileToggle.addEventListener('click', () => setDrawer(mobileDrawer.classList.contains('hidden')));
        $$('.mobile-link').forEach(link => link.addEventListener('click', () => setDrawer(false)));

        // ---------- Reveal on scroll ----------
        const io = new IntersectionObserver((entries)=>{
            entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('revealed'); io.unobserve(e.target);} });
        }, {threshold: .12});
        $$('.reveal').forEach(el=> io.observe(el));

        // ---------- Active nav ----------
        const navLinks = $$('[data-nav]');
        const secIO = new IntersectionObserver((entries)=>{
            entries.forEach(e=>{
                if(e.isIntersecting){
                    navLinks.forEach(a=> a.classList.toggle('active', a.dataset.nav === e.target.id));
                }
            });
        }, {rootMargin: '-40% 0px -55% 0px'});
        ['hero','tentang','dual-logo','sebaran','agenda','galeri'].forEach(id=>{
            const s = document.getElementById(id);
            if(s) secIO.observe(s);
        });

        // ---------- Count-up ----------
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
        $$('[data-count]').forEach(el=> countIO.observe(el));

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
                regionEmpty.classList.toggle('hidden', shown>0);
            });
        });

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

        // ---------- Lightbox ----------
        const lightbox = $('#lightbox-modal');
        function openLightbox(imgSrc, title, desc) {
            $('#lightbox-img').src = imgSrc;
            $('#lightbox-title').textContent = title;
            $('#lightbox-desc').textContent = desc;
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
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

        // ---------- Logo Detail Modal ----------
        const logoModal = $('#logo-modal');
        function openLogoDetail(type) {
            const container = $('#logo-modal-content');
            if (type === 'general') {
                container.innerHTML = `
                    <div class="text-center mb-6" id="logo-modal-title">
                        <div class="w-16 h-16 mx-auto rounded-xl bg-choco-dark text-gold-imperial flex items-center justify-center text-3xl mb-3 shadow-lg"><i class="fa-solid fa-earth-asia"></i></div>
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
                        <div class="w-16 h-16 mx-auto rounded-xl bg-red-maroon text-gold-light flex items-center justify-center text-3xl mb-3 shadow-lg"><i class="fa-solid fa-shield-halved"></i></div>
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
        }
        function closeLogoModal() { closeModal(logoModal); }
        window.openLogoDetail = openLogoDetail;
        window.closeLogoModal = closeLogoModal;
        $$('[data-logo-detail]').forEach(b=> b.addEventListener('click', ()=> openLogoDetail(b.dataset.logoDetail)));
        $$('[data-close-logo]').forEach(b=> b.addEventListener('click', closeLogoModal));
        logoModal.addEventListener('click', (e) => { if (e.target === logoModal) closeLogoModal(); });

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
            const d = dummyMembers[b.dataset.members];
            if(!d) return;
            $('#members-title').textContent = d.title;
            $('#members-list').innerHTML = d.names.map((n,i)=> `<li class="flex items-center gap-3 bg-cream-bg border border-sand-light rounded-lg px-3 py-2"><span class="w-8 h-8 rounded-full bg-choco-dark text-gold-imperial flex items-center justify-center text-xs font-bold">${i+1}</span><span>${n}</span></li>`).join('');
            openModal(membersModal);
        }));
        $$('[data-close-members]').forEach(b=> b.addEventListener('click', ()=> closeModal(membersModal)));
        membersModal.addEventListener('click', e=>{ if(e.target===membersModal) closeModal(membersModal); });

        // ---------- Dummy download ----------
        $$('[data-dummy-download]').forEach(b=> b.addEventListener('click', ()=> showToast('Dummy: "' + b.dataset.dummyDownload + '" belum ada file asli.')));

        // ---------- Testimoni slider ----------
        const track = $('#testi-track');
        const dots = $('#testi-dots');
        let idx = 0; const total = 3;
        function renderTesti(){
            track.style.transform = `translateX(-${idx*100}%)`;
            dots.textContent = `${idx+1} / ${total} • Dummy`;
        }
        $('#testi-prev').addEventListener('click', ()=>{ idx = (idx-1+total)%total; renderTesti(); });
        $('#testi-next').addEventListener('click', ()=>{ idx = (idx+1)%total; renderTesti(); });
        renderTesti();

        // ---------- Form dummy ----------
        $('#dummy-form').addEventListener('submit', (e)=>{
            e.preventDefault();
            const nama = $('#f-nama').value.trim();
            if(!nama){ showToast('Dummy: isi nama dulu ya.'); $('#f-nama').focus(); return; }
            showToast(`Dummy terkirim! Terima kasih ${nama} (simulasi, tidak tersimpan).`);
            e.target.reset();
        });

        // ---------- ESC global ----------
        document.addEventListener('keydown', (e)=>{
            if(e.key !== 'Escape') return;
            [lightbox, logoModal, membersModal].forEach(m=>{
                if(!m.classList.contains('hidden')) closeModal(m);
            });
            setDrawer(false);
        });

        // ---------- Back to top ----------
        const toTop = $('#to-top');
        window.addEventListener('scroll', ()=>{
            const show = window.scrollY > 600;
            toTop.classList.toggle('hidden', !show);
            toTop.classList.toggle('flex', show);
        }, {passive:true});
        toTop.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));
