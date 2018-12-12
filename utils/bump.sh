OLD_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')

# Bump this version
yarn version --silent --no-git-tag-version --new-version $1
NEW_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')

# Bump `project` package.json version to current
cd server && yarn version --silent --no-git-tag-version --new-version $NEW_VERSION && cd ..
cd client && yarn version --silent --no-git-tag-version --new-version $NEW_VERSION && cd ..

echo "Bumped from $OLD_VERSION to $NEW_VERSION"
