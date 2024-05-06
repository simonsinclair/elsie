import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { EllipsisHorizontalIcon } from '@heroicons/react/16/solid';

import { MealPlan } from '../../models/meal-plan';
import { MealList } from '../MealList';
import { Dropdown, DropdownButton, DropdownMenu, DropdownItem } from '../index';

interface Properties {
  mealPlans: MealPlan[];
  onRemoveClick: (mealPlan: MealPlan) => void;
}

export const MealPlanList = observer(
  ({ mealPlans, onRemoveClick }: Properties) => {
    return mealPlans.map((mealPlan) => (
      <article
        key={mealPlan.id}
        className="flex w-64 flex-none flex-col rounded bg-white shadow"
      >
        <header className="flex flex-none items-center justify-between gap-4 border-b p-2">
          <input
            className="w-full rounded border border-transparent p-1 font-bold hover:border-slate-300"
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
    ));
  },
);
