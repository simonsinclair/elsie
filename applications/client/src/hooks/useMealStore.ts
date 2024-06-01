import { useContext } from 'react';

import { MealStoreContext } from '../contexts/MealStore';

export const useMealStore = () => {
  const context = useContext(MealStoreContext);
  if (context === null) {
    throw new TypeError(
      'useMealStore must be used within a MealStore provider',
    );
  }
  return context;
};
