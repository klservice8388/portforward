# KLService portward

基于nodejs写的端口转发，并支持流量计数和统计总的连接数 http://45.32.30.142/status/



## Install

```
git clone https://github.com/klservice8388/portforward.git
```

## Getting started

-h 本地IP

-p 本地监听端口

-s 转发的目标ip

-b 转发的目标端口

程序会连接127.0.0.1的redis并写入3个键。accepts是总连接数。outs是入站流量。gets是出站流量。

```
node bin/cli.js -h 0.0.0.0 -p 8388 -s 127.0.0.1 -b 8389
```