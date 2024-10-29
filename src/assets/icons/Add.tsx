import * as React from "react";
const AddIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      d="M5.167 6.834h-5V5.167h5v-5h1.667v5h5v1.667h-5v5H5.167v-5Z"
    />
  </svg>
);
export default AddIcon;
