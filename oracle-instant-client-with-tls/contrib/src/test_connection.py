#! /usr/bin/env python
import os
import cx_Oracle

print('test_connection.py')

#cx_Oracle.init_oracle_client()
#    lib_dir='/opt/app-root/oracle_bin/instantclient',
#    config_dir='/opt/app-root/oracle_bin/instantclient/network/admin')

print(os.getenv('ORADB_USER'))
print(os.getenv('ORADB_DSN'))
oracle_db = cx_Oracle.connect(user=os.getenv('ORADB_USER'), password=os.getenv('ORADB_PASSWORD'), dsn=os.getenv('ORADB_DSN'), encoding="UTF-8")

print('connected')

cursor = oracle_db.cursor()
cursor.execute("SELECT USER FROM dual")

results = cursor.fetchall()
for result in results:
    print(result)
cursor.close()
