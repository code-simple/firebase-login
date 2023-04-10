import * as React from "react";

function Bill(props) {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" {...props}>
      <circle cx={22} cy={22} r={22} fill="#2240AC" />
      <path
        d="M22.5 16.031c-2.9 0-5.25 2.449-5.25 5.469 0 3.02 2.35 5.469 5.25 5.469 2.898 0 5.25-2.448 5.25-5.469 0-3.02-2.35-5.469-5.25-5.469zm2.188 8.203c0 .216-.196.391-.438.391h-3.5c-.242 0-.438-.175-.438-.39v-.782c0-.216.196-.39.438-.39h.875v-2.707l-.026.015a.466.466 0 01-.328.058.467.467 0 01-.158-.059.416.416 0 01-.12-.108l-.486-.65a.348.348 0 010-.434.417.417 0 01.122-.107l.838-.5c.216-.128.469-.196.728-.196h.742c.242 0 .438.175.438.39v4.297h.875c.242 0 .438.175.438.391v.781zM38.25 12.125H6.75c-.966 0-1.75.7-1.75 1.563v15.624c0 .863.784 1.563 1.75 1.563h31.5c.966 0 1.75-.7 1.75-1.563V13.688c0-.862-.784-1.562-1.75-1.562zm-.875 13.281c-1.933 0-3.5 1.4-3.5 3.125h-22.75c0-1.726-1.567-3.125-3.5-3.125v-7.812c1.933 0 3.5-1.4 3.5-3.125h22.75c0 1.726 1.567 3.125 3.5 3.125v7.812z"
        fill="#fff"
      />
    </svg>
  );
}

export default Bill;
