// Speaker Quest: builds a tab + quiz game for every session in sessions.js

const tabsEl = document.getElementById("tabs");
const panel = document.getElementById("panel");

// ---------- Small helpers ----------
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function shuffle(list) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Best scores are saved in this browser only (a static site has no database).
function getBest(id) {
  try { return Number(localStorage.getItem("best-" + id)) || 0; } catch (e) { return 0; }
}
function setBest(id, score) {
  try { if (score > getBest(id)) localStorage.setItem("best-" + id, score); } catch (e) {}
}

// ---------- Tabs ----------
function renderTabs(activeId) {
  tabsEl.innerHTML = "";
  SESSIONS.forEach((s) => {
    const btn = el("button", "tab", s.tab);
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", s.id === activeId ? "true" : "false");
    btn.addEventListener("click", () => { location.hash = s.id; });
    tabsEl.appendChild(btn);
  });
}

function currentSession() {
  const id = location.hash.slice(1);
  return SESSIONS.find((s) => s.id === id) || SESSIONS[SESSIONS.length - 1];
}

// ---------- Intro screen ----------
function renderIntro(s) {
  panel.innerHTML = "";
  const card = el("section", "card");
  card.appendChild(el("h2", "session-title", s.title));
  card.appendChild(el("p", "speakers", "Speakers: " + s.speakers));
  card.appendChild(el("p", "summary", s.summary));

  if (s.takeaways && s.takeaways.length) {
    const det = el("details");
    det.appendChild(el("summary", null, "Key takeaways (read these first)"));
    const ul = el("ul");
    s.takeaways.forEach((t) => ul.appendChild(el("li", null, t)));
    det.appendChild(ul);
    card.appendChild(det);
  }

  const row = el("div", "btn-row");
  const start = el("button", "btn", "Start the quiz (" + s.questions.length + " questions)");
  start.addEventListener("click", () => startGame(s));
  row.appendChild(start);
  card.appendChild(row);

  const best = getBest(s.id);
  if (best) card.appendChild(el("p", "speakers", "Your best: " + best + " / " + s.questions.length));

  panel.appendChild(card);
}

// ---------- Game ----------
function startGame(s) {
  const state = {
    order: shuffle(s.questions),
    index: 0,
    score: 0,
    streak: 0,
    missed: []
  };
  renderQuestion(s, state);
}

function renderQuestion(s, state) {
  const item = state.order[state.index];
  const total = state.order.length;
  panel.innerHTML = "";
  const card = el("section", "card");

  const hud = el("div", "hud");
  const left = el("span");
  left.append("Question ", el("strong", null, String(state.index + 1)), " of " + total);
  const right = el("span");
  right.append("Score ", el("strong", null, String(state.score)));
  if (state.streak >= 2) right.append("  ", el("span", "streak", "🔥 " + state.streak + " in a row"));
  hud.append(left, right);
  card.appendChild(hud);

  const bar = el("div", "progress");
  const fill = el("div");
  fill.style.width = (state.index / total) * 100 + "%";
  bar.appendChild(fill);
  card.appendChild(bar);

  card.appendChild(el("h3", "question", item.q));

  // Shuffle options but remember which one is correct
  const opts = shuffle(item.options.map((text, i) => ({ text, correct: i === item.answer })));
  const list = el("div", "options");
  const buttons = opts.map((o) => {
    const b = el("button", "option", o.text);
    b.addEventListener("click", () => answer(o, b));
    list.appendChild(b);
    return b;
  });
  card.appendChild(list);

  const feedbackSlot = el("div");
  card.appendChild(feedbackSlot);
  panel.appendChild(card);

  function answer(choice, clicked) {
    buttons.forEach((b, i) => {
      b.disabled = true;
      if (opts[i].correct) b.classList.add("correct");
    });
    if (choice.correct) {
      state.score++;
      state.streak++;
    } else {
      clicked.classList.add("wrong");
      state.streak = 0;
      state.missed.push(item);
    }

    const fb = el("div", "feedback " + (choice.correct ? "good" : "bad"));
    fb.appendChild(el("b", null, choice.correct ? "Correct!" : "Not quite."));
    fb.appendChild(document.createTextNode(item.explain));
    feedbackSlot.appendChild(fb);

    const row = el("div", "btn-row");
    const last = state.index === total - 1;
    const next = el("button", "btn", last ? "See results" : "Next question →");
    next.addEventListener("click", () => {
      state.index++;
      last ? renderResults(s, state) : renderQuestion(s, state);
    });
    row.appendChild(next);
    feedbackSlot.appendChild(row);
    next.focus();
  }
}

// ---------- Results ----------
function renderResults(s, state) {
  const total = state.order.length;
  const prevBest = getBest(s.id);
  setBest(s.id, state.score);

  panel.innerHTML = "";
  const card = el("section", "card");
  card.appendChild(el("h2", "session-title", "Quiz complete"));
  card.appendChild(el("div", "result-score", state.score + " / " + total));

  const pct = state.score / total;
  const msg =
    pct === 1 ? "Perfect score. You could have given this talk yourself." :
    pct >= 0.75 ? "Great work. Just a couple to brush up on." :
    pct >= 0.5 ? "Solid start. Review the ones below and try again." :
    "Open the key takeaways, then give it another go.";
  card.appendChild(el("p", null, msg));
  if (state.score > prevBest && prevBest > 0) card.appendChild(el("p", "streak", "New personal best!"));

  if (state.missed.length) {
    card.appendChild(el("h3", null, "Review what you missed"));
    state.missed.forEach((m) => {
      const r = el("div", "review-item");
      r.appendChild(el("strong", null, m.q));
      r.appendChild(el("p", null, "Answer: " + m.options[m.answer] + ". " + m.explain));
      card.appendChild(r);
    });
  }

  const row = el("div", "btn-row");
  const again = el("button", "btn", "Play again");
  again.addEventListener("click", () => startGame(s));
  const back = el("button", "btn ghost", "Back to session");
  back.addEventListener("click", () => renderIntro(s));
  row.append(again, back);
  card.appendChild(row);

  panel.appendChild(card);
}

// ---------- Start up ----------
function route() {
  const s = currentSession();
  renderTabs(s.id);
  renderIntro(s);
}
window.addEventListener("hashchange", route);
route();
