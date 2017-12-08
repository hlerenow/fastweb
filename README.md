# Fastweb

静态网页制作脚手，集成常见的html/css/js压缩、less预编译，雪碧图生成等功能，支持浏览器自动刷新。

#### 目录结构

```
│  .gitignore
│  gulpfile.js
│  package-lock.json
│  package.json
│  README.md
│  tree.txt
│  
├─dist //编译后生成的文件夹，放置生产环境下的文件
│  │  index.html
│  │  
│  ├─css
│  │      common.css
│  │      index.css
│  │      
│  └─images
│          home_BG.jpg
│          home_BG.png
│          sprite.png // 雪碧图文件
│          
└─src 
    │  favicon.ico
    │  index.html
    │  
    ├─css
    │      common.css
    │      index.css
    │      
    ├─images
    │  │  home_BG.jpg
    │  │  home_BG.png
    │  │  sprite.png
    │  │  
    │  └─sprites // 该文件夹用于存放用需要被用于生成 雪碧图 的图片，目录下所有的图片会被合成为一张 sprite.png, 
    |            // 放置在 images 目录下，并生成一份 sprite.less 文件
    │          home_btn.png
    │          
    ├─js
    ├─less // 用于放置 less 文件，预编译时，会搜索每个文件下的 index.less 文件，并用文件夹命名css文件，
    |  |   // 比如 common 文件夹下的 index.less 编译后会生成 common.css 文件。编译后的 css 文件放置在 dist/css 文件夹下。
    │  │  sprite.less // 制作雪碧图生成的 less 文件
    │  │  
    │  ├─common
    │  │      index.less
    │  │      normalize.less
    │  │      sprite.less
    │  │      
    │  └─index
    │          index.less
    │          
    └─lib //用户放置第三方库文件，编辑时会原封不动的拷贝到 dist 文件夹下
```

#### 命令


````
 npm run dev // 运行开发服务器

 npm run build // 编译为生产环境文件 , 图片压缩默认使用 smushit, 只支持压缩 jpg、png, 更多的图片压缩方式参见 gulpfile.js
 ...
````
