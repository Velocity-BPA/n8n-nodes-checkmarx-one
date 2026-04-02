# n8n-nodes-checkmarx-one

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node integrates with Checkmarx One application security testing platform, providing access to 6 core resources. Enable automated security scanning workflows, manage projects and applications, retrieve scan results, upload source code, and execute custom queries directly from your n8n automations.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Security](https://img.shields.io/badge/Security-SAST-green)
![Application Security](https://img.shields.io/badge/AppSec-Testing-orange)
![DevSecOps](https://img.shields.io/badge/DevSecOps-Automation-purple)

## Features

- **Project Management** - Create, update, delete, and retrieve security scanning projects with full lifecycle control
- **Automated Scanning** - Trigger SAST, DAST, and SCA scans programmatically with customizable scan configurations
- **Result Analysis** - Fetch detailed vulnerability findings, severity classifications, and remediation recommendations
- **Application Portfolio** - Manage application inventory, security policies, and compliance requirements
- **Source Code Upload** - Automated source code packaging and secure upload for static analysis scanning
- **Custom Queries** - Execute predefined and custom security queries for advanced vulnerability detection
- **Real-time Monitoring** - Track scan progress, status updates, and completion notifications
- **Compliance Reporting** - Generate security reports for compliance frameworks and audit requirements

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-checkmarx-one`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-checkmarx-one
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-checkmarx-one.git
cd n8n-nodes-checkmarx-one
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-checkmarx-one
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Checkmarx One API authentication key | Yes |
| Base URL | Checkmarx One instance URL (e.g., https://your-tenant.checkmarx.net) | Yes |
| Tenant | Your Checkmarx One tenant identifier | Yes |

## Resources & Operations

### 1. Project

| Operation | Description |
|-----------|-------------|
| Create | Create a new security scanning project with specified configurations |
| Get | Retrieve project details including settings, policies, and metadata |
| Get All | List all projects with filtering and pagination support |
| Update | Modify project settings, security policies, or team assignments |
| Delete | Remove a project and associated scan history |

### 2. Scan

| Operation | Description |
|-----------|-------------|
| Create | Initiate new security scan with customizable engine configurations |
| Get | Retrieve detailed scan information including progress and results summary |
| Get All | List scan history with filtering by project, status, or date range |
| Cancel | Stop running scans and update scan status |
| Get Status | Monitor real-time scan progress and execution phases |

### 3. Result

| Operation | Description |
|-----------|-------------|
| Get | Fetch detailed vulnerability findings for specific scans |
| Get All | Retrieve aggregated results across multiple scans with filtering |
| Get Summary | Generate executive summary reports with key metrics |
| Export | Download results in various formats (PDF, XML, JSON, CSV) |
| Update Status | Modify vulnerability status (confirmed, false positive, resolved) |

### 4. Application

| Operation | Description |
|-----------|-------------|
| Create | Register new applications in the security portfolio |
| Get | Retrieve application details including associated projects and policies |
| Get All | List application inventory with metadata and security status |
| Update | Modify application information, tags, and security classifications |
| Delete | Remove applications from the security portfolio |

### 5. Upload

| Operation | Description |
|-----------|-------------|
| Create | Upload source code archives or binaries for security analysis |
| Get Status | Monitor upload progress and validation status |
| Get Details | Retrieve upload metadata including file information and checksums |
| Cancel | Abort ongoing upload operations |

### 6. Query

| Operation | Description |
|-----------|-------------|
| Execute | Run predefined or custom security queries against scan results |
| Get | Retrieve query definitions and execution parameters |
| Get All | List available queries with descriptions and categories |
| Get Results | Fetch query execution results with detailed findings |

## Usage Examples

```javascript
// Create a new security project
const projectData = {
  "name": "E-commerce Platform",
  "description": "Main customer-facing application security scanning",
  "tags": ["production", "web-app", "pci-compliance"],
  "criticality": "high"
};
```

```javascript
// Initiate SAST scan with custom configuration
const scanConfig = {
  "projectId": "a7b3d2c1-4567-89ab-cdef-123456789012",
  "scanType": "sast",
  "incremental": false,
  "preset": "Checkmarx Default",
  "engineConfiguration": {
    "excludeFolders": "test,docs",
    "excludeFiles": "*.min.js"
  }
};
```

```javascript
// Retrieve high-severity vulnerabilities
const resultFilters = {
  "scanId": "scan-987654321",
  "severity": ["HIGH", "CRITICAL"],
  "state": "TO_VERIFY",
  "limit": 100,
  "offset": 0
};
```

```javascript
// Upload source code for analysis
const uploadConfig = {
  "projectId": "a7b3d2c1-4567-89ab-cdef-123456789012",
  "zipFile": "/path/to/source-code.zip",
  "branch": "main",
  "uploadUrl": "https://upload-endpoint.checkmarx.net"
};
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid or expired API key | Verify API key is correct and has not expired |
| 403 Forbidden | Insufficient permissions for operation | Check user roles and project access permissions |
| 404 Not Found | Project, scan, or resource does not exist | Verify resource IDs and check if resource was deleted |
| 429 Rate Limit | API rate limit exceeded | Implement exponential backoff and reduce request frequency |
| 500 Internal Error | Checkmarx One service unavailable | Check service status and retry after delay |
| 422 Validation Error | Invalid request parameters or data | Review API documentation and validate input parameters |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-checkmarx-one/issues)
- **Checkmarx One API Documentation**: [https://checkmarx.com/resource/documents/en/34965-68702-checkmarx-one-api-guide.html](https://checkmarx.com/resource/documents/en/34965-68702-checkmarx-one-api-guide.html)
- **Checkmarx Community**: [https://community.checkmarx.com/](https://community.checkmarx.com/)