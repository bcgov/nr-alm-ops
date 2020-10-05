#!/bin/bash
set -e

#!/bin/bash
# Inspired from https://github.com/hhcordero/docker-jmeter-client
# Basically runs jmeter, assuming the PATH is set to point to JMeter bin-dir (see Dockerfile)
#
# This script expects the standdard JMeter command parameters.
#
set -e
freeMem=`awk '/MemFree/ { print int($2/1024) }' /proc/meminfo`
s=$(($freeMem/10*8))
x=$(($freeMem/10*8))
n=$(($freeMem/10*2))
export JVM_ARGS="-Xmn${n}m -Xms${s}m -Xmx${x}m"

echo "START Running Jmeter on `date`"
echo "JVM_ARGS=${JVM_ARGS}"
echo "jmeter args=$@"

# Keep entrypoint simple: we must pass the standard JMeter arguments
RUN_DIR="${WRK_DIR}/$(date "+%Y%m%d-%H%M%S")"
mkdir "${RUN_DIR}"
set -x
cd "${RUN_DIR}"
exec jmeter "-Juser.classpath=/src/lib/ojdbc8-19.7.0.0.jar" "-Dlog_level.jmeter=DEBUG" "-n" "-t" "/src/oracle-cursor.jmx" "-l" "${RUN_DIR}/oracle-cursor.jtl" "-e" "-o" "${RUN_DIR}/report" "$@"
echo "END Running Jmeter on `date`"
