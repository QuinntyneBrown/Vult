// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Vult.Api.Configuration;

public class CorsSettings
{
    public const string SectionName = "Cors";

    public string[] AllowedOrigins { get; set; } = Array.Empty<string>();

    public string[] AllowedMethods { get; set; } = Array.Empty<string>();

    public string[] AllowedHeaders { get; set; } = Array.Empty<string>();

    public bool AllowCredentials { get; set; } = true;

    public string PolicyName { get; set; } = "CorsPolicy";
}
