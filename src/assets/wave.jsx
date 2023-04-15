import * as React from "react";

function Wave(props) {
  return (
    <svg
      width="1536"
      height="357"
      // width="1440"
      // height="357"
      viewBox="0 0 1440 357"
      fill="none"
      {...props}
    >
      <path
        d="M-846.749 111.112C-943.196 55.232-1163.45 307.984-1210.5 356.5l2782.86-115.088 178.45-163.186-87.75 66.208c-51.55-21.972-220.99-73.778-486.4-105.226-331.762-39.31-172.72 91.405-332.775 117.75-160.055 26.345-246.847-67.92-448.852-105.8-202.006-37.88-569.38 49.674-691.159 123.23-121.78 73.556-110.58-87.074-275.562-159.66-164.982-72.585-154.503 166.235-275.061 96.384z"
        fill="#46C3EA"
        fillOpacity={0.8}
      />
    </svg>
  );
}

export default Wave;
