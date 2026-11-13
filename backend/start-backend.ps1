$ErrorActionPreference = 'Stop'

# Open Docker Desktop manually first. Only MySQL runs in Docker.
& docker compose --project-directory (Split-Path -Parent $PSScriptRoot) up -d --wait --wait-timeout 180 mysql
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$maven = Get-Command mvn.cmd -ErrorAction SilentlyContinue
$serviceJobs = @()

try {
    foreach ($service in @('auth-service', 'tenant-service')) {
        $directory = Join-Path $PSScriptRoot $service
        $command = if ($maven) { $maven.Source } else { Join-Path $directory 'mvnw.cmd' }
        $serviceJobs += Start-Job -Name $service -ArgumentList $directory, $command, $service -ScriptBlock {
            param($directory, $command, $service)
            Set-Location -LiteralPath $directory
            & $command spring-boot:run 2>&1 | ForEach-Object { "[$service] $_" }
            if ($LASTEXITCODE -ne 0) { throw "$service exited with code $LASTEXITCODE" }
        }
    }

    Write-Host 'Running auth-service (8080) and tenant-service (8081) locally. Press Ctrl+C to stop.'
    $serviceJobs | Receive-Job -Wait -ErrorAction Continue
} finally {
    if ($serviceJobs.Count -gt 0) {
        $serviceJobs | Stop-Job
        $serviceJobs | Remove-Job -Force
    }
}
