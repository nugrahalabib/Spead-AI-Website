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

    # Define the EXACT metadata from home_keywords
    $metaUpdate = @{
        meta = @{
            interface = "list"
            special   = @("cast-json")
            display   = "related-values"
            note      = "Comma separated keywords (CSV)"
            options   = @{
                addLabel = "Add Keyword"
                template = "{{keyword}}"
                fields   = @(
                    @{
                        field = "keyword"
                        name  = "Keyword"
                        type  = "string"
                        meta  = @{
                            interface   = "input"
                            width       = "full"
                            placeholder = "Enter keyword..."
                        }
                    }
                )
            }
        }
    }

    Write-Host "Updating news_keywords to match home_keywords schema..."
    
    # Convert with Depth 10 to ensure the nested options/fields structure is preserved
    $jsonBody = $metaUpdate | ConvertTo-Json -Depth 10
    
    Invoke-RestMethod -Uri "$baseUrl/fields/seo/news_keywords" -Method Patch -Body $jsonBody -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" }
    
    Write-Host "✅ news_keywords updated successfully to use 'list' interface."

}
catch {
    Write-Error "Fatal Error: $($_.Exception.Message)"
    # Attempt to read detailed error
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Error "Details: $($reader.ReadToEnd())"
    }
    exit 1
}
exit 0
