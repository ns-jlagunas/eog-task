import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Provider, createClient, useQuery, defaultExchanges, subscriptionExchange, useSubscription } from "urql";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { actions } from "../Features/Chart/reducer.ts";
import LineChart from "./LineChart";

const subscriptionClient = new SubscriptionClient("wss://react.eogresources.com/graphql", { reconnect: true });

const client = createClient({
  url: "https://react.eogresources.com/graphql",
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription(operation) {
        return subscriptionClient.request(operation);
      },
    }),
  ],
});

const newMeasurementQuery = `
  subscription {
    newMeasurement {
      metric
      at
      value
      unit
    }
  }
`;

const query = `
  query ($input: [MeasurementQuery]) {
    getMultipleMeasurements(input: $input) {
      metric
      measurements {
        at
        value
        metric
        unit
      }
    }
  }
`;

const getChart = state => {
  const { multipleMeasurements } = state.chart;
  return {
    multipleMeasurements,
  };
};

export default props => {
  const { metrics } = props;
  return (
    <Provider value={client}>
      <MetricChart metrics={metrics} />
    </Provider>
  );
};

function renderPropsAreNew(prevMovie, nextMovie) {
  const prevValue = prevMovie.render.at;
  const nextValue = nextMovie.render.at;
  return prevValue === nextValue;
}

const MemoLineChart = React.memo(LineChart, renderPropsAreNew);

const handleSubscription = (messages = [], response) => {
  return [response.newMeasurement, ...messages];
};

const MetricChart = props => {
  const { metrics } = props;
  const dispatch = useDispatch();
  const { multipleMeasurements } = useSelector(getChart);

  const [result] = useQuery({
    query,
    variables: {
      input: metrics,
    },
  });
  const [subResult] = useSubscription(
    {
      query: newMeasurementQuery,
    },
    handleSubscription,
  );

  const { data, error } = result;

  useEffect(() => {
    if (error) {
      dispatch(actions.apiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMultipleMeasurements } = data;
    dispatch(actions.dataRecevied(getMultipleMeasurements));
  }, [dispatch, data, error]);

  useEffect(() => {
    if (!subResult.data) return;
    dispatch(actions.pushNewMetricValue(subResult.data[0]));
  }, [dispatch, subResult]);

  if (!subResult.data) return null;

  return <MemoLineChart data={multipleMeasurements} render={subResult.data[0]} metrics={metrics} />;
};

MetricChart.propTypes = {
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      after: PropTypes.number,
      metricName: PropTypes.string,
    }),
  ).isRequired,
};
