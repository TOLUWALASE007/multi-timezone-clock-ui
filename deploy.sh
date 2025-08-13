#!/bin/bash

# Build the project
npm run build

# Remove the old gh-pages branch if it exists
git branch -D gh-pages

# Create a new gh-pages branch
git checkout -b gh-pages

# Remove all files except build folder
git rm -rf .
git checkout main -- build

# Move build contents to root
mv build/* .
rmdir build

# Add all files
git add .

# Commit
git commit -m "Deploy to GitHub Pages"

# Push to gh-pages branch
git push origin gh-pages --force

# Go back to main branch
git checkout main

echo "Deployment complete! Go to your repository settings and set GitHub Pages source to 'gh-pages' branch."
