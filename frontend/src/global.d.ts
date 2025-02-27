// global.d.ts
  declare module '*.scss' {
    const content: { [className: string]: string };
    export default content;
  }

  declare module '*.png' {
    const value: string;
    export default value;
  }
  
  declare module '*.gif' {
    const value: string;
    export default value;
  }
  
  declare module '*.jpg' {
    const value: string;
    export default value;
  }
  
  declare module '*.jpeg' {
    const value: string;
    export default value;
  }
  
  declare module '*.svg' {
    const value: string;
    export default value;
  }

  declare module '*.js' {
    const value: any;
    export default value;
  }