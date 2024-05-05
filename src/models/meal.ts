import { action, makeObservable, observable } from 'mobx';

import { MealStore } from '../stores/meal';

interface Properties {
  store: MealStore;
  meal: Pick<Meal, 'name' | 'type' | 'energy' | 'protein'>;
}

export class Meal {
  readonly store: MealStore;
  readonly id: string;
  name: string;
  type: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK' | 'DRINK';
  energy: number;
  protein: number;

  constructor({ store, meal }: Properties) {
    makeObservable(this, {
      store: false,
      id: false,
      name: observable,
      type: observable,
      energy: observable,
      protein: observable,
      delete: action,
    });
    this.store = store;
    this.id = crypto.randomUUID();
    this.name = meal.name;
    this.type = meal.type;
    this.energy = meal.energy;
    this.protein = meal.protein;
  }

  /** Delete the Meal from the store */
  delete() {
    this.store.remove(this);
  }
}
