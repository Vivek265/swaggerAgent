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

