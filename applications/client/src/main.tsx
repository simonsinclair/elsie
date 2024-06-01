import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';

import App from './App.tsx';
import { MealStoreContext } from './contexts/MealStore.ts';
import { MealPlanStoreContext } from './contexts/MealPlanStore.ts';
import { MealStore } from './stores/meal.ts';
import { MealPlanStore } from './stores/meal-plan.ts';

const container = document.getElementById('root');
if (container === null) throw new TypeError('React container not found');

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <MealStoreContext.Provider value={new MealStore()}>
      <MealPlanStoreContext.Provider value={new MealPlanStore()}>
        <App />
      </MealPlanStoreContext.Provider>
    </MealStoreContext.Provider>
  </React.StrictMode>,
);
