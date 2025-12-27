// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Vult.Api.Configuration;

/// <summary>
/// Swagger operation filter to properly handle file upload endpoints
/// </summary>
public class SwaggerFileOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var fileParameters = context.MethodInfo.GetParameters()
            .Where(p => p.ParameterType == typeof(IFormFile) ||
                       p.ParameterType == typeof(IFormFileCollection))
            .ToList();

        if (!fileParameters.Any())
        {
            return;
        }

        // Clear existing parameters
        operation.Parameters?.Clear();

        // Set request body to use multipart/form-data
        operation.RequestBody = new OpenApiRequestBody
        {
            Content = new Dictionary<string, OpenApiMediaType>
            {
                ["multipart/form-data"] = new OpenApiMediaType
                {
                    Schema = new OpenApiSchema
                    {
                        Type = "object",
                        Properties = new Dictionary<string, OpenApiSchema>(),
                        Required = new HashSet<string>()
                    }
                }
            }
        };

        var schema = operation.RequestBody.Content["multipart/form-data"].Schema;

        foreach (var parameter in fileParameters)
        {
            if (parameter.ParameterType == typeof(IFormFile))
            {
                schema.Properties[parameter.Name!] = new OpenApiSchema
                {
                    Type = "string",
                    Format = "binary"
                };
                schema.Required.Add(parameter.Name!);
            }
            else if (parameter.ParameterType == typeof(IFormFileCollection))
            {
                schema.Properties[parameter.Name!] = new OpenApiSchema
                {
                    Type = "array",
                    Items = new OpenApiSchema
                    {
                        Type = "string",
                        Format = "binary"
                    }
                };
                schema.Required.Add(parameter.Name!);
            }
        }
    }
}
