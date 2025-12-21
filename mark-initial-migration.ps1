$connectionString = "Server=localhost\SQLEXPRESS;Database=VultDb;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"

# Get the migration ID from the migrations folder
$migrationFiles = Get-ChildItem "src/Vult.Api/Migrations/*_InitialMigration.cs" | Where-Object { $_.Name -notlike "*.Designer.cs" }
if ($migrationFiles.Count -eq 0) {
    Write-Host "No InitialMigration file found!" -ForegroundColor Red
    exit 1
}

$migrationFileName = $migrationFiles[0].Name
$migrationId = $migrationFileName -replace '\.cs$', ''

Write-Host "Found migration: $migrationId"

try {
    $connection = New-Object System.Data.SqlClient.SqlConnection
    $connection.ConnectionString = $connectionString
    $connection.Open()

    Write-Host "Connected to database successfully"

    # Mark the migration as applied
    $cmd = $connection.CreateCommand()
    $cmd.CommandText = "INSERT INTO __EFMigrationsHistory (MigrationId, ProductVersion) VALUES (@Id, '8.0.11')"
    $cmd.Parameters.AddWithValue("@Id", $migrationId) | Out-Null
    $cmd.ExecuteNonQuery() | Out-Null

    Write-Host "Marked $migrationId as applied" -ForegroundColor Green

    $connection.Close()
    Write-Host "`nMigration history updated successfully!" -ForegroundColor Green
}
catch {
    Write-Host "Error: $_" -ForegroundColor Red
    if ($connection.State -eq 'Open') {
        $connection.Close()
    }
}
