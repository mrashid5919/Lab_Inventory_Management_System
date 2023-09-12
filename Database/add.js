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

async function findRequest(userid){
    const sql=`SELECT i.EQUIPMENT_NAME,l.LOCATION_NAME,er.QUANTITY,er.REQ_STATUS
    FROM EQUIPMENTS i
    JOIN EQUIPMENTS_IN_REQUESTS er ON i.EQUIPMENT_ID=er.EQUIPMENT_ID
    JOIN LOCATIONS l ON er.LOCATION_ID=l.LOCATION_ID
    JOIN REQUESTS r ON r.REQ_ID=er.REQ_ID
    WHERE r.USER_ID=:userid`;
    const binds={
        userid: userid
    };
    connection= await oracledb.getConnection(database.database);
    const result = (await connection.execute(sql, binds)).rows;
    return result;
}

async function findLabRequest(userid){
    const sql=`SELECT er.REQ_ID,u.USERNAME,i.EQUIPMENT_NAME,l.LOCATION_NAME,er.QUANTITY,i.PERMIT
    FROM EQUIPMENTS i
    JOIN EQUIPMENTS_IN_REQUESTS er ON i.EQUIPMENT_ID=er.EQUIPMENT_ID
    JOIN LOCATIONS l ON er.LOCATION_ID=l.LOCATION_ID
    JOIN REQUESTS r ON r.REQ_ID=er.REQ_ID
    JOIN USERS u ON u.USER_ID=er.USER_ID
    WHERE l.LAB_ASSISTANT=:userid AND er.REQ_STATUS=0`;
    const binds={
        userid: userid
    };
    connection= await oracledb.getConnection(database.database);
    const result = (await connection.execute(sql, binds)).rows;
    return result;
}

async function findLabRequest2(userid){
    const sql=`SELECT er.REQ_ID,u.USERNAME,i.EQUIPMENT_NAME,l.LOCATION_NAME,er.QUANTITY,i.PERMIT
    FROM EQUIPMENTS i
    JOIN EQUIPMENTS_IN_REQUESTS er ON i.EQUIPMENT_ID=er.EQUIPMENT_ID
    JOIN LOCATIONS l ON er.LOCATION_ID=l.LOCATION_ID
    JOIN REQUESTS r ON r.REQ_ID=er.REQ_ID
    JOIN USERS u ON u.USER_ID=er.USER_ID
    WHERE l.LAB_SUPERVISOR=:userid AND er.REQ_STATUS=1 AND i.PERMIT>1`;
    const binds={
        userid: userid
    };
    connection= await oracledb.getConnection(database.database);
    const result = (await connection.execute(sql, binds)).rows;
    return result;
}

async function create_req(sql,binds)
{    
    let connection,result;

    try{
   connection= await oracledb.getConnection(database.database);
   
   result=await connection.execute(sql,binds,{});
   return result;
}

catch(err)
{  
     console.log(err);
}
}


module.exports={findEquipment,create_req,findRequest,findLabRequest,findLabRequest2}