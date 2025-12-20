$ErrorActionPreference = "Stop"

$email = "admin@spead.ai"
$password = "password123"
$baseUrl = "http://localhost:8055"

Write-Host "Logging in as $email..."
$body = @{
    email    = $email
    password = $password
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $body -ContentType "application/json"
    $token = $response.data.access_token
    
    $cols = Invoke-RestMethod -Uri "$baseUrl/collections" -Method Get -Headers @{ Authorization = "Bearer $token" }
    
    Write-Host "`n--- AVAILABLE COLLECTIONS ---"
    foreach ($col in $cols.data) {
        if (-not $col.collection.StartsWith("directus_")) {
            Write-Host "Name: $($col.collection)"
        }
    }
    Write-Host "---------------------------`n"
}
catch {
    Write-Error "Error: $($_.Exception.Message)"
}
