import { render } from 'preact'
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks'
import { css, html, flatten } from './utils'
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
      url: pr.html_url,
      number: pr.number,
      reviewers: reviewers.length > 0 ? reviewers : ['none'],
      state: pr.state,
      title: pr.title,
      user: pr.user.login,
      repo: pr.base.repo.full_name,
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

  const groups = useMemo(
    () =>
      GROUPS.reduce(
        ([groups, prs], [days, emoji]) => {
          const groupPrs = []
          const remainingPrs = []
          prs.forEach(pr => {
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
    [prs, reviewers, repos]
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
      options=${[
        ['Repos', repos],
        ['Reviewers', reviewers],
      ].map(
        ([name, options]) =>
          html`
            <${OptionsGroup}
              name=${name}
              onOptionChange=${changeOption}
              options=${options}
            />
          `
      )}
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
