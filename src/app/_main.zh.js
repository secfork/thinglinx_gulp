  "nav": {
      "show": "展示1",
      "manage": "管理",

      "region": "区域",
      "system": "系统",
      "alarm": "报警",

      "account": "账户",
      "accountInfo": "账户信息",
      "bindWechat": "微信绑定",

      "user": "用户",
      "manageUser": "用户管理",
      "manageRole": "角色管理",

      "model": "模型",
      "systemModel": "系统模型",
      "deviceModel": "设备模型"
  },

  "text": {
      "search": "搜索",
      "return": "返回",

      "name": "名称",
      "createTime": "创建时间",
      "edit": "编辑",
      "create": "创建",
      "del": "删除",
      "update": "更新",

      "alter": "提示",
      "done": "确定",
      "cancel": "取消",

      "modelName": "模型名称",
      "modelType": "模型类型",

      "desc": "备注"
  },

  // "desc": " ======== 通用 select options==========",

  "field": {
      "access": { "0": "只读", "1": "只写", "2": "可读写" },
      "hlbyte": { "0": "HightByte", "1": "LowByte" },
      "yesno": { "0": "否", "1": "是" },
      "sysState": { "0|2": "未激活", "1": "激活", "2": "挂起" }

  },


  //  "desc": "============ 权限 说明 ===========================",

  "regionPermission": {
      "READ_DATA": "读取系统变量的数据",
      "WRITE_DATA": "将数据写入系统变量中",
      "ALARM_VIEW": "查看系统产生的报警",
      "ACK_ALARM": "确认系统产生的报警",
      "SYSTEM_MANAGE": "创建、删除系统，修改系统基本信息",
      "TICKET_MANAGE": "创建及删除系统的ticket",
      "REGION_USER_MANAGE": "为区域创建用户，以及管理用户权限",
      "SYN_CONFIG": "将系统工程同步到DAServer或网关",
      "SYSTEM_CONTROL": "系统数据下置及召唤，系统的激活及失效，切换系统配置项，保存网络参数等",


      "REGION_MANAGE": "创建、删除区域，修改区域基本信息",
      "MODEL_MANAGE": "创建、修改以及删除系统模型和设备模型",
      "USER_MANAGE": "创建、删除用户，修改用户基本信息以及管理用户权限",
      "ROLE_MANAGE": "创建、修改以及删除角色"

  },
  "accountPermission": {
      "REGION_MANAGE": "区域管理",
      "MODEL_MANAGE": "模型管理",
      "USER_MANAGE": "用户管理",
      "ROLE_MANAGE": "角色管理"

  },

  // "desc":"================ 角色 分类 =======================",
  "roleType": {
      "0": "账户角色",
      "1": "区域角色"
  },




  "err": {

      "phone_pattern_err": "电话号码格式不正确",

      "unknown": "未知错误",

      "pass_err": "用户名或密码错误",
      "sms_error": "短信发送失败",

      "identify_err": "验证码无效",
      "sms_verify_err": "短信验证码无效",

      "send_repetition": "验证码已经发送",

      "rest_err": "当前请求失败，建议您刷新页面或稍后重试!",
      "rest_404": "当前请求无效，建议您刷新页面或稍后重试!",

      "no_account": "无此Account 帐号",

      "send_maill_err": "邮件发送失败",
      "page_expire": "页面失效",
      "login_yet": "已经登录,无需重复登录",
      "no_send_smg": "未发送验证码",


      "ER_OLD_PASSWORD": "原始密码错误",
      "ER_NO_AUTH": "未授权",

      "ER_REGION_REF": "区域使用中",
      "ER_REGION_EXIST": "区域已经存在",
      "ER_REGION_NOT_EXIST": "区域不存在",
      "ER_REGION_PERMISSION_NOT_EXIST": "无区域权限",

      "ER_SYSTEM_EXISTS": "系统已经存在",
      "ER_SYSTEM_NOT_EXISTS": "系统不存在",

      "ER_CONTACT_EXISTS": "联系人已经存在",
      "ER_CONTACT_NOT_EXIST": "联系人不存在",

      "ER_CONTACT_NOT_EXISTS": "驱动不存在",

      "ER_SYSTEM_MODEL_EXISTS": "系统模型已经存在",
      "ER_SYSTEM_MODEL_NOT_EXISTS": "系统模型不存在",

      "ER_DEVICE_EXISTS": "设备已经存在",
      "ER_DEVICE_NOT_EXISTS": "设备不存在",

      "ER_TAG_EXISTS": "变量名已被占用",
      "ER_TAG_NOT_EXISTS": "变量不存在",

      "ER_DEVICE_MODEL_EXISTS": "设备模型已经存在",
      "ER_DEVICE_MODEL_NOT_EXISTS": "设备模型不存在",

      "ER_POINT_EXISTS": "point已经存在",
      "ER_POINT_NOT_EXISTS": "point不存在",

      "ER_PROFILE_EXISTS": "配置项已经存在",
      "ER_PROFILE_NOT_EXISTS": "配置项不存在",

      "ER_TRIGGER_EXISTS": "触发器已经存在",
      "ER_TRIGGER_NOT_EXISTS": "触发器不存在",

      "ER_MESSAGE_EXISTS": "消息配置已经存在",
      "ER_MESSAGE_NOT_EXISTS": "消息配置不存在",

      "ER_DRIVER_EXISTS": "驱动已经存在",
      "ER_DRIVER_NOT_EXISTS": "驱动不存在",

      "ER_GROUP_EXIST": "用户组名已被占用 ",
      "ER_USER_EXIST": "用户已存在",

      "ER_USER_NOT_EXIST": "用户不存在",


      "ER_DASERVER_EXISTS": "数据采集服务器已经存在",
      "ER_DASERVER_NOT_EXIST": "数据采集服务器不存在",

      "ER_SYSTEM_NOT_SAVE_LOG": "该点不保存历史",
      "BAD_REQUEST": "请求参数错误",

      "SPACE_NOT_EXIST": "报警空间不存在",
      "ACK_MESSAGE_NOT_EXIST": "报警信息不存在",

      "ER_INVALID_INVITATION_CODE": "邀请码无效",

      "ER_MOBILE_PHONE_NOT_VERIFIED": "手机未验证",

      "ER_SYSTEM_NO_LOG_DATA": "无历史数据",

      "ER_DEVICE_MODEL_REF": "设备模型使用中",
      "ER_SYSTEM_MODEL_REF": "系统模版使用中",

      "ER_SYSTEM_ACTIVE": "系统处于激活状态, 无法删除",
      "ER_SYSTEM_NOT_ACTIVE": "系统尚未激活",

      "ER_DASERVER_HAS_NOT_ASSIGNED": "系统尚未指定数据采集服务器",

      "ER_INVALID_USER_OR_PASSWORD": "无效的用户名或密码",
      "ER_INVALID_USER_OR_ACCOUNT": "无效的账户名或用户名",

      "ER_PROFILE_REF": "配置项使用中",
      "Er_ACCOUNT_EXIST": "该Account名已被占用",
      "ER_INVALID_ACCOUNT_NAME": "该Account名已被占用",
      "ER_DELETE_SUPER_USER": "管理员账户不可删除",

      "ER_MODIFY_DEFAULT_ROLE": "默认角色不可更改",

      "ALARM_ALLREADY_ACKED": "报警已经确认,无需再次确认",

      "ER_ACCOUNT_NOT_EXIST": "Account用户不存在",
      "ER_DUP_ENIRY": "_ ER_DUP_ENIRY _",
      "ER_AUTH_FAILURE": "您无权限执行此项操作",
      "ER_SYSTEM_REF": "当前区域下存在系统，不能被删除",



      "ER_SENDMESSAGE_ERROR": "_作废_控制命令发送失败,原因可能为超时或者设备收到数据处理错误",
      "ER_TIME_OUT": "发送消息超时",
      "ER_HTTP_OFFLINE": "网络繁忙",
      "ER_DA_SVR_STOP": "DAServer停止",
      "ER_DEV_NOT_EXIST": "设备不存在",
      "ER_DEV_STOP": "设备停止",
      "ER_DEV_OFFLINE": "设备离线",
      "ER_TAG_NOT_EXIST": "点不存在",
      "ER_TAG_READONLY": "点只读",
      "ER_TAG_TYPE_ERR": "数据类型错误",
      "ER_PARA_ERR": "参数错误",
      "ER_WRITE_QUEUE_FULL": "下置队列满",
      "ER_DEV_INACTIVE": "设备未激活",
      "ER_DEV_COMM_TYPE_ERR": "设备通讯类型错误",
      "ER_DEV_COUNT_ZERO": "设备数为空",
      "ER_TAG_COUNT_ZERO": "设备点数为空",
      "ER_LINK_COUNT_ZERO": "设备连接项为空",
      "ER_DEV_NET_CFG_ERR": "设备网络参数错误",
      "ER_DEV_SIMID_USED": "设备SIMID号被占用",

      "ER_PARSE_ERROR": "未知错误",
      "ER_CODE_EXCEPTION": "未知错误",
      "ER_JSON_PARSE_ERR": "未知错误",
      "ER_CMD_TYPE_ERR": "未知错误",
      "ER_UNKNOWN_ERROR": "未知错误　",

      "ER_SERVICE_UNAVAILABLE": "命令发送失败",



      "ER_SUBSCRIBE_EXIST": "订阅已经存在",
      "ER_EMAIL_NOT_VERIFIED": "邮箱未通过验证",
      "ER_MOBILE_PHONE_NOT_VERIFIED": "手机未通过验证",
      "ER_SYSTEM_HAS_BOUND": "系统已经绑定Ticket",

      "ER_ROLE_REF": "角色使用中,无法删除!",
      "ER_ROLE_EXISTS": "角色已经存在",
      "ER_MODIFY_ROLE_PERMISSION": "无权限修改角色",
      "ER_MODIFY_PERMISSION": "无权限"

  }

