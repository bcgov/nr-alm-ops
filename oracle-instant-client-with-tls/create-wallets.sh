#!/bin/bash


function download_certificates {
  DBHOST="$1"
  DBHOSTNAME="${DBHOST%%.*}"
  echo "DBHOSTNAME=${DBHOSTNAME}"
  
  openssl s_client -showcerts -verify 5 -connect "${DBHOST}" < /dev/null | awk '/BEGIN/,/END/{ if(/BEGIN/){a++}; out="cert"a".pem"; print >out}'
}

function orapki {
  docker run --name orapki --rm --entrypoint /u01/oracle/oracle_common/bin/orapki -v "$(pwd):/work" store/oracle/weblogic:12.2.1.4 "$@"

}
function create_wallet {
  ENDPOINT=$1
  DBHOSTNAME="${ENDPOINT%%.*}"
  # echo "ENDPOINT:${ENDPOINT}"
  # echo "DBHOSTNAME:${DBHOSTNAME}"
  mkdir -p "contrib/.wallets/${DBHOSTNAME}"
  (cd "contrib/.wallets/${DBHOSTNAME}" && openssl s_client -showcerts -verify 5 -connect "${ENDPOINT}" < /dev/null 2>/dev/null | awk '/BEGIN/,/END/{ if(/BEGIN/){a++}; out="cert"a".pem"; print >out}')

  orapki wallet create -wallet /work/contrib/.wallets/${DBHOSTNAME} -auto_login -pwd 'ch4ng3m3'
  while read cert; do
    orapki wallet add -wallet /work/contrib/.wallets/${DBHOSTNAME} -pwd 'ch4ng3m3' -trusted_cert -cert "/work/${cert}"
  done < <(find "contrib/.wallets/${DBHOSTNAME}" -type f -name '*.pem')
  orapki wallet display -wallet "/work/contrib/.wallets/${DBHOSTNAME}"
}

create_wallet 'nrkdb01.bcgov:1543'
create_wallet 'nrcdb01.bcgov:1543'
create_wallet 'nrkdb03.bcgov:1543'
create_wallet 'nrcdb03.bcgov:1543'

echo "Creating one wallet with all certificates ..."
orapki wallet create -wallet /work/contrib/.wallets/.all -auto_login -pwd 'ch4ng3m3'
while read cert; do
  echo "${cert}"
  orapki wallet add -wallet /work/contrib/.wallets/.all -pwd 'ch4ng3m3' -trusted_cert -cert "/work/${cert}"
done < <(find "contrib/.wallets" -type f -name '*.pem')
orapki wallet display -wallet "/work/contrib/.wallets/.all"