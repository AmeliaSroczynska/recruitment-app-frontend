import type { EntryKind } from '@/panel/onboarding'

type InterviewTemplate = {
  id: number
  name: string
  question_count: number
}

type InterviewQuestion = {
  id: number
  text: string
  position: number
}

type InterviewTemplateDetails = {
  id: number
  name: string
  questions: InterviewQuestion[]
}

type Interviewer = {
  id: number
  first_name: string
  last_name: string
  email: string
  photo_url: string | null
}

type Interview = {
  id: number
  template_id: number
  template_name: string
  date: string | null
  start_time: string | null
  end_time: string | null
  interviewers: Interviewer[]
}

type EditionInterview = Interview & {
  application_id: number
  first_name: string
  last_name: string
  email: string
  photo_url: string | null
}

type InterviewAnswer = {
  question_id: number
  text: string
  note: string | null
  score: number | null
}

const NEW_TEMPLATE_NAME = 'Nowy szablon'

const INTERVIEWER_ROLES = ['coordinator', 'recruiter']

function getQuestionEntry(templateId: number): EntryKind {
  return {
    path: `interview-templates/${templateId}/questions`,
    titleField: 'text',
    itemLabel: 'Pytanie',
    titleLabel: 'Treść pytania',
    newTitle: 'Nowe pytanie',
    addLabel: 'Dodaj pytanie',
    emptyText: 'Ten szablon nie ma jeszcze pytań.',
    loadError: 'Nie udało się wczytać pytań.',
    deleteLabel: 'Usuń pytanie',
    deleteTitle: 'Usunąć pytanie?',
    deleteDescription:
      'Pytanie zniknie z szablonu i z nowych rozmów. Notatki i oceny z rozmów, które już się odbyły, zostaną.',
  }
}

function formatQuestionCount(count: number) {
  if (count === 1) {
    return '1 pytanie'
  }
  const lastDigit = count % 10
  const lastTwoDigits = count % 100
  if (
    lastDigit >= 2 &&
    lastDigit <= 4 &&
    (lastTwoDigits < 12 || lastTwoDigits > 14)
  ) {
    return `${count} pytania`
  }
  return `${count} pytań`
}

function formatInterviewTerm(interview: Interview) {
  if (!interview.date) {
    return 'bez terminu'
  }
  const [year, month, day] = interview.date.split('-').map(Number)
  const date = new Date(year, month - 1, day).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'short',
  })
  return interview.start_time
    ? `${date}, ${interview.start_time.slice(0, 5)}`
    : date
}

function formatInterviewers(interview: Interview) {
  if (interview.interviewers.length === 0) {
    return 'nikt nie przypisany'
  }
  return interview.interviewers
    .map((person) =>
      person.last_name
        ? `${person.first_name.charAt(0)}. ${person.last_name}`.trim()
        : person.email,
    )
    .join(', ')
}

export {
  INTERVIEWER_ROLES,
  NEW_TEMPLATE_NAME,
  formatInterviewers,
  formatInterviewTerm,
  formatQuestionCount,
  getQuestionEntry,
}
export type {
  EditionInterview,
  Interview,
  InterviewAnswer,
  Interviewer,
  InterviewQuestion,
  InterviewTemplate,
  InterviewTemplateDetails,
}
