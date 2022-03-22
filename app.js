
const {ErrorHandle, SuccessHandle} = require ('./handler.js');

const http = require('http');
const { v4: uuidv4 } = require('uuid'); 


const todoList = [
    //{"title": "今天要刷牙", "id": uuidv4() } //假資料，重啟動伺服器時會產生
];

const server = http.createServer((req, res) => {
    const Header = (number) =>  res.writeHead(number, {
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
                SuccessHandle(res, todoList)
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
                            SuccessHandle(res, todoList)
                        }else{
                            Header(400)
                            ErrorHandle(res, '沒有 title')
                        }
                    }catch(error){ // 非JSON格式
                        Header(400) 
                        ErrorHandle(res, '欄位未填寫正確，或無此 todo id')
                    }
                })
                break;
            case 'DELETE':
                todoList.length = 0;
                Header(200) 
                SuccessHandle(res, todoList, "全部刪除成功")
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
                SuccessHandle(res, todoList)
            }else{
                Header(404) 
                ErrorHandle(res, '欄位未填寫正確，或無此 todo id')
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
                        SuccessHandle(res, todoList)
                    }else{
                        Header(400)
                        ErrorHandle(res, '沒有 title')
                    }
                  }catch(error){ // 非JSON格式
                    Header(400) 
                    ErrorHandle(res, '欄位未填寫正確，或無此 todo id')
                }
            })
            break;
            default:
                console.log(`Sorry, we are out of ${method}.`);
        }
    }else if(req.method === 'OPTIONS'){
        Header(200) 
        SuccessHandle(res, [], "經過OPTIONS")
    }else {
        Header(404) 
        ErrorHandle(res, '沒有此路由')
    }
})

server.listen(process.env.PORT || 8080,()=>{
    console.log("Server is running on port 8080");
});