import React from "react";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import createStore from "./store/index.ts";
import "react-toastify/dist/ReactToastify.css";
import Wrapper from "./components/Wrapper.tsx";
import Chart from "./components/Chart";
import SelectMetric from "./components/SelectMetric";

const store = createStore();
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "rgb(39,49,66)",
    },
    secondary: {
      main: "rgb(197,208,222)",
    },
    background: {
      default: "rgb(226,231,238)",
    },
  },
});

const App = () => {
  const [metrics, setMetrics] = React.useState([]);

  const selectMetric = metricsArray => {
    let preArray = metricsArray.filter(metric => metric.checked);
    const minsAgo30 = new Date().getTime() - 1000 * 60 * 30;
    preArray = preArray.map(metric => {
      return {
        after: minsAgo30,
        metricName: metric.name,
      };
    });
    setMetrics(preArray);
  };
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <Wrapper>
          <SelectMetric onSelect={selectMetric} />
          <Chart metrics={metrics} />
          <ToastContainer />
        </Wrapper>
      </Provider>
    </MuiThemeProvider>
  );
};

export default App;
