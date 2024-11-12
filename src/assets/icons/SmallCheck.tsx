import * as React from "react";
const SmallCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={17}
    height={17}
    fill="none"
    {...props}
  >
    <mask
      id="a"
      width={17}
      height={17}
      x={0}
      y={0}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "alpha",
      }}
    >
      <path fill="#D9D9D9" d="M0 0h17v17H0z" />
    </mask>
    <g mask="url(#a)">
      <path
        fill="#1C1B1F"
        d="M7.083 11.617 4.25 8.783l.992-.991 1.841 1.841 4.675-4.675.992.992-5.667 5.667Z"
      />
    </g>
  </svg>
);
export default SmallCheckIcon;
