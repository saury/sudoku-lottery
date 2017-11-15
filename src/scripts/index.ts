if ((process.env as any).NODE_ENV !== 'production') {
	require('../index.html')
}

//es6的class语法糖，简化了js原有面对对象的写法
class Lottery {
	count: any;
	speed: any;
	timer: any;
	currentIndex: any;
	rotateNum: any;
	basicCycle: any;
	prizePlace: any;
	isClick: any;
	parentDom: Element;
	mask: Element;
	result: Element;
	initOppo: any;
	constructor() {
		this.count = 0; //位置总数
		this.speed = 10; //初始速度
		this.timer = 0; //定时器时间
		this.currentIndex = -1; //转动的当前位置
		this.rotateNum = 0; //转动次数
		this.basicCycle = 50; //运动初始次数
		this.prizePlace = -1; //中奖位置
		this.isClick = false; //是否重复点击抽奖
		this.parentDom = null; //根dom
		this.mask = null; // 抽奖遮罩
		this.result = null; //抽奖结果
		this.initOppo = 2; //初始抽奖次数
	}

	//初始化方法，点击抽奖事件
	init() {
		const _this = this;
		const initOppo = document.getElementById('resOpportunity');
		const lotteryBox = document.querySelector('#lotteryBox');
		const startBtn = lotteryBox.querySelector('.lotteryBtn');
		_this.mask = lotteryBox.querySelector('.mask');
		_this.result = document.querySelector('.lottery-result');

		initOppo.innerHTML = this.initOppo;
		if (lotteryBox.querySelectorAll('li').length > 0) {
			const $units = lotteryBox.querySelectorAll('li');
			this.count = $units.length;
			this.parentDom = lotteryBox;
		}

		// close result page event
		[].forEach.call(
			document.querySelectorAll('[data-close]'),
			function (closeTrigger: any) {
				closeTrigger.addEventListener('touchend', function () {
					_this.result.classList.remove('in');
					_this.mask.classList.remove('in');
				})
			}
		)

		startBtn.addEventListener('touchstart', function () {
			startBtn.classList.add('active');
		});

		startBtn.addEventListener('touchend', function () {
			startBtn.classList.remove('active');
			//防止在转动过程中,重复点击抽奖按钮
			if (_this.initOppo <= 0) {
				if (!_this.isClick) {
					_this.result.classList.add('in');
				}
				return false;
			}
			else if (_this.isClick) {
				return false
			}

			else {
				_this.mask.classList.add('in');
				_this.speed = 100;
				_this.rotateNum = 0;
				_this.initOppo -= 1;
				initOppo.innerHTML = _this.initOppo
				_this.turning();
				_this.isClick = true; //一次完成后，可继续抽
				return false;
			}
		});
	}
	//为即将转到下一个节点添加class:active
	addNextItemClass() {
		this.currentIndex >= 0 && this.parentDom.querySelector('.lottery-unit-' + this.currentIndex).classList.remove("active");
		this.currentIndex += 1;
		if (this.currentIndex >= this.count - 1) {
			this.currentIndex = 0;
		}
		this.parentDom.querySelector('.lottery-unit-' + this.currentIndex).classList.add('active');
		return false
	}
	//浮层转动的逻辑都在该方法内实现
	turning() {
		this.rotateNum += 1
		this.addNextItemClass();
		//判断是否转动完毕
		if (this.rotateNum > this.basicCycle + 10 && this.prizePlace == this.currentIndex) {
			clearTimeout(this.timer)
			this.prizePlace = -1;
			this.timer = 0;
			// this.initOppo != 0 ? this.isClick = false : this.isClick = true;
			this.isClick = false
			let selectedEle = this.parentDom.querySelectorAll('.lottery-unit-' + this.currentIndex)[0].getAttribute('data-value');
			console.log("恭喜你中了" + selectedEle + "等奖");
			// todo: show result and do callback issue
			this.result.classList.add('in');

		}
		//该判断内是对转动速度speed的处理
		else {
			if (this.rotateNum < this.basicCycle) {
				this.speed -= 10
			} else if (this.rotateNum == this.basicCycle) {
				// 此处是随机数获取中奖位置的，在点击抽奖的时候该位置（随机数）就已确定
				this.prizePlace = Math.floor(Math.random() * this.count);
				this.prizePlace == 8 ? this.prizePlace = 0 : this.prizePlace = this.prizePlace;
				console.log(this.prizePlace)
			} else {
				// 如果中奖位置和当前位置的位差在一到多圈时，加快转动速度
				if (this.rotateNum > this.basicCycle + 10 && ((this.prizePlace == 0 && this.currentIndex == 7)) || this.prizePlace == this.currentIndex + 1) {
					this.speed += 100;
				} else {
					this.speed += 20;
				}
			}
			// 此处做匀速阶段的处理
			if (this.speed < 40) {
				this.speed = 40;
			};
			// 定时器做整个转动处理
			this.timer = setTimeout(this.turning.bind(this), this.speed) //此处使用bind(),防止setTimeout改变this的指向
		}
		return false;
	}
}
// 页面初始化，执行初始化方法
window.onload = () => {
	new Lottery().init();
}