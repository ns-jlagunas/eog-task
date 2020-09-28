import { createSlice, PayloadAction } from 'redux-starter-kit';

export type Measurement = {
  at: number;
  value: number;
  metric: string;
  unit: string;
};

export type MultipleMeasurements = {
  metric: string;
  measurements: Measurement[];
};

export type ApiErrorAction = {
  error: string;
};

export type BigPayload = {
  getMultipleMeasurements: MultipleMeasurements[];
  newMetrics: Measurement;
};

const initialState = {
  multipleMeasurements: [] as MultipleMeasurements[],
};

const slice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    dataRecevied: (state, action: PayloadAction<MultipleMeasurements[]>) => {
      state.multipleMeasurements = action.payload;
    },
    apiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
    pushNewMetricValue: (state, action: PayloadAction<Measurement>) => {
      if (action.payload && state.multipleMeasurements && state.multipleMeasurements.length) {
        let diarrea = state.multipleMeasurements.filter(obj => {
          if (obj.metric === action.payload.metric) {
            return true;
          }
          return false;
        })[0];
        if (diarrea) {
          diarrea.measurements.shift();
          diarrea.measurements.push(action.payload);
          const updatedState = state.multipleMeasurements.map(measurement => {
            if (measurement.metric === action.payload.metric) {
              return diarrea;
            }
            return measurement;
          });
          state.multipleMeasurements = [...updatedState];
        }
      }
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
