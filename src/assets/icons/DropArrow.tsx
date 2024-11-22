import * as React from "react";
const DropArrowIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <mask
      id="a"
      width={20}
      height={20}
      x={0}
      y={0}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "alpha",
      }}
    >
      <path fill="#D9D9D9" d="M20 20H0V0h20z" />
    </mask>
    <g mask="url(#a)">
      <path
        fill="#202D74"
        d="m10 11 3.833-3.833L15 8.333l-5 5-5-5 1.167-1.166L10 11Z"
      />
      <path
        fill="#000"
        fillOpacity={0.2}
        d="m10 11 3.833-3.833L15 8.333l-5 5-5-5 1.167-1.166L10 11Z"
      />
    </g>
  </svg>
);
export default DropArrowIcon;
