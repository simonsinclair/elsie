import { IObservableArray, action, makeObservable, observable } from 'mobx';

import { Meal } from '../models/meal';

/** @todo Remove duplicate type */
interface Transaction {
  id: string;
  type: 'CREATE';
  name: string;
  energy: number;
  protein: number;
}

interface Properties {
  transactionQueue: IObservableArray<Transaction>;
}

export class MealStore {
  readonly meals: Meal[] = [];
  readonly transactionQueue;

  constructor({ transactionQueue }: Properties) {
    makeObservable(this, {
      meals: observable,
      append: action,
      remove: action,
      transactionQueue: false,
    });
    this.transactionQueue = transactionQueue;
  }

  /** Append a new Meal to the store */
  append(meal: Pick<Meal, 'name' | 'type' | 'energy' | 'protein'>) {
    const newMeal = new Meal({ store: this, meal });
    this.meals.push(newMeal);
    this.transactionQueue.push({
      type: 'CREATE',
      id: newMeal.id,
      name: newMeal.name,
      energy: newMeal.energy,
      protein: newMeal.protein,
    });
  }

  /** Remove a Meal from the store */
  remove(meal: Meal) {
    this.meals.splice(this.meals.indexOf(meal), 1);
  }
}
