import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const useStyles = makeStyles({
  chart: {
    width: "100%",
  },
  noGraph: {
    width: "100%",
    padding: "30px",
  },
});

const lineColors = {
  flareTemp: "#ca2f5e",
  casingPressure: "#16868f",
  injValveOpen: "#2a3549",
  oilTemp: "#f7bd00",
  tubingPressure: "#4e8c4e",
  waterTemp: "#f7ab5d",
};

const normalizeData = array => {
  if (!array || !array.length) return false;
  const final = array[0].measurements.map(elem => ({ at: elem.at }));
  array.forEach(val => {
    val.measurements.forEach((elem, index) => {
      if (elem.at === final[index].at) {
        final[index][val.metric] = elem.value;
      }
    });
  });
  return final;
};

const formatDateToTime = time => {
  return new Date(time).toLocaleTimeString();
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active) {
    return (
      <Paper className="custom-tooltip">
        <p className="label">{formatDateToTime(label)}</p>
        {payload.map(elem => (
          <p style={{ color: elem.stroke }} key={elem.name}>
            {elem.name}: {elem.value}
          </p>
        ))}
      </Paper>
    );
  }

  return null;
};

const LineChartComponent = props => {
  const { data, metrics } = props;
  const [chartData, setChartData] = React.useState([]);
  const [pureMetrics, setPureMetrics] = React.useState([]);
  const classes = useStyles();

  useEffect(() => {
    const finalMetrics = metrics.map(val => val.metricName);
    setPureMetrics(finalMetrics);
  }, [metrics]);

  useEffect(() => {
    const pre = normalizeData(data);
    setChartData(pre);
  }, [data]);

  if (!chartData) {
    return <Paper className={classes.noGraph}>Please select an option</Paper>;
  }
  const chartHeight = (window && window.innerHeight - 100) || 600;

  return (
    <Paper className={classes.chart}>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <LineChart data={chartData}>
          <YAxis />
          <XAxis dataKey="at" interval="preserveStartEnd" minTickGap={20} tickFormatter={formatDateToTime} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {pureMetrics.map(metric => (
            <Line
              type="monotone"
              isAnimationActive={false}
              key={metric}
              dataKey={metric}
              dot={false}
              stroke={lineColors[metric]}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

CustomTooltip.defaultProps = {
  active: undefined,
  payload: undefined,
  label: undefined,
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string,
      dataKey: PropTypes.string,
      fill: PropTypes.string,
      formatter: PropTypes.string,
      name: PropTypes.string,
      stroke: PropTypes.string,
      strokeWidth: PropTypes.number,
      type: PropTypes.string,
      unit: PropTypes.number,
      value: PropTypes.number,
      payload: PropTypes.shape({
        at: PropTypes.number,
      }),
    }),
  ),
  label: PropTypes.number,
};

LineChartComponent.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      metric: PropTypes.string,
      measurements: PropTypes.arrayOf(
        PropTypes.shape({
          at: PropTypes.number,
          metric: PropTypes.string,
          unit: PropTypes.string,
          value: PropTypes.number,
        }),
      ),
    }),
  ).isRequired,
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      after: PropTypes.number,
      metricName: PropTypes.string,
    }),
  ).isRequired,
};

export default LineChartComponent;
