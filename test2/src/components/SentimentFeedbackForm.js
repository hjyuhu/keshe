import React, { useState } from "react";
import sanitizeHtml from "sanitize-html";

const SentimentFeedbackForm = () => {
  // 状态管理：反馈内容、错误信息和提交后的反馈内容
  const [formData, setFormData] = useState({ comment: "" });
  const [errors, setErrors] = useState({});
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [sanitizedComment, setSanitizedComment] = useState("");

  // 校验表单
  const validateForm = () => {
    let newErrors = {};

    // 校验反馈内容是否为空
    if (!formData.comment.trim()) {
      newErrors.comment = "反馈内容不能为空";
    }

    return newErrors;
  };

  // 处理表单提交
  const handleSubmit = (e) => {
    e.preventDefault();

    // 校验表单
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // 清理 XSS
      const sanitized = sanitizeHtml(formData.comment, {
        allowedTags: ["b", "i", "em", "strong"], // 允许的 HTML 标签
        allowedAttributes: {}, // 允许的属性
      });
      setSanitizedComment(sanitized);

      // 模拟提交反馈
      console.log("提交的反馈内容:", sanitizedComment);
      setFeedbackSent(true);
    }
  };

  // 处理输入变化
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined, // 清除当前字段的错误
    }));
  };

  return (
    <div className="feedback-form">
      <h2>舆情反馈表单</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="comment">反馈内容:</label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="请输入反馈内容..."
            rows="5"
            cols="50"
          />
          {errors.comment && <p className="error">{errors.comment}</p>}
        </div>
        <button type="submit">提交反馈</button>
      </form>

      {/* 提交成功提示 */}
      {feedbackSent && (
        <div className="feedback-success">
          <h3>感谢您的反馈！</h3>
          <p>您的反馈内容是：</p>
          <div dangerouslySetInnerHTML={{ __html: sanitizedComment }}></div>
        </div>
      )}
    </div>
  );
};

export default SentimentFeedbackForm;
