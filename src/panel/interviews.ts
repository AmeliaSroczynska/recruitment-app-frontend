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

const NEW_TEMPLATE_NAME = 'Nowy szablon'

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

export { NEW_TEMPLATE_NAME, formatQuestionCount, getQuestionEntry }
export type { InterviewQuestion, InterviewTemplate, InterviewTemplateDetails }
