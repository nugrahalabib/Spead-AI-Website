$ErrorActionPreference = "Stop"

$email = "admin@spead.ai"
$password = "password123"
$baseUrl = "http://localhost:8055"
$collections = @("journey_items", "project_categories")

Write-Host "Logging in as $email..."
$body = @{
    email    = $email
    password = $password
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $body -ContentType "application/json"
    $token = $response.data.access_token
    Write-Host "Login successful!"
    
    foreach ($col in $collections) {
        Write-Host "Attempting to delete collection: $col"
        try {
            Invoke-RestMethod -Uri "$baseUrl/collections/$col" -Method Delete -Headers @{ Authorization = "Bearer $token" }
            Write-Host "✅ Collection '$col' deleted successfully."
        }
        catch {
            Write-Host "⚠️ Failed to delete '$col'."
            # Write-Host $_.Exception.Message
        }
    }
}
catch {
    Write-Error "Login failed. Check server status."
    exit 1
}
exit 0
