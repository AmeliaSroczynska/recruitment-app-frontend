const ROLES = ['coordinator', 'recruiter', 'mentor', 'observer'] as const

const ROLE_LABELS: Record<string, string> = {
  coordinator: 'Koordynator',
  recruiter: 'Rekruter',
  mentor: 'Mentor',
  observer: 'Obserwator',
}

type Access = 'recruitment' | 'onboarding' | 'settings'

function canSeeSettings(role: string) {
  return role === 'coordinator' || role === 'observer'
}

function canSeeRecruitment(role: string) {
  return canSeeSettings(role) || role === 'recruiter'
}

function canSeeOnboarding(role: string) {
  return canSeeSettings(role) || role === 'mentor'
}

function canSee(role: string, access?: Access) {
  if (access === 'recruitment') {
    return canSeeRecruitment(role)
  }
  if (access === 'onboarding') {
    return canSeeOnboarding(role)
  }
  if (access === 'settings') {
    return canSeeSettings(role)
  }
  return true
}

function canEditSettings(role: string) {
  return role === 'coordinator'
}

function canEditForm(role: string) {
  return role === 'coordinator' || role === 'recruiter'
}

function canEditApplications(role: string) {
  return role === 'coordinator' || role === 'recruiter'
}

function canEditApplicationCard(role: string) {
  return role !== 'observer'
}

function canEditInterviews(role: string) {
  return role === 'coordinator' || role === 'recruiter'
}

function canEditOnboarding(role: string) {
  return role === 'coordinator' || role === 'mentor'
}

function canEditNotes(role: string) {
  return role !== 'observer'
}

export {
  ROLES,
  ROLE_LABELS,
  canEditApplicationCard,
  canEditApplications,
  canEditForm,
  canEditInterviews,
  canEditNotes,
  canEditOnboarding,
  canEditSettings,
  canSee,
  canSeeOnboarding,
  canSeeRecruitment,
  canSeeSettings,
}
export type { Access }
