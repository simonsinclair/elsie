import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { EllipsisHorizontalIcon } from '@heroicons/react/16/solid';

import { MealPlan } from '../../models/meal-plan';
import {
  Dropdown,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
} from '../dropdown';

interface Properties {
  mealPlans: MealPlan[];
  onRemoveClick: (mealPlan: MealPlan) => void;
}

export const MealPlanList = observer(
  ({ mealPlans, onRemoveClick }: Properties) => {
    return mealPlans.map((mealPlan) => (
      <article
        key={mealPlan.id}
        className="p-2 w-64 shadow rounded bg-white flex-none"
      >
        <header className="flex items-center justify-between gap-4">
          <input
            className="border border-transparent hover:border-slate-300 p-1 rounded w-full font-bold"
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
      </article>
    ));
  },
);
