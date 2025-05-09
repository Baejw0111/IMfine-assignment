/**
 * 모달 열기 함수
 * @param {*} id 모달 ID
 */
export function openModal(id) {
  document.getElementById(id).classList.remove("hidden");
}

/**
 * 모달 닫기 함수
 * @param {*} id 모달 ID
 */
export function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}
