import { useEffect, useRef } from 'react';
import { action } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import type { Meal as MealModel } from '../../models/meal';
import clsx from 'clsx';
import invariant from 'tiny-invariant';

interface Properties {
  meal: MealModel;
}

export const Meal = observer(({ meal }: Properties) => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const state = useLocalObservable(() => ({
    isDragging: false,
  }));

  useEffect(() => {
    const element = elementRef.current;
    invariant(element);

    return draggable({
      element,
      getInitialData: () => ({ id: meal.id }),
      onDragStart: action(() => {
        state.isDragging = true;
      }),
      onDrop: action(() => {
        state.isDragging = false;
      }),
    });
  }, [meal.id, state]);

  return (
    <div
      ref={elementRef}
      key={meal.id}
      className={clsx(
        'space-y-1 rounded bg-white p-2 shadow hover:text-blue-500',
        {
          'cursor-grab': !state.isDragging,
          'cursor-copy': state.isDragging,
        },
      )}
    >
      <div className="text-sm font-medium">{meal.name}</div>
      <ul className="flex gap-1 text-xs tracking-wide">
        <li className="rounded bg-slate-100 px-1.5 py-0.5 font-mono">
          {meal.energy}kcal
        </li>
        <li className="rounded bg-slate-100 px-1.5 py-0.5 font-mono">
          {meal.protein}g
        </li>
        <li className="rounded bg-slate-100 px-1.5 py-0.5">{meal.type}</li>
      </ul>
    </div>
  );
});
