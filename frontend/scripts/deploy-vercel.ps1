# Деплой Golib Shop на Vercel (бесплатный тариф)
# Запуск: .\scripts\deploy-vercel.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "Golib Shop -> Vercel" -ForegroundColor Cyan
Write-Host ""

if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
  Write-Host "Установите Vercel CLI: npm i -g vercel" -ForegroundColor Yellow
  exit 1
}

Write-Host "1. Войдите в Vercel (откроется браузер)..." -ForegroundColor Green
vercel login

Write-Host ""
Write-Host "2. Деплой preview..." -ForegroundColor Green
vercel --yes

Write-Host ""
Write-Host "3. Деплой в production..." -ForegroundColor Green
vercel --prod --yes

Write-Host ""
Write-Host "Готово! Добавьте Upstash Redis в Vercel -> Storage для сохранения заказов." -ForegroundColor Cyan
Write-Host "Подробнее: docs/DEPLOY.md"
