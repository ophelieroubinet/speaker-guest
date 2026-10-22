// Speaker Quest: builds a tab + quiz game for every session in sessions.js

const tabsEl = document.getElementById("tabs");
const panel = document.getElementById("panel");
const heroPhoto = document.getElementById("hero-photo");

// Header photos rotate as you move through the quiz
const PHOTOS = [
  { src: "photo-1.jpg", alt: "Pressed flowers around the words: everything works out for me" },
  { src: "photo-2.jpg", alt: "Pink water lilies with the words: You'll figure it out. You always have." },
  { src: "photo-3.jpg", alt: "Pink roses with the words: Always do it with so much love" },
  { src: "photo-4.jpg", alt: "City street at sunset with the words: Everything works out for you" },
  { src: "photo-5.jpg", alt: "Pink lilies with the words: I was created to create." }
];
const KEYS = ["A", "B", "C", "D", "E", "F"];

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

function setPhoto(n) {
  const p = PHOTOS[n % PHOTOS.length];
  heroPhoto.src = p.src;
  heroPhoto.alt = p.alt;
}

// Best scores are saved in this browser only (a static site has no database).
function getBest(id) {
  try { return Number(localStorage.getItem("best-" + id)) || 0; } catch (e) { return 0; }
}
function setBest(id, score) {
  try { if (score > getBest(id)) localStorage.setItem("best-" + id, score); } catch (e) {}
}

// Coloured tiles: one per question (olive = right, red = missed, orange = current)
function renderTiles(total, results, currentIndex, extraClass) {
  const row = el("div", "tiles" + (extraClass ? " " + extraClass : ""));
  row.setAttribute("role", "img");
  for (let t = 0; t < total; t++) {
    let cls = "tile";
    if (t < results.length) cls += results[t] ? " right" : " miss";
    else if (t === currentIndex) cls += " current";
    row.appendChild(el("div", cls));
  }
  return row;
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
  setPhoto(0);
  panel.innerHTML = "";
  const card = el("section", "card");
  card.appendChild(el("p", "now-playing", "Now playing"));
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
  const start = el("button", "btn start", "Start the quiz (" + s.questions.length + " questions)");
  start.addEventListener("click", () => startGame(s));
  row.appendChild(start);
  const best = getBest(s.id);
  if (best) row.appendChild(el("span", "best-badge", "Your best: " + best + " / " + s.questions.length));
  card.appendChild(row);

  panel.appendChild(card);
}

// ---------- Game ----------
function startGame(s) {
  const state = {
    order: shuffle(s.questions),
    index: 0,
    score: 0,
    streak: 0,
    results: [],
    missed: []
  };
  renderQuestion(s, state);
}

function renderQuestion(s, state) {
  const item = state.order[state.index];
  const total = state.order.length;
  setPhoto(state.index + 1);
  panel.innerHTML = "";
  const card = el("section", "card play");

  const hud = el("div", "hud");
  const left = el("span", "count");
  left.append("Question ", el("strong", null, String(state.index + 1)), " of " + total);
  const right = el("span", "hud-right");
  if (state.streak >= 2) right.appendChild(el("span", "streak", "🔥 " + state.streak + " in a row"));
  right.appendChild(el("span", "score-pill", "Score " + state.score));
  hud.append(left, right);
  card.appendChild(hud);

  const tiles = renderTiles(total, state.results, state.index);
  tiles.setAttribute("aria-label", "Progress: question " + (state.index + 1) + " of " + total);
  card.appendChild(tiles);

  card.appendChild(el("h3", "question", item.q));

  // Shuffle options but remember which one is correct
  const opts = shuffle(item.options.map((text, i) => ({ text, correct: i === item.answer })));
  const list = el("div", "options");
  const buttons = opts.map((o, i) => {
    const b = el("button", "option");
    b.append(el("span", "key", KEYS[i]), el("span", null, o.text));
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
      else if (b !== clicked) b.classList.add("dim");
    });
    state.results.push(choice.correct);
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
    fb.appendChild(el("span", null, item.explain));
    feedbackSlot.appendChild(fb);

    const row = el("div", "btn-row");
    const last = state.index === total - 1;
    const next = el("button", "btn", last ? "See results" : "Next question →");
    next.addEventListener("click", () => {
      if (last) return renderResults(s, state);
      state.index++;
      renderQuestion(s, state);
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
  setPhoto(total + 1);

  panel.innerHTML = "";
  const card = el("section", "card results");

  const top = el("div", "results-top");
  const box = el("div", "score-box");
  box.appendChild(el("div", "label", "Your score"));
  const big = el("div", "big", String(state.score));
  big.appendChild(el("span", null, " / " + total));
  box.appendChild(big);

  const text = el("div", "results-text");
  text.appendChild(el("h2", null, "Quiz complete"));
  const pct = state.score / total;
  const msg =
    pct === 1 ? "Perfect score. You could have given this talk yourself." :
    pct >= 0.75 ? "Great work. Just a couple to brush up on." :
    pct >= 0.5 ? "Solid start. Review the ones below and try again." :
    "Open the key takeaways, then give it another go.";
  text.appendChild(el("p", null, msg));
  if (state.score > prevBest && prevBest > 0) text.appendChild(el("p", "new-best", "New personal best!"));
  top.append(box, text);
  card.appendChild(top);

  const tiles = renderTiles(total, state.results, -1, "results-tiles");
  tiles.setAttribute("aria-label", "Your answers, in the order you played them");
  card.appendChild(tiles);

  if (state.missed.length) {
    card.appendChild(el("h3", "review-title", "Review what you missed"));
    const list = el("div", "review-list");
    state.missed.forEach((m) => {
      const r = el("div", "review-item");
      r.appendChild(el("strong", null, m.q));
      r.appendChild(el("p", null, "Answer: " + m.options[m.answer] + ". " + m.explain));
      list.appendChild(r);
    });
    card.appendChild(list);
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
