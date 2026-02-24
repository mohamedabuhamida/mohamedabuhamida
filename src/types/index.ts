export interface HeroProps {
  data: {
    title: string;
    name: string;
    typing_texts: string[];
    years_experience: number;
    projects_count: number;
    is_available: boolean;
  };
}

export interface SkillProps {
  id: number;
  name: string;
  percentage: number;
}

export interface CertificateProps {
  id: number;
  title: string;
  organization: string;
  issue_date?: string;
  expiration_date?: string;
  credential_id?: string;
  credential_url?: string;
  description?: string;
  created_at?: string;
  order_index?: number; // Optional field for sorting
  logo_url?: string;
}

export interface AchievementProps {
  id: number;
  title: string;
  organization?: string;
  date?: string;
  description?: string;
  certificate_url?: string;
  created_at?: string;
  order_index?: number; // Optional field for sorting
}

export interface ExperienceProps {
  id: number;
  job_title: string;
  company: string;
  location?: string;
  employment_type?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  description?: string;
  created_at?: string;
  order_index?: number; // Optional field for sorting
}

export interface EducationProps {
  id: number;
  degree: string;
  field_of_study?: string;
  institution: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  grade?: string;
  description?: string;
  created_at?: string;
  order_index?: number; // Optional field for sorting
  logo_url?: string;
}

export interface ProjectProps {
  idx: number;
  id: string;

  section: string[]; // ["ML", "Front-End"]

  title: string;
  tagline?: string; // Short cinematic subtitle

  description: string;
  details?: string;

  features?: string[];
  technologies?: string[];

  image: string; // Main card image
  hero_image?: string; // Fullscreen cinematic background

  background_type?: "image" | "video";

  link?: string;

  accent_color?: string; // Hex color (#FF7A00)

  is_featured?: boolean;

  love?: number;
  loved_by_user?: boolean;

  created_at?: string;
  order_index?: number;
}