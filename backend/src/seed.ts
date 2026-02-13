import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User, Subject, Chapter, Quiz, FinalExam, Settings } from './models';

dotenv.config();

const subjectsData = [
  { title: 'Matematika', slug: 'matematika', icon: '📐', color: '#3B82F6', order: 1 },
  { title: 'Fisika', slug: 'fisika', icon: '⚡', color: '#EF4444', order: 2 },
  { title: 'Kimia', slug: 'kimia', icon: '🧪', color: '#10B981', order: 3 },
  { title: 'Biologi', slug: 'biologi', icon: '🧬', color: '#8B5CF6', order: 4 },
  { title: 'Bahasa Inggris', slug: 'bahasa-inggris', icon: '🇬🇧', color: '#F59E0B', order: 5 },
  { title: 'Sejarah', slug: 'sejarah', icon: '📜', color: '#6366F1', order: 6 },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/finalstep');
    console.log('MongoDB Connected');

    // Clear existing data
    await User.deleteMany({});
    await Subject.deleteMany({});
    await Chapter.deleteMany({});
    await Quiz.deleteMany({});
    await FinalExam.deleteMany({});
    await Settings.deleteMany({});

    console.log('Data cleared');

    // Create Users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@finalstep.com',
      password: hashedPassword,
      role: 'admin',
    });

    const students = await User.create([
      { name: 'Andi Siswa', email: 'andi@student.com', password: hashedPassword, role: 'student', school: 'SMA 1 Jakarta', targetUniversity: 'UI' },
      { name: 'Budi Belajar', email: 'budi@student.com', password: hashedPassword, role: 'student', school: 'SMA 3 Bandung', targetUniversity: 'ITB' },
      { name: 'Citra Cerdas', email: 'citra@student.com', password: hashedPassword, role: 'student', school: 'SMA 5 Surabaya', targetUniversity: 'UGM' },
    ]);

    console.log('Users created');

    // Create Settings
    await Settings.create({
      key: 'global',
      examDate: new Date('2026-06-01'),
      targetThreshold: 80,
    });

    console.log('Settings created');

    // Create Subjects and content
    for (const sub of subjectsData) {
      const subject = await Subject.create(sub);
      
      // Create Final Exam
      await FinalExam.create({
        subjectSlug: subject.slug,
        title: `Ujian Akhir ${subject.title}`,
        duration: 90,
        questions: [
          { question: `Apa itu ${subject.title}?`, options: ['Ilmu', 'Seni', 'Olahraga', 'Musik'], correctAnswer: 0 },
          { question: '1 + 1 = ?', options: ['1', '2', '3', '4'], correctAnswer: 1 },
          { question: 'Ibukota Indonesia?', options: ['Medan', 'Surabaya', 'Jakarta', 'Bandung'], correctAnswer: 2 },
          { question: 'Warna bendera RI?', options: ['Merah Putih', 'Biru Putih', 'Hijau Kuning', 'Hitam Putih'], correctAnswer: 0 },
        ]
      });

      // Create Chapters
      for (let i = 1; i <= 3; i++) {
        const chapterSlug = `${subject.slug}-chapter-${i}`;
        const chapter = await Chapter.create({
          subjectSlug: subject.slug,
          slug: chapterSlug,
          title: `Bab ${i}: Pengenalan ${subject.title}`,
          content: `<p>Ini adalah konten pembelajaran untuk Bab ${i} pada mata pelajaran ${subject.title}.</p><ul><li>Poin 1</li><li>Poin 2</li></ul>`,
          order: i,
        });

        // Create Quiz for Chapter
        await Quiz.create({
          chapterSlug: chapter.slug,
          subjectSlug: subject.slug,
          title: `Kuis Bab ${i}`,
          questions: [
            { question: `Pertanyaan kuis bab ${i}?`, options: ['A', 'B', 'C', 'D'], correctAnswer: 0 },
            { question: 'Benar atau Salah?', options: ['Benar', 'Salah', 'Ragu', 'Tidak Tahu'], correctAnswer: 0 },
            { question: 'Pilih jawaban C', options: ['A', 'D', 'C', 'B'], correctAnswer: 2 },
            { question: 'Berapa 5 * 5?', options: ['10', '20', '25', '30'], correctAnswer: 2 },
          ]
        });
      }
    }

    console.log('Subjects, Chapters, Quizzes, Exams created');

    // Add some progress for students
    const student = students[0];
    const math = subjectsData[0];
    
    // Simulate completing chapter 1 of math
    student.progress.push({
        subjectSlug: math.slug,
        progressPercent: 33, // 1 of 3 chapters
        completedChapters: [`${math.slug}-chapter-1`],
        completedQuizzes: [],
        finalExamDone: false,
        lastAccessedAt: new Date(),
    });
    student.lastStudy = {
        subjectSlug: math.slug,
        chapterSlug: `${math.slug}-chapter-1`,
        type: 'chapter',
        title: `Bab 1: Pengenalan ${math.title}`,
        updatedAt: new Date(),
    };
    await student.save();

    console.log('Dummy progress added');

    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
