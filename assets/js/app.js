/* ============================================================
   Matematika LKPD — Aplikasi utama & routing
   ============================================================ */
(function () {
  'use strict';

  const C = window.LKPD_CORE;
  const {
    html,
    useState,
    useEffect,
    useCallback,
    Header,
    Footer,
    ToastViewport,
    useToasts,
    useStoredState,
    KEYS,
    DEFAULT_PROFILE,
    createQuizState,
    resetStoredData,
    formatNum
  } = C;
  const PAGES = window.LKPD_PAGES;

  const VALID_PAGES = ['beranda', 'materi', 'latihan', 'hasil', 'panduan'];

  function parseRoute() {
    const raw = String(window.location.hash || '').replace(/^#\/?/, '').trim();
    return raw || 'beranda';
  }

  function normalizeProfile(value) {
    if (!value || typeof value !== 'object') return { name: '', kelas: '' };
    return {
      name: typeof value.name === 'string' ? value.name : '',
      kelas: typeof value.kelas === 'string' ? value.kelas : ''
    };
  }

  function normalizeQuiz(value) {
    const base = createQuizState();
    if (!value || typeof value !== 'object') return base;
    return {
      answers: value.answers && typeof value.answers === 'object' ? value.answers : {},
      checked: value.checked && typeof value.checked === 'object' ? value.checked : {},
      current: Number.isInteger(value.current) ? value.current : 0,
      startAt: typeof value.startAt === 'string' ? value.startAt : null,
      finished: Boolean(value.finished),
      finishedAt: typeof value.finishedAt === 'string' ? value.finishedAt : null
    };
  }

  function NotFoundPage() {
    return html`<div className="page notfound-page">
      <section className="card empty-result">
        <span className="empty-result-art"><${C.Icon} name="compass" size=${40} /></span>
        <span className="mini-kicker">Halaman tidak ditemukan</span>
        <h2>Sepertinya kamu tersesat</h2>
        <p>Alamat yang dibuka tidak tersedia. Kembali ke beranda untuk melanjutkan belajar.</p>
        <div className="empty-result-actions">
          <a className="btn btn-primary" href="#/beranda">Ke beranda <${C.Icon} name="arrowRight" size=${16} /></a>
        </div>
      </section>
    </div>`;
  }

  function App() {
    const [route, setRoute] = useState(parseRoute);
    const [profileState, setProfile] = useStoredState(KEYS.profile, DEFAULT_PROFILE);
    const [quizState, setQuiz] = useStoredState(KEYS.quiz, createQuizState());
    const [attemptsState, setAttempts] = useStoredState(KEYS.attempts, []);
    const [topicsState, setCompleted] = useStoredState(KEYS.topics, []);
    const toast = useToasts();

    const profile = normalizeProfile(profileState);
    const quiz = normalizeQuiz(quizState);
    const attempts = Array.isArray(attemptsState) ? attemptsState : [];
    const completed = Array.isArray(topicsState) ? topicsState : [];

    useEffect(function () {
      function onHashChange() {
        setRoute(parseRoute());
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
      window.addEventListener('hashchange', onHashChange);
      return function () {
        window.removeEventListener('hashchange', onHashChange);
      };
    }, []);

    const navigate = useCallback(function (path) {
      const target = String(path || 'beranda').replace(/^#\/?/, '');
      if (parseRoute() === target) {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        return;
      }
      window.location.hash = '#/' + target;
    }, []);

    const saveProfile = useCallback(function (nextProfile) {
      setProfile(normalizeProfile(nextProfile));
    }, [setProfile]);

    const toggleTopic = useCallback(function (topicId) {
      setCompleted(function (current) {
        const list = Array.isArray(current) ? current : [];
        if (list.indexOf(topicId) !== -1) {
          return list.filter(function (item) { return item !== topicId; });
        }
        return list.concat([topicId]);
      });
    }, [setCompleted]);

    const finishQuiz = useCallback(function (result) {
      setAttempts(function (current) {
        const list = Array.isArray(current) ? current : [];
        return [result].concat(list).slice(0, 10);
      });
      setQuiz(function (current) {
        return Object.assign({}, normalizeQuiz(current), {
          finished: true,
          finishedAt: result.at
        });
      });
      toast.notify('Latihan selesai. Skor akhirmu ' + formatNum(result.score) + ' dari 100.', 'success');
      navigate('hasil');
    }, [navigate, setAttempts, setQuiz, toast.notify]);

    const restartQuiz = useCallback(function () {
      setQuiz(createQuizState());
      toast.notify('Lembar latihan baru siap dikerjakan.', 'info');
      navigate('latihan');
    }, [navigate, setQuiz, toast.notify]);

    const resetAllData = useCallback(function () {
      resetStoredData();
      setProfile({ name: '', kelas: '' });
      setQuiz(createQuizState());
      setAttempts([]);
      setCompleted([]);
      toast.notify('Semua data belajar telah dihapus dari browser ini.', 'info');
      navigate('beranda');
    }, [navigate, setAttempts, setCompleted, setProfile, setQuiz, toast.notify]);

    useEffect(function () {
      const page = route.split('/')[0] || 'beranda';
      const titles = {
        beranda: 'Beranda',
        materi: 'Materi',
        latihan: 'Latihan Soal',
        hasil: 'Hasil',
        panduan: 'Panduan'
      };
      document.title = 'Matematika LKPD · ' + (titles[page] || 'Trigonometri');
    }, [route]);

    const page = route.split('/')[0] || 'beranda';
    let content = null;

    if (!VALID_PAGES.includes(page)) {
      content = html`<${NotFoundPage} />`;
    } else if (page === 'materi') {
      content = html`<${PAGES.MateriPage}
        route=${route}
        navigate=${navigate}
        completed=${completed}
        onToggleTopic=${toggleTopic}
        notify=${toast.notify}
      />`;
    } else if (page === 'latihan') {
      content = html`<${PAGES.QuizPage}
        quiz=${quiz}
        setQuiz=${setQuiz}
        attempts=${attempts}
        profile=${profile}
        onFinish=${finishQuiz}
        onRestart=${restartQuiz}
      />`;
    } else if (page === 'hasil') {
      content = html`<${PAGES.ResultPage}
        attempts=${attempts}
        profile=${profile}
        onRestart=${restartQuiz}
      />`;
    } else if (page === 'panduan') {
      content = html`<${PAGES.GuidePage}
        profile=${profile}
        attempts=${attempts}
        completed=${completed}
        onReset=${resetAllData}
      />`;
    } else {
      content = html`<${PAGES.HomePage}
        profile=${profile}
        onSaveProfile=${saveProfile}
        navigate=${navigate}
        attempts=${attempts}
        completed=${completed}
        notify=${toast.notify}
      />`;
    }

    return html`<div className="app-root">
      <${Header} route=${route} profile=${profile} />
      <main className="site-main">
        <div className="container">
          <div className="page-stage" key=${route}>${content}</div>
        </div>
      </main>
      <${Footer} />
      <${ToastViewport} toasts=${toast.toasts} />
    </div>`;
  }

  const rootElement = document.getElementById('root');
  if (rootElement && window.ReactDOM) {
    window.ReactDOM.createRoot(rootElement).render(html`<${App} />`);
  }
})();
