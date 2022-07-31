# 浅谈js与json

日期：2022-07-15  
作者：话百年

mdn上说，js与json不同，这固然正确。但在实际的代码层面，我想可以将他们看作一回事。

常见的与json有关的名词有这几个：json对象、json字符串、json文件。
json文件好理解，就是那个以 `.json` 结尾的文件。它是一个文本文件，也就说用普通文本编辑器就能打开查看的，不像二进制文件，用文本编辑器打开是乱码。

json对象、json字符串，如果我没弄错的话，它们俩其实是一个东西。而且就是一个稍显特殊的js字符串。比如：  
```javascript
let json_str1 = '[1, 2, 3]';
let json_str2 = '{"name": "张三"}';
```
如上，这两个变量就是合格的json字符串（也就是json对象）。当然了，它俩也是正儿八经的js字符串。那么特殊在哪里呢？特殊在，字符串最外层是单引号，单引号内部是符合json书写规范的数组或对象。而内部被规范要求用双引号，那么外层自然是单引号了。

现在，有了这特殊的字符串，我们能干什么呢？首先，我们可以将字符串通过文件流的形式，写入一个文本文件，保存到硬盘，对吧。其次，我们也可以从字符串中还原出js数组或js对象，对吧。

先说还原数组或对象。这就提到了 `JSON.parse()` 方法和 `JSON.stringify()` 方法。
```javascript
let json_str1 = '[1, 2, 3]';
let arr = JSON.parse(json_str1);
console.log(arr.constructor);
// 应该显示其构造函数为数组 ƒ Array() { [native code] }
```
如上，parse是“解析”的意思，它将一个json字符串还原成js数组或对象。

那么，反过来，能不能将js数组或对象变成json字符串呢。可以，用 `JSON.stringify()` 。
```javascript
let obj = {"age": 18};
let json_str2 = JSON.stringify(obj);
// console.log(json_str2);
// 显示 {"age":18}
json_str2
// 显示 '{"age":18}'
```
如上，stringify将js数组或对象，进行字符串化。但在上述例子中请注意，console.log()显示字符串时会去除引号，所以直接在开发者控制台输入该变量。

更进一步，如何不是数组或对象，而是一般的js变量呢？看情况，比如只含数字的字符串就行，而一般字符串不行。如下
```javascript
let a = '123';
JSON.parse(a);
// 输出 123
let b = 'abc';
JSON.parse(b);
// 出错
```
据此可以推断（不保证正确）， `JSON.parse()` 只是简单地去掉了字符串的引号。至于会不会出错，全看字符串去除引号后是否“合法”。这里的“合法”，大概类似于c语言中提到的“右值”。`'123'` 去除引号是 `123`， 是数字，“合法”。`'abc'` 去除引号后是不知所谓的 `abc`，“不合法”。

同理，我们推断 `JSON.stringify()` 只是简单地加上引号。

综上，js和json有如下关系。
```
            stringify
            ---------->
js数组或对象             json字符串（也就是json对象，事实上也是js字符串）
            <----------
              parse
```
再说说json文件的读写。（不想写了，以后再说）