import {
  customType,
  jsonb,
  pgTable,
  serial,
  text,
  uuid,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const numeric = customType<{
  data: number;
  driverData: number;
}>({
  dataType: () => 'numeric',
  fromDriver: (value) => value,
});

/**
 * ACTIONS.
 */
export const actions = pgTable('actions', {
  id: serial('id').primaryKey(),
  type: text('type', { enum: ['create'] }).notNull(),
  data: jsonb('data').$type<{}>().notNull(),
});

export const insertActionSchema = createInsertSchema(actions);
export const selectActionSchema = createSelectSchema(actions);

/**
 * MEAL PLAN.
 */
export const mealPlans = pgTable('meal_plans', {
  id: uuid('id').primaryKey(),
  name: text('name'),
});

export const insertMealPlanSchema = createInsertSchema(mealPlans);
export const selectMealPlanSchema = createSelectSchema(mealPlans);

/**
 * MEAL.
 */
export const meals = pgTable('meals', {
  id: uuid('id').primaryKey(),
  name: text('name').notNull(),
  energy: numeric('energy').notNull(),
  protein: numeric('protein').notNull(),
});

export const insertMealSchema = createInsertSchema(meals, {
  energy: z.number(),
  protein: z.number(),
});
export const selectMealSchema = createSelectSchema(meals, {
  energy: z.number(),
  protein: z.number(),
});
