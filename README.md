# via-swagger

A powerful CLI tool designed to help you create, maintain, and update Swagger (OpenAPI) documentation effortlessly with the help of AI agents. It intelligently utilizes large language models (Claude, OpenAI, and Google Gemini) to assist in generating comprehensive API documentation right from your codebase.

## Prerequisites

- Node.js (v18 or higher recommended)
- An API Key from Anthropic, OpenAI, or Google.

## Installation

You can install `via-swagger` globally using npm:

```bash
npm install -g via-swagger
```

*(Note: If the package is not yet published to npm, you can clone the repository and run `npm install -g .` from the project root).*

## Usage

After installation, the `via-swagger` command will be available globally in your terminal. Here are the core commands you can use.

### 1. Set Your API Key

Before generating documentation, you need to configure your AI provider's API key. The CLI will automatically infer the appropriate model type (Claude, OpenAI, or Google) based on the format of the key you provide.

```bash
via-swagger set-api-key <your-api-key>
```
*Example:* `via-swagger set-api-key sk-ant-api03...`

### 2. Generate or Update Swagger

To automatically add or update your Swagger documentation based on your codebase, navigate to your project directory and run:

```bash
via-swagger add-swagger
```

> **Note**: If the routers and handlers of your project are located inside a specific directory (like `src`), try to invoke the CLI tool from that specific path.

The AI agent will analyze your changes and maintain your Swagger records, ensuring all stylized descriptions and unused definitions are safely preserved.

### 3. Check Stored Configuration

To verify your currently active configuration and the type of model inferred from your API key, run:

```bash
via-swagger check-data
```

### 4. Check Version

To see which version of `via-swagger` you are currently using:

```bash
via-swagger --version
# or
via-swagger -v
```

## How It Works

1. **Authentication:** Uses secure local storage for your LLM API keys.
2. **Context Gathering:** Analyzes parts of your codebase and existing `swagger.json` to prepare prompts.
3. **AI Processing:** Interacts with leading LLMs (via LangChain integrations) to update API endpoints.
4. **Seamless Integration:** Merges the AI response back into your existing API documentation elegantly.

## License

ISC
