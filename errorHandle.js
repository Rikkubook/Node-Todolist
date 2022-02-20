

function errorHandle (res) {
  const headers = { 
    'Content-Type': 'application/json' ,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS,DELETE'
  }
  res.writeHead(400, headers);
  res.write(JSON.stringify({
      "status": "false",
      "data": "欄位未填寫正確，或無此 todo id title"
  }));
  res.end();
}

module.exports = errorHandle;