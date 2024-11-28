import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InitTierData, TierData } from "../../interfaces/tierData";
import { IGameDis } from "../../interfaces/games";

const initialState: InitTierData = {
  rows: [
    { id: "0", tier: "Идеально", games: [], color: "#1677FF" },
    { id: "1", tier: "Супер", games: [], color: "#1677FF" },
    { id: "2", tier: "Отлично", games: [], color: "#1677FF" },
    { id: "3", tier: "Неинтересно", games: [], color: "#1677FF" },
    { id: "4", tier: "Ужасно", games: [], color: "#1677FF" },
  ],
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
    setDefault: (state) => {
      state.games = initialState.games;
      state.rows = initialState.rows;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
  },
});

export const { setRows, setTrayGames, setDefault,setFilters } = tierDataSlice.actions;
export default tierDataSlice.reducer;
