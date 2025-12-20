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
    
    $output = @()
    foreach ($field in $fields.data) {
        $output += "Field: $($field.field) (Type: $($field.type))"
    }
    $output | Out-File -FilePath "seo_fields.txt" -Encoding UTF8
    Write-Host "Fields saved to seo_fields.txt"
}
catch {
    Write-Error "Error: $($_.Exception.Message)"
}
