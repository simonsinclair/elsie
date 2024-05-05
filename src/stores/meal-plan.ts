import { action, makeObservable, observable } from 'mobx';

import { MealPlan } from '../models/meal-plan';

export class MealPlanStore {
  readonly mealPlans: MealPlan[] = [];

  constructor() {
    makeObservable(this, {
      mealPlans: observable,
      append: action,
      remove: action,
    });
  }

  /** Append a new MealPlan to the store */
  append() {
    const mealPlan = new MealPlan(this);
    this.mealPlans.push(mealPlan);
  }

  /** Remove a MealPlan from the store */
  remove(mealPlan: MealPlan) {
    this.mealPlans.splice(this.mealPlans.indexOf(mealPlan), 1);
  }
}
