import { 
  PerformanceReviewStatus, 
  PerformanceReviewPeriod, 
  PerformanceReviewScore, 
  PerformanceReviewCategory 
} from '@/core/models/enums';

// Performance Review Status Options
export const performanceReviewStatusOptions = [
  { value: PerformanceReviewStatus.DRAFT, label: 'Draft', class: 'badge-light-gray' },
  { value: PerformanceReviewStatus.SUBMITTED, label: 'Submitted', class: 'badge-light-warning' },
  { value: PerformanceReviewStatus.APPROVED, label: 'Approved', class: 'badge-light-primary' },
  { value: PerformanceReviewStatus.COMPLETED, label: 'Completed', class: 'badge-light-success' }
];

// Performance Review Period Options
export const performanceReviewPeriodOptions = [
  { value: PerformanceReviewPeriod.Q1, label: 'Q1 (January - March)' },
  { value: PerformanceReviewPeriod.Q2, label: 'Q2 (April - June)' },
  { value: PerformanceReviewPeriod.Q3, label: 'Q3 (July - September)' },
  { value: PerformanceReviewPeriod.Q4, label: 'Q4 (October - December)' },
  { value: PerformanceReviewPeriod.ANNUAL, label: 'Annual Review' },
  { value: PerformanceReviewPeriod.BIANNUAL, label: 'Bi-annual Review' }
];

// Performance Review Score Options
export const performanceReviewScoreOptions = [
  { value: PerformanceReviewScore.ONE, label: '1.0 - Unsatisfactory' },
  { value: PerformanceReviewScore.ONE_POINT_FIVE, label: '1.5 - Below Average' },
  { value: PerformanceReviewScore.TWO, label: '2.0 - Needs Improvement' },
  { value: PerformanceReviewScore.TWO_POINT_FIVE, label: '2.5 - Developing' },
  { value: PerformanceReviewScore.THREE, label: '3.0 - Meets Expectations' },
  { value: PerformanceReviewScore.THREE_POINT_FIVE, label: '3.5 - Above Average' },
  { value: PerformanceReviewScore.FOUR, label: '4.0 - Exceeds Expectations' },
  { value: PerformanceReviewScore.FOUR_POINT_FIVE, label: '4.5 - Outstanding' },
  { value: PerformanceReviewScore.FIVE, label: '5.0 - Exceptional' }
];

// Performance Review Category Options
export const performanceReviewCategoryOptions = [
  { value: PerformanceReviewCategory.TECHNICAL_SKILLS, label: 'Technical Skills' },
  { value: PerformanceReviewCategory.SOFT_SKILLS, label: 'Soft Skills' },
  { value: PerformanceReviewCategory.LEADERSHIP, label: 'Leadership' },
  { value: PerformanceReviewCategory.COMMUNICATION, label: 'Communication' },
  { value: PerformanceReviewCategory.PROBLEM_SOLVING, label: 'Problem Solving' },
  { value: PerformanceReviewCategory.TEAMWORK, label: 'Teamwork' },
  { value: PerformanceReviewCategory.INITIATIVE, label: 'Initiative' },
  { value: PerformanceReviewCategory.ADAPTABILITY, label: 'Adaptability' },
  { value: PerformanceReviewCategory.TIME_MANAGEMENT, label: 'Time Management' },
  { value: PerformanceReviewCategory.QUALITY_OF_WORK, label: 'Quality of Work' }
];

// Helper functions
export const getStatusLabel = (status: PerformanceReviewStatus): string => {
  const option = performanceReviewStatusOptions.find(opt => opt.value === status);
  return option?.label || status;
};

export const getStatusClass = (status: PerformanceReviewStatus): string => {
  const option = performanceReviewStatusOptions.find(opt => opt.value === status);
  return option?.class || 'badge-light-gray';
};

export const getPeriodLabel = (period: PerformanceReviewPeriod): string => {
  const option = performanceReviewPeriodOptions.find(opt => opt.value === period);
  return option?.label || period;
};

export const getScoreLabel = (score: PerformanceReviewScore): string => {
  const option = performanceReviewScoreOptions.find(opt => opt.value === score);
  return option?.label || score.toString();
};

export const getCategoryLabel = (category: PerformanceReviewCategory): string => {
  const option = performanceReviewCategoryOptions.find(opt => opt.value === category);
  return option?.label || category;
}; 