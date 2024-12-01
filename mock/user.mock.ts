import type { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/api/user/page",
    method: "get",
    response: () => ({
      code: 200,
      message: "成功",
      "data|1-11": [
        {
          id: "@id",
          username: "@name",
          "age|20-40": 1,
          email: "@email",
          sex: "@integer(0, 1)",
          "avatar|1": ["https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"],
          "status|1": [0, 1],
          "createTime|1": ["@datetime"],
          "updateTime|1": ["@datetime"],
          "phone|1": ["@integer(10000000000, 19999999999)"],
        },
      ],
    }),
  },
  {
    url: "/api/user/add",
    method: "post",
    response: () => ({
      code: 200,
      message: "成功",
      data: null,
    }),
  },
  {
    url: "/api/user/edit",
    method: "put",
    response: () => ({
      code: 200,
      message: "成功",
      data: null,
    }),
  },
  {
    url: "/api/user/delete",
    method: "delete",
    response: () => ({
      code: 200,
      message: "成功",
      data: null,
    }),
  },
  {
    url: "/api/upload/image",
    method: "post",
    response: () => ({
      code: 200,
      message: "成功",
      data: {
        path: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      },
    }),
  },
] as MockMethod[];
