import { css, html } from './utils'

export function Checkbox({
  checked,
  name,
  onClick,
}) {
  return html`
    <label
      class=${css`
        display: flex;
        align-items: center;
        padding: 0.3rem 0.5rem;
        background: #111;
        color: #ddd;
        border-radius: 0.25rem;
        cursor: pointer;
        margin-right: 1rem;
        white-space: nowrap;
        :active {
          background: #1a1a1a;
        }
      `}
    >
      <input
        type="checkbox"
        checked=${checked}
        onClick=${onClick}
      />
      <span
        class=${css`
          margin-left: 0.25rem;
        `}
      >
        ${name}
      </span>
    </label>
  `
}
