# 对nodejs中http.get的简单梳理

## 一、前言  
日期：2022-08-19  
作者：话百年  

主要是对以下代码过程的梳理。  
nodejs版本：v16.16.0  
参考的文档版本：v16.17.0

```javascript
const http = require("http");

const url = "http://news.baidu.com/";

let htmlStr = "";
let count = 0;

http.get(url, (res) => {
	res.on("data", (chunk) => {
        htmlStr += chunk;
		count += 1;
    });
    res.on("end",() => {
        console.log(res.constructor)
        console.log(count);
    });
});
```

## 二、梳理

### 2.1

http 模块是 nodejs 内置模块，因此不需要额外安装，可直接导入。

### 2.2

除了导出类外，http 模块还导出了很多方法，方便我们使用。  
比如 http.get() 方法。  
那么 http.get()  做了什么？

### 2.3

翻看源码 lib/http.js 文件。  
发现 http.get() 方法定义如下。

```javascript
function get(url, options, cb) {
  const req = request(url, options, cb);
  req.end();
  return req;
}
```
url 很明显就是网址字符串。  
options 则是一些请求选项。  
cb 则是回调函数 callback。

如上可见，http.get() 基本是对 http.request() 方法的简单封装。  
那就来看看 http.request() 方法。

### 2.4
在同文件下（lib/http.js）。  
发现 http.request() 方法定义如下。

```javascript
function request(url, options, cb) {
  return new ClientRequest(url, options, cb);
}
```

如上，ClientRequest 似乎是个类，在 js 中实际上也就是方法。  
那么 ClientRequest 从哪里来的？  
如下，由该文件的导入部分可以知道。

```javascript
const { ClientRequest } = require('_http_client');
```

很明显，ClientRequest 是从 _http_client 这个模块来的。

### 2.5
文件 lib/_http_client.js 即为该模块。  
查看该文件，我们发现 ClientRequest 是个方法，也就是类。如下。

```javascript
function ClientRequest(input, options, cb) {
  // 很多代码
}
```

这个方法很大，而且通过原型添加了很多东西。   
该方法主要的功能就是发起一个网络请求。在上一小节中，通过 new 的方式，就相当于执行了这个方法。  
此外，方法内部有行代码值得我们注意。如下。

```javascript
if (cb) {
  this.once('response', cb);
}
```

如上，如果回调函数 cb 存在，就将其绑定到一个 response 事件上。且触发时只执行一次。那么这个 response 事件是什么？    
首先，这里的 this 很明显指的是 ClientRequest 这个方法。    
我们查找文档。发现 http.ClientRequest 这个类确实有 response 事件。描述如下。

> Emitted when a response is received to this request. This event is emitted only once.

也就是某个请求的响应被接受到时，触发一次该事件。    
那么可想而知，这个触发过程大概是他内部自动进行的。
当响应接收到时，触发 response 事件，就可以执行我们的回调函数了。

### 2.6

还没有完！  
res.on("data", )  是什么意思。data 很明显是个内置事件，但他是从哪里来的？  
我们通过打印 res.constructor 可以得知，res 是 `[Function: IncomingMessage]` 类型的。  
通过 http 模块文档，我们可以得知如下情况。    
IncomingMessage 本身并没有 data 事件。  不过，他继承自 stream.Readable 。而这个类是有 data 事件的。摘录如下。

> Event: 'data'

> Added in: v0.9.4

> chunk \<Buffer\> | \<string\> | \<any\> The chunk of data. For streams that are not operating in object mode, the chunk will be either a string or Buffer. For streams that are in object mode, the chunk can be any JavaScript value other than null.

> The 'data' event is emitted whenever the stream is relinquishing ownership of a chunk of data to a consumer. This may occur whenever the stream is switched in flowing mode by calling readable.pipe(), readable.resume(), or by attaching a listener callback to the 'data' event. The 'data' event will also be emitted whenever the readable.read() method is called and a chunk of data is available to be returned.

> Attaching a 'data' event listener to a stream that has not been explicitly paused will switch the stream into flowing mode. Data will then be passed as soon as it is available.

> The listener callback will be passed the chunk of data as a string if a default encoding has been specified for the stream using the readable.setEncoding() method; otherwise the data will be passed as a Buffer.

```javascript
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
});
```

如上，可以看出， res 事实上是个流类型（Stream）的。  
当客户端接收到响应时，会自动划分出一块地方，也就是文档描述中提到的 chunk，用于填充到来的信息。并在合适的时候，触发 data 事件，从而执行 data 事件的回调。    
看本文的开头，我请求的是百度，并做了计数，最后计数结果为 17。  
也就是说，接收数据过程中，data 事件其实会触发多次。

### 2.7
现在，我们基本可以想象这个请求过程。  
发送请求前，为 response 事件绑定了我们提供的回调函数。然后发送请求。  
当接受到响应时，触发 response 事件，执行回调函数。  
在回调函数中，我们为 data 事件绑定了另一个回调。  
然后不知道什么时候，应该就是紧接着，程序自动向 chunk 中写数据。然后多次触发 data 事件，执行回调。

以上。
