// 获取页面上的各种元素
var loginSection = document.getElementById("login-section");
var taskSection = document.getElementById("task-section");
var loginBtn = document.getElementById("login-btn");
var logoutBtn = document.getElementById("logout-btn");
var addBtn = document.getElementById("add-btn");
var loginMsg = document.getElementById("login-msg");
var errorMsg = document.getElementById("error-msg");
var taskList = document.getElementById("task-list");
var datetimeDisplay = document.getElementById("datetime");

// 用来存所有任务的数组
var taskArray = [];

// 1. 登录功能
loginBtn.onclick = function() {
    var user = document.getElementById("username").value;
    var pass = document.getElementById("password").value;

    if (user === "student" && pass === "123") {
        loginSection.style.display = "none"; // 隐藏登录框
        taskSection.style.display = "block"; // 显示任务框
        loadTasks(); // 读取已保存的任务
    } else {
        loginMsg.innerText = "Wrong username or password!";
    }
};

// 2. 退出登录
logoutBtn.onclick = function() {
    loginSection.style.display = "block";
    taskSection.style.display = "none";
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    loginMsg.innerText = "";
};

// 3. 添加任务
addBtn.onclick = function() {
    var title = document.getElementById("task-title").value;
    var course = document.getElementById("task-course").value;
    var date = document.getElementById("task-date").value;
    var desc = document.getElementById("task-desc").value;

    // 验证：必填项不能为空
    if (title === "" || course === "" || date === "") {
        errorMsg.innerText = "Please fill in Title, Course and Date.";
        return; // 结束函数，不往下执行
    }

    // 验证：日期不能早于今天
    var today = new Date();
    today.setHours(0,0,0,0);
    var inputDate = new Date(date);
    if (inputDate < today) {
        errorMsg.innerText = "Due date cannot be in the past.";
        return;
    }

    errorMsg.innerText = ""; // 清除错误信息

    // 创建任务对象
    var newTask = {
        title: title,
        course: course,
        date: date,
        desc: desc
    };

    taskArray.push(newTask); // 加到数组里
    saveTasks(); // 保存到浏览器
    showTasks(); // 重新显示列表

    // 清空输入框
    document.getElementById("task-title").value = "";
    document.getElementById("task-course").value = "";
    document.getElementById("task-date").value = "";
    document.getElementById("task-desc").value = "";
};

// 4. 把任务显示在页面上
function showTasks() {
    taskList.innerHTML = ""; // 先清空列表

    for (var i = 0; i < taskArray.length; i++) {
        var task = taskArray[i];
        
        // 创建列表项 li
        var li = document.createElement("li");
        li.innerHTML = "<b>" + task.title + "</b> (" + task.course + ") - Due: " + task.date + 
                       "<br><small>" + task.desc + "</small> ";

        // 创建删除按钮
        var delBtn = document.createElement("button");
        delBtn.innerText = "Delete";
        delBtn.style.marginLeft = "10px";
        
        // 点击删除时，弹出确认框
        delBtn.onclick = function(index) {
            return function() {
                var check = confirm("Are you sure you want to delete this task?");
                if (check == true) {
                    taskArray.splice(index, 1); // 从数组中删掉
                    saveTasks();
                    showTasks();
                }
            };
        }(i); // 用闭包保存当前的 i 值

        // 创建编辑按钮
        var editBtn = document.createElement("button");
        editBtn.innerText = "Edit Date";
        editBtn.style.marginLeft = "5px";
        
        editBtn.onclick = function(index) {
            return function() {
                var newDate = prompt("Enter new due date (YYYY-MM-DD):", taskArray[index].date);
                if (newDate != null && newDate != "") {
                    taskArray[index].date = newDate;
                    saveTasks();
                    showTasks();
                }
            };
        }(i);

        li.appendChild(delBtn);
        li.appendChild(editBtn);
        taskList.appendChild(li);
    }
}

// 5. 保存数据到本地浏览器
function saveTasks() {
    // LocalStorage 只能存字符串，所以用 JSON.stringify 把数组转成字符串
    localStorage.setItem("myTasks", JSON.stringify(taskArray));
}

// 6. 从本地浏览器读取数据
function loadTasks() {
    var data = localStorage.getItem("myTasks");
    if (data != null) {
        taskArray = JSON.parse(data); // 把字符串转回数组
        showTasks();
    }
}

// 7. 底部显示当前日期和时间
function updateTime() {
    var now = new Date();
    datetimeDisplay.innerText = "Current time: " + now.toString();
}
setInterval(updateTime, 1000); // 每秒更新一次
updateTime()
