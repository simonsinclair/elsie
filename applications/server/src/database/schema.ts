import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const meals = pgTable('meals', {
  id: uuid('id').primaryKey(),
});

export const insertMealSchema = createInsertSchema(meals);
export const selectMealSchema = createSelectSchema(meals);
