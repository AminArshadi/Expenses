echo "Pushing to repo..."
git add .
git commit -m "updated"
git push origin main

echo "Pushing to heroku..."
git add .
git commit -m "updated"
git push heroku main