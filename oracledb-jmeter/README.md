# Loading Dataset
## Download Dataset
```
curl --compressed -o dataset.csv 'https://pub.data.gov.bc.ca/datasets/f9566991-eb97-49a9-a587-5f0725024985/Job%20Openings%20(Expansion%20-Replacement)%20by%20Industry%20and%20Occupation%20for%20BC%20and%20Regions.csv'
```
## Loading data
Use SQLDeveloper (or some other tool) to import the csv file into a table called `dataset`.


## .env file for TCPS connections.
```
JDBC Url should be of the following format - 
jdbc:oracle:thin:@tcps://<dbhosst>:1543/<servicename>?TNS_ADMIN=/src/wallet```


# Running JMeter GUI
```
# see .env.sample for the required keys
export $(<.env)
export SRC_DIR=${PWD}
jmeter -Juser.classpath=${PWD}/ojdbc8-19.7.0.0.jar -t oracle-cursor.jmx
```
# Building image locally using Docker
```
docker build -t jmeter-oracle-cursor:latest --squash .
```

# Running locally using docker with encrypted connection to database.
```
#Create a local folder called wallet and add ojdbc.properties and truststore.p12 to it

rm -rf output/*
docker run --env-file .env -v ${PWD}/output:/src/output -v ${PWD}/wallet: /src/wallet jmeter-oracle-cursor:latest
```


## Pushing image to OpenShift Regisry. 
```
#Please note that all references to csnr-devops-lab-tools in the commands 
#need to be replaced with the namespace that the image is being run on. e.g perri-tools

docker tag jmeter-oracle-cursor:latest docker-registry.pathfinder.gov.bc.ca/csnr-devops-lab-tools/jmeter-oracle-cursor:latest

docker push docker-registry.pathfinder.gov.bc.ca/csnr-devops-lab-tools/jmeter-oracle-cursor:latest
```

# Running in OpenShift
```
# Create a PVC called jmeter-oradb-output
# oc -n csnr-devops-lab-tools get pvc/jmeter-oradb-output -o yaml
oc -n csnr-devops-lab-tools create -f pvc.yaml

# Create a SECRET called jmeter-oradb-info
# see .env.sample for the required keys
# oc -n csnr-devops-lab-tools delete secret/jmeter-oradb-info
oc -n csnr-devops-lab-tools create secret generic jmeter-oradb-info --from-env-file=.env

# If using an encrypted connection , then Create a corresponding secret to mount the trust store certificate from your local #workstation
oc create secret generic jmeter-oradb-wallet --from-file=ojdbc.properties=<path to file on local workstation> --from-file=truststore.p12=<path to file on local workstation>

# Delete any existing pod of the same name
oc -n csnr-devops-lab-tools delete pod/jmeter-oradb --ignore-not-found=true

# Run JMeter test
oc -n csnr-devops-lab-tools run jmeter-oradb --image=dummy --restart=Never "--overrides=$(<pod.run.json)"
```