"use strict";

const config = require("./config.js");
const axios = require("axios");
const fs = require("fs");
const os = require('os');
let jira;
let getlist = [];
let lresponse = [];
let iresponse = [];
let keys = [];
let rows = "";
let r = "";
var output = "";

process.on('unhandledRejection', (reason) => {
    console.log('Reason: ' + reason);
});

fs.mkdirSync('./content/projects', { recursive: true });
console.log('preparing the csv');
const ws = fs.createWriteStream('./content/projects/projects.csv');
console.log("Write header = Jira Project Key, Project Lead, Number of Issues");
ws.write("Jira Project Key, Project Lead, Number of Issues")

async function getProject(key) {
    var r = ""
    var lead = ""
    var issuecount = ""
    try {
        lresponse = await jira.get("/rest/api/2/project/" + key);
        lead = lresponse.data.lead.name
    } catch (err) {
        //console.log(err);
    }

    try {
        iresponse = await jira.get("/rest/api/2/search?jql=project=" + key + "&maxResults=0");
        issuecount = iresponse.data.total
    } catch (err) {
        //console.log(err);
    }

    try {
        r = r.concat(os.EOL, key, ",", lead, ",", issuecount)
        console.log(key, ",", lead, ",", issuecount);
        ws.write(r)
    } catch (err) {
        //console.log(err);
    }
    return r
};


async function getName(datakey) {

    // map through the project list
    const promises = datakey.map(function (i) {
        //console.log("this is part of the getName loop - " + i.key);
        r = getProject(i.key);
        keys.push(i.key);
        rows = rows + r;
        //console.log("these are the rows - " + rows);

    })
    return rows
};

async function main() {
    jira = axios.create({
        baseURL: config.baseurl,
        auth: {
            username: config.idir.username,
            password: config.idir.password
        }
    });


    getlist = jira.get("/rest/api/2/project", { params: { startAt: 0, maxResults: 1000, expand: "key" } })
        .then((response) => {
            output = getName(response.data)

        }).catch(function (error) {
            if (error.response) {
                // console.log(error.response.status);
            } else if (error.request) {
                //  console.log(error.request);
            } else {
                // console.log('Error', error.message);
            }
            //console.log(error.config);
        });
};

main()