/* ============================================================
   Matematika LKPD — Halaman Hasil
   ============================================================ */
(function () {
  'use strict';

  const C = window.LKPD_CORE;
  const {
    html,
    Icon,
    PageHead,
    ProgressRing,
    cx,
    formatNum,
    formatDate,
    formatDateTime,
    formatDuration
  } = C;
  const QUESTIONS = window.LKPD_CONTENT.QUESTIONS;
  const TOTAL = QUESTIONS.length;

  function gradeOf(score) {
    if (score >= 90) {
      return {
        badge: 'Luar biasa',
        tone: 'great',
        title: 'Luar biasa!',
        message: 'Pemahamanmu sangat kuat. Kamu mampu memilih rumus dan mengerjakan langkah hitungan dengan tepat.'
      };
    }
    if (score >= 75) {
      return {
        badge: 'Bagus',
        tone: 'good',
        title: 'Kerja bagus!',
        message: 'Sebagian besar soal sudah kamu kuasai. Pelajari kembali soal yang belum tepat agar hasilmu makin sempurna.'
      };
    }
    if (score >= 60) {
      return {
        badge: 'Cukup',
        tone: 'fair',
        title: 'Terus berlatih!',
        message: 'Dasarmu sudah terlihat. Cermati kembali kapan aturan sinus dan kosinus digunakan, lalu ulangi latihan.'
      };
    }
    return {
      badge: 'Perlu latihan',
      tone: 'low',
      title: 'Ayo ulangi!',
      message: 'Jangan menyerah. Baca kembali contoh bertahap di halaman materi, lalu kerjakan ulang soal dengan tenang.'
    };
  }

  function ResultPage(props) {
    const attempts = props.attempts || [];
    const result = attempts[0] || null;

    if (!result) {
      return html`<div className="page result-page">
        <${PageHead}
          eyebrow="Hasil latihan"
          title="Hasil & evaluasi belajar"
          lead="Skor, jumlah jawaban benar, dan pembahasan lengkap akan tampil setelah kamu menyelesaikan latihan."
          meta=${html`<span key="a" className="pill pill-soft"><${Icon} name="chart" size=${13} /> Skor otomatis</span>
            <span key="b" className="pill pill-soft"><${Icon} name="pencil" size=${13} /> Pembahasan</span>
            <span key="c" className="pill pill-soft"><${Icon} name="lock" size=${13} /> Riwayat lokal</span>`}
        />
        <section className="card empty-result">
          <span className="empty-result-art"><${Icon} name="trophy" size=${40} /></span>
          <span className="mini-kicker">Belum ada data</span>
          <h2>Belum ada hasil latihan</h2>
          <p>Selesaikan delapan soal latihan terlebih dahulu. Setelah itu, halaman ini akan menampilkan skor, rincian jawaban, dan riwayat belajarmu.</p>
          <div className="empty-result-actions">
            <a className="btn btn-primary" href="#/latihan">Mulai latihan <${Icon} name="arrowRight" size=${16} /></a>
            <a className="btn btn-ghost" href="#/materi/pengantar"><${Icon} name="book" size=${16} /> Pelajari materi</a>
          </div>
          <div className="empty-result-steps">
            <span><b>8 soal</b> kontekstual</span>
            <span><b>12,5 poin</b> per soal</span>
            <span><b>0–100</b> skor akhir</span>
          </div>
        </section>
      </div>`;
    }

    const grade = gradeOf(result.score);
    const accuracy = (result.correct / TOTAL) * 100;
    const wrong = TOTAL - result.correct;
    const itemMap = {};
    (result.items || []).forEach(function (item) {
      itemMap[item.id] = item;
    });

    return html`<div className="page result-page">
      <${PageHead}
        eyebrow="Hasil latihan"
        title="Hasil & evaluasi belajar"
        lead="Lihat skor akhir, rincian setiap jawaban, dan langkah pembahasan. Semua data tersimpan di browser ini."
        meta=${html`<span key="a" className="pill pill-soft"><${Icon} name="user" size=${13} /> ${result.name}</span>
          <span key="b" className="pill pill-soft"><${Icon} name="graduation" size=${13} /> ${result.kelas}</span>
          <span key="c" className="pill pill-soft"><${Icon} name="clock" size=${13} /> ${formatDateTime(result.at)}</span>`}
        aside=${html`<button type="button" className="btn btn-ghost btn-sm no-print" onClick=${function () { window.print(); }}>
          <${Icon} name="print" size=${15} /> Cetak hasil
        </button>`}
      />

      <section className="result-hero">
        <span className="result-formula result-formula-a">a / sin A</span>
        <span className="result-formula result-formula-b">a² = b² + c² − 2bc cos A</span>
        <div className="result-hero-main">
          <div className="eyebrow eyebrow-light"><span className="eyebrow-line"></span>Hasil latihan</div>
          <h2>${grade.title}</h2>
          <p className="result-student">${result.name}<span>·</span>${result.kelas}</p>
          <div className="result-scoreline">
            <strong>${formatNum(result.score)}</strong>
            <span>/ 100</span>
            <em className=${'result-badge badge-' + grade.tone}>${grade.badge}</em>
          </div>
          <p className="result-summary">${grade.message}</p>
          <div className="result-hero-actions no-print">
            <button type="button" className="btn btn-primary" onClick=${props.onRestart}>
              <${Icon} name="rotate" size=${16} /> Kerjakan ulang
            </button>
            <a className="btn btn-light-outline" href="#/materi/memilih"><${Icon} name="book" size=${16} /> Pelajari lagi</a>
            <button type="button" className="btn btn-light-outline" onClick=${function () { window.print(); }}>
              <${Icon} name="print" size=${16} /> Cetak
            </button>
          </div>
          <span className="result-date">Diselesaikan ${formatDateTime(result.at)}</span>
        </div>
        <div className="result-ring-wrap">
          <${ProgressRing} value=${result.score} size=${190} label="dari 100" />
          <span className="result-ring-note">Skor akhir</span>
        </div>
      </section>

      <div className="stats-grid result-stats">
        <div className="stat-card card">
          <span className="stat-icon tone-green"><${Icon} name="checkCircle" size=${20} /></span>
          <div><strong>${result.correct}</strong><span>Jawaban benar</span></div>
          <small>dari ${TOTAL} soal</small>
        </div>
        <div className="stat-card card">
          <span className="stat-icon tone-red"><${Icon} name="xCircle" size=${20} /></span>
          <div><strong>${wrong}</strong><span>Jawaban salah</span></div>
          <small>perlu dipelajari</small>
        </div>
        <div className="stat-card card">
          <span className="stat-icon tone-sky"><${Icon} name="target" size=${20} /></span>
          <div><strong>${formatNum(accuracy)}%</strong><span>Ketepatan</span></div>
          <small>akurasi jawaban</small>
        </div>
        <div className="stat-card card">
          <span className="stat-icon tone-amber"><${Icon} name="clock" size=${20} /></span>
          <div><strong className="stat-time">${formatDuration(result.durationSec)}</strong><span>Waktu pengerjaan</span></div>
          <small>total durasi</small>
        </div>
      </div>

      <section className="result-section">
        <div className="section-head result-section-head">
          <div>
            <div className="eyebrow"><span className="eyebrow-line"></span>Evaluasi</div>
            <h2>Rincian jawaban</h2>
          </div>
          <div className="review-summary">
            <span><i className="dot-correct"></i>${result.correct} benar</span>
            <span><i className="dot-wrong"></i>${wrong} salah</span>
            <span className="review-summary-score">${formatNum(result.score)} / 100</span>
          </div>
        </div>

        <div className="review-list">
          ${QUESTIONS.map(function (question, index) {
            const item = itemMap[question.id] || { answer: '', correct: false };
            return html`<details key=${question.id} className=${cx('review-card card', item.correct ? 'review-correct' : 'review-incorrect')} open=${index === 0}>
              <summary>
                <span className="review-num">${String(index + 1).padStart(2, '0')}</span>
                <span className="review-title">
                  <b>${question.title}</b>
                  <small>${question.category} · ${question.level}</small>
                </span>
                <span className=${cx('review-status', item.correct ? 'status-correct' : 'status-incorrect')}>
                  <${Icon} name=${item.correct ? 'checkCircle' : 'xCircle'} size=${14} />
                  ${item.correct ? 'Benar' : 'Salah'}
                </span>
                <span className="review-chevron"><${Icon} name="chevronDown" size=${18} /></span>
              </summary>
              <div className="review-body">
                <p className="review-stem">${question.stem}</p>
                <div className="review-answer-grid">
                  <div>
                    <span>Jawabanmu</span>
                    <b className=${item.correct ? 'text-good' : 'text-bad'}>${item.answer ? item.answer + ' ' + question.unit : 'Tidak dijawab'}</b>
                  </div>
                  <div>
                    <span>Jawaban benar</span>
                    <b>${question.display}</b>
                  </div>
                </div>
                <div className="review-formula"><span>Rumus kunci</span><b>${question.formula}</b></div>
                <div className="review-explanation">
                  <h4><${Icon} name="pencil" size=${15} /> Pembahasan langkah demi langkah</h4>
                  <ol>
                    ${question.steps.map(function (step, stepIndex) {
                      return html`<li key=${stepIndex}>${step}</li>`;
                    })}
                  </ol>
                  <p>${question.explanation}</p>
                </div>
              </div>
            </details>`;
          })}
        </div>
      </section>

      <section className="result-section">
        <div className="section-head result-section-head">
          <div>
            <div className="eyebrow"><span className="eyebrow-line"></span>Rekap lokal</div>
            <h2>Riwayat latihan</h2>
          </div>
          <p>Maksimal delapan percobaan terakhir, tersimpan di browser ini.</p>
        </div>
        <div className="card history-card">
          ${attempts.slice(0, 8).map(function (attempt, index) {
            return html`<div key=${attempt.id} className=${cx('history-row', index === 0 && 'is-latest')}>
              <span className="history-index">${String(index + 1).padStart(2, '0')}</span>
              <div className="history-main">
                <strong>${attempt.name}</strong>
                <span>${attempt.kelas} · ${formatDate(attempt.at)} · ${formatDuration(attempt.durationSec)}</span>
              </div>
              <div className="history-detail">
                <span>${attempt.correct}/${attempt.total} benar</span>
                <b>${formatNum(attempt.score)}</b>
              </div>
              ${index === 0 && html`<span className="history-latest">Terbaru</span>`}
            </div>`;
          })}
        </div>
      </section>

      <div className="result-bottom no-print">
        <div>
          <span className="mini-kicker">Langkah berikutnya</span>
          <h3>Ingin memperbaiki skor?</h3>
          <p>Ulangi latihan kapan saja. Riwayat sebelumnya tetap tersimpan.</p>
        </div>
        <div className="result-bottom-actions">
          <a className="btn btn-ghost" href="#/materi/pengantar"><${Icon} name="book" size=${16} /> Baca materi</a>
          <button type="button" className="btn btn-primary" onClick=${props.onRestart}>
            <${Icon} name="rotate" size=${16} /> Kerjakan ulang
          </button>
        </div>
      </div>
    </div>`;
  }

  window.LKPD_PAGES = window.LKPD_PAGES || {};
  window.LKPD_PAGES.ResultPage = ResultPage;
})();
