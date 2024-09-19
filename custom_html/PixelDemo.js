// Copyright Epic Games, Inc. All Rights Reserved.
// function myPatrolEventHandler(data) {
//     console.log("Received patrol data from UE:", data);
//     // 在这里处理从UE传来的巡查数据，例如更新UI或记录巡查点
//     handlePatrolData(data);
// }

// // 定义处理巡查数据的函数
// function handlePatrolData(data) {
//     // 假设data包含index字段，表示巡查到的点位
//     let index = data.index;
//     console.log("巡查到点位: ", index);
//     // 你可以在这里添加更多处理逻辑
// }

// // 在页面加载完成后添加事件监听器
// window.addEventListener('load', function() {
//     // 其他初始化代码，例如设置视频流等
//     createWebRtcVideo();

//     // 添加PatrolEvent事件监听器
//     addResponseEventListener("PatrolEvent", myPatrolEventHandler);
// });

// ————————————————————————————————————————————————————————

function gateoperation(category, index, isalreadyopen,range,iconvisible) {
    let descriptor = {
        Category: category,//UE必需标签，闸门操作 category默认为0,
        Index: index,//闸门序号默认为0~2，对对应序号闸门进行操作，-1为进行全部操作
		Isalreadyopen: isalreadyopen,//0为关闭闸门，1为开启闸门
		Range:range,//闸门开度
		Iconvisible:iconvisible//闸门Icon数据是否显示，0为隐藏1为显示
    };
    emitUIInteraction(descriptor);
    console.log(descriptor);
}

function waterleveloperation(category, index, waterlevel) {
    let descriptor = {
        Category: category,//UE必需标签，水位操作 category默认为1,
        Index: index,//0为上游水位，1为下游水位，2为瞬时流量
		Waterlevel: waterlevel,//水位或者流量信息信息(同时会修改标签)
    };
    emitUIInteraction(descriptor);
    console.log(descriptor);
}

function flowoperation(category, index, flow) {
    let descriptor = {
        Category: category,//UE必需标签，流速操作 category默认为2,
        Index: index,//0为上游水位流速，1为下游水位流速
		Flow: flow,//流速信息
    };
    emitUIInteraction(descriptor);
    console.log(descriptor);
}

function vediopatrol(category, index) {
    let descriptor = {
        Category: category,//UE必需标签，视频巡查 category默认为3,
        Index: index,//0为初始视角，其余为摄像头点位
    };
    emitUIInteraction(descriptor);
    console.log(descriptor);
}

function droneWannder(category, state) {
    let descriptor = {
        Category: category,//UE必需标签，无人机漫游 category默认为4,
        State: state,//0为结束事件，1为开始事件
    };
    emitUIInteraction(descriptor);
    console.log(descriptor);
}

function sceneiconvisible(category, index,visible) {
    let descriptor = {
        Category: category,//UE必需标签，场景标签显隐 category默认为5,
        Index: index,//0为闸门标签，1为水位标签，2为瞬时流量标签
		Visible: visible//0为隐藏，1为显示
    };
    emitUIInteraction(descriptor);
    console.log(descriptor);
}

function characterpatrol(category, index,state) {
    let descriptor = {
        Category: category,//UE必需标签，角色巡查 category默认为6,
        Index: index,//0为默认巡查事件，现在默认只有0
		State: state//0为结束巡查，1为开始巡查，2为继续巡查，3为暂停巡查
    };
    emitUIInteraction(descriptor);
    console.log(descriptor);
}

function toggleSidebar() {
    var sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

function setVisualization(id) {
    let descriptor = {
        Visualization: id
    };
    emitUIInteraction(descriptor);
    console.log(descriptor);
}

function setBandwidthCap(cap) {
    capBpsCmd = 'Encoder.MaxBitrate ' + cap;
    let descriptor = {
        Console: capBpsCmd
    }
    capStr = cap != 0 ? cap : 'Unlimited';
    document.getElementById('bandwidthCapDropdown').innerHTML = 'Bandwidth Cap (' + capStr + ' Mbps)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    emitUIInteraction(descriptor);
    console.log(descriptor);
}

function setFramerateCap(cap) {
    capFpsCmd = 't.maxFPS ' + cap;
    let descriptor = {
        Console: capFpsCmd
    }
    capStr = cap != 0 ? cap : 'Unlimited';
    document.getElementById('framerateCapDropdown').innerHTML = 'Framerate Cap (' + capStr + ' fps)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    emitUIInteraction(descriptor);
    console.log(descriptor);
}

function zoom() {
    let descriptor = {
        zoom: 1
    };
    emitUIInteraction(descriptor);
    console.log(descriptor);
}

function onCharacterButton(category, item) {
    let descriptor = {
        Category: category,
        Item: item
    };
    emitUIInteraction(descriptor);
    console.log(descriptor);
}

function onConfigButton(category, item) {
    let descriptor = {
        Category: category,
        Item: item
    };
    emitUIInteraction(descriptor);
    console.log(descriptor);
}

function setRes(width, height) {
    let descriptor = {
        Console: 'r.' + 'setres ' + width + 'x' + height + 'w'
    };
    emitUIInteraction(descriptor);
    console.log(descriptor);
}

function onConfigurationOne() {
    let descriptor = {
		Category: 0,
		Item: 3
	};
    emitUIInteraction(descriptor);
    console.log(descriptor);
}

function onConfigurationTwo() {
	let descriptor = {
	    Category: 1,
	    Item: 4
	};
	emitUIInteraction(descriptor);
}

function myHandleResponseFunction(data) {
	if (data.substring("1080p")) {
		// UE4 only supports up to 1080p, not 4K.
		console.log("Disabling 4k button");
		let button4K = document.getElementById("4k");
		button4K.disabled = true;
		button4K.title = "4K is supported only when -NvEncH264ConfigLevel=NV_ENC_LEVEL_H264_52 UE4 is added to UE4 command line";
	}
}

var grabStyle = 'cursor: grab; cursor: -moz-grab; cursor: -webkit-grab';   // We will have a browser side grab cursor.
var isFullscreen = false;

function onParagonLoad() {
    styleAdditional = grabStyle;
    inputOptions.controlScheme = ControlSchemeType.HoveringMouse;
    inputOptions.fakeMouseWithTouches = true;
    
    // 获取视口宽度和高度并设置给 player
    var viewportWidth = window.innerWidth;
    var viewportHeight = window.innerHeight;
    styleWidth = viewportWidth;
    styleHeight = viewportHeight;

    var playerElement = document.getElementById('player');
    playerElement.style.width = styleWidth + 'px';
    playerElement.style.height = styleHeight + 'px';

    // 设置 body 和 html 样式，防止滚动
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    if (document.addEventListener)
    {
        document.addEventListener('webkitfullscreenchange', onFullscreenChange, false);
        document.addEventListener('mozfullscreenchange', onFullscreenChange, false);
        document.addEventListener('fullscreenchange', onFullscreenChange, false);
        document.addEventListener('MSFullscreenChange', onFullscreenChange, false);
    }

    let fullscreenCheck = document.getElementById('ck-fullscreen');
    if(fullscreenCheck){
        fullscreenCheck.onclick = function(){
            if (!isFullscreen) {
                enterFullscreen();
            } else {
                exitFullscreen();
            }
        };
    }

    // When the data channel is connected we want to ask UE4 if 4K is supported.
    onDataChannelConnected = function() { emitUIInteraction("4K"); };
    addResponseEventListener("handle_responses", myHandleResponseFunction);
}

function onFullscreenChange(data)
{
	var fullscreenDiv    = document.getElementById("player");
	isFullscreen = (document.webkitIsFullScreen 
		|| document.mozFullScreen 
		|| (document.msFullscreenElement && document.msFullscreenElement !== null) 
		|| (document.fullscreenElement && document.fullscreenElement !== null)
		|| (fullscreenDiv && fullscreenDiv.classList.contains("fullscreen")));

	let fullscreenImg = document.getElementById('fullscreen-img');
	if(fullscreenImg){
		fullscreenImg.src = isFullscreen ? 'images/MinimiseToFullscreen.png' : 'images/MaximiseToFullscreen.png'
		fullscreenImg.alt = isFullscreen ? 'Shrink to normal size' : 'Maximise to Fullscreen'
	}
}

function enterFullscreen()
{
	var fullscreenDiv    = document.getElementById("player");
	var textDivs    = document.getElementsByClassName("text");
	var headerDiv    = document.getElementById("header-tbl");
	var fullscreenFunc   = fullscreenDiv.requestFullscreen;

	if (!fullscreenFunc) {
	  ['mozRequestFullScreen',
	   'msRequestFullscreen',
	   'webkitRequestFullScreen'].forEach(function (req) {
	     fullscreenFunc = fullscreenFunc || fullscreenDiv[req];
	   });
	}

	if(fullscreenFunc){
		fullscreenFunc.call(fullscreenDiv);
	} else {
		//No Fullscreen api so maximise video to window size
		if(fullscreenDiv){
			fullscreenDiv.classList.add("fullscreen");
			fullscreenDiv.classList.remove("fixed-size");
		}

		if(textDivs){
			for(let i=0; i<textDivs.length; i++){
				textDivs[i].style.display = "none";
			}
		}

		if(headerDiv)
			headerDiv.style.display = "none";

		onFullscreenChange({});
		onInPageFullscreen();
	}
}

function exitFullscreen()
{
	var fullscreenDiv    = document.getElementById("player");
	var textDivs    = document.getElementsByClassName("text");
	var headerDiv    = document.getElementById("header-tbl");
	var exitFullscreenFunc   = document.exitFullscreen;

	if (!exitFullscreenFunc) {
	  ['mozCancelFullScreen',
	   'msExitFullscreen',
	   'webkitExitFullscreen'].forEach(function (req) {
	     exitFullscreenFunc = exitFullscreenFunc || document[req];
	   });
	}

	if(exitFullscreenFunc) {
		exitFullscreenFunc.call(document);
	} else {
		//No Fullscreen api so shrink video back from max window size
		if(fullscreenDiv){
			fullscreenDiv.classList.remove("fullscreen");
			fullscreenDiv.classList.add("fixed-size");
			fullscreenDiv.style.left = "";
		}

		if(textDivs){
			for(let i=0; i<textDivs.length; i++){
				textDivs[i].style.display = "block";
			}
		}

		if(headerDiv)
			headerDiv.style.display = "table";

		onFullscreenChange({});
		onInPageFullscreen();
	}
}

function onInPageFullscreen(){
	var playerElement = document.getElementById('player');
	let videoElement = playerElement.getElementsByTagName("VIDEO");
	document.documentElement.style.position = isFullscreen ?  "fixed" : "";
	document.body.style.position =  isFullscreen ?  "fixed" : "";

	if(isFullscreen){
		let windowAspectRatio = window.innerHeight / window.innerWidth;
		let playerAspectRatio = playerElement.clientHeight / playerElement.clientWidth;
		// We want to keep the video ratio correct for the video stream
	    let videoAspectRatio = videoElement.videoHeight / videoElement.videoWidth;

	    if(isNaN(videoAspectRatio)){
	    	//Video is not initialised yet so set playerElement to size of window
	    	styleWidth = window.innerWidth;
	    	styleHeight = window.innerHeight;
	    	styleTop = 0;
	        styleLeft = Math.floor((window.innerWidth - styleWidth) * 0.5);
	        //Video is now 100% of the playerElement so set the playerElement style
	        playerElement.style.width= styleWidth + "px";
	        playerElement.style.height= styleHeight + "px";
	    } else if (windowAspectRatio < playerAspectRatio) {
	        styleWidth = Math.floor(window.innerHeight / videoAspectRatio);
	        styleHeight = window.innerHeight;
	        styleTop = 0;
	        styleLeft = Math.floor((window.innerWidth - styleWidth) * 0.5);
	        //Video is now 100% of the playerElement so set the playerElement style
	        playerElement.style.width= styleWidth + "px";
	        playerElement.style.height= styleHeight + "px";
	    }
	    else {
	        styleWidth = window.innerWidth;
	        styleHeight = Math.floor(window.innerWidth * videoAspectRatio);
	        styleTop = Math.floor((window.innerHeight - styleHeight) * 0.5);
	        styleLeft = 0;
	        //Video is now 100% of the playerElement so set the playerElement style
	        playerElement.style.width= styleWidth + "px";
	        playerElement.style.height= styleHeight + "px";
	    }

	} else {
		playerElement.style.height = "";
		playerElement.style.width = "";
	}
}
