/*
  ============================================================
  ALL SESSION CONTENT LIVES HERE.
  To add a new guest speaker: copy one { ... } block below,
  paste it at the end of the list (before the final ];),
  and change the text. A new tab appears automatically.

  "answer" is the position of the correct option, counting from 0
  (0 = first option, 1 = second, 2 = third, 3 = fourth).
  ============================================================
*/

const SESSIONS = [
  {
    id: "launchlab",
    tab: "S1 · LaunchLab",
    title: "LaunchLab: Claude Design, Claude Code, GitHub & Vercel",
    speakers: "Yibo, Nirvan & Rishabh",
    summary:
      "How to go from an idea to a live website: design the look first, build it with an AI coding agent, store the code on GitHub, and let Vercel put it online.",
    takeaways: [
      "Workflow: Design (Claude Design) → Build (Claude Code) → Deploy (Vercel or tiiny.host).",
      "Good prompts give a role, goal, audience, pages, style and the output you want.",
      "Commit saves a snapshot on your computer; push sends it up to GitHub.",
      "GitHub stores your code; Vercel turns it into a live site that updates on every push.",
      "A plain site forgets users and can't show live data. A backend like Supabase adds logins and a database."
    ],
    questions: [
      {
        q: "What's the first step in the workflow taught in this session?",
        options: [
          "Design the front end in Claude Design",
          "Write the database tables",
          "Deploy an empty site to Vercel",
          "Buy a domain name"
        ],
        answer: 0,
        explain: "Design → Build → Deploy. You shape how the site looks first, without code, then hand it to Claude Code to build."
      },
      {
        q: "How do you send a finished design from Claude Design into Claude Code?",
        options: [
          "Export as PDF and upload it",
          "Share menu → \"Handoff to Claude Code…\"",
          "Take a screenshot and paste it",
          "Duplicate the project as a template"
        ],
        answer: 1,
        explain: "The Handoff option in the Share menu is the bridge between the two tools. It's easy to miss, so find it before you start."
      },
      {
        q: "Which of these is the STRONGEST prompt?",
        options: [
          "\"Create a website for my course.\"",
          "\"Create a modern website for my coding course with a homepage and lessons.\"",
          "A prompt with a role, goal, target audience, required pages, design style and expected output",
          "\"Make it look good please.\""
        ],
        answer: 2,
        explain: "Vague prompts get vague results. Spell out who the AI should be, what to build, for whom, and what you expect back."
      },
      {
        q: "You just made a commit. Where does that snapshot live?",
        options: [
          "On GitHub, visible to everyone",
          "On Vercel's servers",
          "Only on your own computer, until you push",
          "In your browser's cookies"
        ],
        answer: 2,
        explain: "Commit saves locally. Push is what sends your commits up to GitHub."
      },
      {
        q: "What does it mean to fork a repository?",
        options: [
          "Delete someone else's repo",
          "Make your own copy of someone else's repo on your GitHub account",
          "Download a repo onto your laptop",
          "Merge two branches together"
        ],
        answer: 1,
        explain: "A fork is your own copy on GitHub, so you can change it without touching the original. Copying it onto your computer is cloning."
      },
      {
        q: "When should you open a pull request instead of pushing straight to main?",
        options: [
          "When you're working with a team or contributing to someone else's project",
          "Whenever you fix a typo on your solo project",
          "Never; pull requests are outdated",
          "Only when the internet is slow"
        ],
        answer: 0,
        explain: "A pull request lets teammates review, comment on and approve changes before they're merged."
      },
      {
        q: "What's the difference between GitHub and Vercel?",
        options: [
          "They do exactly the same thing",
          "GitHub hosts the live site; Vercel stores the code",
          "GitHub stores your code; Vercel builds it and hosts it as a live website",
          "Vercel is only for Python projects"
        ],
        answer: 2,
        explain: "Nothing on GitHub is a website yet. Vercel reads your repo, builds the site and gives it a public link."
      },
      {
        q: "Once your GitHub repo is connected to Vercel, what happens when you push new code?",
        options: [
          "Nothing, you have to re-upload a zip",
          "Vercel automatically rebuilds and updates your live site",
          "Your site goes offline until you approve it",
          "GitHub emails you the new site"
        ],
        answer: 1,
        explain: "Connect once, then every push redeploys automatically. Pull requests even get their own preview links."
      },
      {
        q: "You want to make your main button orange. Which file do you open?",
        options: ["index.html", "styles.css", "script.js", "README.md"],
        answer: 1,
        explain: "styles.css controls the look: colours, fonts, spacing, and how things change on phone vs laptop."
      },
      {
        q: "You want the button to DO something when clicked. Which file?",
        options: ["index.html", "styles.css", "script.js", "package.json"],
        answer: 2,
        explain: "script.js is the behaviour: what happens when someone clicks, types or hits submit. The button's text lives in index.html."
      },
      {
        q: "You build a Wordle clone. Why does it forget who you are when you close the tab?",
        options: [
          "The site has no backend or database to remember users",
          "Wordle is copyrighted",
          "Vercel deletes data every hour",
          "Your Wi-Fi is too slow"
        ],
        answer: 0,
        explain: "A plain static site only knows its own files. To remember users or saved games you need a backend, such as Supabase."
      },
      {
        q: "After you log in, what does a website hand your browser so you don't retype your password on every click?",
        options: ["A cookie recipe", "A token", "A fork", "A commit"],
        answer: 1,
        explain: "A token is like a temporary sticker saying \"this is you.\" Your browser shows it on each request, and it expires on its own. Logging out throws it away."
      },
      {
        q: "Sign up, log in and log out all have something in common. What is it?",
        options: [
          "They only happen on your own computer",
          "They're each a request to another computer that sends an answer back (an API call)",
          "They all require a pull request",
          "They change your styles.css"
        ],
        answer: 1,
        explain: "Logging in is just an API call: your site asks a server a question and gets a reply."
      },
      {
        q: "What is Supabase?",
        options: [
          "A design tool for mockups",
          "A backend-as-a-service for logins, user verification and a database",
          "A competitor to GitHub for storing code",
          "A Chrome extension for screenshots"
        ],
        answer: 1,
        explain: "Supabase gives your site a backend: authentication and a database, and it plugs into GitHub, Vercel and Lovable."
      }
    ]
  }

  // ↓↓↓ Paste your next session here (don't forget a comma after the } above) ↓↓↓
];
