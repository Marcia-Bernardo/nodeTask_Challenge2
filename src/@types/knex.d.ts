/* eslint-disable prettier/prettier */
// eslint-disable-next-line
import { knex } from 'knex'

declare module 'knex/types/tables' {
    export interface Tables {
        meals: {
            id: string
            name: string
            description: string
            date: string
            diet: boolean
            created_at: string
            session_id?: string
        }
    }
}
