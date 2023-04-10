# Checkenv (not production ready!)

A .env variable checker, which checks the code to get all env keys used in project and validate it exists in the .env file.

Please require the library in root of the root (./src or /app).

Uses (In the root file of node.js project):

```js
require('node-check-env')(__dirname)
```
