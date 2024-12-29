# src.server.router

router 模块下存放用于 express 的路由以及相应的路由函数定义。

约定 对外暴露的 HTTP 路由函数，总以 /api/ 开头。而后 /api 目录下的文件夹，以相应路由的 Path 层级确定，即使用基于 API Path 的层级结构对源代码进行编排。

例如，/api/v1/user/login 的路由函数，应当存放在 /v1/user/login/handler.ts 文件中。