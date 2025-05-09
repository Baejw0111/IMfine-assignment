/**
 * 데이터 테이블 렌더링 함수
 * @param {*} stagedData 렌더링할 파싱된 데이터 배열
 * @param {*} tableBody 데이터 테이블 요소
 */
export function renderTable(stagedData, tableBody) {
  tableBody.replaceChildren(); // 테이블 본문 초기화

  // 테이블 본문 렌더링
  stagedData.forEach((d, i) => {
    const rowHtml = `
      <tr>
        <td>${d.id}</td>
        <td><input type="number" value="${d.value}" data-index="${i}"></td>
        <td><button class="delete-btn" data-index="${i}">삭제</button></td>
      </tr>
    `;
    tableBody.insertAdjacentHTML("beforeend", rowHtml);
  });

  // 삭제 버튼 이벤트 위임
  tableBody.addEventListener("click", (e) => {
    if (e.target.matches(".delete-btn")) {
      const index = parseInt(e.target.dataset.index);
      stagedData.splice(index, 1);
      renderTable(stagedData, tableBody);
    }
  });
}
