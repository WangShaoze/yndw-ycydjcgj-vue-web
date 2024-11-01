import { createWebHistory, createRouter } from 'vue-router'
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',  //路由的路径，这里 /redirect 是父路由的路径，当访问 /redirect 开头的路径时，会进入到这个路由配置所对应的页面组件。
    component: Layout,  // 指定了该路由所对应的组件，这里使用的是之前导入的 Layout 组件，说明这个重定向相关的页面会使用整体的布局组件来包裹其内部的具体内容组件。
    hidden: true,      //设置为 true，表示这个路由不会在侧边栏中显示
    children: [
      {
        path: '/redirect/:path(.*)',    // 定义了子路由，这里的子路由路径是 /redirect/:path(.*)，其中
                                        // :path(.*) 是一个动态路径参数，表示可以匹配任意路径。
                                        // 当访问 /redirect 后面跟着任意路径时，会加载 @/views/redirect/index.vue 这个组件
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',                   // 指定了登录页面的路由路径为 /login
    component: () => import('@/views/login'),   // 通过动态导入的方式引入了 @/views/login 这个组件，也就是登录页面的具体实现组件。
    hidden: true                      // 设置为 true，说明登录页面不会在侧边栏中显示，这是符合常理的，因为登录页通常是独立的入口页面，不需要在侧边栏展示。
  },
  {
    path: '/register',
    component: () => import('@/views/register'),
    hidden: true
  },
  {
    path: "/:pathMatch(.*)*",
    /**
     * path: "/:pathMatch(.*)*"：这是一个特殊的路由路径定义。在 Vue Router 中，路径中的 : 表示定义一个动态路由参数。
     * 这里的 pathMatch 就是定义的动态参数名，它可以匹配任意的路径片段。
     * (.*)* 这种写法是一种正则表达式风格的匹配模式。
     * 其中 .* 表示匹配任意字符（除了换行符）零次或多次，外面的 * 表示对前面整个匹配模式（即 (.*)）进行零次或多次匹配。
     * 简单来说，就是这个路由路径可以匹配任何未被前面其他路由定义所匹配到的路径。
     * 例如，如果用户访问了一个在应用中不存在的路径，比如 /abc/def/ghi 或者 /some-random-url 等等，都会被这个路由所匹配到。
     * */
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '',                // 这里设置为空字符串，表示应用的根路径。当用户访问应用的根 URL 时，会进入到这个路由配置所对应的页面。
    component: Layout,       // 同样使用了 Layout 组件作为整体的布局包裹
    redirect: '/index',       // 重定向
    children: [              // 定义了一个子路由，路径为 /index，对应的组件是通过动态导入的 @/views/system/admin/index 组件，
                            // 并且设置了路由的 name 为 Index，以及 meta 属性，其中 title 设置为 首页，用于在侧边栏和面包屑导航中显示；
                            // icon 设置为 dashboard，可能对应着一个仪表盘样式的图标用于在侧边栏标识首页；
                            // affix 设置为 true，具体含义可能根据应用的业务逻辑而定，可能表示这个页面是固定在某个位置（比如始终显示在侧边栏的首位等）。
      {
        path: '/index',
        component: () => import('@/views/system/admin/index'),
        name: 'Index',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/user/profile',
    name: 'profile',
    hidden: true,
    component: () => import('@/views/system/user/profile/index'),
  },
  // {
  //   path: '/system/zhgl',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   hidden: false,
  //   alwaysShow: true,
  //   meta: { title: '系统维护', icon: "system" },
  //   children: [{
  //     path: 'zzgl',
  //     component: () => import('@/views/system/zhgl/zzgl/index'),
  //     name: 'zzgl',
  //     meta: { title: '组织管理', icon: 'user' }
  //   },
  //   {
  //     path: 'gwgl',
  //     component: () => import('@/views/system/zhgl/gwgl/index'),
  //     name: 'gwgl',
  //     meta: { title: '岗位管理', icon: 'user' }
  //   },
  //   {
  //     path: 'czygl',
  //     component: () => import('@/views/system/sqgl/czygl/index'),
  //     name: 'czygl',
  //     meta: { title: '操作员管理', icon: 'user' }
  //   }
  //   ]
  // },
  // {
  //   path: '/system/sqgl',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   hidden: false,
  //   alwaysShow: true,
  //   meta: { title: '授权管理', icon: "system" },
  //   children: [{
  //     path: 'jsgl',
  //     component: () => import('@/views/system/sqgl/jsgl/index'),
  //     name: 'jsgl',
  //     meta: { title: '角色管理', icon: 'user' }
  //   },
  //   {
  //     path: 'gngl',
  //     component: () => import('@/views/system/sqgl/gngl/index'),
  //     name: 'gngl',
  //     meta: { title: '功能管理', icon: 'user' }
  //   },
  //   {
  //     path: 'gwsq',
  //     component: () => import('@/views/system/sqgl/gwsq/index'),
  //     name: 'gwsq',
  //     meta: { title: '岗位授权', icon: 'user' }
  //   },
  //   {
  //     path: 'czysq',
  //     component: () => import('@/views/system/sqgl/czysq/index'),
  //     name: 'czysq',
  //     meta: { title: '操作员授权', icon: 'user' }
  //   }
  //   ],
  // },
];

const router = createRouter({
  history: createWebHistory(),  // 通过 createWebHistory() 函数创建了基于 HTML5 history 模式的路由历史记录。
  routes: constantRoutes,       // 传入了之前定义的 constantRoutes 数组，作为路由实例的路由配置列表，
                                // 这些路由配置将决定应用中各个页面的访问路径、组件加载以及展示效果等
  // scrollBehavior 这是一个用于控制页面滚动行为的函数。当用户在不同页面之间切换时，这个函数会被调用。
  // 如果存在之前保存的滚动位置 savedPosition（例如通过浏览器的后退或前进按钮切换页面时可能会保存滚动位置），那么就返回这个保存的滚动位置，
  // 让页面滚动到之前的位置；如果没有保存的滚动位置，就返回 { top: 0 }，也就是让页面滚动到顶部。
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
});

// 最后将创建好的路由实例 router 通过 export default 语句导出，以便在 Vue.js 应用的其他地方（比如 main.js 文件）可以引入并挂载到 Vue 实例上，从而使路由功能在整个应用中生效
export default router;
