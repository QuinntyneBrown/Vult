// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Reflection;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Vult.Core.Authorization;

namespace Vult.Api.Behaviours;

public class ResourceOperationAuthorizationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly IAuthorizationService _authorizationService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ResourceOperationAuthorizationBehavior(
        IAuthorizationService authorizationService,
        IHttpContextAccessor httpContextAccessor)
    {
        _authorizationService = authorizationService;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var authorizeAttributes = request.GetType()
            .GetCustomAttributes<AuthorizeResourceOperationAttribute>()
            .ToList();

        if (!authorizeAttributes.Any())
        {
            return await next();
        }

        var user = _httpContextAccessor.HttpContext?.User;
        if (user == null || !user.Identity?.IsAuthenticated == true)
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        foreach (var attribute in authorizeAttributes)
        {
            var requirement = new ResourceOperationAuthorizationRequirement
            {
                Name = attribute.Operation,
                Resource = attribute.Resource
            };

            var result = await _authorizationService.AuthorizeAsync(user, null, requirement);
            if (!result.Succeeded)
            {
                throw new UnauthorizedAccessException(
                    $"User does not have {attribute.Operation} permission on {attribute.Resource}.");
            }
        }

        return await next();
    }
}
