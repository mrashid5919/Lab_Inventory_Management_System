const database=require('./config');
const oracledb=require('oracledb');
oracledb.autoCommit = true;

async function findEquipment(equipment){
    //const sql="SELECT * FROM EQUIPMENTS WHERE LOWER(EQUIPMENT_NAME) LIKE :equipment";
    const sql=`SELECT i.EQUIPMENT_ID,i.EQUIPMENT_NAME,l.LOCATION_NAME,el.QUANTITY,el.LOAN,i.DESCRIPT
    FROM EQUIPMENTS i
    JOIN EQUIPMENTS_IN_LOCATIONS el ON i.EQUIPMENT_ID=el.EQUIPMENT_ID
    JOIN LOCATIONS l ON el.LOCATION_ID=l.LOCATION_ID
    WHERE LOWER(i.EQUIPMENT_NAME) LIKE :equipment 
    AND el.QUANTITY<>0`;
    const binds ={
        equipment: equipment
    };
    connection= await oracledb.getConnection(database.database);
    const result = (await connection.execute(sql, binds)).rows;
    return result;
}

module.exports={findEquipment}