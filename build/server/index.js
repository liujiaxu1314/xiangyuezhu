let connect=require('../mysql/connect/index.js')
const setToken=require('../mysql/setToken/index.js')
const getToken=require('../mysql/getToken/index.js')


const getCarouselList = function(app) {
  app.get("/getCarouselList", (req, res) => {
    let data = require("./data/carousel.json");
    res.send(data);
  })
}

const getComboList = function(app) {
  app.get("/getComboList", (req, res) => {
    let data = require("./data/data.json");
    res.send(data);
  })
}

const getConsulTation = function(app) {
  app.get("/getConsulTation", (req, res) => {
    let data = require("./data/consultation.json");
    res.send(data);
  })
}

const getLoginInfo = function(app) {
  app.get("/getLoginInfo", (req, res) => {
    let {username,password}=req.query;
    const sql='SELECT * from team where username=? and password=?'
    connect(sql,[username,password],function(result){
      if(result.length>0){
        let token=getToken((result[0]))
        setToken(result[0].id,token)
        res.json({
          code:0,
          errMsg:'',
          islogin:true,
          token:token,
          data:result[0]
        })
      }else{
        res.json({
          code:1,
          errMsg:'登录失败',
          islogin:false
        })
      }
    })
  })
}

const updateUrl = function(app) {
// 创建 application/x-www-form-urlencoded 编码解析
  const bodyParser=require('body-parser');
  let urlencodedParser = bodyParser.urlencoded({ extended: false })
  app.post("/file/upload",urlencodedParser, (req, res) => {
    console.log(req.body,'999')
    res.send('999')
   // connect(req.query,res)
  })
}

const getRegister=function(app){
 
  app.get("/getRegister", (req, res) => {
    const {username,password,phone} = req.query;
    const sql= 'INSERT INTO team(username,password,phone) VALUES(?,?,?)';
    connect(sql,[username,password,phone],function(result){
        console.log('匹配成功');
          res.json({
            code:0,
            Msg:'注册成功'
          })
      
    })
  })
}

const getAlertphone=function(app){
 
  app.get("/getalertphone", (req, res) => {
    const {id,phone,code} =req.query;

    let $sql=`UPDATE team SET phone = ?, code = ? WHERE id = ?`;
    connect($sql,[phone,code,id],function(result){
      console.log('更新成功');
      res.send({
        code:0,
        msg:'更新成功'
      })
    })
  })
}

const getAlertcode=function(app){
 
  app.get("/getalertcode", (req, res) => {
    const {id,password} = req.query;
    let $sql=`UPDATE team SET password = ? WHERE id = ?`;
    connect($sql,[password,id],function(result){
      res.send({
        code:0,
        msg:'更新成功'
      })
    })
  })
}

const upDateUserInfo=function(app){
  app.get('/upDateUserInfo',(req,res)=>{
    const {id,username}=req.query;
    //console.log(username,id)
    let $sql='SELECT * from team where username=? and id=?'
    connect($sql,[username,id],function(result){
      //console.log(result)
      res.send({
        code:0,
        msg:'更新成功',
        data:result[0]
      })
    })
  })
}

const getCode=function(app){
  app.get("/getcode", (req, res) => {
    let forCode=require('../mysql/verificationCode/index.js')
   res.send({
     type:'验证码',
     code:forCode()
   })
  })
}

module.exports = function(app) {
  getCarouselList(app);
  getComboList(app);
  getConsulTation(app);
  getLoginInfo(app)
  updateUrl(app);
  getRegister(app);
  getAlertphone(app)
  getAlertcode(app)
  getCode(app)
  upDateUserInfo(app)
}
