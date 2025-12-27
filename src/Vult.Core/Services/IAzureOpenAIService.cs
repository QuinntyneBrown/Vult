// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using OpenAI.Chat;

namespace Vult.Core.Services;

public interface IAzureOpenAIService
{
    Task<string> CompleteChatAsync(
        IEnumerable<ChatMessage> messages,
        CancellationToken cancellationToken = default);
}

