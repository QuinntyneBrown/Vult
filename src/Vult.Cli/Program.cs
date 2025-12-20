using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Vult.Core;

string[] ImageExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".webp" };

var builder = Host.CreateApplicationBuilder(args);

builder.Services.AddLogging();

builder.Services.AddCliServices(builder.Configuration);

builder.Configuration.AddUserSecrets("6936f8f1-c7b6-4ab4-baa2-b45b13c02e87");

var host = builder.Build();


var service = host.Services.GetRequiredService<ICatalogItemIngestionService>();

List<byte[]> photoBytes = new();

var files = Directory.GetFiles(@"C:\photos")
            .Where(file => ImageExtensions.Contains(Path.GetExtension(file).ToLowerInvariant()));

foreach (var filePath in files)
{
    try
    {
        // Read the file into a byte array
        byte[] fileBytes = File.ReadAllBytes(filePath);

        // Use filename as key
        string fileName = Path.GetFileName(filePath);

        photoBytes.Add(fileBytes);
    }
    catch (Exception ex)
    {
        // Log or handle individual file errors
        Console.WriteLine($"Error reading file {filePath}: {ex.Message}");
    }
}

var result = await service.IngestAsync(photoBytes.ToArray());

host.Run();