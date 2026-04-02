/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-checkmarxone/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class CheckmarxOne implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Checkmarx One',
    name: 'checkmarxone',
    icon: 'file:checkmarxone.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Checkmarx One API',
    defaults: {
      name: 'Checkmarx One',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'checkmarxoneApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Project',
            value: 'project',
          },
          {
            name: 'Scan',
            value: 'scan',
          },
          {
            name: 'Result',
            value: 'result',
          },
          {
            name: 'Application',
            value: 'application',
          },
          {
            name: 'Upload',
            value: 'upload',
          },
          {
            name: 'Query',
            value: 'query',
          }
        ],
        default: 'project',
      },
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['project'] } },
	options: [
		{
			name: 'Get Projects',
			value: 'getProjects',
			description: 'Retrieve all projects',
			action: 'Get all projects',
		},
		{
			name: 'Get Project',
			value: 'getProject',
			description: 'Get specific project details',
			action: 'Get a project',
		},
		{
			name: 'Create Project',
			value: 'createProject',
			description: 'Create a new project',
			action: 'Create a project',
		},
		{
			name: 'Update Project',
			value: 'updateProject',
			description: 'Update project configuration',
			action: 'Update a project',
		},
		{
			name: 'Delete Project',
			value: 'deleteProject',
			description: 'Delete a project',
			action: 'Delete a project',
		},
	],
	default: 'getProjects',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['scan'],
		},
	},
	options: [
		{
			name: 'Get Scans',
			value: 'getScans',
			description: 'Retrieve scan history',
			action: 'Get scans',
		},
		{
			name: 'Get Scan',
			value: 'getScan',
			description: 'Get specific scan details',
			action: 'Get scan',
		},
		{
			name: 'Create Scan',
			value: 'createScan',
			description: 'Initiate a new security scan',
			action: 'Create scan',
		},
		{
			name: 'Delete Scan',
			value: 'deleteScan',
			description: 'Cancel or delete a scan',
			action: 'Delete scan',
		},
		{
			name: 'Get Scan Results',
			value: 'getScanResults',
			description: 'Get scan results',
			action: 'Get scan results',
		},
		{
			name: 'Get Scan Logs',
			value: 'getScanLogs',
			description: 'Get scan execution logs',
			action: 'Get scan logs',
		},
	],
	default: 'getScans',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['result'] } },
  options: [
    { name: 'Get Results', value: 'getResults', description: 'Retrieve vulnerability results', action: 'Get vulnerability results' },
    { name: 'Get Result', value: 'getResult', description: 'Get specific result details', action: 'Get specific result details' },
    { name: 'Update Result', value: 'updateResult', description: 'Update result state or comments', action: 'Update result state or comments' },
    { name: 'Create Predicate', value: 'createPredicate', description: 'Create result predicate/rule', action: 'Create result predicate/rule' }
  ],
  default: 'getResults',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['application'] } },
	options: [
		{ name: 'Get Applications', value: 'getApplications', description: 'Retrieve all applications', action: 'Get all applications' },
		{ name: 'Get Application', value: 'getApplication', description: 'Get specific application by ID', action: 'Get an application' },
		{ name: 'Create Application', value: 'createApplication', description: 'Create a new application', action: 'Create an application' },
		{ name: 'Update Application', value: 'updateApplication', description: 'Update application details', action: 'Update an application' },
		{ name: 'Delete Application', value: 'deleteApplication', description: 'Delete an application', action: 'Delete an application' },
	],
	default: 'getApplications',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['upload'],
		},
	},
	options: [
		{
			name: 'Create Upload',
			value: 'createUpload',
			description: 'Upload source code or files for scanning',
			action: 'Create an upload',
		},
		{
			name: 'Get Upload',
			value: 'getUpload',
			description: 'Get upload status and details',
			action: 'Get an upload',
		},
	],
	default: 'createUpload',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['query'] } },
  options: [
    { name: 'Get Queries', value: 'getQueries', description: 'Retrieve available queries', action: 'Get queries' },
    { name: 'Get Query', value: 'getQuery', description: 'Get specific query details', action: 'Get a query' },
    { name: 'Create Query', value: 'createQuery', description: 'Create custom query', action: 'Create a query' },
    { name: 'Update Query', value: 'updateQuery', description: 'Update existing query', action: 'Update a query' },
    { name: 'Delete Query', value: 'deleteQuery', description: 'Delete a query', action: 'Delete a query' }
  ],
  default: 'getQueries',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	default: 100,
	description: 'Maximum number of projects to retrieve',
	displayOptions: {
		show: {
			resource: ['project'],
			operation: ['getProjects'],
		},
	},
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	default: 0,
	description: 'Number of projects to skip',
	displayOptions: {
		show: {
			resource: ['project'],
			operation: ['getProjects'],
		},
	},
},
{
	displayName: 'Project ID',
	name: 'projectId',
	type: 'string',
	required: true,
	default: '',
	description: 'The ID of the project',
	displayOptions: {
		show: {
			resource: ['project'],
			operation: ['getProject', 'updateProject', 'deleteProject'],
		},
	},
},
{
	displayName: 'Name',
	name: 'name',
	type: 'string',
	required: true,
	default: '',
	description: 'The name of the project',
	displayOptions: {
		show: {
			resource: ['project'],
			operation: ['createProject', 'updateProject'],
		},
	},
},
{
	displayName: 'Groups',
	name: 'groups',
	type: 'fixedCollection',
	default: {},
	typeOptions: {
		multipleValues: true,
	},
	description: 'Groups associated with the project',
	displayOptions: {
		show: {
			resource: ['project'],
			operation: ['createProject', 'updateProject'],
		},
	},
	options: [
		{
			name: 'group',
			displayName: 'Group',
			values: [
				{
					displayName: 'Group ID',
					name: 'id',
					type: 'string',
					default: '',
					description: 'The ID of the group',
				},
			],
		},
	],
},
{
	displayName: 'Tags',
	name: 'tags',
	type: 'fixedCollection',
	default: {},
	typeOptions: {
		multipleValues: true,
	},
	description: 'Tags associated with the project',
	displayOptions: {
		show: {
			resource: ['project'],
			operation: ['createProject', 'updateProject'],
		},
	},
	options: [
		{
			name: 'tag',
			displayName: 'Tag',
			values: [
				{
					displayName: 'Key',
					name: 'key',
					type: 'string',
					default: '',
					description: 'The tag key',
				},
				{
					displayName: 'Value',
					name: 'value',
					type: 'string',
					default: '',
					description: 'The tag value',
				},
			],
		},
	],
},
{
	displayName: 'Project ID',
	name: 'projectId',
	type: 'string',
	required: false,
	default: '',
	displayOptions: {
		show: {
			resource: ['scan'],
			operation: ['getScans'],
		},
	},
	description: 'Project ID to filter scans',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	required: false,
	default: 20,
	displayOptions: {
		show: {
			resource: ['scan'],
			operation: ['getScans'],
		},
	},
	description: 'Number of scans to retrieve',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	required: false,
	default: 0,
	displayOptions: {
		show: {
			resource: ['scan'],
			operation: ['getScans'],
		},
	},
	description: 'Number of scans to skip',
},
{
	displayName: 'Sort',
	name: 'sort',
	type: 'string',
	required: false,
	default: '',
	displayOptions: {
		show: {
			resource: ['scan'],
			operation: ['getScans'],
		},
	},
	description: 'Sort criteria for scans',
},
{
	displayName: 'Scan ID',
	name: 'scanId',
	type: 'string',
	required: true,
	default: '',
	displayOptions: {
		show: {
			resource: ['scan'],
			operation: ['getScan', 'deleteScan', 'getScanResults', 'getScanLogs'],
		},
	},
	description: 'ID of the scan',
},
{
	displayName: 'Project',
	name: 'project',
	type: 'string',
	required: true,
	default: '',
	displayOptions: {
		show: {
			resource: ['scan'],
			operation: ['createScan'],
		},
	},
	description: 'Project identifier for the scan',
},
{
	displayName: 'Scan Type',
	name: 'type',
	type: 'options',
	required: true,
	default: 'sast',
	displayOptions: {
		show: {
			resource: ['scan'],
			operation: ['createScan'],
		},
	},
	options: [
		{
			name: 'SAST',
			value: 'sast',
		},
		{
			name: 'SCA',
			value: 'sca',
		},
		{
			name: 'KICS',
			value: 'kics',
		},
		{
			name: 'API Security',
			value: 'api-security',
		},
	],
	description: 'Type of security scan to perform',
},
{
	displayName: 'Configuration',
	name: 'config',
	type: 'json',
	required: false,
	default: '{}',
	displayOptions: {
		show: {
			resource: ['scan'],
			operation: ['createScan'],
		},
	},
	description: 'Scan configuration parameters as JSON',
},
{
	displayName: 'Handler',
	name: 'handler',
	type: 'string',
	required: false,
	default: '',
	displayOptions: {
		show: {
			resource: ['scan'],
			operation: ['createScan'],
		},
	},
	description: 'Handler configuration for the scan',
},
{
  displayName: 'Scan ID',
  name: 'scanId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['result'], operation: ['getResults'] } },
  default: '',
  description: 'The scan ID to retrieve results for',
},
{
  displayName: 'Severity',
  name: 'severity',
  type: 'options',
  displayOptions: { show: { resource: ['result'], operation: ['getResults'] } },
  options: [
    { name: 'Critical', value: 'CRITICAL' },
    { name: 'High', value: 'HIGH' },
    { name: 'Medium', value: 'MEDIUM' },
    { name: 'Low', value: 'LOW' },
    { name: 'Info', value: 'INFO' }
  ],
  default: '',
  description: 'Filter results by severity level',
},
{
  displayName: 'State',
  name: 'state',
  type: 'options',
  displayOptions: { show: { resource: ['result'], operation: ['getResults'] } },
  options: [
    { name: 'To Verify', value: 'TO_VERIFY' },
    { name: 'Not Exploitable', value: 'NOT_EXPLOITABLE' },
    { name: 'Confirmed', value: 'CONFIRMED' },
    { name: 'Urgent', value: 'URGENT' },
    { name: 'Proposed Not Exploitable', value: 'PROPOSED_NOT_EXPLOITABLE' }
  ],
  default: '',
  description: 'Filter results by state',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['result'], operation: ['getResults'] } },
  default: 100,
  description: 'Maximum number of results to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: { show: { resource: ['result'], operation: ['getResults'] } },
  default: 0,
  description: 'Number of results to skip',
},
{
  displayName: 'Result ID',
  name: 'resultId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['result'], operation: ['getResult', 'updateResult'] } },
  default: '',
  description: 'The ID of the specific result',
},
{
  displayName: 'State',
  name: 'state',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['result'], operation: ['updateResult'] } },
  options: [
    { name: 'To Verify', value: 'TO_VERIFY' },
    { name: 'Not Exploitable', value: 'NOT_EXPLOITABLE' },
    { name: 'Confirmed', value: 'CONFIRMED' },
    { name: 'Urgent', value: 'URGENT' },
    { name: 'Proposed Not Exploitable', value: 'PROPOSED_NOT_EXPLOITABLE' }
  ],
  default: 'TO_VERIFY',
  description: 'The new state for the result',
},
{
  displayName: 'Comment',
  name: 'comment',
  type: 'string',
  displayOptions: { show: { resource: ['result'], operation: ['updateResult'] } },
  default: '',
  description: 'Optional comment for the result update',
},
{
  displayName: 'Similarity ID',
  name: 'similarityId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['result'], operation: ['createPredicate'] } },
  default: '',
  description: 'The similarity ID for the predicate',
},
{
  displayName: 'Project ID',
  name: 'projectId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['result'], operation: ['createPredicate'] } },
  default: '',
  description: 'The project ID for the predicate',
},
{
  displayName: 'Predicate State',
  name: 'predicateState',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['result'], operation: ['createPredicate'] } },
  options: [
    { name: 'To Verify', value: 'TO_VERIFY' },
    { name: 'Not Exploitable', value: 'NOT_EXPLOITABLE' },
    { name: 'Confirmed', value: 'CONFIRMED' },
    { name: 'Urgent', value: 'URGENT' },
    { name: 'Proposed Not Exploitable', value: 'PROPOSED_NOT_EXPLOITABLE' }
  ],
  default: 'TO_VERIFY',
  description: 'The state for the predicate',
},
{
	displayName: 'Application ID',
	name: 'applicationId',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['application'], operation: ['getApplication'] } },
	default: '',
	description: 'The ID of the application to retrieve',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: { show: { resource: ['application'], operation: ['getApplications'] } },
	default: 100,
	description: 'Maximum number of applications to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	displayOptions: { show: { resource: ['application'], operation: ['getApplications'] } },
	default: 0,
	description: 'Number of applications to skip',
},
{
	displayName: 'Application ID',
	name: 'applicationId',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['application'], operation: ['updateApplication'] } },
	default: '',
	description: 'The ID of the application to update',
},
{
	displayName: 'Application ID',
	name: 'applicationId',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['application'], operation: ['deleteApplication'] } },
	default: '',
	description: 'The ID of the application to delete',
},
{
	displayName: 'Name',
	name: 'name',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['application'], operation: ['createApplication', 'updateApplication'] } },
	default: '',
	description: 'The name of the application',
},
{
	displayName: 'Description',
	name: 'description',
	type: 'string',
	displayOptions: { show: { resource: ['application'], operation: ['createApplication', 'updateApplication'] } },
	default: '',
	description: 'The description of the application',
},
{
	displayName: 'Tags',
	name: 'tags',
	type: 'fixedCollection',
	typeOptions: {
		multipleValues: true,
	},
	displayOptions: { show: { resource: ['application'], operation: ['createApplication', 'updateApplication'] } },
	default: {},
	placeholder: 'Add Tag',
	options: [
		{
			name: 'tag',
			displayName: 'Tag',
			values: [
				{
					displayName: 'Key',
					name: 'key',
					type: 'string',
					default: '',
				},
				{
					displayName: 'Value',
					name: 'value',
					type: 'string',
					default: '',
				},
			],
		},
	],
},
{
	displayName: 'File',
	name: 'file',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['upload'],
			operation: ['createUpload'],
		},
	},
	default: '',
	description: 'The file to upload (use binary data or file path)',
	required: true,
},
{
	displayName: 'Project ID',
	name: 'projectId',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['upload'],
			operation: ['createUpload'],
		},
	},
	default: '',
	description: 'The project ID to upload files for',
	required: true,
},
{
	displayName: 'Upload Method',
	name: 'uploadMethod',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['upload'],
			operation: ['createUpload'],
		},
	},
	options: [
		{
			name: 'File Path',
			value: 'filePath',
		},
		{
			name: 'Binary Data',
			value: 'binaryData',
		},
	],
	default: 'filePath',
	description: 'Method to specify the file to upload',
},
{
	displayName: 'Binary Property',
	name: 'binaryPropertyName',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['upload'],
			operation: ['createUpload'],
			uploadMethod: ['binaryData'],
		},
	},
	default: 'data',
	description: 'Name of the binary property containing the file data',
	required: true,
},
{
	displayName: 'Upload ID',
	name: 'uploadId',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['upload'],
			operation: ['getUpload'],
		},
	},
	default: '',
	description: 'The ID of the upload to retrieve',
	required: true,
},
{
  displayName: 'Query ID',
  name: 'queryId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['query'],
      operation: ['getQuery', 'updateQuery', 'deleteQuery']
    }
  },
  default: '',
  description: 'The ID of the query',
},
{
  displayName: 'Group',
  name: 'group',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['query'],
      operation: ['getQueries', 'createQuery']
    }
  },
  default: '',
  description: 'Filter queries by group or specify group for new query',
},
{
  displayName: 'Language',
  name: 'language',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['query'],
      operation: ['getQueries', 'createQuery']
    }
  },
  default: '',
  description: 'Filter queries by programming language or specify language for new query',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['query'],
      operation: ['getQueries']
    }
  },
  default: 100,
  description: 'Maximum number of queries to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['query'],
      operation: ['getQueries']
    }
  },
  default: 0,
  description: 'Number of queries to skip for pagination',
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['query'],
      operation: ['createQuery', 'updateQuery']
    }
  },
  default: '',
  description: 'Name of the query',
},
{
  displayName: 'Source',
  name: 'source',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['query'],
      operation: ['createQuery', 'updateQuery']
    }
  },
  default: '',
  typeOptions: {
    rows: 10,
  },
  description: 'Source code of the query',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'project':
        return [await executeProjectOperations.call(this, items)];
      case 'scan':
        return [await executeScanOperations.call(this, items)];
      case 'result':
        return [await executeResultOperations.call(this, items)];
      case 'application':
        return [await executeApplicationOperations.call(this, items)];
      case 'upload':
        return [await executeUploadOperations.call(this, items)];
      case 'query':
        return [await executeQueryOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeProjectOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('checkmarxoneApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getProjects': {
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;
					
					const options: IRequestOptions = {
						method: 'GET',
						url: `${credentials.baseUrl}/projects`,
						qs: {
							limit,
							offset,
						},
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getProject': {
					const projectId = this.getNodeParameter('projectId', i) as string;
					
					const options: IRequestOptions = {
						method: 'GET',
						url: `${credentials.baseUrl}/projects/${projectId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createProject': {
					const name = this.getNodeParameter('name', i) as string;
					const groups = this.getNodeParameter('groups', i) as any;
					const tags = this.getNodeParameter('tags', i) as any;
					
					const body: any = {
						name,
					};

					if (groups && groups.group) {
						body.groups = groups.group.map((group: any) => ({ id: group.id }));
					}

					if (tags && tags.tag) {
						body.tags = tags.tag.reduce((tagObj: any, tag: any) => {
							tagObj[tag.key] = tag.value;
							return tagObj;
						}, {});
					}
					
					const options: IRequestOptions = {
						method: 'POST',
						url: `${credentials.baseUrl}/projects`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};
					
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateProject': {
					const projectId = this.getNodeParameter('projectId', i) as string;
					const name = this.getNodeParameter('name', i) as string;
					const groups = this.getNodeParameter('groups', i) as any;
					const tags = this.getNodeParameter('tags', i) as any;
					
					const body: any = {
						name,
					};

					if (groups && groups.group) {
						body.groups = groups.group.map((group: any) => ({ id: group.id }));
					}

					if (tags && tags.tag) {
						body.tags = tags.tag.reduce((tagObj: any, tag: any) => {
							tagObj[tag.key] = tag.value;
							return tagObj;
						}, {});
					}
					
					const options: IRequestOptions = {
						method: 'PUT',
						url: `${credentials.baseUrl}/projects/${projectId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};
					
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteProject': {
					const projectId = this.getNodeParameter('projectId', i) as string;
					
					const options: IRequestOptions = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/projects/${projectId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeScanOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('checkmarxoneApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			const baseOptions = {
				headers: {
					'Authorization': `Bearer ${credentials.accessToken}`,
					'Content-Type': 'application/json',
				},
				json: true,
			};

			switch (operation) {
				case 'getScans': {
					const projectId = this.getNodeParameter('projectId', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;
					const sort = this.getNodeParameter('sort', i) as string;

					const queryParams: string[] = [];
					if (projectId) queryParams.push(`project-id=${encodeURIComponent(projectId)}`);
					if (limit) queryParams.push(`limit=${limit}`);
					if (offset) queryParams.push(`offset=${offset}`);
					if (sort) queryParams.push(`sort=${encodeURIComponent(sort)}`);

					const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

					const options = {
						...baseOptions,
						method: 'GET',
						url: `${credentials.baseUrl}/scans${queryString}`,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getScan': {
					const scanId = this.getNodeParameter('scanId', i) as string;

					const options = {
						...baseOptions,
						method: 'GET',
						url: `${credentials.baseUrl}/scans/${scanId}`,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createScan': {
					const project = this.getNodeParameter('project', i) as string;
					const type = this.getNodeParameter('type', i) as string;
					const configInput = this.getNodeParameter('config', i) as string;
					const handler = this.getNodeParameter('handler', i) as string;

					let config: any = {};
					if (configInput) {
						try {
							config = JSON.parse(configInput);
						} catch (error: any) {
							throw new NodeOperationError(this.getNode(), `Invalid JSON in config: ${error.message}`);
						}
					}

					const body: any = {
						project,
						type,
						config,
					};

					if (handler) {
						body.handler = handler;
					}

					const options = {
						...baseOptions,
						method: 'POST',
						url: `${credentials.baseUrl}/scans`,
						body,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteScan': {
					const scanId = this.getNodeParameter('scanId', i) as string;

					const options = {
						...baseOptions,
						method: 'DELETE',
						url: `${credentials.baseUrl}/scans/${scanId}`,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getScanResults': {
					const scanId = this.getNodeParameter('scanId', i) as string;

					const options = {
						...baseOptions,
						method: 'GET',
						url: `${credentials.baseUrl}/scans/${scanId}/results`,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getScanLogs': {
					const scanId = this.getNodeParameter('scanId', i) as string;

					const options = {
						...baseOptions,
						method: 'GET',
						url: `${credentials.baseUrl}/scans/${scanId}/logs`,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeResultOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('checkmarxoneApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getResults': {
          const scanId = this.getNodeParameter('scanId', i) as string;
          const severity = this.getNodeParameter('severity', i) as string;
          const state = this.getNodeParameter('state', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const queryParams = new URLSearchParams();
          queryParams.append('scan-id', scanId);
          if (severity) queryParams.append('severity', severity);
          if (state) queryParams.append('state', state);
          queryParams.append('limit', limit.toString());
          queryParams.append('offset', offset.toString());

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/results?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getResult': {
          const resultId = this.getNodeParameter('resultId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/results/${resultId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Accept': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateResult': {
          const resultId = this.getNodeParameter('resultId', i) as string;
          const state = this.getNodeParameter('state', i) as string;
          const comment = this.getNodeParameter('comment', i) as string;

          const body: any = {
            state,
          };

          if (comment) {
            body.comment = comment;
          }

          const options: any = {
            method: 'PATCH',
            url: `${credentials.baseUrl}/results/${resultId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createPredicate': {
          const similarityId = this.getNodeParameter('similarityId', i) as string;
          const projectId = this.getNodeParameter('projectId', i) as string;
          const predicateState = this.getNodeParameter('predicateState', i) as string;

          const body: any = {
            'similarity-id': similarityId,
            'project-id': projectId,
            state: predicateState,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/results/predicates`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeApplicationOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('checkmarxoneApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getApplications': {
					const limit = this.getNodeParameter('limit', i, 100) as number;
					const offset = this.getNodeParameter('offset', i, 0) as number;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/applications`,
						qs: {
							limit,
							offset,
						},
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getApplication': {
					const applicationId = this.getNodeParameter('applicationId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/applications/${applicationId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createApplication': {
					const name = this.getNodeParameter('name', i) as string;
					const description = this.getNodeParameter('description', i, '') as string;
					const tagsData = this.getNodeParameter('tags', i, {}) as any;

					const body: any = {
						name,
					};

					if (description) {
						body.description = description;
					}

					if (tagsData.tag && tagsData.tag.length > 0) {
						body.tags = {};
						for (const tag of tagsData.tag) {
							if (tag.key && tag.value) {
								body.tags[tag.key] = tag.value;
							}
						}
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/applications`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateApplication': {
					const applicationId = this.getNodeParameter('applicationId', i) as string;
					const name = this.getNodeParameter('name', i) as string;
					const description = this.getNodeParameter('description', i, '') as string;
					const tagsData = this.getNodeParameter('tags', i, {}) as any;

					const body: any = {
						name,
					};

					if (description) {
						body.description = description;
					}

					if (tagsData.tag && tagsData.tag.length > 0) {
						body.tags = {};
						for (const tag of tagsData.tag) {
							if (tag.key && tag.value) {
								body.tags[tag.key] = tag.value;
							}
						}
					}

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/applications/${applicationId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteApplication': {
					const applicationId = this.getNodeParameter('applicationId', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/applications/${applicationId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeUploadOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('checkmarxoneApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'createUpload': {
					const projectId = this.getNodeParameter('projectId', i) as string;
					const uploadMethod = this.getNodeParameter('uploadMethod', i) as string;

					let formData: any = {
						'project-id': projectId,
					};

					if (uploadMethod === 'binaryData') {
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						const binaryData = items[i].binary?.[binaryPropertyName];
						
						if (!binaryData) {
							throw new NodeOperationError(this.getNode(), `Binary data property '${binaryPropertyName}' not found`);
						}

						formData.file = {
							value: Buffer.from(binaryData.data, 'base64'),
							options: {
								filename: binaryData.fileName || 'upload.zip',
								contentType: binaryData.mimeType || 'application/zip',
							},
						};
					} else {
						const filePath = this.getNodeParameter('file', i) as string;
						const fs = require('fs');
						
						if (!fs.existsSync(filePath)) {
							throw new NodeOperationError(this.getNode(), `File not found: ${filePath}`);
						}

						formData.file = fs.createReadStream(filePath);
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/uploads`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
						},
						formData: formData,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getUpload': {
					const uploadId = this.getNodeParameter('uploadId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/uploads/${uploadId}`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeQueryOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('checkmarxoneApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getQueries': {
          const group = this.getNodeParameter('group', i) as string;
          const language = this.getNodeParameter('language', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const queryParams = new URLSearchParams();
          if (group) queryParams.append('group', group);
          if (language) queryParams.append('language', language);
          if (limit) queryParams.append('limit', limit.toString());
          if (offset) queryParams.append('offset', offset.toString());

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/queries${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getQuery': {
          const queryId = this.getNodeParameter('queryId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/queries/${queryId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createQuery': {
          const name = this.getNodeParameter('name', i) as string;
          const group = this.getNodeParameter('group', i) as string;
          const language = this.getNodeParameter('language', i) as string;
          const source = this.getNodeParameter('source', i) as string;

          const body: any = {
            name,
            source,
          };

          if (group) body.group = group;
          if (language) body.language = language;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/queries`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateQuery': {
          const queryId = this.getNodeParameter('queryId', i) as string;
          const name = this.getNodeParameter('name', i) as string;
          const source = this.getNodeParameter('source', i) as string;

          const body: any = {
            name,
            source,
          };

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/queries/${queryId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteQuery': {
          const queryId = this.getNodeParameter('queryId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/queries/${queryId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}
