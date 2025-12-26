// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Vult.Core.Authorization;

[AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
public class AuthorizeResourceOperationAttribute : Attribute
{
    public string Operation { get; }
    public string Resource { get; }

    public AuthorizeResourceOperationAttribute(string operation, string resource)
    {
        Operation = operation;
        Resource = resource;
    }
}
