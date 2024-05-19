import { numeric, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const mealPlans = pgTable('meal_plans', {
  id: uuid('id').primaryKey(),
  name: text('name'),
});

export const meals = pgTable('meals', {
  id: uuid('id').primaryKey(),
  name: text('name').notNull(),
  energy: numeric('energy').notNull(),
  protein: numeric('protein').notNull(),
  mealPlanId: uuid('meal_plan_id').references(() => mealPlans.id),
});

export const insertMealSchema = createInsertSchema(meals);
export const selectMealSchema = createSelectSchema(meals);

export const insertMealPlanSchema = createInsertSchema(mealPlans);
export const selectMealPlanSchema = createSelectSchema(mealPlans);
