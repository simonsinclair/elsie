import { createContext } from 'react';

import { MealStore } from '../stores/meal';

export const MealStoreContext = createContext<MealStore | null>(null);
