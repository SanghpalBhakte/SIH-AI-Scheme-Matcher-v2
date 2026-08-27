import type { EntrepreneurProfile } from '@/lib/matching/types'

// Three preset profiles for fast, reliable live demos — lets the team
// skip manual form entry during the pitch and jump straight to
// results for a known-good, previously verified scenario.

export interface DemoProfile {
  id: string
  label: string
  description: string
  profile: EntrepreneurProfile
}

export const demoProfiles: DemoProfile[] = [
  {
    id: 'rural-first-time-artisan',
    label: 'Rural first-time artisan',
    description: 'SC woman, rural Bihar, handicrafts, idea stage, first-time entrepreneur, low income.',
    profile: {
      category: 'SC',
      gender: 'Woman',
      state: 'Bihar',
      sector: 'Handicrafts',
      stage: 'Idea',
      firstTimeEntrepreneur: true,
      annualIncomeRange: '1-3l',
    },
  },
  {
    id: 'urban-tech-founder',
    label: 'Urban tech founder',
    description: 'General category man, Karnataka, technology sector, early stage, not first-time, income undisclosed.',
    profile: {
      category: 'General',
      gender: 'Man',
      state: 'Karnataka',
      sector: 'Technology',
      stage: 'Early',
      firstTimeEntrepreneur: false,
      annualIncomeRange: '',
    },
  },
  {
    id: 'st-agri-entrepreneur',
    label: 'ST agri-business owner',
    description: 'ST woman, Odisha, agriculture, idea stage, not first-time, very low income.',
    profile: {
      category: 'ST',
      gender: 'Woman',
      state: 'Odisha',
      sector: 'Agriculture',
      stage: 'Idea',
      firstTimeEntrepreneur: false,
      annualIncomeRange: 'below-1l',
    },
  },
]
