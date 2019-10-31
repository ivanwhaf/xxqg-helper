/*
 * @Description: Auto.js学习强国助手 (6+6)+(6+6)+(1+1+2)=28分
 * @version: 2.5
 * @Author: Ivan
 * @Date: 2019-10-31
 */

var aCount=6;//文章学习篇数
var vCount=7;//视频学习个数
var cCount=2;//收藏+分享+评论次数

var aTime=10;//每篇文章学习-120秒
var VTime=1085;//新闻联播正片学习-18分钟
var vTime=10;//新闻联播每个小新闻学习-10秒
var wTime=5;//等待强国app启动完毕的时间-5秒

var commentText=["支持党，支持国家！","为实现中华民族伟大复兴而不懈奋斗！","紧跟党走，毫不动摇！","不忘初心，牢记使命","努力奋斗，回报祖国！"];//评论内容，可自行修改，大于5个字便计分

/*
 * @description: 延时函数
 * @param: seconds-延迟秒数
 * @return: null
 */
function delay(seconds)
{
    sleep(1000*seconds);//sleep函数参数单位为毫秒所以乘1000
}

/*
 * @description: 文章学习计时(弹窗)函数
 * @param: n-文章标号 seconds-学习秒数
 * @return: null
 */
function article_timing(n,seconds)
{
    for(var i=0;i<seconds;i++)
    {
        delay(1);
        toast("第"+(n+1)+"篇文章"+"已经学习"+(i+1)+"秒,剩余"+(seconds-i-1)+"秒!");
        //toast(i/10);
        if(i%10==0)//每10秒滑动一次
        {
            if(i<=seconds/2)
            {
                swipe(300,1000,300,500,500);//向下滑动
            }
            else
            {
                swipe(300,500,300,1000,500);//向上滑动
            }
        }
    }
}

/*
 * @description: 视频学习计时(弹窗)函数
 * @param: n-视频标号 seconds-学习秒数
 * @return: null
 */
function video_timing(n,seconds)
{
    for(var i=0;i<seconds;i++)
    {
        delay(1);
        toast("第"+(n+1)+"个视频"+"已经学习"+(i+1)+"秒,剩余"+(seconds-i-1)+"秒!");
    }
}

/*
 * @description: 文章学习函数  (阅读文章+文章学习时长)---6+6=12分
 * @param: null
 * @return: null
 */
function articleStudy()
{
    while(!desc("学习").exists());//等待加载出主页
    desc("学习").click();//点击主页正下方的"学习"按钮
    delay(2);
    //var arr=["要闻","新思想","发布","实践","教育","人事","法纪","国际","纪实","时评","思考"]
    //var num=Math.round(Math.random()*10);//随机类别
    //click(arr[num]);//可自己选择学习的类别（目前不可用，有bug，auto.js的api不够完善）
    click("要闻");//点击要闻
    delay(2);

    var listView=className("ListView");//获取文章ListView控件用于翻页
    for(var i=0,t=0;i<aCount;)
    {
        //var a=className("FrameLayout").depth(21).row(i).findOne();//第一篇文章所在控件(该方法有bug已弃用,用下面的方法点击文章)
        //a.click();
        if(click("“学习强国”学习平台",t)==true)//如果点击成功则进入文章页面,不成功意味着本页已经到底,要翻页
        {
            toast("即将学习第"+(i+1)+"篇文章!");
            var wave=Math.round(Math.random()*20)-10;//上下随机波动10秒 110-130之间
            article_timing(i,aTime+wave);//学习120秒，上下波动10秒
            if(i<cCount)//收藏分享2篇文章
            {
                CollectAndShare(i);//收藏+分享
                comment();
            }
            back();//返回要闻界面
            while(!desc("学习").exists());//等待加载出主页
            delay(2);
            i++;
            t++;//t为实际点击的文章在listView控件中的标号,和i不同,勿改动!
        }
        else
        {
            listView.scrollForward();//向下滑动(翻页)
            delay(2);
            t=1;
        }
    }
}

/*
 * @description: 视频学习函数  (视听学习+视听学习时长)---6+6=12分
 * @param: null
 * @return: null
 */
function videoStudy()
{
    click("电视台");//点击主页正下方的"电视台"按钮 (1.0版本为"视听学习")
    delay(2);
    click("联播频道");//点击联播频道看新闻联播
    delay(2);
    var listView=className("ListView");//获取listView视频列表控件用于翻页
    for(var i=0,t=0;i<vCount;)
    {
        if(click("央视网",t)==true)
        {
            if(i==0)
            {
                delay(1);
                a =classNameContains("View").depth(20).descContains("《新闻联播》").findOnce(0);
                if(a==null)
                {
                    back();
                    delay(1);
                    t++;
                    continue;
                }
            }

            toast("即将学习第"+(i+1)+"个视频!");
            if(i==0){
                video_timing(i,VTime);//学习新闻联播正片18分钟
            }
            else{
                video_timing(i,vTime);//学习新闻联播小片段10秒
            }
            back();//返回联播频道界面
            while(!desc("学习").exists());//等待加载出主页
            delay(2);
            i++;
            t++;//t为实际点击的文章在listView控件中的标号,和i不同,勿改动!
        }
        else
        {
            listView.scrollForward();//翻页
            delay(2);
            t=2;
        }
    }
}

/*
 * @description: 收藏加分享函数  (收藏+分享)---1+1=2分
 * @param: i-文章标号
 * @return: null
 */
function CollectAndShare(i)
{
    toast("正在进行第"+(i+1)+"次收藏和分享!");
    var collectIcon = classNameContains("ImageView").depth(10).findOnce(0);//右下角收藏按钮(2.1版本的depth为10)
    collectIcon.click();//点击收藏
    delay(2);
    var shareIcon = classNameContains("ImageView").depth(10).findOnce(1);//右下角分享按钮
    shareIcon.click();//点击分享

    while(!textContains("分享到学习强").exists());//等待弹出分享选项界面
    delay(1);
    click("分享到学习强国");
    delay(2);
    back();
    delay(2);
    /*
    while(!textContains("分享给微信").exists());//等待弹出分享选项界面
    delay(1);
    click("分享给微信\n好友");
    while(!text("多选").exists());//等待跳转到微信界面(微信界面含有"多选"字样)
    delay(2);
    back();//跳转到微信之后返回就行了,算一次分享
    delay(2);
    */
}

/*
 * @description: 评论函数---2分
 * @param: null
 * @return: null
 */
function comment()
{
    //var textView = classNameContains("TextView").depth(2).findOnce(0);//评论框
    //textView.click();//单击评论框
    click("欢迎发表你的观点");//单击评论框
    delay(1);
    var num=Math.round(Math.random()*(commentText.length-1));//随机数
    setText(commentText[num]);//输入评论内容
    delay(1);
    click("发布");//点击右上角发布按钮
    delay(2);
    click("删除");//删除该评论
    delay(2);
    click("确认");//确认删除
    delay(2);
}


function main()
{
    auto.waitFor();//等待获取无障碍辅助权限
    toast("学习强国助手启动中");
    if(!launchApp("学习强国"))//启动学习强国app
    {
        toast("找不到学习强国App!")
    }
    delay(wTime);//等应用启动完毕
    var start=new Date().getTime();
    articleStudy();//文章学习，包含点赞分享和评论
    //videoStudy();//视频学习
    var end=new Date().getTime();
    toast("运行结束"+"共耗时"+(end-start)/1000+"秒");
}

main();