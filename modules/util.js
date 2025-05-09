/**
 * 데이터 검증 유틸리티
 * @param {number} value 검증할 값
 * @param {string} id 검증할 ID
 * @param {string[]} existingIds 이미 존재하는 ID 배열
 * @returns {boolean} 검증 결과
 */
export const validateData = {
  value: (value) => {
    console.log(value);
    if (value < 0) throw new Error("값은 0 이상이어야 합니다");
    if (value > 1000) throw new Error("값은 1000 이하여야 합니다");
    return true;
  },
  id: (id, existingIds) => {
    if (!id.trim()) throw new Error("ID는 비어있을 수 없습니다");
    if (existingIds.includes(id)) throw new Error("이미 존재하는 ID입니다");
    return true;
  },
};

/**
 * 사용자 피드백 유틸리티
 * @param {string} message 피드백 메시지
 * @param {string} type 피드백 타입
 */
export function showFeedback(message, type = "error") {
  const feedbackDiv = document.createElement("div");
  feedbackDiv.className = `feedback-message ${type}`;
  feedbackDiv.textContent = message;
  document.body.appendChild(feedbackDiv);
  setTimeout(() => feedbackDiv.remove(), 3000); // 3초 후 삭제
}
