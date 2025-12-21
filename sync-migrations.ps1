$connectionString = "Server=localhost\SQLEXPRESS;Database=VultDb;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"

$migrations = @(
    @{Id="20251216055510_InitialCreate"; Version="8.0.11"},
    @{Id="20251216060855_UpdateCatalogItemImageModel"; Version="8.0.11"},
    @{Id="20251216061634_AddAuthenticationSchema"; Version="8.0.11"},
    @{Id="20251220230140_UpdateLatestDbModel"; Version="8.0.11"}
)

try {
    $connection = New-Object System.Data.SqlClient.SqlConnection
    $connection.ConnectionString = $connectionString
    $connection.Open()

    Write-Host "Connected to database successfully"

    # Check if __EFMigrationsHistory table exists and has data
    $checkCmd = $connection.CreateCommand()
    $checkCmd.CommandText = "IF OBJECT_ID('__EFMigrationsHistory', 'U') IS NOT NULL SELECT MigrationId FROM __EFMigrationsHistory"
    $reader = $checkCmd.ExecuteReader()

    $existingMigrations = @()
    while ($reader.Read()) {
        $existingMigrations += $reader["MigrationId"]
    }
    $reader.Close()

    Write-Host "Found $($existingMigrations.Count) existing migration(s) in history"

    # Insert missing migrations
    foreach ($migration in $migrations) {
        if ($existingMigrations -notcontains $migration.Id) {
            $cmd = $connection.CreateCommand()
            $cmd.CommandText = "INSERT INTO __EFMigrationsHistory (MigrationId, ProductVersion) VALUES (@Id, @Version)"
            $cmd.Parameters.AddWithValue("@Id", $migration.Id) | Out-Null
            $cmd.Parameters.AddWithValue("@Version", $migration.Version) | Out-Null

            $cmd.ExecuteNonQuery() | Out-Null
            Write-Host "Inserted migration: $($migration.Id)" -ForegroundColor Green
        } else {
            Write-Host "Migration already exists: $($migration.Id)" -ForegroundColor Yellow
        }
    }

    $connection.Close()
    Write-Host "`nMigration history synced successfully!" -ForegroundColor Green
}
catch {
    Write-Host "Error: $_" -ForegroundColor Red
    if ($connection.State -eq 'Open') {
        $connection.Close()
    }
}
