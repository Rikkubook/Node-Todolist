const http = require('http');
const { v4: uuidv4 } = require('uuid'); 
const errorHandle = require('./errorHandle');

const todos = [
    //{"title": "今天要刷牙", "id": uuidv4() } //假資料，重啟動伺服器時會產生
];

const server = http.createServer((req, res) => {
    const headers = { 
        'Content-Type': 'application/json' ,
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin':  '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS,DELETE'
    }

    let body =""
    req.on('data', chunk =>{
        body+=chunk;
    })


    if(req.url === '/todos' && req.method === 'GET'){ // 取得所有
        res.writeHead(200, headers); 
        res.write(JSON.stringify({
            "status": "success",
            "data": todos
        }));
        res.end();
    } else if(req.url === '/todos' && req.method === 'POST'){ // 新增一比
        req.on('end',()=>{ // 確保組好了 body的資料
            try{
                const title = JSON.parse(body).title;

                if(title !== undefined){
                    const todo = { // 模擬打進資料庫的內容
                        "title": title,
                        "id": uuidv4()
                    }
                    console.log(todo);
                    todos.push(todo);
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        "status": "success",
                        "data": todos
                    }));
                    res.end();
                }else{
                    errorHandle(res);
                }
            }catch(error){
                errorHandle(res); // 也代表要回傳給哪個user
            }
        })
    }else if(req.url === '/todos' && req.method === 'DELETE'){ // 刪除全部
        todos.length = 0
        res.writeHead(200, headers); 
        res.write(JSON.stringify({
            "status": "success",
            "data": todos,
            "delete": "delete"
        }));
        res.end();
    }else if(req.url.startsWith("/todos/")  && req.method === 'DELETE'){ // 刪除一筆
        const id = req.url.split('/').pop();
        const index = todos.findIndex(item => item.id === id); //找索引
        if(index !== -1){  // 有索引
            todos.splice(index,1) // 刪除此筆
            res.writeHead(200, headers); 
            res.write(JSON.stringify({
                "status": "success",
                "data": todos,
            }));
            res.end();
        }else{
            errorHandle(res); 
        }
    }else if(req.url.startsWith("/todos/")  && req.method === 'PATCH'){ // 修改一筆
        req.on('end',()=>{ // 打進來的資料 確保組好了 body的資料
            try{
                const title = JSON.parse(body).title;
                const id = req.url.split('/').pop();
                const index = todos.findIndex(item => item.id === id); //找索引
                if(title !== undefined &&  index !== -1){ // 有title 且 有值
                    todos[index].title = title //寫入覆蓋
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        "status": "success",
                        "data": todos
                    }));
                    res.end();
                }else{
                    errorHandle(res);
                }
            }catch(error){
                errorHandle(res); // 也代表要回傳給哪個user
            }
        })
    }else if(req.method === 'OPTIONS'){
        res.writeHead(200, headers);
        res.end();
    }else{
        res.writeHead(404, headers); // 預設文字檔案
        res.write(JSON.stringify({
            "status": "false",
            "message": "無此網站路由"
        }));
        res.end();
    }
})

server.listen(process.env.PORT || 8080,()=>{
    console.log("Server is running on port 8080");
});