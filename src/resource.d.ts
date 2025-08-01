declare module '*.html' {
  import { IContainer, PartialBindableDefinition } from 'aurelia';
  export const name: string;
  export const template: string;
  export default template;
  export const dependencies: string[];
  export const containerless: boolean | undefined;
  export const bindables: Record<string, PartialBindableDefinition>;
  export const shadowOptions: { mode: 'open' | 'closed' } | undefined;
  export function register(container: IContainer): void;
}

// Vite-specific declarations for ?inline imports that return CSS as strings
declare module '*.css?inline' {
  const content: string;
  export default content;
}
declare module '*.scss?inline' {
  const content: string;
  export default content;
}

declare module '*.css';
declare module '*.scss';
