/* ============================================================
   Matematika LKPD — Halaman Panduan
   ============================================================ */
(function () {
  'use strict';

  const C = window.LKPD_CORE;
  const {
    html,
    useState,
    Icon,
    PageHead,
    Modal,
    cx,
    formatNum
  } = C;

  const STEPS = [
    {
      icon: 'user',
      num: '01',
      title: 'Isi identitas',
      text: 'Masukkan nama lengkap dan kelas di halaman Beranda. Data ini dipakai pada laporan hasil.'
    },
    {
      icon: 'book',
      num: '02',
      title: 'Baca empat topik',
      text: 'Pelajari pengantar, aturan sinus, aturan kosinus, dan cara memilih rumus. Tandai topik yang sudah selesai.'
    },
    {
      icon: 'target',
      num: '03',
      title: 'Kerjakan 8 soal',
      text: 'Tulis jawaban dalam bentuk angka. Tekan Periksa jawaban untuk melihat pembahasan dan poin soal.'
    },
    {
      icon: 'trophy',
      num: '04',
      title: 'Evaluasi hasil',
      text: 'Selesaikan latihan untuk melihat skor akhir, rincian benar/salah, waktu, dan riwayat percobaan.'
    }
  ];

  const FAQ = [
    {
      q: 'Apakah jawaban harus ditulis dalam angka desimal?',
      a: 'Ya. Tulis hasil akhir sebagai angka, misalnya 14,14 atau 14.14. Pembulatan dua angka desimal dianjurkan. Aplikasi memberi toleransi sekitar ±0,06 untuk perbedaan pembulatan.'
    },
    {
      q: 'Bagaimana skor akhir dihitung?',
      a: 'Ada delapan soal dengan bobot sama, yaitu 12,5 poin per soal. Semua jawaban benar bernilai 100. Jawaban kosong atau belum diperiksa saat latihan diselesaikan akan dinilai salah.'
    },
    {
      q: 'Kapan saya harus memakai aturan sinus?',
      a: 'Gunakan aturan sinus jika diketahui dua sudut dan satu sisi, atau dua sisi dan satu sudut di hadapan salah satu sisi tersebut. Kuncinya adalah adanya pasangan sisi–sudut yang lengkap.'
    },
    {
      q: 'Kapan saya harus memakai aturan kosinus?',
      a: 'Gunakan aturan kosinus jika diketahui dua sisi dan sudut apit (sudut di antara kedua sisi), atau ketiga sisinya. Untuk mencari sudut dari tiga sisi, gunakan bentuk cos A = (b² + c² − a²) / (2bc).'
    },
    {
      q: 'Bisakah jawaban diubah setelah diperiksa?',
      a: 'Setelah satu soal diperiksa, jawaban soal tersebut dikunci agar skor tetap jujur. Kamu dapat mengulang seluruh latihan dari awal kapan saja melalui tombol Kerjakan ulang.'
    },
    {
      q: 'Apakah data saya dikirim ke server?',
      a: 'Tidak. Nama, kelas, progres materi, jawaban, dan skor hanya disimpan di localStorage browser pada perangkat ini. Tidak ada data yang dikirim ke internet.'
    },
    {
      q: 'Mengapa kalkulator saya memberi hasil yang aneh?',
      a: 'Pastikan kalkulator berada pada mode derajat (DEG), bukan radian (RAD). Kesalahan mode adalah penyebab umum hasil sinus dan kosinus yang tidak sesuai.'
    }
  ];

  function GuidePage(props) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState(0);
    const profile = props.profile || { name: '', kelas: '' };
    const attempts = props.attempts || [];
    const completed = props.completed || [];

    function handleReset() {
      setConfirmOpen(false);
      props.onReset();
    }

    return html`<div className="page guide-page">
      <${PageHead}
        eyebrow="Panduan"
        title="Cara menggunakan LKPD ini"
        lead="Ikuti empat langkah singkat berikut. Semua fitur bisa dipakai tanpa akun dan tanpa koneksi setelah halaman terbuka."
        meta=${html`<span key="a" className="pill pill-soft"><${Icon} name="clock" size=${13} /> ±30 menit belajar</span>
          <span key="b" className="pill pill-soft"><${Icon} name="lock" size=${13} /> Data lokal</span>
          <span key="c" className="pill pill-soft"><${Icon} name="help" size=${13} /> FAQ lengkap</span>`}
      />

      <div className="guide-steps">
        ${STEPS.map(function (step) {
          return html`<div key=${step.num} className="guide-step card">
            <div className="guide-step-top">
              <span className="guide-step-icon"><${Icon} name=${step.icon} size=${21} /></span>
              <span className="guide-step-num">${step.num}</span>
            </div>
            <h3>${step.title}</h3>
            <p>${step.text}</p>
          </div>`;
        })}
      </div>

      <div className="guide-grid">
        <section className="card guide-card">
          <div className="card-heading">
            <span className="heading-icon"><${Icon} name="help" size=${21} /></span>
            <div className="heading-copy">
              <span className="mini-kicker">Pertanyaan umum</span>
              <h2>Hal yang sering ditanyakan</h2>
              <p>Klik pertanyaan untuk membuka jawabannya.</p>
            </div>
          </div>
          <div className="faq-list">
            ${FAQ.map(function (item, index) {
              const isOpen = openFaq === index;
              return html`<div key=${index} className=${cx('faq-item', isOpen && 'is-open')}>
                <button
                  type="button"
                  className="faq-question"
                  onClick=${function () { setOpenFaq(isOpen ? -1 : index); }}
                  aria-expanded=${isOpen}
                >
                  <span>${item.q}</span>
                  <${Icon} name="chevronDown" size=${18} className="faq-chevron" />
                </button>
                ${isOpen && html`<div className="faq-answer">${item.a}</div>`}
              </div>`;
            })}
          </div>
        </section>

        <aside className="guide-aside">
          <section className="card cheat-card">
            <span className="mini-kicker">Ringkasan rumus</span>
            <h2>Contekan cepat</h2>
            <div className="cheat-block cheat-sinus">
              <span className="cheat-label">Aturan Sinus</span>
              <div className="cheat-formula"><i>a</i> / sin <i>A</i> = <i>b</i> / sin <i>B</i> = <i>c</i> / sin <i>C</i></div>
              <p>Dua sudut + satu sisi · dua sisi + sudut di hadapannya</p>
            </div>
            <div className="cheat-block cheat-kosinus">
              <span className="cheat-label">Aturan Kosinus</span>
              <div className="cheat-formula"><i>a</i>² = <i>b</i>² + <i>c</i>² − 2<i>bc</i> cos <i>A</i></div>
              <div className="cheat-formula cheat-formula-sm">cos <i>A</i> = (<i>b</i>² + <i>c</i>² − <i>a</i>²) / 2<i>bc</i></div>
              <p>Dua sisi + sudut apit · tiga sisi untuk mencari sudut</p>
            </div>
            <div className="cheat-tip">
              <${Icon} name="lightbulb" size=${16} />
              <p>Pastikan kalkulator dalam mode <b>DEG</b> dan bulatkan hasil di akhir.</p>
            </div>
            <a className="btn btn-soft btn-block" href="#/materi/memilih">
              <${Icon} name="book" size=${15} /> Buka strategi memilih rumus
            </a>
          </section>

          <section className="card data-card">
            <span className="data-icon"><${Icon} name="shield" size=${22} /></span>
            <h3>Data belajar di perangkat ini</h3>
            <div className="data-list">
              <div><span>Nama</span><b>${profile.name || 'Belum diisi'}</b></div>
              <div><span>Kelas</span><b>${profile.kelas || '—'}</b></div>
              <div><span>Materi selesai</span><b>${completed.length}/4</b></div>
              <div><span>Percobaan latihan</span><b>${attempts.length}</b></div>
              ${attempts[0] && html`<div><span>Skor terakhir</span><b>${formatNum(attempts[0].score)} / 100</b></div>`}
            </div>
            <p className="data-note">Data disimpan di localStorage browser. Menghapus data akan menghapus identitas, progres materi, jawaban, dan seluruh riwayat latihan.</p>
            <button type="button" className="btn btn-danger-soft btn-block" onClick=${function () { setConfirmOpen(true); }}>
              <${Icon} name="trash" size=${15} /> Hapus semua data
            </button>
          </section>
        </aside>
      </div>

      <section className="guide-tips">
        <div className="guide-tip">
          <span><${Icon} name="pencil" size=${17} /></span>
          <div><b>Kerjakan tanpa terburu-buru</b><p>Waktu tidak dibatasi. Fokus pada ketepatan memilih rumus dan langkah hitungan.</p></div>
        </div>
        <div className="guide-tip">
          <span><${Icon} name="book" size=${17} /></span>
          <div><b>Buka materi saat ragu</b><p>Kamu bisa berpindah antara materi dan latihan tanpa kehilangan jawaban yang sudah disimpan.</p></div>
        </div>
        <div className="guide-tip">
          <span><${Icon} name="rotate" size=${17} /></span>
          <div><b>Ulangi untuk memperbaiki skor</b><p>Riwayat sebelumnya tetap tersimpan, sehingga perkembangan belajar bisa dilihat kembali.</p></div>
        </div>
      </section>

      <${Modal}
        open=${confirmOpen}
        onClose=${function () { setConfirmOpen(false); }}
        title="Hapus semua data belajar?"
        icon="trash"
        footer=${html`<button type="button" className="btn btn-ghost" onClick=${function () { setConfirmOpen(false); }}>
            Batal
          </button>
          <button type="button" className="btn btn-danger" onClick=${handleReset}>
            <${Icon} name="trash" size=${15} /> Ya, hapus semua
          </button>`}
      >
        <p>Tindakan ini tidak dapat dibatalkan. Data berikut akan dihapus dari browser:</p>
        <ul className="modal-list">
          <li>Nama dan kelas</li>
          <li>Progres empat topik materi</li>
          <li>Jawaban yang sedang dikerjakan</li>
          <li>Seluruh riwayat dan skor latihan</li>
        </ul>
      <//>
    </div>`;
  }

  window.LKPD_PAGES = window.LKPD_PAGES || {};
  window.LKPD_PAGES.GuidePage = GuidePage;
})();
