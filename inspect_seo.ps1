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
    
    $fields = Invoke-RestMethod -Uri "$baseUrl/fields/seo" -Method Get -Headers @{ Authorization = "Bearer $token" }
    
    Write-Host "`n--- SEO COLLECTION FIELDS ---"
    foreach ($field in $fields.data) {
        Write-Host "Field: $($field.field) (Type: $($field.type))"
    }
    Write-Host "---------------------------`n"
}
catch {
    Write-Error "Error: $($_.Exception.Message)"
}
