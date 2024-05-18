import { observer } from 'mobx-react-lite';

import { MealPlan as MealPlanModel } from '../../models/meal-plan';
import { MealPlan } from '../MealPlan';
import { useMealPlanStore } from '../../hooks/useMealPlanStore';

export const MealPlanList = observer(() => {
  const mealPlanStore = useMealPlanStore();

  const handleRemoveClick = (mealPlan: MealPlanModel) => {
    mealPlanStore.remove(mealPlan);
  };

  return mealPlanStore.mealPlans.map((mealPlan) => (
    <MealPlan
      key={mealPlan.id}
      mealPlan={mealPlan}
      onRemoveClick={handleRemoveClick}
    />
  ));
});
