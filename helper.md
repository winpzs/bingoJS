# bingoJS使用说明

JS前端开发： bingoJS

---

##1、关于bingoJS
bingoJS是一个懒程序员为下一个新工程准备的新前端MVC开发框架。 在双向绑定方面参考了**AngularJS**的部分可取优点，并结合MVC开发模式，在功能资源(模板、JS)按需加载，从而改变前端开发从jQuery面向Dom操作为主到面向业务（数据）开发为主，并以MVC分工以减少开发、迭代、维护等成本.

###1.1、双向绑定(数据绑定)
不可否认**AngularJS**是在双向绑定方面做非常出色的，特别是底层注入方面，和绑定机制等， 但我并不认为它是一个完整的开发框架， 只能说它是一种揭示了一种新的应用组织与开发方式。之前试过用它集成按需加载等，都非常痛苦的事， 最终只能放弃， 不明白它既然提供MVC模式开发， 没有考虑MVC模式下前端开发处理业务会非常重， 不提供按需加载。在之前公司有个团队分享用**AngularJS**开发了一个小项目，把代码打包后单个JS就5M以上。最后在处理集成方面还是有点过重(多)，要学习的知识点非常多，就算一个有经验都一时难以接受并用于开发。**bingoJS**将采纳几点核心机制（底层注入，标签，过滤器），将学习成本尽可能降低，并与MVC简单提供一种基础开发模式，过多的事不在基础做。

###1.2、按需加载
无论是CMD还是AMD始初只是为了解决javascript平行运行提供模块管理和一定的动态加载能力，正如我当初所认为一样它们的规范会对以后前端业务越来越重变得非常辛苦，而且碎片化严重，并与其它库难以磨合。因此走了自己一套加载机制，javascript是自由语言， 就应该自由。所以提供一种最单纯加载机制，就是只负责加载， 因此是兼容所有现有的JS库， 对打包最低限度设置即可，但不排除以后对版本进行管理。

###1.3、提供MVC开发模式
前端MVC是处理业务逻辑比较重的系统（内部系统）的一种开发模式。前后端分离开发(rest ful+前端), 必为带来rest接口细化（各种基础数据接口），前端会处理大量数据业务（过滤，组装等），这里前端MVC开发模式会带来很好分工管理， 无论在前后分离或是与dom分分离， 还是对迭代和后期维护。

MVC开发模式大概分工：
M层：数据业务层，主要负责与后端数据互交， 提供常用方法，处理常用数据（过滤，组装）；
C层：主要是对V层一一对应， 根据V层显示处理相应的数据
V层：主要处理html以双向绑定语法，跟C层数据连接

###1.4、兼容性
在JS方面可以说完全兼容到IE6；在dom管理方除了核心编译部分用了原生外，其它都几乎依赖jQuery写的，所以取决于jQuery版本的兼容;

---

##2、开始bingoJS
###2.1、例子代码
```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
</head>
<body>
    <!--通过指令bg-controller与control连接-->
    <div bg-controller="control">

        <!--通过指令bg-text绑定hello变量-->
        <p bg-text="hello"></p>

        <!--通过标签绑定hello变量-->
        <p>tag: {{hello}}</p>

        <!--通过指令bg-click绑定事件-->
        <button bg-click="clickMe">点击我</button>
    </div>

    <!--启动bingoJS需用依赖jQuery-->
    <script src="scripts/jquery-1.8.1.min.js"></script>
    <!--引入bingoJS会自动启动-->
    <script src="scripts/bingo.js"></script>

    <script type="text/javascript">
        //定义contoller
        var control = function ($view) {
            //定义view的hello变量, 并设置值
            $view.hello = 'hello world!';

            $view.clickMe = function () {
                //点击, 改变变量hello内容
                $view.hello = 'hello world! click Me on: ' + new Date().toString();
            };
        };
    </script>
</body>
</html>
```
[运行效果](http://winpzs.github.com/bingoJS/start.html)

###2.2、例子说明
从上面的代码中，我们看到在通常的 HTML 代码当中，引入了一些标记，这些就是 **bg** 的模板机制，它不光完成数据渲染的工作，还实现了数据绑定的功能。

同时，在 HTML 中的本身的 DOM 层级结构，被 **bg** 利用起来，直接作为它的内部机制中，上下文结构的判断依据。比如例子中 p 是 div 的子节点，那么 p 中的那些模板标记就是在 div 的 Ctrl 的作用范围之内。

其它的，也同样写一些 js 代码，里面重要的是作一些数据的操作，事件的绑定定义等。这样，数据的变化就会和页面中的 DOM 表现联系起来。一旦这种联系建立起来，也即完成了我们所说的“双向绑定”。然后，这里说的“事件”，除了那些“点击”等通常的 DOM 事件之外，我们还更关注“数据变化”这个事件。这样一来，我们就可能从面向操作DOM编程转到面向业务代编程。

在启动方面，只要引用jquery和bingo.js，就会自动启动

###2.3、原理图
![运行效果](http://winpzs.github.com/bingoJS/images/start.png)


##3、作用域
上面的代码中，我们给一个 div 元素指定了一个 controller ，那么， div 元素之内，就是 control 这个函数运行时， \$view 这个注入资源的控制范围。在代码中我们看到的 clickMe() ， hello 这些东西，它们本来的位置对应于 \$view.clickMe， $view.hello。

我们在后面的 js 代码中，也可以看到我们就是在操作这些变量。依赖于 **bg** 的数据绑定机制，操作变量的结果直接在页面上表现出来了。

##4、数据绑定与模板
在bingoJS里， 数据绑定与模板是主功能之一； 如果没有它，就没有可以面向业务编程了。通常模板是可以html dom或html 文本, 然后通过指令与数据绑定，从而做view层和control层分离出来。

###4.1、数据->模板
数据到表现的绑定，主要是使用模板标记直接完成的：
```html
<p bg-text="hello"></p>
<p>tag: {{hello}}</p>
```
使用指令或{{ }}标签，就可以直接引用，并绑定一个作用域内的变量。在实现上， **bg** 自动通过 $subscribe（简写$subs）观察变量 。效果就是，不管因为什么，如果作用域的变量发生了改变，我们随时可以让相应的页面表现也随之改变。我们可以看下面的例子：
```html
<div id="testView" bg-controller="control" bg-text="aaa"></div>
<script type="text/javascript">
    var control = function ($view) {
        $view.aaa = '10'
    };
</script>
```
上面的例子在页面载入之后，我们可以在页面上看到 10 。这时，我们可以打开浏览器控制台，输入：
```javascript
var view = bingo.getView('#testView');
view.aaa = 99;
view.$update();
```
上面的代码执行之后，就可以看到页面变化了。对于使用 **bg** 进行的事件绑定，在处理函数中就不需要去关心 \$upate() 的调用了，因为 **bg** 会自己处理。

###4.2、模板->数据
模板到数据的绑定，主要是通过 **bg-model** 来完成的：
```html
<input id="testView" bg-controller="control" bg-model="aaa" />
<script type="text/javascript">
    var control = function ($view) {
        $view.aaa = '10'
    };
</script>
```
这时修改 input 中的值，我们可以打开浏览器控制台，输入：
```javascript
bingo.getView('#testView').aaa;
```
查看，发现变量 aaa 的值已经更改了。

实际上， **bg-model** 是把两个方向的绑定都做了。它不光显示出变量的值，也把显示上的数值变化反映给了变量。这个在实现上就简单多了，只是绑定 change 事件，然后做一些赋值操作即可。

###4.3、模板->数据-模板
现在要考虑的是一种在现实中很普遍的一个需求。比如就是我们可以输入数值，来控制一个矩形的长度:
 - 长度数值保存在变量中
 - 变量显示于某个 input 中
 - 变量的值即是矩形的长度
 - input 中的值变化时，变量也要变化
 - input 中的值变化时，矩形的长度也要变化

```html
<div id="testView" bg-controller="control">
    <input bg-model="width" />
    width: {{width}}
    <div style="width: 100px; height: 10px; background-color: red"></div>
</div>
<script type="text/javascript">
    var control = function ($view, $node) {
        $view.width = 100;
        $view.$subs('width', function () {
            $node.find('div').width($view.width);
        });
    };
</script>
```
[运行效果](http://winpzs.github.com/bingoJS/tmplSubs.html)

上面例子中， 变量width与input绑定， 并使用**\$subs**来观察width的值， 当我们在input框中输入数量时 ，变量width也同时改变，这里**\$subs**观察到width的改变，并通过**\$node**(jQuery对象)，操作div的宽度。

##5、模板指令
前面讲了数据绑定之后，现在可以单独讲讲模板了。

作为一套能称之谓“模板”的系统，除了能干一些模板的常规的事之外（好吧，即使是常规的逻辑判断现在它也做不了的），配合作用域 **$view** 和 **bg** 的数据双向绑定机制。

###5.1、控制器指令**bg-controller**
控制器指令，用于将view层和Control层关联起来，关联有以下二种方式：

 - 直接与一个function关联起来
 - 通过route url关联起来，以实现MVC方式开发
 -
####5.1.1、直接与一个function关联起来
```html
<div bg-controller="control">
    <p bg-text="hello"></p>
</div>
<script type="text/javascript">
    //定义contoller
    var control = function ($view) {
        //定义view的hello变量, 并设置值
        $view.hello = 'hello world!';
    };
</script>
```
[运行效果](http://winpzs.github.com/bingoJS/start.html)
如上面代码， 我们定义了一个control function，然后直接用bg-controller，使view与control关联起来。

####5.1.2、通过route url关联起来，以实现MVC方式开发
```html
<div bg-controller="/system/module/user/list">
    <p bg-text="hello"></p>
</div>
```
这里我们定义一个route url方式使view与control关联起来，这种方式将会根据route内容决定对应的control js文件按需加载，可以使view tmpl与control js一一对应开发，这种方式将在后面MVC开发式细讲。

###5.2、页面加载**bg-frame**
**bg-frame**通过route url加载相应模板文件：
```html
<div bg-frame="/system/module/user/list" bg-frame-name="main"></div>
<a href="#/system/module/user/list" bg-target="main">测试1</a>
```
**bg-frame**用法有点像html iframe, 我们可以a href指url和设置bg-target, 如果控制加载内容；

###5.3、内容引用指令**bg-include**
内容引用指令，主要用于重复使用的内容引用，引用有以下二种方式：
- 通过**url**引用同域的内容文件;
- 使用**script**标签定义的“内部内容”;

####5.3.1、通过**url**引用同域的内容文件:
```html
<div bg-include="include_tmpl.html"></div>
```
**include_tmpl.html**为引用文件地址
[运行效果](http://winpzs.github.com/bingoJS/include.html)

####5.3.2、使用 script 标签定义的“内部内容”:
```html
<div bg-include="tmpl1"></div>
<script type="text/html" id="tmpl1">
    <p>include by Id: {{selectValue}}</p>
    <select bg-foreach="item in list" bg-model="selectValue">
        <option value="${item.id}">text_${item.text}</option>
    </select>
</script>
```
**tmpl1**为script 标签的id
[运行效果](http://winpzs.github.com/bingoJS/include.html)

####5.3.3、**bg-include**如何确定引用方式？
 - 会先确定是否与变量绑定， 如果有，取得其值(可用于动态引用)
 - 如果没，检查否有‘.’， 如果有，确定为url
 - 如果没，确定为script的id

###5.4、循环指令，bg-render/bg-foreach
如果使用**bg-foreach**, 更喜欢**bg-render**, 它们两个指令是一样效果的， 原因它可以使用模板语法， 定义模板的内容主要有三种方式：
 - 在**html**需要的地方直接写字符串;
 - 通过**url**引用同域的内容文件;
 - 使用**script**标签定义的“内部内容”;
 
####5.4.1、在**html**需要的地方直接写字符串：
```html
<select bg-tmpl="item in list">
    <option value="${item.id}">text_${item.text}</option>
</select>
<script type="text/javascript">
    var control = function ($view) {
        $view.list = [{ id: 1, text: "111" }, { id: 2, text: "222" }];
    };
</script>
```
[运行效果](http://winpzs.github.com/bingoJS/tmpl.html)
如果上面代码， select内部html为模板内容， \${ }为模板标签, 当然可以{{ }}标签， 但{{ }}为绑定标签，为了支持绑定, 性能比较慢，而${ }为模板直接输出标签，没有绑定能力，性能是高率的；

####5.4.2、通过url引用同域的内容文件：
```html
<select bg-foreach="item in list" tmpl-url="tmpl_tmpl.html"></select>
```
[运行效果](http://winpzs.github.com/bingoJS/tmpl.html)

####5.4.3、使用 script 标签定义的“内部内容”：
```html
<select bg-foreach="item in list" tmpl-id="tmpl1"></select>
<script type="text/html" id="tmpl1">
    <option value="${item.id}">text_id_${item.text}</option>
</script>
```
[运行效果](http://winpzs.github.com/bingoJS/tmpl.html)

####5.4.4、模板语法

 1. 支持js语句, 如: \${item.name}  \${document.body.childNodes[0].nodeName}
 2. 支持if语句, 如: \${if item.isLogin} 已登录 \${else} 未登录 \${/if}
 3. 支持foreach, 如: \${foreach item in list tmpl=idAAA} \${item_index}|\${item.id}|\${item_count}|\${item_first}|\${item_last}\${/foreach}
 4. 支持过滤器, 如: \${item.name | text}, 请参考过滤器

```html
<select bg-tmpl="item in list">
    ${if item.id == 1}
        <option value="${item.id}">text_${item.text}</option>
    ${else}
        <option value="${item.id}">text_${item.text}</option>
    ${/if}
    ${foreach cItem in list} ${cItem.id} ${/foreach}
</select>
<script type="text/javascript">
    var control = function ($view) {
        $view.list = [{ id: 1, text: "111" }, { id: 2, text: "222" }];
    };
</script>
```
[运行效果](http://winpzs.github.com/bingoJS/tmpl.html)

###5.5、条件指令**bg-if**
主要用于界面分支显示，也可以bg-show | bg-hide来实现同一效果；但bg-if更为撤底，原因bg-if会把下级节点清除，去除没必要的绑定，以提高性能；
```html
<div id="testView" bg-controller="control">
    <div bg-if="isOk | eq:'1'"><span>你选择了 "真"</span></div>
    <div bg-if="isOk | neq:'1'"><span>你选择了 "假"</span></div>
    <select bg-model="isOk">
        <option value="1">真</option>
        <option value="0">假</option>
    </select>
</div>
<script type="text/javascript">
    var control = function ($view, $node) {
        $view.isOk = '1';
    };
</script>
```
[运行效果](http://winpzs.github.com/bingoJS/if.html)

###5.6、dom操作指令

####5.6.1、dom属性指令(attr)
直接与Dom节点属性(attr)绑定:
```html
<div id="testView" bg-controller="control">
    <div bg-attr="{aaa:1,bbb:23, ccc:testVal}">请查看生成后的属性</div>
</div>
<script type="text/javascript">
    var control = function ($view, $node) {
        $view.testVal = 100;
    };
</script>
```
[运行效果](http://winpzs.github.com/bingoJS/attr.html)

####5.6.2、dom样式指令(style)
直接与Dom节点样式(style)绑定:
```html
<div id="Div1" bg-controller="control">
    <div bg-style="{width:width, 'background-color':'red'}"></div>
</div>
<script type="text/javascript">
    var control = function ($view, $node) {
        $view.width = 100;
    };
</script>
```
[运行效果](http://winpzs.github.com/bingoJS/style.html)

####5.6.3、dom事件指令(event)
直接与Dom节点事件(event)绑定:
```html
<div id="Div1" bg-controller="control">
    <button bg-event="{click:clickTest}">event方式</button>
    <button bg-click="clickTest">事件方式1</button>
    <button bg-click="clickAlert('test')">事件方式2</button>
</div>
<script type="text/javascript">
    var control = function ($view, $node) {
        $view.clickTest = function (e) {
            alert('click');
        };
        $view.clickAlert = function (msg) {
            alert(msg);
        };
    };
</script>
```
[运行效果](http://winpzs.github.com/bingoJS/event.html)
如上代码事件可以有两种方式调用：一是直接绑定；二是直接执行；
支持事件有：
 - click：click事件
 - blur：失去焦点的时候触发
 - dblclick：双击时触发
 - focus：设置焦点时触发
 - focusin：获得焦点的时候会触发这个事件
 - focusout：失去焦点的时候会触发这个事件
 - keydown：键盘按下时触发
 - keypress：键盘按下时触发
 - keyup：在按键释放时触发
 - mousedown：鼠标在元素上点击后会触发
 - mouseenter：当鼠标指针穿过元素时触发, 与mouseleave 事件一起使用
 - mouseleave：当鼠标指针离开元素时触发, 与mouseenter 事件一起使用
 - mousemove：元素上移动来触发
 - mouseout：在鼠标离开对象时触发, 与mousemove事件一起使用
 - mouseover：鼠标移入对象时触发
 - mouseup：鼠标点击对象释放时触发
 - resize：当文档窗口改变大小时触发
 - scroll：当滚动条发生变化时触发
 - select：当选择input,textarea内容时触发
 - submit：fomr提交时触发

####5.6.4、dom操作其他指令
 - bg-class：操作class属性
 - bg-show：显示
 - bg-hide：隐藏
 - bg-visibility：可见
 - bg-src：操作src
 - bg-checked：操作checked
 - bg-disabled：操作禁用
 - bg-readonly：只读
 - 集成jQuery事件
以上指令除了bg-checked指令是双向绑定， 其他所有都是单向绑定

###5.7、表单指令(bg-model)
表单控件类的模板指令，最大的作用是它预定义了需要绑定的数据的格式。这样，就可以对于既定的数据进行既定的处理
直接与Dom节点样式(style)绑定:
```html
<div id="Div1" bg-controller="control">

    <div>input: <input type="text" bg-model="data.input" /></div>

    <div>select: <select bg-model="data.select">
            <option value="1">1111</option>
            <option value="2">222</option>
        </select>
    </div>

    <div>checkbox: <input type="checkbox" value="chk" bg-model="data.checkbox" /></div>

    <div>radio:
        <input type="radio" value="rd1" name="rr" bg-model="data.radio" />
        <input type="radio" value="rd2" name="rr" bg-model="data.radio" />
    </div>

    <div>textarea: <textarea bg-model="data.textarea"></textarea> </div>

    <button bg-click="save">提交</button>
</div>
<script type="text/javascript">
    var control = function ($view, $node) {
        $view.data = {
            input: '1',
            select: '2',
            checkbox:'chk',
            radio: 'rd1',
            textarea:'text'
        };
        $view.save = function () {
            console.log($view.data);
        };
    };
</script>
```
上面代码寅示**bg-model**在表单各种元素的用法
[运行效果](http://winpzs.github.com/bingoJS/model.html)

###5.8、过滤器(filter)
这里说的过滤器，是用于对数据的格式化，或者筛选的函数。它们可以直接在模板中通过一种语法使用。对于常用功能来说，是很方便的一种机制。

多个过滤器之间可以直接连续使用。
```html
<div id="Div1" bg-controller="control">
    <div bg-show="isHide | not">show ok</div>
    <span bg-show="testSW | sw:[1, true, false]">显示: 1</span>
    <span bg-show="testSW | sw:[2, true, false]">显示: 2</span>
    <span bg-show="testSW | sw:[3, true, false]">显示: 3</span>
</div>
<script type="text/javascript">
    var control = function ($view, $node) {
        $view.isHide = true;
        $view.testSW = 3;
    };
</script>
```
[运行效果](http://winpzs.github.com/bingoJS/filter.html)

默认提供的过滤器：
 - eq：相等(eq:'1'意思是等于1）
 - neq：不相等(neq:'1'意思是不等于1)
 - not：非, not
 - gt：大于, (gt:1意思是大于1)
 - gte：大于等于, gte:1
 - lt：小于, lt:10
 - lte：小于等于, lte:10
 - text：htmlEncode文本
 - sw：switch, sw:[true, '1', '2']
 
##6、依赖注入

###6.1、关于依赖注入
先看我们之前代码中的一处函数定义：
```javascript
var control = function ($view, $node) {
    $view.isHide = true;
    $node.find('input').val('100');
};
```
在这个函数定义中，注意那两个参数： \$view ， \$node ，这是两个很有意思的东西。总的来说，它们是参数，这没什么可说的。但又不仅仅是参数——你换个名字代码就不能正常运行了。
事实上，这两个参数，除了完成“参数”的本身任务之外，还可以作为一种语法糖完成了“依赖声明”的任务，并解决合并压缩带来的问题：
```javascript
var control = ['$view', '$node', function (v, jNode) {
    v.isHide = true;
    jNode.find('input').val('100');
}];
```

###6.2、依赖注入定义
 正如名称，我们可以平时把常用的东西写成一个依赖，在须要使用时可以很方便的注入使用；
 使用依赖注入，可以在创建阶段帮我干一些不必要的初始化，简化我们使用，如下面我要定义一个$node(jQuery对象), 而它要依赖原生的node :
```javascript
bingo.factory('$node', ['node', function (node) {
    return $(node);
}]);
```
如上代码， 我们使用bingo.factory方法定义依赖(工厂)，在定义$node过程中我们还依赖了框架自带的node, 例外如果不用考虑合并压缩，我们还可以简化成这样定义：
```javascript
bingo.factory('$node', function (node) {
    return $(node);
});
```
框架自带依赖说明将放本文最后，或可以转到[github开源项目](https://github.com/winpzs/bingoJS)参考更多的定义

##7、前端MVC
在使用前端MVC开发模式之前，使用以上的机制我们已经可以用MVVM的方式面向数据开发代替jQuery操作方式主面向Dom操作开发，可以实现业务层（Ｍ）和展示层（Ｖiew）分离开发：
![运行效果](http://winpzs.github.com/bingoJS/images/MV.png)
上图我们可以简单从前端角度看，把后端简单看成后端服务(Services)，前端方面分成ＭＶ二层，这里我们可以这样理解成所有ＪＳ代码放在Ｍ层，ＨＴＭＬ模板看成Ｖ层，然后Ｍ层与Ｖ层通过双向绑定机制进行互交； 即我们在Ｍ层可以定义一个变量与Ｖ层连接起来，ＪＳ开发时，我们只操作Ｍ层这个变量就可以了，从而可以省去对ＤＯＭ的处理或操作；让我在Ｍ层专注于处理更多的业务；并在View层我们可以分工给ＵＥ处理和给予ＵＥ更大的自由；

前端MVC主要提供ful REST+前端MVC SPA与后台完全分离的一种开发模式:
![运行效果](http://winpzs.github.com/bingoJS/images/MVC.png)
如果之前的前端ＭＶ已经实现了Ｍ与Ｖ分工（即ＦＥ与ＵＥ的分工），那前端ＭＶＣ是对ＦＥ这职位进一步进化，将ＦＥ处理的Ｍ层进一步分成ＭＣ二层；　在前端ＭＶ时，Ｍ层要处理ＪＳ所有逻辑，如果要处理的东西多了，就会变得非常重，1000行代码不是问题了．在其开发过程过中你会发现Ｍ层主要处理三种逻辑：与后端数据处理，项目业务，和Ｖiew层显示数据；在这三种逻辑中，其中后端数据处理，项目业务是可以重用，　而Ｖiew层显示数据是要根据V层的展示组装数据；所以前端ＭＶＣ会将后端数据处理，项目业务分到Ｍ层，Ｖiew层显示数据分到Ｃ层并与V层一对一绑定起来；
