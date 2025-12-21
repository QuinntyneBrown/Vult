$connectionString = "Server=localhost\SQLEXPRESS;Database=VultDb;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"

try {
    $connection = New-Object System.Data.SqlClient.SqlConnection
    $connection.ConnectionString = $connectionString
    $connection.Open()

    Write-Host "Connected to database successfully"

    # Mark the second migration as applied
    $cmd = $connection.CreateCommand()
    $cmd.CommandText = "INSERT INTO __EFMigrationsHistory (MigrationId, ProductVersion) VALUES ('20251221040200_CaptureLatestDbChanges', '8.0.11')"
    $cmd.ExecuteNonQuery() | Out-Null

    Write-Host "Marked 20251221040200_CaptureLatestDbChanges as applied" -ForegroundColor Green

    $connection.Close()
    Write-Host "`nMigration history updated successfully!" -ForegroundColor Green
}
catch {
    Write-Host "Error: $_" -ForegroundColor Red
    if ($connection.State -eq 'Open') {
        $connection.Close()
    }
}
