#!/bin/bash
# EC2 user-data script — boots the full Limpa demo stack on a fresh instance.
#
# Tested on Amazon Linux 2023. Paste it into the "User data" field when launching
# an instance (Advanced details), or pass with `aws ec2 run-instances --user-data`.
#
# When the instance finishes booting, open  http://<public-ip>/  on your phone.
#
# If the repos are PRIVATE, replace the git clone URLs with an authenticated form
# (e.g. https://<token>@github.com/MarkOdey/limpa-web.git) or bake a deploy key.
set -euxo pipefail

BRANCH="${BRANCH:-claude/list-project-branches-5zy06k}"   # switch to "main" once merged
API_REPO="https://github.com/MarkOdey/limpa-api.git"
WEB_REPO="https://github.com/MarkOdey/limpa-web.git"

# --- Docker + Compose ------------------------------------------------------
dnf update -y
dnf install -y docker git
systemctl enable --now docker

ARCH="$(uname -m)"   # x86_64 or aarch64
DOCKER_CONFIG=/usr/local/lib/docker
mkdir -p "$DOCKER_CONFIG/cli-plugins"
curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-${ARCH}" \
  -o "$DOCKER_CONFIG/cli-plugins/docker-compose"
chmod +x "$DOCKER_CONFIG/cli-plugins/docker-compose"

# --- Clone both repos side by side -----------------------------------------
mkdir -p /opt/limpa
cd /opt/limpa
git clone --branch "$BRANCH" "$API_REPO" limpa-api
git clone --branch "$BRANCH" "$WEB_REPO" limpa-web

# --- Build and start -------------------------------------------------------
cd /opt/limpa/limpa-api/deploy
docker compose up -d --build

echo "Limpa demo is starting. It will be reachable on port 80 shortly."
