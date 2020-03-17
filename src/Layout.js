import { css, html } from './utils'

export function Layout({ title, options, columns }) {
  return html`
    <main
      class=${css`
        display: flex;
        flex-direction: column;
        height: 100vh;
      `}
    >
      <div
        class=${css`
          flex-grow: 0;
          flex-shrink: 0;
          padding: 1rem;
        `}
      >
        <h1
          class=${css`
            font-size: 1.3rem;
            font-weight: 400;
          `}
        >
          ${title}
        </h1>

        ${options}
      </div>

      <div
        class=${css`
          flex-grow: 1;
          flex-shrink: 1;
          display: flex;
          width: 100%;
          overflow: hidden;
          justify-items: stretch;
        `}
      >
        ${columns}
      </div>
    </main>
  `
}
