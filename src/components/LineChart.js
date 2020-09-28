import React, { useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  chart: {
    width: '100%',
    height: '1000px',
  },
});

const normalizeData = array => {
  if (!array || !array.length) return;
  const final = array.map(val => {
    const data = val.measurements.map(elem => ({
      x: new Date(elem.at).toLocaleTimeString(),
      y: elem.value,
    }));
    return {
      id: val.metric,
      color: 'hsl(320, 70%, 50%)',
      data,
    };
  });
  return final;
};

const LineChart = props => {
  const [chartData, setChartData] = React.useState([]);
  const { data } = props;
  const classes = useStyles();

  useEffect(() => {
    const pre = normalizeData(data);
    setChartData(pre);
  }, [data]);

  if (!chartData) {
    return <p>No data provided</p>;
  }

  return (
    <Paper className={classes.chart}>
      <ResponsiveLine
        data={chartData}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        pointSize={0}
        useMesh={true}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            effects: [
              {
                on: 'hover',
                style: {
                  itemBackground: 'rgba(0, 0, 0, .03)',
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </Paper>
  );
};

export default LineChart;
