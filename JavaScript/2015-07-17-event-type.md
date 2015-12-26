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


## DOMContentLoaded


