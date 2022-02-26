const http = require('http');
const { v4: uuidv4 } = require('uuid'); 
const errorHandle = require('./errorHandle');

const todoList = [
    //{"title": "今天要刷牙", "id": uuidv4() } //假資料，重啟動伺服器時會產生
];

const server = http.createServer((req, res) => {
    const Header =(number) =>  res.writeHead(number, {
        'Content-Type': 'application/json' ,
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin':  '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS,DELETE'
       }); // 預設文字檔案

    let body =""
    req.on('data', chunk =>{
        body+=chunk;
    })

    if(req.url==='/todos'){
        let method =  req.method
        switch(method){
            case 'GET': 
                Header(200) 
                res.write(JSON.stringify({
                    "status": "success",
                    "data": todoList
                }));
                res.end()
                break;
            case 'POST':
                req.on('end',()=>{
                    try{
                        const title = JSON.parse(body).title;
                        if(title !== undefined){ // 沒有title
                            const todo = { // 模擬打進資料庫的內容
                                "title": title,
                                "id": uuidv4()
                            }
                            todoList.push(todo);
                            Header(200) 
                            res.write(JSON.stringify({
                                "status": "success",
                                "data": todoList
                            }));
                            res.end();
                        }else{
                            Header(400) 
                            res.write(JSON.stringify({
                                "status": "false",
                                "data": "沒有 title"
                            }));
                            res.end();
                        }
                    }catch(error){ // 非JSON格式
                        console.log("Error");
                        console.log(error);
                        Header(400) 
                        res.write(JSON.stringify({
                            "status": "false",
                            "data": "欄位未填寫正確，或無此 todo id"
                        }));
                        res.end();
                    }
                })
                break;
            case 'DELETE':
                todoList.length = 0;
                Header(200) 
                res.write(JSON.stringify({
                    "status": "success",
                    "data": todoList,
                    "message": "全部刪除成功"
                }));
                res.end();
            break;
            default:
                console.log(`Sorry, we are out of ${method}.`);
        }
    }else if(req.url.startsWith('/todos/') ){
        let method =  req.method
        switch(method){
            case 'DELETE':
                const id = req.url.split('/').pop();
                const index = todoList.findIndex(item => item.id === id); //找索引
                if(index !== -1){
                    todoList.splice(index, 1);
                    Header(200) 
                    res.write(JSON.stringify({
                        "status": "success",
                        "data": todoList,
                    }));
                    res.end();
                }else{
                    Header(404) 
                    res.write(JSON.stringify({
                        "status": "false",
                        "data": "刪除"
                    }));
                    res.end();
                }
                break;
            case 'PATCH':
                req.on('end',()=>{
                    try{
                        const title = JSON.parse(body).title;
                        const id = req.url.split('/').pop();
                        const index = todoList.findIndex(item => item.id === id); //找索引
        
                        if(title !== undefined &&  index !== -1){ //
                            todoList[index].title = title
                            Header(200) 
                            res.write(JSON.stringify({
                                "status": "success",
                                "data": todoList
                            }));
                            res.end();
                        }else{
                            Header(400) 
                            res.write(JSON.stringify({
                                "status": "false",
                                "data": "沒有 title"
                            }));
                            res.end();
                        }
                    }catch(error){ // 非JSON格式
                        console.log("Error");
                        console.log(error);
                        Header(400) 
                        res.write(JSON.stringify({
                            "status": "false",
                            "data": "欄位未填寫正確，或無此 todo id"
                        }));
                        res.end();
                    }
                })
                break;
            default:
                console.log(`Sorry, we are out of ${method}.`);
        }
    }else if(req.method === 'OPTIONS'){
        Header(200) 
        console.log('經過OPTIONS');
        res.end()
    }else {
        Header(404) 
        res.write(JSON.stringify({
            "status": "false",
            "data": "沒有此路由"
        }));
        res.end()
    }
})

server.listen(process.env.PORT || 8080,()=>{
    console.log("Server is running on port 8080");
});