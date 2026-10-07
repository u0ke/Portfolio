export const personal = {
  name: 'Hamza Bari',
  nickname: 'ice',
  role: 'Web Developer',
  age: 19,
  location: 'Agadir, Morocco',
  bio: "I'm a 19-year-old creative developer from Morocco, currently based in Agadir. I specialize in building sleek, minimalist digital experiences that feel calm, fast, and intentional. When I'm not coding, I'm usually hitting the gym or optimizing my gaming setup.",
  heroIntro: "Hi, I'm Hamza",
  heroTitle: 'Web Developer',
  heroDescription:
    'Creative developer from Agadir, Morocco, focused on building clean, fast and thoughtful digital experiences.',
  heroMeta: ['Agadir, Morocco', 'Web Development Student', 'Open to opportunities'],
  email: 'barihamza73@gmail.com',
  github: 'https://github.com/u0ke',
  githubHandle: 'u0ke',
  linkedin: 'https://linkedin.com/u0ke',
  linkedinHandle: 'u0ke',
};

export const aboutFacts = [
  { label: 'Gym Lover', icon: 'dumbbell' },
  { label: 'PC Enthusiast', icon: 'monitor' },
  { label: 'Code Junkie', icon: 'code' },
  { label: 'Coffee Powered', icon: 'coffee' },
] as const;

export const skills = {
  core: [
    'HTML',
    'CSS',
    'Tailwind CSS',
    'JavaScript',
    'Node.js',
    'Python',
    'Git',
    'Figma',
    'VS Code',
  ],
  supporting: [
    'Problem-solving',
    'Teamwork',
    'Communication',
    'Time management',
    'Adaptability',
    'Creativity',
  ],
};

export interface Project {
  id: string;
  name: string;
  year: string;
  description: string;
  tech: string[];
  liveUrl: string;
  githubUrl: string;
  image: string;
}

export const projects: Project[] = [
  {
    id: 'quiz-app',
    name: 'Quiz App',
    year: '2025',
    description:
      'An interactive quiz application designed to test knowledge through engaging multiple-choice questions. It features real-time scoring, instant feedback, progress tracking, and a clean user interface that makes learning both fun and effective.',
    tech: ['HTML', 'JavaScript', 'Tailwind CSS'],
    liveUrl: 'https://github.com/u0ke',
    githubUrl: 'https://github.com/u0ke',
    image: 'quiz-app',
  },
  {
    id: 'task-flow',
    name: 'Task Flow',
    year: '2025',
    description:
      'A modern task management platform that helps users organize, track, and complete their work efficiently. It includes task creation, priority management, progress tracking, deadlines, and an intuitive dashboard.',
    tech: ['HTML5', 'Tailwind', 'JavaScript'],
    liveUrl: 'https://github.com/u0ke',
    githubUrl: 'https://github.com/u0ke',
    image: 'task-flow',
  },
  {
    id: 'ice-portfolio',
    name: "ice's Portfolio",
    year: '2025',
    description:
      'My first personal portfolio, designed with a minimalist approach, soft color palettes, and a smooth, elegant layout inspired by modern design principles.',
    tech: ['HTML', 'CSS', 'Vanilla JavaScript'],
    liveUrl: 'https://github.com/u0ke',
    githubUrl: 'https://github.com/u0ke',
    image: 'ice-portfolio',
  },
];

export const education = {
  institution: 'Ecole du Web Avancé (EWA)',
  program: 'Web Development Program',
  location: 'Agadir, Morocco',
  status: 'Currently Studying',
  period: '2024 — Present',
};

export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
];
