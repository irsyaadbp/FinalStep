# FinalStep

FinalStep adalah platform pembelajaran full-stack yang terdiri dari dashboard web, API backend, dan aplikasi mobile.

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

<a name="english"></a>

## English

FinalStep is a full-stack learning platform consisting of a web dashboard, a backend API, and a mobile application.

### 1. Getting Started

Clone the repository to your local machine:

```bash
git clone https://github.com/irsyaadbp/FinalStep.git
cd FinalStep
```

### 2. Project Structure

The project is organized into three main directories:

- `backend/`: Express.js server with TypeScript, using MongoDB for data storage.
- `frontend/`: Vite + React web application for the dashboard and management.
- `mobile/`: Expo + React Native mobile application for students.

### 3. Prerequisites

- Node.js (v18+)
- npm
- MongoDB (local or [Atlas](https://www.mongodb.com))

### 4. Installation & Development

#### Backend

```bash
cd backend
npm install
cp .env.example .env # Update with your MongoDB URI and JWT Secret
npm run dev
```

**Seeding Dummy Data (Optional):**
- **CLI**: Run `npm run seed` in the `backend/` directory.
- **Endpoint**: Visit `http://localhost:5000/api/seed` in your browser.

#### Frontend

```bash
cd frontend
npm install
cp .env.example .env # Update VITE_API_URL to your local backend
npm run dev
```

#### Mobile

```bash
cd mobile
npm install
cp .env.example .env # Update EXPO_PUBLIC_API_URL to your local backend
npm start
```

### 5. Deployment Info

#### Deployed Applications (Demo)

- **Frontend Dashboard**: [finalstep.syaad.dev](https://finalstep.syaad.dev)
- **Backend API**: [finalstep-be.syaad.dev](https://finalstep-be.syaad.dev)
- **Seed API**: [finalstep-be.syaad.dev/api/seed](https://finalstep-be.syaad.dev/api/seed)

#### Mobile App (Expo Publish)

To preview the mobile app, you can scan the QR code below using the **Expo Go** app (available on Play Store/App Store).

![Expo QR Code Placeholder](/expo-qr.png)

### 6. Testing Accounts

You can use these accounts to test the application's functionality:

**Admin (Dashboard):**
- **Email:** `admin@finalstep.com`
- **Password:** `password123`

**Students:**
- **Email:** `budi@student.com`, `andi@student.com`, `citra@student.com`
- **Password:** `password123`

### 7. Tech Stack

- **Backend**: Express, TypeScript, Mongoose, Zod, JWT
- **Frontend**: React, Vite, Tailwind CSS, Lucide React, Framer Motion
- **Mobile**: Expo, React Native, NativeWind, Expo Router

---

<a name="bahasa-indonesia"></a>

## Bahasa Indonesia

FinalStep adalah platform pembelajaran full-stack yang terdiri dari dashboard web, API backend, dan aplikasi mobile.

### 1. Memulai (Cloning Repo)

Clone repositori ke mesin lokal Anda:

```bash
git clone https://github.com/irsyaadbp/FinalStep.git
cd FinalStep
```

### 2. Struktur Proyek

Proyek ini terbagi menjadi tiga direktori utama:

- `backend/`: Server Express.js dengan TypeScript, menggunakan MongoDB untuk penyimpanan data.
- `frontend/`: Aplikasi web Vite + React untuk dashboard dan manajemen.
- `mobile/`: Aplikasi mobile Expo + React Native untuk siswa.

### 3. Prasyarat

- Node.js (v18+)
- npm
- MongoDB (lokal atau [Atlas](https://www.mongodb.com))

### 4. Instalasi & Pengembangan

#### Backend

```bash
cd backend
npm install
cp .env.example .env # Perbarui dengan URI MongoDB dan JWT Secret Anda
npm run dev
```

**Seeding Data Dummy (Opsional):**
- **CLI**: Jalankan `npm run seed` di direktori `backend/`.
- **Endpoint**: Kunjungi `http://localhost:5000/api/seed` di browser Anda.

#### Frontend

```bash
cd frontend
npm install
cp .env.example .env # Perbarui VITE_API_URL ke backend lokal Anda
npm run dev
```

#### Mobile

```bash
cd mobile
npm install
cp .env.example .env # Perbarui EXPO_PUBLIC_API_URL ke backend lokal Anda
npm start
```

### 5. Info Deployment

#### Aplikasi yang Di-deploy (Demo)

- **Frontend Dashboard**: [finalstep.syaad.dev](https://finalstep.syaad.dev)
- **Backend API**: [finalstep-be.syaad.dev](https://finalstep-be.syaad.dev)
- **Seed API**: [finalstep-be.syaad.dev/api/seed](https://finalstep-be.syaad.dev/api/seed)

#### Aplikasi Mobile (Expo Publish)

Untuk melihat pratinjau aplikasi mobile, Anda dapat memindai kode QR di bawah ini menggunakan aplikasi **Expo Go** (tersedia di Play Store/App Store).

![Expo QR Code Placeholder](/expo-qr.png)

### 6. Akun Testing

Anda dapat menggunakan akun-akun berikut untuk menguji fungsionalitas aplikasi:

**Admin (Dashboard):**
- **Email:** `admin@finalstep.com`
- **Password:** `password123`

**Siswa:**
- **Email:** `budi@student.com`, `andi@student.com`, `citra@student.com`
- **Password:** `password123`

### 7. Tech Stack

- **Backend**: Express, TypeScript, Mongoose, Zod, JWT
- **Frontend**: React, Vite, Tailwind CSS, Lucide React, Framer Motion
- **Mobile**: Expo, React Native, NativeWind, Expo Router
