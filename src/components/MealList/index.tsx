import { observer } from 'mobx-react-lite';

import { Meal } from '../../models/meal';
import { MealType } from '../../types';

interface Properties {
  meals: Meal[];
  type?: '' | MealType;
}

export const MealList = observer(({ meals, type = '' }: Properties) => {
  return (
    <ul className="space-y-2 p-2">
      {meals
        .filter((meal) => {
          if (type === '') {
            return true;
          } else {
            return meal.type === type;
          }
        })
        .map((meal) => {
          return (
            <li
              key={meal.id}
              className="space-y-1 rounded bg-white p-2 shadow hover:shadow-blue-600/25"
            >
              <div className="text-sm font-medium">{meal.name}</div>
              <ul className="flex gap-1 text-xs tracking-wide">
                <li className="rounded bg-slate-100 px-1.5 py-0.5 font-mono">
                  {meal.energy}kcal
                </li>
                <li className="rounded bg-slate-100 px-1.5 py-0.5 font-mono">
                  {meal.protein}g
                </li>
                <li className="rounded bg-slate-100 px-1.5 py-0.5">
                  {meal.type}
                </li>
              </ul>
            </li>
          );
        })}
    </ul>
  );
});
