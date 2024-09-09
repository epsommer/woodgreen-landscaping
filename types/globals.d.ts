// globals.d.ts
declare module 'eslint-define-config' {
  export function defineFlatConfig(config: any): any; // Adjust `any` type to the specific types if available
}

declare module '@babel/eslint-parser' {
  const babelParser: any;
  export default babelParser;
}

declare module 'eslint-plugin-react' {
  const react: any;
  export default react;
}

declare module 'eslint-plugin-react-hooks' {
  const reactHooks: any;
  export default reactHooks;
}

declare module '@typescript-eslint/eslint-plugin' {
  const typescript: any;
  export default typescript;
}
