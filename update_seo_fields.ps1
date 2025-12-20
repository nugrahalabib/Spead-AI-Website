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
    Write-Host "Login successful!"

    # 1. DELETE Legacy Fields
    $fieldsToDelete = @(
        "projects_title", "projects_description", "projects_keywords", "projects_og_image",
        "journey_title", "journey_description", "journey_keywords", "journey_og_image"
    )

    foreach ($field in $fieldsToDelete) {
        Write-Host "Deleting field: $field..."
        try {
            Invoke-RestMethod -Uri "$baseUrl/fields/seo/$field" -Method Delete -Headers @{ Authorization = "Bearer $token" }
            Write-Host "✅ Deleted $field"
        }
        catch {
            Write-Host "⚠️ Failed/Skipped $field: $($_.Exception.Message)"
        }
    }

    # 2. ADD New Fields for News
    $fieldsToAdd = @(
        @{
            field = "news_title"
            type  = "string"
            meta  = @{
                interface = "input"
                display   = "raw"
                sort      = 10
                width     = "full"
                note      = "Title for the News page"
            }
        },
        @{
            field = "news_description"
            type  = "text"
            meta  = @{
                interface = "input-multiline"
                sort      = 11
                width     = "full"
                note      = "Meta description for the News page"
            }
        },
        @{
            field = "news_keywords"
            type  = "json"
            meta  = @{
                interface = "tags"
                sort      = 12
                width     = "full"
                note      = "Keywords for the News page"
            }
        },
        @{
            field = "news_og_image"
            type  = "uuid"
            meta  = @{
                interface = "file-image"
                sort      = 13
                width     = "full"
                note      = "Open Graph Image for social sharing"
            }
        }
    )

    foreach ($fieldSpec in $fieldsToAdd) {
        Write-Host "Creating field: $($fieldSpec.field)..."
        try {
            $jsonBody = $fieldSpec | ConvertTo-Json -Depth 4
            Invoke-RestMethod -Uri "$baseUrl/fields/seo" -Method Post -Body $jsonBody -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" }
            Write-Host "✅ Created $($fieldSpec.field)"
        }
        catch {
            if ($_.Exception.Message -match "403") {
                Write-Error "Permission Denied. Are you Admin?"
            }
            elseif ($_.Exception.Message -match "Conflict") {
                Write-Host "ℹ️ Field $($fieldSpec.field) might already exist."
            }
            else {
                Write-Error "Failed to create $($fieldSpec.field): $($_.Exception.Message)"
            }
        }
    }
    
    Write-Host "`nSEO Collection Refactoring Complete!"
}
catch {
    Write-Error "Fatal Error: $($_.Exception.Message)"
    exit 1
}
exit 0
