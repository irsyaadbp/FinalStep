import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User, Subject, Chapter, Quiz, FinalExam, Settings } from '../models';
import { success, error as responseError } from '../utils/response';

const subjectsData = [
  { title: 'Matematika', slug: 'matematika', icon: '📐', color: '#3B82F6', order: 1 },
  { title: 'Fisika', slug: 'fisika', icon: '⚡', color: '#EF4444', order: 2 },
  { title: 'Kimia', slug: 'kimia', icon: '🧪', color: '#10B981', order: 3 },
  { title: 'Biologi', slug: 'biologi', icon: '🧬', color: '#8B5CF6', order: 4 },
  { title: 'Bahasa Inggris', slug: 'bahasa-inggris', icon: '🇬🇧', color: '#F59E0B', order: 5 },
  { title: 'Sejarah', slug: 'sejarah', icon: '📜', color: '#6366F1', order: 6 },
];

/**
 * @desc    Seed database with dummy data
 * @route   GET /api/seed
 * @access  Public (Should be restricted in production)
 */
export const seedData = async (req: Request, res: Response) => {
  try {
    const { reset } = req.query;

    if (reset === '1') {
      await User.deleteMany({});
      await Subject.deleteMany({});
      await Chapter.deleteMany({});
      await Quiz.deleteMany({});
      await FinalExam.deleteMany({});
      await Settings.deleteMany({});
      console.log('Database cleared');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // 1. Create Admin if not exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@finalstep.com',
        password: hashedPassword,
        role: 'admin',
      });
    }

    // 2. Create Students (Min 30)
    const studentCount = await User.countDocuments({ role: 'student' });
    if (studentCount < 30) {
      const studentsToCreate = [];
      
      // Match the first 3 from seed.ts
      if (studentCount === 0) {
        studentsToCreate.push(
          { name: 'Andi Siswa', email: 'andi@student.com', password: hashedPassword, role: 'student', school: 'SMA 1 Jakarta', targetUniversity: 'UI' },
          { name: 'Budi Belajar', email: 'budi@student.com', password: hashedPassword, role: 'student', school: 'SMA 3 Bandung', targetUniversity: 'ITB' },
          { name: 'Citra Cerdas', email: 'citra@student.com', password: hashedPassword, role: 'student', school: 'SMA 5 Surabaya', targetUniversity: 'UGM' }
        );
      }

      // Fill up to 30
      const currentToCreate = studentsToCreate.length + studentCount;
      for (let i = currentToCreate + 1; i <= 30; i++) {
        studentsToCreate.push({
          name: `Student ${i}`,
          email: `student${i}@finalstep.com`,
          password: hashedPassword,
          role: 'student',
          school: `SMA ${Math.floor(Math.random() * 10) + 1} Jakarta`,
          targetUniversity: ['UI', 'ITB', 'UGM', 'UNAIR', 'ITS'][Math.floor(Math.random() * 5)],
          xp: Math.floor(Math.random() * 1000),
          level: Math.floor(Math.random() * 5) + 1,
        });
      }
      
      await User.create(studentsToCreate);
    }

    // 3. Create Settings if not exists
    const settingsExists = await Settings.findOne({ key: 'global' });
    if (!settingsExists) {
      await Settings.create({
        key: 'global',
        examDate: new Date('2026-06-01'),
        targetThreshold: 80,
      });
    }

    // 4. Create Subjects and content if they don't exist
    const subCount = await Subject.countDocuments();
    if (subCount === 0) {
      for (const sub of subjectsData) {
        const subject = await Subject.create(sub);
        
        // Final Exam
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

        // Chapters
        for (let i = 1; i <= 3; i++) {
          const chapterSlug = `${subject.slug}-chapter-${i}`;
          const chapter = await Chapter.create({
            subjectSlug: subject.slug,
            slug: chapterSlug,
            title: `Bab ${i}: Pengenalan ${subject.title}`,
            content: `<p>Ini adalah konten pembelajaran untuk Bab ${i} pada mata pelajaran ${subject.title}.</p><ul><li>Poin 1</li><li>Poin 2</li></ul>`,
            order: i,
          });

          // Quiz
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
    }

    // 5. Add default progress for the first student (Andi) if resetting or first time
    if (reset === '1') {
      const student = await User.findOne({ email: 'andi@student.com' });
      if (student) {
        const math = subjectsData[0];
        student.progress.push({
            subjectSlug: math.slug,
            progressPercent: 33,
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
      }
    }

    const finalStudentCount = await User.countDocuments({ role: 'student' });

    return res.status(200).json(success('Database seeded successfully (synchronized with seed.ts)', {
      admin: adminExists ? 'Exists' : 'Created',
      studentsCreated: 30 - studentCount > 0 ? 30 - studentCount : 0,
      totalStudents: finalStudentCount,
      subjects: await Subject.countDocuments(),
      chapters: await Chapter.countDocuments(),
    }));

  } catch (err: any) {
    console.error('Seeding Error:', err);
    return res.status(500).json(responseError('Failed to seed database', { error: [err.message] }));
  }
};
