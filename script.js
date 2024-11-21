let lastNotifyTime = 0; // 上次通知时间（时间戳）

// 假设我们从某个地方获取用户的UID
const userUID = "UID_AIQ8tkck5ulReU0umP6rNfOJ10lw";  // 动态设置的用户 UID

function notifyOwner() {
    const currentTime = Date.now();
    if (currentTime - lastNotifyTime < 60 * 1000) {
        Swal.fire({
            icon: 'warning',
            title: '发送过于频繁',
            text: '请稍后再试！',
            position: 'top',  // 弹窗位置调整到顶部
            toast: true, // 使用toast样式
            timer: 3000,  // 弹窗显示2秒后自动消失
            showConfirmButton: false
        });
        return;
    }
    
    fetch("https://wxpusher.zjiecode.com/api/send/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            appToken: "AT_8FQFDxpI2qvtDTrQG7jUCj6aTHOjgi2W",
            content: "您好，有人需要您挪车，请及时处理。",
            contentType: 1,
            uids: [userUID]  // 发送到指定的UID
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === 1000) {
            // 使用 SweetAlert2 显示通知已发送的提示框
            Swal.fire({
                icon: 'success',
                title: '通知已发送！',
                text: '车主已收到您的通知。',
                position: 'top',  // 弹窗位置调整到顶部
                toast: true, // 使用toast样式
                timer: 2000,  // 弹窗显示2秒后自动消失
                showConfirmButton: false
            });
            lastNotifyTime = currentTime; // 更新最后发送时间
        } else {
            Swal.fire({
                icon: 'error',
                title: '通知发送失败',
                text: '请稍后重试。',
                position: 'top',  // 弹窗位置调整到顶部
                toast: true,
                timer: 2000,
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
            position: 'top',  // 弹窗位置调整到顶部
            toast: true,
            timer: 2000,
            showConfirmButton: false
        });
    });
}

function callOwner() {
    window.location.href = "tel:17896021990";
}
