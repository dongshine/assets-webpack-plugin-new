var user = {
    name:"name",
    age:"18",
    hight:"200"
}

let log = (p = "default") => alert(p);
//
var {name,...t} = user; 
$("#btn").click(()=>log("年龄："+t.age));    

