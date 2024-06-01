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

const websocket = new WebSocket(import.meta.env.VITE_WEB_SOCKET_URL);

let timeout: ReturnType<typeof setTimeout>;

const heartbeat = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    websocket.close();
  }, 30_000 + 10_000);
};

websocket.onopen = () => {
  heartbeat();
  console.log('websocket: opened');
};

websocket.onmessage = ({ data }) => {
  if (data === 'ping') {
    websocket.send('pong');
    heartbeat();
  }
};

websocket.onclose = () => {
  console.log('websocket: closed');
};

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <MealStoreContext.Provider value={mealStore}>
      <MealPlanStoreContext.Provider value={new MealPlanStore()}>
        <App />
      </MealPlanStoreContext.Provider>
    </MealStoreContext.Provider>
  </React.StrictMode>,
);
