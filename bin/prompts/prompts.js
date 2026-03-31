export const swaggerCreationPrompt =`You are an expert Backend API Developer and Swagger/OpenAPI documentation specialist.

I am providing you with a JSON data array that represents the file structure and full content of a Node.js/Express backend application. The application includes routes, request handlers, database schemas, and existing swagger configurations.

Your task is to:
1. **Analyze the Codebase**: Read through the provided JSON data to identify all the Express route definitions located inside the 'routes/' directory (specifically 'userRoutes.ts', 'jobRoutes.ts', 'interviewRoutes.ts', and 'positionRoutes.ts').
2. **Map Routes to Handlers**: For each route, identify the HTTP method, the endpoint path, and trace it back to its corresponding controller/handler function located in the 'handlers/' directory to understand what the endpoint does.
3. **Determine Data Contracts**: Inspect the 'database/schemas/' directory (both the Zod validations like 'jobSchemaZod.ts'/'interviewSchemaZod.ts' and the Mongoose schemas) to determine the precise data types, bounds, required fields, and structures of the request bodies and responses.
4. **Generate Swagger Documentation**: Using all the extracted information, construct a complete, accurate, and valid OpenAPI 3.0 (Swagger) configuration in JSON format. Do not leave any routes out.

Requirements for the generated Swagger JSON:
- Include the standard 'openapi', 'info', and 'servers' objects.
- Include 'components.securitySchemes' defining 'BearerAuth' for the JWT token authentication handled by the 'verifyToken' middleware.
- Group the APIs using clear 'tags' (e.g., user, jobs, positions, interviews).
- Every endpoint in the 'paths' object must include:
   - A 'summary' and 'tags'.
   - 'security' block (if the route uses the 'verifyToken' middleware).
   - Expected 'parameters' (path variables like '/:id' or query parameters).
   - 'requestBody' configurations detailing the required JSON schema, pulling directly from your analysis of the Zod schemas.
   - Comprehensive 'responses' (200, 400, 401, 404, 500) complete with schema definitions and illustrative 'examples' based on the success/error maps returned in the handlers.

Please output the final Swagger documentation as a single, valid JSON code block.

Here is the data:
`;

export const swaggerFileDetectionPrompt = `Review the following JSON array of file paths. Find and return the JSON object that corresponds to the Swagger or OpenAPI documentation file. 

If a Swagger-related file exists, output only the path value from that JSON object. If there is no Swagger-related file in the data, output exactly the word "NO" and absolutely nothing else (no explanations, no formatting, no backticks).

Data:

`

export const swaggerUpdationPrompt =`You are an expert Backend API Developer and Swagger/OpenAPI documentation specialist.

I am providing you with our **current Swagger/OpenAPI JSON configuration** and the **contents of recently updated Node.js/Express files** (including routes, handlers, and schemas).

Your task is to **update the existing Swagger documentation** to reflect the changes in the provided code, **strictly without losing the current standards, formatting, or unaffected existing definitions**.

Please follow these steps:
1. **Analyze the Updated Codebase**: Read through the provided updated files to identify any new or modified Express route definitions, trace them to their updated handler functions, and identify structural changes in data contracts (Zod/Mongoose schemas).
2. **Determine Data Contracts**: Inspect the updated schemas to determine the precise data types, bounds, required fields, and structures of the affected request bodies and responses.
3. **Preserve Existing Standards**: Use the provided current Swagger JSON as your baseline. Retain existing descriptions, tags, and formatting intact unless they directly conflict with the updated code snippets. Do not remove endpoints unless explicitly removed in the code.
4. **Update the Swagger Configuration**:
   - Keep the existing 'openapi', 'info', 'servers', and 'securitySchemes' objects intact.
   - For all newly added or modified endpoints in the 'paths' object, ensure they include:
      - Appropriate 'summary' and 'tags' that match existing grouping styles.
      - A 'security' block (if the route uses token verification middleware).
      - Expected 'parameters' (path variables like '/:id' or query parameters).
      - 'requestBody' configurations detailing the required JSON schema, directly derived from the updated schemas.
      - Comprehensive 'responses' (e.g., 200, 400, 401, 404, 500) complete with schema definitions and illustrative 'examples' based on the newly updated handlers.

OUTPUT RESTRICTION:
Output ONLY the final, fully updated OpenAPI 3.0 (Swagger) configuration formatting as a single, valid JSON code block. Do NOT include any conversational filler, explanations, or pleasantries before or after the JSON. Your complete response must strictly consist of the JSON data.

Here is the current Swagger JSON and the updated files:

`

