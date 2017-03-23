---
layout: post
title: JavaScript 事件
category: JavaScript
---

## UI event

+ load:window,img,script,link...
+ unload:window
+ resize:window size. firefox:when the size stop change the event process function will be invoke.other browser:invoke it when the size has changed 1px.+ scroll:window

## focus event

+ blur:trigged when element lose focus,this event don't bubble
+ focus:trigged when element get focus,this event don't bubble
+ focusin:when element get focus the event will be trigged,this event can bubble.
+ focusout:same as blur,the different is this event can bubble.

## mouse and mousewheel event

+ click
+ dbclick
+ mousedown
+ mouseup
+ mouseenter:when cursor enter this element
+ mouseleave
+ mousemove
+ mouseout
+ mouseover

mouseenter and mouseleave don't bubble,others will bubble.

### different between mouseleave and mouseout

mouseleave doesn't bubble but mouseout does.

```
+-------------+
|  +------+   |
|  |      |   |
|  | A    |   |
|  +------+ B |
+-------------+
```

if you listen mouseout event and mouseleave event  on div B,when you move mouse into A.you will see there will be a mouseout event trigged. why ? you will know when mouse leave the outside annular region mouseout event will be trigged.

mouseleave event will be trigged when mouse leave entire B div.

### mouseover

when mouse cross the edge of an element and enter this element this event will be trigged.

we use the diagram of last section for example.when you move mouse into A.you will see there are two mouseover event trigged, that is very weired, let me tell you way. because mouseover event can bubble,so when mouse over A,a mouseover event trigged on A,but A haven't listen mouseover event,so this event bubble to B,so another mouseover event trigged on B.

after that you move mouse from inner of A to out of B,there will be a mouseover event trigged.because the defination of mouseover event is cross the edge and over the element ,so when the mouse is over A , at this mement we think mouse is over B too,but at this time it don't like what we think.Only when the mouse is over the annular of outside of A , mouse is over B actually.

### mouseenter

this event don't bubble. so when you just want listen event when mouse enter some region and leave some region you'd better use mouseenter and mouseleave.


### mouseover and mouseout

those two event has a special attribution named relatedTarget,this attribution record the relative element with target element.


### dbclick

processing

1. mousedown
2. mouseup
3. click
4. mousedown
5. mouseup
6. click
7. dbclick

## mousewheel

fireFox don't support it. 2015-07-17 . but can use `DOMMouseScroll` instead.

## textInput

every editable element can listen this event, this event has a data attribution record input character.

you can know the text's source form event.inputMethod in **IE**.other browser don't support this attribution.


## addEventListener

众所周知，addEventListener 这个方法用来绑定事件，也都知道该函数接受三个参数，但对于最后一个参数，并非只接受简单的一个布尔值，它还可以是一个对象。

addEventListener 的参数调用形式是这样的：

``` js
el.addEventListener(eventType, listener, useCapture);
el.addEventListener(eventType, listener, options);
```

第一种形式，第三个参数为一个布尔值，表示该事件是否要绑定在捕获阶段，关于捕获和冒泡，简单说一下就是，当某个事件触发后会先进行一个捕获阶段，该阶段事件从最外层元素向内传播，直到传播到触发事件的元素上，然后由该元素向外进行冒泡，直到事件传播到最外层元素上。

第二种形式，第三个参数为一个对象，其中可以包含下列属性：
- capture：一个布尔值，表示该事件是否要绑定在捕获阶段，同上面介绍的第一种参数形式。
- once：一个布尔值，表示该事件是否只被触发一次，如果该值为 true，当事件触发之后，事件监听函数会被自动移除。
- passive：一个布尔值，表示事件监听函数不能调用事件的 preventDefault() 方法，如果调用了，用户代理会忽略掉，并在控制台打印出警告。
