const ROLE_LABELS: Record<string, string> = {
  coordinator: 'Koordynator',
  recruiter: 'Rekruter',
  mentor: 'Mentor',
  observer: 'Obserwator',
}

function canSeeSettings(role: string) {
  return role === 'coordinator' || role === 'observer'
}

export { ROLE_LABELS, canSeeSettings }
