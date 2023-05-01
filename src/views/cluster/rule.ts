import { reactive } from "vue";
import type { FormRules } from "element-plus";

export const rules = reactive<FormRules>({
  clusterName: [
    { required: true, message: "请输入集群名称", trigger: "blur" },
    {
      min: 3,
      max: 20,
      message: "集群名称应在 3 到 20 个字符之间",
      trigger: "blur"
    }
  ],
  host: [
    {
      pattern: "^https?://.*[a-zA-Z0-9]$",
      required: true,
      message: "Api Server 地址必须是一个URL",
      trigger: "change"
    }
  ],
  bearerToken: [
    {
      pattern: "^([a-zA-Z0-9-_]+).([a-zA-Z0-9-_]+).([a-zA-Z0-9-_]+)$",
      required: false,
      message: "Token格式不正确",
      trigger: "change"
    }
  ],
  "tlsClientConfig.certData": [
    {
      required: false,
      message: "请输入客户端证书",
      trigger: "change"
    }
  ],
  "tlsClientConfig.keyData": [
    {
      required: false,
      message: "请输入客户端私钥",
      trigger: "change"
    }
  ],
  "tlsClientConfig.caData": [
    {
      required: true,
      message: "请输入CA证书",
      trigger: "change"
    }
  ]
});
