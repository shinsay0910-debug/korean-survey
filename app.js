(function () {
  const C = window.SURVEY_CONFIG;
  const form = document.getElementById("surveyForm");
  const OTHER = "__other__";
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  document.getElementById("title").textContent = C.title;
  document.getElementById("description").textContent = C.description;
  document.getElementById("closing").textContent = C.closing;
  document.title = C.title;

  // ---------- 렌더링 ----------
  function labelHtml(q) {
    return `<span class="q-label"><span class="q-no">${esc(q.no)}</span>${esc(q.label)}${q.required ? '<span class="req">*</span>' : ""}</span>`;
  }

  function renderQuestion(q) {
    let body = "";
    if (q.type === "text") {
      body = `<input type="text" name="${q.id}" autocomplete="off" />`;
    } else if (q.type === "paragraph") {
      body = `<textarea name="${q.id}"></textarea>`;
    } else if (q.type === "radio") {
      body = q.options.map((o) =>
        `<label class="opt"><input type="radio" name="${q.id}" value="${esc(o)}" /> ${esc(o)}</label>`).join("");
      if (q.allowOther) {
        body += `<label class="opt"><input type="radio" name="${q.id}" value="${OTHER}" /> 기타:
          <input type="text" class="other-input" name="${q.id}__other" /></label>`;
      }
    } else if (q.type === "grid") {
      const head = `<tr><th></th>${q.columns.map((c) => `<th>${esc(c)}</th>`).join("")}</tr>`;
      const rows = q.rows.map((r, i) => `<tr data-row="${i}"><td class="row-label">${i + 1}. ${esc(r)}</td>${
        q.columns.map((c) => `<td class="cell"><label data-col="${esc(c)}"><input type="radio" name="${q.id}__${i}" value="${esc(c)}" aria-label="${esc(r)} - ${esc(c)}" /></label></td>`).join("")
      }</tr>`).join("");
      body = `<div class="grid-wrap"><table class="grid"><thead>${head}</thead><tbody>${rows}</tbody></table></div>`;
    }
    return `<div class="card q" data-qid="${q.id}">${labelHtml(q)}${body}<div class="err">필수 문항입니다.</div></div>`;
  }

  let html = "";
  C.sections.forEach((s) => {
    html += `<h2 class="section-title">${esc(s.title)}</h2>`;
    if (s.note) html += `<p class="section-note">${esc(s.note)}</p>`;
    html += s.questions.map(renderQuestion).join("");
  });
  html += `<div class="actions"><button type="submit" class="btn" id="submitBtn">제출</button>
           <button type="button" class="btn ghost" id="clearBtn">양식 지우기</button></div>`;
  form.innerHTML = html;

  const allQ = C.sections.flatMap((s) => s.questions);

  // "기타" 입력칸에 타이핑하면 기타 라디오 자동 선택
  form.querySelectorAll(".other-input").forEach((inp) => {
    inp.addEventListener("input", () => {
      const r = form.querySelector(`input[name="${inp.name.replace("__other", "")}"][value="${OTHER}"]`);
      if (inp.value) r.checked = true;
    });
  });

  // ---------- 값 수집 ----------
  function valueOf(q) {
    const fd = new FormData(form);
    if (q.type === "grid") {
      return q.rows.map((_, i) => fd.get(`${q.id}__${i}`) || "");
    }
    let v = (fd.get(q.id) || "").toString().trim();
    if (v === OTHER) v = "기타: " + (fd.get(`${q.id}__other`) || "").toString().trim();
    return v;
  }

  function isAnswered(q, v) {
    if (q.type === "grid") return v.every((x) => x);
    if (v.startsWith("기타:")) return v.length > "기타: ".length;
    return v !== "";
  }

  // ---------- 진행률 ----------
  function updateProgress() {
    const req = allQ.filter((q) => q.required);
    const done = req.filter((q) => isAnswered(q, valueOf(q))).length;
    document.getElementById("progressBar").style.width = (done / req.length) * 100 + "%";
  }
  form.addEventListener("change", updateProgress);
  form.addEventListener("input", updateProgress);

  // ---------- 검증 ----------
  function validate() {
    let first = null;
    allQ.forEach((q) => {
      const card = form.querySelector(`[data-qid="${q.id}"]`);
      const v = valueOf(q);
      const bad = q.required && !isAnswered(q, v);
      card.classList.toggle("invalid", bad);
      if (q.type === "grid") {
        card.querySelectorAll("tr[data-row]").forEach((tr, i) => tr.classList.toggle("missing", bad && !v[i]));
      }
      if (bad && !first) first = card;
    });
    if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
    return !first;
  }

  // ---------- 응답 → 평면 객체 (시트 1행) ----------
  function buildRecord() {
    const rec = { "제출시각": new Date().toLocaleString("ko-KR", { hour12: false }) };
    allQ.forEach((q) => {
      const v = valueOf(q);
      if (q.type === "grid") {
        q.rows.forEach((r, i) => { rec[`${q.no}-${i + 1} ${r}`] = v[i]; });
      } else {
        rec[`${q.no} ${q.label}`] = v;
      }
    });
    return rec;
  }

  function download(rec) {
    const blob = new Blob([JSON.stringify(rec, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `응답_${Date.now()}.json`;
    a.click();
  }

  // ---------- 제출 ----------
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const btn = document.getElementById("submitBtn");
    btn.disabled = true; btn.textContent = "제출 중…";
    const rec = buildRecord();
    try {
      if (C.endpoint) {
        // Apps Script는 CORS 응답 헤더를 주지 않으므로 no-cors + text/plain 으로 전송
        await fetch(C.endpoint, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(rec)
        });
      } else {
        download(rec);
      }
      form.hidden = true;
      document.getElementById("done").hidden = false;
      document.getElementById("progressBar").style.width = "100%";
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      alert("제출에 실패했습니다. 네트워크를 확인한 뒤 다시 시도해 주세요.\n" + err);
      btn.disabled = false; btn.textContent = "제출";
    }
  });

  document.getElementById("clearBtn").addEventListener("click", () => {
    if (confirm("입력한 내용을 모두 지울까요?")) {
      form.reset();
      form.querySelectorAll(".invalid, .missing").forEach((el) => el.classList.remove("invalid", "missing"));
      updateProgress();
    }
  });
})();
