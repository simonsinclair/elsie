import { z } from 'zod';

/** The type of a Meal, e.g. Lunch */
export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK' | 'DRINK';

/** WebSocket server messages */
export const serverMessageSchema = z
  .object({
    type: z.union([
      z.literal('initialise'),
      z.literal('pong'),
      z.literal('actions'),
    ]),
  })
  .passthrough();
export type WebSocketMessage = z.infer<typeof serverMessageSchema>;
