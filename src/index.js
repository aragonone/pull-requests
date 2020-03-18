import { render } from 'preact'
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks'
import { css, html, flatten } from './utils'
import { Checkbox } from './Checkbox'
import { Layout } from './Layout'
import { PrGroup } from './PrGroup'
import { OptionsGroup } from './OptionsGroup'

const ONE_DAY = 24 * 60 * 60 * 1000

const BASE_GITHUB_API_URL = 'https://api.github.com'
const LOCAL_GITHUB_TOKEN_KEY = 'GITHUB_TOKEN'
const GITHUB_TOKEN = localStorage.getItem(LOCAL_GITHUB_TOKEN_KEY) || process.env.GITHUB_TOKEN
const GITHUB_API_HEADERS = {
  // See https://developer.github.com/v3/#current-version
  accept: 'application/vnd.github.v3+json',
  authorization: GITHUB_TOKEN ? `token ${GITHUB_TOKEN}` : null
}

const REPOS = process.env.TRACKED_REPOS.split(',').map(repo => repo.trim())

const GROUPS = [
  [30, '😭'],
  [10, '😩'],
  [5, '😕'],
  [3, '🧐'],
  [0, '💆‍♀️'],
]

async function getRepoPrs(repo) {
  const res = await fetch(`${BASE_GITHUB_API_URL}/repos/${repo}/pulls`, {
    headers: GITHUB_API_HEADERS,
  })
  const prs = await res.json()
  return prs.map(pr => {
    const reviewers = pr.requested_reviewers.map(user => user.login)
    return {
      assignees: pr.assignees,
      created: new Date(pr.created_at),
      draft: pr.draft,
      number: pr.number,
      repo: pr.base.repo.full_name,
      reviewers: reviewers.length > 0 ? reviewers : ['none'],
      state: pr.state,
      title: pr.title,
      url: pr.html_url,
      user: pr.user.login,
    }
  })
}

function useFetchPrs() {
  const [loading, setLoading] = useState(true)
  const [prs, setPrs] = useState([])

  useEffect(() => {
    let cancelled = false

    const updateRepos = async () => {
      setLoading(true)
      const prsByRepo = await Promise.all(REPOS.map(getRepoPrs))
      if (!cancelled) {
        setLoading(false)
        setPrs(flatten(prsByRepo))
      }
    }

    updateRepos()

    return () => {
      cancelled = true
    }
  }, [])

  return [prs, loading]
}

function App() {
  const [repos, setRepos] = useState(REPOS.map(repo => [repo, true]))
  const [reviewers, setReviewers] = useState([])
  const [ignoredInDraft, setIgnoredInDraft] = useState(true)
  const [prs, loading] = useFetchPrs()

  const changeOption = useCallback((groupName, optionName, check) => {
    let setFn = null

    if (groupName === 'Repos') {
      setFn = setRepos
    }

    if (groupName === 'Reviewers') {
      setFn = setReviewers
    }

    if (setFn) {
      setFn(options =>
        options.map(option =>
          option[0] === optionName ? [optionName, check] : option
        )
      )
    }
  }, [])
  const changeIgnored = useCallback(() =>
    setIgnoredInDraft(ignored => {
      console.log('ignored', ignored)
      return !ignored
    }),
    []
  )

  const options = useMemo(
    () => {
      const reviewerOptions = html`
        <${OptionsGroup}
          name="Reviewers"
          onOptionChange=${changeOption}
          options=${reviewers}
        />
      `
      // Get user / organization grouping of repos
      const repoByOrgs = [...repos.reduce((orgMap, [name, checked]) => {
        const [orgName, repoName] = name.split('/')
        const repoSet = orgMap.get(orgName) || []
        repoSet.push([repoName, checked, name])
        orgMap.set(orgName, repoSet)

        return orgMap
      }, new Map())]
      const repoOptions = html`
        <div>
          <div
            class=${css`
              display: flex;
              align-items: center;
              font-size: 0.8rem;
              margin-bottom: 1rem;
            `}
          >
            <div
              class=${css`
                width: 5rem;
                margin-right: 1rem;
              `}
            >Repos:</div>
            <${Checkbox}
              checked=${ignoredInDraft}
              name="Ignore draft PRs"
              onClick=${changeIgnored}
            </label>
          </div>
          <div
            class=${css`
              padding-left: 20px;
            `}
          >
            ${repoByOrgs.map(([orgName, orgRepos]) => html`
                <${OptionsGroup}
                  name=${orgName}
                  settingName="Repos"
                  onOptionChange=${changeOption}
                  options=${orgRepos}
                />
              `
            )}
          </div>
          </div>
      `

      return [repoOptions, reviewerOptions]
    }, [ignoredInDraft, repos, reviewers]
  )

  const groups = useMemo(
    () =>
      GROUPS.reduce(
        ([groups, prs], [days, emoji]) => {
          const groupPrs = []
          const remainingPrs = []
          prs.forEach(pr => {
            // Filter by draft status
            if (ignoredInDraft && pr.draft) {
              return
            }

            // Filter by reviewer
            if (
              pr.reviewers.length > 0 &&
              !pr.reviewers.some(reviewer => {
                const reviewerOption = reviewers.find(
                  ([_reviewer]) => _reviewer === reviewer
                )
                return reviewerOption && reviewerOption[1]
              })
            ) {
              return
            }

            // Filter by repo
            const repoOption = repos.find(([repo]) => repo === pr.repo)
            if (!repoOption[1]) {
              return
            }

            // Group by date
            if (pr.created < new Date(Date.now() - days * ONE_DAY)) {
              groupPrs.push(pr)
            } else {
              remainingPrs.push(pr)
            }
          })

          return [[...groups, [days, emoji, groupPrs]], remainingPrs]
        },
        [[], [...prs].reverse()]
      )[0],
    [ignoredInDraft, prs, reviewers, repos]
  )

  useEffect(() => {
    setReviewers(
      [...new Set(flatten(prs.map(pr => pr.reviewers)))]
        .map(name => [name, true])
        .sort((a, b) => {
          if (a[0] === 'none') return -1
          if (b[0] === 'none') return 1
          return 0
        })
    )
  }, [prs])

  return html`
    <${Layout}
      title="Aragon Pull Requests"
      hasToken=${Boolean(GITHUB_TOKEN)}
      options=${options}
      columns=${groups.map(
        ([days, emoji, prs]) =>
          html`
            <${PrGroup}
              days=${days}
              emoji=${emoji}
              loading=${loading}
              prs=${prs}
            />
          `
      )}
    />
  `
}

render(
  html`
    <${App} />
  `,
  document.body
)
