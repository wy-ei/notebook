## prototype mode

function Person(name){
	this.name = name;
}

Person.prototype.sayName = function(){
	console.log(this.name);
};

## method

+ hasOwnProperty():this method can check where the attribute is.

## keyword 'in'

```
var person = new Person('John');

alert('name' in person);  // true , because person has a attribute that is name.
```
