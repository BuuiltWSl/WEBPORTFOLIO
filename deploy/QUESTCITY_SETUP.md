# Questcity Deploy Setup

Goal:

```text
https://questcity.cloud/built/portfolio-web
```

Target app:

```text
http://127.0.0.1:3200
```

## DNS

Create this A record:

```text
Type: A
Name: @
Value: 72.60.104.2
```

Optional:

```text
Type: A
Name: www
Value: 72.60.104.2
```

## Environment

On the server app, set:

```env
NEXT_PUBLIC_SITE_URL=https://questcity.cloud/built/portfolio-web
NEXT_PUBLIC_BASE_PATH=/built/portfolio-web
NEXT_PUBLIC_SUPABASE_URL=https://hotjpwfbumrskyuthmgm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=PUT_YOUR_KEY_HERE
NEXT_PUBLIC_ADMIN_EMAIL=sangsanwongmoolno.4@gmail.com
```

## Build

```bash
cd /home/bu1ltwsl/portfolio-web
git pull origin main
npm install
npm run build
npm start
```

## Nginx

Copy:

```text
deploy/nginx-questcity.conf
```

to:

```text
/etc/nginx/sites-available/questcity-portfolio
```

Enable it:

```bash
sudo ln -s /etc/nginx/sites-available/questcity-portfolio /etc/nginx/sites-enabled/questcity-portfolio
sudo nginx -t
sudo systemctl reload nginx
```

## HTTPS

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d questcity.cloud -d www.questcity.cloud
```

## Supabase Redirects

Add this redirect URL:

```text
https://questcity.cloud/built/portfolio-web/auth/callback
```

Keep local too:

```text
http://localhost:3000/auth/callback
```

