$ErrorActionPreference = 'Stop'

# Open Docker Desktop manually before running this script.
Push-Location (Join-Path $PSScriptRoot 'frontend')
try {
    & node node_modules/concurrently/dist/bin/index.js `
        --kill-others --names frontend,backend `
        'npm.cmd start' `
        'powershell.exe -NoProfile -ExecutionPolicy Bypass -File ../backend/start-backend.ps1'
    $startupExitCode = $LASTEXITCODE
} finally {
    Pop-Location
}

exit $startupExitCode
