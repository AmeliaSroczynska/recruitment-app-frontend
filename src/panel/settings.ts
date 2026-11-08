type Organization = {
  id: number
  name: string
  slug: string
  contact_email: string
  logo_url: string | null
}

type Edition = {
  id: number
  name: string
  is_active: boolean
}

type Member = {
  id: number
  user_id: number
  email: string
  first_name: string
  last_name: string
  role: string
}

export type { Edition, Member, Organization }
