import { action, makeObservable, observable } from 'mobx';

import { MealPlanStore } from '../stores/meal-plan';
import { Meal } from './meal';

export class MealPlan {
  readonly id: string;
  readonly store: MealPlanStore;
  readonly meals: Meal[];
  name: string;

  constructor(store: MealPlanStore) {
    makeObservable(this, {
      id: false,
      store: false,
      name: observable,
      meals: observable,
      delete: action,
      append: action,
      remove: action,
    });
    this.id = crypto.randomUUID();
    this.name = 'Untitled';
    this.store = store;
    this.meals = [];
  }

  /** Delete the MealPlan from the store */
  delete(mealPlan: MealPlan) {
    this.store.remove(mealPlan);
  }

  /** Append a Meal to the MealPlan */
  append(meal: Meal) {
    this.meals.push(meal);
  }

  /** Remove a Meal from the MealPlan */
  remove(meal: Meal) {
    this.meals.splice(this.meals.indexOf(meal), 1);
  }
}
