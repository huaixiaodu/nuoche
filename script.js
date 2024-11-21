// 初始化用户的唯一标识符（UID），从 URL 中提取专属用户参数
const queryParams = new URLSearchParams(window.location.search);
const userUid = queryParams.get("uid"); // 从链接中获取 `uid` 参数
const appToken = "AT_8FQFDxpI2qvtDTrQG7jUCj6aTHOjgi2W"; // AppToken
let lastNotifyTime = 0; // 记录上次通知时间

if (!userUid) {
    Swal.fire({
        icon: "error",
        title: "无效用户",
        text: "链接中缺少用户标识，请联系管理员。",
    });
}

// 通知车主方法
function notifyOwner() {
    const currentTime = Date.now();
    if (currentTime - lastNotifyTime < 60 * 1000) {
        Swal.fire({
            icon: "warning",
            title: "发送过于频繁",
            text: "请稍后再试！",
            position: "top",
            toast: true,
            timer: 3000,
            showConfirmButton: false,
        });
        return;
    }

    // 发送通知请求
    fetch("https://wxpusher.zjiecode.com/api/send/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            appToken: appToken,
            content: "您好，有人需要您挪车，请及时处理。", // 简化后的通知内容
            contentType: 1,
            uids: [userUid], // 动态设置用户 UID
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.code === 1000) {
                Swal.fire({
                    icon: "success",
                    title: "通知已发送！",
                    text: "车主已收到您的通知。",
                    position: "top",
                    toast: true,
                    timer: 2000,
                    showConfirmButton: false,
                });
                lastNotifyTime = currentTime; // 更新最后通知时间
            } else {
                Swal.fire({
                    icon: "error",
                    title: "通知发送失败",
                    text: "请稍后重试。",
                    position: "top",
                    toast: true,
                    timer: 2000,
                    showConfirmButton: false,
                });
            }
        })
        .catch((error) => {
            console.error("通知发送出错：", error);
            Swal.fire({
                icon: "error",
                title: "网络错误",
                text: "通知发送出错，请检查网络连接。",
                position: "top",
                toast: true,
                timer: 2000,
                showConfirmButton: false,
            });
        });
}

// 拨打车主电话（固定号码）
function callOwner() {
    window.location.href = "tel:17896021990";
}
