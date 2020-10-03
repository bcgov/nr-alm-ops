import java.sql.*;
import oracle.jdbc.*;
import org.apache.jmeter.protocol.jdbc.config.DataSourceElement;

ResultSet rs = null;
ResultSetMetaData rsmd = null;
CallableStatement stmt;

// "myConnConfigName" is the 'JDBC Connection Configuration' variable name
java.sql.Connection conn = DataSourceElement.getConnection("DB1");

try {
    stmt = conn.prepareCall("begin open ? for select * from "+vars.get("TABLE_NAME")+"; end;");
    stmt.registerOutParameter(1, OracleTypes.CURSOR);
    stmt.execute();

    rs = (ResultSet) stmt.getObject(1);
    log.info("Cursor: " + rs);
    //loop 500 times
    for(int i = 0; i < 1000; ++i){
        rs.next()
    }
}
catch(Throwable ex) {
    log.error("Error message: ", ex);
    throw ex;
}
finally {
    if (rs != null) {
        rs.close();
    }
    if (stmt != null) {
        stmt.close();
    }
    if (conn != null) {
        conn.close();
    }
}