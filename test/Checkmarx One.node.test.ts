/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { CheckmarxOne } from '../nodes/Checkmarx One/Checkmarx One.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('CheckmarxOne Node', () => {
  let node: CheckmarxOne;

  beforeAll(() => {
    node = new CheckmarxOne();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Checkmarx One');
      expect(node.description.name).toBe('checkmarxone');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Project Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://ast.checkmarx.net/api',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	test('should get all projects successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getProjects')
			.mockReturnValueOnce(100)
			.mockReturnValueOnce(0);

		const mockResponse = { projects: [{ id: '1', name: 'Test Project' }] };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeProjectOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://ast.checkmarx.net/api/projects',
			qs: { limit: 100, offset: 0 },
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			json: true,
		});
	});

	test('should get specific project successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getProject')
			.mockReturnValueOnce('project-123');

		const mockResponse = { id: 'project-123', name: 'Test Project' };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeProjectOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://ast.checkmarx.net/api/projects/project-123',
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			json: true,
		});
	});

	test('should create project successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createProject')
			.mockReturnValueOnce('New Project')
			.mockReturnValueOnce({ group: [{ id: 'group-1' }] })
			.mockReturnValueOnce({ tag: [{ key: 'env', value: 'prod' }] });

		const mockResponse = { id: 'project-new', name: 'New Project' };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeProjectOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://ast.checkmarx.net/api/projects',
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			body: {
				name: 'New Project',
				groups: [{ id: 'group-1' }],
				tags: { env: 'prod' },
			},
			json: true,
		});
	});

	test('should handle errors when continueOnFail is true', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getProjects');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeProjectOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
	});

	test('should throw error when continueOnFail is false', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getProjects');
		mockExecuteFunctions.continueOnFail.mockReturnValue(false);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		await expect(
			executeProjectOperations.call(mockExecuteFunctions, [{ json: {} }])
		).rejects.toThrow('API Error');
	});
});

describe('Scan Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://ast.checkmarx.net/api',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	test('should get scans successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getScans')
			.mockReturnValueOnce('project-123')
			.mockReturnValueOnce(20)
			.mockReturnValueOnce(0)
			.mockReturnValueOnce('created_at');

		const mockResponse = { scans: [{ id: 'scan-1', status: 'completed' }] };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeScanOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			json: true,
			method: 'GET',
			url: 'https://ast.checkmarx.net/api/scans?project-id=project-123&limit=20&offset=0&sort=created_at',
		});
		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
	});

	test('should get specific scan successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getScan')
			.mockReturnValueOnce('scan-123');

		const mockResponse = { id: 'scan-123', status: 'running' };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeScanOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			json: true,
			method: 'GET',
			url: 'https://ast.checkmarx.net/api/scans/scan-123',
		});
		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
	});

	test('should create scan successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createScan')
			.mockReturnValueOnce('project-123')
			.mockReturnValueOnce('sast')
			.mockReturnValueOnce('{"preset": "Checkmarx Default"}')
			.mockReturnValueOnce('git');

		const mockResponse = { id: 'scan-456', status: 'queued' };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeScanOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			json: true,
			method: 'POST',
			url: 'https://ast.checkmarx.net/api/scans',
			body: {
				project: 'project-123',
				type: 'sast',
				config: { preset: 'Checkmarx Default' },
				handler: 'git',
			},
		});
		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
	});

	test('should delete scan successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('deleteScan')
			.mockReturnValueOnce('scan-123');

		const mockResponse = { success: true };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeScanOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			json: true,
			method: 'DELETE',
			url: 'https://ast.checkmarx.net/api/scans/scan-123',
		});
		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
	});

	test('should get scan results successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getScanResults')
			.mockReturnValueOnce('scan-123');

		const mockResponse = { results: [{ severity: 'high', title: 'SQL Injection' }] };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeScanOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			json: true,
			method: 'GET',
			url: 'https://ast.checkmarx.net/api/scans/scan-123/results',
		});
		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
	});

	test('should get scan logs successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getScanLogs')
			.mockReturnValueOnce('scan-123');

		const mockResponse = { logs: ['Scan started', 'Processing files'] };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeScanOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			json: true,
			method: 'GET',
			url: 'https://ast.checkmarx.net/api/scans/scan-123/logs',
		});
		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
	});

	test('should handle API errors gracefully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getScan')
			.mockReturnValueOnce('invalid-scan');

		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Scan not found'));

		await expect(
			executeScanOperations.call(mockExecuteFunctions, [{ json: {} }])
		).rejects.toThrow('Scan not found');
	});

	test('should continue on fail when enabled', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getScan')
			.mockReturnValueOnce('invalid-scan');

		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeScanOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{
			json: { error: 'API Error' },
			pairedItem: { item: 0 },
		}]);
	});
});

describe('Result Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-token',
        baseUrl: 'https://ast.checkmarx.net/api',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  it('should get results successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getResults')
      .mockReturnValueOnce('scan-123')
      .mockReturnValueOnce('HIGH')
      .mockReturnValueOnce('TO_VERIFY')
      .mockReturnValueOnce(100)
      .mockReturnValueOnce(0);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      results: [{ id: 'result-1', severity: 'HIGH' }],
    });

    const result = await executeResultOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({
      results: [{ id: 'result-1', severity: 'HIGH' }],
    });
  });

  it('should get specific result successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getResult')
      .mockReturnValueOnce('result-123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      id: 'result-123',
      severity: 'HIGH',
      state: 'TO_VERIFY',
    });

    const result = await executeResultOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({
      id: 'result-123',
      severity: 'HIGH',
      state: 'TO_VERIFY',
    });
  });

  it('should update result successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('updateResult')
      .mockReturnValueOnce('result-123')
      .mockReturnValueOnce('CONFIRMED')
      .mockReturnValueOnce('Updated after review');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      id: 'result-123',
      state: 'CONFIRMED',
      comment: 'Updated after review',
    });

    const result = await executeResultOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({
      id: 'result-123',
      state: 'CONFIRMED',
      comment: 'Updated after review',
    });
  });

  it('should create predicate successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createPredicate')
      .mockReturnValueOnce('similarity-123')
      .mockReturnValueOnce('project-456')
      .mockReturnValueOnce('NOT_EXPLOITABLE');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      id: 'predicate-789',
      'similarity-id': 'similarity-123',
      'project-id': 'project-456',
      state: 'NOT_EXPLOITABLE',
    });

    const result = await executeResultOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({
      id: 'predicate-789',
      'similarity-id': 'similarity-123',
      'project-id': 'project-456',
      state: 'NOT_EXPLOITABLE',
    });
  });

  it('should handle API errors', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getResults')
      .mockReturnValueOnce('invalid-scan-id');

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
      new Error('API Error: Scan not found'),
    );

    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeResultOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({
      error: 'API Error: Scan not found',
    });
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getResults')
      .mockReturnValueOnce('invalid-scan-id');

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
      new Error('API Error: Scan not found'),
    );

    mockExecuteFunctions.continueOnFail.mockReturnValue(false);

    await expect(
      executeResultOperations.call(mockExecuteFunctions, [{ json: {} }]),
    ).rejects.toThrow('API Error: Scan not found');
  });
});

describe('Application Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://ast.checkmarx.net/api',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	test('should get all applications successfully', async () => {
		const mockResponse = {
			applications: [
				{ id: '1', name: 'App1', description: 'Test app 1' },
				{ id: '2', name: 'App2', description: 'Test app 2' },
			],
		};

		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getApplications')
			.mockReturnValueOnce(100)
			.mockReturnValueOnce(0);
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeApplicationOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://ast.checkmarx.net/api/applications',
			qs: { limit: 100, offset: 0 },
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			json: true,
		});
		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
	});

	test('should get specific application successfully', async () => {
		const mockResponse = { id: '123', name: 'Test App', description: 'Test description' };

		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getApplication')
			.mockReturnValueOnce('123');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeApplicationOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://ast.checkmarx.net/api/applications/123',
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			json: true,
		});
		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
	});

	test('should create application successfully', async () => {
		const mockResponse = { id: '456', name: 'New App', description: 'New description' };

		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createApplication')
			.mockReturnValueOnce('New App')
			.mockReturnValueOnce('New description')
			.mockReturnValueOnce({ tag: [{ key: 'env', value: 'prod' }] });
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeApplicationOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://ast.checkmarx.net/api/applications',
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			body: {
				name: 'New App',
				description: 'New description',
				tags: { env: 'prod' },
			},
			json: true,
		});
		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
	});

	test('should update application successfully', async () => {
		const mockResponse = { id: '789', name: 'Updated App', description: 'Updated description' };

		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('updateApplication')
			.mockReturnValueOnce('789')
			.mockReturnValueOnce('Updated App')
			.mockReturnValueOnce('Updated description')
			.mockReturnValueOnce({});
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeApplicationOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'PUT',
			url: 'https://ast.checkmarx.net/api/applications/789',
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			body: {
				name: 'Updated App',
				description: 'Updated description',
			},
			json: true,
		});
		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
	});

	test('should delete application successfully', async () => {
		const mockResponse = { message: 'Application deleted successfully' };

		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('deleteApplication')
			.mockReturnValueOnce('123');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeApplicationOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'DELETE',
			url: 'https://ast.checkmarx.net/api/applications/123',
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			json: true,
		});
		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
	});

	test('should handle API errors properly', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getApplications');
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);

		const result = await executeApplicationOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
	});

	test('should throw error when continueOnFail is false', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getApplications');
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
		mockExecuteFunctions.continueOnFail.mockReturnValue(false);

		await expect(executeApplicationOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
	});
});

describe('Upload Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://ast.checkmarx.net/api',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('createUpload operation', () => {
		it('should create upload with file path successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createUpload')
				.mockReturnValueOnce('project-123')
				.mockReturnValueOnce('filePath')
				.mockReturnValueOnce('/path/to/file.zip');

			const mockResponse = {
				uploadId: 'upload-123',
				status: 'pending',
				projectId: 'project-123',
			};
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const fs = require('fs');
			jest.spyOn(fs, 'existsSync').mockReturnValue(true);
			jest.spyOn(fs, 'createReadStream').mockReturnValue('mock-stream');

			const items = [{ json: {} }];
			const result = await executeUploadOperations.call(mockExecuteFunctions, items);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://ast.checkmarx.net/api/uploads',
				headers: {
					Authorization: 'Bearer test-token',
				},
				formData: {
					'project-id': 'project-123',
					file: 'mock-stream',
				},
			});
		});

		it('should create upload with binary data successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createUpload')
				.mockReturnValueOnce('project-123')
				.mockReturnValueOnce('binaryData')
				.mockReturnValueOnce('data');

			const mockResponse = {
				uploadId: 'upload-123',
				status: 'pending',
				projectId: 'project-123',
			};
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const items = [{
				json: {},
				binary: {
					data: {
						data: Buffer.from('test-content').toString('base64'),
						fileName: 'test.zip',
						mimeType: 'application/zip',
					},
				},
			}];

			const result = await executeUploadOperations.call(mockExecuteFunctions, items);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'POST',
					url: 'https://ast.checkmarx.net/api/uploads',
					headers: {
						Authorization: 'Bearer test-token',
					},
					formData: expect.objectContaining({
						'project-id': 'project-123',
					}),
				})
			);
		});

		it('should handle createUpload errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createUpload')
				.mockReturnValueOnce('project-123')
				.mockReturnValueOnce('filePath')
				.mockReturnValueOnce('/path/to/file.zip');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Upload failed'));

			const fs = require('fs');
			jest.spyOn(fs, 'existsSync').mockReturnValue(true);
			jest.spyOn(fs, 'createReadStream').mockReturnValue('mock-stream');

			const items = [{ json: {} }];

			await expect(executeUploadOperations.call(mockExecuteFunctions, items)).rejects.toThrow('Upload failed');
		});
	});

	describe('getUpload operation', () => {
		it('should get upload successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getUpload')
				.mockReturnValueOnce('upload-123');

			const mockResponse = {
				uploadId: 'upload-123',
				status: 'completed',
				projectId: 'project-123',
			};
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const items = [{ json: {} }];
			const result = await executeUploadOperations.call(mockExecuteFunctions, items);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://ast.checkmarx.net/api/uploads/upload-123',
				headers: {
					Authorization: 'Bearer test-token',
				},
				json: true,
			});
		});

		it('should handle getUpload errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getUpload')
				.mockReturnValueOnce('upload-123');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Upload not found'));

			const items = [{ json: {} }];

			await expect(executeUploadOperations.call(mockExecuteFunctions, items)).rejects.toThrow('Upload not found');
		});
	});

	it('should handle unknown operation', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

		const items = [{ json: {} }];

		await expect(executeUploadOperations.call(mockExecuteFunctions, items)).rejects.toThrow('Unknown operation: unknownOperation');
	});

	it('should continue on fail when enabled', async () => {
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

		const items = [{ json: {} }];
		const result = await executeUploadOperations.call(mockExecuteFunctions, items);

		expect(result).toEqual([
			{
				json: { error: 'Unknown operation: unknownOperation' },
				pairedItem: { item: 0 },
			},
		]);
	});
});

describe('Query Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        baseUrl: 'https://ast.checkmarx.net/api',
        accessToken: 'test-token'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  describe('getQueries', () => {
    it('should retrieve queries successfully', async () => {
      const mockQueries = [
        { id: '1', name: 'Test Query 1', language: 'javascript' },
        { id: '2', name: 'Test Query 2', language: 'python' }
      ];

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getQueries')
        .mockReturnValueOnce('security')
        .mockReturnValueOnce('javascript')
        .mockReturnValueOnce(10)
        .mockReturnValueOnce(0);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce(mockQueries);

      const result = await executeQueryOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockQueries);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/queries'),
        })
      );
    });

    it('should handle errors when retrieving queries', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getQueries');
      mockExecuteFunctions.continueOnFail.mockReturnValueOnce(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValueOnce(new Error('API Error'));

      const result = await executeQueryOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('getQuery', () => {
    it('should get specific query successfully', async () => {
      const mockQuery = { id: '123', name: 'Test Query', source: 'query code' };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getQuery')
        .mockReturnValueOnce('123');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce(mockQuery);

      const result = await executeQueryOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockQuery);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/queries/123'),
        })
      );
    });
  });

  describe('createQuery', () => {
    it('should create query successfully', async () => {
      const mockCreatedQuery = { id: '123', name: 'New Query', source: 'new query code' };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createQuery')
        .mockReturnValueOnce('New Query')
        .mockReturnValueOnce('security')
        .mockReturnValueOnce('javascript')
        .mockReturnValueOnce('new query code');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce(mockCreatedQuery);

      const result = await executeQueryOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockCreatedQuery);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: expect.stringContaining('/queries'),
          body: expect.objectContaining({
            name: 'New Query',
            source: 'new query code',
            group: 'security',
            language: 'javascript'
          }),
        })
      );
    });
  });

  describe('updateQuery', () => {
    it('should update query successfully', async () => {
      const mockUpdatedQuery = { id: '123', name: 'Updated Query', source: 'updated code' };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateQuery')
        .mockReturnValueOnce('123')
        .mockReturnValueOnce('Updated Query')
        .mockReturnValueOnce('updated code');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce(mockUpdatedQuery);

      const result = await executeQueryOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockUpdatedQuery);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          url: expect.stringContaining('/queries/123'),
          body: expect.objectContaining({
            name: 'Updated Query',
            source: 'updated code'
          }),
        })
      );
    });
  });

  describe('deleteQuery', () => {
    it('should delete query successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('deleteQuery')
        .mockReturnValueOnce('123');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce({});

      const result = await executeQueryOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'DELETE',
          url: expect.stringContaining('/queries/123'),
        })
      );
    });
  });
});
});
