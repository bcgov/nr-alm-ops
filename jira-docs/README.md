# Jira Docs
Export current jira configurations to Confluence


# How to run
1. Create a file called config.js with the following strucuture"
```
module.exports = {
  "idir": {
    "username": "",
    "password": ""
  }
}
```

2. Run script
```
npm ci # or npm install
node export-to-confluence.js
```