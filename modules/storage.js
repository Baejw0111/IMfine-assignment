const DEFAULT_DATA = [
  { id: "A", value: 30 },
  { id: "B", value: 60 },
  { id: "C", value: 90 },
];

/**
 * 로컬 스토리지에 저장된 데이터 로드
 * @returns 데이터 배열
 */
export function loadData() {
  try {
    const raw = localStorage.getItem("chartData");
    if (!raw) return DEFAULT_DATA;

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_DATA; // 파싱된 데이터가 제대로된 데이터 형태가 아니면 기본 데이터 반환
  } catch (error) {
    alert("로컬 스토리지에서 데이터를 불러오는데 실패했습니다:", error);
    localStorage.removeItem("chartData");
    return DEFAULT_DATA;
  }
}

/**
 * 로컬 스토리지에 데이터 저장
 * @param {*} data 저장할 데이터 배열
 */
export function saveData(data) {
  try {
    localStorage.setItem("chartData", JSON.stringify(data));
  } catch (error) {
    alert("데이터 저장에 실패했습니다:", error);
    throw new Error("데이터 저장에 실패했습니다.");
  }
}
