const oracledb=require('oracledb');


var conString="(DESCRIPTION =(LOAD_BALANCE = ON)(FAILOVER = ON)(ADDRESS =(PROTOCOL = TCP)(HOST = server1)(PORT = 1521))(ADDRESS = (PROTOCOL = TCP)(HOST = server2)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=XE)(FAILOVER_MODE=(TYPE=SELECT)(METHOD = BASIC))))";

const database={
    user:'C##LAB_INVENTORY_3',
    password: 'orcl',
    connectionString: 'localhost:1521/ORCL'
}
const options = {
    outFormat: oracledb.OUT_FORMAT_OBJECT
}
jwtSecretKey='my-32-character-ultra-secure-and-ultra-long-secret'

module.exports={database,options,jwtSecretKey};