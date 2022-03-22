
const ErrorHandle = (res,message) => {
  res.write(JSON.stringify({
      "status": "false",
      "message": message
  }));
  res.end();
}


const SuccessHandle = (res,todoList, message) => {
  res.write(JSON.stringify({
      "status": "success",
      "data": todoList,
      "message": message
  }));
  res.end();
}

module.exports = {ErrorHandle, SuccessHandle};