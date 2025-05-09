const CHART_PADDING = 50;
const BAR_WIDTH = 50;
const BAR_GAP = 20;

// 툴팁 요소 생성
const tooltip = document.createElement("div");
tooltip.className = "chart-tooltip";
document.body.appendChild(tooltip);

/**
 * 차트 렌더링 함수
 * @param {*} canvas 차트를 그릴 캔버스 요소
 * @param {*} data 차트에 표시할 데이터 배열
 */
export function renderChart(canvas, data) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const chartWidth = canvas.width - CHART_PADDING * 2;
  const chartHeight = canvas.height - CHART_PADDING * 2;
  const maxValue = Math.max(...data.map((d) => d.value), 1); // 데이터 최대값

  drawAxes(ctx, canvas, chartHeight, maxValue); // 축 그리기
  drawBars(ctx, canvas, data, chartWidth, chartHeight, maxValue); // 막대 그리기
  addChartInteractivity(canvas, data, chartWidth, chartHeight, maxValue); // 상호작용 기능 추가
}

/**
 * 차트 축 그리기 함수
 * @param {*} ctx 캔버스 컨텍스트
 * @param {*} canvas 차트를 그릴 캔버스 요소
 * @param {*} chartHeight 차트 높이
 * @param {*} maxValue 차트 최대값
 */
function drawAxes(ctx, canvas, chartHeight, maxValue) {
  // 좌표축 그리기
  ctx.beginPath();
  ctx.moveTo(CHART_PADDING, CHART_PADDING);
  ctx.lineTo(CHART_PADDING, canvas.height - CHART_PADDING);
  ctx.lineTo(canvas.width - CHART_PADDING, canvas.height - CHART_PADDING);
  ctx.lineWidth = 2;
  ctx.stroke();

  // 좌표축 눈금 설정
  const tickCount = 5; // 축 눈금 개수
  const tickGap = maxValue / tickCount; // 눈금 간격
  ctx.textAlign = "right"; // 좌표축 텍스트 정렬
  ctx.textBaseline = "middle"; // 좌표축 텍스트 기본선
  ctx.font = "16px sans-serif"; // 좌표축 텍스트 폰트

  // 좌표축 눈금 그리기
  for (let i = 0; i <= tickCount; i++) {
    const value = Math.round(i * tickGap); // 눈금 값
    const y = canvas.height - CHART_PADDING - (value / maxValue) * chartHeight; // 눈금 위치
    ctx.fillText(value.toString(), CHART_PADDING - 10, y); // 눈금 텍스트 그리기
    ctx.beginPath(); // 눈금 선 그리기
    ctx.moveTo(CHART_PADDING - 5, y); // 눈금 선 시작점
    ctx.lineTo(CHART_PADDING, y);
    ctx.stroke();
  }
}

/**
 * 차트 막대 그리기 함수
 * @param {*} ctx 캔버스 컨텍스트
 * @param {*} canvas 차트를 그릴 캔버스 요소
 * @param {*} data 차트에 표시할 데이터 배열
 * @param {*} chartWidth 차트 너비
 * @param {*} chartHeight 차트 높이
 * @param {*} maxValue 차트 최대값
 * @param {*} dataLength 데이터 배열 길이
 */
function drawBars(ctx, canvas, data, chartWidth, chartHeight, maxValue) {
  const scale = chartHeight / maxValue;
  const totalWidth = data.length * (BAR_WIDTH + BAR_GAP);
  const offsetX = (chartWidth - totalWidth + BAR_GAP) / 2 + CHART_PADDING;

  data.forEach((d, i) => {
    const x = offsetX + i * (BAR_WIDTH + BAR_GAP);
    const barHeight = d.value * scale;
    const y = canvas.height - CHART_PADDING - barHeight;

    ctx.fillStyle = "coral";
    ctx.fillRect(x, y, BAR_WIDTH, barHeight);

    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = "16px sans-serif";
    ctx.fillText(d.id, x + BAR_WIDTH / 2, canvas.height - CHART_PADDING + 5);
  });
}

/**
 * 차트 상호작용 기능 추가
 * @param {*} canvas 차트를 그릴 캔버스 요소
 * @param {*} data 차트에 표시할 데이터 배열
 * @param {*} chartWidth 차트 너비
 * @param {*} chartHeight 차트 높이
 * @param {*} maxValue 차트 최대값
 */
function addChartInteractivity(
  canvas,
  data,
  chartWidth,
  chartHeight,
  maxValue
) {
  const totalWidth = data.length * (BAR_WIDTH + BAR_GAP);
  const offsetX = (chartWidth - totalWidth + BAR_GAP) / 2 + CHART_PADDING;

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 마우스가 차트 영역 내에 있는지 확인
    if (
      x < CHART_PADDING ||
      x > canvas.width - CHART_PADDING ||
      y < CHART_PADDING ||
      y > canvas.height - CHART_PADDING
    ) {
      tooltip.style.display = "none";
      return;
    }

    // 마우스가 있는 막대 찾기
    const barIndex = Math.floor((x - offsetX) / (BAR_WIDTH + BAR_GAP));
    if (barIndex >= 0 && barIndex < data.length) {
      const bar = data[barIndex];
      const barX = offsetX + barIndex * (BAR_WIDTH + BAR_GAP);

      // 마우스가 막대 위에 있는지 확인
      if (x >= barX && x <= barX + BAR_WIDTH) {
        const value = maxValue - ((y - CHART_PADDING) / chartHeight) * maxValue;
        tooltip.style.display = "block";
        tooltip.style.left = `${e.clientX + 10}px`;
        tooltip.style.top = `${e.clientY + 10}px`;
        tooltip.innerHTML = `
          <strong>${bar.id}</strong><br>
          값: ${bar.value}
        `;
      } else {
        tooltip.style.display = "none";
      }
    } else {
      tooltip.style.display = "none";
    }
  });

  canvas.addEventListener("mouseleave", () => {
    tooltip.style.display = "none";
  });
}
