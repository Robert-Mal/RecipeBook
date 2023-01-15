import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import Meal from "../../shared/types/meal-planning.type";
import EatingPlanDay from "../../shared/types/eating-plan-day.type";
import { toast } from "react-toastify";

type Props = {
  eatingPlan: EatingPlanDay[];
  setEatingPlan: (eatingPlanDay: EatingPlanDay[]) => void;
};

const Board = ({ eatingPlan, setEatingPlan }: Props) => {
  const [days, setDays] = useState<EatingPlanDay[]>([]);

  useEffect(() => {
    if (eatingPlan) {
      setDays(eatingPlan);
    }
  }, [eatingPlan]);

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    )
      return;

    const sourceColumnIndex = days.findIndex(
      (day) => day.id === source.droppableId
    );
    const destinationColumnIndex = days.findIndex(
      (day) => day.id === destination.droppableId
    );

    const newState = [...days];
    const removed = newState[sourceColumnIndex].meals.splice(
      source.index,
      1
    )[0];
    newState[destinationColumnIndex].meals.splice(
      destination.index,
      0,
      removed
    );
    for (const day of newState) {
      const dayNumber = day.id.slice(-1);
      for (const meal of day.meals) {
        meal.day = +dayNumber;
      }
    }
    setEatingPlan(newState);
  };

  const addDay = () => {
    const newState = [...days];
    const currentDays = days.length + 1;
    newState.push({
      id: `day-${currentDays}`,
      title: `Day ${currentDays}`,
      meals: [],
    });
    setEatingPlan(newState);
  };

  const removeMeal = (index: string) => {
    const newState = [...days];
    for (const day of newState) {
      const foundIndex = day.meals.findIndex((meal) => meal.id === index);
      if (foundIndex >= 0) {
        day.meals.splice(foundIndex, 1);
        setEatingPlan(newState);
      }
    }
  };

  const removeDay = (index: string) => {
    const newState = [...days];
    if (newState[newState.length - 1].id !== index) {
      return;
    }
    const foundIndex = newState.findIndex((day) => day.id === index);
    if (foundIndex >= 0 && !newState[foundIndex].meals.length) {
      newState.splice(foundIndex, 1);
      setEatingPlan(newState);
    } else {
      toast.info("Only last and not empty day can be removed");
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex w-full overflow-x-auto">
        <div className="flex gap-x-5  min-h-fit">
          {days.map((day) => (
            <Droppable key={day.id} droppableId={day.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-col w-96 shadow-md"
                >
                  <p className="relative flex items-center px-2 text-xl text-center py-2">
                    <span className="flex-grow">{day.title}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      onClick={() => removeDay(day.id)}
                      className="w-5 h-5 cursor-pointer absolute right-1 mt-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </p>
                  {day.meals.map((meal: Meal, index: number) => (
                    <Draggable
                      key={meal.id}
                      draggableId={meal.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className="flex flex-col items-center bg-gray-100"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <div className="flex justify-between items-center w-64 px-2 py-2 shadow bg-white text-center my-2">
                            <div className="flex truncate pr-2">
                              <p className="truncate mr-1">{meal.name}</p>
                              {meal.time ? <p>• {meal.time}</p> : null}
                            </div>
                            <div className="flex gap-x-1.5">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                onClick={() => removeMeal(meal.id)}
                                className="w-5 h-5 cursor-pointer"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                              </svg>
                              <div {...provided.dragHandleProps}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  className="w-5 h-5"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 9h16.5m-16.5 6.75h16.5"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
          <div
            className="flex items-center justify-center shadow-md w-96"
            onClick={addDay}
          >
            <p className="text-gray-400 text-xl">+ Add new day</p>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Board;
