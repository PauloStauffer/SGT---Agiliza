$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

function Import-DotEnv($path) {
    if (-not (Test-Path -LiteralPath $path)) {
        throw "Arquivo .env não encontrado em $path"
    }
    Get-Content -LiteralPath $path | ForEach-Object {
        if ($_ -match '^\s*([^#=]+?)\s*=\s*(.*)\s*$') {
            [Environment]::SetEnvironmentVariable($Matches[1].Trim(), $Matches[2].Trim(), "Process")
        }
    }
}

Import-DotEnv (Join-Path $root ".env")

if (-not (Get-Command mvn -ErrorAction SilentlyContinue)) {
    throw "Maven não encontrado no PATH. Execute mvn -version antes de iniciar."
}
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    throw "Node/npm não encontrado no PATH. Instale o Node.js antes de iniciar."
}

$backend = Join-Path $root "Backend"
$frontend = Join-Path $root "Frontend"
$port = if ($env:PORT) { $env:PORT } else { "3000" }

if (Get-NetTCPConnection -LocalPort ([int]$port) -State Listen -ErrorAction SilentlyContinue) {
    throw "A porta $port já está em uso. Encerre o backend antigo ou altere PORT no .env."
}

$backendCommand = "Set-Location '$backend'; mvn spring-boot:run"
$frontendCommand = "Set-Location '$frontend'; npm run dev"

Start-Process powershell.exe -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", $backendCommand
Start-Sleep -Seconds 2
Start-Process powershell.exe -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", $frontendCommand

Write-Host "Backend iniciando em http://localhost:$port"
Write-Host "Frontend iniciando pelo Vite."
Write-Host "Health check: http://localhost:$port/api/health"
Write-Host "Se database=unavailable, revise o login do SQL Server no .env."
