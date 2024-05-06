import { observer } from 'mobx-react-lite';

import { Meal as MealModel } from '../../models/meal';
import { Meal } from '../Meal';

interface Properties {
  meals: MealModel[];
}

export const MealList = observer(({ meals }: Properties) => {
  return (
    <ul className="space-y-2 p-2">
      {meals.map((meal) => (
        <Meal key={meal.id} meal={meal} />
      ))}
    </ul>
  );
});
