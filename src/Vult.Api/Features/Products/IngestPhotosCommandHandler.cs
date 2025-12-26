// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using MediatR;
using Microsoft.AspNetCore.SignalR;
using Vult.Api.Hubs;
using Vult.Core;

namespace Vult.Api.Features.Products;

public class IngestProductPhotosCommandHandler : IRequestHandler<IngestProductPhotosCommand, IngestProductPhotosCommandResult>
{
    private readonly IProductIngestionService _ingestionService;
    private readonly IHubContext<IngestionHub> _hubContext;
    private readonly ILogger<IngestProductPhotosCommandHandler> _logger;

    public IngestProductPhotosCommandHandler(
        IProductIngestionService ingestionService,
        IHubContext<IngestionHub> hubContext,
        ILogger<IngestProductPhotosCommandHandler> logger)
    {
        _ingestionService = ingestionService;
        _hubContext = hubContext;
        _logger = logger;
    }

    public async Task<IngestProductPhotosCommandResult> Handle(
        IngestProductPhotosCommand command,
        CancellationToken cancellationToken)
    {
        var result = new IngestProductPhotosCommandResult();

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
            var ingestionResult = await _ingestionService.IngestAsync(
                imageByteArrays.ToArray(),
                cancellationToken);

            // Map result
            result.Success = ingestionResult.Success;
            result.Errors = ingestionResult.Errors;
            result.TotalProcessed = ingestionResult.TotalProcessed;
            result.SuccessfullyProcessed = ingestionResult.SuccessfullyProcessed;
            result.Failed = ingestionResult.Failed;

            // Convert products to DTOs
            result.Products = ingestionResult.Products
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
