``
docker run -it --entrypoint /bin/bash --user root registry.access.redhat.com/ubi7/python-36:1-77

docker build -t oic:latest .
docker run -it --entrypoint /bin/bash --user root -v "$(pwd)/contrib/src:/opt/app-root/src" oic:latest
docker run -it --env-file contrib/src/.env --entrypoint python  oic:latest test_connection.py


sqlplus APORETO_TESTER@'tcps://nrcdb01.bcgov:1543/ZEROTST2.NRS.BCGOV?ssl_server_dn_match=off&wallet_location=/opt/app-root/src/.wallet'
```

# Download/Pull Image
```
docker pull store/oracle/database-instantclient:12.2.0.1
```

# Running
```
docker run -ti --rm store/oracle/database-instantclient:12.2.0.1 bash sqlplus nrcdb01.bcgov:1521/ZEROTST2.NRS.BCGOV


docker run -ti --rm --entrypoint /bin/bash -v "$(pwd)/contrib/src:/opt/app-root/src" store/oracle/weblogic:12.2.1.4
docker run -ti --rm --entrypoint /bin/bash store/oracle/database-enterprise:12.2.0.1

```

# export certificate to a .pem files
openssl s_client -showcerts -verify 5 -connect nrcdb01.bcgov:1543 < /dev/null | awk '/BEGIN/,/END/{ if(/BEGIN/){a++}; out="cert"a".pem"; print >out}'

openssl s_client -showcerts -verify 5 -connect nrkdb01.bcgov:1543 < /dev/null | awk '/BEGIN/,/END/{ if(/BEGIN/){a++}; out="cert-nrkdb01"a".pem"; print >out}'

nrkdb01


# create a wallet
orapki wallet create -wallet /opt/app-root/src/.wallet-nrcdb01 -auto_login -pwd 'ch4ng3m3'
orapki wallet add -wallet /opt/app-root/src/.wallet-nrcdb01 -pwd 'ch4ng3m3' -trusted_cert -cert /opt/app-root/src/.certs/cert1.pem
orapki wallet add -wallet /opt/app-root/src/.wallet-nrcdb01 -pwd 'ch4ng3m3' -trusted_cert -cert /opt/app-root/src/.certs/cert2.pem

orapki wallet display -wallet /opt/app-root/src/.wallet-nrcdb01

```
# References
