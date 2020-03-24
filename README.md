# Twitch Github Projects - Azure Serverless Functions Backend

## Commands
- npm start

## Getting Started Developing

Make sure login to azure
```bash
az login
```

Download function configuration from production
```bash
func azure functionapp fetch twitch-github-projects
```

Upload new function configurations from local version
```bash
func azure functionapp publish  twitch-github-projects --publish-settings-only
```

Now you can start up application with all correct credentials
```bash
npm start
```

### Troubleshooting
If you come across OPTION request issues. That means the CORS configuation in localhost is all jacked up. This can be fixed by telling azure functions to honors CORS requests from any origin.
```json
//local.settings.json
"Host": {
  "CORS": "*"
}
```
