import { FormEvent } from 'react';
import { action } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { PlusIcon } from '@heroicons/react/16/solid';
import { z } from 'zod';

import { useMealPlanStore } from './hooks/useMealPlanStore';
import { useMealStore } from './hooks/useMealStore';
import { MealPlanList } from './components/MealPlanList';
import { MealPlan } from './models/meal-plan';
import {
  MealList,
  DialogBody,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogDescription,
  FieldGroup,
  Field,
  Label,
  Input,
  Select,
  Button,
} from './components';
import { MealType } from './types';

const App = observer(() => {
  const dialog = useLocalObservable<{ type: 'NEW_MEAL' | null }>(() => ({
    type: null,
  }));
  const meal = useLocalObservable<{
    type: '' | MealType;
  }>(() => ({
    type: '',
  }));
  const mealPlanStore = useMealPlanStore();
  const mealStore = useMealStore();

  const handleMealPlanRemoveClick = (mealPlan: MealPlan) => {
    mealPlanStore.remove(mealPlan);
  };

  const handleMealSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const formData = new FormData(formElement);

    try {
      const { name, type, energy, protein } = z
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
        .parse(Object.fromEntries(formData));
      mealStore.append({
        name: name.trim() === '' ? 'Untitled' : name,
        type,
        energy,
        protein,
      });
      dialog.type = null;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-100">
      <header className="absolute flex h-12 w-full items-center border-b bg-slate-50 px-2">
        <strong className="rounded bg-black px-1.5 py-0.5 text-xs uppercase tracking-wider text-white antialiased">
          Elsie
        </strong>
      </header>
      <div className="flex h-full pt-12">
        <div className="flex w-64 flex-col border-r bg-slate-50">
          <header className="flex items-center gap-4 border-b p-2">
            <h2 className="font-bold">Meals</h2>
            <Select
              aria-label="Meal type"
              name="type"
              value={meal.type}
              onChange={action((event) => {
                const mealType = event.target.value as '' | MealType;
                meal.type = mealType;
              })}
            >
              <option value="" />
              <option value="BREAKFAST">Breakfast</option>
              <option value="LUNCH">Lunch</option>
              <option value="DINNER">Dinner</option>
              <option value="SNACK">Snack</option>
              <option value="DRINK">Drink</option>
            </Select>
          </header>
          <div className="flex-1 overflow-y-scroll">
            <MealList meals={mealStore.meals} type={meal.type} />
          </div>
          <footer className="flex-none border-t p-2">
            <Button
              plain
              onClick={action(() => {
                dialog.type = 'NEW_MEAL';
              })}
            >
              <PlusIcon /> New meal
            </Button>
            <Dialog
              open={dialog.type === 'NEW_MEAL'}
              onClose={action(() => {
                dialog.type = null;
              })}
            >
              <DialogTitle>New meal</DialogTitle>
              <DialogDescription>
                A meal is a combination of food items that are consumed
                together.
              </DialogDescription>
              <DialogBody>
                <form
                  id="new-meal"
                  className="space-y-8"
                  onSubmit={action(handleMealSubmit)}
                >
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
                  type="button"
                  plain
                  onClick={action(() => {
                    dialog.type = null;
                  })}
                >
                  Cancel
                </Button>
                <Button form="new-meal" type="submit">
                  Create
                </Button>
              </DialogActions>
            </Dialog>
          </footer>
        </div>
        <div className="flex flex-1 gap-2 overflow-x-scroll p-2">
          <MealPlanList
            mealPlans={mealPlanStore.mealPlans}
            onRemoveClick={handleMealPlanRemoveClick}
          />
          <button
            onClick={() => {
              mealPlanStore.append();
            }}
            className="w-64 flex-none rounded border border-slate-200 hover:border-slate-300"
          />
        </div>
      </div>
    </div>
  );
});

export default App;
