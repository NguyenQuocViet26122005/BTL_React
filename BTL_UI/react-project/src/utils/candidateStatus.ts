export const CANDIDATE_STATUS = {
  SANG_TIM_VIEC: 'SangTimViec',
  MO_TIM_VIEC: 'MoTimViec',
  KHONG_TIM_VIEC: 'KhongTimViec',
} as const;

export type CandidateStatus = typeof CANDIDATE_STATUS[keyof typeof CANDIDATE_STATUS];

const legacyStatusMap: Record<string, CandidateStatus> = {
  SanSang: CANDIDATE_STATUS.SANG_TIM_VIEC,
  'San sang': CANDIDATE_STATUS.SANG_TIM_VIEC,
  'Sẵn sàng': CANDIDATE_STATUS.SANG_TIM_VIEC,
  'Dang tim viec': CANDIDATE_STATUS.SANG_TIM_VIEC,
  'Đang tìm việc': CANDIDATE_STATUS.SANG_TIM_VIEC,
  TimKiem: CANDIDATE_STATUS.SANG_TIM_VIEC,
  MoXem: CANDIDATE_STATUS.MO_TIM_VIEC,
  'Mo tim viec': CANDIDATE_STATUS.MO_TIM_VIEC,
  'Mở tìm việc': CANDIDATE_STATUS.MO_TIM_VIEC,
  KhongTimKiem: CANDIDATE_STATUS.KHONG_TIM_VIEC,
  'Khong tim viec': CANDIDATE_STATUS.KHONG_TIM_VIEC,
  'Không tìm việc': CANDIDATE_STATUS.KHONG_TIM_VIEC,
};

export const normalizeCandidateStatus = (status?: string): CandidateStatus => {
  if (!status) return CANDIDATE_STATUS.SANG_TIM_VIEC;
  if (Object.values(CANDIDATE_STATUS).includes(status as CandidateStatus)) return status as CandidateStatus;
  return legacyStatusMap[status] || CANDIDATE_STATUS.SANG_TIM_VIEC;
};

export const getCandidateStatusText = (status?: string) => {
  const normalized = normalizeCandidateStatus(status);
  if (normalized === CANDIDATE_STATUS.SANG_TIM_VIEC) return 'Sẵn sàng tìm việc';
  if (normalized === CANDIDATE_STATUS.MO_TIM_VIEC) return 'Mở tìm việc';
  return 'Không tìm việc';
};

export const getCandidateStatusColor = (status?: string) => {
  const normalized = normalizeCandidateStatus(status);
  if (normalized === CANDIDATE_STATUS.SANG_TIM_VIEC) return 'green';
  if (normalized === CANDIDATE_STATUS.MO_TIM_VIEC) return 'blue';
  return 'gray';
};
