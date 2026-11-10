/* ============================================================
   Matematika LKPD — Halaman Beranda
   ============================================================ */
(function () {
  'use strict';

  const C = window.LKPD_CORE;
  const { html, useState, useEffect, Icon, Avatar, HeroVisual, ProgressBar, formatNum, firstName, cx, scrollToId } = C;

  const MODULES = [
    {
      num: '01',
      icon: 'triangle',
      title: 'Aturan Sinus',
      desc: 'Gunakan saat kamu tahu dua sudut dan satu sisi, atau dua sisi dan sudut di hadapannya.',
      formula: 'a / sin A = b / sin B = c / sin C',
      href: '#/materi/sinus',
      tone: 'sky'
    },
    {
      num: '02',
      icon: 'ruler',
      title: 'Aturan Kosinus',
      desc: 'Hitung sisi ketiga dari dua sisi dan sudut apit, atau tentukan sudut dari tiga sisi.',
      formula: 'a² = b² + c² − 2bc cos A',
      href: '#/materi/kosinus',
      tone: 'blue'
    },
    {
      num: '03',
      icon: 'compass',
      title: 'Pilih Rumus',
      desc: 'Kenali pola informasi pada soal dan tentukan apakah harus memakai sinus atau kosinus.',
      formula: '2 sudut + 1 sisi → sinus',
      href: '#/materi/memilih',
      tone: 'mint'
    },
    {
      num: '04',
      icon: 'target',
      title: 'Latihan 8 Soal',
      desc: 'Uji pemahaman lewat soal cerita dan hitungan, lengkap dengan skor serta pembahasan.',
      formula: '8 soal · 100 poin · otomatis',
      href: '#/latihan',
      tone: 'amber'
    }
  ];

  const JOURNEY = [
    { num: '1', title: 'Isi identitas', desc: 'Nama dan kelas untuk laporan hasil.' },
    { num: '2', title: 'Baca materi', desc: 'Empat topik singkat dan contoh bertahap.' },
    { num: '3', title: 'Kerjakan 8 soal', desc: 'Jawab, periksa, lalu lihat pembahasan.' },
    { num: '4', title: 'Evaluasi hasil', desc: 'Skor, rincian jawaban, dan riwayat.' }
  ];

  function HomePage(props) {
    const profile = props.profile || { name: '', kelas: '' };
    const attempts = props.attempts || [];
    const completed = props.completed || [];
    const lastAttempt = attempts[0] || null;
    const [name, setName] = useState(profile.name || '');
    const [kelas, setKelas] = useState(profile.kelas || '');
    const [errors, setErrors] = useState({});

    useEffect(function () {
      setName(profile.name || '');
      setKelas(profile.kelas || '');
    }, [profile.name, profile.kelas]);

    function handleSubmit(event) {
      event.preventDefault();
      const cleanName = name.trim().replace(/\s+/g, ' ');
      const cleanKelas = kelas.trim().replace(/\s+/g, ' ');
      const nextErrors = {};
      if (cleanName.length < 2) nextErrors.name = 'Nama minimal 2 karakter.';
      if (!cleanKelas) nextErrors.kelas = 'Kelas wajib diisi. Contoh: X IPA 1.';
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length) return;
      props.onSaveProfile({ name: cleanName, kelas: cleanKelas });
      props.notify('Identitas tersimpan. Selamat belajar, ' + firstName(cleanName) + '!', 'success');
      props.navigate('materi/pengantar');
    }

    function startLearning() {
      if (profile.name) {
        props.navigate('materi/pengantar');
        return;
      }
      scrollToId('identitas');
      window.setTimeout(function () {
        const input = document.getElementById('input-nama');
        if (input) input.focus({ preventScroll: true });
      }, 420);
    }

    return html`<div className="page home-page">
      <section className="hero-card">
        <div className="hero-main">
          <div className="eyebrow"><span className="eyebrow-line"></span>Matematika LKPD · Kelas X</div>
          <h1 className="hero-title">
            <span className="title-main">MATEMATIKA <span className="accent-text">LKPD</span><span className="title-dot">.</span></span>
            <span className="title-sub"><span className="title-sub-icon"><${Icon} name="graduation" size=${18} /></span>Kelas X SMA/MA dan SMK/MAK</span>
          </h1>
          <div className="hero-topic">
            <span className="hero-topic-line"></span>
            Trigonometri · Aturan Sinus & Aturan Kosinus
          </div>
          <p className="hero-lead">
            Kuasai cara menghitung sisi dan sudut pada segitiga sembarang melalui
            ringkasan materi, delapan soal kontekstual, dan pembahasan bertahap.
          </p>
          <div className="hero-actions">
            <button type="button" className="btn btn-primary" onClick=${startLearning}>
              ${profile.name ? 'Lanjut belajar' : 'Mulai belajar'}
              <${Icon} name="arrowRight" size=${17} />
            </button>
            <a className="btn btn-ghost" href="#/materi/pengantar">
              <${Icon} name="book" size=${16} /> Kenali materinya
            </a>
          </div>
          <div className="hero-highlights">
            <span><${Icon} name="checkCircle" size=${15} /> 2 rumus inti</span>
            <span><${Icon} name="checkCircle" size=${15} /> 8 soal latihan</span>
            <span><${Icon} name="checkCircle" size=${15} /> Pembahasan lengkap</span>
          </div>
          ${profile.name &&
          html`<div className="welcome-strip">
            <span className="welcome-strip-dot"></span>
            Halo, <strong>${firstName(profile.name)}</strong>. Progresmu tersimpan di perangkat ini.
          </div>`}
        </div>
        <${HeroVisual} />
      </section>

      <section className="home-grid">
        <div className="card identity-card" id="identitas">
          <div className="card-heading">
            <span className="heading-icon"><${Icon} name="user" size=${21} /></span>
            <div className="heading-copy">
              <span className="mini-kicker">Identitas</span>
              <h2>Isi identitas LKPD</h2>
              <p>Nama dan kelas akan muncul pada halaman hasil serta riwayat latihanmu.</p>
            </div>
          </div>
          ${profile.name &&
          html`<div className="saved-banner">
            <${Icon} name="checkCircle" size=${16} />
            <span>Identitas aktif: <strong>${profile.name}</strong> · ${profile.kelas || 'Kelas X'}</span>
          </div>`}
          <form className="identity-form" onSubmit=${handleSubmit} noValidate>
            <div className="form-grid">
              <div className=${cx('field', errors.name && 'has-error')}>
                <label htmlFor="input-nama">Nama lengkap</label>
                <input
                  id="input-nama"
                  type="text"
                  value=${name}
                  onChange=${function (event) { setName(event.target.value); }}
                  placeholder="Contoh: Rani Putri"
                  autoComplete="name"
                  maxLength="60"
                  aria-invalid=${Boolean(errors.name)}
                />
                ${errors.name && html`<span className="field-error">${errors.name}</span>`}
              </div>
              <div className=${cx('field', errors.kelas && 'has-error')}>
                <label htmlFor="input-kelas">Kelas</label>
                <input
                  id="input-kelas"
                  type="text"
                  value=${kelas}
                  onChange=${function (event) { setKelas(event.target.value); }}
                  placeholder="Contoh: X IPA 1"
                  autoComplete="off"
                  maxLength="30"
                  aria-invalid=${Boolean(errors.kelas)}
                />
                ${errors.kelas && html`<span className="field-error">${errors.kelas}</span>`}
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Simpan & mulai belajar <${Icon} name="arrowRight" size=${16} />
              </button>
              <span className="form-note"><${Icon} name="lock" size=${13} /> Hanya tersimpan di browser ini</span>
            </div>
          </form>
        </div>

        <aside className="status-card">
          <div className="status-orbit status-orbit-a"></div>
          <div className="status-orbit status-orbit-b"></div>
          <span className="status-kicker">Status belajar</span>
          ${profile.name
            ? html`<div className="status-content">
                <div className="status-profile">
                  <${Avatar} name=${profile.name} size=${48} />
                  <div>
                    <strong>${profile.name}</strong>
                    <span>${profile.kelas || 'Kelas X'}</span>
                  </div>
                </div>
                <div className="status-block">
                  <div className="status-label-row">
                    <span>Materi dipelajari</span>
                    <b>${completed.length}/4</b>
                  </div>
                  <${ProgressBar} value=${(completed.length / 4) * 100} className="progress-light" label="Progres materi" />
                </div>
                <div className="status-block status-score-block">
                  <span className="status-label">Skor terakhir</span>
                  ${lastAttempt
                    ? html`<div className="status-score">
                        <strong>${formatNum(lastAttempt.score)}</strong>
                        <span><b>/ 100</b><small>${lastAttempt.correct} benar dari ${lastAttempt.total}</small></span>
                      </div>`
                    : html`<p className="status-empty-text">Belum ada latihan. Kerjakan 8 soal untuk melihat skormu.</p>`}
                </div>
                <div className="status-actions">
                  <a className="btn btn-light btn-sm" href="#/materi/pengantar">Lanjut materi <${Icon} name="arrowRight" size=${14} /></a>
                  <a className="btn btn-light-outline btn-sm" href="#/latihan">Latihan</a>
                </div>
              </div>`
            : html`<div className="status-content status-content-empty">
                <span className="status-empty-icon"><${Icon} name="graduation" size=${26} /></span>
                <h3>Belum ada progres</h3>
                <p>Isi identitas terlebih dahulu. Setelah itu materi yang selesai dan skor latihan akan tampil di sini.</p>
                <button
                  type="button"
                  className="btn btn-light btn-sm"
                  onClick=${function () {
                    scrollToId('identitas');
                    window.setTimeout(function () {
                      const input = document.getElementById('input-nama');
                      if (input) input.focus({ preventScroll: true });
                    }, 420);
                  }}
                >Isi identitas <${Icon} name="arrowRight" size=${14} /></button>
                <div className="status-mini-list">
                  <span><${Icon} name="lock" size=${13} /> Data privat di browser</span>
                  <span><${Icon} name="chart" size=${13} /> Skor otomatis</span>
                </div>
              </div>`}
        </aside>
      </section>

      <div className="section-head">
        <div>
          <div className="eyebrow"><span className="eyebrow-line"></span>Isi pembelajaran</div>
          <h2>Empat langkah menuju mahir trigonometri</h2>
        </div>
        <p>Mulai dari konsep, pilih rumus yang tepat, lalu uji dengan latihan.</p>
      </div>

      <div className="module-grid">
        ${MODULES.map(function (item) {
          return html`<a key=${item.num} className=${cx('module-card card', 'tone-' + item.tone)} href=${item.href}>
            <div className="module-top">
              <span className="module-icon"><${Icon} name=${item.icon} size=${21} /></span>
              <span className="module-num">${item.num}</span>
            </div>
            <h3>${item.title}</h3>
            <p>${item.desc}</p>
            <span className="module-formula">${item.formula}</span>
            <span className="module-link">Buka topik <${Icon} name="arrowUpRight" size=${14} /></span>
          </a>`;
        })}
      </div>

      <section className="card journey-card">
        <div className="journey-intro">
          <div className="eyebrow"><span className="eyebrow-line"></span>Alur belajar</div>
          <h3>Belajar dengan ritme yang jelas</h3>
          <p>Semua langkah bisa diulang. Progres dan jawaban tersimpan otomatis di browser.</p>
        </div>
        <div className="journey-steps">
          ${JOURNEY.map(function (step) {
            return html`<div key=${step.num} className="journey-step">
              <span className="journey-num">${step.num}</span>
              <div>
                <strong>${step.title}</strong>
                <span>${step.desc}</span>
              </div>
            </div>`;
          })}
        </div>
      </section>
    </div>`;
  }

  window.LKPD_PAGES = window.LKPD_PAGES || {};
  window.LKPD_PAGES.HomePage = HomePage;
})();
