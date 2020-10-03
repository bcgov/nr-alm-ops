
# Loading Dataset
## Download Dataset
```
curl --compressed -o dataset.csv 'https://pub.data.gov.bc.ca/datasets/f9566991-eb97-49a9-a587-5f0725024985/Job%20Openings%20(Expansion%20-Replacement)%20by%20Industry%20and%20Occupation%20for%20BC%20and%20Regions.csv'
```
## Loading data
Use SQLDeveloper (or some other tool) to import the csv file into a table called `dataset`.

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

# Running locally using docker
```
rm -rf output/*
docker run --env-file .env -v ${PWD}/output:/src/output jmeter-oracle-cursor:latest
```

## Pushing image to OpenShift Regisry
```
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

# Delete any existing pod of the same name
oc -n csnr-devops-lab-tools delete pod/jmeter-oradb --ignore-not-found=true

# Run JMeter test
oc -n csnr-devops-lab-tools run jmeter-oradb --image=dummy --restart=Never "--overrides=$(<pod.run.json)"
```