## animation

+ animation-delay : 动画开始前的等待时间
+ animation-direction: 指示动画是否反向播放
  + normal : 每个循环内动画向前循环，换言之，每个动画循环结束，动画重置到起点重新开始，这是默认属性。
  + alternate : 动画交替反向运行，反向运行时，动画按步后退，同时，带时间功能的函数也反向，比如，ease-in 在反向时成为ease-out。计数取决于开始时是集数迭代还是偶数迭代
  + reverse : 反向运行动画，每周期结束动画由尾到头运行
  + alternate-reverse : 反向交替， 反向开始交替
+ animation-duration : 动画持续时间
+ animation-iteration-count ：动画迭代次数
  + infinite : 无限循环
  + <number> : 循环指定次数，不可以是负数，可以是小数，比如　1.5 会完成一个整周期和一个半周期的动画。
+ animation-play-state : 
+ animation-fill-mode : 指示动画前后元素的状态
  + none : 动画执行前后不改变任何样式
  + forwards : 目标保持动画最后一帧的样式
  + bakcwards : 动画在delay开始阶段就应用第一帧画面
  + both : 同时执行forwards 和 backwards 执行的动作。

也可以使用简写形式：


```css
/* @keyframes name | duration | timing-function | delay | 
   iteration-count | direction | fill-mode | play-state */
animation: slidein 3s ease-in 1s 2 reverse both paused;
```

