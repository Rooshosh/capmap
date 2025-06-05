import { generate } from 'openapi-typescript-codegen';

async function generateClient() {
  await generate({
    input: 'https://developers.strava.com/swagger/swagger.json',
    output: './src/lib/strava-client/generated',
    useOptions: true,
    useUnionTypes: true,
    exportSchemas: true,
    exportServices: true,
    exportCore: true,
    exportModels: true,
    indent: '2',
    request: './src/lib/strava-client/request.ts',
  });
}

generateClient().catch(console.error); 