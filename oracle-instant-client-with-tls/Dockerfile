FROM registry.access.redhat.com/ubi7/python-36
USER root
RUN set -x && \
    echo '[ol7_latest]' > /etc/yum.repos.d/ol7-temp.repo && \
    echo 'name=Oracle Linux $releasever Latest ($basearch)' >> /etc/yum.repos.d/ol7-temp.repo && \
    echo 'baseurl=https://yum.oracle.com/repo/OracleLinux/OL7/latest/$basearch/' >> /etc/yum.repos.d/ol7-temp.repo && \
    echo 'gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-oracle' >> /etc/yum.repos.d/ol7-temp.repo && \
    echo 'gpgcheck=1' >> /etc/yum.repos.d/ol7-temp.repo && \
    echo 'enabled=1' >> /etc/yum.repos.d/ol7-temp.repo && \
    curl -sSLo /etc/pki/rpm-gpg/RPM-GPG-KEY-oracle https://yum.oracle.com/RPM-GPG-KEY-oracle-ol7 && \
    yum install -y --disablerepo=* --enablerepo=ol7_latest oracle-release-el7 && \
    rm /etc/yum.repos.d/ol7-temp.repo && \
    yum install -y --disablerepo=* --enablerepo=ol7_latest,ol7_oracle_instantclient oracle-instantclient19.6-basic oracle-instantclient19.6-devel oracle-instantclient19.6-sqlplus oracle-instantclient19.6-tools && \
    yum clean all -y
COPY contrib/src/ /opt/app-root/src
COPY contrib/fix-uid /usr/local/bin/
RUN pip install -r requirements.txt && mkdir /wallet && chmod -R g=u /wallet && chmod -R g=u /opt/app-root/src
VOLUME [ "/wallet" ]
# Restore original image user
USER 1001

ENTRYPOINT [ "/usr/local/bin/fix-uid" ]
CMD [ "python", "test_connection.py" ]
