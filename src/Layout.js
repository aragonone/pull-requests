import { css, html } from './utils'

export function Layout({ title, hasToken, options, columns }) {
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
        <div
          class=${css`
            display: flex;
            align-items: center;
            padding: 10px 0;
            min-height: 55px;
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
          ${hasToken && (
            html`
              <button
                class=${css`
                  height: 100%;
                  padding: 10px 10px;
                  margin-left: auto;
                  border-radius: 0.25rem;
                  outline: 0;
                  background: #111;
                  :active,
                  :focus {
                    background: #1a1a1a;
                  }
                `}
              >
                Set Github token
              </button>
            `
          )}
        </div>
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
