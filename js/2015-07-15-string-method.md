## String

### get character

```
var str = 'hello world';
str.charAt(1);   // 'e'
str.charCodeAt(1); // 101   the ascii code of 'e'
str[0];  // 'e'
```

### operator of string

```
var str = 'hello';

str.concat('world','！');  // return hello world ! this method can accept any number of parament and return a string concat all those paraments and origin string.

str.slice(1);  //return 'ello'. this method accept two paraments,and return a substring,first parament is the strat point of the substring in original string and second one is the over end point of the substring in original string.


str.substring(-3);  //return 'hello'. substring method will convert all the minus number to 0

str.substr(-3,-4); // return '' . substr method will replace first minus nuber width length plus itself and convert second minus number parament into 0,and the second parament indicate the length of substring.


str.indexOf('l');  // 3
str.lastIndexOf('l');   // 4
str.trim();  // return a string delete prefix and postfix blank

var matches = str.match(/ll/);  // same as `/ll/.exec(str);` 
alert(matches.index);  // 2
alert(matches[0]);   // 'll'

var pos = str.search(/ll/);  //2;  if haven't find return -1

var result = text.replace(/\w/g,function(match,pos,originStr){
				return match + '-';
			});  // result == 'h-e-l-l-o'

str.split(/\w/g,3);   // first parament is a RegExp object or a string,second parament limit the length of returned Array.

//Static method

String.fromCharCode(104,101,108,108,111);   // return 'hello'

```