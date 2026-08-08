# Limpa demo deployment

A single-command, self-contained demo of the Limpa platform you can open on a
phone. **No Firebase, Stripe, or MongoDB Atlas accounts required** — auth and
payments are mocked, MongoDB runs as a container, and demo data is seeded on
first boot.

## What's in the stack

| Service | Image / build | Notes |
|---------|---------------|-------|
| `web`   | `limpa-web/Dockerfile` → nginx | Serves the Vue SPA on **port 80**, reverse-proxies `/api` to the API |
| `api`   | `limpa-api/Dockerfile` (Node/Hapi) | Runs with `DEMO_MODE=true`: mock auth, mock Stripe, demo seed |
| `mongo` | `mongo:7` | Real MongoDB, data persisted in a named volume |

Everything is same-origin behind nginx, so there's no CORS or per-IP rebuild —
the phone just hits `http://<host>/`.

## Demo logins

Seeded automatically on first boot (password is ignored in demo mode):

- **Client:** `demo.client@limpa.app`
- **Cleaner:** `demo.cleaner@limpa.app`

You can also register brand-new client/cleaner accounts from the app.

---

## Run it locally (Docker)

Clone both repos side by side, then:

```bash
git clone https://github.com/MarkOdey/limpa-api.git
git clone https://github.com/MarkOdey/limpa-web.git
cd limpa-api/deploy
docker compose up -d --build
```

Open <http://localhost/>.

Stop with `docker compose down` (add `-v` to wipe the seeded database).

---

## Deploy on AWS (EC2 — simplest path to a public URL)

1. **Launch an instance**
   - AMI: **Amazon Linux 2023**, type: `t3.small` (or larger — the web image
     builds faster with more RAM).
   - **Security group:** allow inbound **TCP 80** from `0.0.0.0/0` (and 22 for SSH).
   - **Advanced details → User data:** paste the contents of
     [`aws-ec2-userdata.sh`](./aws-ec2-userdata.sh).
2. Wait ~3–5 minutes for it to install Docker and build the images.
3. Open **`http://<instance-public-ip>/`** on your phone.

### Or from the AWS CLI

```bash
aws ec2 run-instances \
  --image-id <al2023-ami-id-for-your-region> \
  --instance-type t3.small \
  --key-name <your-key> \
  --security-group-ids <sg-with-port-80> \
  --user-data file://aws-ec2-userdata.sh \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=limpa-demo}]'
```

Find a current AL2023 AMI id with:

```bash
aws ssm get-parameters --names \
  /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64 \
  --query 'Parameters[0].Value' --output text
```

### Notes

- **Branch:** the user-data script clones `claude/list-project-branches-5zy06k`
  by default (where these deploy files live). After you merge to `main`, either
  change the `BRANCH` variable at the top of the script or pass `BRANCH=main`.
- **Private repos:** if the repos aren't public, swap the clone URLs in the
  script for an authenticated form (a fine-grained PAT or a deploy key).
- **HTTPS:** this demo serves plain HTTP, which is fine for a throwaway demo.
  For a real domain, put it behind an ALB/CloudFront with an ACM cert, or add
  Caddy/Traefik in front of nginx.
- **Other AWS options:** this same compose works on **Lightsail Containers** or
  an **ECS/Fargate** task group; EC2 is just the least-moving-parts route.

---

## Turning off the mocks

Set these on the `api` service (in `docker-compose.yml`) to use real services:

| Variable | Demo value | Real value |
|----------|-----------|------------|
| `DEMO_MODE` | `true` | `false` |
| `AUTH_MODE` | `mock` | `firebase` (+ `FIREBASE_*` creds) |
| `STRIPE_MODE` | `mock` | `live` (+ `STRIPE_SECRET_KEY`) |
| `SEED_DEMO` | `true` | `false` |

And rebuild the web image with `AUTH_MODE=firebase` plus the real `FIREBASE_*`
build args.
