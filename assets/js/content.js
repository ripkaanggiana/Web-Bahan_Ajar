/* ============================================================
   Matematika LKPD — Data materi dan bank soal
   ============================================================ */
(function () {
  'use strict';

  const TOPICS = [
    {
      id: 'pengantar',
      num: '01',
      title: 'Mengenal Segitiga Sembarang',
      menuTitle: 'Pengantar Segitiga',
      menuSub: 'Fondasi & kesepakatan',
      kicker: 'Fondasi',
      minutes: 4,
      lead:
        'Segitiga tidak selalu siku-siku. Aturan Sinus dan Aturan Kosinus membantu kita menghitung sisi atau sudut pada segitiga sembarang.'
    },
    {
      id: 'sinus',
      num: '02',
      title: 'Aturan Sinus',
      menuTitle: 'Aturan Sinus',
      menuSub: 'Sisi dan sudut hadap',
      kicker: 'Rumus 01',
      minutes: 6,
      lead:
        'Setiap sisi dibandingkan dengan sinus sudut di hadapannya. Perbandingan itu selalu sama untuk ketiga sisi pada segitiga.'
    },
    {
      id: 'kosinus',
      num: '03',
      title: 'Aturan Kosinus',
      menuTitle: 'Aturan Kosinus',
      menuSub: 'Tiga sisi & sudut apit',
      kicker: 'Rumus 02',
      minutes: 7,
      lead:
        'Aturan Kosinus menghubungkan ketiga sisi segitiga dengan satu sudut. Rumus ini adalah perluasan Teorema Pythagoras untuk segitiga sembarang.'
    },
    {
      id: 'memilih',
      num: '04',
      title: 'Kapan Pakai Rumus Mana?',
      menuTitle: 'Memilih Rumus',
      menuSub: 'Strategi penyelesaian',
      kicker: 'Strategi',
      minutes: 5,
      lead:
        'Sinus atau kosinus? Kuncinya adalah melihat informasi yang diketahui: pasangan sisi-sudut, sudut apit, atau ketiga sisi.'
    }
  ];

  const QUESTIONS = [
    {
      id: 1,
      category: 'Aturan Sinus',
      level: 'Dasar',
      title: 'Sisi di hadapan sudut 45°',
      stem:
        'Pada segitiga ABC, diketahui ∠A = 30° dan ∠B = 45°. Jika panjang sisi a = 10 cm, tentukan panjang sisi b.',
      given: [
        { label: '∠A', value: '30°' },
        { label: '∠B', value: '45°' },
        { label: 'sisi a', value: '10 cm' }
      ],
      asked: 'Panjang sisi b',
      unit: 'cm',
      answer: 10 * Math.SQRT2,
      tolerance: 0.06,
      display: '10√2 ≈ 14,14 cm',
      keyword: 'dua sudut + satu sisi',
      hint:
        'Sisi b berpasangan dengan ∠B, sedangkan sisi a berpasangan dengan ∠A. Gunakan aturan sinus.',
      formula: 'b / sin B = a / sin A',
      steps: [
        'Tulis aturan sinus dengan pasangan yang diketahui: b / sin 45° = a / sin 30°.',
        'Substitusikan a = 10 cm: b / sin 45° = 10 / sin 30°.',
        'Kalikan silang: b = 10 × sin 45° / sin 30°.',
        'Gunakan sin 45° = ½√2 dan sin 30° = ½, sehingga b = 10√2 ≈ 14,14 cm.'
      ],
      explanation:
        'Sisi b harus dipasangkan dengan sudut di hadapannya, yaitu ∠B. Perbandingan b/sin B sama dengan a/sin A, sehingga b dapat dihitung langsung tanpa mencari ∠C.'
    },
    {
      id: 2,
      category: 'Aturan Sinus',
      level: 'Dasar',
      title: 'Dua sudut dan satu sisi',
      stem:
        'Pada segitiga ABC, diketahui ∠A = 40° dan ∠B = 70°. Jika panjang sisi a = 12 cm, tentukan panjang sisi b.',
      given: [
        { label: '∠A', value: '40°' },
        { label: '∠B', value: '70°' },
        { label: 'sisi a', value: '12 cm' }
      ],
      asked: 'Panjang sisi b',
      unit: 'cm',
      answer: (12 * Math.sin((70 * Math.PI) / 180)) / Math.sin((40 * Math.PI) / 180),
      tolerance: 0.06,
      display: '17,54 cm',
      keyword: 'dua sudut + satu sisi',
      hint:
        'Gunakan pasangan b dengan ∠B dan a dengan ∠A. Sudut C tidak perlu dicari lebih dahulu.',
      formula: 'b / sin B = a / sin A',
      steps: [
        'Susun aturan sinus: b / sin 70° = 12 / sin 40°.',
        'Kalikan silang: b = 12 × sin 70° / sin 40°.',
        'Hitung dengan kalkulator mode derajat: b ≈ 12 × 0,9397 / 0,6428.',
        'Diperoleh b ≈ 17,54 cm.'
      ],
      explanation:
        'Walau segitiga ini sebenarnya sama kaki (∠B = ∠C = 70°), kita tidak perlu mengetahui ∠C. Aturan sinus langsung menghubungkan pasangan sisi-sudut yang diketahui.'
    },
    {
      id: 3,
      category: 'Aturan Sinus',
      level: 'Dasar',
      title: 'Mencari sisi l pada segitiga KLM',
      stem:
        'Pada segitiga KLM, diketahui sisi k = 10 cm, ∠K = 30°, dan ∠L = 45°. Tentukan panjang sisi l.',
      given: [
        { label: 'sisi k', value: '10 cm' },
        { label: '∠K', value: '30°' },
        { label: '∠L', value: '45°' }
      ],
      asked: 'Panjang sisi l',
      unit: 'cm',
      answer: 10 * Math.SQRT2,
      tolerance: 0.06,
      display: '10√2 ≈ 14,14 cm',
      keyword: 'dua sudut + satu sisi',
      hint:
        'Sisi l berpasangan dengan ∠L dan sisi k berpasangan dengan ∠K. Cukup gunakan satu persamaan aturan sinus.',
      formula: 'l / sin L = k / sin K',
      steps: [
        'Tulis aturan sinus: l / sin 45° = k / sin 30°.',
        'Substitusikan k = 10: l / sin 45° = 10 / sin 30°.',
        'l = 10 × sin 45° / sin 30° = 10 × (½√2) / ½.',
        'Jadi, l = 10√2 ≈ 14,14 cm.'
      ],
      explanation:
        'Nama titik sudut boleh berbeda (K, L, M), tetapi aturannya tetap: sisi l berpasangan dengan ∠L dan sisi k dengan ∠K. Gunakan huruf yang sesuai agar tidak tertukar.'
    },
    {
      id: 4,
      category: 'Aturan Sinus',
      level: 'Sedang',
      title: 'Perjalanan kapal',
      stem:
        'Sebuah kapal berlayar dari titik A menuju titik B. Dari titik pengamatan C terbentuk segitiga ABC dengan ∠A = 50°, ∠B = 70°, dan sisi a = BC = 100 m. Tentukan panjang sisi b = AC.',
      given: [
        { label: '∠A', value: '50°' },
        { label: '∠B', value: '70°' },
        { label: 'sisi a', value: '100 m' }
      ],
      asked: 'Panjang sisi b (AC)',
      unit: 'm',
      answer: (100 * Math.sin((70 * Math.PI) / 180)) / Math.sin((50 * Math.PI) / 180),
      tolerance: 0.06,
      display: '122,67 m',
      keyword: 'dua sudut + satu sisi',
      hint:
        'Sisi a = BC berpasangan dengan ∠A, sedangkan sisi b = AC berpasangan dengan ∠B. Kalikan silang dengan hati-hati.',
      formula: 'b / sin B = a / sin A',
      steps: [
        'Karena ∠A, ∠B, dan sisi a diketahui, gunakan aturan sinus.',
        'b / sin 70° = 100 / sin 50°.',
        'b = 100 × sin 70° / sin 50°.',
        'b ≈ 100 × 0,9397 / 0,7660 ≈ 122,67 m.'
      ],
      explanation:
        'Sudut C sebenarnya dapat dicari: 180° − 50° − 70° = 60°, tetapi tidak diperlukan. Fokus pada pasangan sisi-sudut yang sudah lengkap: a dengan ∠A dan b dengan ∠B.'
    },
    {
      id: 5,
      category: 'Aturan Sinus',
      level: 'Sedang',
      title: 'Mengamati pohon dari dua titik',
      stem:
        'Dua orang berada di titik A dan B mengamati sebuah pohon di titik C. Diketahui ∠A = 40°, ∠B = 80°, dan jarak AC = 20 m. Tentukan jarak BC.',
      given: [
        { label: '∠A', value: '40°' },
        { label: '∠B', value: '80°' },
        { label: 'AC (b)', value: '20 m' }
      ],
      asked: 'Jarak BC (sisi a)',
      unit: 'm',
      answer: (20 * Math.sin((40 * Math.PI) / 180)) / Math.sin((80 * Math.PI) / 180),
      tolerance: 0.06,
      display: '13,05 m',
      keyword: 'dua sudut + satu sisi',
      hint:
        'AC adalah sisi b dan berhadapan dengan ∠B. BC adalah sisi a dan berhadapan dengan ∠A.',
      formula: 'a / sin A = b / sin B',
      steps: [
        'Tulis aturan sinus: a / sin 40° = 20 / sin 80°.',
        'Kalikan silang: a = 20 × sin 40° / sin 80°.',
        'Hitung dengan kalkulator: a ≈ 20 × 0,6428 / 0,9848.',
        'Jadi, BC ≈ 13,05 m.'
      ],
      explanation:
        'Perhatikan penamaan sisi: AC berada di hadapan ∠B sehingga disebut sisi b, sedangkan BC berada di hadapan ∠A sehingga disebut sisi a. Kesalahan penamaan sisi adalah penyebab jawaban yang paling sering keliru.'
    },
    {
      id: 6,
      category: 'Aturan Kosinus',
      level: 'Sedang',
      title: 'Dua sisi mengapit sudut 60°',
      stem:
        'Pada segitiga ABC, panjang AB = 5 cm, AC = 7 cm, dan ∠A = 60°. Tentukan panjang BC.',
      given: [
        { label: 'AB (c)', value: '5 cm' },
        { label: 'AC (b)', value: '7 cm' },
        { label: '∠A', value: '60°' }
      ],
      asked: 'Panjang BC (sisi a)',
      unit: 'cm',
      answer: Math.sqrt(39),
      tolerance: 0.06,
      display: '√39 ≈ 6,24 cm',
      keyword: 'dua sisi + sudut apit',
      hint:
        'AB dan AC mengapit ∠A. Sisi yang dicari, BC, berada tepat di hadapan ∠A. Gunakan aturan kosinus.',
      formula: 'a² = b² + c² − 2bc cos A',
      steps: [
        'Sisi BC adalah a, sehingga a² = AB² + AC² − 2 · AB · AC · cos A.',
        'a² = 5² + 7² − 2 · 5 · 7 · cos 60°.',
        'a² = 25 + 49 − 70 × ½ = 74 − 35 = 39.',
        'a = √39 ≈ 6,24 cm. Jadi, BC ≈ 6,24 cm.'
      ],
      explanation:
        'Dua sisi yang diketahui mengapit ∠A, dan sisi yang dicari berhadapan dengan ∠A. Pola ini adalah ciri khas aturan kosinus untuk mencari sisi. Jika ∠A = 90°, hasilnya kembali menjadi Teorema Pythagoras.'
    },
    {
      id: 7,
      category: 'Aturan Kosinus',
      level: 'Tantangan',
      title: 'Sudut apit 120°',
      stem:
        'Pada segitiga KLM, panjang KL = 10 cm, KM = 12 cm, dan ∠K = 120°. Tentukan panjang LM.',
      given: [
        { label: 'KL', value: '10 cm' },
        { label: 'KM', value: '12 cm' },
        { label: '∠K', value: '120°' }
      ],
      asked: 'Panjang LM',
      unit: 'cm',
      answer: Math.sqrt(364),
      tolerance: 0.06,
      display: '2√91 ≈ 19,08 cm',
      keyword: 'dua sisi + sudut apit',
      hint:
        'Kedua sisi yang diketahui bertemu di titik K. Gunakan LM² = KL² + KM² − 2 · KL · KM · cos 120°.',
      formula: 'LM² = KL² + KM² − 2 · KL · KM · cos K',
      steps: [
        'LM² = 10² + 12² − 2 · 10 · 12 · cos 120°.',
        'Nilai cos 120° = −½, sehingga suku terakhir bernilai positif.',
        'LM² = 100 + 144 − 240 × (−½) = 244 + 120 = 364.',
        'LM = √364 = 2√91 ≈ 19,08 cm.'
      ],
      explanation:
        'Sudut 120° adalah sudut tumpul, sehingga cos 120° bernilai negatif. Akibatnya, hasil pengurangan menjadi penambahan dan sisi LM lebih panjang daripada kedua sisi yang mengapitnya.'
    },
    {
      id: 8,
      category: 'Aturan Kosinus',
      level: 'Tantangan',
      title: 'Jarak dua pengamat',
      stem:
        'Dua orang berada di titik A dan B mengamati sebuah objek di titik C. Jarak orang pertama ke objek adalah AC = 6 m, jarak orang kedua ke objek adalah BC = 8 m, dan sudut di antara kedua jarak tersebut adalah ∠C = 60°. Tentukan jarak antara kedua orang tersebut (AB).',
      given: [
        { label: 'AC (b)', value: '6 m' },
        { label: 'BC (a)', value: '8 m' },
        { label: '∠C', value: '60°' }
      ],
      asked: 'Jarak AB (sisi c)',
      unit: 'm',
      answer: Math.sqrt(52),
      tolerance: 0.06,
      display: '2√13 ≈ 7,21 m',
      keyword: 'dua sisi + sudut apit',
      hint:
        'AC dan BC mengapit sudut C. Sisi AB berada di hadapan ∠C, jadi gunakan c² = a² + b² − 2ab cos C.',
      formula: 'c² = a² + b² − 2ab cos C',
      steps: [
        'Sisi AB adalah c, dengan a = BC = 8 m dan b = AC = 6 m.',
        'c² = 8² + 6² − 2 · 8 · 6 · cos 60°.',
        'c² = 64 + 36 − 96 × ½ = 100 − 48 = 52.',
        'c = √52 = 2√13 ≈ 7,21 m. Jadi, jarak AB ≈ 7,21 m.'
      ],
      explanation:
        'Sudut 60° adalah sudut apit antara AC dan BC. Karena itu, aturan kosinus dapat digunakan langsung untuk menemukan sisi AB yang menghubungkan kedua pengamat.'
    }
  ];

  window.LKPD_CONTENT = {
    TOPICS: TOPICS,
    QUESTIONS: QUESTIONS
  };
})();
