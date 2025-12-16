// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.AspNetCore.SignalR;
using Vult.Api.Hubs;
using Vult.Core.Interfaces;

namespace Vult.Api.Features.CatalogItems;

public class IngestCatalogItemPhotosCommandHandler : IRequestHandler<IngestCatalogItemPhotosCommand, IngestCatalogItemPhotosCommandResult>
{
    private readonly ICatalogItemIngestionService _ingestionService;
    private readonly IHubContext<IngestionHub> _hubContext;
    private readonly ILogger<IngestCatalogItemPhotosCommandHandler> _logger;

    public IngestCatalogItemPhotosCommandHandler(
        ICatalogItemIngestionService ingestionService,
        IHubContext<IngestionHub> hubContext,
        ILogger<IngestCatalogItemPhotosCommandHandler> logger)
    {
        _ingestionService = ingestionService;
        _hubContext = hubContext;
        _logger = logger;
    }

    public async Task<IngestCatalogItemPhotosCommandResult> Handle(
        IngestCatalogItemPhotosCommand command,
        CancellationToken cancellationToken)
    {
        var result = new IngestCatalogItemPhotosCommandResult();

        if (command.Photos == null || !command.Photos.Any())
        {
            result.Errors.Add("No photos provided");
            return result;
        }

        try
        {
            // Notify clients that ingestion has started
            await _hubContext.Clients.All.SendAsync(
                "IngestionProgress",
                new { current = 0, total = command.Photos.Count, status = "Starting ingestion..." },
                cancellationToken);

            // Convert IFormFile to byte arrays
            var imageByteArrays = new List<byte[]>();
            for (var i = 0; i < command.Photos.Count; i++)
            {
                var photo = command.Photos[i];
                using var memoryStream = new MemoryStream();
                await photo.CopyToAsync(memoryStream, cancellationToken);
                imageByteArrays.Add(memoryStream.ToArray());

                await _hubContext.Clients.All.SendAsync(
                    "IngestionProgress",
                    new { current = i + 1, total = command.Photos.Count, status = $"Processing image {i + 1} of {command.Photos.Count}..." },
                    cancellationToken);
            }

            // Process images using ingestion service
            var ingestionResult = await _ingestionService.IngestImagesAsync(
                imageByteArrays.ToArray(),
                cancellationToken);

            // Map result
            result.Success = ingestionResult.Success;
            result.Errors = ingestionResult.Errors;
            result.TotalProcessed = ingestionResult.TotalProcessed;
            result.SuccessfullyProcessed = ingestionResult.SuccessfullyProcessed;
            result.Failed = ingestionResult.Failed;

            // Convert catalog items to DTOs
            result.CatalogItems = ingestionResult.CatalogItems
                .Select(item => item.ToDto())
                .ToList();

            // Notify clients of completion
            if (result.Success)
            {
                await _hubContext.Clients.All.SendAsync(
                    "IngestionComplete",
                    result,
                    cancellationToken);
            }
            else
            {
                await _hubContext.Clients.All.SendAsync(
                    "IngestionError",
                    string.Join(", ", result.Errors),
                    cancellationToken);
            }

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during photo ingestion");
            result.Errors.Add($"Unexpected error: {ex.Message}");
            
            await _hubContext.Clients.All.SendAsync(
                "IngestionError",
                ex.Message,
                cancellationToken);

            return result;
        }
    }
}
