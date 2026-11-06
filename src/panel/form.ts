type ApplicationForm = {
  id: number
  title: string
  description: string | null
  slug: string
  is_accepting_responses: boolean
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

export type { ApplicationForm, Choice, Question, QuestionType }
