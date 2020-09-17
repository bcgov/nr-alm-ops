'use strict';
/**
 * https://docs.atlassian.com/software/jira/docs/api/REST/8.10.0/
 * https://developer.atlassian.com/server/confluence/confluence-server-rest-api/
 */

const config = require('./config.js')
const fs = require('fs');
const path = require("path");
const axios = require('axios');
const outputFile = 'issues.xml';
const keychain = require('keychain');
let jira;
let confluence;

if (!config.idir.username){
  config.idir.username = require("os").userInfo().username
}

new Promise((resolve, reject)=>{
  if (!config.idir.password){
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
  confluence = axios.create({
    baseURL: "https://bwa.nrs.gov.bc.ca/int/confluence",
    auth: {
      username: config.idir.username,
      password: config.idir.password
    },
  });
})
.then(()=>{
  return jira.get('/rest/api/2/permissionscheme/11100', {params:{startAt:0, maxResults:100, expand:"permissions"}}).then((response)=>{
    const permissions = new Map()
    for (const grant of response.data.permissions) {
      const holders = permissions.get(grant.permission) || []
      holders.push(grant.holder)
      permissions.set(grant.permission, holders)
    }
    fs.mkdirSync('./content/permissionscheme', { recursive: true })
    const ws = fs.createWriteStream('./content/permissionscheme/11100.html', {encoding:'utf8'})
    ws.write(`<h1>Permissions</h1>\n`)
    ws.write(`<ac:structured-macro ac:name="details" ac:schema-version="1">\n`)
    ws.write(`  <ac:parameter ac:name="id">permissions</ac:parameter>\n`)
    ws.write(`  <ac:rich-text-body>\n`)
    ws.write(`    <table class="wrapped">\n`)
    ws.write(`      <colgroup><col /><col /></colgroup>\n`)
    ws.write(`      <tbody>\n`)
    for (const [key, holders] of permissions.entries()) {
      ws.write(`        <tr><th colspan="1"><p>${key}</p></th><td colspan="1">`)
      let firstHolder=true
      for (const holder of holders) {
        if (!firstHolder) ws.write(`, `)
        ws.write(`${holder.type}/${holder.parameter}`)
        firstHolder=false
      }
      ws.write(`</td></tr>\n`)
    }
    ws.write(`      </tbody>\n`)
    ws.write(`    </table>\n`)
    ws.write(`  </ac:rich-text-body>\n`)
    ws.end(`</ac:structured-macro>\n`)
    ws.close()
  })
})
.then(()=>{
  return new Promise((resolve, reject)=>{
    fs.readFile('./content/permissionscheme/11100.html', {encoding:'utf8'}, (err, data)=>{
        if (err) reject(err)
        resolve(data)
    })
  })
})
.then(async(value)=>{
  const page = (await confluence.get('/rest/api/content/75596435?expand=body.storage,version')).data
  const newPage = JSON.parse(JSON.stringify(page))
  newPage.version.number = page.version.number + 1
  newPage.body.storage.value = value
  //newPage.body = {storage:{value:value}}
  //console.log(`content:${value}`)
  return confluence.put('/rest/api/content/75596435', newPage, {headers:{'Content-Type':'application/json'}})
  /*
  curl -u admin:admin -X PUT -H 'Content-Type: application/json' -d '{"id":"3604482","type":"page",
  "title":"new page","space":{"key":"TST"},"body":{"storage":{"value":
  "<p>This is the updated text for the new page</p>","representation":"storage"}},
  "version":{"number":2}}' http://localhost:8080/confluence/rest/api/content/3604482 | python -mjson.tool
  */
}).catch(err => {
  console.log('error:')
  console.log(err)
})