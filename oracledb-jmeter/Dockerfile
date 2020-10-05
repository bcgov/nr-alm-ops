FROM justb4/jmeter:5.3
ENV SRC_DIR=/src
ENV WRK_DIR=/src/output
ADD https://repo1.maven.org/maven2/com/oracle/database/jdbc/ojdbc8/19.7.0.0/ojdbc8-19.7.0.0.jar /src/lib/
COPY oracle-cursor.jmx /src/
COPY sampler.groovy /src/
COPY entrypoint.sh /entrypoint.sh
RUN chmod -R a+r /src && chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

