function learn_one()
{
	click(500,1000);//进入新闻
	sleep(5000);

	for(var i=0;i<8;i++)//向下翻
	{
		swipe(500,1500,500,500,100);
		sleep(7000);
	}

	for(var i=0;i<8;i++)//向上翻
	{
		swipe(500,500,500,1500,100);
		sleep(1000);
	}

	click(70,145); //返回
	sleep(1000);
	swipe(500,1000,500,730,100);//向下翻选取下一个新闻
	sleep(1000);
}

function audiovisual_learn_one()
{
	click(500,1000);
	sleep(93000);
	click(70,145);//返回
	sleep(1000);
	swipe(500,1000,500,600,100);
	sleep(1000);
}

function learn()
{
	click(540,2080);//学习
	sleep(1000);
	click(1010,270);//选取频道
	sleep(2000);
	var arr=[[410,410],[660,410],[410,550],[660,550],[410,680],[160,960],[410,960],[660,960],[160,1100],[660,1100],[920,1100]];
	//要闻、新思想、发布、实践、教育、人事、法纪、国际、纪实、时评、思考
	var num=Math.round(Math.random()*10);
	var x=arr[num][0];
	var y=arr[num][1];
	click(x,y);
	sleep(3000);
	for(var i=0;i<12;i++)
	{
		toast("开始学习第"+(i+1).toString()+"个文章");
		learn_one();
	}
}

function audiovisual_learn()
{	
	click(725,2070);//视听学习
	sleep(3000);
	click(580,270);//联播频道
	//click(770,270);//听广播
	sleep(3000);
	/*
	var x=180;
	var y=1140;
	for(var i=0;i<2;i++)
	{
		x=180;
		for(var j=0;j<3;j++)
		{
			click(x,y);
			sleep(185000);
			x+=360;
		}
		y+=300;
	}
	*/
	for(var i=0;i<12;i++)
	{
		toast("开始学习第"+(i+1).toString()+"个视频");
		audiovisual_learn_one();
	}
}
function main()
{
	toast("学习强国助手开始运行");
	launchApp("学习强国");
	sleep(15000);
	learn();
	audiovisual_learn();
	toast("学习强国助手运行结束");
}

main();
