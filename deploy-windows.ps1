# =============================================================================
# Deployment Guide: tenders.sijilacc.com on Windows VPS
# VPS: vps-0e8d6122.vps.ovh.net
# Stack: Next.js + Caddy (HTTPS reverse proxy) + NSSM (Windows service)
# =============================================================================
#
# ARCHITECTURE:
#   Internet → Caddy (:443 HTTPS / :80 redirect) → Next.js (:3000)
#   - Caddy handles HTTPS automatically (built-in ACME / Let's Encrypt)
#   - NSSM runs both Caddy and Next.js as Windows services
#   - No IIS needed, no manual cert management needed
#
# PREREQUISITES:
#   - Windows VPS with admin access
#   - Node.js installed (v18+ recommended)
#   - NSSM available at C:\nssm-2.24\win64\nssm.exe
#   - Domain tenders.sijilacc.com pointing to VPS IP
#   - Ports 80 and 443 open in Windows Firewall
#
# =============================================================================

# --- STEP 0: Set variables ---------------------------------------------------
$DOMAIN        = "tenders.sijilacc.com"
$API_BASE      = "https://tenderapi.sijilacc.com"
$APP_DIR       = "C:\apps\tenders-frontend"
$CADDY_DIR     = "C:\apps\caddy"
$NSSM_EXE      = "C:\nssm-2.24\win64\nssm.exe"
$NODE_PORT     = 3000

# --- STEP 1: Verify DNS is pointing to this VPS ------------------------------
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " Step 1: Verify prerequisites" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# Check Node.js
$nodeVersion = & node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "[ERROR] Node.js not found. Install from https://nodejs.org (v18 LTS+)" -ForegroundColor Red
    Write-Host "  Download: https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi" -ForegroundColor Yellow
    exit 1
}
Write-Host "[OK] Node.js: $nodeVersion" -ForegroundColor Green

# Check npm
$npmVersion = & npm --version 2>$null
Write-Host "[OK] npm: $npmVersion" -ForegroundColor Green

# Check NSSM
if (-not (Test-Path $NSSM_EXE)) {
    Write-Host "[ERROR] NSSM not found at $NSSM_EXE" -ForegroundColor Red
    Write-Host "  Adjust the `$NSSM_EXE path or download from https://nssm.cc" -ForegroundColor Yellow
    exit 1
}
Write-Host "[OK] NSSM found" -ForegroundColor Green

# Check DNS
Write-Host ""
Write-Host "Verifying DNS for $DOMAIN ..." -ForegroundColor Yellow
try {
    $dns = Resolve-DnsName $DOMAIN -ErrorAction Stop | Where-Object { $_.QueryType -eq 'A' }
    Write-Host "[OK] $DOMAIN resolves to $($dns.IPAddress -join ', ')" -ForegroundColor Green
} catch {
    Write-Host "[WARN] Cannot resolve $DOMAIN - make sure DNS A record points to this VPS IP" -ForegroundColor Yellow
}

# --- STEP 2: Open firewall ports ---------------------------------------------
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " Step 2: Configure Windows Firewall" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

$rules = @(
    @{ Name = "HTTP-In-80"; Port = 80 },
    @{ Name = "HTTPS-In-443"; Port = 443 }
)
foreach ($rule in $rules) {
    $existing = Get-NetFirewallRule -DisplayName $rule.Name -ErrorAction SilentlyContinue
    if (-not $existing) {
        New-NetFirewallRule -DisplayName $rule.Name -Direction Inbound -Protocol TCP -LocalPort $rule.Port -Action Allow | Out-Null
        Write-Host "[OK] Firewall rule '$($rule.Name)' created" -ForegroundColor Green
    } else {
        Write-Host "[OK] Firewall rule '$($rule.Name)' already exists" -ForegroundColor Green
    }
}

# --- STEP 3: Install Caddy ---------------------------------------------------
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " Step 3: Install Caddy (HTTPS reverse proxy)" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

New-Item -Path $CADDY_DIR -ItemType Directory -Force | Out-Null

if (-not (Test-Path "$CADDY_DIR\caddy.exe")) {
    Write-Host "Downloading Caddy..." -ForegroundColor Yellow
    $caddyUrl = "https://caddyserver.com/api/download?os=windows&arch=amd64"
    Invoke-WebRequest -Uri $caddyUrl -OutFile "$CADDY_DIR\caddy.exe" -UseBasicParsing
    Write-Host "[OK] Caddy downloaded" -ForegroundColor Green
} else {
    Write-Host "[OK] Caddy already exists" -ForegroundColor Green
}

# Create Caddyfile
$caddyfile = @"
$DOMAIN {
    reverse_proxy localhost:$NODE_PORT

    encode gzip zstd

    header {
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        Referrer-Policy "strict-origin-when-cross-origin"
        -Server
    }
}
"@

Set-Content -Path "$CADDY_DIR\Caddyfile" -Value $caddyfile -Encoding UTF8
Write-Host "[OK] Caddyfile created at $CADDY_DIR\Caddyfile" -ForegroundColor Green
Write-Host ""
Write-Host "  Caddy will automatically:" -ForegroundColor Gray
Write-Host "    - Obtain Let's Encrypt SSL cert for $DOMAIN" -ForegroundColor Gray
Write-Host "    - Auto-renew the cert" -ForegroundColor Gray
Write-Host "    - Redirect HTTP -> HTTPS" -ForegroundColor Gray
Write-Host "    - Reverse proxy to Next.js on port $NODE_PORT" -ForegroundColor Gray

# --- STEP 4: Deploy Next.js app ----------------------------------------------
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " Step 4: Deploy Next.js application" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# Create app directory
New-Item -Path $APP_DIR -ItemType Directory -Force | Out-Null

Write-Host ""
Write-Host "  Copy the tenders-frontend folder contents to:" -ForegroundColor Yellow
Write-Host "    $APP_DIR" -ForegroundColor White
Write-Host ""
Write-Host "  If you have the zip file on this server, run:" -ForegroundColor Yellow
Write-Host "    Expand-Archive -Path C:\path\to\tenders-frontend-v5.zip -DestinationPath C:\apps\ -Force" -ForegroundColor White
Write-Host "    Copy-Item -Path C:\apps\tenders-frontend\* -Destination $APP_DIR -Recurse -Force" -ForegroundColor White
Write-Host ""

# Check if app files exist
if (-not (Test-Path "$APP_DIR\package.json")) {
    Write-Host "[WAIT] Package.json not found. Copy the app files first, then re-run this section." -ForegroundColor Yellow
    Write-Host "  Press Enter after copying files, or Ctrl+C to exit..." -ForegroundColor Yellow
    Read-Host
}

# Create .env.local
$envContent = @"
NEXT_PUBLIC_API_BASE_URL=$API_BASE
NEXT_PUBLIC_API_VERSION=/api/v1
"@
Set-Content -Path "$APP_DIR\.env.local" -Value $envContent -Encoding UTF8
Write-Host "[OK] .env.local created" -ForegroundColor Green

# Install dependencies and build
Write-Host "Installing npm dependencies..." -ForegroundColor Yellow
Push-Location $APP_DIR
& npm install 2>&1 | Select-Object -Last 5
Write-Host "[OK] Dependencies installed" -ForegroundColor Green

Write-Host "Building Next.js app (this may take 1-2 minutes)..." -ForegroundColor Yellow
& npm run build 2>&1 | Select-Object -Last 10
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Build failed! Check errors above." -ForegroundColor Red
    Pop-Location
    exit 1
}
Write-Host "[OK] Build successful" -ForegroundColor Green
Pop-Location

# --- STEP 5: Create Windows services with NSSM --------------------------------
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " Step 5: Create Windows services (NSSM)" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# --- Service 1: Next.js app ---
$svcNextjs = "TendersFrontend"

# Stop and remove existing service if present
$existingNext = Get-Service -Name $svcNextjs -ErrorAction SilentlyContinue
if ($existingNext) {
    Write-Host "Stopping existing $svcNextjs service..." -ForegroundColor Yellow
    & $NSSM_EXE stop $svcNextjs 2>$null
    & $NSSM_EXE remove $svcNextjs confirm 2>$null
    Start-Sleep -Seconds 2
}

# Find node.exe path
$nodePath = (Get-Command node).Source

# Install service
& $NSSM_EXE install $svcNextjs $nodePath
& $NSSM_EXE set $svcNextjs AppParameters "node_modules\.bin\next start -p $NODE_PORT"
& $NSSM_EXE set $svcNextjs AppDirectory $APP_DIR
& $NSSM_EXE set $svcNextjs DisplayName "Tenders Frontend (Next.js)"
& $NSSM_EXE set $svcNextjs Description "Next.js app for tenders.sijilacc.com"
& $NSSM_EXE set $svcNextjs Start SERVICE_AUTO_START
& $NSSM_EXE set $svcNextjs AppStdout "$APP_DIR\logs\nextjs-stdout.log"
& $NSSM_EXE set $svcNextjs AppStderr "$APP_DIR\logs\nextjs-stderr.log"
& $NSSM_EXE set $svcNextjs AppRotateFiles 1
& $NSSM_EXE set $svcNextjs AppRotateBytes 5242880

# Create logs directory
New-Item -Path "$APP_DIR\logs" -ItemType Directory -Force | Out-Null

Write-Host "[OK] Service '$svcNextjs' installed" -ForegroundColor Green

# --- Service 2: Caddy reverse proxy ---
$svcCaddy = "CaddyProxy"

$existingCaddy = Get-Service -Name $svcCaddy -ErrorAction SilentlyContinue
if ($existingCaddy) {
    Write-Host "Stopping existing $svcCaddy service..." -ForegroundColor Yellow
    & $NSSM_EXE stop $svcCaddy 2>$null
    & $NSSM_EXE remove $svcCaddy confirm 2>$null
    Start-Sleep -Seconds 2
}

& $NSSM_EXE install $svcCaddy "$CADDY_DIR\caddy.exe"
& $NSSM_EXE set $svcCaddy AppParameters "run --config $CADDY_DIR\Caddyfile --adapter caddyfile"
& $NSSM_EXE set $svcCaddy AppDirectory $CADDY_DIR
& $NSSM_EXE set $svcCaddy DisplayName "Caddy HTTPS Proxy"
& $NSSM_EXE set $svcCaddy Description "Caddy reverse proxy with auto HTTPS for tenders.sijilacc.com"
& $NSSM_EXE set $svcCaddy Start SERVICE_AUTO_START
& $NSSM_EXE set $svcCaddy AppStdout "$CADDY_DIR\caddy-stdout.log"
& $NSSM_EXE set $svcCaddy AppStderr "$CADDY_DIR\caddy-stderr.log"
& $NSSM_EXE set $svcCaddy AppRotateFiles 1
& $NSSM_EXE set $svcCaddy AppRotateBytes 5242880

Write-Host "[OK] Service '$svcCaddy' installed" -ForegroundColor Green

# --- STEP 6: Start services ---------------------------------------------------
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " Step 6: Start services" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# Start Next.js first, then Caddy
Write-Host "Starting $svcNextjs..." -ForegroundColor Yellow
& $NSSM_EXE start $svcNextjs
Start-Sleep -Seconds 5

# Verify Next.js is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:$NODE_PORT" -UseBasicParsing -TimeoutSec 10
    Write-Host "[OK] Next.js is running on port $NODE_PORT (status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "[WARN] Next.js may still be starting. Check logs at $APP_DIR\logs\" -ForegroundColor Yellow
}

Write-Host "Starting $svcCaddy..." -ForegroundColor Yellow
& $NSSM_EXE start $svcCaddy
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " Deployment Complete!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Your site will be available at:" -ForegroundColor White
Write-Host "    https://$DOMAIN" -ForegroundColor Green
Write-Host ""
Write-Host "  Caddy will automatically obtain the SSL certificate" -ForegroundColor Gray
Write-Host "  on first request. This may take 10-30 seconds." -ForegroundColor Gray
Write-Host ""
Write-Host "  Services:" -ForegroundColor White
Write-Host "    $svcNextjs - Next.js app on port $NODE_PORT" -ForegroundColor Gray
Write-Host "    $svcCaddy  - Caddy HTTPS proxy on port 443" -ForegroundColor Gray
Write-Host ""
Write-Host "  Useful commands:" -ForegroundColor White
Write-Host "    $NSSM_EXE status $svcNextjs       # Check Next.js status" -ForegroundColor Gray
Write-Host "    $NSSM_EXE status $svcCaddy        # Check Caddy status" -ForegroundColor Gray
Write-Host "    $NSSM_EXE restart $svcNextjs      # Restart Next.js" -ForegroundColor Gray
Write-Host "    $NSSM_EXE restart $svcCaddy       # Restart Caddy" -ForegroundColor Gray
Write-Host "    Get-Content $APP_DIR\logs\nextjs-stderr.log -Tail 50  # View logs" -ForegroundColor Gray
Write-Host ""
Write-Host "  To update the app:" -ForegroundColor White
Write-Host "    1. $NSSM_EXE stop $svcNextjs" -ForegroundColor Gray
Write-Host "    2. Copy new files to $APP_DIR" -ForegroundColor Gray
Write-Host "    3. cd $APP_DIR && npm install && npm run build" -ForegroundColor Gray
Write-Host "    4. $NSSM_EXE start $svcNextjs" -ForegroundColor Gray
Write-Host ""
