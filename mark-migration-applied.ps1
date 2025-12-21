$connectionString = "Server=localhost\SQLEXPRESS;Database=VultDb;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"

try {
    $connection = New-Object System.Data.SqlClient.SqlConnection
    $connection.ConnectionString = $connectionString
    $connection.Open()

    Write-Host "Connected to database successfully"

    # Add the UpdateLatestDbModel migration back to history without running it
    $cmd = $connection.CreateCommand()
    $cmd.CommandText = "INSERT INTO __EFMigrationsHistory (MigrationId, ProductVersion) VALUES ('20251220230140_UpdateLatestDbModel', '8.0.11')"
    $cmd.ExecuteNonQuery() | Out-Null

    Write-Host "Marked UpdateLatestDbModel as applied in migration history" -ForegroundColor Green

    $connection.Close()
    Write-Host "`nMigration history updated successfully!" -ForegroundColor Green
}
catch {
    Write-Host "Error: $_" -ForegroundColor Red
    if ($connection.State -eq 'Open') {
        $connection.Close()
    }
}
