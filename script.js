<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11.5.1/dist/sweetalert2.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.5.1/dist/sweetalert2.all.min.js"></script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>通知车主挪车</title>
</head>
<body>
    <div class="container">
        <h1>通知车主挪车</h1>
        <p>如需通知车主，请点击以下按钮</p>
        <button class="notify-btn" onclick="notifyOwner()">通知车主挪车</button>
        <button class="call-btn" onclick="callOwner()">拨打车主电话</button>
    </div>

    <script>
        const queryParams = new URLSearchParams(window.location.search);
        const userUid = queryParams.get("uid");
        const appToken = "AT_8FQFDxpI2qvtDTrQG7jUCj6aTHOjgi2W";
        let lastNotifyTime = 0;

        if (!userUid) {
            Swal.fire({
                icon: "error",
                title: "无效用户",
                text: "链接中缺少用户标识，请联系管理员。",
            });
        }

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

            fetch("https://wxpusher.zjiecode.com/api/send/message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    appToken: appToken,
                    content: "您好，有人需要您挪车，请及时处理。",
                    contentType: 1,
                    uids: [userUid],
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
                        lastNotifyTime = currentTime;
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

        function callOwner() {
            window.location.href = "tel:17896021990";
        }
    </script>
</body>
</html>
