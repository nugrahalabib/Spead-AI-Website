$ErrorActionPreference = "Stop"

$email = "admin@spead.ai"
$password = "password123"
$baseUrl = "http://localhost:8055"

Write-Host "Logging in as $email..."
$body = @{ email = $email; password = $password } | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $body -ContentType "application/json"
    $token = $response.data.access_token
    Write-Host "Login successful!"

    # --- DELETE ---
    $del = @("projects_title", "projects_description", "projects_keywords", "projects_og_image", "journey_title", "journey_description", "journey_keywords", "journey_og_image")
    
    foreach ($f in $del) {
        Write-Host "Deleting $f..."
        try {
            Invoke-RestMethod -Uri "$baseUrl/fields/seo/$f" -Method Delete -Headers @{ Authorization = "Bearer $token" }
            Write-Host "OK."
        }
        catch {
            Write-Host "Ignored error deleting $f"
        }
    }

    # --- ADD ---
    
    # news_title
    Write-Host "Adding news_title..."
    $f1 = @{ field = "news_title"; type = "string"; meta = @{ interface = "input"; display = "raw"; sort = 10; width = "full"; note = "Title for the News page" } }
    try {
        $j1 = $f1 | ConvertTo-Json -Depth 5
        Invoke-RestMethod -Uri "$baseUrl/fields/seo" -Method Post -Body $j1 -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" }
        Write-Host "OK."
    }
    catch { Write-Host "Error/Skip: $($_.Exception.Message)" }

    # news_description
    Write-Host "Adding news_description..."
    $f2 = @{ field = "news_description"; type = "text"; meta = @{ interface = "input-multiline"; sort = 11; width = "full"; note = "Meta description" } }
    try {
        $j2 = $f2 | ConvertTo-Json -Depth 5
        Invoke-RestMethod -Uri "$baseUrl/fields/seo" -Method Post -Body $j2 -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" }
        Write-Host "OK."
    }
    catch { Write-Host "Error/Skip: $($_.Exception.Message)" }

    # news_keywords
    Write-Host "Adding news_keywords..."
    $f3 = @{ field = "news_keywords"; type = "json"; meta = @{ interface = "tags"; sort = 12; width = "full"; note = "Keywords" } }
    try {
        $j3 = $f3 | ConvertTo-Json -Depth 5
        Invoke-RestMethod -Uri "$baseUrl/fields/seo" -Method Post -Body $j3 -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" }
        Write-Host "OK."
    }
    catch { Write-Host "Error/Skip: $($_.Exception.Message)" }

    # news_og_image
    Write-Host "Adding news_og_image..."
    $f4 = @{ field = "news_og_image"; type = "uuid"; meta = @{ interface = "file-image"; sort = 13; width = "full"; note = "OG Image" } }
    try {
        $j4 = $f4 | ConvertTo-Json -Depth 5
        Invoke-RestMethod -Uri "$baseUrl/fields/seo" -Method Post -Body $j4 -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" }
        Write-Host "OK."
    }
    catch { Write-Host "Error/Skip: $($_.Exception.Message)" }
    
}
catch {
    Write-Error "Login failed or fatal error."
    exit 1
}
