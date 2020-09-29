# How to run

## Build Container

In this directory:

`docker-compose build`

**Note:** You will need to rebuild the container image for each release of NRDK as this caches it locally for speed.

## Create Volume

A volume is necessary to save the OpenShift configuration data for login.

`docker volume create kube-data`


## Run Container

This is the command. Don't worry. You won't need to type this all in.

`docker run --rm -u node -w /home/node/app -v ${PWD}:/home/node/app -v kube-data:/home/node/.kube nrdk npx @bcgov/nrdk`

Let's shorten that command by making an alias. Open Windows PowerShell and run the following:

```
function docker-nrdk-fn { docker run --rm -u node -w /home/node/app -v ${PWD}:/home/node/app -v kube-data:/home/node/.kube nrdk npx @bcgov/nrdk $args }
New-Alias -Name nrdk -Value docker-nrdk-fn -Force -Option AllScope
```

You can now run: `nrdk`

You will probably also want to alias the oc command as well.

```
function docker-oc-fn { docker run --rm -u node -w /home/node/app -v ${PWD}:/home/node/app -v kube-data:/home/node/.kube nrdk oc $args }
New-Alias -Name oc -Value docker-oc-fn -Force -Option AllScope
```

**Tip:** To avoid having to run the above commands for each new session, create a PowerShell __script module__ and __profile file__. See the "samples" directory for a sample script module and profile file. Note that the module's directory must be in a path specified in `$env:PSModulePath`. Check the `$PROFILE` variable to find the location of your PowerShell profile. You can learn more about PowerShell script modules and profile files here:

https://docs.microsoft.com/en-us/powershell/scripting/developer/module/how-to-write-a-powershell-script-module?view=powershell-7
https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_profiles?view=powershell-7


## TODO

Volume for oc login
