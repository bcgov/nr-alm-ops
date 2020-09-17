'use strict';
/**
 * https://docs.atlassian.com/software/jira/docs/api/REST/8.10.0/
 */

const config = require('./config.js')
const fs = require('fs');
const axios = require('axios');
const outputFile = 'issues.xml';
let jira;

if (!config.idir.username){
  config.idir.username = require("os").userInfo().username
}

new Promise((resolve, reject)=>{
  if (!config.idir.password){
    const keychain = require('keychain');
    keychain.getPassword({ account: config.idir.username, service: 'idir.bcgov' }, function(err, pass) {
      if(err){
        reject(err)
      }
      config.idir.password = pass
      resolve(true)
    })
  }
})
.then(()=>{
  jira = axios.create({
    baseURL: "https://bwa.nrs.gov.bc.ca/int/jira",
    auth: {
      username: config.idir.username,
      password: config.idir.password
    },
  });
})
.then(()=>{
  return jira.get('/rest/api/2/permissionscheme/11100', {params:{startAt:0, maxResults:100, expand:"permissions"}}).then((response)=>{
    fs.mkdirSync('./content/permissionscheme', { recursive: true })
    const ws = fs.createWriteStream('./content/permissionscheme/11100.json')
    ws.end(JSON.stringify(response.data, 2))
  })
})
.then(()=>{
  return jira.get('/rest/api/2/role', {params:{startAt:0, maxResults:100, expand:"permissions"}}).then((response)=>{
    fs.mkdirSync('./content', { recursive: true })
    const ws = fs.createWriteStream('./content/role.json')
    ws.end(JSON.stringify(response.data, 2))
  })
})