import { action } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { EllipsisHorizontalIcon } from '@heroicons/react/16/solid';
import invariant from 'tiny-invariant';
import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import { MealPlan as MealPlanModel } from '../../models/meal-plan';
import { MealList } from '../MealList';
import { Dropdown, DropdownButton, DropdownMenu, DropdownItem } from '../index';

interface Properties {
  mealPlan: MealPlanModel;
  onRemoveClick: (mealPlan: MealPlanModel) => void;
  onMealDrop: (id: MealPlanModel['id']) => void;
}

export const MealPlan = observer(
  ({ mealPlan, onRemoveClick, onMealDrop }: Properties) => {
    const elementRef = useRef<HTMLUListElement | null>(null);
    const state = useLocalObservable(() => ({
      isDraggedOver: false,
    }));

    useEffect(() => {
      const element = elementRef.current;
      invariant(element);

      return dropTargetForElements({
        element,
        onDragEnter: action(() => {
          state.isDraggedOver = true;
        }),
        onDragLeave: action(() => {
          state.isDraggedOver = false;
        }),
        onDrop: action(({ source }) => {
          if (typeof source.data.id === 'string') onMealDrop(source.data.id);
          state.isDraggedOver = false;
        }),
      });
    }, [onMealDrop, state]);

    return (
      <article
        ref={elementRef}
        key={mealPlan.id}
        className={clsx('flex w-64 flex-none flex-col rounded  shadow', {
          'bg-white': !state.isDraggedOver,
          'bg-blue-50': state.isDraggedOver,
        })}
      >
        <header className="flex flex-none items-center justify-between gap-4 border-b p-2">
          <input
            className="w-full rounded border border-transparent bg-transparent p-1 font-bold hover:border-slate-300"
            type="text"
            name="name"
            id="name"
            defaultValue={mealPlan.name}
            onFocus={(event) => {
              event.target.select();
            }}
            onKeyUp={(event) => {
              if (event.key === 'Enter') {
                event.currentTarget.blur();
              }
            }}
            onBlur={action((event) => {
              if (event.target.value.trim() === '') {
                event.target.value = 'Untitled';
                mealPlan.name = 'Untitled';
              } else {
                mealPlan.name = event.target.value;
              }
            })}
          />

          <Dropdown>
            <DropdownButton plain aria-label="More options">
              <EllipsisHorizontalIcon />
            </DropdownButton>
            <DropdownMenu anchor="bottom start">
              <DropdownItem
                onClick={() => {
                  onRemoveClick(mealPlan);
                }}
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </header>
        <div className="flex flex-1 flex-col gap-2 overflow-y-scroll px-2">
          <MealList meals={mealPlan.meals} />
        </div>
      </article>
    );
  },
);
