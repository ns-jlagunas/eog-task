import { createSlice, PayloadAction } from 'redux-starter-kit';

export type MetricList = {
  metrics: string[];
};

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  metrics: [] as string[],
};

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    dataRecevied: (state, action: PayloadAction<MetricList>) => {
      const { metrics } = action.payload;
      state.metrics = metrics;
    },
    apiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
