export type Brand = { path: string; hex: string };

// Two marks simple-icons does not ship. Azure DevOps was in simple-icons up to
// 11.14.0 and dropped after; Loki has never been in it, so its official
// multi-colour mark is flattened here into one path on the same 24x24 grid.
// Both are trademarks of their owners, used to label the stack.
export const azureDevOps: Brand = {
  hex: '0078D7',
  path: 'M0 8.877L2.247 5.91l8.405-3.416V.022l7.37 5.393L2.966 8.338v8.225L0 15.707zm24-4.45v14.651l-5.753 4.9-9.303-3.057v3.056l-5.978-7.416 15.057 1.798V5.415z',
};

export const loki: Brand = {
  hex: 'F15B2B',
  path: 'M6.543 21.792 4.63 22.088 4.926 24 6.838 23.707ZM13.448 19.624 21.891 18.323 21.596 16.411 13.155 17.709ZM10.159 18.171 10.453 20.083 12.367 19.79 12.072 17.875ZM9.834 23.245 9.538 21.333 7.626 21.626 7.919 23.54ZM4.464 21.005 6.376 20.711 6.083 18.797 4.171 19.092ZM22.058 19.406 13.614 20.704 13.91 22.619 22.351 21.319ZM10.621 21.166 10.915 23.079 12.827 22.785 12.533 20.871ZM7.46 20.545 9.372 20.249 9.079 18.337 7.164 18.63ZM4.005 18.012 4.811 17.887 2.457 2.58 1.649 2.704ZM5.113 17.841 5.921 17.716 3.395 1.282 2.587 1.406ZM7.012 17.547 7.818 17.423 5.139 0 4.33 0.125ZM8.12 17.376 8.928 17.252 6.485 1.367 5.677 1.492ZM9.993 17.09 10.801 16.965 8.63 2.855 7.822 2.977ZM11.104 16.919 11.912 16.794 9.658 2.143 8.85 2.266Z',
};
