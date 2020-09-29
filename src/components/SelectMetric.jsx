import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Provider, createClient, useQuery } from "urql";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import PropTypes from "prop-types";
import { actions } from "../Features/Metrics/reducer.ts";

const client = createClient({
  url: "https://react.eogresources.com/graphql",
});

const query = `
  query {
    getMetrics
  }
`;

const useStyles = makeStyles({
  metricWrapper: {
    display: "flex",
    flexFlow: "row nowrap",
  },
});

const SelectMetric = props => {
  const { onSelect } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [result] = useQuery({
    query,
  });
  const [checks, setChecks] = useState([]);
  const { fetching, data, error } = result;

  useEffect(() => {
    if (error) {
      dispatch(actions.apiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMetrics } = data;
    const generatedChecks = getMetrics.map(val => ({
      name: val,
      checked: false,
    }));
    setChecks(generatedChecks);
    dispatch(actions.dataRecevied(getMetrics));
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;

  const handleChange = event => {
    const eventName = event.target.name;
    const updatedChecks = checks.map(metric => {
      if (eventName === metric.name) {
        return { name: eventName, checked: event.target.checked };
      }
      return metric;
    });
    onSelect(updatedChecks);
    setChecks(updatedChecks);
  };

  return (
    <FormGroup className={classes.metricWrapper}>
      {checks.map(metric => (
        <FormControlLabel
          key={metric.name}
          control={<Checkbox checked={metric.checked} onChange={handleChange} name={metric.name} color="primary" />}
          label={metric.name}
        />
      ))}
    </FormGroup>
  );
};

export default props => {
  const { onSelect } = props;
  return (
    <Provider value={client}>
      <SelectMetric onSelect={onSelect} />
    </Provider>
  );
};

SelectMetric.propTypes = {
  onSelect: PropTypes.func.isRequired,
};
