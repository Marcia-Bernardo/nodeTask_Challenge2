/* eslint-disable prettier/prettier */
import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('meals', (table) => {
        table.uuid('id').primary()
        table.text('name').notNullable()
        table.text('description').notNullable()
        table.timestamp('date').notNullable()
        table.integer('diet').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()

    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('meals')
}
