const ROLES = ['coordinator', 'recruiter', 'mentor', 'observer'] as const

const ROLE_LABELS: Record<string, string> = {
  coordinator: 'Koordynator',
  recruiter: 'Rekruter',
  mentor: 'Mentor',
  observer: 'Obserwator',
}

function canSeeSettings(role: string) {
  return role === 'coordinator' || role === 'observer'
}

function canEditSettings(role: string) {
  return role === 'coordinator'
}

function canEditForm(role: string) {
  return role === 'coordinator' || role === 'recruiter'
}

export { ROLES, ROLE_LABELS, canEditForm, canEditSettings, canSeeSettings }
