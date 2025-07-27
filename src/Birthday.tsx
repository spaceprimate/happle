import React from "react";

const candleColors = ["#FFD700", "#FF69B4", "#87CEEB"];

const Candle = ({ x }: { x: number }) => (
  <g>
    {/* Candle body */}
    <rect x={x} y={40} width={8} height={30} rx={2} fill="#fff" stroke="#ccc" />
    {/* Flame (animated) */}
    <ellipse
      cx={x + 4}
      cy={38}
      rx={4}
      ry={7}
      fill="#FFD700"
    >
      <animate
        attributeName="ry"
        values="7;10;7"
        dur="1s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="cx"
        values={`${x + 4};${x + 6};${x + 4}`}
        dur="1s"
        repeatCount="indefinite"
      />
    </ellipse>
    {/* Candle color accent */}
    <rect x={x + 2} y={40} width={4} height={30} rx={1} fill={candleColors[x / 20 % candleColors.length]} opacity={0.7} />
  </g>
);

const BirthdayCakeSVG = () => (
  <svg width={200} height={180} viewBox="0 0 200 180">
    <ellipse cx='100' cy='124' rx='60' ry='30' fill="#fffddd"  />
      <ellipse cx='100' cy='120' rx='60' ry='30' fill="#f04dd7"  />
    <rect x='40' y='70' width='120' height='65' rx='20' fill="#f04dd7"  strokeWidth='3' />
    <ellipse cx='100' cy='80' rx='60' ry='20' fill="#fffddd"  />
    
    {/* Cake base */}
    {/* <ellipse cx={100} cy={120} rx={60} ry={30} fill="#f9c9a3" stroke="#d2a679" strokeWidth={3} /> */}
    {/* Cake body */}
    {/* <rect x={40} y={70} width={120} height={50} rx={20} fill="#ffe5b4" stroke="#d2a679" strokeWidth={3} /> */}
    {/* Cake top */}
    {/* <ellipse cx={100} cy={70} rx={60} ry={20} fill="#fff" stroke="#d2a679" strokeWidth={2} /> */}
    {/* Candles */}
    <Candle x={70} />
    <Candle x={100} />
    <Candle x={130} />
  </svg>
);

const Birthday: React.FC = () => (
  <div style={{ textAlign: "center", marginTop: 40 }}>
    <BirthdayCakeSVG />
    <h2 style={{ color: "#FF69B4", marginTop: 20, fontFamily: "cursive", letterSpacing: 2 }}>
      HAPPY BIRTHDAY ROBIN!
    </h2>
  </div>
);

export default Birthday;