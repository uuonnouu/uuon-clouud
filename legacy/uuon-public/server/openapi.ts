export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Δmension Engine API',
    version: '1.0.0',
    description:
      'Parametric 3D shape computation engines for the Δmension mathematical universe. ' +
      'Access fractal, relativity, modulo, and (future) quantum engines via authenticated endpoints. ' +
      'Every shape is built from exact mathematics — no approximations.',
    contact: {
      name: 'Δmension',
      url: 'https://distinguished-rebirth-production.up.railway.app',
    },
    license: {
      name: 'Proprietary',
    },
  },
  servers: [
    {
      url: '/api',
      description: 'Current server',
    },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
        description:
          'Issue a key via POST /api/auth/generate-key (requires login). ' +
          'Format: `dmn_live_<40-hex-chars>`.',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'API key required' },
        },
      },
      ShapeListResponse: {
        type: 'object',
        properties: {
          engine: { type: 'string', example: 'ENGINE_FRACTAL' },
          shapes: {
            type: 'array',
            items: { type: 'string' },
            example: ['mandelbrot_surface', 'julia_surface'],
          },
          count: { type: 'integer', example: 16 },
        },
      },
      RenderRequest: {
        type: 'object',
        required: ['shapeId'],
        properties: {
          shapeId: {
            type: 'string',
            example: 'mandelbrot_surface',
            description: 'Shape identifier from the engine shape list',
          },
          parameters: {
            type: 'object',
            description: 'A–Z parametric overrides (all optional)',
            example: { a: 1, b: 1, c: 1, uMin: -3.14, uMax: 3.14 },
          },
          uSegments: { type: 'integer', default: 64, minimum: 5, maximum: 128 },
          vSegments: { type: 'integer', default: 64, minimum: 5, maximum: 128 },
        },
      },
      RenderResponse: {
        type: 'object',
        properties: {
          engine: { type: 'string' },
          shape: { type: 'string' },
          vertices: {
            type: 'array',
            items: { type: 'number' },
            description: 'Flat Float32 array: [x,y,z, x,y,z, …]',
          },
          normals: {
            type: 'array',
            items: { type: 'number' },
            description: 'Flat Float32 normal array aligned to vertices',
          },
          uvs: {
            type: 'array',
            items: { type: 'number' },
            description: 'Flat Float32 UV array [u,v, u,v, …]',
          },
          indices: {
            type: 'array',
            items: { type: 'integer' },
          },
          parameters: {
            type: 'object',
            description: 'Resolved parameters used for this render',
          },
          metadata: {
            type: 'object',
            properties: {
              vertexCount: { type: 'integer' },
              faceCount: { type: 'integer' },
              computeTimeMs: { type: 'number' },
            },
          },
        },
      },
      ModuloPatternRequest: {
        type: 'object',
        required: ['patternId'],
        properties: {
          patternId: { type: 'string', example: 'prime_spiral' },
          parameters: { type: 'object' },
        },
      },
      GenerateKeyRequest: {
        type: 'object',
        properties: {
          label: {
            type: 'string',
            example: 'my-unity-integration',
            description: 'Human-readable label for the key',
          },
        },
      },
      GenerateKeyResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          key: {
            type: 'string',
            example: 'dmn_live_a3f9…',
            description:
              'Full plaintext key — shown ONCE, store it securely.',
          },
          label: { type: 'string' },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
      ChatRequest: {
        type: 'object',
        required: ['message'],
        properties: {
          message: {
            type: 'string',
            maxLength: 500,
            example: 'How do I render a Klein bottle with the fractal engine?',
          },
          history: {
            type: 'array',
            maxItems: 10,
            items: {
              type: 'object',
              properties: {
                role: { type: 'string', enum: ['user', 'assistant'] },
                content: { type: 'string' },
              },
            },
          },
        },
      },
      ChatResponse: {
        type: 'object',
        properties: {
          reply: { type: 'string', description: 'Universe Advisor reply from Clouud' },
          engine: { type: 'string', example: 'Clouud' },
          conversation_id: {
            type: 'integer',
            description: 'Clouud conversation ID — reused for the duration of a browser session',
          },
        },
      },
    },
  },
  security: [{ ApiKeyAuth: [] }],
  paths: {
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Health check',
        description: 'Returns server liveness. No authentication required.',
        security: [],
        responses: {
          '200': {
            description: 'Server is alive',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { status: { type: 'string', example: 'ok' } },
                },
              },
            },
          },
        },
      },
    },
    '/status': {
      get: {
        tags: ['System'],
        summary: 'Engine status',
        description: 'Lists all engines and their availability. No authentication required.',
        security: [],
        responses: {
          '200': {
            description: 'Engine status map',
            content: { 'application/json': { schema: { type: 'object' } } },
          },
        },
      },
    },
    '/auth/generate-key': {
      post: {
        tags: ['Authentication'],
        summary: 'Generate an API key',
        description:
          'Creates a new `dmn_live_*` key tied to your account. ' +
          'Requires an active browser session (login first at `/api/auth/login`). ' +
          'The plaintext key is returned **once** — store it immediately.',
        security: [],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/GenerateKeyRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Key created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/GenerateKeyResponse' },
              },
            },
          },
          '401': { description: 'Not logged in' },
        },
      },
    },
    '/engines/fractal/shapes': {
      get: {
        tags: ['Fractal Engine'],
        summary: 'List fractal shapes',
        description: 'Returns all shape IDs available in the fractal engine.',
        responses: {
          '200': {
            description: 'Shape list',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ShapeListResponse' },
              },
            },
          },
          '401': {
            description: 'Missing or invalid API key',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/engines/fractal/render': {
      post: {
        tags: ['Fractal Engine'],
        summary: 'Render a fractal shape',
        description:
          'Computes the parametric mesh for the requested fractal shape. ' +
          'Returns vertices, normals, UVs, and indices as flat arrays ready for Three.js or Unity.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RenderRequest' },
              example: {
                shapeId: 'mandelbrot_surface',
                parameters: { a: 1, b: 1, c: 1 },
                uSegments: 64,
                vSegments: 64,
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Computed mesh',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RenderResponse' },
              },
            },
          },
          '401': { description: 'Missing or invalid API key' },
          '400': { description: 'Unknown shape ID or invalid parameters' },
        },
      },
    },
    '/engines/relativity/shapes': {
      get: {
        tags: ['Relativity Engine'],
        summary: 'List relativity shapes',
        description: 'Returns all shape IDs in the general-relativity engine (Schwarzschild, Kerr, etc.).',
        responses: {
          '200': {
            description: 'Shape list',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ShapeListResponse' },
              },
            },
          },
          '401': { description: 'Missing or invalid API key' },
        },
      },
    },
    '/engines/relativity/render': {
      post: {
        tags: ['Relativity Engine'],
        summary: 'Render a relativity shape',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RenderRequest' },
              example: { shapeId: 'schwarzschild_metric', parameters: { a: 1 } },
            },
          },
        },
        responses: {
          '200': {
            description: 'Computed mesh',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RenderResponse' },
              },
            },
          },
          '401': { description: 'Missing or invalid API key' },
        },
      },
    },
    '/engines/modulo/shapes': {
      get: {
        tags: ['Modulo Engine'],
        summary: 'List modulo shapes',
        description: 'Returns all pattern IDs in the modular-arithmetic engine.',
        responses: {
          '200': {
            description: 'Shape list',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ShapeListResponse' },
              },
            },
          },
          '401': { description: 'Missing or invalid API key' },
        },
      },
    },
    '/engines/modulo/pattern': {
      post: {
        tags: ['Modulo Engine'],
        summary: 'Render a modulo pattern',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ModuloPatternRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Pattern geometry',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RenderResponse' },
              },
            },
          },
          '401': { description: 'Missing or invalid API key' },
        },
      },
    },
    '/engines/quantum/shapes': {
      get: {
        tags: ['Quantum Engine (Coming Soon)'],
        summary: 'Quantum shape list — 503 until hardware active',
        description:
          'IBM quantum hardware integration is not yet active. ' +
          'This endpoint always returns 503. Authenticated requests are validated before hitting the block.',
        responses: {
          '503': {
            description: 'Quantum hardware not yet connected',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'coming_soon' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          '401': { description: 'Missing or invalid API key' },
        },
      },
    },
    '/chat': {
      post: {
        tags: ['AI Guidance'],
        summary: 'Ask the API guidance assistant',
        description:
          'Plain-English questions about the Δmension API answered by an AI trained on this spec. ' +
          'Rate limited to 10 requests per minute per IP. No API key required.',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ChatRequest' },
              example: {
                message: 'How do I render a Klein bottle with the fractal engine?',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'AI reply',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ChatResponse' },
              },
            },
          },
          '400': { description: 'Message too long or missing' },
          '429': { description: 'Rate limit exceeded — 10 req/min per IP' },
          '503': { description: 'AI service temporarily unavailable' },
        },
      },
    },
  },
};
