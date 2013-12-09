/**
 * Created by yujingbo on 13-11-27.
 */
var mongodb=require('./db');
var crypto=require('crypto');
function User(user){
    this.name=user.name;
    this.password=user.password;
    this.email=user.email;
}
module.exports=User;
User.prototype.save=function(callback){
    var md5 = crypto.createHash('md5'),
        email_MD5 = md5.update(this.email.toLowerCase()).digest('hex'),
        head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48";
    //要存储到数据库的数据
    var user={
        name:this.name,
        password:this.password,
        email:this.email,
        head:head
    };
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);  //返回错误信息
        }

        //读取user集合
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err); //返回错误信息
            }
            //将用户数据插入users集合
            collection.insert(user,{safe:true},function(err,user){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null, user[0]);//成功！err 为 null，并返回存储后的用户文档
            });
        });
    });
};

//读取用户信息
User.get=function(name,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //查找用户名为name的文档
            collection.findOne({name:name},function(err,user){
                mongodb.close();
                if(err){
                    callback(err);
                }
                callback(null,user); //成功！返回查询的用户信息
            });
        });
    });

};


