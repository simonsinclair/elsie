import { makeObservable, observable } from 'mobx';

export class Meal {
  readonly id: string;
  name: string;
  type: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK' | 'DRINK';
  energy: number;
  protein: number;

  constructor({ name, type, energy, protein }: Omit<Meal, 'id'>) {
    makeObservable(this, {
      id: false,
      name: observable,
      type: observable,
      energy: observable,
      protein: observable,
    });
    this.id = crypto.randomUUID();
    this.name = name;
    this.type = type;
    this.energy = energy;
    this.protein = protein;
  }
}
