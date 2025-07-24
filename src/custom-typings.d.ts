// This tells TypeScript that whenever it sees an import for a file ending in .png,
// it should treat it as a module that has a default export of type 'string'.
declare module '*.png' {
  const value: string;
  export default value;
}
