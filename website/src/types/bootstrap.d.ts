// Bootstrap 5 não publica tipos próprios; declaramos só o que usamos (offcanvas).
declare module 'bootstrap' {
  export class Offcanvas {
    static getInstance(element: Element): Offcanvas | null
    static getOrCreateInstance(element: Element): Offcanvas
    show(): void
    hide(): void
    toggle(): void
  }
}
