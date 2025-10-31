export type Address = {
  city: string
  street: string
  house: string
}

export type Organization = {
  id: string
  name: string
  directorFullName: string
  phone: string
  address: Address
}

export type SortKey = 'name' | 'directorFullName' | null

export type SortState = {
  key: SortKey
  direction: 'asc' | 'desc'
}

