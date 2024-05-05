import { createContext } from 'react';

import { MealPlanStore } from '../stores/meal-plan';

export const MealPlanStoreContext = createContext<MealPlanStore | null>(null);
