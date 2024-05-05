import { action, makeObservable, observable } from 'mobx';

import { MealPlan } from '../models/meal-plan';

export class MealPlanStore {
  mealPlans: MealPlan[] = [];

  constructor() {
    makeObservable(this, {
      mealPlans: observable,
      append: action,
      remove: action,
    });
  }

  append() {
    this.mealPlans.push(new MealPlan(this));
  }

  remove(mealPlan: MealPlan) {
    this.mealPlans.splice(this.mealPlans.indexOf(mealPlan), 1);
  }
}
