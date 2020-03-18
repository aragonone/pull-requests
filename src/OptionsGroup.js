import { css, html } from './utils'

export function OptionsGroup({
  name: groupName,
  settingName,
  options = [],
  onOptionChange = () => null,
}) {
  return html`
    <div
      class=${css`
        display: flex;
        align-items: center;
        font-size: 0.8rem;
        margin-bottom: 1rem;
        height: 2rem;
      `}
    >
      <div
        class=${css`
          flex-shrink: 0;
          margin-right: 1rem;
          width: 5rem;
          flex-shrink: 0;
        `}
      >
        ${groupName}:
      </div>

      <div
        class=${css`
          flex-grow: 1;
          flex-shrink: 1;
          display: flex;
          align-items: center;
          overflow-x: auto;
          height: 100%;
        `}
      >
        ${options.length > 0
          ? options.map(
              ([name, checked, optionName]) => html`
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
                    onClick=${() =>
                      onOptionChange(settingName || groupName, optionName || name, !checked)
                    }
                  />
                  <span
                    class=${css`
                      margin-left: 0.25rem;
                    `}
                    >${name.replace('aragon/', '')}</span
                  >
                </label>
              `
            )
          : 'Loading…'}
      </div>
    </div>
  `
}
