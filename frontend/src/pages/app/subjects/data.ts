export const subjects = [
  {
    id: "math",
    slug: "math",
    title: "Matematika",
    icon: "📐",
    color: "bg-blue-500",
    progress: 60,
    totalChapters: 4,
    completedChapters: 2,
  },
  {
    id: "physics",
    slug: "physics",
    title: "Fisika",
    icon: "⚡",
    color: "bg-amber-500",
    progress: 33,
    totalChapters: 3,
    completedChapters: 1,
  },
  {
    id: "chemistry",
    slug: "chemistry",
    title: "Kimia",
    icon: "🧪",
    color: "bg-emerald-500",
    progress: 50,
    totalChapters: 2,
    completedChapters: 1,
  },
  {
    id: "biology",
    slug: "biology",
    title: "Biologi",
    icon: "🧬",
    color: "bg-pink-500",
    progress: 50,
    totalChapters: 2,
    completedChapters: 1,
  },
  {
    id: "english",
    slug: "english",
    title: "Bahasa Inggris",
    icon: "📝",
    color: "bg-cyan-500",
    progress: 50,
    totalChapters: 2,
    completedChapters: 1,
  },
  {
    id: "indonesian",
    slug: "indonesian",
    title: "Bahasa Indonesia",
    icon: "📖",
    color: "bg-red-500",
    progress: 50,
    totalChapters: 2,
    completedChapters: 1,
  },
];

export const allChapters = [
  // Math
  {
    id: "math-1",
    subjectId: "math",
    title: "Limit Fungsi",
    completed: true,
    order: 1,
    content:
      "<h2>Limit Fungsi</h2><p>Limit fungsi merupakan konsep fundamental dalam kalkulus yang menggambarkan perilaku suatu fungsi saat variabelnya mendekati suatu nilai tertentu.</p><h3>Definisi Limit</h3><p>Secara formal, <code>lim x→a f(x) = L</code> jika untuk setiap ε > 0 terdapat δ > 0.</p><h3>Sifat-Sifat Limit</h3><ul><li>Limit penjumlahan</li><li>Limit perkalian</li><li>Limit pembagian</li></ul>",
  },
  {
    id: "math-2",
    subjectId: "math",
    title: "Turunan Fungsi",
    completed: true,
    order: 2,
    content:
      "<h2>Turunan Fungsi</h2><p>Turunan (derivatif) adalah pengukuran terhadap bagaimana fungsi berubah seiring perubahan inputnya.</p><h3>Rumus Dasar</h3><ul><li><code>f(x) = xⁿ → f'(x) = nxⁿ⁻¹</code></li><li><code>f(x) = sin x → f'(x) = cos x</code></li></ul>",
  },
  {
    id: "math-3",
    subjectId: "math",
    title: "Integral",
    completed: false,
    order: 3,
    content:
      "<h2>Integral</h2><p>Integral merupakan kebalikan dari turunan. Digunakan untuk menghitung luas daerah di bawah kurva.</p><h3>Rumus Dasar</h3><ul><li><code>∫xⁿ dx = xⁿ⁺¹/(n+1) + C</code></li></ul>",
  },
  {
    id: "math-4",
    subjectId: "math",
    title: "Matriks",
    completed: false,
    order: 4,
    content:
      "<h2>Matriks</h2><p>Matriks adalah susunan bilangan dalam baris dan kolom.</p><h3>Operasi</h3><ul><li>Penjumlahan</li><li>Perkalian</li><li>Determinan</li></ul>",
  },
  // Physics
  {
    id: "physics-1",
    subjectId: "physics",
    title: "Kinematika",
    completed: true,
    order: 1,
    content:
      "<h2>Kinematika</h2><p>Mempelajari gerak benda tanpa memperhatikan penyebab gerak.</p><p><code>s = v × t</code></p>",
  },
  {
    id: "physics-2",
    subjectId: "physics",
    title: "Dinamika",
    completed: false,
    order: 2,
    content:
      "<h2>Dinamika</h2><p>Mempelajari gerak benda dengan mempertimbangkan gaya.</p><h3>Hukum Newton</h3><ul><li>Hukum I: Inersia</li><li>Hukum II: F = m × a</li><li>Hukum III: Aksi-Reaksi</li></ul>",
  },
  {
    id: "physics-3",
    subjectId: "physics",
    title: "Usaha dan Energi",
    completed: false,
    order: 3,
    content: "<h2>Usaha dan Energi</h2><p><code>W = F × s × cos θ</code></p>",
  },
  // Chemistry
  {
    id: "chem-1",
    subjectId: "chemistry",
    title: "Struktur Atom",
    completed: true,
    order: 1,
    content:
      "<h2>Struktur Atom</h2><p>Atom terdiri dari proton, neutron, dan elektron.</p>",
  },
  {
    id: "chem-2",
    subjectId: "chemistry",
    title: "Ikatan Kimia",
    completed: false,
    order: 2,
    content:
      "<h2>Ikatan Kimia</h2><p>Ikatan kimia terbentuk karena kecenderungan atom mencapai konfigurasi stabil.</p>",
  },
  // Biology
  {
    id: "bio-1",
    subjectId: "biology",
    title: "Sel",
    completed: true,
    order: 1,
    content: "<h2>Sel</h2><p>Sel adalah unit terkecil makhluk hidup.</p>",
  },
  {
    id: "bio-2",
    subjectId: "biology",
    title: "Genetika",
    completed: false,
    order: 2,
    content: "<h2>Genetika</h2><p>Genetika mempelajari pewarisan sifat.</p>",
  },
  // English
  {
    id: "eng-1",
    subjectId: "english",
    title: "Tenses",
    completed: true,
    order: 1,
    content:
      "<h2>Tenses</h2><p>Tenses menunjukkan waktu terjadinya peristiwa.</p>",
  },
  {
    id: "eng-2",
    subjectId: "english",
    title: "Passive Voice",
    completed: false,
    order: 2,
    content:
      "<h2>Passive Voice</h2><p>Digunakan ketika fokus pada objek yang dikenai tindakan.</p>",
  },
  // Indonesian
  {
    id: "ind-1",
    subjectId: "indonesian",
    title: "Teks Eksposisi",
    completed: true,
    order: 1,
    content:
      "<h2>Teks Eksposisi</h2><p>Berisi pendapat atau gagasan untuk meyakinkan pembaca.</p>",
  },
  {
    id: "ind-2",
    subjectId: "indonesian",
    title: "Teks Prosedur",
    completed: false,
    order: 2,
    content:
      "<h2>Teks Prosedur</h2><p>Berisi langkah-langkah untuk mencapai tujuan.</p>",
  },
];

export const quizzes = [
  {
    id: "quiz-math-1",
    chapterId: "math-1",
    subjectId: "math",
    title: "Quiz Limit Fungsi",
    questions: [
      {
        id: "q1",
        question: "Berapa nilai lim x→2 (x² - 4)/(x - 2)?",
        options: ["2", "4", "6", "0"],
        correctAnswer: 1,
      },
      {
        id: "q2",
        question: "Limit dari konstanta c adalah?",
        options: ["0", "1", "c", "∞"],
        correctAnswer: 2,
      },
      {
        id: "q3",
        question: "lim x→0 sin(x)/x = ?",
        options: ["0", "1", "∞", "Tidak ada"],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: "quiz-math-2",
    chapterId: "math-2",
    subjectId: "math",
    title: "Quiz Turunan Fungsi",
    questions: [
      {
        id: "q1",
        question: "Turunan dari f(x) = x³ adalah?",
        options: ["x²", "3x²", "3x", "2x³"],
        correctAnswer: 1,
      },
      {
        id: "q2",
        question: "Turunan dari f(x) = 5 adalah?",
        options: ["5", "1", "0", "5x"],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: "quiz-physics-1",
    chapterId: "physics-1",
    subjectId: "physics",
    title: "Quiz Kinematika",
    questions: [
      {
        id: "q1",
        question: "Rumus kecepatan pada GLB adalah?",
        options: ["v = s/t", "v = a×t", "v = s×t", "v = a/t"],
        correctAnswer: 0,
      },
    ],
  },
];

export const finalExams = [
  {
    id: "final-math",
    subjectId: "math",
    title: "Ujian Akhir Matematika",
    passed: false,
    questions: [
      {
        id: "fq1",
        question: "Nilai lim x→0 (1-cos x)/x² adalah?",
        options: ["0", "1/2", "1", "2"],
        correctAnswer: 1,
      },
      {
        id: "fq2",
        question: "Turunan dari f(x) = sin(2x) adalah?",
        options: ["cos(2x)", "2cos(2x)", "-2cos(2x)", "2sin(2x)"],
        correctAnswer: 1,
      },
      {
        id: "fq3",
        question: "∫2x dx = ?",
        options: ["x²", "x² + C", "2x² + C", "x + C"],
        correctAnswer: 1,
      },
      {
        id: "fq4",
        question: "Determinan matriks [[1,2],[3,4]] adalah?",
        options: ["-2", "2", "-10", "10"],
        correctAnswer: 0,
      },
    ],
  },
  {
    id: "final-physics",
    subjectId: "physics",
    title: "Ujian Akhir Fisika",
    passed: false,
    questions: [
      {
        id: "fq1",
        question: "Satuan dari gaya adalah?",
        options: ["Joule", "Newton", "Watt", "Pascal"],
        correctAnswer: 1,
      },
      {
        id: "fq2",
        question: "Hukum kekekalan energi menyatakan?",
        options: [
          "Energi dapat diciptakan",
          "Energi tidak dapat dimusnahkan",
          "Energi total selalu tetap",
          "Energi selalu berkurang",
        ],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: "final-chemistry",
    subjectId: "chemistry",
    title: "Ujian Akhir Kimia",
    passed: false,
    questions: [
      {
        id: "fq1",
        question: "Ikatan ion terjadi antara?",
        options: [
          "Logam dan logam",
          "Non-logam dan non-logam",
          "Logam dan non-logam",
          "Gas mulia",
        ],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: "final-biology",
    subjectId: "biology",
    title: "Ujian Akhir Biologi",
    passed: false,
    questions: [
      {
        id: "fq1",
        question: "Organel yang berperan dalam respirasi sel adalah?",
        options: ["Ribosom", "Mitokondria", "Lisosom", "Nukleus"],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: "final-english",
    subjectId: "english",
    title: "Final Exam English",
    passed: false,
    questions: [
      {
        id: "fq1",
        question: 'The correct passive form of "She writes a letter" is?',
        options: [
          "A letter is written by her",
          "A letter was written by her",
          "A letter written by her",
          "A letter is wrote by her",
        ],
        correctAnswer: 0,
      },
    ],
  },
  {
    id: "final-indonesian",
    subjectId: "indonesian",
    title: "Ujian Akhir Bahasa Indonesia",
    passed: false,
    questions: [
      {
        id: "fq1",
        question: "Ciri utama teks eksposisi adalah?",
        options: [
          "Berisi cerita fiksi",
          "Berisi langkah-langkah",
          "Berisi argumen dan fakta",
          "Berisi dialog",
        ],
        correctAnswer: 2,
      },
    ],
  },
];
