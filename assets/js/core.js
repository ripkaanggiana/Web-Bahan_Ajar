/* ============================================================
   Matematika LKPD — Core UI kit
   React 18 (UMD) + HTM, tanpa proses build.
   ============================================================ */
(function () {
  'use strict';

  const React = window.React;
  const { useState, useEffect, useRef, useCallback } = React;
  const html = window.htm.bind(React.createElement);

  /* ------------------------------------------------------------
     Penyimpanan lokal
     ------------------------------------------------------------ */
  const KEYS = {
    profile: 'matematika_lkpd_profile_v1',
    quiz: 'matematika_lkpd_quiz_v1',
    attempts: 'matematika_lkpd_attempts_v1',
    topics: 'matematika_lkpd_topics_v1'
  };

  const DEFAULT_PROFILE = { name: '', kelas: '' };

  function createQuizState() {
    return {
      answers: {},
      checked: {},
      current: 0,
      startAt: null,
      finished: false,
      finishedAt: null
    };
  }

  function clone(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (error) {
      return value;
    }
  }

  function loadJSON(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? clone(fallback) : JSON.parse(raw);
    } catch (error) {
      return clone(fallback);
    }
  }

  function saveJSON(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      /* Penyimpanan penuh atau diblokir: aplikasi tetap berjalan. */
    }
  }

  function useStoredState(key, fallback) {
    const [value, setValue] = useState(function () {
      return loadJSON(key, fallback);
    });
    useEffect(function () {
      saveJSON(key, value);
    }, [key, value]);
    return [value, setValue];
  }

  function resetStoredData() {
    Object.keys(KEYS).forEach(function (name) {
      try {
        window.localStorage.removeItem(KEYS[name]);
      } catch (error) {
        /* abaikan */
      }
    });
  }

  /* ------------------------------------------------------------
     Utilitas
     ------------------------------------------------------------ */
  const numberFormat = new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 2
  });

  function cx() {
    return Array.prototype.slice.call(arguments).filter(Boolean).join(' ');
  }

  function formatNum(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return '—';
    return numberFormat.format(number);
  }

  function formatDate(iso) {
    if (!iso) return '—';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  function formatDateTime(iso) {
    if (!iso) return '—';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '—';
    return (
      date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }) +
      ' · ' +
      date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    );
  }

  function formatDuration(seconds) {
    const total = Number(seconds);
    if (!Number.isFinite(total) || total < 1) return '—';
    const minutes = Math.floor(total / 60);
    const rest = Math.round(total % 60);
    if (minutes === 0) return rest + ' dtk';
    return minutes + ' mnt ' + String(rest).padStart(2, '0') + ' dtk';
  }

  function initialsOf(name) {
    const parts = String(name || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (!parts.length) return '?';
    return parts
      .slice(0, 2)
      .map(function (part) {
        return part.charAt(0).toUpperCase();
      })
      .join('');
  }

  function firstName(name) {
    return String(name || '').trim().split(/\s+/)[0] || 'Siswa';
  }

  function parseNumericAnswer(raw) {
    if (raw === null || raw === undefined) return null;
    const compact = String(raw).replace(/\s+/g, '');
    const match = compact.match(/[-+]?\d+(?:[.,]\d+)?/);
    if (!match) return null;
    const value = Number(match[0].replace(',', '.'));
    return Number.isFinite(value) ? value : null;
  }

  function isAnswerCorrect(question, raw) {
    const value = parseNumericAnswer(raw);
    if (value === null) return false;
    const tolerance =
      typeof question.tolerance === 'number' ? question.tolerance : 0.06;
    return Math.abs(value - question.answer) <= tolerance;
  }

  function scrollToId(id) {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ------------------------------------------------------------
     Ikon garis (inline SVG)
     ------------------------------------------------------------ */
  function iconContent(name) {
    switch (name) {
      case 'home':
        return html`<g><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M9.5 21v-6h5v6" /></g>`;
      case 'book':
        return html`<g><path d="M12 6.7C10.4 5.4 8.3 4.9 4.8 5.1v13.8c3.5-.2 5.6.3 7.2 1.6 1.6-1.3 3.7-1.8 7.2-1.6V5.1c-3.5-.2-5.6.3-7.2 1.6Z" /><path d="M12 6.7V20.5" /></g>`;
      case 'target':
        return html`<g><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.6" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /></g>`;
      case 'chart':
        return html`<g><path d="M4 20V11" /><path d="M10 20V4" /><path d="M16 20v-6" /><path d="M22 20H2" /></g>`;
      case 'help':
        return html`<g><circle cx="12" cy="12" r="9" /><path d="M9.3 9.2a2.8 2.8 0 0 1 5.4 1c0 1.9-2.7 2.1-2.7 3.9" /><circle cx="12" cy="17.4" r=".9" fill="currentColor" stroke="none" /></g>`;
      case 'check':
        return html`<path d="m5 12.5 4.2 4.2L19 6.8" />`;
      case 'checkCircle':
        return html`<g><circle cx="12" cy="12" r="9" /><path d="m8 12.2 2.7 2.7 5.4-5.6" /></g>`;
      case 'x':
        return html`<g><path d="m6.5 6.5 11 11" /><path d="m17.5 6.5-11 11" /></g>`;
      case 'xCircle':
        return html`<g><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6" /><path d="m15 9-6 6" /></g>`;
      case 'arrowRight':
        return html`<g><path d="M4 12h15" /><path d="m13 6 6 6-6 6" /></g>`;
      case 'arrowLeft':
        return html`<g><path d="M20 12H5" /><path d="m11 6-6 6 6 6" /></g>`;
      case 'arrowUpRight':
        return html`<g><path d="M7 17 17 7" /><path d="M8 7h9v9" /></g>`;
      case 'chevronDown':
        return html`<path d="m6 9 6 6 6-6" />`;
      case 'chevronRight':
        return html`<path d="m9 6 6 6-6 6" />`;
      case 'user':
        return html`<g><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.6-3.7 3.3-5.6 7-5.6s6.4 1.9 7 5.6" /></g>`;
      case 'graduation':
        return html`<g><path d="m2.8 9.8 9.2-4.6 9.2 4.6-9.2 4.6Z" /><path d="M6.4 11.8v4.6c3.2 2.1 8 2.1 11.2 0v-4.6" /><path d="M21.2 9.8V16" /></g>`;
      case 'clock':
        return html`<g><circle cx="12" cy="12" r="9" /><path d="M12 7v5.2l3.2 2" /></g>`;
      case 'spark':
        return html`<g><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z" /><path d="m18.4 16 .8 2.1 2.1.8-2.1.8-.8 2.1-.8-2.1-2.1-.8 2.1-.8Z" /></g>`;
      case 'print':
        return html`<g><path d="M7 9V3.5h10V9" /><path d="M7 17H4.5V9h15v8H17" /><path d="M7 14h10v6.5H7Z" /></g>`;
      case 'rotate':
        return html`<g><path d="M20 11a8 8 0 1 0-2.3 6.3" /><path d="M20 4v7h-7" /></g>`;
      case 'calculator':
        return html`<g><rect x="5" y="3" width="14" height="18" rx="2.4" /><path d="M8 7h8" /><path d="M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01" /></g>`;
      case 'lightbulb':
        return html`<g><path d="M9.2 18h5.6" /><path d="M10 21h4" /><path d="M8.4 14.8A6 6 0 1 1 15.6 14.8c-.7.5-1.1 1.4-1.1 2.2h-5c0-.8-.4-1.7-1.1-2.2Z" /></g>`;
      case 'info':
        return html`<g><circle cx="12" cy="12" r="9" /><path d="M12 11v5.5" /><circle cx="12" cy="7.8" r=".9" fill="currentColor" stroke="none" /></g>`;
      case 'triangle':
        return html`<g><path d="M4 19 12 4l8 15Z" /><path d="M8.2 19c.3-2.1 1.8-3.5 3.8-3.5s3.5 1.4 3.8 3.5" /></g>`;
      case 'layers':
        return html`<g><path d="m12 3 9 4.5-9 4.5-9-4.5Z" /><path d="m3 12 9 4.5 9-4.5" /><path d="m3 16.5 9 4.5 9-4.5" /></g>`;
      case 'lock':
        return html`<g><rect x="5" y="10" width="14" height="10" rx="2.2" /><path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10" /><path d="M12 14.5v2" /></g>`;
      case 'trash':
        return html`<g><path d="M4 7h16" /><path d="M9 7V4.5h6V7" /><path d="M6.5 7 7.4 20h9.2l.9-13" /><path d="M10 11v5M14 11v5" /></g>`;
      case 'alert':
        return html`<g><path d="M12 3 2.8 20h18.4Z" /><path d="M12 9v4.5" /><circle cx="12" cy="17" r=".9" fill="currentColor" stroke="none" /></g>`;
      case 'compass':
        return html`<g><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5Z" /></g>`;
      case 'pencil':
        return html`<g><path d="M4 20h4L20 8l-4-4L4 16Z" /><path d="m14.5 5.5 4 4" /></g>`;
      case 'trophy':
        return html`<g><path d="M8 4h8v5a4 4 0 0 1-8 0Z" /><path d="M8 6H4.5v1.5A3.5 3.5 0 0 0 8 11" /><path d="M16 6h3.5v1.5A3.5 3.5 0 0 1 16 11" /><path d="M12 13v4" /><path d="M8.5 20h7" /></g>`;
      case 'flag':
        return html`<g><path d="M5 21V4" /><path d="M5 4.5h11l-2 3.5 2 3.5H5" /></g>`;
      case 'list':
        return html`<g><path d="M9 6h11M9 12h11M9 18h11" /><circle cx="4.5" cy="6" r=".8" fill="currentColor" stroke="none" /><circle cx="4.5" cy="12" r=".8" fill="currentColor" stroke="none" /><circle cx="4.5" cy="18" r=".8" fill="currentColor" stroke="none" /></g>`;
      case 'ruler':
        return html`<g><path d="m3 16 13-13 5 5L8 21Z" /><path d="m7 12 2 2M10 9l2 2M13 6l2 2" /></g>`;
      case 'shield':
        return html`<g><path d="M12 3 5 6v5c0 4.4 2.8 7.6 7 10 4.2-2.4 7-5.6 7-10V6Z" /><path d="m9.2 11.8 2 2 3.7-4" /></g>`;
      default:
        return html`<circle cx="12" cy="12" r="9" />`;
    }
  }

  function Icon(props) {
    const name = props.name || 'info';
    const size = props.size || 20;
    const className = props.className || '';
    return html`<svg
      xmlns="http://www.w3.org/2000/svg"
      width=${size}
      height=${size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth=${props.strokeWidth || 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className=${cx('icon', className)}
      aria-hidden="true"
      focusable="false"
    >${iconContent(name)}</svg>`;
  }

  function BrandMark() {
    return html`<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <path d="M7 31 20 7l13 24Z" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
      <path d="M13 31c.1-4.4 3.1-7.2 7-7.2s6.9 2.8 7 7.2" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" opacity=".7" />
      <circle cx="20" cy="7" r="2.4" fill="currentColor" />
    </svg>`;
  }

  function Avatar(props) {
    const name = props.name || '';
    const size = props.size || 44;
    return html`<span
      className=${cx('avatar', props.className)}
      style=${{ width: size + 'px', height: size + 'px', fontSize: Math.round(size * 0.36) + 'px' }}
      aria-hidden="true"
    >${initialsOf(name)}</span>`;
  }

  /* ------------------------------------------------------------
     Navigasi
     ------------------------------------------------------------ */
  const NAV_ITEMS = [
    { id: 'beranda', label: 'Beranda', icon: 'home' },
    { id: 'materi', label: 'Materi', icon: 'book' },
    { id: 'latihan', label: 'Latihan Soal', icon: 'target' },
    { id: 'hasil', label: 'Hasil', icon: 'chart' },
    { id: 'panduan', label: 'Panduan', icon: 'help' }
  ];

  function Header(props) {
    const active = String(props.route || 'beranda').split('/')[0] || 'beranda';
    const profile = props.profile || DEFAULT_PROFILE;
    const hasProfile = Boolean(profile.name);
    return html`<header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="#/beranda">
          <span className="brand-mark"><${BrandMark} /></span>
          <span className="brand-copy">
            <strong>MATEMATIKA <em>LKPD</em></strong>
            <small>Trigonometri · Kelas X</small>
          </span>
        </a>
        <nav className="main-nav" aria-label="Navigasi utama">
          ${NAV_ITEMS.map(function (item) {
            const isActive =
              active === item.id ||
              (item.id === 'materi' && active === 'materi');
            return html`<a
              key=${item.id}
              href=${'#/' + item.id}
              className=${cx('nav-link', isActive && 'is-active')}
              aria-current=${isActive ? 'page' : undefined}
            ><${Icon} name=${item.icon} size=${15} /><span>${item.label}</span></a>`;
          })}
        </nav>
        <div className="header-meta">
          ${hasProfile
            ? html`<a className="profile-chip" href="#/beranda" title="Identitas tersimpan">
                <${Avatar} name=${profile.name} size=${32} />
                <span className="profile-chip-copy">
                  <b>${firstName(profile.name)}</b>
                  <small>${profile.kelas || 'Kelas X'}</small>
                </span>
              </a>`
            : html`<span className="offline-badge"><span className="status-dot"></span> Offline · 8 soal</span>`}
        </div>
      </div>
    </header>`;
  }

  function Footer() {
    return html`<footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="footer-mark"><${BrandMark} /></span>
          <div>
            <strong>Matematika LKPD</strong>
            <p>Aturan Sinus & Aturan Kosinus · Kelas X SMA/MA dan SMK/MAK</p>
          </div>
        </div>
        <div className="footer-side">
          <div className="footer-credit">
            <span className="footer-credit-label">Pembuat</span>
            <b>Ripka Anggiana</b>
            <span className="footer-dot"></span>
            <span>NPM 262151111118</span>
            <span className="footer-dot"></span>
            <span>Kelas B</span>
          </div>
          <div className="footer-note">
            <span><${Icon} name="lock" size=${13} /> Data belajar tersimpan di browser ini</span>
            <span className="footer-dot"></span>
            <span>Dibuat untuk belajar mandiri</span>
          </div>
        </div>
      </div>
    </footer>`;
  }

  /* ------------------------------------------------------------
     Elemen antarmuka dasar
     ------------------------------------------------------------ */
  function PageHead(props) {
    return html`<section className="page-head">
      <div className="page-head-main">
        <div className="eyebrow"><span className="eyebrow-line"></span>${props.eyebrow}</div>
        <h1>${props.title}</h1>
        ${props.lead && html`<p className="page-lead">${props.lead}</p>`}
        ${props.meta && html`<div className="page-meta">${props.meta}</div>`}
      </div>
      ${props.aside && html`<div className="page-head-aside">${props.aside}</div>`}
    </section>`;
  }

  function Pill(props) {
    return html`<span className=${cx('pill', props.tone && 'pill-' + props.tone, props.className)}>
      ${props.icon && html`<${Icon} name=${props.icon} size=${13} />`}
      ${props.children}
    </span>`;
  }

  function ProgressBar(props) {
    const value = Math.max(0, Math.min(100, Number(props.value) || 0));
    return html`<div
      className=${cx('progress', props.className)}
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow=${Math.round(value)}
      aria-label=${props.label || 'Progres'}
    ><span style=${{ width: value + '%' }}></span></div>`;
  }

  function ProgressRing(props) {
    const value = Math.max(0, Math.min(100, Number(props.value) || 0));
    const size = props.size || 168;
    const stroke = props.stroke || 10;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const dash = (value / 100) * circumference;
    return html`<div className=${cx('score-ring', props.className)} style=${{ width: size + 'px', height: size + 'px' }}>
      <svg viewBox=${'0 0 ' + size + ' ' + size} width=${size} height=${size} aria-hidden="true">
        <circle
          cx=${size / 2}
          cy=${size / 2}
          r=${radius}
          fill="none"
          stroke="rgba(255,255,255,.14)"
          strokeWidth=${stroke}
        />
        <circle
          cx=${size / 2}
          cy=${size / 2}
          r=${radius}
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth=${stroke}
          strokeLinecap="round"
          strokeDasharray=${dash + ' ' + circumference}
          transform=${'rotate(-90 ' + size / 2 + ' ' + size / 2 + ')'}
        />
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7fdcff" />
            <stop offset="100%" stopColor="#4ee0b4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="score-ring-copy">
        <strong>${formatNum(value)}</strong>
        <span>${props.label || 'dari 100'}</span>
      </div>
    </div>`;
  }

  function SolutionStepper(props) {
    const steps = props.steps || [];
    const total = steps.length;
    const [step, setStep] = useState(1);
    const [all, setAll] = useState(false);
    const shown = all ? total : step;
    const atEnd = shown >= total;

    useEffect(function () {
      setStep(1);
      setAll(false);
    }, [props.prompt]);

    function advance() {
      if (step < total) {
        setStep(step + 1);
      } else {
        setAll(true);
      }
    }

    return html`<div className="solution-card">
      <div className="solution-head">
        <span className="solution-tag"><${Icon} name="pencil" size=${13} /> ${props.label || 'Contoh soal'}</span>
        <div className="solution-dots" aria-hidden="true">
          ${steps.map(function (_, index) {
            return html`<span key=${index} className=${cx('dot', index < shown && 'is-on')}></span>`;
          })}
        </div>
      </div>
      <div className="solution-prompt">${props.prompt}</div>
      <div className="step-list">
        ${steps.map(function (item, index) {
          if (index >= shown) return null;
          return html`<div key=${index} className=${cx('step-item', index === shown - 1 && !all && 'is-active')}>
            <span className="step-num">${index + 1}</span>
            <div className="step-copy">
              <strong>${item.title}</strong>
              <div className="step-body">${item.body}</div>
            </div>
          </div>`;
        })}
      </div>
      ${atEnd &&
      html`<div className="solution-result">
        <span className="solution-result-label"><${Icon} name="checkCircle" size=${15} /> Hasil</span>
        <div className="solution-result-value">${props.result}</div>
        ${props.note && html`<p className="solution-note">${props.note}</p>`}
      </div>`}
      <div className="solution-actions">
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick=${function () {
            setStep(1);
            setAll(false);
          }}
          disabled=${shown === 1 && !all}
        ><${Icon} name="rotate" size=${14} /> Ulangi</button>
        <div className="solution-actions-right">
          ${!atEnd &&
          html`<button type="button" className="btn btn-soft btn-sm" onClick=${function () { setAll(true); }}>
            Tampilkan semua
          </button>`}
          <button type="button" className="btn btn-primary btn-sm" onClick=${advance} disabled=${atEnd}>
            ${atEnd ? 'Pembahasan lengkap' : 'Langkah berikutnya'}
            ${!atEnd && html`<${Icon} name="arrowRight" size=${14} />`}
          </button>
        </div>
      </div>
    </div>`;
  }

  function CheckPrompt(props) {
    return html`<details className="check-card">
      <summary>
        <span className="check-card-icon"><${Icon} name="lightbulb" size=${18} /></span>
        <span className="check-card-copy">
          <strong>${props.label || 'Cek pemahaman'}</strong>
          <span>${props.question}</span>
        </span>
        <${Icon} name="chevronDown" size=${18} className="check-chevron" />
      </summary>
      <div className="check-card-answer"><strong>Jawaban:</strong> ${props.answer}</div>
    </details>`;
  }

  function Frac(props) {
    return html`<span className=${cx('frac', props.className)}>
      <span className="frac-top">${props.top}</span>
      <span className="frac-bottom">${props.bottom}</span>
    </span>`;
  }

  function Callout(props) {
    return html`<div className=${cx('callout', props.tone && 'callout-' + props.tone)}>
      <span className="callout-icon"><${Icon} name=${props.icon || 'info'} size=${18} /></span>
      <div>
        ${props.title && html`<strong>${props.title}</strong>`}
        <div className="callout-body">${props.children}</div>
      </div>
    </div>`;
  }

  /* ------------------------------------------------------------
     Modal & toast
     ------------------------------------------------------------ */
  function Modal(props) {
    const open = props.open;
    const onClose = props.onClose;

    useEffect(function () {
      if (!open) return undefined;
      function onKeyDown(event) {
        if (event.key === 'Escape') onClose();
      }
      document.addEventListener('keydown', onKeyDown);
      document.body.classList.add('modal-open');
      return function () {
        document.removeEventListener('keydown', onKeyDown);
        document.body.classList.remove('modal-open');
      };
    }, [open, onClose]);

    if (!open) return null;

    return html`<div
      className="modal-backdrop"
      onMouseDown=${function (event) {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-head">
          <div className="modal-title-wrap">
            <span className="modal-icon"><${Icon} name=${props.icon || 'info'} size=${20} /></span>
            <h2 id="modal-title">${props.title}</h2>
          </div>
          <button type="button" className="icon-btn" onClick=${onClose} aria-label="Tutup dialog">
            <${Icon} name="x" size=${18} />
          </button>
        </div>
        <div className="modal-body">${props.children}</div>
        ${props.footer && html`<div className="modal-foot">${props.footer}</div>`}
      </div>
    </div>`;
  }

  function ToastViewport(props) {
    const toasts = props.toasts || [];
    return html`<div className="toast-viewport" aria-live="polite" aria-atomic="false">
      ${toasts.map(function (toast) {
        return html`<div key=${toast.id} className=${cx('toast', 'toast-' + (toast.tone || 'success'))}>
          <span className="toast-icon"><${Icon} name=${toast.tone === 'info' ? 'info' : 'checkCircle'} size=${18} /></span>
          <span>${toast.message}</span>
        </div>`;
      })}
    </div>`;
  }

  function useToasts() {
    const [toasts, setToasts] = useState([]);

    const notify = useCallback(function (message, tone) {
      const id = Date.now() + Math.random();
      setToasts(function (current) {
        return current.concat([{ id: id, message: message, tone: tone || 'success' }]);
      });
      window.setTimeout(function () {
        setToasts(function (current) {
          return current.filter(function (item) {
            return item.id !== id;
          });
        });
      }, 3400);
    }, []);

    return { toasts: toasts, notify: notify };
  }

  /* ------------------------------------------------------------
     Ornamen matematika
     ------------------------------------------------------------ */
  function TriangleFigure(props) {
    const mode = props.mode || 'netral';
    return html`<div className=${cx('triangle-figure', mode === 'sinus' && 'highlight-sinus', mode === 'kosinus' && 'highlight-kosinus')}>
      <svg viewBox="0 0 440 320" role="img" aria-label="Segitiga ABC dengan sisi a, b, dan c">
        <defs>
          <linearGradient id="triGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1f86e8" />
            <stop offset="100%" stopColor="#46d7c0" />
          </linearGradient>
          <radialGradient id="triGlow" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#c8eaff" stopOpacity=".65" />
            <stop offset="100%" stopColor="#c8eaff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="220" cy="165" rx="178" ry="140" fill="url(#triGlow)" />
        <circle cx="220" cy="162" r="134" fill="none" stroke="#b9dcf7" strokeWidth="1" strokeDasharray="4 7" opacity=".8" />
        <path d="M76 264 366 264 188 62Z" fill="#eef8ff" stroke="url(#triGradient)" strokeWidth="3" strokeLinejoin="round" />
        <path d="M188 62 188 264" fill="none" stroke="#8ab9dd" strokeWidth="1.4" strokeDasharray="5 6" />
        <path d="M188 247h17v17" fill="none" stroke="#8ab9dd" strokeWidth="1.2" opacity=".8" />
        <path className="tri-side tri-side-a" d="M366 264 188 62" fill="none" stroke="#1f86e8" strokeWidth="5" strokeLinecap="round" opacity=".85" />
        <path className="tri-side tri-side-b" d="M76 264 188 62" fill="none" stroke="#1f86e8" strokeWidth="5" strokeLinecap="round" opacity=".85" />
        <path className="tri-side tri-side-c" d="M76 264 366 264" fill="none" stroke="#2fb7a9" strokeWidth="5" strokeLinecap="round" opacity=".85" />
        <path className="tri-angle tri-angle-a" d="M112 264A36 36 0 0 1 101 236" fill="none" stroke="#e0a021" strokeWidth="3.2" strokeLinecap="round" />
        <path className="tri-angle tri-angle-b" d="M328 264A38 38 0 0 0 341 233" fill="none" stroke="#e0a021" strokeWidth="3.2" strokeLinecap="round" />
        <path className="tri-angle tri-angle-c" d="M170 82A25 25 0 0 1 206 80" fill="none" stroke="#e0a021" strokeWidth="3" strokeLinecap="round" />
        <text x="54" y="286" className="tri-vertex">A</text>
        <text x="372" y="286" className="tri-vertex">B</text>
        <text x="180" y="48" className="tri-vertex">C</text>
        <text x="182" y="302" className="tri-side-label">c</text>
        <text x="144" y="148" className="tri-side-label">b</text>
        <text x="284" y="150" className="tri-side-label">a</text>
        <text x="81" y="245" className="tri-angle-label">A</text>
        <text x="343" y="245" className="tri-angle-label">B</text>
        <text x="190" y="98" className="tri-angle-label">C</text>
        <circle cx="188" cy="62" r="5" fill="#1f86e8" />
        <circle cx="76" cy="264" r="5" fill="#1f86e8" />
        <circle cx="366" cy="264" r="5" fill="#1f86e8" />
      </svg>
    </div>`;
  }

  function HeroVisual() {
    return html`<div className="hero-visual" aria-hidden="true">
      <div className="hero-grid"></div>
      <div className="hero-orbit orbit-one"></div>
      <div className="hero-orbit orbit-two"></div>
      <span className="visual-pill"><${Icon} name="spark" size=${13} /> Segitiga sembarang</span>
      <div className="hero-svg-wrap">
        <svg viewBox="0 0 520 380" className="hero-svg">
          <defs>
            <linearGradient id="heroTri" x1="10%" y1="0%" x2="90%" y2="100%">
              <stop offset="0%" stopColor="#72d9ff" />
              <stop offset="55%" stopColor="#58b6ff" />
              <stop offset="100%" stopColor="#48e6c7" />
            </linearGradient>
            <radialGradient id="heroGlow" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="#4fc9ff" stopOpacity=".24" />
              <stop offset="100%" stopColor="#4fc9ff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="260" cy="192" r="160" fill="url(#heroGlow)" />
          <circle cx="260" cy="192" r="146" fill="none" stroke="#8bdcff" strokeWidth="1" strokeDasharray="3 9" opacity=".3" />
          <circle cx="260" cy="192" r="184" fill="none" stroke="#8bdcff" strokeWidth="1" opacity=".12" />
          <path d="M104 310 430 310 214 74Z" fill="rgba(105,204,255,.055)" stroke="url(#heroTri)" strokeWidth="2.6" strokeLinejoin="round" />
          <path d="M214 74 214 310" fill="none" stroke="#93d7ff" strokeWidth="1.1" strokeDasharray="5 7" opacity=".45" />
          <path d="M214 292h18v18" fill="none" stroke="#93d7ff" strokeWidth="1" opacity=".5" />
          <path d="M135 310A46 46 0 0 1 121 273" fill="none" stroke="#f0c777" strokeWidth="2.6" strokeLinecap="round" opacity=".9" />
          <path d="M385 310A48 48 0 0 0 400 270" fill="none" stroke="#f0c777" strokeWidth="2.6" strokeLinecap="round" opacity=".9" />
          <path d="M196 96A28 28 0 0 1 235 94" fill="none" stroke="#f0c777" strokeWidth="2.4" strokeLinecap="round" opacity=".9" />
          <text x="84" y="337" className="hero-vertex">A</text>
          <text x="432" y="337" className="hero-vertex">B</text>
          <text x="207" y="55" className="hero-vertex">C</text>
          <text x="211" y="347" className="hero-side-label">c</text>
          <text x="137" y="181" className="hero-side-label">b</text>
          <text x="327" y="181" className="hero-side-label">a</text>
          <circle cx="104" cy="310" r="4.6" fill="#8ae6ff" />
          <circle cx="430" cy="310" r="4.6" fill="#8ae6ff" />
          <circle cx="214" cy="74" r="4.6" fill="#8ae6ff" />
          <g opacity=".55">
            <circle cx="94" cy="106" r="3" fill="#8ae6ff" />
            <circle cx="430" cy="114" r="2" fill="#f0c777" />
            <circle cx="452" cy="222" r="3" fill="#8ae6ff" />
            <circle cx="70" cy="236" r="2" fill="#8ae6ff" />
          </g>
        </svg>
      </div>
      <div className="formula-chip chip-sinus">
        <span>Aturan Sinus</span>
        <b><i>a</i> / sin <i>A</i> = <i>b</i> / sin <i>B</i></b>
      </div>
      <div className="formula-chip chip-kosinus">
        <span>Aturan Kosinus</span>
        <b><i>a</i><sup>2</sup> = <i>b</i><sup>2</sup> + <i>c</i><sup>2</sup> − 2<i>bc</i> cos <i>A</i></b>
      </div>
      <span className="visual-caption">Satu segitiga, dua cara menghitung.</span>
    </div>`;
  }

  window.LKPD_CORE = {
    React: React,
    html: html,
    useState: useState,
    useEffect: useEffect,
    useRef: useRef,
    useCallback: useCallback,
    KEYS: KEYS,
    DEFAULT_PROFILE: DEFAULT_PROFILE,
    createQuizState: createQuizState,
    loadJSON: loadJSON,
    saveJSON: saveJSON,
    useStoredState: useStoredState,
    resetStoredData: resetStoredData,
    cx: cx,
    formatNum: formatNum,
    formatDate: formatDate,
    formatDateTime: formatDateTime,
    formatDuration: formatDuration,
    initialsOf: initialsOf,
    firstName: firstName,
    parseNumericAnswer: parseNumericAnswer,
    isAnswerCorrect: isAnswerCorrect,
    scrollToId: scrollToId,
    Icon: Icon,
    BrandMark: BrandMark,
    Avatar: Avatar,
    NAV_ITEMS: NAV_ITEMS,
    Header: Header,
    Footer: Footer,
    PageHead: PageHead,
    Pill: Pill,
    ProgressBar: ProgressBar,
    ProgressRing: ProgressRing,
    SolutionStepper: SolutionStepper,
    CheckPrompt: CheckPrompt,
    Frac: Frac,
    Callout: Callout,
    Modal: Modal,
    ToastViewport: ToastViewport,
    useToasts: useToasts,
    TriangleFigure: TriangleFigure,
    HeroVisual: HeroVisual
  };
})();
