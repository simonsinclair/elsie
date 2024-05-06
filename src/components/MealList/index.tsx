import { observer } from 'mobx-react-lite';

import { Meal as MealModel } from '../../models/meal';
import { MealType } from '../../types';
import { Meal } from '../Meal';

interface Properties {
  meals: MealModel[];
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
        .map((meal) => (
          <Meal key={meal.id} meal={meal} />
        ))}
    </ul>
  );
});
