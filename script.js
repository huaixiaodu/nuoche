function generateSignature(data, secretKey) {
    // 将数据转为字符串形式并排序
    const sortedData = Object.keys(data).sort().reduce((acc, key) => {
        acc[key] = data[key];
        return acc;
    }, {});
    const dataString = JSON.stringify(sortedData);

    // 使用HMAC算法生成签名
    return CryptoJS.HmacSHA256(dataString, secretKey).toString();
}

function notifyOwner() {
    const currentTime = Date.now();
    const cooldownEndTime = localStorage.getItem('cooldownEndTime');

    if (cooldownEndTime && currentTime < cooldownEndTime) {
        Swal.fire({
            icon: 'warning',
            title: '发送过于频繁',
            text: '请稍后再试！',
            position: 'top',
            toast: true,
            timer: 3000,
            showConfirmButton: false
        });
        return;
    }

    // 通知数据
    const messageData = {
        appToken: "AT_8FQFDxpI2qvtDTrQG7jUCj6aTHOjgi2W",
        content: "您好，有人需要您挪车，请及时处理。",
        contentType: 1,
        uids: ["UID_AIQ8tkck5ulReU0umP6rNfOJ10lw", "UID_AIQ8tkck5ulReU0umP6rNfOJ10lw1"],
        timestamp: Date.now()
    };

    // 生成签名
    const secretKey = "YOUR_SECRET_KEY"; // 需与服务器端保持一致
    const signature = generateSignature(messageData, secretKey);

    // 附加签名到请求头或数据中
    fetch("https://wxpusher.zjiecode.com/api/send/message", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Signature": signature // 将签名添加到请求头
        },
        body: JSON.stringify(messageData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === 1000) {
            Swal.fire({
                icon: 'success',
                title: '通知已发送！',
                text: '车主已收到您的通知。',
                position: 'top',
                toast: true,
                timer: 4000,
                showConfirmButton: false
            });
            startCountdown(60); // 启动倒计时（60秒）
        } else {
            Swal.fire({
                icon: 'error',
                title: '通知发送失败',
                text: '请稍后重试。',
                position: 'top',
                toast: true,
                timer: 3000,
                showConfirmButton: false
            });
        }
    })
    .catch(error => {
        console.error("Error sending notification:", error);
        Swal.fire({
            icon: 'error',
            title: '网络错误',
            text: '通知发送出错，请检查网络连接。',
            position: 'top',
            toast: true,
            timer: 3000,
            showConfirmButton: false
        });
    });
}
