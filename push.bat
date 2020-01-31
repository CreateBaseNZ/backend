echo See what's going on
git status

echo Add to the staging area
git add .

echo Commit to git
git commit -m "Update"

echo Push to GitHub
git push origin master

echo Push to Heroku
git push heroku master