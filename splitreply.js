let replyMsg = "손흥민, 득점 수, 세계 신기록, 등수, 팀 이름, 오차율, prediction"

function splitReplyMsg(replyMsg){
    var result = replyMsg.replace(/(\s*)/g, '');
    result = result.split(',');
    return result;
}

console.log(splitReplyMsg(replyMsg));