/**
 * 原始写法，这个脚本重新实现并封装一个可用于 vue 的 gtag
 * 1. 注入脚本
 * <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
 * 2. 实例化
 * <script>
 * 3. 生成一个window对象的数组，由 gtag 函数负责将传入参数插入到该数组中
 * 4. gtag 应在使用前传入两个必要的对象以完成初始化
 * window.dataLayer = window.dataLayer || [];
 * function gtag(){dataLayer.push(arguments);}
 * gtag('js', new Date());
 * gtag('config', 'GA_MEASUREMENT_ID');
 * </script>
 * 5. 更新 gtag 的 config
 * gtag('config', 'GA_MEASUREMENT_ID', { 'send_page_view': false });
 * 
 */

/**
 * 封装后的使用方法
 * 注意！需要使用 vue-router，并传入实例
 * import gtag from 'vue-gtagjs'
 * const router = new VueRouter()
 * 带 debug 信息
 * gtag( router, GA_Account_Id)
 * 不带 debug 信息
 * gtag( router, GA_Account_Id, false)
 */

/**
 * 向 DOM 动态添加 gtag 脚本
 * @param  {String} accountId GA_Account_Id
 * @param  {String} id      script id
 */
var insertGtagScript = function(accountId) {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${accountId}`;
    var n = document.getElementsByTagName('head')[0];
    // 预防未写 head 的情况;
    if (!n) n = document.body;
    // 将新生成的脚本标签插入到 head 的头部
    n.appendChild(s);
}
  
/**
 * 初始化 gtag 函数
 * @param  {String} accountId GA_Account_Id
 */
var initGtag = function(accountId) {

    const w = window;
    if (w.gtag) return;
    insertGtagScript(accountId);

    w.dataLayer = w.dataLayer || [];
    const gtag = w.gtag = w.gtag || function () {
      w.dataLayer.push(arguments)
    };
    gtag('js', new Date());
    gtag('config', accountId);
}
  
/**
 * 更新 gtag 的路径，模拟跳转页面，触发 gtag 发送 pageview
 * @param  {String} newPath
 * @param  {String} accountId
 */
var renewConfig = function(newPath, accountId) {

    initGtag(accountId);
    gtag('config', accountId, {'page_path': newPath});
}

export default function (router, GA_Account_Id, log = true) {

    // 路由钩子，在 vue-router 跳转新 url 后生效，让 gtag 跟踪'新页面'的事件
    router.afterEach(to => {

        renewConfig(to.fullPath, GA_Account_Id);
        if (log) {
            console.log(`set a new page path to: ${to.fullPath}`);
        }
    })
}
  