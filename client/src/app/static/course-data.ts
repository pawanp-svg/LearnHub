export interface Course {
  id: number;
  name: string;
  price: number;
  description: string;
  isEnrolled: boolean;
  instructor: string;
  thumbnailUrl: string; // New field
}

export interface CourseContent {
  title: string;
  contentLink: string; // YouTube video link
  orderIndex: number;
  isLocked: boolean; // Will be set based on enrollment status
}

export const SAMPLE_COURSES: Course[] = [
  {
    id: 101,
    name: 'Generative AI for Beginners',
    price: 799.0,
    description:
      'Generative AI Made Easy: Start Your Generative AI Journey, Learn ChatGPT, LLM, Prompt engineering, Create GenAI ChatBot.',
    isEnrolled: false,
    instructor: 'Aakriti E-Learning Academy',
    thumbnailUrl: 'https://placehold.co/1280x720/003459/FFFFFF/png?text=AI+Course+Thumbnail',
  },
  {
    id: 102,
    name: 'Advanced TypeScript & RxJS',
    price: 99.0,
    description:
      'Deep dive into reactive programming and modern JavaScript typing for complex applications.',
    isEnrolled: true,
    instructor: 'Ben Smith',
    thumbnailUrl: 'https://placehold.co/1280x720/005980/FFFFFF/png?text=TS+RxJS+Thumbnail',
  },
];

export const COURSE_CONTENT_DATA: CourseContent[] = [
  {
    title: 'Introduction to the Course',
    contentLink: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    orderIndex: 1,
    isLocked: true,
  },
  {
    title: 'Understanding Generative AI',
    contentLink: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    orderIndex: 2,
    isLocked: true,
  },
  { title: 'Quiz: Generative AI Fundamentals', contentLink: '', orderIndex: 3, isLocked: true },
  {
    title: 'Building our Own GenAI Chatbot',
    contentLink: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    orderIndex: 4,
    isLocked: true,
  },
  {
    title: 'Ethical Considerations and Future Trends',
    contentLink: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    orderIndex: 5,
    isLocked: true,
  },
];
