import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InitTierData, TierData } from "../../interfaces/tierData";
import { IGameDis } from "../../interfaces/games";

const initialState: InitTierData = {
  rows: [],
  games: [],
  filters: {},
};

export const tierDataSlice = createSlice({
  name: "tierData",
  initialState,
  reducers: {
    setRows: (state, action: PayloadAction<TierData[]>) => {
      state.rows = action.payload;
    },
    setTrayGames: (state, action: PayloadAction<IGameDis[]>) => {
      state.games = action.payload;
    },
    setDefault: (state, action) => {
      state.games = initialState.games;
      state.rows = action.payload
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
  },
});

export const { setRows, setTrayGames, setDefault, setFilters } =
  tierDataSlice.actions;
export default tierDataSlice.reducer;
