import { css, html } from './utils'

export function PrCard({ pr }) {
  return html`
    <a
      href="${pr.url}"
      target="_blank"
      class=${css`
        overflow: hidden;
        display: block;
        margin: 0 1rem 1rem;
        border-radius: 0.25rem;
        outline: 0;
        background: #111;
        :active,
        :focus {
          background: #1a1a1a;
        }
      `}
    >
      <div
        class=${css`
          display: flex;
          justify-content: space-between;
          padding: 1rem 1rem 0;
          font-size: 0.8rem;
          white-space: nowrap;
        `}
      >
        <div>
          ${pr.repo.replace('aragon/', '')}
        </div>
        <div>
          #${pr.number}
        </div>
      </div>
      <div
        class=${css`
          padding: 1rem;
        `}
      >
        ${pr.title}
      </div>
      <div
        class=${css`
          padding: 0 1rem 1rem;
          font-size: 0.8rem;
        `}
      >
        reviewers: ${pr.reviewers.length > 0 ? pr.reviewers.join(', ') : 'none'}
      </div>
    </a>
  `
}
