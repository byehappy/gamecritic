import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IGame } from "../../interfaces/games";
import { FilterType } from "../../interfaces/filters";

type CreateTemplateType = {
  filters: { [key: string]: FilterType };
  pickGame: IGame[];
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
    toggleGameSelection: (state, action: PayloadAction<IGame>) => {
      const gameIndex = state.pickGame.findIndex(
        (game) => game.id === action.payload.id
      );
      if (gameIndex > -1) {
        state.pickGame.splice(gameIndex, 1);
      } else {
        state.pickGame.push(action.payload);
      }
    },
  },
});

const { reducer, actions } = CreateTemplateSlice;

export const { setFilter, toggleGameSelection } = actions;
export default reducer;
