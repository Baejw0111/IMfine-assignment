import { loadData, saveData } from "./storage.js"; // 데이터 저장 및 로드
import { renderChart } from "./chartRenderer.js"; // 차트 렌더링
import { renderTable } from "./tableRenderer.js"; // 테이블 렌더링
import { openModal, closeModal } from "./modal.js"; // 모달 열기 및 닫기
import { validateData, showFeedback } from "./util.js"; // 데이터 검증 및 피드백

let data = loadData(); // 직렬화된 형태의 JSON 데이터
let stagedData = JSON.parse(JSON.stringify(data)); // 파싱된 JSON 데이터

const canvas = document.getElementById("chart-canvas"); // 차트 캔버스
const tableBody = document.querySelector("#data-table tbody"); // 데이터 테이블 본문
const jsonEditor = document.getElementById("json-editor"); // JSON 편집기

/**
 * 모든 요소를 업데이트하는 함수
 */
function updateAll() {
  canvas.width = Math.max(1000, data.length * 70 + 100); // 차트 너비 업데이트
  renderChart(canvas, data);
  renderTable(stagedData, tableBody);
  jsonEditor.value = JSON.stringify(data, null, 2);
  saveData(data);
}

/**
 * 이벤트 바인딩 함수
 */
function bindEvents() {
  // 테이블 적용 버튼 클릭 이벤트
  document.getElementById("apply-table").onclick = () => {
    try {
      const inputs = tableBody.querySelectorAll("input");
      inputs.forEach((input) => {
        const index = +input.dataset.index;
        stagedData[index].value = +input.value;
        console.log(input.value);
      });

      // 데이터 값 검사
      stagedData.forEach((d) => {
        validateData.value(d.value);
      });

      updateAll();
      closeModal("modal-table");
      showFeedback("테이블 데이터가 성공적으로 적용되었습니다", "success");
    } catch (error) {
      showFeedback(error.message);
    }
  };

  // 값 추가 버튼 클릭 이벤트
  document.getElementById("add-button").onclick = () => {
    try {
      const id = document.getElementById("new-id").value.trim();
      const value = +document.getElementById("new-value").value;

      // 데이터 검증
      validateData.id(
        id,
        data.map((d) => d.id)
      );
      validateData.value(value);

      // 데이터 업데이트
      data.push({ id, value });
      stagedData = JSON.parse(JSON.stringify(data));
      updateAll();

      // 입력 필드 초기화
      document.getElementById("new-id").value = "";
      document.getElementById("new-value").value = "";

      closeModal("modal-add");
      showFeedback("데이터가 성공적으로 추가되었습니다", "success");
    } catch (error) {
      showFeedback(error.message);
    }
  };

  // JSON 코드 적용 버튼 클릭 이벤트
  document.getElementById("apply-json").onclick = () => {
    try {
      const parsed = JSON.parse(jsonEditor.value);

      // 데이터 형식 검사
      if (!Array.isArray(parsed)) {
        throw new Error("데이터는 배열 형태여야 합니다");
      }

      // 데이터 값 검사
      parsed.forEach((item) => {
        if (!item.id || typeof item.value !== "number") {
          throw new Error("각 항목은 id와 number 타입의 value를 가져야 합니다");
        }
        validateData.value(item.value);
      });

      // ID 중복 검사
      const ids = parsed.map((item) => item.id);
      if (new Set(ids).size !== ids.length) {
        throw new Error("중복된 ID가 있습니다");
      }

      data = parsed;
      stagedData = JSON.parse(JSON.stringify(data));
      updateAll();
      closeModal("modal-json");
      showFeedback("JSON 데이터가 성공적으로 적용되었습니다", "success");
    } catch (e) {
      showFeedback(e.message);
    }
  };

  // 모달 열기 버튼 클릭 이벤트
  document.getElementById("open-table-modal").onclick = () => {
    stagedData = JSON.parse(JSON.stringify(data));
    renderTable(stagedData, tableBody);
    openModal("modal-table");
  };
  document.getElementById("open-add-modal").onclick = () =>
    openModal("modal-add");
  document.getElementById("open-json-modal").onclick = () =>
    openModal("modal-json");

  // 모달 닫기 버튼 클릭 이벤트
  document.querySelectorAll(".close-button").forEach((btn) => {
    btn.addEventListener("click", () => closeModal(btn.dataset.close));
  });
}

// 이벤트 처리 및 모든 요소 업데이트
bindEvents();
updateAll();
