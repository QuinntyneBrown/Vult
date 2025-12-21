$connectionString = "Server=localhost\SQLEXPRESS;Database=VultDb;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"

try {
    $connection = New-Object System.Data.SqlClient.SqlConnection
    $connection.ConnectionString = $connectionString
    $connection.Open()

    Write-Host "Connected to database successfully"

    # Remove the UpdateLatestDbModel migration from history
    $cmd = $connection.CreateCommand()
    $cmd.CommandText = "DELETE FROM __EFMigrationsHistory WHERE MigrationId = '20251220230140_UpdateLatestDbModel'"
    $rowsAffected = $cmd.ExecuteNonQuery()

    Write-Host "Removed UpdateLatestDbModel from migration history (rows affected: $rowsAffected)" -ForegroundColor Green

    $connection.Close()
    Write-Host "`nMigration history cleaned successfully!" -ForegroundColor Green
}
catch {
    Write-Host "Error: $_" -ForegroundColor Red
    if ($connection.State -eq 'Open') {
        $connection.Close()
    }
}
