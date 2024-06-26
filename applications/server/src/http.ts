import { serve } from '@hono/node-server';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { desc } from 'drizzle-orm';

import { database } from './database';
import {
  actions,
  insertMealPlanSchema,
  insertMealSchema,
  mealPlans,
  meals,
} from './database/schema';

const PORT = 3000;

const application = new Hono();

const router = application
  .get('/state', async (context) => {
    try {
      const { result, lastActionId } = await database.transaction(
        async (transaction) => {
          const mealsResult = await transaction.select().from(meals);
          const mealPlansResult = await transaction.select().from(mealPlans);
          const [latestAction] = await transaction
            .select({ id: actions.id })
            .from(actions)
            .orderBy(desc(actions.id))
            .limit(1);
          const lastActionId = latestAction ? latestAction.id : null;
          return { result: [...mealsResult, ...mealPlansResult], lastActionId };
        },
      );
      return context.json({ result, lastActionId }, 201);
    } catch (error) {
      return context.json({ message: 'Failed to select state' }, 500);
    }
  })
  .post(
    '/meal-plans',
    zValidator('json', insertMealPlanSchema),
    async (context) => {
      const mealPlan = context.req.valid('json');
      try {
        const results = await database.transaction(async (transaction) => {
          await transaction.insert(mealPlans).values(mealPlan);
          return await transaction
            .insert(actions)
            .values({
              type: 'create',
              data: mealPlan,
            })
            .returning();
        });
        return context.json({ results }, 201);
      } catch (error) {
        return context.json({ message: 'Failed to insert meal plan' }, 500);
      }
    },
  )
  .post('/meals', zValidator('json', insertMealSchema), async (context) => {
    const meal = context.req.valid('json');

    try {
      const results = await database.transaction(async (transaction) => {
        await transaction.insert(meals).values(meal);
        return await transaction
          .insert(actions)
          .values({
            type: 'create',
            data: meal,
          })
          .returning();
      });
      return context.json({ results }, 201);
    } catch (error) {
      return context.json({ message: 'Failed to insert meal' }, 500);
    }
  })
  .notFound((context) => {
    return context.json({ message: 'Not Found' }, 404);
  });

export type Application = typeof router;

console.log(`Server is running on port ${PORT}`);

serve({
  fetch: application.fetch,
  port: PORT,
});
