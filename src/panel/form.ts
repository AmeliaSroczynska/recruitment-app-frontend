type ApplicationForm = {
  id: number
  title: string
  description: string | null
  slug: string
  is_accepting_responses: boolean
  header_image_url: string | null
}

type QuestionType = {
  name: string
  label: string
}

type Choice = {
  id: number
  text: string
  position: number
}

type Question = {
  id: number
  type: string
  text: string
  position: number
  is_required: boolean
  choices: Choice[]
}

type PublicForm = {
  title: string
  description: string | null
  organization_name: string
  header_image_url: string | null
  is_accepting_responses: boolean
  questions: Question[]
}

type AnswerInput = {
  question: number
  text?: string
  choices?: number[]
}

type ApplicationInput = {
  first_name: string
  last_name: string
  email: string
  answers: AnswerInput[]
}

export type {
  AnswerInput,
  ApplicationForm,
  ApplicationInput,
  Choice,
  PublicForm,
  Question,
  QuestionType,
}
