import { action, makeObservable, observable } from 'mobx';

import { Meal } from '../models/meal';

export class MealStore {
  readonly meals: Meal[] = [];

  constructor() {
    makeObservable(this, {
      meals: observable,
      append: action,
      remove: action,
    });
  }

  /** Append a new Meal to the store */
  append(meal: Omit<Meal, 'id'>) {
    this.meals.push(new Meal({ store: this, meal }));
  }

  /** Remove a Meal from the store */
  remove(meal: Meal) {
    this.meals.splice(this.meals.indexOf(meal), 1);
  }
}
