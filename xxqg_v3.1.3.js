"ui";
/*
runtime.loadJar('./jsoup-1.12.1.jar');

importClass(org.jsoup.Jsoup);
importClass(org.jsoup.nodes.Document);
importClass(org.jsoup.select.Elements);
*/

importClass(android.database.sqlite.SQLiteDatabase);

/**
 * @Description: Auto.js xxqg-helper (6+6)+(6+6)+(1+1+2)+6+6+1=41分
 * @version: 3.1.3
 * @Author: Ivan
 * @Date: 2020-6-10
 */

var aCount = 6;//文章默认学习篇数
var vCount = 6;//小视频默认学习个数
var cCount = 2;//收藏+分享+评论次数

var aTime = 103;//每篇文章学习-103秒 103*7≈720秒=12分钟
var vTime = 15;//每个小视频学习-15秒
var rTime = 1080;//广播收听-18分钟

var commentText = ["支持党，支持国家！", "为实现中华民族伟大复兴而不懈奋斗！", "紧跟党走，毫不动摇！",
    "不忘初心，牢记使命", "努力奋斗，报效祖国！"];//评论内容，可自行修改，大于5个字便计分

var aCatlog = "推荐"//文章学习类别，可自定义修改为“要闻”、“新思想”等

var lCount = 3;//挑战答题轮数
var qCount = 5;//挑战答题每轮答题数
var myScores = {};//分数

var customize_flag = false;//自定义运行标志

/**
 * @description: 延时函数
 * @param: seconds-延迟秒数
 * @return: null
 */
function delay(seconds) {
    sleep(1000 * seconds);//sleep函数参数单位为毫秒所以乘1000
}

/**
 * @description: 文章学习计时(弹窗)函数
 * @param: n-文章标号 seconds-学习秒数
 * @return: null
 */
function article_timing(n, seconds) {
    h = device.height;//屏幕高
    w = device.width;//屏幕宽
    x = (w / 3) * 2;
    h1 = (h / 6) * 5;
    h2 = (h / 6);
    for (var i = 0; i < seconds; i++) {
        while (!textContains("欢迎发表你的观点").exists())//如果离开了文章界面则一直等待
        {
            console.error("当前已离开第" + (n + 1) + "文章界面，请重新返回文章页面...");
            delay(2);
        }
        if (i % 5 == 0)//每5秒打印一次学习情况
        {
            console.info("第" + (n + 1) + "篇文章已经学习" + (i + 1) + "秒,剩余" + (seconds - i - 1) + "秒!");
        }
        delay(1);
        if (i % 10 == 0)//每10秒滑动一次，如果android版本<7.0请将此滑动代码删除
        {
            toast("这是防息屏toast,请忽视-。-");
            if (i <= seconds / 2) {
                swipe(x, h1, x, h2, 500);//向下滑动
            }
            else {
                swipe(x, h2, x, h1, 500);//向上滑动
            }
        }
    }
}

/**
 * @description: 视频学习计时(弹窗)函数
 * @param: n-视频标号 seconds-学习秒数
 * @return: null
 */
function video_timing_bailing(n, seconds) {
    for (var i = 0; i < seconds; i++) {
        while (!textContains("分享").exists())//如果离开了百灵小视频界面则一直等待
        {
            console.error("当前已离开第" + (n + 1) + "个百灵小视频界面，请重新返回视频");
            delay(2);
        }
        delay(1);
        console.info("第" + (n + 1) + "个小视频已经观看" + (i + 1) + "秒,剩余" + (seconds - i - 1) + "秒!");
    }
}

/**
 * @description: 新闻联播小视频学习计时(弹窗)函数
 * @param: n-视频标号 seconds-学习秒数
 * @return: null
 */
function video_timing_news(n, seconds) {
    for (var i = 0; i < seconds; i++) {
        while (!textContains("欢迎发表你的观点").exists())//如果离开了联播小视频界面则一直等待
        {
            console.error("当前已离开第" + (n + 1) + "个新闻小视频界面，请重新返回视频");
            delay(2);
        }
        delay(1);
        console.info("第" + (n + 1) + "个小视频已经观看" + (i + 1) + "秒,剩余" + (seconds - i - 1) + "秒!");
    }
}

/**
 * @description: 广播学习计时(弹窗)函数
 * @param: r_time-已经收听的时间 seconds-学习秒数
 * @return: null
 */
function radio_timing(r_time, seconds) {
    for (var i = 0; i < seconds; i++) {
        delay(1);
        if (i % 5 == 0)//每5秒打印一次信息
        {
            console.info("广播已经收听" + (i + 1 + r_time) + "秒,剩余" + (seconds - i - 1) + "秒!");
        }
        if (i % 15 == 0)//每15秒弹一次窗防止息屏
        {
            toast("这是防息屏弹窗，可忽略-. -");
        }
    }
}

/**
 * @description: 日期转字符串函数
 * @param: y,m,d 日期数字 2019 1 1
 * @return: s 日期字符串 "2019-xx-xx"
 */
function dateToString(y, m, d) {
    var year = y.toString();
    if ((m + 1) < 10) {
        var month = "0" + (m + 1).toString();
    }
    else {
        var month = (m + 1).toString();
    }
    if (d < 10) {
        var day = "0" + d.toString();
    }
    else {
        var day = d.toString();
    }
    var s = year + "-" + month + "-" + day;//年-月-日
    return s;
}

/**
 * @description: 获取当天日期字符串函数
 * @param: null
 * @return: s 日期字符串 "2019-xx-xx"
 */
function getTodayDateString() {
    var date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth();
    var d = date.getDate();

    var s = dateToString(y, m, d);//年-月-日
    return s
}

/**
 * @description: 获取昨天日期字符串函数
 * @param: null
 * @return: s 日期字符串 "2019-xx-xx"
 */
function getYestardayDateString() {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    var y = date.getFullYear();
    var m = date.getMonth();
    var d = date.getDate();
    var s = dateToString(y, m, d);//年-月-日
    return s
}

/**
 * @description: 文章学习函数  (阅读文章+文章学习时长)---6+6=12分
 * @param: null
 * @return: null
 */
function articleStudy() {
    while (!desc("学习").exists());//等待加载出主页
    desc("学习").click();//点击主页正下方的"学习"按钮
    delay(2);
    var listView = className("ListView");//获取文章ListView控件用于翻页
    click(aCatlog);
    delay(2);
    var zt_flag = false;//判断进入专题界面标志
    var fail = 0;//点击失败次数
    var date_string = getTodayDateString();//获取当天日期字符串

    for (var i = 0, t = 0; i < aCount;) {
        if (click(date_string, t) == true)//如果点击成功则进入文章页面,不成功意味着本页已经到底,要翻页
        {
            let n = 0;
            while (!textContains("欢迎发表你的观点").exists())//如果没有找到评论框则认为没有进入文章界面，一直等待
            {
                delay(1);
                console.warn("正在等待加载文章界面...");
                if (n > 3)//等待超过3秒则认为进入了专题界面，退出进下一篇文章
                {
                    console.warn("没找到评论框!该界面非文章界面!");
                    zt_flag = true;
                    break;
                }
                n++;
            }
            if (desc("展开").exists())//如果存在“展开”则认为进入了文章栏中的视频界面需退出
            {
                console.warn("进入了视频界面，退出并进下一篇文章!");
                t++;
                back();
                while (!desc("学习").exists());
                delay(0.5);
                click("电台");
                delay(1);
                click("最近收听");
                console.log("因为广播被打断，重新收听广播...");
                delay(1);
                back();
                while (!desc("学习").exists());
                desc("学习").click();
                delay(1);
                continue;
            }
            if (zt_flag == true)//进入专题页标志
            {
                console.warn("进入了专题界面，退出并进下一篇文章!")
                t++;
                back();
                delay(1);
                zt_flag = false;
                continue;
            }
            console.log("正在学习第" + (i + 1) + "篇文章...");
            fail = 0;//失败次数清0
            article_timing(i, aTime);
            if (i < cCount)//收藏分享2篇文章
            {
                CollectAndShare(i);//收藏+分享 若c运行到此报错请注释本行！
                Comment(i);//评论
            }
            back();//返回主界面
            while (!desc("学习").exists());//等待加载出主页
            delay(1);
            i++;
            t++;//t为实际点击的文章控件在当前布局中的标号,和i不同,勿改动!
        }
        else {
            if (i == 0)//如果第一次点击就没点击成功则认为首页无当天文章
            {
                date_string = getYestardayDateString();
                console.warn("首页没有找到当天文章，即将学习昨日新闻!");
                continue;
            }
            if (fail > 3)//连续翻几页没有点击成功则认为今天的新闻还没出来，学习昨天的
            {
                date_string = getYestardayDateString();
                console.warn("没有找到当天文章，即将学习昨日新闻!");
                continue;
            }
            if (!textContains(date_string).exists())//当前页面当天新闻
            {
                fail++;//失败次数加一
            }
            listView.scrollForward();//向下滑动(翻页)
            t = 0;
            delay(1.5);
        }
    }
}

/**
 * @description: “百灵”小视频学习函数
 * @param: vCount,vTime
 * @return: null
 */
function videoStudy_bailing(vCount, vTime) {
    h = device.height;//屏幕高
    w = device.width;//屏幕宽
    x = (w / 3) * 2;//横坐标2分之3处
    h1 = (h / 6) * 5;//纵坐标6分之5处
    h2 = (h / 6);//纵坐标6分之1处

    click("百灵");
    delay(2);
    click("竖");
    delay(2);
    var a = className("FrameLayout").depth(23).findOnce(0);//根据控件搜索视频框，但部分手机不适配，改用下面坐标点击
    a.click();
    //click((w/2)+random()*10,h/4);//坐标点击第一个视频
    delay(1);
    for (var i = 0; i < vCount; i++) {
        console.log("正在观看第" + (i + 1) + "个小视频");
        video_timing_bailing(i, vTime);//观看每个小视频
        if (i != vCount - 1) {
            swipe(x, h1, x, h2, 500);//往下翻（纵坐标从5/6处滑到1/6处）
        }
    }
    back();
    delay(2);
}

/**
 * @description:新闻联播小视频学习函数
 * @param: null
 * @return: null
 */
function videoStudy_news() {
    click("电视台");
    delay(1)
    click("联播频道");
    delay(2);
    var listView = className("ListView");//获取listView视频列表控件用于翻页
    let s = "中央广播电视总台";
    if (!textContains("中央广播电视总台")) {
        s = "央视网";
    }
    for (var i = 0, t = 1; i < vCount;) {
        if (click(s, t) == true) {
            console.log("即将学习第" + (i + 1) + "个视频!");
            video_timing_news(i, vTime);//学习每个新闻联播小片段
            back();//返回联播频道界面
            while (!desc("学习").exists());//等待加载出主页
            delay(1);
            i++;
            t++;
            if (i == 3) {//如果是平板等设备，请尝试修改i为合适值！
                listView.scrollForward();//翻页
                delay(2);
                t = 2;
            }
        }
        else {
            listView.scrollForward();//翻页
            delay(2);
            t = 3;
        }
    }
}


/**
 * @description: 听“电台”新闻广播函数  (视听学习+视听学习时长)---6+6=12分
 * @param: null
 * @return: null
 */
function listenToRadio() {
    click("电台");
    delay(1);
    click("听新闻广播");
    delay(2);
    if (textContains("最近收听").exists()) {
        click("最近收听");
        console.log("正在收听广播...");
        delay(1);
        back();//返回电台界面
        return;
    }
    if (textContains("推荐收听").exists()) {
        click("推荐收听");
        console.log("正在收听广播...");
        delay(1);
        back();//返回电台界面
    }
}

/**
 * @description: 收藏加分享函数  (收藏+分享)---1+1=2分
 * @param: i-文章标号
 * @return: null
 */
function CollectAndShare(i) {
    while (!textContains("欢迎发表你的观点").exists())//如果没有找到评论框则认为没有进入文章界面，一直等待
    {
        delay(1);
        console.log("等待进入文章界面")
    }
    console.log("正在进行第" + (i + 1) + "次收藏和分享...");

    var textOrder = text("欢迎发表你的观点").findOnce().drawingOrder();
    var collectOrder = textOrder + 2;
    var shareOrder = textOrder + 3;
    var collectIcon = className("ImageView").filter(function (iv) {
        return iv.drawingOrder() == collectOrder;
    }).findOnce();

    var shareIcon = className("ImageView").filter(function (iv) {
        return iv.drawingOrder() == shareOrder;
    }).findOnce();

    //var collectIcon = classNameContains("ImageView").depth(10).findOnce(0);//右下角收藏按钮
    collectIcon.click();//点击收藏
    console.info("收藏成功!");
    delay(1);

    //var shareIcon = classNameContains("ImageView").depth(10).findOnce(1);//右下角分享按钮
    shareIcon.click();//点击分享
    while (!textContains("分享到学习强").exists());//等待弹出分享选项界面
    delay(1);
    click("分享到学习强国");
    delay(2);
    console.info("分享成功!");
    back();//返回文章界面
    delay(1);

    collectIcon.click();//再次点击，取消收藏
    console.info("取消收藏!");
    delay(1);
}

/**
 * @description: 评论函数---2分
 * @param: i-文章标号
 * @return: null
 */
function Comment(i) {
    while (!textContains("欢迎发表你的观点").exists())//如果没有找到评论框则认为没有进入文章界面，一直等待
    {
        delay(1);
        console.log("等待进入文章界面")
    }
    click("欢迎发表你的观点");//单击评论框
    console.log("正在进行第" + (i + 1) + "次评论...");
    delay(1);
    var num = random(0, commentText.length - 1)//随机数
    setText(commentText[num]);//输入评论内容
    delay(1);
    click("发布");//点击右上角发布按钮
    console.info("评论成功!");
    delay(2);
    click("删除");//删除该评论
    delay(2);
    click("确认");//确认删除
    console.info("评论删除成功!");
    delay(1);
}


/**
 * @description: 本地频道
 * @param: null
 * @return: null
 */
function localChannel() {
    while (!desc("学习").exists());//等待加载出主页
    console.log("点击本地频道");
    if (text("新思想").exists()) {
        text("新思想").findOne().parent().parent().child(3).click();
        delay(3);
        className("android.support.v7.widget.RecyclerView").findOne().child(2).click();
        delay(2);
        console.log("返回主界面");
        back();
        text("新思想").findOne().parent().parent().child(0).click();
    } else {
        console.log("请手动点击本地频道！");
    }
}

/**
 * @description: 获取积分
 * @param: null
 * @return: null
 */
function getScores() {
    while (!desc("学习").exists());//等待加载出主页
    console.log("正在获取积分...");
    while (!text("积分明细").exists()) {
        if (id("comm_head_xuexi_score").exists()) {
            id("comm_head_xuexi_score").findOnce().click();
        } else if (text("积分").exists()) {
            text("积分").findOnce().parent().child(1).click();
        }
        delay(1);
    }

    let err = false;
    while (!err) {
        try {
            className("android.widget.ListView").findOnce().children().forEach(item => {
                let name = item.child(0).child(0).text();
                let str = item.child(2).text().split("/");
                let score = str[0].match(/[0-9][0-9]*/g);
                myScores[name] = score;
            });
            err = true;
        } catch (e) {
            console.log(e);
        }
    }
    console.log(myScores);

    aCount = 6 - myScores["阅读文章"];
    aTime = parseInt((6 - myScores["文章学习时长"]) * 120 / aCount) + 10;
    vCount = 6 - myScores["视听学习"];
    rTime = (6 - myScores["视听学习时长"]) * 180;

    console.log('剩余文章：' + aCount.toString() + '篇')
    console.log('剩余每篇文章学习时长：' + aTime.toString() + '秒')
    console.log('剩余视频：' + vCount.toString() + '个')
    console.log('剩视听学习时长：' + rTime.toString() + '秒')

    delay(1);
    back();
    delay(1);
}

/**
 * @description: 启动app
 * @param: null
 * @return: null
 */
function start_app() {
    console.setPosition(0, device.height / 2);//部分华为手机console有bug请注释本行
    console.show();//部分华为手机console有bug请注释本行
    console.log("正在启动app...");
    if (!launchApp("学习强国"))//启动学习强国app
    {
        console.error("找不到学习强国App!");
        return;
    }
    while (!desc("学习").exists()) {
        console.log("正在等待加载出主页");
        delay(1);
    }
    delay(1);
}

//主函数
function main() {
    if (!judge_tiku_existence()) {//题库不存在则退出
        return;
    }
    start_app();//启动app
    var start = new Date().getTime();//程序开始时间

    if (customize_flag == true) {
        //自定义学习，各项目执行顺序可换
        localChannel();//本地频道
        challengeQuestion();//挑战答题
        dailyQuestion();//每日答题
        videoStudy_news();//看视频
        listenToRadio();//听电台广播
        var r_start = new Date().getTime();//广播开始时间
        articleStudy();//学习文章，包含点赞、分享和评论
        if (rTime != 0) {
            listenToRadio();//继续听电台
        }
        var end = new Date().getTime();//广播结束时间
        var radio_time = (parseInt((end - r_start) / 1000));//广播已经收听的时间
        radio_timing(parseInt((end - r_start) / 1000), rTime - radio_time);//广播剩余需收听时间
    }
    else {
        getScores();//获取积分
        if (myScores['本地频道'] != 1) {
            localChannel();//本地频道
        }
        if (myScores['挑战答题'] != 6) {
            challengeQuestion();//挑战答题
        }
        if (myScores['每日答题'] != 6) {
            dailyQuestion();//每日答题
        }
        if (vCount != 0) {
            videoStudy_news();//看视频
        }
        if (rTime != 0) {
            listenToRadio();//听电台广播
        }
        var r_start = new Date().getTime();//广播开始时间
        articleStudy();//学习文章，包含点赞、分享和评论
        if (rTime != 0) {
            listenToRadio();//继续听电台
        }
        var end = new Date().getTime();//广播结束时间
        var radio_time = (parseInt((end - r_start) / 1000));//广播已经收听的时间
        radio_timing(parseInt((end - r_start) / 1000), rTime - radio_time);//广播剩余需收听时间
    }

    end = new Date().getTime();
    console.log("运行结束,共耗时" + (parseInt(end - start)) / 1000 + "秒");
}


/********************************************UI部分***********************************************/
auto.waitFor();//等待获取无障碍辅助权限
ui.layout(
    <vertical>
        <text textSize="16sp" textColor="red" text="欢迎使用xxqg-helper!" />
        <button id="all" h="90" text="完整运行" />
        <button id="customize" h="90" text="自定义运行（文章视频数量按照自定义值）" />
        <button id="cq" h="60" text="挑战答题" />
        <button id="dq" h="60" text="每日答题" />
        <button id="stop" h="70" text="停止运行" />

        <horizontal>
            <text textSize="16sp" marginLeft="15" textColor="black" text="文章学习类别:" />
            <input id="acatlog" text="" />
        </horizontal>

        <horizontal>
            <text textSize="16sp" marginLeft="15" textColor="black" text="文章数量(个):" />
            <input id="acount" w="30" text="" />
            <text textSize="16sp" marginLeft="15" textColor="black" text="视频数量(个):" />
            <input id="vcount" w="30" text="" />
        </horizontal>

        <horizontal>
            <text textSize="16sp" marginLeft="15" textColor="black" text="挑战答题轮数:" />
            <input id="lcount" w="30" text="" />
            <text textSize="16sp" marginLeft="15" textColor="black" text="挑战答题每轮答题数:" />
            <input id="qcount" w="30" text="" />
        </horizontal>


        <button w="250" layout_gravity="center" id="about" text="关于本助手" />
    </vertical>
);

ui.acatlog.setText(aCatlog.toString());
ui.acount.setText(aCount.toString());
ui.vcount.setText(vCount.toString());
ui.lcount.setText(lCount.toString());
ui.qcount.setText(qCount.toString());

var thread = null;

ui.all.click(function () {
    if (thread != null && thread.isAlive()) {
        alert("注意!", "当前程序正在运行，请结束之前进程");
        return;
    }
    toast("开始完整运行");
    thread = threads.start(function () {
        aCatlog = ui.acatlog.getText();
        lCount = parseInt(ui.lcount.getText());
        qCount = parseInt(ui.qcount.getText());
        main();
    });
});

ui.customize.click(function () {
    if (thread != null && thread.isAlive()) {
        alert("注意!", "当前程序正在运行，请结束之前进程");
        return;
    }
    toast("开始自定义运行");
    thread = threads.start(function () {
        aCount = parseInt(ui.acount.getText());
        vCount = parseInt(ui.vcount.getText());
        aCatlog = ui.acatlog.getText();
        lCount = parseInt(ui.lcount.getText());
        qCount = parseInt(ui.qcount.getText());
        customize_flag = true;
        console.log('文章数量：' + aCount.toString() + '篇')
        console.log('视频数量：' + vCount.toString() + '个')
        console.log('类别：' + aCatlog)
        main();
    });
});


ui.cq.click(function () {
    if (thread != null && thread.isAlive()) {
        alert("注意!", "当前程序正在运行，请结束之前进程");
        return;
    }
    thread = threads.start(function () {
        lCount = parseInt(ui.lcount.getText());
        qCount = parseInt(ui.qcount.getText());
        start_app();
        challengeQuestion();
    });
});

ui.dq.click(function () {
    if (thread != null && thread.isAlive()) {
        alert("注意!", "当前程序正在运行，请结束之前进程");
        return;
    }
    thread = threads.start(function () {
        start_app();
        dailyQuestion();
    });
});

ui.stop.click(function () {
    if (thread != null && thread.isAlive()) {
        threads.shutDownAll();
        toast("已停止运行！")
        console.hide();
    }
    else {
        toast("当前没有线程在运行！")
    }
});
/*
ui.update.click(function () {
    if (thread != null && thread.isAlive()) {
        alert("注意!", "当前程序正在运行，请结束之前进程");
        return;
    }

    confirm("确认更新题库吗?")
    .then(c => {
        if(c){
            console.show();
            thread = threads.start(function () {
                updateTikunet()
            });
            console.hide();
        }
    });

});
*/

ui.about.click(function () {
    alert("xxqg-helper", "本脚本只可用于个人学习Auto.js，不得用于一切商业或违法用途，否则追究责任！造成的后果自负！\n 任何问题请上github交流!");
});


/*************************************************挑战答题部分******************************************************/
/**
 * @description: 判断题库是否存在
 * @param: null
 * @return: null
 */
function judge_tiku_existence() {
    var dbName = "tiku.db";//题库文件名
    var path = files.path(dbName);
    if (!files.exists(path)) {
        //files.createWithDirs(path);
        console.error("未找到题库！请将题库文件放置与js文件同一目录下再运行！");
        return false;
    }
    var db = SQLiteDatabase.openOrCreateDatabase(path, null);
    var createTable = "\
    CREATE TABLE IF NOT EXISTS tikuNet(\
    question CHAR(253),\
    answer CHAR(100)\
    );";
    db.execSQL(createTable);
    return true;
}

/**
 * @description: 从数据库中搜索答案
 * @param: question 问题
 * @return: answer 答案
 */
function getAnswer(question, table_name) {
    var dbName = "tiku.db";//题库文件名
    var path = files.path(dbName);

    var db = SQLiteDatabase.openOrCreateDatabase(path, null);

    sql = "SELECT answer FROM " + table_name + " WHERE question LIKE '" + question + "%'"
    var cursor = db.rawQuery(sql, null);
    if (cursor.moveToFirst()) {
        var answer = cursor.getString(0);
        cursor.close();
        return answer;
    }
    else {
        console.error("题库中未找到答案");
        cursor.close();
        return '';
    }
}

/**
 * @description: 增加或更新数据库
 * @param: sql
 * @return: null
 */
function insertOrUpdate(sql) {
    var dbName = "tiku.db";
    var path = files.path(dbName);
    if (!files.exists(path)) {
        //files.createWithDirs(path);
        console.error("未找到题库!请将题库放置与js同一目录下");
    }
    var db = SQLiteDatabase.openOrCreateDatabase(path, null);
    db.execSQL(sql);
    db.close();
}

function indexFromChar(str) {
    return str.charCodeAt(0) - "A".charCodeAt(0);
}

/**
 * @description: 每次答题循环
 * @param: conNum 连续答对的次数
 * @return: null
 */
function challengeQuestionLoop(conNum) {
    if (conNum >= qCount)//答题次数足够退出，每轮5次
    {
        let listArray = className("ListView").findOnce().children();//题目选项列表
        let i = random(0, listArray.length - 1);
        console.log("本轮次数足够，随机点击一个答案，答错进入下一轮");
        listArray[i].child(0).click();//随意点击一个答案
        console.log("-----------------------------------------------------------");
        return;
    }

    if (className("ListView").exists()) {
        var question = className("ListView").findOnce().parent().child(0).text();
        console.log((conNum + 1).toString() + ".题目：" + question);
    }
    else {
        console.error("提取题目失败!");
        let listArray = className("ListView").findOnce().children();//题目选项列表
        let i = random(0, listArray.length - 1);
        console.log("随机点击一个");
        listArray[i].child(0).click();//随意点击一个答案
        return;
    }

    var chutiIndex = question.lastIndexOf("出题单位");
    if (chutiIndex != -1) {
        question = question.substring(0, chutiIndex - 2);
    }

    question = question.replace(/\s/g, "");

    var options = [];//选项列表
    if (className("ListView").exists()) {
        className("ListView").findOne().children().forEach(child => {
            var answer_q = child.child(0).child(1).text();
            options.push(answer_q);
        });
    } else {
        console.error("答案获取失败!");
        return;
    }

    var answer = getAnswer(question, 'tiku');
    if (answer.length == 0) {//tiku表中没有则到tikuNet表中搜索答案
        answer = getAnswer(question, 'tikuNet');
    }

    console.info("答案：" + answer);

    if (/^[a-zA-Z]{1}$/.test(answer)) {//如果为ABCD形式
        var indexAnsTiku = indexFromChar(answer.toUpperCase());
        answer = options[indexAnsTiku];
        toastLog("answer from char=" + answer);
    }

    let hasClicked = false;
    let listArray = className("ListView").findOnce().children();//题目选项列表
    if (answer == "")//如果没找到答案
    {
        let i = random(0, listArray.length - 1);
        console.error("没有找到答案，随机点击一个");
        listArray[i].child(0).click();//随意点击一个答案
        hasClicked = true;
        console.log("-----------------------------------------------------------");
    }
    else//如果找到了答案
    {
        listArray.forEach(item => {
            var listDescStr = item.child(0).child(1).text();
            if (listDescStr == answer) {
                item.child(0).click();//点击答案
                hasClicked = true;
                console.log("-----------------------------------------------------------");
            }
        });
    }
    if (!hasClicked)//如果没有点击成功
    {
        console.error("未能成功点击，随机点击一个");
        let i = random(0, listArray.length - 1);
        listArray[i].child(0).click();//随意点击一个答案
        console.log("-----------------------------------------------------------");
    }
}

/**
 * @description: 挑战答题
 * @param: null
 * @return: null
 */
function challengeQuestion() {
    text("我的").click();
    while (!textContains("我要答题").exists());
    delay(1);
    click("我要答题");
    while (!text("挑战答题").exists());
    delay(1);
    text("挑战答题").click();
    console.log("开始挑战答题")
    delay(4);
    let conNum = 0;//连续答对的次数
    let lNum = 1;//轮数
    while (true) {
        challengeQuestionLoop(conNum);
        delay(3);
        if (text("v5IOXn6lQWYTJeqX2eHuNcrPesmSud2JdogYyGnRNxujMT8RS7y43zxY4coWepspQkvw" +
            "RDTJtCTsZ5JW+8sGvTRDzFnDeO+BcOEpP0Rte6f+HwcGxeN2dglWfgH8P0C7HkCMJOAAAAAElFTkSuQmCC").exists())//遇到❌号，则答错了,不再通过结束本局字样判断
        {
            if (lNum >= lCount && conNum >= qCount) {
                console.log("挑战答题结束！返回主页！");
                /* 回退4次返回主页 */
                back(); delay(1);
                back(); delay(1);
                back(); delay(1);
                back(); delay(1);
                break;
            }
            else {
                console.log("等10秒开始下一轮...")
                delay(8);//等待10秒才能开始下一轮
                back();
                //desc("结束本局").click();//有可能找不到结束本局字样所在页面控件，所以直接返回到上一层
                delay(1);
                //desc("再来一局").click();
                back();
                while (!text("挑战答题").exists());
                delay(1);
                text("挑战答题").click();
                delay(4);
                if (conNum >= qCount) {
                    lNum++;
                }
                conNum = 0;
            }
            console.warn("第" + lNum.toString() + "轮开始...")
        }
        else//答对了
        {
            conNum++;
        }
    }
}

/*************************************************每日答题部分***************************************************/

/**
 * @description: 获取填空题题目数组
 * @param: null
 * @return: questionArray
 */
function getFitbQuestion() {
    var questionCollections = className("EditText").findOnce().parent();
    var questionArray = [];
    var findBlank = false;
    var blankCount = 0;
    var blankNumStr = "";
    questionCollections.children().forEach(item => {
        if (item.className() != "android.widget.EditText") {
            if (item.text() != "") {//题目段
                if (findBlank) {
                    blankNumStr = "|" + blankCount.toString();
                    questionArray.push(blankNumStr);
                    findBlank = false;
                }
                questionArray.push(item.text());
            }
            else {
                findBlank = true;
                blankCount += 1;
            }
        }
    });
    return questionArray;
}


/**
 * @description: 获取选择题题目数组
 * @param: null
 * @return: questionArray
 */
function getChoiceQuestion() {
    var questionCollections = className("ListView").findOnce().parent().child(1);
    var questionArray = [];
    questionArray.push(questionCollections.text());
    return questionArray;
}


/**
 * @description: 获取提示字符串
 * @param: null
 * @return: tipsStr
 */
function getTipsStr() {
    var tipsStr = "";
    while (tipsStr == "") {
        if (text("查看提示").exists()) {
            var seeTips = text("查看提示").findOnce();
            seeTips.click();
            delay(1);
            click(device.width * 0.5, device.height * 0.41);
            delay(1);
            click(device.width * 0.5, device.height * 0.35);
        } else {
            console.error("未找到查看提示");
        }
        if (text("提示").exists()) {
            var tipsLine = text("提示").findOnce().parent();
            //获取提示内容
            var tipsView = tipsLine.parent().child(1).child(0);
            tipsStr = tipsView.text();
            //关闭提示
            tipsLine.child(1).click();
            break;
        }
        delay(1);
    }
    return tipsStr;
}


/**
 * @description: 从提示中获取填空题答案
 * @param: timu, tipsStr
 * @return: ansTips
 */
function getAnswerFromTips(timu, tipsStr) {
    var ansTips = "";
    for (var i = 1; i < timu.length - 1; i++) {
        if (timu[i].charAt(0) == "|") {
            var blankLen = timu[i].substring(1);
            var indexKey = tipsStr.indexOf(timu[i + 1]);
            var ansFind = tipsStr.substr(indexKey - blankLen, blankLen);
            ansTips += ansFind;
        }
    }
    return ansTips;
}

/**
 * @description: 根据提示点击选择题选项
 * @param: tipsStr
 * @return: clickStr
 */
function clickByTips(tipsStr) {
    var clickStr = "";
    var isFind = false;
    if (className("ListView").exists()) {
        var listArray = className("ListView").findOne().children();
        listArray.forEach(item => {
            var ansStr = item.child(0).child(2).text();
            if (tipsStr.indexOf(ansStr) >= 0) {
                item.child(0).click();
                clickStr += item.child(0).child(1).text().charAt(0);
                isFind = true;
            }
        });
        if (!isFind) { //没有找到 点击第一个
            listArray[0].child(0).click();
            clickStr += listArray[0].child(0).child(1).text().charAt(0);
        }
    }
    return clickStr;
}


/**
 * @description: 根据答案点击选择题选项
 * @param: answer
 * @return: null
 */
function clickByAnswer(answer) {
    if (className("ListView").exists()) {
        var listArray = className("ListView").findOnce().children();
        listArray.forEach(item => {
            var listIndexStr = item.child(0).child(1).text().charAt(0);
            //单选答案为非ABCD
            var listDescStr = item.child(0).child(2).text();
            if (answer.indexOf(listIndexStr) >= 0 || answer == listDescStr) {
                item.child(0).click();
            }
        });
    }
}

/**
 * @description: 检查答案是否正确，并更新数据库
 * @param: question, ansTiku, answer
 * @return: null
 */
function checkAndUpdate(question, ansTiku, answer) {
    if (className("Button").desc("下一题").exists() || className("Button").desc("完成").exists()) {//答错了
        swipe(100, device.height - 100, 100, 100, 500);
        var nCout = 0
        while (nCout < 5) {
            if (descStartsWith("正确答案").exists()) {
                var correctAns = descStartsWith("正确答案").findOnce().desc().substr(5);
                console.info("正确答案是：" + correctAns);
                if (ansTiku == "") { //题库为空则插入正确答案                
                    var sql = "INSERT INTO tiku VALUES ('" + question + "','" + correctAns + "','')";
                } else { //更新题库答案
                    var sql = "UPDATE tiku SET answer='" + correctAns + "' WHERE question LIKE '" + question + "'";
                }
                insertOrUpdate(sql);
                console.log("更新题库答案...");
                delay(1);
                break;
            } else {
                var clickPos = className("android.webkit.WebView").findOnce().child(2).child(0).child(1).bounds();
                click(clickPos.left + device.width * 0.13, clickPos.top + device.height * 0.1);
                console.error("未捕获正确答案，尝试修正");
            }
            nCout++;
        }
        if (className("Button").exists()) {
            className("Button").findOnce().click();
        } else {
            click(device.width * 0.85, device.height * 0.06);
        }
    } else { //正确后进入下一题，或者进入再来一局界面
        if (ansTiku == "" && answer != "") { //正确进入下一题，且题库答案为空              
            var sql = "INSERT INTO tiku VALUES ('" + question + "','" + answer + "','')";
            insertOrUpdate(sql);
            console.log("更新题库答案...");
        }
    }
}


/**
 * @description: 每日答题循环
 * @param: null
 * @return: null
 */
function dailyQuestionLoop() {
    if (textStartsWith("填空题").exists()) {
        var questionArray = getFitbQuestion();
    }
    else if (textStartsWith("多选题").exists() || textStartsWith("单选题").exists()) {
        var questionArray = getChoiceQuestion();
    }

    var blankArray = [];
    var question = "";
    questionArray.forEach(item => {
        if (item != null && item.charAt(0) == "|") { //是空格数
            blankArray.push(item.substring(1));
        } else { //是题目段
            question += item;
        }
    });
    question = question.replace(/\s/g, "");
    console.log("题目：" + question);

    var ansTiku = getAnswer(question, 'tiku');

    if (ansTiku.length == 0) {//tiku表中没有则到tikuNet表中搜索答案
        ansTiku = getAnswer(question, 'tikuNet');
    }
    var answer = ansTiku.replace(/(^\s*)|(\s*$)/g, "");

    if (text("填空题").exists()) {
        if (answer == "") {
            var tipsStr = getTipsStr();
            answer = getAnswerFromTips(questionArray, tipsStr);
            console.info("提示中的答案：" + answer);
            setText(0, answer.substr(0, blankArray[0]));
            if (blankArray.length > 1) {
                for (var i = 1; i < blankArray.length; i++) {
                    setText(i, answer.substr(blankArray[i - 1], blankArray[i]));
                }
            }
        } else {
            console.info("答案：" + answer);
            setText(0, answer.substr(0, blankArray[0]));
            if (blankArray.length > 1) {
                for (var i = 1; i < blankArray.length; i++) {
                    setText(i, answer.substr(blankArray[i - 1], blankArray[i]));
                }
            }
        }
    }
    else if (text("多选题").exists() || text("单选题").exists()) {
        if (answer == "") {
            var tipsStr = getTipsStr();
            answer = clickByTips(tipsStr);
            console.info("提示中的答案：" + answer);
        } else {
            console.info("答案：" + ansTiku);
            clickByAnswer(answer);
        }
    }

    delay(0.5);

    if (text("确定").exists()) {
        text("确定").click();
        delay(0.5);
    }
    else {
        console.warn("未找到右上角确定按钮控件，根据坐标点击");
        click(device.width * 0.85, device.height * 0.06);//右上角确定按钮，根据自己手机实际修改
    }

    if (text("下一题").exists()) {
        if (text("下一题").exists()) {
            text("下一题").click();
            delay(0.5);
        }
        else {
            console.warn("未找到右上角下一题按钮控件，根据坐标点击");
            click(device.width * 0.85, device.height * 0.06);//右上角确定按钮，根据自己手机实际修改
        }
    }

    if (text("完成").exists()) {
        if (text("完成").exists()) {
            text("完成").click();
            delay(0.5);
        }
        else {
            console.warn("未找到右上角完成按钮控件，根据坐标点击");
            click(device.width * 0.85, device.height * 0.06);//右上角确定按钮，根据自己手机实际修改
        }
    }

    checkAndUpdate(question, ansTiku, answer);
    console.log("-----------------------------------------------------------");
    delay(2);
}

/**
 * @description: 每日答题
 * @param: null
 * @return: null
 */
function dailyQuestion() {
    text("我的").click();
    while (!textContains("我要答题").exists());
    delay(1);
    click("我要答题");
    while (!text("每日答题").exists());
    delay(1);
    text("每日答题").click();
    console.log("开始每日答题")
    delay(2);
    let dlNum = 0;//每日答题轮数
    while (true) {
        dailyQuestionLoop();
        if (text("再来一组").exists()) {
            delay(2);
            dlNum++;
            if (!text("领取奖励已达今日上限").exists()) {
                text("再来一组").click();
                console.warn("第" + (dlNum + 1).toString() + "轮答题:");
                delay(1);
            }
            else {
                console.log("每日答题结束！返回主页！")
                text("返回").click(); delay(0.5);
                back(); delay(1);
                back(); delay(1);
                break;
            }
        }
    }
}


/**
 * @description: 每周答题
 * @param: null
 * @return: null
 */
function weeklyQuestion() {
    text("我的").click();
    while (!textContains("我要答题").exists());
    delay(1);
    click("我要答题");
    while (!desc("每周答题").exists());
    delay(1);
    desc("每周答题").click();
    console.log("开始每周答题")
    delay(2);
    while (true) {
        dailyQuestionLoop();
        if (desc("返回").exists()) {
            back(); delay(1);
            back(); delay(1);
            back(); delay(1);
            back(); delay(1);
            break;
        }
    }
    console.log("每周答题结束")
}


/*************************************************更新题库部分***************************************************/
/**
 * @description: 更新数据库tikuNet表
 * @param  {} liArray li列表，包含题目和答案
 */
function CreateAndInsert(liArray) {

    var dbName = "tiku.db";//题库文件名
    var path = files.path(dbName);
    //确保文件存在，若题库不存在则创建一个空db文件
    if (!files.exists(path)) {
        files.createWithDirs(path);
    }
    //创建或打开数据库
    var db = SQLiteDatabase.openOrCreateDatabase(path, null);
    var createTable = "\
    CREATE TABLE IF NOT EXISTS tikuNet(\
    question CHAR(253),\
    answer CHAR(100)\
    );";
    var cleanTable = "DELETE FROM tikuNet";
    db.execSQL(createTable);
    db.execSQL(cleanTable);
    console.log("创建打开清空表tikuNet!");

    var sql = "INSERT INTO tikuNet (question, answer) VALUES (?, ?)";
    db.beginTransaction();
    var stmt = db.compileStatement(sql);
    for (var li = 0, len = liArray.size(); li < len; li++) {
        var liText = liArray.get(li).text();
        var timuPos = liText.indexOf("】") + 1;
        var tiMu = liText.substring(timuPos).replace(/_/g, "");
        var daAn = liArray.get(li).select("b").first().text();
        console.log(util.format("题目:%s\n答案:%s"), tiMu, daAn);
        stmt.bindString(1, tiMu);
        stmt.bindString(2, daAn);
        stmt.executeInsert();
        stmt.clearBindings();
    }
    db.setTransactionSuccessful();
    db.endTransaction();
    db.close();
    return true;
}


/**
 * @description: 更新题库
 * @param: null
 * @return: null
 */
function updateTikunet() {
    console.log("开始下载题库json数据...");
    var htmlString = Jsoup.connect("http://49.235.90.76:5000").maxBodySize(0).timeout(10000).get();
    var htmlArray = Jsoup.parse(htmlString);
    var liArray = htmlArray.select("li:has(b)");
    console.log('题库下载完毕，', util.format("题目总数：%s"), liArray.size());
    //执行更新
    console.log("开始更新数据库...");
    CreateAndInsert(liArray)
    console.log("数据库更新完毕！");
}
/**

@description: 学习平台订阅

@param: null

@return: null
*/
function dingyue()
{
h=device.height;//屏幕高
w=device.width;//屏幕宽
x=(w/3)*2;//横坐标2分之3处
h1=(h/6)*5;//纵坐标6分之5处
h2=(h/6);//纵坐标6分之1处

click("订阅");
sleep(random(1000,2000)) ;
click("添加");
sleep(random(1000,2000)) ;
var i=0
while(i<cCount){
var object = desc("订阅").find();
if (!object.empty()) {

     // 遍历订阅图标
     object.forEach(function (currentValue, index) {
        
         // currentValue:订阅按钮           
         if (currentValue && i<cCount) {
             var like = currentValue.parent()

             if (like.click()) {
                 console.log("订阅成功")
                 i++;
                 sleep(random(1000,2000))  //随机延时
             } else {
                 console.log("Error：订阅失败")
             }
         }
     })

 } else if( text("你已经看到我的底线了").exists()){
     console.log("Error：没有可以订阅的平台了!");
     break;}
     else{
     swipe(x,h1,x,h2,500);
    
 }
}
back();
sleep(random(1000,2000)) ;
}

getScores();//获取积分 ，在获取积分后面增加一个if语句
if (myScores['订阅'] != 1) {
dingyue();//订阅
}

在function main() 中增加一行调用

dingyue();//订阅学习平台

本人初学者，写的不好，请大家指正
