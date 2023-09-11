const router=require('express').Router();
const DB_user = require('../Database/insert_user');
const DB_add=require('../Database/add');
const {verify} = require('../middlewares/user-verification');

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

module.exports=router