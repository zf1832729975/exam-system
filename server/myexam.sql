

-- ----------------------
--
-- 表的结构 `学生表`
--

CREATE TABLE `student`  (
    `stu_id` int(0) NOT NULL AUTO_INCREMENT COMMENT '学号',
  `stu_name` char(8) NOT NULL COMMENT '名字',
  `stu_pwd` char(32) NOT NULL DEFAULT 123456 COMMENT '密码',
  `stu_sex` char(2) NOT NULL COMMENT '性别',
  PRIMARY KEY (`stu_id`)
);