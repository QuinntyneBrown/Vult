// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Vult.Core.Model.UserAggregate;

namespace Vult.Core.Services;

public class CurrentUser: ICurrentUser
{
    private readonly ILogger<CurrentUser> _logger;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IVultContext _vultContext;

    public CurrentUser(ILogger<CurrentUser> logger, IHttpContextAccessor httpContextAccessor, IVultContext vultContext){
        ArgumentNullException.ThrowIfNull(logger);
        ArgumentNullException.ThrowIfNull(httpContextAccessor);
        ArgumentNullException.ThrowIfNull(vultContext);

        _logger = logger;
        _httpContextAccessor = httpContextAccessor;
        _vultContext = vultContext;

    }

    public async Task<User> GetAsync()
    {
        _logger.LogInformation("GetAsync");
        
        Guid? userId = null;
        
        var userIdClaim = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!string.IsNullOrEmpty(userIdClaim) && Guid.TryParse(userIdClaim, out var parsedUserId))
        {
            userId = parsedUserId;
        }

        var model = await _vultContext.Users.SingleAsync(x => x.UserId == userId);

        return model;

    }

}

