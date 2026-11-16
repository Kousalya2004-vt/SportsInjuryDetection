import React from "react";
import "./RiskCharts.css";

/**
 * Bar Chart Component matching Images 2 & 3:
 * Displays Risk Factor Breakdown (Biomechanics, History, Asymmetry, Training Load, Fatigue)
 */
export function RiskFactorBarChart({ data }) {
  const factors = data || [
    { label: "Biomechanics", val: 70, color: "#2563eb" },
    { label: "History", val: 25, color: "#2563eb" },
    { label: "Asymmetry", val: 100, color: "#2563eb" },
    { label: "Training Load", val: 0, color: "#2563eb" },
    { label: "Fatigue", val: 40, color: "#2563eb" },
  ];

  return (
    <div className="barChartWidgetCard glass-card">
      <h3 className="chartWidgetTitle">Risk Factor Breakdown</h3>
      <div className="barChartSvgContainer">
        <div className="yAxisTicks">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>

        <div className="barGridArea">
          <div className="gridLine" style={{ top: "0%" }}></div>
          <div className="gridLine" style={{ top: "25%" }}></div>
          <div className="gridLine" style={{ top: "50%" }}></div>
          <div className="gridLine" style={{ top: "75%" }}></div>
          <div className="gridLine" style={{ top: "100%" }}></div>

          <div className="barsFlexRow">
            {factors.map((item, idx) => (
              <div key={idx} className="barColItem">
                <div className="barTrack">
                  <div
                    className="barFill"
                    style={{
                      height: `${Math.min(100, Math.max(0, item.val))}%`,
                      background: item.val > 80 ? "#ef4444" : item.val > 50 ? "#3b82f6" : "#10b981",
                    }}
                  >
                    <span className="barHoverVal">{item.val}%</span>
                  </div>
                </div>
                <span className="barLabelText">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * SVG Pie Chart Component matching Image 1:
 * Displays pie slices, percentages, legend labels and hover states
 */
export function PieChartWidget({ title, subtitle, items }) {
  const defaultItems = items || [
    { name: "Athlete", percent: 46.7, color: "#2563eb" },
    { name: "Administrator", percent: 20.0, color: "#f97316" },
    { name: "Coach", percent: 13.3, color: "#16a34a" },
    { name: "Physiotherapist", percent: 13.3, color: "#dc2626" },
    { name: "Sports Scientist", percent: 6.7, color: "#eab308" },
  ];

  let cumulativeAngle = 0;

  const slices = defaultItems.map((item) => {
    const angle = (item.percent / 100) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle = endAngle;

    const x1 = 100 + 80 * Math.cos((Math.PI * (startAngle - 90)) / 180);
    const y1 = 100 + 80 * Math.sin((Math.PI * (startAngle - 90)) / 180);
    const x2 = 100 + 80 * Math.cos((Math.PI * (endAngle - 90)) / 180);
    const y2 = 100 + 80 * Math.sin((Math.PI * (endAngle - 90)) / 180);

    const largeArc = angle > 180 ? 1 : 0;
    const pathData = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;

    const midAngle = startAngle + angle / 2;
    const tx = 100 + 50 * Math.cos((Math.PI * (midAngle - 90)) / 180);
    const ty = 100 + 50 * Math.sin((Math.PI * (midAngle - 90)) / 180);

    return {
      ...item,
      pathData,
      tx,
      ty,
    };
  });

  return (
    <div className="pieChartWidgetCard glass-card">
      <div className="pieHeader">
        <h4>{title}</h4>
        {subtitle && <p className="pieSub">{subtitle}</p>}
      </div>

      <div className="pieVisualContainer">
        <svg viewBox="0 0 200 200" className="pieSvg">
          {slices.map((slice, i) => (
            <path key={i} d={slice.pathData} fill={slice.color} className="pieSlice">
              <title>{`${slice.name}: ${slice.percent}%`}</title>
            </path>
          ))}
          {slices.map((slice, i) => (
            slice.percent > 8 && (
              <text
                key={i}
                x={slice.tx}
                y={slice.ty}
                fill="#ffffff"
                fontSize="11"
                fontWeight="800"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {Math.round(slice.percent)}%
              </text>
            )
          ))}
        </svg>
      </div>

      <div className="pieLegendGrid">
        {defaultItems.map((item, idx) => (
          <div key={idx} className="legendItem">
            <span className="legendDot" style={{ background: item.color }}></span>
            <span className="legendText">
              {item.name} <strong>({item.percent}%)</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
