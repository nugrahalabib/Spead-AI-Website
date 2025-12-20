$ErrorActionPreference = "Stop"

$email = "admin@spead.ai"
$password = "password123"
$baseUrl = "http://localhost:8055"

Write-Host "Logging in as $email..."
$body = @{ email = $email; password = $password } | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $body -ContentType "application/json"
    $token = $response.data.access_token

    # Inspect home_keywords to see the "correct" reference
    $fieldRef = Invoke-RestMethod -Uri "$baseUrl/fields/seo/home_keywords" -Method Get -Headers @{ Authorization = "Bearer $token" }
    
    # Inspect the one I just made
    $fieldNew = Invoke-RestMethod -Uri "$baseUrl/fields/seo/news_keywords" -Method Get -Headers @{ Authorization = "Bearer $token" }

    Write-Host "`n--- REFERENCE (home_keywords) ---"
    $fieldRef.data | ConvertTo-Json -Depth 5
    
    Write-Host "`n--- CURRENT (news_keywords) ---"
    $fieldNew.data | ConvertTo-Json -Depth 5
}
catch {
    Write-Error "Error: $($_.Exception.Message)"
}
