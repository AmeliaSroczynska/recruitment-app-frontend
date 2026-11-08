const ONBOARDING_SECTIONS = [
  { label: 'Zadania', path: 'tasks' },
  { label: 'Mentorzy', path: 'mentors' },
  { label: 'Baza wiedzy', path: 'knowledge' },
  { label: 'FAQ', path: 'faq' },
]

type Entry = {
  id: number
  [field: string]: string | number | null
}

type EntryKind = {
  path: string
  titleField: string
  bodyField: string
  itemLabel: string
  titleLabel: string
  bodyLabel: string
  bodyPlaceholder: string
  newTitle: string
  addLabel: string
  emptyText: string
  loadError: string
  deleteLabel: string
  deleteTitle: string
  deleteDescription: string
  hasFile?: boolean
}

const TASK_ENTRY: EntryKind = {
  path: 'tasks',
  titleField: 'name',
  bodyField: 'description',
  itemLabel: 'Zadanie',
  titleLabel: 'Nazwa zadania',
  bodyLabel: 'Opis zadania',
  bodyPlaceholder: 'Opis zadania (opcjonalnie)',
  newTitle: 'Nowe zadanie',
  addLabel: 'Dodaj zadanie',
  emptyText: 'Lista zadań wdrażających jest jeszcze pusta.',
  loadError: 'Nie udało się wczytać zadań.',
  deleteLabel: 'Usuń zadanie',
  deleteTitle: 'Usunąć zadanie?',
  deleteDescription:
    'Zadanie zniknie na stałe, także u przyjętych kandydatów, razem z ich odhaczeniami.',
}

const FAQ_ENTRY: EntryKind = {
  path: 'faq',
  titleField: 'question',
  bodyField: 'answer',
  itemLabel: 'Pytanie',
  titleLabel: 'Treść pytania',
  bodyLabel: 'Odpowiedź',
  bodyPlaceholder: 'Odpowiedź',
  newTitle: 'Nowe pytanie',
  addLabel: 'Dodaj pytanie',
  emptyText: 'Nie ma jeszcze żadnych pytań.',
  loadError: 'Nie udało się wczytać pytań.',
  deleteLabel: 'Usuń pytanie',
  deleteTitle: 'Usunąć pytanie?',
  deleteDescription:
    'Pytanie i odpowiedź znikną na stałe, także u przyjętych kandydatów.',
}

const DOCUMENT_ENTRY: EntryKind = {
  path: 'documents',
  titleField: 'name',
  bodyField: 'description',
  itemLabel: 'Dokument',
  titleLabel: 'Nazwa dokumentu',
  bodyLabel: 'Opis dokumentu',
  bodyPlaceholder: 'Opis dokumentu (opcjonalnie)',
  newTitle: '',
  addLabel: 'Dodaj dokument',
  emptyText: 'Baza wiedzy jest jeszcze pusta.',
  loadError: 'Nie udało się wczytać dokumentów.',
  deleteLabel: 'Usuń dokument',
  deleteTitle: 'Usunąć dokument?',
  deleteDescription:
    'Dokument i jego plik znikną na stałe, także u przyjętych kandydatów.',
  hasFile: true,
}

type CandidateTask = {
  id: number
  name: string
  description: string | null
  completed: boolean
}

type FaqQuestion = {
  id: number
  question: string
  answer: string
  position: number
}

type KnowledgeDocument = {
  id: number
  name: string
  description: string | null
  position: number
  file_url: string
  file_type: string
}

export { DOCUMENT_ENTRY, FAQ_ENTRY, ONBOARDING_SECTIONS, TASK_ENTRY }
export type { CandidateTask, Entry, EntryKind, FaqQuestion, KnowledgeDocument }
