/* ============================================================
   Matematika LKPD — Halaman Latihan Soal
   ============================================================ */
(function () {
  'use strict';

  const C = window.LKPD_CORE;
  const {
    html,
    useState,
    useEffect,
    Icon,
    PageHead,
    ProgressBar,
    Modal,
    cx,
    formatNum,
    formatDuration,
    firstName,
    isAnswerCorrect,
    scrollToId
  } = C;
  const QUESTIONS = window.LKPD_CONTENT.QUESTIONS;
  const TOTAL = QUESTIONS.length;
  const POIN = 100 / TOTAL;

  function QuizPage(props) {
    const profile = props.profile || { name: '', kelas: '' };
    const quiz = props.quiz || C.createQuizState();
    const attempts = props.attempts || [];
    const [hintOpen, setHintOpen] = useState(false);
    const [answerError, setAnswerError] = useState('');
    const [finishOpen, setFinishOpen] = useState(false);

    const currentIndex = Math.min(Math.max(Number(quiz.current) || 0, 0), TOTAL - 1);
    const question = QUESTIONS[currentIndex];
    const currentAnswer = quiz.answers[question.id] || '';
    const isChecked = Boolean(quiz.checked[question.id]);
    const isCorrect = isChecked && isAnswerCorrect(question, currentAnswer);
    const checkedCount = Object.keys(quiz.checked).filter(function (id) {
      return quiz.checked[id];
    }).length;
    const correctCount = QUESTIONS.filter(function (item) {
      return quiz.checked[item.id] && isAnswerCorrect(item, quiz.answers[item.id]);
    }).length;
    const wrongCount = checkedCount - correctCount;

    useEffect(function () {
      setHintOpen(false);
      setAnswerError('');
    }, [currentIndex]);

    useEffect(function () {
      if (!quiz.finished && !quiz.startAt) {
        props.setQuiz(function (state) {
          if (state.startAt) return state;
          return Object.assign({}, state, { startAt: new Date().toISOString() });
        });
      }
    }, [quiz.finished, quiz.startAt]);

    function goTo(index) {
      props.setQuiz(function (state) {
        return Object.assign({}, state, { current: index });
      });
      window.setTimeout(function () {
        scrollToId('quiz-anchor');
      }, 10);
    }

    function updateAnswer(value) {
      if (isChecked) return;
      setAnswerError('');
      props.setQuiz(function (state) {
        const nextAnswers = Object.assign({}, state.answers);
        nextAnswers[question.id] = value;
        return Object.assign({}, state, { answers: nextAnswers });
      });
    }

    function checkAnswer() {
      if (!String(currentAnswer).trim()) {
        setAnswerError('Tulis jawabanmu terlebih dahulu, lalu tekan Periksa jawaban.');
        return;
      }
      setAnswerError('');
      props.setQuiz(function (state) {
        const nextChecked = Object.assign({}, state.checked);
        nextChecked[question.id] = true;
        return Object.assign({}, state, { checked: nextChecked });
      });
    }

    function nextQuestion() {
      if (currentIndex < TOTAL - 1) {
        goTo(currentIndex + 1);
      } else {
        setFinishOpen(true);
      }
    }

    function finishQuiz() {
      const started = quiz.startAt ? new Date(quiz.startAt).getTime() : Date.now();
      const durationSec = Math.max(1, Math.round((Date.now() - started) / 1000));
      const items = QUESTIONS.map(function (item) {
        const answer = String(quiz.answers[item.id] || '').trim();
        return {
          id: item.id,
          answer: answer,
          correct: isAnswerCorrect(item, answer)
        };
      });
      const correct = items.filter(function (item) { return item.correct; }).length;
      const result = {
        id: 'attempt_' + Date.now(),
        at: new Date().toISOString(),
        name: profile.name || 'Tanpa nama',
        kelas: profile.kelas || '-',
        score: (correct / TOTAL) * 100,
        correct: correct,
        total: TOTAL,
        durationSec: durationSec,
        items: items
      };
      setFinishOpen(false);
      props.onFinish(result);
    }

    /* ------------------------------------------------------------
       Tampilan setelah latihan selesai
       ------------------------------------------------------------ */
    if (quiz.finished) {
      const latest = attempts[0] || null;
      return html`<div className="page quiz-page">
        <${PageHead}
          eyebrow="Latihan soal"
          title="8 Soal Aturan Sinus & Kosinus"
          lead="Latihan yang sudah selesai. Buka hasil untuk melihat rincian jawaban, atau kerjakan ulang untuk memperbaiki skor."
          meta=${html`<span key="a" className="pill pill-soft"><${Icon} name="target" size=${13} /> 8 soal</span>
            <span key="b" className="pill pill-soft"><${Icon} name="chart" size=${13} /> 100 poin</span>
            <span key="c" className="pill pill-soft"><${Icon} name="checkCircle" size=${13} /> Selesai</span>`}
        />
        <section className="card quiz-complete-card">
          <span className="quiz-complete-badge"><${Icon} name="trophy" size=${26} /></span>
          <span className="mini-kicker">Latihan selesai</span>
          <h2>Kerja bagus${profile.name ? ', ' + firstName(profile.name) : ''}!</h2>
          <p>Kamu telah menyelesaikan delapan soal aturan sinus dan kosinus. Lihat rincian pembahasan untuk memahami setiap langkah.</p>
          ${latest
            ? html`<div className="quiz-complete-score">
                <strong>${formatNum(latest.score)}</strong>
                <span>/ 100</span>
              </div>
              <div className="quiz-complete-meta">
                <span><${Icon} name="checkCircle" size=${15} /> ${latest.correct} benar</span>
                <span><${Icon} name="xCircle" size=${15} /> ${latest.total - latest.correct} salah</span>
                <span><${Icon} name="clock" size=${15} /> ${formatDuration(latest.durationSec)}</span>
              </div>`
            : html`<p className="quiz-complete-noresult">Belum ada data hasil yang tersimpan.</p>`}
          <div className="quiz-complete-actions">
            <a className="btn btn-primary" href="#/hasil"><${Icon} name="chart" size=${16} /> Lihat hasil</a>
            <button type="button" className="btn btn-ghost" onClick=${props.onRestart}><${Icon} name="rotate" size=${16} /> Kerjakan ulang</button>
            <a className="btn btn-ghost" href="#/materi/memilih"><${Icon} name="book" size=${16} /> Buka materi</a>
          </div>
        </section>
      </div>`;
    }

    /* ------------------------------------------------------------
       Tampilan pengerjaan
       ------------------------------------------------------------ */
    return html`<div className="page quiz-page">
      <${PageHead}
        eyebrow="Latihan soal"
        title="8 Soal Aturan Sinus & Kosinus"
        lead="Kerjakan soal satu per satu. Setiap jawaban langsung diperiksa, diberi pembahasan, dan disimpan otomatis di browser."
        meta=${html`<span key="a" className="pill pill-soft"><${Icon} name="target" size=${13} /> 8 soal</span>
          <span key="b" className="pill pill-soft"><${Icon} name="chart" size=${13} /> 12,5 poin per soal</span>
          <span key="c" className="pill pill-soft"><${Icon} name="lock" size=${13} /> Autosave lokal</span>`}
      />

      ${!profile.name &&
      html`<div className="notice notice-warn">
        <span className="notice-icon"><${Icon} name="alert" size=${19} /></span>
        <div className="notice-copy">
          <strong>Identitas belum diisi</strong>
          <span>Hasil latihan tetap bisa dikerjakan, tetapi nama dan kelas pada laporan akan kosong.</span>
        </div>
        <a className="btn btn-ghost btn-sm" href="#/beranda">Isi identitas</a>
      </div>`}

      <div className="quiz-layout" id="quiz-anchor">
        <section className="card question-card">
          <div className="q-topbar">
            <span className="q-count">Soal ${currentIndex + 1} <b>/ ${TOTAL}</b></span>
            <div className="q-badges">
              <span className="pill pill-navy">${question.category}</span>
              <span className="pill pill-soft">${question.level}</span>
            </div>
          </div>
          <h2 className="question-title">${question.title}</h2>
          <p className="question-stem">${question.stem}</p>

          <div className="given-block">
            <span className="given-label"><${Icon} name="list" size=${14} /> Diketahui</span>
            <div className="given-grid">
              ${question.given.map(function (item, index) {
                return html`<div key=${index} className="given-item">
                  <span>${item.label}</span>
                  <strong>${item.value}</strong>
                </div>`;
              })}
            </div>
          </div>
          <div className="asked-row">
            <span className="asked-label"><${Icon} name="target" size=${14} /> Ditanya</span>
            <strong>${question.asked}</strong>
          </div>

          <div className="answer-panel">
            <div className="answer-label-row">
              <label htmlFor="jawaban-soal">Jawabanmu</label>
              <span className="answer-points">${POIN.toLocaleString('id-ID')} poin</span>
            </div>
            <div className=${cx(
              'input-shell',
              isChecked && (isCorrect ? 'is-correct' : 'is-wrong'),
              answerError && 'has-error'
            )}>
              <input
                id="jawaban-soal"
                type="text"
                inputMode="decimal"
                value=${currentAnswer}
                onChange=${function (event) { updateAnswer(event.target.value); }}
                placeholder=${'Contoh: ' + (question.unit === 'cm' ? '14,14' : '122,67')}
                disabled=${isChecked}
                autoComplete="off"
                aria-describedby="answer-help"
              />
              <span className="input-unit">${question.unit}</span>
              ${isChecked &&
              html`<span className="input-status"><${Icon} name=${isCorrect ? 'checkCircle' : 'xCircle'} size=${19} /></span>`}
            </div>
            <div className="answer-help" id="answer-help">
              <span>Bulatkan dua angka desimal. Gunakan koma atau titik.</span>
              <span>Toleransi pembulatan ±0,06</span>
            </div>
            ${answerError && html`<div className="field-error answer-field-error"><${Icon} name="alert" size=${14} /> ${answerError}</div>`}
            ${hintOpen &&
            html`<div className="hint-box">
              <span className="hint-icon"><${Icon} name="lightbulb" size=${17} /></span>
              <div><strong>Petunjuk</strong><p>${question.hint}</p></div>
            </div>`}
          </div>

          <div className="question-actions">
            <div className="question-actions-left">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick=${function () { goTo(currentIndex - 1); }}
                disabled=${currentIndex === 0}
              ><${Icon} name="arrowLeft" size=${15} /> Sebelumnya</button>
              ${!isChecked &&
              html`<button type="button" className="btn btn-ghost btn-sm" onClick=${function () { setHintOpen(!hintOpen); }}>
                <${Icon} name="lightbulb" size=${15} /> ${hintOpen ? 'Tutup petunjuk' : 'Petunjuk'}
              </button>`}
            </div>
            <div className="question-actions-right">
              ${!isChecked
                ? html`<button type="button" className="btn btn-primary" onClick=${checkAnswer}>
                    Periksa jawaban <${Icon} name="check" size=${16} />
                  </button>`
                : html`<button type="button" className="btn btn-primary" onClick=${nextQuestion}>
                    ${currentIndex === TOTAL - 1 ? 'Selesaikan latihan' : 'Soal berikutnya'}
                    <${Icon} name="arrowRight" size=${16} />
                  </button>`}
            </div>
          </div>

          ${isChecked &&
          html`<div className=${cx('feedback-box', isCorrect ? 'feedback-good' : 'feedback-bad')}>
            <div className="feedback-head">
              <span className="feedback-icon"><${Icon} name=${isCorrect ? 'checkCircle' : 'xCircle'} size=${22} /></span>
              <div>
                <strong>${isCorrect ? 'Jawaban tepat!' : 'Belum tepat, tapi bisa dipelajari.'}</strong>
                <p>${isCorrect
                  ? 'Langkah dan pemahamanmu sudah benar. Poin penuh untuk soal ini.'
                  : 'Bandingkan jawabanmu dengan langkah penyelesaian berikut, lalu lanjutkan ke soal berikutnya.'}</p>
              </div>
              <span className="feedback-score">+${isCorrect ? '12,5' : '0'}</span>
            </div>
            <div className="feedback-answers">
              <div><span>Jawabanmu</span><b>${currentAnswer ? currentAnswer + ' ' + question.unit : 'Tidak dijawab'}</b></div>
              <div><span>Jawaban benar</span><b>${question.display}</b></div>
            </div>
            <div className="feedback-formula">
              <span>Rumus kunci</span>
              <b>${question.formula}</b>
            </div>
            <div className="feedback-explanation">
              <h4><${Icon} name="pencil" size=${15} /> Pembahasan</h4>
              <ol>
                ${question.steps.map(function (step, index) {
                  return html`<li key=${index}>${step}</li>`;
                })}
              </ol>
              <p>${question.explanation}</p>
            </div>
          </div>`}
        </section>

        <aside className="card quiz-sidebar">
          <div className="quiz-side-head">
            <div>
              <span className="mini-kicker">Progres latihan</span>
              <h3>${checkedCount} dari ${TOTAL} diperiksa</h3>
            </div>
            <span className="autosave-dot" title="Jawaban disimpan otomatis"></span>
          </div>
          <${ProgressBar} value=${(checkedCount / TOTAL) * 100} label="Progres latihan" />
          <div className="quiz-mini-stats">
            <span><i className="dot-correct"></i>${correctCount} benar</span>
            <span><i className="dot-wrong"></i>${wrongCount} salah</span>
            <span><i className="dot-pending"></i>${TOTAL - checkedCount} tersisa</span>
          </div>
          <div className="num-grid" aria-label="Navigasi nomor soal">
            ${QUESTIONS.map(function (item, index) {
              const checked = Boolean(quiz.checked[item.id]);
              const correct = checked && isAnswerCorrect(item, quiz.answers[item.id]);
              return html`<button
                key=${item.id}
                type="button"
                className=${cx(
                  'num-btn',
                  index === currentIndex && 'is-current',
                  checked && (correct ? 'is-correct' : 'is-wrong'),
                  !checked && String(quiz.answers[item.id] || '').trim() && 'is-typed'
                )}
                onClick=${function () { goTo(index); }}
                aria-label=${'Buka soal ' + (index + 1) + (checked ? (correct ? ', benar' : ', belum tepat') : ', belum diperiksa')}
                aria-current=${index === currentIndex ? 'step' : undefined}
              >${index + 1}</button>`;
            })}
          </div>
          <div className="num-legend">
            <span><i className="dot-correct"></i>Benar</span>
            <span><i className="dot-wrong"></i>Belum tepat</span>
            <span><i className="dot-pending"></i>Belum diperiksa</span>
          </div>
          <div className="quiz-side-tip">
            <${Icon} name="info" size=${15} />
            <p>Jawaban yang belum diperiksa tetap disimpan. Kamu bisa berpindah soal kapan saja.</p>
          </div>
          <button type="button" className="btn btn-primary btn-block" onClick=${function () { setFinishOpen(true); }}>
            <${Icon} name="flag" size=${16} /> Selesaikan latihan
          </button>
          <a className="btn btn-ghost btn-block btn-sm quiz-side-link" href="#/materi/memilih">
            <${Icon} name="book" size=${15} /> Buka ringkasan materi
          </a>
        </aside>
      </div>

      <${Modal}
        open=${finishOpen}
        onClose=${function () { setFinishOpen(false); }}
        title="Selesaikan latihan?"
        icon="flag"
        footer=${html`<button type="button" className="btn btn-ghost" onClick=${function () { setFinishOpen(false); }}>
            Periksa lagi
          </button>
          <button type="button" className="btn btn-primary" onClick=${finishQuiz}>
            Ya, selesaikan <${Icon} name="arrowRight" size=${15} />
          </button>`}
      >
        ${checkedCount < TOTAL
          ? html`<p>Masih ada <strong>${TOTAL - checkedCount} soal</strong> yang belum diperiksa. Jawaban yang sudah diketik akan tetap dinilai; soal yang kosong dihitung salah.</p>`
          : html`<p>Semua soal sudah diperiksa. Skor akhir dan rincian pembahasan akan disimpan di halaman hasil.</p>`}
        <div className="modal-stat-grid">
          <div><span>Diperiksa</span><strong>${checkedCount}/${TOTAL}</strong></div>
          <div><span>Benar</span><strong>${correctCount}</strong></div>
          <div><span>Poin sementara</span><strong>${formatNum((correctCount / TOTAL) * 100)}</strong></div>
        </div>
        <p className="modal-small">Setelah diselesaikan, kamu tetap dapat mengulang latihan dari awal.</p>
      <//>
    </div>`;
  }

  window.LKPD_PAGES = window.LKPD_PAGES || {};
  window.LKPD_PAGES.QuizPage = QuizPage;
})();
