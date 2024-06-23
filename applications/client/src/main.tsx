import React from 'react';
import ReactDOM from 'react-dom/client';
import { observable } from 'mobx';
import { queueProcessor } from 'mobx-utils';

import './index.css';

import App from './App.tsx';
import { MealStoreContext } from './contexts/MealStore.ts';
import { MealPlanStoreContext } from './contexts/MealPlanStore.ts';
import { MealStore } from './stores/meal.ts';
import { MealPlanStore } from './stores/meal-plan.ts';
import { client } from './services/api.ts';
import { WebSocketClient } from './services/websocket.ts';

interface Transaction {
  id: string;
  type: 'CREATE';
  name: string;
  energy: number;
  protein: number;
}

const container = document.getElementById('root');
if (container === null) throw new TypeError('React container not found');

const transactionQueue = observable<Transaction>([]);
const mealStore = new MealStore({ transactionQueue });

queueProcessor(
  transactionQueue,
  ({ id, name, energy, protein }) => {
    client.meals
      .$post({
        json: {
          id,
          name,
          energy,
          protein,
        },
      })
      .then((response) => {
        if (response.ok) {
          console.log('response_ok', response.status);
        } else {
          console.error('response_not_ok', response.status);
        }
      })
      .catch((error: unknown) => {
        console.error('queue_processor', error);
      });
  },
  1000,
);

const websocket = new WebSocketClient((data) => {
  console.log('received', data);
});

setInterval(() => {
  if (websocket.state === 'READY') {
    websocket.send({ type: 'ping' });
  }
}, 30_000);

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <MealStoreContext.Provider value={mealStore}>
      <MealPlanStoreContext.Provider value={new MealPlanStore()}>
        <App />
      </MealPlanStoreContext.Provider>
    </MealStoreContext.Provider>
  </React.StrictMode>,
);
