# Pull Request Dashboard

Dashboard for keeping track of Github pull requests across repos, users, and organizations!

## Configuration

Tracked repos (and the user / organization headings) are configured via an environment variable.

- `TRACKED_REPOS`: A comma-delimited list of repositories to track and automatically fetch pull requests from. Example configuration: `'aragon/aragon,aragon/aragon-apps,aragon/aragon-ui'`


More documentation is available in [`env.sample`](./env.sample).

### Development

- `GITHUB_TOKEN`: Personal Github token ([create one with the `repo` scope](https://github.com/settings/tokens), to decrease API throttling and allow  access of private repos during development. **NOT** meant for production usage.

## Develop

```console
yarn
yarn dev
```

Then open `public/index.html` in your browser.

## Publish

This repo is automatically published for Aragon One via [Zeit Now](https://zeit.co/aragonone/pull-requests).

If you would like to re-configure it and host a version for your own repos, you can either fork this
repo and install the [Zeit Now Github integration](https://github.com/zeit/now) in your fork, or
manually publish through `now`:

```console
now
```
