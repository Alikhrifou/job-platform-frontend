// ─── Auth ────────────────────────────────────────────────────────────────────
export type Role = 'STUDENT' | 'COMPANY' | 'ADMIN';

export interface UserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  role: Role;
  userId: number;
}

// ─── Skills ──────────────────────────────────────────────────────────────────
export type SkillMap = Record<string, number>; // skillName -> level (1-5)
export type SkillIdMap = Record<number, number>; // skillId -> level (1-5)

export interface Skill {
  id: number;
  name: string;
  category: string;
  description?: string;
}

// ─── Student ─────────────────────────────────────────────────────────────────
export interface StudentProfileRequest {
  university?: string;
  major?: string;
  graduationDate?: string;
  bio?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  gpa?: number;
  skills?: SkillIdMap;
}

export interface StudentProfileResponse {
  id: number;
  userId: number;
  email: string;
  fullName: string;
  university?: string;
  major?: string;
  graduationDate?: string;
  bio?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  gpa?: number;
  skills: SkillMap;
}

// ─── Company ─────────────────────────────────────────────────────────────────
export interface CompanyProfileRequest {
  companyName: string;
  industry?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  description?: string;
  logoUrl?: string;
  employeeCount?: number;
}

export interface CompanyProfileResponse {
  id: number;
  userId: number;
  companyName: string;
  industry?: string;
  website?: string;
  city?: string;
  description?: string;
  logoUrl?: string;
  employeeCount?: number;
}

// ─── Jobs ─────────────────────────────────────────────────────────────────────
export type JobType = 'INTERNSHIP' | 'JOB' | 'PART_TIME' | 'CONTRACT';

export interface JobOfferRequest {
  title: string;
  description?: string;
  location: string;
  jobType?: JobType;
  salary?: number;
  salaryRange?: string;
  closingDate?: string;
  requiredSkills?: SkillIdMap;
  isActive?: boolean;
}

export interface JobOfferResponse {
  id: number;
  companyId: number;
  companyName: string;
  title: string;
  description?: string;
  location: string;
  jobType?: string;
  salary?: number;
  salaryRange?: string;
  isActive: boolean;
  createdAt: string;
  closingDate?: string;
  requiredSkills: SkillMap;
  applicationsCount: number;
}

// ─── Applications ────────────────────────────────────────────────────────────
export type ApplicationStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'SHORTLISTED'
  | 'INTERVIEW_SCHEDULED'
  | 'OFFER_EXTENDED'
  | 'DECLINED';

export interface ApplicationRequest {
  jobId: number;
  coverLetter?: string;
}

export interface ApplicationResponse {
  id: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  studentId: number;
  studentName: string;
  studentEmail?: string;
  studentUniversity?: string;
  studentMajor?: string;
  studentGpa?: number;
  studentBio?: string;
  studentPortfolioUrl?: string;
  studentResumeUrl?: string;
  status: ApplicationStatus;
  coverLetter?: string;
  matchScore?: number;
  appliedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
}
