import { useContext } from 'react';

import { MealPlanStoreContext } from '../context/MealPlanStore';

export const useMealPlanStore = () => {
  const context = useContext(MealPlanStoreContext);
  if (context === null) {
    throw new TypeError(
      'useMealPlanStore must be used within a MealPlanStore provider',
    );
  }
  return context;
};
