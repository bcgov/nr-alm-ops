# How to run

In this directory:

`docker-compose build`

Note: You will need to rebuild the composed image for each release of NRDK

To use NRDK (any directory)

`docker run --rm nrdk npx @bcgov/nrdk`

This command can be shortened to `nrdk` by using an alias.

```
function nrdk-DockerRun { docker run --rm nrdk npx @bcgov/nrdk $args }
New-Alias -Name nrdk-docker -Value nrdk-DockerRun -Force -Option AllScope
```

You can then run: `nrdk-docker`

## TODO

Volume for oc login
