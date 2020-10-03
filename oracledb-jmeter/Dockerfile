FROM justb4/jmeter:5.3
ENV SRC_DIR=/src
ENV WRK_DIR=/src/output
ADD https://repo1.maven.org/maven2/com/oracle/database/jdbc/ojdbc8/19.7.0.0/ojdbc8-19.7.0.0.jar /src/lib/
COPY oracle-cursor.jmx /src/
COPY sampler.groovy /src/
RUN chmod -R a+r /src
ENTRYPOINT ["/entrypoint.sh"]
VOLUME ["${WRK_DIR}"]
WORKDIR ${WRK_DIR}
CMD ["-Juser.classpath=/src/lib/ojdbc8-19.7.0.0.jar", "-Dlog_level.jmeter=DEBUG", "-n", "-t", "/src/oracle-cursor.jmx", "-l", "./oracle-cursor.jtl", "-e", "-o", "./report"]
