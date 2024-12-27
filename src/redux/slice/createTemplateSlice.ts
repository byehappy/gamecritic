import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FilterType } from "../../interfaces/filters";

type CreateTemplateType = {
  filters: { [key: string]: FilterType };
  pickGame: number[];
};

const initialState: CreateTemplateType = {
  filters: {
    genres: { visible: true, value: null },
    platforms: { visible: true, value: null },
    dates: { visible: true, value: null },
    tags: { visible: true, value: null },
  },
  pickGame: [],
};

const CreateTemplateSlice = createSlice({
  name: "createTemplate",
  initialState,
  reducers: {
    setFilter: (
      state,
      action: PayloadAction<{
        filter: string;
        type: { visible?: boolean; value?: string | null };
      }>
    ) => {
      const { filter, type } = action.payload;
      state.filters[filter] = {
        visible: type.visible ?? state.filters[filter].visible,
        value: type.value ?? state.filters[filter].value,
      };
    },
    toggleGameSelection: (state, action: PayloadAction<number>) => {
      const gameIndex = state.pickGame.findIndex(
        (game) => game === action.payload
      );
      if (gameIndex > -1) {
        state.pickGame.splice(gameIndex, 1);
      } else {
        state.pickGame.push(action.payload);
      }
    },
    selectUniqGame: (state, action) => {
      const gameIndex = state.pickGame.findIndex(
        (game) => game === action.payload
      );
      if (gameIndex === -1) {
        state.pickGame.push(action.payload);
      }
    },
    clearCreateTier: () => {
      return initialState;
    },
  },
});

const { reducer, actions } = CreateTemplateSlice;

export const { setFilter, toggleGameSelection, clearCreateTier,selectUniqGame } = actions;
export default reducer;
