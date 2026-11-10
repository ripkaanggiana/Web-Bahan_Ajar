/* ============================================================
   Matematika LKPD — Halaman Materi
   ============================================================ */
(function () {
  'use strict';

  const C = window.LKPD_CORE;
  const {
    html,
    useState,
    Icon,
    PageHead,
    ProgressBar,
    TriangleFigure,
    SolutionStepper,
    CheckPrompt,
    Frac,
    Callout,
    cx
  } = C;
  const TOPICS = window.LKPD_CONTENT.TOPICS;

  /* ------------------------------------------------------------
     Komponen kecil khusus materi
     ------------------------------------------------------------ */
  function RichSection(props) {
    return html`<section className=${cx('rich-section', props.className)}>
      <div className="rich-label">
        <span>${props.label}</span>
        <strong>${props.title}</strong>
      </div>
      ${props.children}
    </section>`;
  }

  function SideFrac(props) {
    return html`<${Frac}
      top=${html`<i>${props.side}</i>`}
      bottom=${html`sin <i>${props.angle}</i>`}
      className=${props.className}
    />`;
  }

  function FormulaQuiz() {
    const scenarios = [
      {
        id: 1,
        text: 'Diketahui ∠A = 35°, ∠B = 65°, dan sisi b = 8 cm. Tentukan sisi a.',
        answer: 'sinus',
        reason: 'Dua sudut dan satu sisi diketahui. Pasangan b–∠B sudah lengkap, jadi gunakan aturan sinus.'
      },
      {
        id: 2,
        text: 'Diketahui b = 6 cm, c = 9 cm, dan ∠A = 50°. Tentukan sisi a.',
        answer: 'kosinus',
        reason: 'Sisi b dan c mengapit ∠A, lalu sisi a dicari. Ini pola dua sisi + sudut apit, gunakan aturan kosinus.'
      },
      {
        id: 3,
        text: 'Diketahui a = 7 cm, b = 8 cm, dan c = 10 cm. Tentukan besar ∠C.',
        answer: 'kosinus',
        reason: 'Ketiga sisi diketahui. Besar sudut dihitung dengan bentuk cos C = (a² + b² − c²) / (2ab).'
      },
      {
        id: 4,
        text: 'Diketahui a = 12 cm, b = 15 cm, dan ∠B = 48°. Tentukan besar ∠A.',
        answer: 'sinus',
        reason: 'Dua sisi dan satu sudut di hadapan salah satu sisi diketahui. Gunakan aturan sinus: sin A / a = sin B / b.'
      }
    ];

    const [choices, setChoices] = useState({});

    function choose(id, value) {
      setChoices(function (current) {
        if (current[id]) return current;
        const next = Object.assign({}, current);
        next[id] = value;
        return next;
      });
    }

    const answered = Object.keys(choices).length;
    const correct = scenarios.filter(function (item) {
      return choices[item.id] === item.answer;
    }).length;

    return html`<div className="formula-quiz">
      <div className="formula-quiz-head">
        <div>
          <span className="mini-kicker">Latihan cepat</span>
          <h3>Pilih rumus yang tepat</h3>
        </div>
        <span className="quiz-score-chip">${correct}/${answered} tepat</span>
      </div>
      ${scenarios.map(function (item) {
        const choice = choices[item.id];
        const isCorrect = choice === item.answer;
        return html`<div key=${item.id} className=${cx('scenario-card', choice && (isCorrect ? 'is-correct' : 'is-wrong'))}>
          <div className="scenario-text">
            <span className="scenario-num">${item.id}</span>
            <p>${item.text}</p>
          </div>
          <div className="scenario-actions">
            <button
              type="button"
              className=${cx('choice-btn', choice === 'sinus' && (item.answer === 'sinus' ? 'choice-correct' : 'choice-wrong'))}
              onClick=${function () { choose(item.id, 'sinus'); }}
              disabled=${Boolean(choice)}
            >Aturan Sinus</button>
            <button
              type="button"
              className=${cx('choice-btn', choice === 'kosinus' && (item.answer === 'kosinus' ? 'choice-correct' : 'choice-wrong'))}
              onClick=${function () { choose(item.id, 'kosinus'); }}
              disabled=${Boolean(choice)}
            >Aturan Kosinus</button>
          </div>
          ${choice &&
          html`<div className=${cx('scenario-feedback', isCorrect ? 'is-good' : 'is-bad')}>
            <${Icon} name=${isCorrect ? 'checkCircle' : 'xCircle'} size=${16} />
            <span><strong>${isCorrect ? 'Tepat.' : 'Belum tepat.'}</strong> ${item.reason}</span>
          </div>`}
        </div>`;
      })}
      ${answered === scenarios.length &&
      html`<button type="button" className="btn btn-soft btn-sm formula-quiz-reset" onClick=${function () { setChoices({}); }}>
        <${Icon} name="rotate" size=${14} /> Ulangi pilihan
      </button>`}
    </div>`;
  }

  /* ------------------------------------------------------------
     Isi tiap topik
     ------------------------------------------------------------ */
  function PengantarBody() {
    return html`<div className="topic-body">
      <${RichSection} label="01" title="Dua rumus, satu tujuan" className="rich-section-first">
        <p className="explanation-text">
          Pada segitiga siku-siku, sisi dan sudut dapat dihitung dengan perbandingan
          trigonometri biasa. Namun, banyak situasi nyata menghasilkan segitiga yang
          tidak memiliki sudut siku-siku. Di sinilah <strong>Aturan Sinus</strong> dan
          <strong> Aturan Kosinus</strong> berperan.
        </p>
        <div className="concept-grid">
          <div className="concept-card">
            <div className="concept-top"><span className="concept-num">01</span><h3>Aturan Sinus</h3></div>
            <div className="mini-formula"><i>a</i> / sin <i>A</i> = <i>b</i> / sin <i>B</i> = <i>c</i> / sin <i>C</i></div>
            <p>Membandingkan setiap sisi dengan sinus sudut di hadapannya.</p>
            <span className="concept-tag">Kuat saat pasangan sisi–sudut diketahui</span>
          </div>
          <div className="concept-card concept-card-mint">
            <div className="concept-top"><span className="concept-num">02</span><h3>Aturan Kosinus</h3></div>
            <div className="mini-formula"><i>a</i><sup>2</sup> = <i>b</i><sup>2</sup> + <i>c</i><sup>2</sup> − 2<i>bc</i> cos <i>A</i></div>
            <p>Menghubungkan ketiga sisi dengan besar satu sudut di antaranya.</p>
            <span className="concept-tag">Kuat saat dua sisi mengapit sudut</span>
          </div>
        </div>
        <${Callout} icon="lightbulb" title="Aturan kosinus adalah perluasan Pythagoras" tone="sky">
          Jika ∠A = 90°, maka cos 90° = 0 sehingga <strong>a² = b² + c²</strong>.
          Teorema Pythagoras hanyalah kasus khusus dari aturan kosinus.
        <//>
      <//>

      <${RichSection} label="02" title="Kesepakatan penamaan pada segitiga ABC">
        <p className="explanation-text">
          Agar rumus tidak tertukar, gunakan kesepakatan berikut. Nama sudut memakai
          huruf kapital, sedangkan nama sisi memakai huruf kecil yang sesuai.
        </p>
        <div className="figure-card">
          <${TriangleFigure} mode="netral" />
          <figcaption className="figure-caption">
            <span className="figure-caption-title">Segitiga sembarang ABC</span>
            <ul className="figure-list">
              <li><b>Sisi a</b> berhadapan dengan ∠A (yaitu BC).</li>
              <li><b>Sisi b</b> berhadapan dengan ∠B (yaitu AC).</li>
              <li><b>Sisi c</b> berhadapan dengan ∠C (yaitu AB).</li>
              <li><b>Jumlah sudut:</b> A + B + C = 180°.</li>
            </ul>
          </figcaption>
        </div>
      <//>

      <${RichSection} label="03" title="Tiga kebiasaan yang membuat hitungan akurat">
        <div className="habit-grid">
          <div className="habit-card">
            <span className="habit-icon"><${Icon} name="calculator" size=${19} /></span>
            <h4>Mode derajat</h4>
            <p>Pastikan kalkulator berada pada mode DEG (derajat), bukan radian.</p>
          </div>
          <div className="habit-card">
            <span className="habit-icon"><${Icon} name="ruler" size=${19} /></span>
            <h4>Bulatkan di akhir</h4>
            <p>Simpan angka desimal selama menghitung. Bulatkan hasil akhir, biasanya dua angka desimal.</p>
          </div>
          <div className="habit-card">
            <span className="habit-icon"><${Icon} name="triangle" size=${19} /></span>
            <h4>Periksa kelogisan</h4>
            <p>Sisi terpanjang harus berhadapan dengan sudut terbesar. Hasil negatif untuk panjang sisi berarti ada kekeliruan.</p>
          </div>
        </div>
        <${CheckPrompt}
          question="Pada segitiga ABC, sisi manakah yang berhadapan dengan ∠B?"
          answer=${html`Sisi <strong>b</strong>, yaitu sisi AC. Sisi b selalu berpasangan dengan sudut B.`}
        />
      <//>
    </div>`;
  }

  function SinusBody() {
    return html`<div className="topic-body">
      <${RichSection} label="01" title="Rumus Aturan Sinus" className="rich-section-first">
        <div className="formula-card formula-card-navy">
          <span className="formula-watermark">sin</span>
          <span className="formula-kicker">Rumus utama · perbandingan sisi dan sudut</span>
          <div className="formula-scroll">
            <div className="formula-line">
              <${SideFrac} side="a" angle="A" />
              <span className="formula-eq">=</span>
              <${SideFrac} side="b" angle="B" />
              <span className="formula-eq">=</span>
              <${SideFrac} side="c" angle="C" />
            </div>
          </div>
          <div className="formula-divider"></div>
          <div className="formula-sub-line">
            <span className="formula-sub-label">Bentuk ekuivalen untuk mencari sudut</span>
            <div className="formula-line formula-line-sm">
              <${Frac} top=${html`sin <i>A</i>`} bottom=${html`<i>a</i>`} />
              <span className="formula-eq">=</span>
              <${Frac} top=${html`sin <i>B</i>`} bottom=${html`<i>b</i>`} />
              <span className="formula-eq">=</span>
              <${Frac} top=${html`sin <i>C</i>`} bottom=${html`<i>c</i>`} />
            </div>
          </div>
          <p className="formula-note">
            <strong>a, b, c</strong> adalah panjang sisi; <strong>A, B, C</strong> adalah
            besar sudut di hadapan sisi tersebut. Semua sudut dinyatakan dalam derajat.
          </p>
        </div>
        <p className="explanation-text">
          Aturan Sinus menyatakan bahwa perbandingan panjang sisi dengan sinus sudut
          di hadapannya selalu sama untuk ketiga sisi. Jika satu pasangan sisi–sudut
          diketahui, kita dapat mencari unsur lain yang berpasangan.
        </p>
      <//>

      <${RichSection} label="02" title="Kapan Aturan Sinus digunakan?">
        <div className="condition-grid">
          <div className="condition-card">
            <span className="condition-icon"><${Icon} name="triangle" size=${21} /></span>
            <span className="condition-tag">Kondisi 1</span>
            <h4>Dua sudut + satu sisi</h4>
            <p>Dua sudut dan satu sisi diketahui, lalu sisi lain atau sudut ketiga dicari.</p>
            <span className="condition-example">Contoh: ∠A, ∠B, sisi a → cari b</span>
          </div>
          <div className="condition-card condition-card-mint">
            <span className="condition-icon"><${Icon} name="ruler" size=${21} /></span>
            <span className="condition-tag">Kondisi 2</span>
            <h4>Dua sisi + satu sudut di hadapannya</h4>
            <p>Diketahui dua sisi dan sudut yang berhadapan dengan salah satu sisi tersebut.</p>
            <span className="condition-example">Contoh: sisi a, sisi b, ∠B → cari ∠A</span>
          </div>
        </div>
        <div className="figure-card figure-card-compact">
          <${TriangleFigure} mode="sinus" />
          <figcaption className="figure-caption">
            <span className="figure-caption-title">Perhatikan pasangannya</span>
            <p>Gunakan <b>a dengan ∠A</b>, <b>b dengan ∠B</b>, dan <b>c dengan ∠C</b>. Jangan mencampur sisi dengan sudut yang tidak berhadapan.</p>
          </figcaption>
        </div>
      <//>

      <${RichSection} label="03" title="Contoh soal bertahap">
        <${SolutionStepper}
          prompt=${html`Pada segitiga ABC, diketahui ∠A = 40°, ∠B = 75°, dan sisi a = 12 cm. Tentukan panjang sisi b.`}
          steps=${[
            {
              title: 'Tulis pasangan sisi–sudut yang diketahui',
              body: html`<div className="calc-line">b / sin 75° = a / sin 40°</div><p>Pasangan b–∠B dan a–∠A. Sudut C tidak diperlukan.</p>`
            },
            {
              title: 'Substitusikan panjang sisi yang diketahui',
              body: html`<div className="calc-line">b / sin 75° = 12 / sin 40°</div>`
            },
            {
              title: 'Kalikan silang untuk memisahkan b',
              body: html`<div className="calc-line">b = 12 × sin 75° / sin 40°</div>`
            },
            {
              title: 'Hitung dengan kalkulator mode derajat',
              body: html`<div className="calc-line">b ≈ 12 × 0,9659 / 0,6428 ≈ 18,03</div><p>Bulatkan hasil akhir menjadi dua angka desimal.</p>`
            }
          ]}
          result=${html`b ≈ <strong>18,03 cm</strong>`}
          note="Sudut C = 180° − 40° − 75° = 65°. Sudut ini tidak wajib dicari karena pasangan a–∠A dan b–∠B sudah lengkap."
        />
      <//>

      <${RichSection} label="04" title="Catatan penting">
        <${Callout} icon="alert" title="Pasangan harus tepat" tone="warn">
          Sisi <b>a</b> selalu berpasangan dengan <b>∠A</b>, bukan ∠B atau ∠C.
          Menukar pasangan akan menghasilkan jawaban yang salah meskipun bentuk rumusnya terlihat benar.
        <//>
        <${CheckPrompt}
          question="Pada segitiga PQR, diketahui ∠P = 50°, ∠Q = 60°, dan sisi p = 9 cm. Sisi q berpasangan dengan sudut mana?"
          answer=${html`∠Q. Hubungan yang digunakan adalah <b>q / sin 60° = 9 / sin 50°</b>.`}
        />
      <//>
    </div>`;
  }

  function KosinusBody() {
    return html`<div className="topic-body">
      <${RichSection} label="01" title="Rumus Aturan Kosinus" className="rich-section-first">
        <div className="formula-card formula-card-navy">
          <span className="formula-watermark">cos</span>
          <span className="formula-kicker">Rumus utama · tiga sisi dan satu sudut</span>
          <div className="formula-columns">
            <div className="formula-block">
              <span className="formula-block-title">Mencari panjang sisi</span>
              <div className="formula-row"><span className="formula-tag">sisi a</span><span><i>a</i><sup>2</sup> = <i>b</i><sup>2</sup> + <i>c</i><sup>2</sup> − 2<i>bc</i> cos <i>A</i></span></div>
              <div className="formula-row"><span className="formula-tag">sisi b</span><span><i>b</i><sup>2</sup> = <i>a</i><sup>2</sup> + <i>c</i><sup>2</sup> − 2<i>ac</i> cos <i>B</i></span></div>
              <div className="formula-row"><span className="formula-tag">sisi c</span><span><i>c</i><sup>2</sup> = <i>a</i><sup>2</sup> + <i>b</i><sup>2</sup> − 2<i>ab</i> cos <i>C</i></span></div>
            </div>
            <div className="formula-block">
              <span className="formula-block-title">Mencari besar sudut</span>
              <div className="formula-row"><span className="formula-tag">∠A</span><span>cos <i>A</i> = <${Frac} top=${html`<i>b</i><sup>2</sup> + <i>c</i><sup>2</sup> − <i>a</i><sup>2</sup>`} bottom=${html`2<i>bc</i>`} className="frac-inline" /></span></div>
              <div className="formula-row"><span className="formula-tag">∠B</span><span>cos <i>B</i> = <${Frac} top=${html`<i>a</i><sup>2</sup> + <i>c</i><sup>2</sup> − <i>b</i><sup>2</sup>`} bottom=${html`2<i>ac</i>`} className="frac-inline" /></span></div>
              <div className="formula-row"><span className="formula-tag">∠C</span><span>cos <i>C</i> = <${Frac} top=${html`<i>a</i><sup>2</sup> + <i>b</i><sup>2</sup> − <i>c</i><sup>2</sup>`} bottom=${html`2<i>ab</i>`} className="frac-inline" /></span></div>
            </div>
          </div>
          <p className="formula-note">
            Sudut A diapit oleh sisi b dan c. Sudut B diapit oleh sisi a dan c.
            Sudut C diapit oleh sisi a dan b.
          </p>
        </div>
        <p className="explanation-text">
          Aturan Kosinus dipakai ketika informasi yang tersedia tidak membentuk
          pasangan sisi–sudut yang lengkap. Rumus ini menghubungkan <strong>tiga sisi</strong>
          dengan <strong>satu sudut</strong>, sehingga dapat menyelesaikan masalah dua sisi
          dan sudut apit, maupun tiga sisi.
        </p>
      <//>

      <${RichSection} label="02" title="Kapan Aturan Kosinus digunakan?">
        <div className="condition-grid">
          <div className="condition-card">
            <span className="condition-icon"><${Icon} name="compass" size=${21} /></span>
            <span className="condition-tag">Kondisi 1</span>
            <h4>Dua sisi + sudut apit</h4>
            <p>Diketahui dua sisi dan sudut yang diapit oleh keduanya, lalu sisi ketiga dicari.</p>
            <span className="condition-example">Contoh: sisi b, sisi c, ∠A → cari a</span>
          </div>
          <div className="condition-card condition-card-mint">
            <span className="condition-icon"><${Icon} name="layers" size=${21} /></span>
            <span className="condition-tag">Kondisi 2</span>
            <h4>Tiga sisi</h4>
            <p>Ketiga panjang sisi diketahui, lalu besar salah satu sudut ditentukan.</p>
            <span className="condition-example">Contoh: a, b, c → cari ∠C</span>
          </div>
        </div>
        <div className="figure-card figure-card-compact">
          <${TriangleFigure} mode="kosinus" />
          <figcaption className="figure-caption">
            <span className="figure-caption-title">Kenali sudut apit</span>
            <p>Sudut apit adalah sudut yang dibentuk oleh dua sisi yang diketahui. Pada gambar, sisi b dan c mengapit ∠A.</p>
          </figcaption>
        </div>
      <//>

      <${RichSection} label="03" title="Contoh soal bertahap">
        <${SolutionStepper}
          prompt=${html`Pada segitiga ABC, diketahui b = 9 cm, c = 7 cm, dan ∠A = 120°. Tentukan panjang sisi a.`}
          steps=${[
            {
              title: 'Pilih rumus sisi yang sesuai',
              body: html`<div className="calc-line">a² = b² + c² − 2bc cos A</div><p>Sisi b dan c mengapit ∠A, sedangkan sisi a berada di hadapan ∠A.</p>`
            },
            {
              title: 'Substitusikan nilai yang diketahui',
              body: html`<div className="calc-line">a² = 9² + 7² − 2 · 9 · 7 · cos 120°</div>`
            },
            {
              title: 'Gunakan cos 120° = −½',
              body: html`<div className="calc-line">a² = 81 + 49 − 126 × (−½)</div><div className="calc-line">a² = 130 + 63 = 193</div>`
            },
            {
              title: 'Ambil akar kuadrat',
              body: html`<div className="calc-line">a = √193 ≈ 13,89</div><p>Panjang sisi selalu positif.</p>`
            }
          ]}
          result=${html`a ≈ <strong>13,89 cm</strong>`}
          note="Karena sudutnya tumpul (120°), nilai cosinus negatif. Pengurangan dengan bilangan negatif membuat a² lebih besar."
        />
        <${Callout} icon="calculator" title="Jika yang dicari sudut" tone="sky">
          Setelah sisi-sisi diketahui, gunakan bentuk cos A = (b² + c² − a²) / (2bc).
          Hasil cosinus kemudian diubah menjadi sudut dengan tombol <b>cos⁻¹</b> pada kalkulator.
        <//>
      <//>

      <${RichSection} label="04" title="Cek pemahaman">
        <${CheckPrompt}
          question="Diketahui a = 7 cm, b = 8 cm, dan c = 10 cm. Bagaimana cara menentukan ∠C?"
          answer=${html`Gunakan <b>cos C = (a² + b² − c²) / (2ab) = (49 + 64 − 100) / 112 = 13/112 ≈ 0,1161</b>. Dengan cos⁻¹, diperoleh ∠C ≈ 83,3°.`}
        />
        <${Callout} icon="alert" title="Jangan lupa sudut apit" tone="warn">
          Untuk mencari sisi dengan aturan kosinus, pastikan sudut yang diketahui
          benar-benar diapit oleh dua sisi yang diketahui. Jika sudutnya tidak apit,
          kemungkinan besar kamu perlu aturan sinus.
        <//>
      <//>
    </div>`;
  }

  function MemilihBody(props) {
    return html`<div className="topic-body">
      <${RichSection} label="01" title="Tabel keputusan cepat" className="rich-section-first">
        <p className="explanation-text">
          Sebelum menghitung, daftar dulu apa yang diketahui. Empat pola berikut
          mencakup hampir semua soal aturan sinus dan kosinus di tingkat SMA.
        </p>
        <div className="decision-table">
          <div className="decision-row decision-head">
            <span>Informasi yang diketahui</span>
            <span>Rumus</span>
            <span>Alasan singkat</span>
          </div>
          ${[
            ['Dua sudut + satu sisi', 'Aturan Sinus', 'Sudah ada pasangan sisi–sudut yang lengkap.'],
            ['Dua sisi + sudut di hadapan salah satu sisi', 'Aturan Sinus', 'Sudut diketahui berpasangan dengan salah satu sisi.'],
            ['Dua sisi + sudut apit', 'Aturan Kosinus', 'Sudut diapit oleh dua sisi yang diketahui.'],
            ['Tiga sisi', 'Aturan Kosinus', 'Sudut dicari dari hubungan ketiga sisi.']
          ].map(function (row, index) {
            return html`<div key=${index} className="decision-row">
              <span className="decision-info">${row[0]}</span>
              <span className=${cx('decision-answer', row[1] === 'Aturan Sinus' ? 'answer-sinus' : 'answer-kosinus')}>${row[1]}</span>
              <span className="decision-reason">${row[2]}</span>
            </div>`;
          })}
        </div>
      <//>

      <${RichSection} label="02" title="Alur berpikir saat menemui soal">
        <div className="flow-steps">
          <div className="flow-step"><span>1</span><div><strong>Daftar yang diketahui</strong><small>Sudut, sisi, dan pasangannya.</small></div></div>
          <span className="flow-arrow"><${Icon} name="arrowRight" size=${16} /></span>
          <div className="flow-step"><span>2</span><div><strong>Cari pasangan lengkap</strong><small>Ada sisi dan sudut yang berhadapan?</small></div></div>
          <span className="flow-arrow"><${Icon} name="arrowRight" size=${16} /></span>
          <div className="flow-step"><span>3</span><div><strong>Pilih rumus</strong><small>Pasangan lengkap → sinus. Sudut apit atau tiga sisi → kosinus.</small></div></div>
        </div>
        <${Callout} icon="lightbulb" title="Pertanyaan kunci" tone="sky">
          "Apakah sudut yang diketahui berpasangan dengan sisi yang diketahui?"
          Jika <b>ya</b>, aturan sinus biasanya cukup. Jika <b>tidak</b> dan sudutnya diapit dua sisi, gunakan aturan kosinus.
        <//>
      <//>

      <${RichSection} label="03" title="Latihan memilih rumus" className="practice-section">
        <${FormulaQuiz} />
      <//>

      <${RichSection} label="04" title="Kesalahan yang sering terjadi">
        <div className="mistake-list">
          <div className="mistake-item"><span><${Icon} name="x" size=${15} /></span><p><b>Menukar pasangan sisi–sudut.</b> Sisi a harus berpasangan dengan ∠A.</p></div>
          <div className="mistake-item"><span><${Icon} name="x" size=${15} /></span><p><b>Memakai aturan kosinus tanpa sudut apit.</b> Pastikan sudut berada di antara dua sisi yang diketahui.</p></div>
          <div className="mistake-item"><span><${Icon} name="x" size=${15} /></span><p><b>Lupa mode derajat.</b> Kalkulator dalam mode radian akan memberikan hasil yang sangat berbeda.</p></div>
          <div className="mistake-item"><span><${Icon} name="x" size=${15} /></span><p><b>Membulatkan terlalu awal.</b> Simpan angka desimal hingga hasil akhir.</p></div>
        </div>
        <div className="practice-cta">
          <div>
            <span className="mini-kicker">Siap mencoba?</span>
            <h3>Uji strategimu dengan 8 soal</h3>
            <p>Setiap jawaban mendapat pembahasan dan skor otomatis.</p>
          </div>
          <button type="button" className="btn btn-primary" onClick=${function () { props.navigate('latihan'); }}>
            Mulai latihan <${Icon} name="arrowRight" size=${16} />
          </button>
        </div>
      <//>
    </div>`;
  }

  const TOPIC_BODIES = {
    pengantar: PengantarBody,
    sinus: SinusBody,
    kosinus: KosinusBody,
    memilih: MemilihBody
  };

  /* ------------------------------------------------------------
     Halaman materi
     ------------------------------------------------------------ */
  function MateriPage(props) {
    const routeParts = String(props.route || '').split('/');
    const requested = routeParts[1] || 'pengantar';
    const topic = TOPICS.find(function (item) { return item.id === requested; }) || TOPICS[0];
    const topicIndex = TOPICS.findIndex(function (item) { return item.id === topic.id; });
    const completed = props.completed || [];
    const isDone = completed.indexOf(topic.id) !== -1;
    const Body = TOPIC_BODIES[topic.id];
    const previous = topicIndex > 0 ? TOPICS[topicIndex - 1] : null;
    const next = topicIndex < TOPICS.length - 1 ? TOPICS[topicIndex + 1] : null;

    function toggleDone() {
      props.onToggleTopic(topic.id);
      props.notify(
        isDone ? 'Tanda selesai untuk topik ini dihapus.' : 'Topik "' + topic.title + '" ditandai selesai.',
        isDone ? 'info' : 'success'
      );
    }

    return html`<div className="page materi-page">
      <${PageHead}
        eyebrow="Materi pembelajaran"
        title="Aturan Sinus & Aturan Kosinus"
        lead="Pelajari konsep, rumus, kondisi penggunaan, dan contoh bertahap untuk segitiga sembarang. Pilih topik di bawah atau ikuti urutannya."
        meta=${html`<span className="pill pill-soft"><${Icon} name="book" size=${13} /> 4 topik</span>
          <span className="pill pill-soft"><${Icon} name="clock" size=${13} /> ±22 menit</span>
          <span className="pill pill-soft"><${Icon} name="graduation" size=${13} /> Kelas X</span>`}
      />

      <div className="module-tabs" role="tablist" aria-label="Pilih topik materi">
        ${TOPICS.map(function (item, index) {
          const active = item.id === topic.id;
          const done = completed.indexOf(item.id) !== -1;
          return html`<button
            key=${item.id}
            type="button"
            role="tab"
            aria-selected=${active}
            className=${cx('module-tab', active && 'is-active', done && 'is-done')}
            onClick=${function () { props.navigate('materi/' + item.id); }}
          >
            <span className="tab-top">
              <span className="tab-num">${item.num}</span>
              ${done && html`<${Icon} name="checkCircle" size=${15} className="tab-check" />`}
            </span>
            <strong>${item.title}</strong>
            <small>${item.menuSub}</small>
          </button>`;
        })}
      </div>

      <div className="lesson-layout">
        <aside className="card course-sidebar">
          <div className="course-side-head">
            <div>
              <span className="mini-kicker">Daftar materi</span>
              <h3>Trigonometri</h3>
            </div>
            <span className="course-count">${completed.length}/4</span>
          </div>
          <div className="course-progress-wrap">
            <${ProgressBar} value=${(completed.length / 4) * 100} label="Progres materi" />
          </div>
          <nav className="topic-menu" aria-label="Daftar topik">
            ${TOPICS.map(function (item, index) {
              const active = item.id === topic.id;
              const done = completed.indexOf(item.id) !== -1;
              return html`<a
                key=${item.id}
                href=${'#/materi/' + item.id}
                className=${cx('topic-link', active && 'is-active', done && 'is-done')}
                aria-current=${active ? 'page' : undefined}
              >
                <span className="topic-idx">${done ? html`<${Icon} name="check" size=${14} />` : item.num}</span>
                <span className="topic-link-copy">
                  <small>${item.menuSub}</small>
                  <b>${item.menuTitle}</b>
                </span>
              </a>`;
            })}
          </nav>
          <div className="course-side-foot">
            <p><${Icon} name="lightbulb" size=${15} /> Tandai topik setelah kamu selesai membaca agar progres tercatat.</p>
            <button type="button" className=${cx('btn btn-sm btn-block', isDone ? 'btn-success-soft' : 'btn-soft')} onClick=${toggleDone}>
              <${Icon} name=${isDone ? 'checkCircle' : 'check'} size=${15} />
              ${isDone ? 'Sudah dipelajari' : 'Tandai selesai'}
            </button>
          </div>
        </aside>

        <article className="card lesson-article">
          <div className="topic-kicker">
            <span className="pill pill-navy">Topik ${topic.num}</span>
            <span className="pill pill-soft">${topic.kicker}</span>
            <span className="pill pill-soft"><${Icon} name="clock" size=${13} /> ±${topic.minutes} menit</span>
            ${isDone && html`<span className="pill pill-success"><${Icon} name="checkCircle" size=${13} /> Selesai</span>`}
          </div>
          <h2 className="topic-title">${topic.title}</h2>
          <p className="topic-lead">${topic.lead}</p>

          <${Body} navigate=${props.navigate} />

          <div className="lesson-controls">
            <div className="lesson-control-left">
              ${previous
                ? html`<button type="button" className="btn btn-ghost btn-sm" onClick=${function () { props.navigate('materi/' + previous.id); }}>
                    <${Icon} name="arrowLeft" size=${15} /> ${previous.menuTitle}
                  </button>`
                : html`<a className="btn btn-ghost btn-sm" href="#/beranda"><${Icon} name="home" size=${15} /> Beranda</a>`}
            </div>
            <div className="lesson-control-right">
              <button type="button" className=${cx('btn btn-sm', isDone ? 'btn-success-soft' : 'btn-soft')} onClick=${toggleDone}>
                <${Icon} name=${isDone ? 'checkCircle' : 'check'} size=${15} />
                ${isDone ? 'Sudah dipelajari' : 'Tandai selesai'}
              </button>
              ${next
                ? html`<button type="button" className="btn btn-primary btn-sm" onClick=${function () { props.navigate('materi/' + next.id); }}>
                    ${next.menuTitle} <${Icon} name="arrowRight" size=${15} />
                  </button>`
                : html`<button type="button" className="btn btn-primary btn-sm" onClick=${function () { props.navigate('latihan'); }}>
                    Mulai latihan <${Icon} name="arrowRight" size=${15} />
                  </button>`}
            </div>
          </div>
        </article>
      </div>
    </div>`;
  }

  window.LKPD_PAGES = window.LKPD_PAGES || {};
  window.LKPD_PAGES.MateriPage = MateriPage;
})();
