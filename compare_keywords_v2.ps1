$ErrorActionPreference = "Stop"

$email = "admin@spead.ai"
$password = "password123"
$baseUrl = "http://localhost:8055"

Write-Host "Logging in as $email..."
$body = @{ email = $email; password = $password } | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $body -ContentType "application/json"
    $token = $response.data.access_token

    $fieldRef = Invoke-RestMethod -Uri "$baseUrl/fields/seo/home_keywords" -Method Get -Headers @{ Authorization = "Bearer $token" }
    $fieldNew = Invoke-RestMethod -Uri "$baseUrl/fields/seo/news_keywords" -Method Get -Headers @{ Authorization = "Bearer $token" }

    $output = "--- REFERENCE (home_keywords) ---`n"
    $output += $fieldRef.data | ConvertTo-Json -Depth 10
    $output += "`n`n--- CURRENT (news_keywords) ---`n"
    $output += $fieldNew.data | ConvertTo-Json -Depth 10
    
    $output | Out-File -FilePath "compare_keywords_out.txt" -Encoding UTF8
    Write-Host "Saved to compare_keywords_out.txt"
}
catch {
    Write-Error "Error: $($_.Exception.Message)"
}
