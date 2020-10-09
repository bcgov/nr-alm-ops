
# Building
```
oc new-build test-oracle-tls-python

oc new-app https://github.com/bcgov/nr-alm-ops.git#test-oracle-tls-python --context-dir=oracle-instant-client-with-tls --name=oracle-tls-conn
```

# Create Secrets
* Run script for downloading TLS certificated and create wallets
```
./create-wallets.sh
```
* Import the oracle wallet files as a secret
```
oc create secret generic oracle-tls-conn-wallet --from-file=contrib/.wallets/.all
```
* create secret with database credentials
```
# create a file called `contrib/src/.env`. see `contrib/src/.env.sample`
oc create secret generic oracle-tls-conn-cred --from-env-file=contrib/src/.env
```

# Attach secrets to deployment
```
oc rollout pause dc/oracle-tls-conn
oc set env --from=secret/oracle-tls-conn-cred dc/oracle-tls-conn
oc set volume dc/oracle-tls-conn --add --name=wallet --type=secret --secret-name=oracle-tls-conn-wallet --mount-path=/wallet
oc rollout resume dc/oracle-tls-conn
```

# Running locally
```
docker build -t oic:latest .
docker run -it --entrypoint /bin/bash oic:latest
docker run -it --env-file contrib/src/.env -v "$(pwd)/contrib/.wallets/.all:/wallet" -v "$(pwd)/contrib/src:/opt/app-root/src" oic:latest
```
