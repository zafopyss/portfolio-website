export type Brand = { path: string; hex: string };

// A mark simple-icons does not ship: Azure DevOps was in it up to 11.14.0 and
// dropped after. Trademark of its owner, used to label the stack.
export const azureDevOps: Brand = {
  hex: '0078D7',
  path: 'M0 8.877L2.247 5.91l8.405-3.416V.022l7.37 5.393L2.966 8.338v8.225L0 15.707zm24-4.45v14.651l-5.753 4.9-9.303-3.057v3.056l-5.978-7.416 15.057 1.798V5.415z',
};
