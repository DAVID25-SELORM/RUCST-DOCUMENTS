# Regent University DMS - Automated Setup Script
# Run this script in PowerShell as Administrator

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Regent University Document Management System   " -ForegroundColor Cyan
Write-Host "            Automated Setup Script                " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠️  Please run this script as Administrator!" -ForegroundColor Yellow
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    pause
    exit
}

# Function to check if a command exists
function Test-CommandExists {
    param($command)
    $null = Get-Command $command -ErrorAction SilentlyContinue
    return $?
}

Write-Host "📋 Step 1: Checking Prerequisites..." -ForegroundColor Green
Write-Host ""

# Check Node.js
if (Test-CommandExists node) {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    pause
    exit
}

# Check npm
if (Test-CommandExists npm) {
    $npmVersion = npm --version
    Write-Host "✅ npm is installed: v$npmVersion" -ForegroundColor Green
} else {
    Write-Host "❌ npm is not installed!" -ForegroundColor Red
    pause
    exit
}

# Check MongoDB
if (Test-CommandExists mongo) {
    Write-Host "✅ MongoDB is installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  MongoDB command not found in PATH" -ForegroundColor Yellow
    Write-Host "Make sure MongoDB is installed and running" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📦 Step 2: Installing Dependencies..." -ForegroundColor Green
Write-Host ""

# Install root dependencies
Write-Host "Installing root dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install root dependencies" -ForegroundColor Red
    pause
    exit
}

# Install server dependencies
Write-Host "Installing server dependencies..." -ForegroundColor Cyan
Set-Location server
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install server dependencies" -ForegroundColor Red
    pause
    exit
}

# Install client dependencies
Write-Host "Installing client dependencies..." -ForegroundColor Cyan
Set-Location ../client
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install client dependencies" -ForegroundColor Red
    pause
    exit
}

Set-Location ..

Write-Host ""
Write-Host "⚙️  Step 3: Setting Up Environment Files..." -ForegroundColor Green
Write-Host ""

# Setup server .env
if (-not (Test-Path "server/.env")) {
    Copy-Item "server/.env.example" "server/.env"
    Write-Host "✅ Created server/.env file" -ForegroundColor Green
} else {
    Write-Host "ℹ️  server/.env already exists" -ForegroundColor Cyan
}

# Setup client .env
if (-not (Test-Path "client/.env")) {
    Copy-Item "client/.env.example" "client/.env"
    Write-Host "✅ Created client/.env file" -ForegroundColor Green
} else {
    Write-Host "ℹ️  client/.env already exists" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "🗄️  Step 4: Checking MongoDB Service..." -ForegroundColor Green
Write-Host ""

$mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
if ($mongoService) {
    if ($mongoService.Status -eq 'Running') {
        Write-Host "✅ MongoDB service is running" -ForegroundColor Green
    } else {
        Write-Host "Starting MongoDB service..." -ForegroundColor Cyan
        Start-Service MongoDB
        Write-Host "✅ MongoDB service started" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  MongoDB service not found" -ForegroundColor Yellow
    Write-Host "Please make sure MongoDB is installed and running manually" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "👥 Step 5: Seeding Database (Optional)..." -ForegroundColor Green
Write-Host ""

$seedChoice = Read-Host "Do you want to create sample users? (y/n)"
if ($seedChoice -eq 'y' -or $seedChoice -eq 'Y') {
    Set-Location server
    node seed.js
    Set-Location ..
    Write-Host "✅ Sample users created" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Skipping database seeding" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "          ✅ Setup Complete!                      " -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📌 Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Start the application:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Access the application:" -ForegroundColor White
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Login with sample credentials:" -ForegroundColor White
Write-Host "   Email:    superadmin@regent.edu" -ForegroundColor Cyan
Write-Host "   Password: superadmin123" -ForegroundColor Cyan
Write-Host ""
Write-Host "📖 For more information, see:" -ForegroundColor Yellow
Write-Host "   - README.md" -ForegroundColor White
Write-Host "   - INSTALLATION.md" -ForegroundColor White
Write-Host "   - QUICKSTART.md" -ForegroundColor White
Write-Host ""
Write-Host "Made with ❤️  by David Selorm Gabion" -ForegroundColor Magenta
Write-Host ""

$startChoice = Read-Host "Do you want to start the application now? (y/n)"
if ($startChoice -eq 'y' -or $startChoice -eq 'Y') {
    Write-Host ""
    Write-Host "🚀 Starting application..." -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop the servers" -ForegroundColor Yellow
    Write-Host ""
    npm run dev
} else {
    Write-Host ""
    Write-Host "You can start the application later with: npm run dev" -ForegroundColor Cyan
    Write-Host ""
}
