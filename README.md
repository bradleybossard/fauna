# fauna
Javascript library for generating L-Systems

[![Build Status][build]][link]
[![semantic-release][semantic-image] ][semantic-url]
[build]: https://travis-ci.org/bradleybossard/fauna.svg?branch=master
[link]: https://travis-ci.org/bradleybossard/fauna
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release


### Publish a new version

    # Make changes and increment package.json semver
    git add -A && git commit -m "Commit Message"
    git tag <semver>
    git push
    git push --tags
    npm publish
    npm info # to verify it worked

    
TODO: Test `git tag -a <semver> -m "my version 1.4"` to test if it creates the release message in Github
- [ ] Add function to ingest and run config
- [ ] Documentation
- [ ] Landing page
- [ ] Finished egghead.io publishing guide
