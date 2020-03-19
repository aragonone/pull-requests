import { css, html } from './utils'
import { Checkbox } from './Checkbox'

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
                <${Checkbox}
                  checked=${checked}
                  name=${name}
                  onClick=${() =>
                    onOptionChange(settingName || groupName, optionName || name, !checked)
                  }
                />
              `
            )
          : 'Loading…'}
      </div>
    </div>
  `
}
