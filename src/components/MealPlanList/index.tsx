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
          <h2 className="font-bold">{mealPlan.title}</h2>
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
