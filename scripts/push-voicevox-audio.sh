#!/usr/bin/env bash
# Push VOICEVOX WAV assets to GitHub one situation folder at a time.
# Resumable: skips folders already on origin/main.
set -euo pipefail

cd "$(dirname "$0")/.."

DIRS=(
  airport_immigration allergies_dietary asking_for_directions atm_payments coffee_shop coin_laundry
  convenience_store depachika disaster_evacuation don_quijote festival
  game_center greetings gyudon_shop hangover hatsumode highway_bus
  hospital hotel izakaya karaoke koban late_night_bar lost_emergency
  luggage_shipping missed_last_train onsen pharmacy rainy_day ramen_shop
  restaurant_reservation ryokan sauna shinkansen shrine_temple sim_card sushi_shop
  taxi text theme_park ticket_machine train_station
)

git fetch origin

on_remote() {
  git ls-tree -r --name-only "origin/main" -- "public/audio/voicevox/$1" | grep -q .
}

push_with_retry() {
  local max=5 attempt=1
  while [ "$attempt" -le "$max" ]; do
    echo "  push attempt $attempt/$max..."
    if git -c http.postBuffer=524288000 -c http.lowSpeedLimit=0 -c http.lowSpeedTime=999999 push origin main; then
      return 0
    fi
    attempt=$((attempt + 1))
    sleep 15
  done
  return 1
}

total=${#DIRS[@]}
done=0

for dir in "${DIRS[@]}"; do
  if on_remote "$dir"; then
    echo "[$((done + 1))/$total] skip $dir (already on origin)"
    done=$((done + 1))
    continue
  fi

  echo "[$((done + 1))/$total] $dir"
  git add "public/audio/voicevox/$dir"
  git commit -m "Add VOICEVOX audio: $dir"
  push_with_retry
  done=$((done + 1))
  echo "  done"
done

echo "All VOICEVOX audio folders pushed."
git status -sb
