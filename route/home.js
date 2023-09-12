const router=require('express').Router();
const DB_user = require('../Database/insert_user');
const DB_add=require('../Database/add');
const {verify} = require('../middlewares/user-verification');

function getDate(text)
{
    const arr=text.split('-');
    var date=arr[2]+'-';
    if(arr[1]=='01')
        date+='Jan';
    else if(arr[1]=='02')
        date+='Feb';
    else if(arr[1]=='03')
        date+='Mar';
    else if(arr[1]=='04')
        date+='Apr';
    else if(arr[1]=='05')
        date+='May';
    else if(arr[1]=='06')
        date+='June';
    else if(arr[1]=='07')
        date+='July';
    else if(arr[1]=='08')
        date+='Aug';
    else if(arr[1]=='09')
        date+='Sep';
    else if(arr[1]=='10')
        date+='Oct';
    else if(arr[1]=='11')
        date+='Nov';
    else
        date+='Dec';
    date+='-'+arr[0];
    return date;
}

router.get('/home', verify, async (req, res) => {
    const user = await DB_user.getUserByuserName(req.user[1]);
    //const macro=await DB_info.getMacros(user[0]);
    // var eaten=await DB_add.getFoodToday(user[0]);
    // //console.log(parseFloat(eaten[1]));
    // let remain=[],net=[]
    // var exer;
    // if(ex[0]==null)
    //     exer=0;
    // else
    //     exer=parseFloat(ex[0]);
    // //var remain=parseFloat(goal[1])-parseFloat(eaten[0][0]);
    // if(eaten[0]==null){
    //     //console.log('Null');
    //     remain.push(goal[1]+exer);
    //     net.push((-1)*exer);
    //     //remain.push(0);
    // }
    // else
    // {
    //     remain.push(parseFloat(goal[1])-parseFloat(eaten[0])+exer);
    //     net.push(parseFloat(eaten[0])-exer);
    // }
    //console.log(remain);
    res.render('home.ejs', {
                cur_user: user,
                // cur_goal: goal,
                // cur_eaten: eaten,
                // cur_remain: remain,
                // cur_done: exer,
                // cur_net: net,
                // progress: progress,
                // pro: (-1)*progress
            });
});

router.get('/searchequipment',verify,async(req,res)=>{
    const user = await DB_user.getUserByuserName(req.user[1]);
    res.render('searchequipment.ejs',{
        cur_user: user,
        items:[]
    })
})

router.post('/searchequipment',verify,async(req,res)=>{
    const user=await DB_user.getUserByuserName(req.user[1]);
    var equipment=req.body.equipment;
    equipment=equipment.toLowerCase();
    equipment="%"+equipment+"%";
    //console.log(food);
    let result=[];

    result=await DB_add.findEquipment(equipment);
    res.render('searchequipment.ejs',{
        cur_user:user,
        items: result
    })
})

router.post('/test',verify,async(req,res)=>{
    const user=await DB_user.getUserByuserName(req.user[1]);
    const equipment=req.body.equipmentName;
    const lab=req.body.labName;
    const quantity=parseInt(req.body.quantity);
    const text=req.body.date;
    // const item=parseInt(req.body.id);
    // const serve=parseFloat(req.body.serving);
    // const text=req.body.date;
    // const meal=req.body.meal;
    date=getDate(text);
    let result=[]
    //console.log(user[0]);
    /*result=await DB_add.getMeal(meal,date,user[0]);
    //console.log(result);
    if(result==undefined)
    {
        console.log('Hi');
        const sql=`INSERT INTO MEAL_LOGGER(MEAL_TYPE,MEAL_DATE,USER_ID) VALUES(:meal,TO_DATE(:dat,'DD-MON-YYYY'),:user_id)`;
        binds={
         
            meal: meal,
            dat: date,
            user_id: parseInt(user[0])
       }
       result=await DB_add.create_meal(sql,binds);
       
    }*/
    //result=await DB_add.getMeal(meal,date,user[0]);
    const sql=`
    BEGIN
	CREATE_REQ(:equipment,:lab,:quantity,:date,:userid);
    END;`;
    const binds={
        userid: req.user[0],
        equipment: equipment,
        lab: lab,
        quantity: quantity,
        date: date
    }
    /*const sql=`INSERT INTO CONTAINS(MEAL_ID,ITEM_ID,QUANTITY) VALUES(:meal_id,:item_id,:quantity)`;
    binds={
        meal_id: result[0],
        item_id: item,
        quantity: serve
    }*/
    DB_add.create_req(sql,binds);
    //console.log(date);
    //console.log(data);
    res.redirect('/home');
})

router.get('/viewrequests',verify,async (req,res)=>{
    const user = await DB_user.getUserByuserName(req.user[1]);
    let result=[],status=[];
    if(req.user[6]=="Student"){
        result=await DB_add.findRequest(req.user[0]);
        for(var i=0;i<result.length;i++)
        {
            if(result[i][3]=="0")
                status[i]="Waiting for Lab Assistant Approval"
            else if(result[i][3]=="1")
                status[i]="Waiting for Lab Supervisor Approval"
            else if(result[i][3]=="2")
                status[i]="Waiting for Lab Approval"
            else if(result[i][3]=="3")
                status[i]="Accepted"
            else if(result[i][3]=="4")
                status[i]="Declined"
        }
    }
    else if(req.user[6]=="Lab Assistant")
        result=await DB_add.findLabRequest(req.user[0]);
    else if(req.user[6]=="Teacher"){
        result=await DB_add.findLabRequest2(req.user[0]);
        console.log(result)
    }
    // const text=req.body.date;
    // date=getDate(text);
    // //let result=[],result1=[],result2=[],result3=[];
    // result=await DB_add.getMealDetails("Breakfast",date,user[0]);
    // result1=await DB_add.getMealDetails("Lunch",date,user[0]);
    // result2=await DB_add.getMealDetails("Dinner",date,user[0]);
    // result3=await DB_add.getMealDetails("Snacks",date,user[0]);
    // const goal=await DB_goal.getCalorieGoal(user[0]);
    // const macro=await DB_info.getMacros(user[0]);
    // const water=await DB_add.findWater(date,user[0]);
    // var eaten=await DB_add.getFoodDate(user[0],date);
    // var ex=await DB_add.getExerciseToday(user[0],user[4]);
    // var exer,wat;
    // if(ex[0]==null)
    //     exer=0;
    // else
    //     exer=parseFloat(ex[0]);
    // //console.log(eaten);
    // //console.log(parseFloat(eaten[1]));
    // let remain=[],total=[]
    // //var remain=parseFloat(goal[1])-parseFloat(eaten[0][0]);
    // //console.log(water);
    // if(water==undefined)
    //     wat=0;
    // else
    //     wat=parseInt(water[1]);
    // if(eaten[0]==null){
    //     //console.log('Null');
    //     remain.push(parseFloat(goal[1])+exer);
    //     total.push(parseFloat(goal[1])+exer);
    //     for(var i=0;i<3;i++){
    //         remain.push(macro[i]);
    //         total.push(macro[i]);
    //     }
    //     for(var i=1;i<=5;i++){
    //         remain.push(await DB_info.getMicros(user[0],user[7],i));
    //         total.push(await DB_info.getMicros(user[0],user[7],i));
    //     }
    //     //remain.push(0);
    // }
    // else
    // {
    //     remain.push(parseFloat(goal[1])+exer-parseFloat(eaten[0]));
    //     for(var i=0;i<3;i++)
    //         remain.push(parseFloat(macro[i])-parseFloat(eaten[i+1]));
    //     for(var i=1;i<=5;i++)
    //         remain.push(await DB_info.getMicros(user[0],user[7],i)-parseFloat(eaten[i+3]));
    //         total.push(goal[1]+exer);
    //         for(var i=0;i<3;i++)
    //             total.push(macro[i]);
    //         for(var i=1;i<=5;i++)
    //             total.push(await DB_info.getMicros(user[0],user[7],i));
        
    // }
    //console.log(result)
    res.render('viewrequests.ejs',{
        cur_user: user,
        dat: result,
        status: status
        // dat1: result1,
        // dat2: result2,
        // dat3: result3,
        // cur_remain: remain,
        // cur_total: total,
        // cur_eaten: eaten,
        // cur_done: exer,
        // wat: wat,
        // water_goal: goal[3]
    })
})

router.post('/viewrequests',verify,async(req,res)=>{
    const user = await DB_user.getUserByuserName(req.user[1]);
    let result=[];
    if(req.user[6]=="Student")
        result=await DB_add.findRequest(req.user[0]);
    else if(req.user[6]=="Lab Assistant")
        result=await DB_add.findLabRequest(req.user[0]);
    // const text=req.body.date;
    // date=getDate(text);
    // //let result=[],result1=[],result2=[],result3=[];
    // result=await DB_add.getMealDetails("Breakfast",date,user[0]);
    // result1=await DB_add.getMealDetails("Lunch",date,user[0]);
    // result2=await DB_add.getMealDetails("Dinner",date,user[0]);
    // result3=await DB_add.getMealDetails("Snacks",date,user[0]);
    // const goal=await DB_goal.getCalorieGoal(user[0]);
    // const macro=await DB_info.getMacros(user[0]);
    // const water=await DB_add.findWater(date,user[0]);
    // var eaten=await DB_add.getFoodDate(user[0],date);
    // var ex=await DB_add.getExerciseToday(user[0],user[4]);
    // var exer,wat;
    // if(ex[0]==null)
    //     exer=0;
    // else
    //     exer=parseFloat(ex[0]);
    // //console.log(eaten);
    // //console.log(parseFloat(eaten[1]));
    // let remain=[],total=[]
    // //var remain=parseFloat(goal[1])-parseFloat(eaten[0][0]);
    // //console.log(water);
    // if(water==undefined)
    //     wat=0;
    // else
    //     wat=parseInt(water[1]);
    // if(eaten[0]==null){
    //     //console.log('Null');
    //     remain.push(parseFloat(goal[1])+exer);
    //     total.push(parseFloat(goal[1])+exer);
    //     for(var i=0;i<3;i++){
    //         remain.push(macro[i]);
    //         total.push(macro[i]);
    //     }
    //     for(var i=1;i<=5;i++){
    //         remain.push(await DB_info.getMicros(user[0],user[7],i));
    //         total.push(await DB_info.getMicros(user[0],user[7],i));
    //     }
    //     //remain.push(0);
    // }
    // else
    // {
    //     remain.push(parseFloat(goal[1])+exer-parseFloat(eaten[0]));
    //     for(var i=0;i<3;i++)
    //         remain.push(parseFloat(macro[i])-parseFloat(eaten[i+1]));
    //     for(var i=1;i<=5;i++)
    //         remain.push(await DB_info.getMicros(user[0],user[7],i)-parseFloat(eaten[i+3]));
    //         total.push(goal[1]+exer);
    //         for(var i=0;i<3;i++)
    //             total.push(macro[i]);
    //         for(var i=1;i<=5;i++)
    //             total.push(await DB_info.getMicros(user[0],user[7],i));
        
    // }
    //console.log(result)
    res.render('viewrequests.ejs',{
        cur_user: user,
        dat: result,
        // dat1: result1,
        // dat2: result2,
        // dat3: result3,
        // cur_remain: remain,
        // cur_total: total,
        // cur_eaten: eaten,
        // cur_done: exer,
        // wat: wat,
        // water_goal: goal[3]
    })
})

module.exports=router
