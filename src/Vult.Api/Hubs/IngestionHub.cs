// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Vult.Api.Hubs;

[Authorize]
public class IngestionHub : Hub
{
    public async Task SendIngestionUpdate(string message)
    {
        await Clients.All.SendAsync("IngestionUpdate", message);
    }

    public async Task SendIngestionProgress(int current, int total, string status)
    {
        await Clients.All.SendAsync("IngestionProgress", new { current, total, status });
    }

    public async Task SendIngestionComplete(object result)
    {
        await Clients.All.SendAsync("IngestionComplete", result);
    }

    public async Task SendIngestionError(string error)
    {
        await Clients.All.SendAsync("IngestionError", error);
    }
}
