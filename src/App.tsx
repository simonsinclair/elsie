import { FormEvent, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { z } from 'zod';

import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
  Field,
  FieldGroup,
  Input,
  Label,
  Select,
} from './components';
import { useMealStore } from './hooks/useMealStore';
import { useMealPlanStore } from './hooks/useMealPlanStore';
import { MealPlanList } from './components/MealPlanList';
import { MealPlan } from './models/meal-plan';

const App = observer(() => {
  const [dialog, setDialog] = useState<'NEW_MEAL' | 'NEW_MEAL_PLAN' | null>(
    null,
  );
  const mealStore = useMealStore();
  const mealPlanStore = useMealPlanStore();

  const handleMealSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      const meal = z
        .object({
          name: z.string(),
          type: z.union([
            z.literal('BREAKFAST'),
            z.literal('LUNCH'),
            z.literal('DINNER'),
            z.literal('SNACK'),
            z.literal('DRINK'),
          ]),
          energy: z.coerce.number().nonnegative(),
          protein: z.coerce.number().nonnegative(),
        })
        .parse(Object.fromEntries(form));
      mealStore.append(meal);
      setDialog(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMealPlanRemoveClick = (mealPlan: MealPlan) => {
    mealPlanStore.remove(mealPlan);
  };

  return (
    <div className="fixed inset-0 bg-slate-100">
      <header className="absolute h-12 flex items-center px-2 border-b w-full bg-slate-50">
        <strong className="py-0.5 px-1.5 bg-black antialiased uppercase text-xs text-white rounded tracking-wider">
          Elsie
        </strong>
      </header>
      <div className="flex gap-2 h-full pt-14 px-2 py-2 overflow-x-scroll">
        <MealPlanList
          mealPlans={mealPlanStore.mealPlans}
          onRemoveClick={handleMealPlanRemoveClick}
        />
        <button
          onClick={() => {
            mealPlanStore.append();
          }}
          className="rounded w-64 border flex-none border-slate-200 hover:border-slate-300"
        />
      </div>
      <Dialog
        open={dialog === 'NEW_MEAL'}
        onClose={() => {
          setDialog(null);
        }}
      >
        <DialogTitle>New meal</DialogTitle>
        <DialogDescription>
          A meal is a combination of food items that are consumed together.
        </DialogDescription>
        <DialogBody>
          <form id="new-meal" onSubmit={handleMealSubmit}>
            <FieldGroup>
              <Field>
                <Label>Name</Label>
                <Input
                  name="name"
                  type="text"
                  minLength={1}
                  placeholder="Perfect porridge"
                />
              </Field>
              <Field>
                <Label>Type</Label>
                <Select name="type">
                  <option value="BREAKFAST">Breakfast</option>
                  <option value="LUNCH">Lunch</option>
                  <option value="DINNER">Dinner</option>
                  <option value="SNACK">Snack</option>
                  <option value="DRINK">Drink</option>
                </Select>
              </Field>
              <div className="grid grid-cols-2 gap-8">
                <Field>
                  <Label>Energy (kcal)</Label>
                  <Input
                    name="energy"
                    type="number"
                    min={0}
                    placeholder="175"
                  />
                </Field>
                <Field>
                  <Label>Protein (g)</Label>
                  <Input
                    name="protein"
                    type="number"
                    min={0}
                    placeholder="10"
                  />
                </Field>
              </div>
            </FieldGroup>
          </form>
        </DialogBody>
        <DialogActions>
          <Button
            plain
            onClick={() => {
              setDialog(null);
            }}
          >
            Cancel
          </Button>
          <Button type="submit" form="new-meal">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

export default App;
