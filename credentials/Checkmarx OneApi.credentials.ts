import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class CheckmarxOneApi implements ICredentialType {
  name = 'checkmarxOneApi';
  displayName = 'Checkmarx One API';
  documentationUrl = 'https://checkmarx.com/resource/documents/en/34965-68642-authentication.html';
  properties: INodeProperties[] = [
    {
      displayName: 'Tenant',
      name: 'tenant',
      type: 'string',
      default: '',
      required: true,
      description: 'Your Checkmarx One tenant identifier',
    },
    {
      displayName: 'Client ID',
      name: 'clientId',
      type: 'string',
      default: '',
      required: true,
      description: 'OAuth 2.0 Client ID from Checkmarx One portal',
    },
    {
      displayName: 'Client Secret',
      name: 'clientSecret',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      description: 'OAuth 2.0 Client Secret from Checkmarx One portal',
    },
    {
      displayName: 'API Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://ast.checkmarx.net/api',
      required: true,
      description: 'Base URL for Checkmarx One API endpoints',
    },
    {
      displayName: 'IAM Base URL',
      name: 'iamBaseUrl',
      type: 'string',
      default: 'https://iam.checkmarx.net',
      required: true,
      description: 'Base URL for Checkmarx One Identity and Access Management',
    },
  ];
}