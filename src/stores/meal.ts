import { action, makeObservable, observable } from 'mobx';

import { Meal } from '../models/meal';

export class MealStore {
  meals: Meal[] = [];

  constructor() {
    makeObservable(this, {
      meals: observable,
      append: action,
    });
  }

  append(meal: Omit<Meal, 'id'>) {
    this.meals.push(new Meal(meal));
  }
}
