# fauna
Javascript library for generating L-Systems


### Publish a new version

    # Make changes and increment package.json semver
    git add -A && git commit -m "Commit Message"
    git tag <semver>
    git push
    git push --tags
    npm publish
    npm info # to verify it worked

    
TODO: Test `git tag -a <semver> -m "my version 1.4"` to test if it creates the release message in Github
