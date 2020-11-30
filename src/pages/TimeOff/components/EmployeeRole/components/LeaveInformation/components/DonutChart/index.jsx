import React from 'react';
import styles from './index.less';

const DonutChart = ({
  value = 0,
  percent = 0,
  valuelabel = 'Remaining',
  size = 116,
  strokewidth = 4,
}) => {
  const halfsize = size * 0.5;
  const radius = halfsize - strokewidth * 0.5;
  const circumference = 2 * Math.PI * radius;
  const strokeval = (percent * circumference) / 100;
  const dashval = `${strokeval} ${circumference}`;

  const trackstyle = { strokeWidth: strokewidth };
  const indicatorstyle = { strokeWidth: strokewidth, strokeDasharray: dashval };
  const rotateval = `rotate(-90 ${halfsize},${halfsize})`;

  return (
    <svg width={size} height={size} className={styles.DonutChart}>
      <circle
        r={radius}
        cx={halfsize}
        cy={halfsize}
        transform={rotateval}
        style={trackstyle}
        className={styles.donutcharttrack}
      />
      <circle
        r={radius}
        cx={halfsize}
        cy={halfsize}
        transform={rotateval}
        style={indicatorstyle}
        className={styles.donutchartindicator}
      />
      <text
        className={styles.donutcharttext}
        x={halfsize}
        y={halfsize}
        style={{ textAnchor: 'middle' }}
      >
        <tspan className={styles.donutcharttextval}>{value}</tspan>
        <tspan className={styles.donutcharttextlabel} x={halfsize} y={halfsize + 20}>
          {valuelabel}
        </tspan>
      </text>
    </svg>
  );
};

export default DonutChart;
