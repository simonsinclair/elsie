import { action, makeObservable, observable } from 'mobx';
import { MealPlanStore } from '../stores/meal-plan';

export class MealPlan {
  readonly id: string;
  readonly store: MealPlanStore;
  title: string;

  constructor(store: MealPlanStore) {
    makeObservable(this, {
      id: false,
      store: false,
      title: observable,
      delete: action,
    });
    this.id = crypto.randomUUID();
    this.title = 'Untitled';
    this.store = store;
  }

  delete(mealPlan: MealPlan) {
    this.store.remove(mealPlan);
  }
}
