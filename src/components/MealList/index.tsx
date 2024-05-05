import { observer } from 'mobx-react-lite';
import { useMealStore } from '../../hooks/useMealStore';

export const MealList = observer(() => {
  const { meals } = useMealStore();

  return (
    <ul className="divide-y">
      {meals.map((meal) => {
        return (
          <li key={meal.id} className="py-2 hover:bg-slate-100 space-y-1">
            <div className="text-sm">{meal.name}</div>
            <ul className="text-xs flex gap-2">
              <li className="font-mono bg-slate-100 rounded py-0.5 px-1.5">
                {meal.energy} kcal
              </li>
              <li className="font-mono bg-slate-100 rounded py-0.5 px-1.5">
                {meal.protein} g
              </li>
              <li className=" bg-slate-100 rounded py-0.5 px-1.5">
                {meal.type}
              </li>
            </ul>
          </li>
        );
      })}
    </ul>
  );
});
