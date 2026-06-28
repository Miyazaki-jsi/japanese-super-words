#!/usr/bin/env bash
# GitHub backup setup for japanese-super-words
# Run once from the project root after creating a GitHub repo.

set -euo pipefail

REPO_NAME="${1:-japanese-super-words}"
GITHUB_USER="${2:-}"

if [[ -z "$GITHUB_USER" ]]; then
  echo "Usage: ./scripts/setup-github-backup.sh [repo-name] [github-username]"
  echo ""
  echo "Example:"
  echo "  ./scripts/setup-github-backup.sh japanese-super-words your-github-username"
  echo ""
  echo "Steps:"
  echo "  1. Create a new PRIVATE repo on GitHub named: $REPO_NAME"
  echo "     https://github.com/new"
  echo "  2. Do NOT add README, .gitignore, or license (this project already has them)"
  echo "  3. Run this script with your GitHub username"
  exit 1
fi

REMOTE_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

if git remote get-url origin >/dev/null 2>&1; then
  echo "origin already set: $(git remote get-url origin)"
else
  git remote add origin "$REMOTE_URL"
  echo "Added origin: $REMOTE_URL"
fi

git push -u origin main

echo ""
echo "Done. Next (optional): connect Vercel to GitHub for auto-deploy"
echo "  Vercel → japanese-super-words → Settings → Git → Connect"
