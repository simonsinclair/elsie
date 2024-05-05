import { action, makeObservable, observable } from 'mobx';
import { MealPlanStore } from '../stores/meal-plan';

export class MealPlan {
  readonly id: string;
  readonly store: MealPlanStore;
  name: string;

  constructor(store: MealPlanStore) {
    makeObservable(this, {
      id: false,
      store: false,
      name: observable,
      delete: action,
    });
    this.id = crypto.randomUUID();
    this.name = 'Untitled';
    this.store = store;
  }

  delete(mealPlan: MealPlan) {
    this.store.remove(mealPlan);
  }
}
