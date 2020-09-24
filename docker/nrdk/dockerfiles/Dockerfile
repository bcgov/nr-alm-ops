FROM node:12.18.4-slim
RUN set -x && \
  apt-get update && apt-get install -y curl git && apt-get clean && \
  curl -sSL https://mirror.openshift.com/pub/openshift-v3/clients/3.11.232/linux/oc.tar.gz -o /tmp/oc.tar.gz && \
  tar -zxvf /tmp/oc.tar.gz -C /usr/local/bin && rm /tmp/oc.tar.gz
RUN npm install -g @bcgov/nrdk
USER node
RUN mkdir /home/node/.kube
