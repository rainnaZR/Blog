第七章阅读总结：

### 1. 定义

抓包工具可以拦截HTTP协议的请求和响应的内容，然后对其进行解析。

HTTP协议中没有加密机制，但是可以通过和SSL和TSL组合，加密HTTP的通信内容。与SSL组合的HTTP就是HTTPS。

中间人攻击是指攻击人随意篡改请求和响应，而且让客户端和服务器端之间的通信看上去依旧正常。

### 2. HTTP+加密+认证+完整性保护 = HTTPS

HTTPS是身披SSL外壳的HTTP。HTTP先和SSL通信，再由SSL和TCP通信。采用SSL后，HTTPS就具备了加密，证书，完整性保护等功能。

**共享密钥：对称密钥加密**

加密和解密使用同一个秘钥。


**公开密钥加密：非对称秘钥**

使用公开密钥加密方式，发送密文的一方使用对方的公开密钥加密，对方收到加密信息后，使用自己的私有密钥解密。公开密钥加密速度比共享密钥要慢。

**HTTPS采用两种混合加密机制**

HTTPS采用共享密钥加密和公开密钥加密两种混合的加密机制。在交换共享密钥环节使用公开密钥加密方式，建立通信交换报文阶段使用共享密钥加密方式。

通过使用数字证书认证机构颁发的公开密钥证书来判断公开密钥是正确合法的，是源服务器发行的公开密钥。

**数字证书认证机构的业务流程如下：**

1）服务器的运营人员向数字证书机构提出公开密钥的申请。

2）证书机构判明申请者的身份，然后对已申请的公开密钥进行签名，并分配这个公钥，将该公钥放入公钥证书绑定在一起，并颁发公钥证书。

3）服务器会将这份公钥证书发送给客户端。多数浏览器会内部植入常用CA机构的公钥，所以公钥是安全的放入到客户端内。公钥证书也叫数字证书或证书。

4）客户端接收到公钥证书后，对证书上的数字签名向CA机构进行验证。验证通过后说明该证书是CA机构颁发的有效证书，且服务器的公钥是值得信赖的。

5）客户端使用服务器的公钥对报文进行加密后发送。

6）服务器用私有密钥对报文解密。

**SSL速度慢**

1）通信慢。

2）对通信进行加密解密处理，大量消耗CPU和内存资源，处理速度较慢。


