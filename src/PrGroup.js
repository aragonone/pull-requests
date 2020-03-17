import { css, html } from './utils'
import { PrCard } from './PrCard'

export function PrGroup({ loading, days, emoji, prs }) {
  return html`
    <div
      class=${css`
        display: grid;
        grid-template-rows: auto 1fr;
        width: 100%;
      `}
    >
      <h2
        class=${css`
          margin: 0 0 0 1rem;
          font-size: 1.1rem;
          font-weight: 400;
        `}
      >
        ${days === 0 ? 'recent' : `${days}+ days`} (${prs.length}) ${emoji}
      </h2>
      <ul
        class=${css`
          overflow-y: scroll;
          padding: 0;
          list-style: none;
        `}
      >
        ${prs.length > 0
          ? prs.map(
              pr => html`
                <li
                  class=${css`
                    :last-child a {
                      margin-bottom: 0;
                    }
                  `}
                >
                  <${PrCard} pr=${pr} />
                </li>
              `
            )
          : html`
              <li
                class=${css`
                  display: flex;
                  height: 100%;
                  align-items: center;
                  justify-content: center;
                  padding: 0 1rem;
                `}
              >
                ${loading ? 'Loading…' : '🥳'}
              </li>
            `}
      </ul>
    </div>
  `
}
