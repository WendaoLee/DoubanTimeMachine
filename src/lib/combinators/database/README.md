# src.lib.combinators.database

本模块存放了所有关于数据库的组合子。
其中，对于组合完的业务逻辑，存放在 index.ts 中。

如果需要对数据库进行操作，请在 src.lib.combinators.database 下的子模块根据数据获取类型在不同模块中择选函数导入。

## 命名规范：

1. 获取数据，一律以 `fetch` 开头