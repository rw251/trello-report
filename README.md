# Boilerplate brunch setup


# Installation

- Clone the boilerplate repository
```
git clone git@github.com:rw251/brunch-boilerplate.git
```

- Install the dependencies
```
cd brunch-boilerplate && npm install
```

- Run the setup script (removes the `.git` folder and updates the `package.json` file and creates a new git repo)
```
npm config set brunch-boilerplate:repo git@github.com:INSERT-NEW-REPO-NAME.git
npm run setup -- repo
```

- Assuming this is going to live in github and be deployed to gh-pages.. Push the local repo to the remote repo
```
git remote add origin git@github.com:INSERT-NEW-REPO-NAME.git
git push -u origin master
git subtree push --prefix public origin gh-pages
npm run build
cd public
git remote add origin git@github.com:INSERT-NEW-REPO-NAME.git
git pull
rm .placeholder
git checkout gh-pages
git add --all && git commit -m "Depoyed" && git push
```
