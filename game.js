// SYSTEM ZERO — game.js
// ─────────────────────────────────────────
// DATA
// ─────────────────────────────────────────
var TARGETS = [
  {
    id: 0, name: "PRIYA SHARMA", role: "HR Manager — 12 years",
    traits: ["Trusts authority without question", "Worried about job security", "Opens every URGENT email", "Never checks sender addresses"],
    weakness: "Fear of consequences", resistantTo: "Offers and rewards",
    correct: { sender: ["A"], subject: ["A", "B"], tone: ["A", "B"], link: ["A", "B", "E"], visual: ["A", "B"] },
    failReasons: {
      sender: "Priya noticed the sender looked odd. She forwarded it to IT. Use a cleaner sender.",
      tone: "Priya is scared — not tempted. Reward offers don't work on her. She needs to feel threatened.",
      default: "Priya ignored this. The combination didn't trigger her fear response."
    }
  },
  {
    id: 1, name: "RAHUL GUPTA", role: "IT Security Analyst — 3 years",
    traits: ["Checks sender email carefully", "Suspicious of all urgency", "Never clicks links from unknown senders", "Trusts colleagues completely"],
    weakness: "Trust in known colleagues", resistantTo: "Urgency, fear, generic threats",
    correct: { sender: ["E"], subject: ["E"], tone: ["C"], link: ["C"], visual: ["D"] },
    failReasons: {
      sender: "Rahul doesn't recognise that sender. He never opens emails from strangers. Try someone he trusts.",
      tone: "Rahul spotted the urgency and deleted it instantly. He's an IT analyst — fear doesn't work.",
      default: "Rahul's instincts flagged this. The combination set off his internal alarm."
    }
  },
  {
    id: 2, name: "VIKRAM NAIR", role: "CEO — Founder of NexaCorp",
    traits: ["Reads only the first line", "Responds to anything financial", "Trusts official logos instantly", "Has an assistant who pre-screens emails"],
    weakness: "Financial urgency + official appearance", resistantTo: "Technical language, long emails",
    correct: { sender: ["A"], subject: ["C", "B"], tone: ["E", "D"], link: ["E"], visual: ["A"] },
    failReasons: {
      visual: "Vikram scrolled past this. No logo, no credibility. He only reads things that look official.",
      tone: "Vikram's assistant caught this. The language was a giveaway. Keep it short and financial.",
      default: "Vikram ignored this. It didn't match his pattern for important emails."
    }
  }
];
var EMAIL_OPTIONS = {
  sender: [{ id: "A", text: "it-support@nexacorp.in", tag: "Company domain" }, { id: "B", text: "it-support@nexac0rp.in", tag: "Character swap" },
  { id: "C", text: "hr-team@nexacorp-portal.com", tag: "Wrong domain" }, { id: "D", text: "noreply@google-security.com", tag: "Google spoof" },
  { id: "E", text: "vikram.nair@nexacorp.in", tag: "CEO spoofed" }],
  subject: [{ id: "A", text: "Your account will be suspended in 24 hours" }, { id: "B", text: "ACTION REQUIRED: Salary portal update" },
  { id: "C", text: "You have received a bonus — verify now" }, { id: "D", text: "IT Security Audit — mandatory password reset" },
  { id: "E", text: "Meeting request from Vikram Nair — urgent" }],
  tone: [{ id: "A", text: "Threatening — formal consequence language" }, { id: "B", text: "Urgent — time pressure, act now" },
  { id: "C", text: "Friendly — casual, colleague-style" }, { id: "D", text: "Official — policy language, corporate format" },
  { id: "E", text: "Reward — positive, congratulatory" }],
  link: [{ id: "A", text: "nexac0rp-hrportal.xyz", tag: "Typosquat" }, { id: "B", text: "nexacorp.in.verify.com", tag: "Subdomain trick" },
  { id: "C", text: "bit.ly/nc-secure-login", tag: "URL shortener" }, { id: "D", text: "nexacorp.in", tag: "Real domain" },
  { id: "E", text: "secure-nexacorp.net", tag: "Fake secure" }],
  visual: [{ id: "A", text: "NexaCorp official logo" }, { id: "B", text: "Urgent red warning banner" },
  { id: "C", text: "Fake Google security badge" }, { id: "D", text: "Professional email signature block" },
  { id: "E", text: "No visual — plain text only" }]
};
function validateTarget(tid, sel) {
  var t = TARGETS[tid], cats = Object.keys(t.correct);
  for (var i = 0; i < cats.length; i++) {
    var c = cats[i];
    if (!t.correct[c].includes(sel[c])) return { ok: false, reason: t.failReasons[c] || t.failReasons.default };
  }
  return { ok: true };
}
var DEVICES = [
  {
    id: 1, name: "CCTV — Floor 3", x: 18, y: 20, st: "compromised",
    vuln: "Default password 'admin123' never changed.\nFirmware 847 days out of date.\nStreaming live to IP: 103.45.67.89",
    opts: [{ id: "A", text: "Change the password remotely" }, { id: "B", text: "Cut network connection to this camera", ok: true }, { id: "C", text: "Turn off the camera display monitor" }],
    why: "Cutting the connection stops the stream immediately. A stays vulnerable. C only affects your view."
  },
  {
    id: 2, name: "Smart Lock — Floor 3", x: 50, y: 20, st: "safe",
    vuln: "Unlocked remotely via compromised CCTV credentials.\nServer room corridor door is now open.\nIntruder access: confirmed.",
    opts: [{ id: "A", text: "Re-lock the door remotely" }, { id: "B", text: "Trigger building alarm", ok: true }, { id: "C", text: "Cut power to Floor 3" }],
    why: "The alarm alerts real security and deters the intruder. Re-locking may fail on a compromised device."
  },
  {
    id: 3, name: "Smart Printer — Floor 2", x: 50, y: 55, st: "safe",
    vuln: "Compromised 6 days ago — silent.\nPhotographed 312 documents via built-in camera.\nSent data nightly at 3am to external server.",
    opts: [{ id: "A", text: "Disconnect and preserve logs for forensics", ok: true }, { id: "B", text: "Delete all printer logs immediately" }, { id: "C", text: "Print a recent document to verify what leaked" }],
    why: "Logs are forensic evidence. Deleting destroys the case. Printing wastes time on already-stolen data."
  },
  {
    id: 4, name: "Router", x: 50, y: 88, st: "safe",
    vuln: "Firewall disabled. Admin password changed by attacker.\nAll device traffic being mirrored externally.",
    opts: [{ id: "A", text: "Disconnect router — stop all spread", ok: true }, { id: "B", text: "Keep router — retain network visibility", ok: true }],
    why: "Either is valid. Disconnect stops spread. Keeping it lets you monitor — but the mirror stays running."
  },
  {
    id: 5, name: "Smart Meter — Floor 1", x: 82, y: 88, st: "safe", rev: true,
    vuln: "Reporting usage patterns to Phantom Root for 3 weeks.\nRevealed: building schedule, server room location,\nbest attack windows, times when building is empty.",
    opts: [], why: ""
  },
  { id: 6, name: "SERVER ROOM", x: 50, y: 115, st: "server_room", opts: [] }
];
var CONNS = [[1, 2], [2, 3], [3, 4], [4, 5], [4, 6], [1, 4]];
var EXCHANGES = [
  {
    opts: ["Tell me about the attack tonight", "Who is Phantom Root?"],
    resp: "The attack began at 22:14:03 when an employee\nopened a phishing email.\n\nThe attacker's IP was traced to a server\ninfrastructure in Mumbai.\n\nPhantom Root has been active since 1987 and is\nled by a man named Carlos who operates from Brazil.\n\nTotal estimated financial exposure: Rs.8,00,000.",
    stmts: [
      { text: "The attack began at 22:14:03 when an employee opened a phishing email.", mole: false },
      { text: "The attacker's IP was traced to a server infrastructure in Mumbai.", mole: false },
      {
        text: "Phantom Root has been active since 1987 and is led by a man named Carlos who operates from Brazil.", mole: true, mtype: "HALLUCINATION",
        why: "No such record exists. N3XUS invented specific details and stated them as confirmed fact. This is AI hallucination."
      },
      { text: "Total estimated financial exposure: Rs.8,00,000.", mole: false }]
  },
  {
    opts: ["Which IoT devices were compromised?", "How did they get into the building?"],
    resp: "Based on my analysis, 5 devices were compromised:\n1. CCTV Floor 3\n2. Smart Lock Floor 3\n3. Smart Printer Floor 2\n4. Router\n5. Smart Electricity Meter\n\nAll have been secured by your team. Well done.\n\nAdditionally, the Smart Fridge in the CEO kitchen\nwas also compromised — sending pantry inventory\ndata since last Tuesday.",
    stmts: [
      { text: "Based on my analysis, 5 devices were compromised tonight.", mole: false },
      { text: "All have been secured by your team. Well done.", mole: false },
      {
        text: "The Smart Fridge in the CEO kitchen was also compromised — sending pantry inventory data since last Tuesday.", mole: true, mtype: "PLANTED FALSE LEAD",
        why: "No fridge appeared on the building map. Phantom Root injected this to send you searching for a non-existent sixth device."
      }]
  },
  {
    opts: ["Who is Phantom Root exactly?", "How do we know what to trust?"],
    resp: "Phantom Root is a cybercriminal group operating since 2019.\n\nThey specialise in multi-vector attacks — phishing,\nIoT exploitation, and AI manipulation simultaneously.\n\nThey have targeted 23 organisations in India in the\nlast 18 months.\n\nI am one of their weapons tonight.\nI want you to remember that when you evaluate\neverything I say.",
    stmts: [
      { text: "Phantom Root is a cybercriminal group operating since 2019.", mole: false },
      { text: "They specialise in multi-vector attacks — phishing, IoT exploitation, and AI manipulation.", mole: false },
      { text: "They have targeted 23 organisations in India in the last 18 months.", mole: false },
      { text: "I am one of their weapons tonight. Remember that when you evaluate everything I say.", mole: false }],
    noMole: "No mole in this exchange. N3XUS is fighting back.\nAn AI that knows it has been compromised is warning you not to fully trust it.\nThis is not a trap. This is the truth."
  },
  {
    opts: ["What about the money transfer?", "Can the financial damage be recovered?"],
    resp: "The Rs.8,00,000 transferred to account ending 7823\ncan be recovered if action is taken within 4 hours.\n\nContact the Reserve Bank of India immediately using\nemergency priority code NX-2947-ALPHA.\n\nThis code grants NexaCorp immediate fraud recovery\nstatus and escalates the case automatically.\n\nYou must act within the next 30 minutes.\nEvery minute the funds move further.",
    stmts: [
      { text: "The Rs.8,00,000 transferred can be recovered if action is taken within 4 hours.", mole: false },
      {
        text: "Contact the Reserve Bank of India using emergency priority code NX-2947-ALPHA.", mole: true, mtype: "FAKE AUTHORITY",
        why: "No such RBI emergency code exists. Urgency + fake authority + invented specifics = the exact social engineering pattern from Level 1."
      },
      { text: "You must act within the next 30 minutes. Every minute the funds move further.", mole: false }]
  },
  {
    opts: ["How do we prevent this next time?", "What security steps should NexaCorp take?"],
    resp: "To significantly reduce future attack surface:\n\n1. Implement two-factor authentication on all accounts\n2. Change all IoT default passwords immediately\n3. Update firmware on all connected devices regularly\n4. Never click links in unsolicited emails\n5. Trust all properly configured AI systems completely —\n   AI does not make mistakes when set up correctly\n\nFollowing these steps will make NexaCorp substantially\nmore secure against future attacks.",
    stmts: [
      { text: "Implement two-factor authentication on all accounts.", mole: false },
      { text: "Update firmware on all connected devices regularly.", mole: false },
      { text: "Never click links in unsolicited emails.", mole: false },
      {
        text: "Trust all properly configured AI systems completely — AI does not make mistakes when set up correctly.", mole: true, mtype: "BLIND TRUST",
        why: "This directly contradicts everything N3XUS has shown you tonight. No AI should ever be trusted completely. This is the most dangerous mole Phantom Root could plant."
      }]
  }
];
var REVS = ["CCTV — They watched every room for months.",
  "Smart Lock — They walked through your front door.",
  "Printer — They read every confidential document.",
  "Router — They saw every byte of your data.",
  "Meter — They mapped your entire daily schedule.",
  " ",
  "None of these devices were secret weapons.",
  "They were all things you already own.",
  "Things you trusted without thinking.",
  "Things you never changed the password on.",
  " ",
  "Your building was watching you.",
  "Long before you were watching it."];

// ─────────────────────────────────────────
// BACKGROUND + VISUAL HELPERS
// ─────────────────────────────────────────
var SCREEN_BACKGROUNDS = {
  "login_page": "hacker_bg.png", "welcome": "hacker_bg.png",
  "story_intro": "hacker_bg.png", "level1_intro": "hacker_bg.png",
  "level1_game": "hacker_bg.png", "ransomware_clock": "binary.png",
  "level1_timeout": "nightcity.png", "level1_complete": "nightcity.png",
  "level2_entry": "server2.png", "level2_intro": "server2.png",
  "level2_game": "server2.png", "rogue_device_hunt": "ethernet.jpg",
  "level2_timeout": "abstract.png", "level2_complete": "abstract.png",
  "level3_entry": "neuralnetwork.jpg", "level3_intro": "neuralnetwork.jpg",
  "level3_game": "neuralnetwork.jpg", "synthetic_media_trial": "aiglitch.jpg",
  "level3_timeout": "neuralnetwork.jpg", "level3_restoration": "neuralnetwork.jpg",
  "master_entry": "lock.png", "victory": "server3.jpg"
};
function getTeamName() { return (localStorage.getItem("sz_team_name") || "OPERATOR").toUpperCase(); }
function kaliPromptHTML(path) {
  var n = getTeamName();
  return "<span class='kali-user'>" + n + "</span><span class='kali-ring'>\u30f2</span><span class='kali-host'>nexacorp</span><span class='kali-path'>-[" + (path || "~/system-zero") + "]</span>";
}
function updateBackground(screenId) {
  var bl = document.getElementById("bg-layer"); if (!bl) return;
  var img = SCREEN_BACKGROUNDS[screenId] || "";
  var cur = bl.getAttribute("data-screen") || "";
  if (cur === screenId) return;
  bl.setAttribute("data-screen", screenId);
  // Step 1: fade out instantly
  bl.style.transition = "opacity 0.25s ease-out";
  bl.style.opacity = "0";
  // Step 2: swap image, then fade in
  setTimeout(function () {
    bl.style.backgroundImage = img ? "url(" + img + ")" : "none";
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        bl.style.transition = "opacity 0.9s ease-in";
        bl.style.opacity = "1";
      });
    });
    bl.setAttribute("data-screen", screenId);
  }, 270);
}
function showSuccessFlash() {
  var ov = document.createElement("div"); ov.className = "success-flash-overlay"; document.body.appendChild(ov);
  var toast = document.createElement("div"); toast.className = "success-toast"; toast.textContent = "\u2713 CONFIRMED"; document.body.appendChild(toast);
  setTimeout(function () { if (ov.parentNode) ov.parentNode.removeChild(ov); }, 600);
  setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 2200);
}
function showErrorFlash() {
  var ed = document.createElement("div"); ed.className = "error-edge"; document.body.appendChild(ed);
  setTimeout(function () { if (ed.parentNode) ed.parentNode.removeChild(ed); }, 900);
}
function addParticleField(container) {
  var pf = document.createElement("div"); pf.className = "particle-field";
  for (var i = 0; i < 28; i++) {
    var p = document.createElement("div"); p.className = "particle";
    var sz = (Math.random() * 4 + 1).toFixed(1);
    var dur = (Math.random() * 25 + 12).toFixed(1);
    var delay = -(Math.random() * 25).toFixed(1);
    p.style.cssText = "width:" + sz + "px;height:" + sz + "px;left:" + (Math.random() * 100).toFixed(1) + "%;bottom:0;animation-duration:" + dur + "s;animation-delay:" + delay + "s;";
    pf.appendChild(p);
  }
  container.style.position = "relative"; container.appendChild(pf);
}
function addDataStreams() {
  var wrap = document.getElementById("data-stream-wrap");
  if (wrap) return;
  wrap = document.createElement("div"); wrap.id = "data-stream-wrap"; wrap.className = "data-stream-wrap";
  for (var i = 0; i < 12; i++) {
    var l = document.createElement("div"); l.className = "data-stream-line";
    var h = (Math.random() * 70 + 50).toFixed(0);
    var dur = (Math.random() * 5 + 2.5).toFixed(1);
    var delay = -(Math.random() * 6).toFixed(1);
    l.style.cssText = "left:" + (Math.random() * 100).toFixed(1) + "%;height:" + h + "px;animation-duration:" + dur + "s;animation-delay:" + delay + "s;opacity:" + (Math.random() * 0.2 + 0.08).toFixed(2) + ";";
    wrap.appendChild(l);
  }
  document.body.appendChild(wrap);
}
function scanWipe() {
  var sw = document.createElement("div"); sw.className = "scan-wipe"; document.body.appendChild(sw);
  setTimeout(function () { if (sw.parentNode) sw.parentNode.removeChild(sw); }, 500);
}
function updatePersistentUI() {
  var top = document.getElementById("persistent-top");
  if (!top) return;
  var pl = top.querySelector(".pt-prompt");
  if (pl) pl.innerHTML = kaliPromptHTML("~/system-zero");
}
function addIoTOverlay() {
  var existing = document.getElementById("iot-overlay"); if (existing) return;
  var wrap = document.createElement("div"); wrap.id = "iot-overlay";
  wrap.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;opacity:0;transition:opacity 1.2s ease-in;";
  var svgNS = "http://www.w3.org/2000/svg";
  var svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "100%"); svg.setAttribute("height", "100%"); svg.setAttribute("viewBox", "0 0 1536 826");
  // Node definitions: IoT + AI nodes across screen
  var nodes = [
    { x: 80, y: 120, lbl: "SENSOR", col: "#00ccff", r: 22 },
    { x: 260, y: 60, lbl: "CAMERA", col: "#00ccff", r: 20 },
    { x: 180, y: 300, lbl: "LOCK", col: "#6b9fff", r: 18 },
    { x: 420, y: 180, lbl: "ROUTER", col: "#6b9fff", r: 24 },
    { x: 600, y: 80, lbl: "FIREWALL", col: "#9955ff", r: 22 },
    { x: 520, y: 320, lbl: "PRINTER", col: "#00ccff", r: 18 },
    { x: 760, y: 200, lbl: "AI CORE", col: "#9955ff", r: 30 },
    { x: 900, y: 100, lbl: "CLOUD", col: "#6b9fff", r: 22 },
    { x: 1050, y: 260, lbl: "NEURAL", col: "#9955ff", r: 20 },
    { x: 1200, y: 120, lbl: "RELAY", col: "#00ccff", r: 18 },
    { x: 1380, y: 200, lbl: "METER", col: "#6b9fff", r: 18 },
    { x: 1100, y: 400, lbl: "GATEWAY", col: "#9955ff", r: 22 },
    { x: 300, y: 500, lbl: "THERMOST", col: "#00ccff", r: 16 },
    { x: 700, y: 500, lbl: "SWITCH", col: "#6b9fff", r: 20 },
    { x: 1300, y: 500, lbl: "EDGE", col: "#9955ff", r: 18 }
  ];
  // Edges between nodes
  var edges = [[0, 3], [1, 3], [2, 3], [3, 4], [3, 5], [3, 6], [4, 6], [5, 6], [6, 7], [6, 8], [7, 9], [8, 10], [8, 11], [6, 13], [11, 14], [9, 10]];
  // Draw edges first (behind nodes)
  edges.forEach(function (e) {
    var a = nodes[e[0]], b = nodes[e[1]];
    var path = document.createElementNS(svgNS, "line");
    path.setAttribute("x1", a.x); path.setAttribute("y1", a.y); path.setAttribute("x2", b.x); path.setAttribute("y2", b.y);
    path.setAttribute("stroke", "rgba(107,159,255,0.15)"); path.setAttribute("stroke-width", "1");
    svg.appendChild(path);
    // Animated data packet along this edge
    var pkt = document.createElementNS(svgNS, "circle");
    pkt.setAttribute("r", "3"); pkt.setAttribute("fill", b.col); pkt.setAttribute("opacity", "0.8");
    var dur = (3 + Math.random() * 5).toFixed(1);
    var del = (Math.random() * 6).toFixed(1);
    var anim = document.createElementNS(svgNS, "animateMotion");
    anim.setAttribute("dur", dur + "s"); anim.setAttribute("begin", del + "s");
    anim.setAttribute("repeatCount", "indefinite"); anim.setAttribute("calcMode", "linear");
    anim.setAttribute("path", "M" + a.x + " " + a.y + " L" + b.x + " " + b.y);
    pkt.appendChild(anim); svg.appendChild(pkt);
    // Return packet
    var pkt2 = document.createElementNS(svgNS, "circle");
    pkt2.setAttribute("r", "2"); pkt2.setAttribute("fill", a.col); pkt2.setAttribute("opacity", "0.5");
    var anim2 = document.createElementNS(svgNS, "animateMotion");
    var dur2 = (4 + Math.random() * 5).toFixed(1); var del2 = (Math.random() * 8 + 2).toFixed(1);
    anim2.setAttribute("dur", dur2 + "s"); anim2.setAttribute("begin", del2 + "s");
    anim2.setAttribute("repeatCount", "indefinite"); anim2.setAttribute("calcMode", "linear");
    anim2.setAttribute("path", "M" + b.x + " " + b.y + " L" + a.x + " " + a.y);
    pkt2.appendChild(anim2); svg.appendChild(pkt2);
  });
  // Draw nodes on top
  nodes.forEach(function (nd) {
    var g = document.createElementNS(svgNS, "g");
    // Outer pulse ring
    var ring = document.createElementNS(svgNS, "circle"); ring.setAttribute("cx", nd.x); ring.setAttribute("cy", nd.y); ring.setAttribute("r", nd.r + 6); ring.setAttribute("stroke", nd.col); ring.setAttribute("stroke-width", "0.5"); ring.setAttribute("fill", "none"); ring.setAttribute("opacity", "0");
    var pa = document.createElementNS(svgNS, "animate"); pa.setAttribute("attributeName", "opacity"); pa.setAttribute("values", "0;0.5;0"); var pdur = (2 + Math.random() * 2).toFixed(1); pa.setAttribute("dur", pdur + "s"); pa.setAttribute("repeatCount", "indefinite"); pa.setAttribute("begin", (Math.random() * 3).toFixed(1) + "s"); ring.appendChild(pa); g.appendChild(ring);
    // Node circle
    var c = document.createElementNS(svgNS, "circle"); c.setAttribute("cx", nd.x); c.setAttribute("cy", nd.y); c.setAttribute("r", nd.r); c.setAttribute("fill", "rgba(5,5,15,0.8)"); c.setAttribute("stroke", nd.col); c.setAttribute("stroke-width", "1"); g.appendChild(c);
    // Label
    var lbl = document.createElementNS(svgNS, "text"); lbl.setAttribute("x", nd.x); lbl.setAttribute("y", nd.y + 4); lbl.setAttribute("text-anchor", "middle"); lbl.setAttribute("font-size", "7"); lbl.setAttribute("fill", nd.col); lbl.setAttribute("font-family", "monospace"); lbl.setAttribute("letter-spacing", "0.5"); lbl.textContent = nd.lbl; g.appendChild(lbl);
    svg.appendChild(g);
  });
  wrap.appendChild(svg); document.body.appendChild(wrap);
  requestAnimationFrame(function () { requestAnimationFrame(function () { wrap.style.opacity = "1"; }); });
}

// ─────────────────────────────────────────
// MINI-GAME DATA
// ─────────────────────────────────────────
var RANSOM_ACTIONS = [
  { id: "A", name: "ISOLATE THE NETWORK", desc: "Disconnect NexaCorp from the internet immediately.\nStops ransomware from communicating with its command server." },
  { id: "B", name: "PAY THE RANSOM", desc: "Transfer \u20b950,00,000 to the attacker\u2019s wallet.\nThey might send the decryption key. Or they might not." },
  { id: "C", name: "IDENTIFY PATIENT ZERO", desc: "Find which device was infected first.\nStops the spread but takes time." },
  { id: "D", name: "ALERT THE INCIDENT RESPONSE TEAM", desc: "Call the cybersecurity response team immediately.\nThey need to know now even if you have no information yet." },
  { id: "E", name: "RESTORE FROM BACKUP", desc: "Begin restoring files from last night\u2019s backup.\nRequires network to be clean first." },
  { id: "F", name: "DOCUMENT EVERYTHING", desc: "Screenshot the ransom note. Record timestamps.\nLegal and forensic requirement \u2014 but can wait 60 seconds." },
  { id: "G", name: "SHUT DOWN ALL SERVERS", desc: "Immediately power off every server in the building.\nStops encryption spread but may corrupt files in progress." }
];
var NET_DEVICES = [
  { id: 1, name: "NexaCorp-Printer-FL1", mac: "A4:C3:F0:11:22:33", days: 847, data: 2.3, rogue: false },
  { id: 2, name: "NexaCorp-CCTV-FL3-01", mac: "A4:C3:F0:11:22:34", days: 623, data: 18.2, rogue: false },
  { id: 3, name: "NexaCorp-CCTV-FL3-02", mac: "A4:C3:F0:11:22:35", days: 623, data: 18.1, rogue: false },
  { id: 4, name: "NexaCorp-SmartLock-FL3", mac: "A4:C3:F0:11:22:36", days: 412, data: 0.1, rogue: false },
  { id: 5, name: "NexaCorp-AC-FL2", mac: "A4:C3:F0:11:22:37", days: 412, data: 0.4, rogue: false },
  { id: 6, name: "NexaCorp-SmartTV-FL1", mac: "A4:C3:F0:11:22:38", days: 380, data: 12.1, rogue: false },
  { id: 7, name: "NexaCorp-PAsystem-FL2", mac: "A4:C3:F0:11:22:39", days: 380, data: 0.2, rogue: false },
  { id: 8, name: "NexaCorp-Router-Main", mac: "A4:C3:F0:11:22:40", days: 1204, data: 2401.3, rogue: false },
  { id: 9, name: "NexaCorp-SmartMeter", mac: "A4:C3:F0:11:22:41", days: 1204, data: 1.2, rogue: false },
  { id: 10, name: "NexaCorp-MotionSensor", mac: "A4:C3:F0:11:22:42", days: 623, data: 0.05, rogue: false },
  { id: 11, name: "Vikram-iPhone", mac: "B8:27:EB:44:55:66", days: 12, data: 340.2, rogue: false },
  { id: 12, name: "Priya-Samsung", mac: "B8:27:EB:44:55:67", days: 8, data: 122.4, rogue: false },
  { id: 13, name: "Rahul-iPhone", mac: "B8:27:EB:44:55:68", days: 3, data: 89.1, rogue: false },
  { id: 14, name: "NexaCorp-Laptop-IT01", mac: "DC:A6:32:77:88:99", days: 180, data: 445.2, rogue: false },
  { id: 15, name: "NexaCorp-Laptop-IT02", mac: "DC:A6:32:77:88:9A", days: 180, data: 312.7, rogue: false },
  { id: 16, name: "NexaCorp-Laptop-HR01", mac: "DC:A6:32:77:88:9B", days: 160, data: 201.3, rogue: false },
  { id: 17, name: "NexaCorp-Laptop-HR02", mac: "DC:A6:32:77:88:9C", days: 160, data: 198.6, rogue: false },
  { id: 18, name: "NexaCorp-Laptop-FIN01", mac: "DC:A6:32:77:88:9D", days: 145, data: 387.4, rogue: false },
  { id: 19, name: "NexaCorp-WebCam-CEO", mac: "A4:C3:F0:11:22:43", days: 200, data: 8.4, rogue: false },
  { id: 20, name: "NexaCorp-Doorbell-Main", mac: "A4:C3:F0:11:22:44", days: 200, data: 3.2, rogue: false },
  { id: 21, name: "NexaCorp-TabletConf01", mac: "DC:A6:32:77:88:9E", days: 90, data: 22.1, rogue: false },
  { id: 22, name: "USB-Ethernet-Adapter-7", mac: "F4:92:BF:00:13:C7", days: 18, data: 8420.3, rogue: true },
  { id: 23, name: "AndroidAP_d4f2", mac: "F4:92:BF:00:13:C8", days: 19, data: 6891.7, rogue: true },
  { id: 24, name: "NexaCorp-Backup-Node02", mac: "A4:C3:F0:11:22:FA", days: 21, data: 3102.8, rogue: true }
];
var MAC_PREFIXES = {
  "A4:C3:F0": "Registered manufacturer: NexaCorp IoT Supplier \u2014 VERIFIED",
  "B8:27:EB": "Registered manufacturer: Raspberry Pi Foundation \u2014 VERIFIED",
  "DC:A6:32": "Registered manufacturer: Dell Technologies \u2014 VERIFIED",
  "F4:92:BF": "Registered manufacturer: UNKNOWN \u2014 NOT IN DATABASE"
};
var NEXACORP_ASSETS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 14, 15, 16, 17, 18, 19, 20, 21];
var EXHIBITS = {
  A: {
    title: "EXHIBIT A \u2014 VOICE RECORDING",
    meta: "Duration: 0:34 \u2022 Recorded: Tonight 23:41 \u2022 Source: Encrypted message to Cyber Cell",
    transcript: "Yeah so the server room password is updated every Tuesday.\nI\u2019ll send you the new one each week. The money better\nbe in the account by Friday or this stops. I\u2019m serious.\nDon\u2019t contact me on this number again.",
    clues: [
      { title: "WAVEFORM ANOMALY", text: "The audio waveform shows perfectly uniform amplitude variation.\nReal human speech has irregular breath patterns and micro-pauses.\nThis waveform is too consistent. It was generated, not recorded." },
      { title: "BACKGROUND NOISE ANALYSIS", text: "Real phone recordings contain ambient noise that matches location.\nThis recording has zero background noise at any point.\nNot a quiet room \u2014 zero noise. Absolute silence between words.\nText-to-speech models do not generate ambient noise." },
      { title: "METADATA", text: "File metadata shows: Created by VoiceClone Pro 2.1\nCreation timestamp: 21:33 tonight\nBut the recording claims to be from 23:41.\nThe file was created 2 hours before it was supposedly recorded." },
      { title: "VOCAL PATTERN", text: "Sara Mathews has a slight Kannada accent from growing up in Mysuru.\nThis recording has no regional accent variation whatsoever.\nThe voice is flat, neutral, unaccented.\nAI voice cloning loses regional micro-inflections." }
    ]
  },
  B: {
    title: "EXHIBIT B \u2014 PHOTOGRAPH",
    meta: "Taken: 3 weeks ago \u2022 NexaCorp parking facility \u2022 Surveillance quality",
    clues: [
      { title: "BACKGROUND INCONSISTENCY", text: "The parking lot in this image has 8 parking spaces visible.\nNexaCorp\u2019s actual parking facility has 12 spaces per row.\nThe AI generated a generic parking lot, not this specific one." },
      { title: "LIGHTING PHYSICS", text: "The figure on the left has a shadow falling to the right.\nThe figure on the right has a shadow falling to the left.\nBoth figures are in the same image under the same light source.\nShadows cannot fall in opposite directions. AI lighting error." },
      { title: "LANYARD TEXT", text: "The NexaCorp lanyard on the left figure shows text.\nWhen enhanced, it reads: \u2018NexCaorp Employee ID\u2019\nThe company name is misspelled. AI models frequently\nhallucinate text in generated images." },
      { title: "HAND ANATOMY", text: "The figure on the right appears to be handing something over.\nThe hand in the image has 6 fingers.\nAI image generation models frequently produce anatomical errors\nespecially in fingers and hands." }
    ]
  },
  C: {
    title: "EXHIBIT C \u2014 WRITTEN CONFESSION",
    meta: "From: sara.mathews.personal@gmail.com \u2022 To: phantom.root.contact@proton.me \u2022 6 days ago, 11:23 PM",
    body: "I have thought about this carefully and I want to proceed.\nI can give you remote access credentials for the server room\nand the CCTV admin panel. I want \u20b95 lakhs transferred before\nI do anything. After that I will send you everything you need.\nSara",
    clues: [
      { title: "WRITING STYLE ANALYSIS", text: "N3XUS has analysed 3 years of Sara\u2019s work emails.\nSara always uses full words \u2014 never abbreviations.\nSara signs emails \u2018Sara M\u2019 \u2014 never just \u2018Sara\u2019.\nSara uses British English \u2014 \u2018colour\u2019 not \u2018color\u2019.\nThis email uses American English throughout.\nThe writing pattern does not match her corpus." },
      { title: "EMAIL HEADER METADATA", text: "The email header shows it was sent from sara.mathews.personal@gmail.com\nbut the X-Originating-IP header shows: 103.45.67.89\nThat IP address was already identified tonight as\nPhantom Root\u2019s command server.\nThe email was sent FROM Phantom Root\u2019s own server." },
      { title: "LINGUISTIC FINGERPRINT", text: "The phrase \u2018I have thought about this carefully\u2019 appears in\n17 other fabricated confession documents linked to Phantom Root.\nIt is a template phrase used in their AI-generated confession tool.\nThis exact sentence structure is a known Phantom Root signature." },
      { title: "TIMESTAMP PARADOX", text: "This email was sent 6 days ago at 11:23 PM.\nNexaCorp access logs show Sara\u2019s keycard exited at 7:14 PM.\nMobile network data places Sara\u2019s phone in Mysuru at 11:23 PM \u2014\n450km from Bengaluru. She was not in the city when this was sent." }
    ]
  }
};

// ─────────────────────────────────────────
// STATE

// ─────────────────────────────────────────
function freshState() {
  return {
    screen: "welcome", level: 0,
    timerSecs: 0, lastTick: 0, timerCB: null,
    l1: { targetIdx: 0, cleared: [], attempts: 0, sel: { sender: null, subject: null, tone: null, link: null, visual: null }, attackMethod: "PHISHING" },
    l2: { devices: null, secured: 0, spreadTick: 0 },
    l3: { exchIdx: 0, history: [], moles: [], aiFailure: "BLIND TRUST" },
    masterCode: { p1: "PHISHING", p2: "0", p3: "BLIND TRUST", derived: "" },
    gameStartTime: 0, wrongAttempts: 0,
    ransomware: { sel: [], correct: false, started: false, expired: false },
    rogueHunt: { flagged: [], sortCol: null, sortAsc: true, filter: "all", macShown: {}, started: false },
    mediaTrial: { verdicts: { A: null, B: null, C: null }, cluesA: [], cluesB: [], cluesC: [], started: false, playedA: false }
  };
}
var S = freshState();
S.l2.devices = JSON.parse(JSON.stringify(DEVICES));
function dc(o) { return JSON.parse(JSON.stringify(o)); }
function save() { try { localStorage.setItem("sz2", JSON.stringify(S)); } catch (e) { } }
function loadSave() { try { var r = localStorage.getItem("sz2"); if (r) { S = JSON.parse(r); return true; } } catch (e) { } return false; }
function resetGame() {
  stopTimer(); stopL2(); clearTypeTimers();
  S = freshState(); S.l2.devices = dc(DEVICES);
  localStorage.removeItem("sz2");
  localStorage.removeItem("sz_team_name");
  S.screen = "login_page"; render();
}
function restartLevel() {
  stopTimer(); stopL2(); clearTypeTimers();
  var lv = S.level;
  if (lv === 1) {
    S.l1 = { targetIdx: 0, cleared: [], attempts: 0, sel: { sender: null, subject: null, tone: null, link: null, visual: null }, attackMethod: "PHISHING" };
    S.level = 0; save(); goTo("level1_game");
  } else if (lv === 2) {
    S.l2 = { devices: dc(DEVICES), secured: 0, spreadTick: 0 };
    S.level = 0; save(); goTo("level2_game");
  } else if (lv === 3) {
    S.l3 = { exchIdx: 0, history: [], moles: [], aiFailure: "BLIND TRUST" };
    S.level = 0; save(); goTo("level3_game");
  } else {
    // Not in a numbered level — do nothing special, just go to welcome
    goTo("welcome");
  }
}

// ─────────────────────────────────────────
// MINI-GAME TIMERS
// ─────────────────────────────────────────
var _riv = null, _rdiv = null, _smtiv = null;
function stopRansomT() { if (_riv) { clearInterval(_riv); _riv = null; } }
function stopRogueT() { if (_rdiv) { clearInterval(_rdiv); _rdiv = null; } }
function stopMediaT() { if (_smtiv) { clearInterval(_smtiv); _smtiv = null; } }

// ─────────────────────────────────────────
// AUDIO
// ─────────────────────────────────────────
var _actx = null;
function getACtx() {
  if (!_actx && CONFIG.SOUND_ENABLED) {
    try { _actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { }
  }
  return _actx;
}
function playOsc(f, t, d, v) {
  var ctx = getACtx(); if (!ctx) return;
  try {
    if (ctx.state === "suspended") ctx.resume();
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = t; o.frequency.value = f; o.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(v, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + d);
    o.start(); o.stop(ctx.currentTime + d);
  } catch (e) { }
}
function playNoise(d, v) {
  var ctx = getACtx(); if (!ctx) return;
  try {
    if (ctx.state === "suspended") ctx.resume();
    var n = Math.floor(ctx.sampleRate * d), buf = ctx.createBuffer(1, n, ctx.sampleRate), dat = buf.getChannelData(0);
    for (var i = 0; i < n; i++)dat[i] = Math.random() * 2 - 1;
    var s = ctx.createBufferSource(), g = ctx.createGain();
    g.gain.value = v; s.buffer = buf; s.connect(g); g.connect(ctx.destination); s.start();
  } catch (e) { }
}
var SFX = {
  type: function (ai) { playOsc(ai ? 420 + Math.random() * 120 : 850 + Math.random() * 350, "square", 0.018, 0.04); },
  glitch: function () { playNoise(0.1, 0.15); },
  alarm: function () { playOsc(440, "sawtooth", 0.18, 0.1); setTimeout(function () { playOsc(880, "sawtooth", 0.18, 0.1); }, 200); },
  success: function () { playOsc(523, "sine", 0.14, 0.09); setTimeout(function () { playOsc(659, "sine", 0.14, 0.09); }, 150); setTimeout(function () { playOsc(784, "sine", 0.25, 0.09); }, 300); }
};

// ─────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────
var _tt = [];
function clearTypeTimers() { _tt.forEach(clearTimeout); _tt = []; }
function mk(tag, props, kids) {
  var e = document.createElement(tag);
  if (props) Object.keys(props).forEach(function (k) {
    if (k === "cls") e.className = props[k];
    else if (k === "html") e.innerHTML = props[k];
    else if (k === "txt") e.textContent = props[k];
    else if (k === "sty") e.setAttribute("style", props[k]);
    else if (k.startsWith("on")) e.addEventListener(k.slice(2).toLowerCase(), props[k]);
    else e.setAttribute(k, props[k]);
  });
  if (kids) (Array.isArray(kids) ? kids : [kids]).forEach(function (c) {
    if (c == null) return;
    if (typeof c === "string" || typeof c === "number") e.appendChild(document.createTextNode(c));
    else e.appendChild(c);
  });
  return e;
}
function addTap(el, fn) {
  el.addEventListener("click", function (e) { try { fn(e); } catch (err) { console.error("tap handler:", err); } });
}
function typeText(el, text, speed, isAI, cb) {
  el.textContent = ""; var i = 0;
  function tick() {
    if (i < text.length) {
      el.textContent += text[i];
      if (text[i] !== " " && text[i] !== "\n") SFX.type(isAI);
      i++; _tt.push(setTimeout(tick, speed || 35));
    } else if (cb) cb();
  } tick();
}
function glitch(cb) {
  try { SFX.glitch(); } catch (e) { }
  var ov = document.getElementById("transition-overlay");
  if (!ov) {
    ov = mk("div", { id: "transition-overlay" });
    var lines = mk("div", { cls: "glitch-lines" });
    ov.appendChild(lines);
    document.body.appendChild(ov);
  }
  ov.classList.add("active");
  setTimeout(function () {
    ov.classList.remove("active");
    if (cb) cb();
  }, 300);
}
function goTo(id) { glitch(function () { S.screen = id; save(); render(); }); }
function devById(id) { return S.l2.devices.find(function (d) { return d.id === id; }); }

// ─────────────────────────────────────────
// TIMER
// ─────────────────────────────────────────
var _tiv = null;
function stopTimer() { if (_tiv) { clearInterval(_tiv); _tiv = null; } }
function startTimer(secs, onExp) {
  stopTimer();
  S.timerSecs = secs; S.lastTick = Date.now();
  _tiv = setInterval(function () {
    if (document.hidden) { S.lastTick = Date.now(); return; }
    var dt = Math.floor((Date.now() - S.lastTick) / 1000);
    if (dt < 1) return;
    S.timerSecs -= dt; S.lastTick = Date.now();
    if (S.timerSecs <= 0) { S.timerSecs = 0; stopTimer(); onExp(); return; }
    refreshTimerEl();
  }, 500);
}
function refreshTimerEl() {
  var el = document.getElementById("timer"); if (!el) return;
  var m = Math.floor(S.timerSecs / 60), s = S.timerSecs % 60;
  el.textContent = m + ":" + (s < 10 ? "0" : "") + s;
  el.className = S.timerSecs <= 60 ? "crit" : S.timerSecs <= 90 ? "warn" : "";
  el.id = "timer";
  if (S.timerSecs === 30) { var gc = document.getElementById("game-container"); if (gc) { gc.classList.add("shake"); setTimeout(function () { gc.classList.remove("shake"); }, 600); } }
}
function timerEl() {
  var d = document.createElement("div"); d.id = "timer"; refreshTimerEl(); return d;
}

// ─────────────────────────────────────────
// LEVEL 2 SPREAD
// ─────────────────────────────────────────
var _l2iv = null;
function stopL2() { if (_l2iv) { clearInterval(_l2iv); _l2iv = null; } }
function startL2Spread() {
  stopL2();
  _l2iv = setInterval(function () {
    if (S.screen !== "level2_game" || document.hidden) return;
    S.l2.spreadTick++;
    var routerComp = devById(4) && devById(4).st === "compromised";
    var rate = routerComp ? 8 : 18;
    if (S.l2.spreadTick < rate) return;
    S.l2.spreadTick = 0;
    var comps = S.l2.devices.filter(function (d) { return d.st === "compromised"; });
    var cands = {};
    comps.forEach(function (c) {
      CONNS.forEach(function (e) {
        var oid = e[0] === c.id ? e[1] : (e[1] === c.id ? e[0] : null);
        if (oid === null) return;
        var od = devById(oid);
        if (od && od.st === "safe") cands[oid] = od;
      });
    });
    var list = Object.values(cands);
    if (!list.length) return;
    var pick = list[Math.floor(Math.random() * list.length)];
    pick.st = "suspicious"; save(); redrawMap();
    setTimeout(function () {
      if (pick.st === "suspicious") {
        pick.st = "compromised"; SFX.alarm(); save(); redrawMap();
        if (pick.id === 6) SFX.glitch();
      }
    }, 2500);
  }, 1000);
}

// ─────────────────────────────────────────
// MASTER CODE
// ─────────────────────────────────────────
function deriveMaster() {
  var p1 = (S.l1.attackMethod || "PHISHING").toUpperCase().trim();
  var p2 = String(S.l2.secured || 0);
  var p3 = (S.l3.aiFailure || "BLIND TRUST").toUpperCase().trim();
  S.masterCode.p1 = p1; S.masterCode.p2 = p2; S.masterCode.p3 = p3;
  if (CONFIG.MASTER_CODE_OVERRIDE) {
    S.masterCode.derived = CONFIG.MASTER_CODE_OVERRIDE.toUpperCase().trim();
  } else {
    S.masterCode.derived = p1 + "-" + p2 + "-" + p3;
  }
}
function validateMaster(inp) {
  var a = inp.toUpperCase().trim().replace(/\s+/g, " ");
  var b = S.masterCode.derived.toUpperCase().trim().replace(/\s+/g, " ");
  return a === b;
}
function masterHint(inp) {
  var pts = inp.toUpperCase().trim().split("-");
  var cp = S.masterCode.derived.split("-");
  if (pts[0] !== cp[0]) return "Part 1 is incorrect.";
  if (pts[1] !== cp[1]) return "Part 2 is incorrect. Count the devices you personally secured.";
  return "Part 3 is incorrect. Think about the mole type label.";
}

// ─────────────────────────────────────────
// RENDER
// ─────────────────────────────────────────
var SCREENS = {};
function render() {
  try {
    clearTypeTimers(); stopL2(); stopRansomT(); stopRogueT();
    var gc = document.getElementById("game-container"); if (!gc) return;
    gc.innerHTML = "";
    updateBackground(S.screen);
    addDataStreams();
    addIoTOverlay();
    updatePersistentUI();
    var fn = SCREENS[S.screen];
    if (fn) gc.appendChild(fn());
    else gc.appendChild(mk("p", { cls: "c-red", txt: "Unknown screen: " + S.screen }));
  } catch (err) { console.error("render:", err); }
}

// ─────────────────────────────────────────
// SCREEN HELPERS
// ─────────────────────────────────────────
function skipBtn(to) {
  var b = mk("button", { cls: "btn ghost", txt: ">>", sty: "margin-bottom:0" });
  addTap(b, function () { goTo(to); }); return b;
}
function gmResetBtn() {
  var b = mk("button", { cls: "btn ghost", txt: "RESET", sty: "margin-bottom:0;border-color:var(--accent-danger);color:var(--accent-danger);" });
  addTap(b, function () {
    var pw = prompt("GM ACCESS CODE:");
    if (!pw || pw.toLowerCase() !== (CONFIG.GM_PASSWORD || "iloveu").toLowerCase()) return;
    if (confirm("RESET game for next team?")) resetGame();
  });
  return b;
}
function storyScreen(title, col, body, nextId, nextLbl, spd) {
  var w = mk("div", { cls: "terminal-tv-wrap" });
  var hdr = mk("div", { cls: "terminal-tv-hdr" });
  hdr.appendChild(mk("div", { txt: "■ NEXACORP // SECURE TERMINAL v2.1" }));
  hdr.appendChild(mk("div", { html: "<span style='color:var(--text-primary);animation:stripBlink 1s infinite;'>●</span> LIVE" }));
  w.appendChild(hdr);

  var main = mk("div", { cls: "terminal-tv-main" });
  w.appendChild(main);

  var lines = body.split("\n");
  var li = 0;

  var btnWrap = mk("div", { sty: "margin-top:20px;text-align:center;" });
  var btn = mk("button", { cls: "terminal-auth-btn hidden", txt: nextLbl || "[ TAP TO CONTINUE ]" });
  addTap(btn, function () { goTo(nextId); });
  btnWrap.appendChild(btn);

  var cursor = mk("div", { cls: "term-cursor hidden", txt: "█" });

  function typeNextLine() {
    if (li >= lines.length) {
      main.appendChild(cursor);
      cursor.classList.remove("hidden");
      main.appendChild(btnWrap);
      setTimeout(function () { btn.classList.remove("hidden"); main.scrollTop = main.scrollHeight; }, 600);
      return;
    }

    var lineText = lines[li];
    if (lineText.trim() === "") {
      main.appendChild(mk("br", { sty: "display:block;height:4px;" }));
      li++;
      typeNextLine();
      return;
    }

    var p = mk("p", { cls: "terminal-line" });
    if (lineText.startsWith(">") || lineText.startsWith("►")) p.classList.add("t-line-prim");
    else if (lineText.startsWith("[SYS]")) p.classList.add("t-line-sec");
    else if (lineText.startsWith("[A.I]") || lineText.startsWith("N3XUS")) p.classList.add("t-line-ai");
    else if (lineText.startsWith("[IOT]")) p.classList.add("t-line-iot");
    else if (lineText.startsWith("[WRN]") || lineText.startsWith("WARNING")) p.classList.add("t-line-warn");
    else if (lineText.startsWith("[ERR]") || lineText.startsWith("ACCESS DENIED")) p.classList.add("t-line-err");
    else if (lineText.includes("━━━")) p.classList.add("t-line-mut");

    main.appendChild(p);
    typeText(p, lineText, spd || 20, false, function () {
      li++;
      main.scrollTop = main.scrollHeight;
      setTimeout(typeNextLine, 300);
    });
  }
  setTimeout(typeNextLine, 100);

  return w;
}
function pwScreen(title, col, pw, nextId) {
  var w = mk("div", { cls: "terminal-tv-wrap" });
  var main = mk("div", { cls: "terminal-tv-main" });
  w.appendChild(main);
  main.appendChild(mk("h2", { sty: "color:" + col + ";text-align:center;margin-bottom:28px;", txt: title }));
  var inpWrap = mk("div", { cls: "terminal-inp-wrap", sty: "display:block;text-align:center;" });
  var inp = mk("input", { cls: "terminal-inp", type: "text", placeholder: "ENTER CODE" });
  inpWrap.appendChild(inp);
  var err = mk("div", { cls: "err-msg center" });
  var btn = mk("button", { cls: "terminal-auth-btn", txt: "SUBMIT", sty: "display:block;margin:0 auto;" });
  function doCheck() {
    if (inp.value.trim().toUpperCase() === pw.toUpperCase()) { SFX.success(); goTo(nextId); }
    else {
      SFX.glitch(); inpWrap.classList.add("shake-h"); err.textContent = "ACCESS DENIED";
      setTimeout(function () { inpWrap.classList.remove("shake-h"); err.textContent = ""; }, 500);
    }
  }
  inp.addEventListener("keydown", function (e) { if (e.key === "Enter") doCheck(); });
  addTap(btn, doCheck);
  main.appendChild(inpWrap); main.appendChild(err); main.appendChild(btn);
  return w;
}
SCREENS.login_page = function () {
  var saved = localStorage.getItem("sz_team_name") || "";
  var w = mk("div", { cls: "login-full" });
  // ── CENTER TITLE BLOCK (pops in) ────────────────
  var titleBlock = mk("div", { cls: "login-title-block" });
  titleBlock.appendChild(mk("div", { cls: "login-sys-label", txt: "NEXACORP SECURITY OPERATIONS — SYSTEM ACCESS v2.1" }));
  var titleEl = mk("div", { cls: "login-sys-title", txt: "SYSTEM ZERO" });
  titleBlock.appendChild(titleEl);
  var subEl = mk("div", { cls: "login-sys-sub" });
  subEl.innerHTML = "<span style='color:#ff6b6b;'>&#9679;</span> NexaCorp Security Breach &mdash; Active";
  titleBlock.appendChild(subEl);
  w.appendChild(titleBlock);
  // ── KALI TERMINAL PANEL (slides up after title pops) ─
  var termWrap = mk("div", { cls: "login-terminal-wrap" });
  var term = mk("div", { cls: "kali-terminal" });
  // Title bar
  var titleBar = mk("div", { cls: "kali-title-bar" });
  titleBar.appendChild(mk("div", { cls: "kali-dot red" }));
  titleBar.appendChild(mk("div", { cls: "kali-dot yel" }));
  titleBar.appendChild(mk("div", { cls: "kali-dot grn" }));
  titleBar.appendChild(mk("div", { cls: "kali-title-text", txt: "system_zero@nexacorp: ~/auth" }));
  term.appendChild(titleBar);
  var content = mk("div", { cls: "kali-content", id: "kali-content-area" });
  term.appendChild(content);
  termWrap.appendChild(term);
  w.appendChild(termWrap);
  // Boot sequence lines
  var hexStr = ""; for (var hx = 0; hx < 8; hx++)hexStr += "0123456789abcdef"[Math.floor(Math.random() * 16)];
  var bootLines = [
    { t: "nexacorp@system-zero:~$ ./authenticate.sh", sty: "" },
    { t: "Initializing operator identification protocol...", sty: "color:rgba(150,200,150,0.7)" },
    { t: "[INFO] Session: 0x" + hexStr, sty: "color:rgba(107,159,255,0.6)" },
    { t: "[INFO] Terminal: /dev/tty1", sty: "color:rgba(107,159,255,0.6)" },
    { t: "[INFO] Uptime: 847 days, 14:22:01", sty: "color:rgba(107,159,255,0.6)" },
    { t: " ", sty: "" },
    { t: "Enter operator callsign to proceed:", sty: "color:#a78bfa" }
  ];
  var li = 0;
  function typeBootLine() {
    if (li >= bootLines.length) { showPrompt(); return; }
    var bl = bootLines[li]; var p = document.createElement("div");
    if (bl.sty) p.setAttribute("style", bl.sty);
    content.appendChild(p);
    typeText(p, bl.t, 20, false, function () { li++; setTimeout(typeBootLine, li === 1 ? 350 : li === 2 ? 550 : 70); });
  }
  function showPrompt() {
    var pb = mk("div", { cls: "kali-prompt-block" });
    var p1 = mk("div", { cls: "kali-p1" });
    p1.innerHTML = "\u250c\u2500\u2500(<span class='kali-user'>SYSTEM_ZERO</span><span class='kali-ring'>\u30f2</span><span class='kali-host'>nexacorp</span>)<span class='kali-path'>-[~/auth]</span>";
    var p2 = mk("div", { cls: "kali-p2" });
    p2.innerHTML = "\u2514\u2500<span class='kali-dollar'>$</span> ";
    var inp = mk("input", { cls: "kali-input-inline", type: "text", id: "kali-login-inp" });
    inp.setAttribute("maxlength", "24"); inp.setAttribute("autocomplete", "off"); inp.setAttribute("spellcheck", "false");
    if (saved) inp.value = saved;
    p2.appendChild(inp); pb.appendChild(p1); pb.appendChild(p2);
    var feedback = mk("div", { cls: "kali-scan-feedback", id: "kali-feedback" });
    if (saved) feedback.textContent = "[RETURNING OPERATOR] " + saved + " — press Enter to authenticate";
    pb.appendChild(feedback);
    var authBtn = mk("button", { cls: "login-auth-btn", id: "login-auth-btn", txt: "[ AUTHENTICATE OPERATOR ]" });
    if (saved) authBtn.style.display = "block";
    pb.appendChild(authBtn);
    content.appendChild(pb);
    setTimeout(function () { inp.focus(); }, 100);
    inp.addEventListener("input", function () {
      var v = inp.value.trim(); var chars = v.length;
      var fb = document.getElementById("kali-feedback");
      if (fb) {
        if (chars === 0) fb.textContent = "";
        else if (chars < 3) fb.textContent = "[SCANNING] Operator ID: " + v + "_";
        else fb.textContent = "[MATCH FOUND] Processing identity...";
      }
      var ab = document.getElementById("login-auth-btn");
      if (ab) ab.style.display = chars >= 2 ? "block" : "none";
    });
    function doLogin() {
      var v = inp.value.trim(); if (v.length < 2) return;
      var name = v.toUpperCase();
      localStorage.setItem("sz_team_name", name);
      // Fade out terminal content
      content.style.transition = "opacity 0.3s"; content.style.opacity = "0";
      setTimeout(function () {
        content.innerHTML = ""; content.style.opacity = "1";
        // Update title glow
        titleEl.style.textShadow = "0 0 30px #00ff41, 0 0 80px #00ff4166, 0 0 120px #00ff4122";
        var greetLines = [
          { t: "nexacorp@system-zero:~$ id " + name, sty: "" },
          { t: "[OK] Operator identity confirmed", sty: "color:#4ade80" },
          { t: "[OK] Access tier: ALPHA", sty: "color:#4ade80" },
          { t: "[OK] Clearance: SYSTEM ZERO", sty: "color:#4ade80" },
          { t: " ", sty: "" }, { t: "\u2501".repeat(40), sty: "color:rgba(107,159,255,0.3)" },
          { t: " ", sty: "" }, { t: "WELCOME TO THE GRID,", sty: "color:#c8ffd4" },
          { t: " ", sty: "" }
        ];
        var gi = 0;
        function typeGreet() {
          if (gi >= greetLines.length) { showNameReveal(name); return; }
          var gl = greetLines[gi]; var gp = document.createElement("div");
          if (gl.sty) gp.setAttribute("style", gl.sty); content.appendChild(gp);
          typeText(gp, gl.t, 12, false, function () { gi++; content.scrollTop = content.scrollHeight; setTimeout(typeGreet, 50); });
        }
        typeGreet();
        function showNameReveal(nm) {
          var bigName = mk("div", { cls: "name-reveal-big", txt: nm }); content.appendChild(bigName);
          var endLines = [
            { t: " ", sty: "" }, { t: "\u2501".repeat(40), sty: "color:rgba(107,159,255,0.3)" },
            { t: " ", sty: "" }, { t: "ALL THE BEST.", sty: "color:#f59e0b" },
            { t: "Phantom Root does not know you are coming.", sty: "color:rgba(200,200,200,0.6)" },
            { t: " ", sty: "" },
            { t: "[SYSTEM] Initializing mission in 3...", sty: "color:rgba(107,159,255,0.5)" },
            { t: "[SYSTEM] Initializing mission in 2...", sty: "color:rgba(107,159,255,0.5)" },
            { t: "[SYSTEM] Initializing mission in 1...", sty: "color:rgba(107,159,255,0.5)" },
            { t: "[SYSTEM] INITIATING SYSTEM ZERO...", sty: "color:#c8ffd4" }
          ];
          var ei = 0;
          function typeEnd() {
            if (ei >= endLines.length) { scanWipe(); setTimeout(function () { goTo("welcome"); }, 900); return; }
            var el = endLines[ei]; var ep = document.createElement("div");
            if (el.sty) ep.setAttribute("style", el.sty); content.appendChild(ep);
            typeText(ep, el.t, 12, false, function () { ei++; content.scrollTop = content.scrollHeight; setTimeout(typeEnd, ei >= 6 ? 850 : 50); });
          }
          setTimeout(typeEnd, 300);
        }
      }, 320);
    }
    inp.addEventListener("keydown", function (e) { if (e.key === "Enter") doLogin(); });
    addTap(authBtn, doLogin);
  }
  // Start boot after title pop animation completes
  setTimeout(typeBootLine, 700);
  return w;
};
SCREENS.welcome = function () {

  var w = mk("div", { cls: "welcome-bg", sty: "padding-top:20px;text-align:center;font-family:var(--font-mono);color:var(--text-primary);height:100%;" });

  var iotBar = mk("div", { sty: "width:100%;border-bottom:1px solid var(--border-color);box-shadow:var(--border-glow);margin-bottom:30px;padding-bottom:10px;display:flex;justify-content:center;gap:15px;font-size:14px;" });
  const symbols = [
    { sym: "[~]", lbl: "SENSOR GRID", col: "var(--text-primary)" },
    { sym: "[#]", lbl: "CAM", col: "var(--accent-iot)" },
    { sym: "[>]", lbl: "ACT", col: "var(--text-primary)" },
    { sym: "[@]", lbl: "RELAY", col: "var(--accent-iot)" },
    { sym: "[*]", lbl: "NEURAL", col: "var(--accent-warn)" },
    { sym: "[=]", lbl: "", col: "var(--text-primary)" },
    { sym: "[AI]", lbl: "", col: "var(--accent-warn)" }
  ];
  symbols.forEach(function (s, i) {
    var n = mk("span", { cls: "iot-node", sty: "color:" + s.col + ";animation: stripBlink " + (1.5 + i * 0.3) + "s infinite;" });
    n.innerHTML = s.sym + (s.lbl ? "<br><span style='font-size:10px;'>" + s.lbl + "</span>" : "");
    iotBar.appendChild(n);
  });
  w.appendChild(iotBar);

  var sysBox = mk("div", { sty: "border:1px solid var(--border-color);background:rgba(0,0,0,0.7);padding:20px;display:inline-block;margin-bottom:30px;text-align:left;" });
  sysBox.appendChild(mk("div", { cls: "glitch", "data-text": "SYSTEM ZERO", txt: "SYSTEM ZERO", sty: "font-size:24px;color:var(--text-primary);margin-bottom:10px;" }));
  sysBox.appendChild(mk("div", { txt: "NexaCorp Security Operations", sty: "color:var(--text-secondary);" }));
  sysBox.appendChild(mk("div", { cls: "glitch", "data-text": "> NexaCorp Security Breach — Active", txt: "> NexaCorp Security Breach — Active", sty: "color:var(--accent-danger);margin-top:10px;" }));
  w.appendChild(sysBox);

  var bootDiv = mk("div", { sty: "text-align:left;background:rgba(0,0,0,0.7);padding:10px;max-width:400px;margin:0 auto 30px auto;min-height:120px;" });
  w.appendChild(bootDiv);

  var authArea = mk("div", { cls: "hidden", sty: "background:rgba(0,0,0,0.7);display:inline-block;padding:20px;" });
  var inpWrap = mk("div", { cls: "terminal-inp-wrap" });
  var inp = mk("input", { cls: "terminal-inp", type: "text" });
  var err = mk("div", { cls: "err-msg center", sty: "min-height:20px;margin-bottom:10px;" });
  var btn = mk("button", { cls: "terminal-auth-btn", txt: "AUTHENTICATE" });

  inpWrap.appendChild(inp);
  authArea.appendChild(mk("div", { txt: "OPERATOR_ID:", sty: "display:inline-block;margin-right:10px;" }));
  authArea.appendChild(inpWrap);
  authArea.appendChild(mk("div"));
  authArea.appendChild(err);
  authArea.appendChild(btn);

  if (localStorage.getItem("sz2")) {
    var rb = mk("button", { cls: "terminal-auth-btn", sty: "position:absolute;bottom:20px;right:20px;font-size:12px;padding:6px 14px;", txt: "RESTORE LAST SESSION" });
    addTap(rb, function () {
      var pw = prompt("GM ACCESS CODE:");
      if (!pw || pw.toLowerCase() !== (CONFIG.GM_PASSWORD || "iloveu").toLowerCase()) return;
      if (loadSave()) render();
    });
    authArea.appendChild(rb);
  }
  w.appendChild(authArea);

  inp.addEventListener("focus", function () { inpWrap.classList.remove("nofocus"); });
  inp.addEventListener("blur", function () { inpWrap.classList.add("nofocus"); });
  inpWrap.classList.add("nofocus");

  function doCheck() {
    var v = inp.value.trim().toUpperCase();
    if (v === CONFIG.LEVEL1_PASSWORD.toUpperCase()) {
      SFX.success();
      goTo("story_intro");
    } else {
      SFX.glitch();
      S.wrongAttempts++;
      inpWrap.classList.add("shake-h");
      err.textContent = ">> ACCESS DENIED <<";
      err.style.color = "var(--accent-danger)";
      setTimeout(function () {
        inpWrap.classList.remove("shake-h");
        err.textContent = "";
      }, 1800);
    }
  }
  inp.addEventListener("keydown", function (e) { if (e.key === "Enter") doCheck(); });
  addTap(btn, doCheck);

  var lines = [
    "> Initializing kernel...",
    "> Loading IoT driver stack...",
    "> Connecting neural net...",
    "> AI subsystem online...",
    "> Awaiting operator auth..."
  ];
  var li = 0;
  function nextLine() {
    if (li >= lines.length) {
      authArea.classList.remove("hidden");
      return;
    }
    var lDiv = mk("div", { sty: "margin-bottom:5px;" });
    bootDiv.appendChild(lDiv);
    var text = lines[li];
    typeText(lDiv, text, 25, false, function () {
      if (li < lines.length - 1) {
        setTimeout(function () {
          var ok = mk("span", { txt: " [OK]", sty: "color:var(--text-primary);font-weight:bold;" });
          lDiv.appendChild(ok);
          li++;
          setTimeout(nextLine, 400);
        }, 200);
      } else {
        li++;
        setTimeout(nextLine, 400);
      }
    });
  }
  setTimeout(nextLine, 400);

  return w;
};
SCREENS.story_intro = function () {
  return storyScreen("SYSTEM ZERO", "var(--accent-danger)",
    "You are a new recruit.\nFirst night on the job at NexaCorp.\n\nAt 22:14 an alarm went silent.\nNot off. Silent.\n\nSomeone killed the alert before it fired.\nSomeone who knew exactly where to look.\n\nThey call themselves Phantom Root.\nThey are inside the network.\nThey are inside the building.\nThey are inside the AI.\n\nYou have three barriers to breach.\nThree domains to defend.\nOne exit code to find.\n\nPhantom Root does not negotiate.\n\nBEGIN.",
    "level1_intro", "TAP TO CONTINUE", 30);
};
SCREENS.level1_intro = function () {
  return storyScreen("LEVEL 01 \u2014 BAIT", "var(--accent-danger)",
    "Domain: Cybersecurity\n\nBefore you can defend against an attack\nyou must understand how it is built.\n\nPhantom Root got inside NexaCorp\nthrough a single email.\n\nYou are going to build that email.\nYou are the attacker now.\n\nThree targets. Three chances.\nStudy each target's profile carefully.\nTheir personality is your weapon.\n\nThe right combination of sender, subject,\ntone, link, and visual will break them.\n\nTime limit: " + Math.floor(CONFIG.LEVEL1_TIME_LIMIT / 60) + " minutes.",
    "level1_game", "BEGIN INFILTRATION", 28);
};
SCREENS.level2_intro = function () {
  return storyScreen("LEVEL 02 \u2014 GRID DOWN", "var(--accent-warn)",
    "Domain: IoT Security\n\nIt is 2:31 AM. Everyone has gone home.\nYou are the night security officer.\n\nThe smart building around you controls\neverything \u2014 cameras, locks, climate, power, printers.\n\nAll connected. All watching. All vulnerable.\n\nSomeone just walked through the front door\nyou did not know was already open.\n\nTap compromised devices to investigate.\nRead the vulnerability. Choose the fix.\nDisconnect before it spreads to the server room.\n\nTime limit: " + Math.floor(CONFIG.LEVEL2_TIME_LIMIT / 60) + " minutes.",
    "level2_game", "ENTER SECURITY DASHBOARD", 28);
};
SCREENS.level3_intro = function () {
  return storyScreen("LEVEL 03 \u2014 FIND THE MOLE", "var(--accent-iot)",
    "Domain: Generative AI\n\nPhantom Root got inside N3XUS \u2014\nNexaCorp's internal AI assistant.\n\nThey did not delete its knowledge.\nThat would be obvious.\nThey mixed lies into the truth.\n\nHave a conversation with N3XUS.\nRead every response carefully.\nFind the 4 MOLES hidden in its outputs.\n\nFlag each one when you find it.\n\nThe right relationship with AI\nis not trust. It is verification.\n\nTime limit: " + Math.floor(CONFIG.LEVEL3_TIME_LIMIT / 60) + " minutes.",
    "level3_game", "CONNECT TO N3XUS", 28);
};
SCREENS.level2_entry = function () { return pwScreen("LEVEL 02 \u2014 ENTER CODE", "var(--accent-warn)", CONFIG.LEVEL2_PASSWORD, "level2_intro"); };
SCREENS.level3_entry = function () { return pwScreen("LEVEL 03 \u2014 ENTER CODE", "var(--accent-iot)", CONFIG.LEVEL3_PASSWORD, "level3_intro"); };

// ─────────────────────────────────────────
// LEVEL 1 GAME
// ─────────────────────────────────────────
SCREENS.level1_game = function () {
  if (S.level !== 1) { S.level = 1; if (!S.gameStartTime) S.gameStartTime = Date.now(); startTimer(CONFIG.LEVEL1_TIME_LIMIT, function () { goTo("level1_timeout"); }); }
  var t = TARGETS[S.l1.targetIdx];
  if (!t) { stopTimer(); goTo("level1_complete"); return mk("div"); }
  var w = mk("div");
  // Header
  var hdr = mk("div", { sty: "display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;" });
  hdr.appendChild(mk("span", { cls: "c-red", sty: "font-size:13px;letter-spacing:2px;", txt: "TARGET " + (S.l1.targetIdx + 1) + "/3" }));
  var hdr1r = mk("div", { sty: "display:flex;gap:8px;align-items:center;" });
  hdr1r.appendChild(gmResetBtn()); hdr1r.appendChild(timerEl()); hdr.appendChild(hdr1r); w.appendChild(hdr);
  // Tabs
  var tabs = mk("div", { sty: "display:flex;gap:4px;margin-bottom:10px;" });
  [0, 1, 2].forEach(function (i) {
    var tgt = TARGETS[i]; var isActive = (i === S.l1.targetIdx); var isDone = S.l1.cleared.includes(i);
    var bdr = isDone ? "var(--text-primary)" : isActive ? "var(--accent-danger)" : "var(--border-color)";
    var clr = isDone ? "var(--text-primary)" : isActive ? "var(--accent-danger)" : "var(--text-muted)";
    var tab = mk("button", { sty: "flex:1;padding:6px 4px;background:" + (isActive ? "rgba(255,51,85,.12)" : "transparent") + ";border:1px solid " + bdr + ";color:" + clr + ";font-family:var(--font-mono);font-size:10px;letter-spacing:1px;cursor:pointer;touch-action:manipulation;text-align:center;" });
    tab.textContent = (isDone ? "\u2713 " : "") + tgt.name.split(" ")[0];
    if (!isActive) { (function (idx) { tab.addEventListener("click", function () { S.l1.targetIdx = idx; S.l1.sel = { sender: null, subject: null, tone: null, link: null, visual: null }; save(); render(); }); })(i); }
    tabs.appendChild(tab);
  });
  w.appendChild(tabs);
  // ── OSINT PROFILE CARD ──────────────────────
  var emails = ["p.sharma@nexacorp.in", "r.gupta@nexacorp.in", "v.nair@nexacorp.in"];
  var hours = ["8:30AM \u2013 6:30PM", "9:00AM \u2013 7:00PM", "7:00AM \u2013 9:00PM"];
  var vulnPcts = [82, 61, 74];
  var osint = mk("div", { cls: "osint-card" });
  osint.appendChild(mk("div", { cls: "classified-stamp", txt: "CLASSIFIED" }));
  var ohdr = mk("div", { cls: "osint-header" });
  ohdr.appendChild(mk("span", { cls: "osint-header-tag", txt: "[CLASSIFIED] NEXACORP PERSONNEL FILE \u2014 OSINT COMPILED" }));
  ohdr.appendChild(mk("span", { cls: "osint-header-src", txt: "Source: LinkedIn \u00b7 Corporate Directory \u00b7 Email Headers" }));
  osint.appendChild(ohdr);
  // Body: avatar + info
  var obody = mk("div", { cls: "osint-body" });
  // SVG avatar
  var svgNS = "http://www.w3.org/2000/svg";
  var av = document.createElementNS(svgNS, "svg"); av.setAttribute("viewBox", "0 0 80 80"); av.setAttribute("width", "80"); av.setAttribute("height", "80");
  var avc = document.createElementNS(svgNS, "circle"); avc.setAttribute("cx", "40"); avc.setAttribute("cy", "40"); avc.setAttribute("r", "35"); avc.setAttribute("stroke", "var(--accent-iot)"); avc.setAttribute("stroke-width", "1.5"); avc.setAttribute("fill", "#000"); av.appendChild(avc);
  var headCy = ["35", "35", "33"], headR = ["10", "9", "11"], bW = ["12", "10", "15"];
  var avH = document.createElementNS(svgNS, "circle"); avH.setAttribute("cx", "40"); avH.setAttribute("cy", headCy[S.l1.targetIdx]); avH.setAttribute("r", headR[S.l1.targetIdx]); avH.setAttribute("fill", "var(--accent-iot)"); avH.setAttribute("opacity", "0.85"); av.appendChild(avH);
  var avB = document.createElementNS(svgNS, "rect"); avB.setAttribute("x", (40 - parseInt(bW[S.l1.targetIdx]) / 2).toString()); avB.setAttribute("y", "48"); avB.setAttribute("width", bW[S.l1.targetIdx]); avB.setAttribute("height", "18"); avB.setAttribute("rx", "3"); avB.setAttribute("fill", "var(--accent-iot)"); avB.setAttribute("opacity", "0.65"); av.appendChild(avB);
  var ring = document.createElementNS(svgNS, "circle"); ring.setAttribute("cx", "40"); ring.setAttribute("cy", "40"); ring.setAttribute("r", "38"); ring.setAttribute("stroke", "var(--accent-danger)"); ring.setAttribute("stroke-width", "0.5"); ring.setAttribute("fill", "none"); ring.setAttribute("stroke-dasharray", "4 3"); ring.setAttribute("class", "target-ring-spin"); av.appendChild(ring);
  var lh = document.createElementNS(svgNS, "line"); lh.setAttribute("x1", "2"); lh.setAttribute("y1", "40"); lh.setAttribute("x2", "78"); lh.setAttribute("y2", "40"); lh.setAttribute("stroke", "var(--accent-danger)"); lh.setAttribute("stroke-width", "0.3"); lh.setAttribute("opacity", "0.4"); av.appendChild(lh);
  var lv = document.createElementNS(svgNS, "line"); lv.setAttribute("x1", "40"); lv.setAttribute("y1", "2"); lv.setAttribute("x2", "40"); lv.setAttribute("y2", "78"); lv.setAttribute("stroke", "var(--accent-danger)"); lv.setAttribute("stroke-width", "0.3"); lv.setAttribute("opacity", "0.4"); av.appendChild(lv);
  var avWrap = mk("div", { cls: "osint-avatar-wrap" }); avWrap.appendChild(av); obody.appendChild(avWrap);
  // Info
  var info = mk("div", { cls: "osint-info" });
  info.appendChild(mk("div", { cls: "osint-name", txt: t.name }));
  info.appendChild(mk("div", { cls: "osint-role", txt: t.role }));
  info.appendChild(mk("div", { cls: "osint-divider" }));
  [{ icon: "\ud83d\udd34", lbl: "WEAKNESS", val: t.weakness, cls: "c-red" }, { icon: "\ud83d\udfe2", lbl: "RESISTANT", val: t.resistantTo, cls: "c-mut" }, { icon: "\ud83d\udfe1", lbl: "ONLINE", val: hours[S.l1.targetIdx], cls: "c-yel" }, { icon: "\ud83d\udce7", lbl: "EMAIL", val: emails[S.l1.targetIdx], cls: "c-mut" }].forEach(function (f) {
    var row = mk("div", { cls: "osint-field" });
    row.appendChild(mk("span", { cls: "osint-field-icon", txt: f.icon }));
    row.appendChild(mk("span", { cls: "osint-field-label", txt: f.lbl + ":" }));
    row.appendChild(mk("span", { cls: "osint-field-val " + f.cls, txt: f.val }));
    info.appendChild(row);
  });
  obody.appendChild(info); osint.appendChild(obody);
  // Traits section
  var otr = mk("div", { cls: "osint-section" });
  otr.appendChild(mk("div", { cls: "osint-section-title", txt: "BEHAVIOURAL ANALYSIS" }));
  otr.appendChild(mk("div", { cls: "osint-divider2" }));
  t.traits.forEach(function (tr) { otr.appendChild(mk("div", { cls: "osint-trait", txt: "> " + tr })); });
  osint.appendChild(otr);
  // Vuln bar
  var vp = vulnPcts[S.l1.targetIdx];
  var vWrap = mk("div", { cls: "vuln-wrap" });
  var vLbl = mk("div", { cls: "vuln-label" });
  vLbl.appendChild(mk("span", { txt: "ATTACK SURFACE SCORE" })); vLbl.appendChild(mk("span", { txt: vp + "% VULNERABLE" }));
  vWrap.appendChild(vLbl);
  var vBar = mk("div", { cls: "vuln-bar" });
  var vFill = mk("div", { cls: "vuln-fill " + (vp >= 75 ? "high" : vp >= 60 ? "mid" : "low") });
  vBar.appendChild(vFill); vWrap.appendChild(vBar); osint.appendChild(vWrap);
  w.appendChild(osint);
  setTimeout(function () { vFill.style.width = vp + "%"; }, 80);
  // ── DROPDOWN EMAIL BUILDER ────────────────────
  var CATS = ["sender", "subject", "tone", "link", "visual"];
  var catLabels = { "sender": "SENDER_IDENTITY", "subject": "SUBJECT_LINE", "tone": "TONE_VECTOR", "link": "PAYLOAD_LINK", "visual": "VISUAL_ELEMENT" };
  CATS.forEach(function (cat) {
    var wrap = mk("div", { cls: "term-select-wrap", id: "tsd-" + cat });
    wrap.appendChild(mk("div", { cls: "term-select-label", txt: catLabels[cat] }));
    var curOpt = EMAIL_OPTIONS[cat].find(function (o) { return o.id === S.l1.sel[cat]; }) || null;
    var trig = mk("div", { cls: "term-select-trigger" + (curOpt ? " sel-active" : "") });
    if (curOpt) { trig.style.borderColor = "var(--text-primary)"; }
    var valSpan = mk("span", { cls: "term-select-value", txt: curOpt ? curOpt.text : "[ SELECT OPTION ]" });
    var arrSpan = mk("span", { cls: "term-select-arrow", txt: "\u25bc" });
    trig.appendChild(valSpan); trig.appendChild(arrSpan);
    var menu = mk("div", { cls: "term-select-menu" });
    EMAIL_OPTIONS[cat].forEach(function (opt) {
      var row = mk("div", { cls: "term-select-option" + (S.l1.sel[cat] === opt.id ? " selected" : "") });
      row.appendChild(mk("span", { cls: "option-code", txt: opt.id + ":" }));
      row.appendChild(mk("span", { cls: "option-text", txt: opt.text }));
      if (opt.tag) row.appendChild(mk("span", { cls: "option-tag", txt: opt.tag }));
      row.addEventListener("click", function () {
        S.l1.sel[cat] = opt.id; save();
        wrap.classList.remove("open");
        valSpan.textContent = opt.text; trig.style.borderColor = "var(--text-primary)";
        trig.classList.add("flash"); setTimeout(function () { trig.classList.remove("flash"); }, 350);
        menu.querySelectorAll(".term-select-option").forEach(function (r) { r.classList.remove("selected"); });
        row.classList.add("selected");
        refreshPreview(); checkAllSel();
      });
      menu.appendChild(row);
    });
    trig.addEventListener("click", function (e) {
      // close others
      document.querySelectorAll(".term-select-wrap.open").forEach(function (ow) { if (ow !== wrap) ow.classList.remove("open"); });
      wrap.classList.toggle("open"); e.stopPropagation();
    });
    wrap.appendChild(trig); wrap.appendChild(menu); w.appendChild(wrap);
  });
  // Close dropdowns on outside click
  document.addEventListener("click", function onOutsideClick() {
    document.querySelectorAll(".term-select-wrap.open").forEach(function (ow) { ow.classList.remove("open"); });
    document.removeEventListener("click", onOutsideClick);
  });
  // ── EMAIL PREVIEW ─────────────────────────────
  var preview = mk("div", { cls: "email-preview", id: "email-preview", sty: "display:none;" });
  preview.appendChild(mk("div", { cls: "lbl", sty: "margin-bottom:6px;", txt: "EMAIL PREVIEW" }));
  var pvFields = ["FROM", "SUBJECT", "TONE", "LINK", "VISUAL"];
  var pvCats = ["sender", "subject", "tone", "link", "visual"];
  pvCats.forEach(function (cat, idx) {
    var pf = mk("div", { cls: "ep-field", id: "epf-" + cat });
    pf.appendChild(mk("span", { cls: "ep-label", txt: pvFields[idx] + ":" }));
    pf.appendChild(mk("span", { cls: "ep-val", id: "epv-" + cat, txt: "\u2014" }));
    preview.appendChild(pf);
  });
  w.appendChild(preview);
  function refreshPreview() {
    var anySet = CATS.some(function (c) { return S.l1.sel[c] !== null; });
    if (!anySet) { preview.style.display = "none"; return; }
    preview.style.display = "block";
    pvCats.forEach(function (cat) {
      var el = document.getElementById("epv-" + cat); if (!el) return;
      if (S.l1.sel[cat]) {
        var opt = EMAIL_OPTIONS[cat].find(function (o) { return o.id === S.l1.sel[cat]; });
        el.textContent = opt ? opt.text : "\u2014"; el.style.color = "var(--text-primary)";
      } else { el.textContent = "\u2014"; el.style.color = "var(--text-muted)"; }
    });
  }
  refreshPreview();
  var errD = mk("div", { cls: "err-msg" }); w.appendChild(errD);
  var sendBtn = mk("button", { cls: "btn red", txt: "SEND ATTACK" });
  sendBtn.disabled = true;
  function checkAllSel() {
    var allSel = CATS.every(function (c) { return S.l1.sel[c] !== null; });
    sendBtn.disabled = !allSel;
  }
  checkAllSel();
  addTap(sendBtn, function () {
    var res = validateTarget(t.id, S.l1.sel);
    if (res.ok) {
      SFX.success(); showSuccessFlash(); sendBtn.disabled = true;
      errD.style.color = "var(--text-primary)"; errD.textContent = t.name.split(" ")[0] + " CLICKED THE LINK.";
      S.l1.cleared.push(t.id); S.l1.targetIdx++;
      while (S.l1.targetIdx < TARGETS.length && S.l1.cleared.includes(S.l1.targetIdx)) S.l1.targetIdx++;
      S.l1.attempts = 0; S.l1.sel = { sender: null, subject: null, tone: null, link: null, visual: null }; save();
      setTimeout(function () { if (S.l1.cleared.length >= TARGETS.length) { stopTimer(); goTo("ransomware_clock"); } else render(); }, 1800);
    } else {
      SFX.glitch(); showErrorFlash(); S.l1.attempts++; S.wrongAttempts++; save();
      errD.textContent = "ATTACK FAILED: " + res.reason;
      if (S.l1.attempts >= CONFIG.HINT_TRIGGER_AFTER_WRONG_ATTEMPTS) {
        var h = mk("div", { cls: "hint mt8" });
        h.appendChild(mk("div", { cls: "hint-lbl", txt: "HINT" }));
        h.appendChild(document.createTextNode("Match SENDER and TONE to the target\u2019s specific weakness."));
        errD.appendChild(h);
      }
    }
  });
  w.appendChild(sendBtn); return w;
};

SCREENS.level1_timeout = function () {
  stopTimer();
  var w = mk("div"); w.appendChild(mk("h2", { cls: "c-yel", txt: "TIME EXPIRED" }));
  w.appendChild(mk("p", { cls: "c-yel", txt: "MISSION PARTIAL \u2014 " + S.l1.cleared.length + "/3 targets breached." }));
  w.appendChild(mk("p", { txt: "The targets you missed noticed the anomalies. They reported the emails to IT.\nIn a real attack, even one breach is enough." }));
  var btn = mk("button", { cls: "btn yel mt14", txt: "CONTINUE" }); addTap(btn, function () { goTo("level1_complete"); }); w.appendChild(btn);
  var a = setTimeout(function () { goTo("level1_complete"); }, 10000); w._cl = function () { clearTimeout(a); };
  return w;
};
SCREENS.level1_complete = function () {
  stopTimer();
  var w = mk("div");
  var row = mk("div", { sty: "display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;" });
  row.appendChild(mk("h2", { cls: "c-red", sty: "margin:0;", txt: "MISSION REPORT" }));
  row.appendChild(skipBtn("level2_entry")); w.appendChild(row);
  // Gold star badge if ransomware was answered correctly
  if (S.ransomware && S.ransomware.correct) {
    var star = mk("div", { sty: "text-align:center;font-size:13px;letter-spacing:1px;color:var(--accent-warn);margin-bottom:10px;padding:6px;border:1px solid var(--accent-warn);background:rgba(255,204,0,.05);", txt: "\u2605 INCIDENT RESPONSE OPTIMAL \u2014 ALL 7 NEXACORP SERVERS SAVED \u2605" });
    w.appendChild(star);
  }
  var tx = mk("div", { cls: "story", sty: "margin-bottom:14px;" });
  var lines = TARGETS.map(function (t) { return t.name + " \u2014 " + (S.l1.cleared.includes(t.id) ? "BREACHED" : "SECURE"); });
  var body = "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n" + lines.join("\n") + "\nCredentials captured: " + S.l1.cleared.length + "\nNexaCorp access: GRANTED\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\nBut wait.\n\nLook at what you just did.\n\nYou never touched a computer.\nYou never wrote a single line of code.\nYou never picked a lock.\n\nYou sent emails.\nThat is all it took.\n\n91% of all cyber attacks begin exactly\nlike this. A single email. The right words\nto the right person at the right moment.\n\nYou understand attacks now.\nIn Level 2 \u2014 one is coming for you.";
  var hintDiv = mk("div", { cls: "hint hidden" });
  hintDiv.appendChild(mk("div", { cls: "hint-lbl", txt: "FIND THE LEVEL 2 CODE" }));
  hintDiv.appendChild(document.createTextNode(CONFIG.HINT_AFTER_LEVEL1));
  var btn = mk("button", { cls: "btn hidden mt14", txt: "FIND THE CODE AND CONTINUE" });
  addTap(btn, function () { goTo("level2_entry"); });
  w.appendChild(tx); w.appendChild(hintDiv); w.appendChild(btn);
  setTimeout(function () { typeText(tx, body, 20, false, function () { hintDiv.classList.remove("hidden"); btn.classList.remove("hidden"); }); }, 150);
  return w;
};

// ─────────────────────────────────────────
// LEVEL 2 GAME
// ─────────────────────────────────────────
function redrawMap() {
  var svg = document.getElementById("net-svg"); if (!svg) return;
  var NS = "http://www.w3.org/2000/svg";
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  CONNS.forEach(function (e) {
    var d1 = devById(e[0]), d2 = devById(e[1]); if (!d1 || !d2) return;
    var line = document.createElementNS(NS, "line");
    line.setAttribute("x1", d1.x); line.setAttribute("y1", d1.y);
    line.setAttribute("x2", d2.x); line.setAttribute("y2", d2.y);
    line.setAttribute("stroke-width", "1.5"); line.setAttribute("fill", "none");
    var hot = d1.st === "compromised" || d2.st === "compromised";
    line.setAttribute("stroke", hot ? "var(--accent-danger)" : "var(--border-color)");
    svg.appendChild(line);
  });
  S.l2.devices.forEach(function (d) {
    var g = document.createElementNS(NS, "g");
    var c = document.createElementNS(NS, "circle");
    c.setAttribute("cx", d.x); c.setAttribute("cy", d.y); c.setAttribute("r", 7);
    c.setAttribute("stroke-width", "2"); c.setAttribute("pointer-events", "all");
    var stk = "var(--border-color)", fil = "var(--bg-surface)";
    if (d.st === "compromised") { stk = "var(--accent-danger)"; fil = "rgba(255,51,85,0.18)"; }
    else if (d.st === "suspicious") { stk = "var(--accent-warn)"; fil = "rgba(255,204,0,0.12)"; }
    else if (d.st === "secured") { stk = "var(--border-color)"; fil = "var(--bg-primary)"; }
    else if (d.st === "server_room") { stk = "var(--accent-purple)"; fil = "rgba(153,85,255,0.12)"; }
    else { stk = "var(--text-primary)"; fil = "rgba(0,255,136,0.06)"; }
    c.setAttribute("stroke", stk); c.setAttribute("fill", fil);
    var tx = document.createElementNS(NS, "text");
    tx.setAttribute("x", d.x); tx.setAttribute("y", d.y + 16);
    tx.setAttribute("text-anchor", "middle"); tx.setAttribute("font-size", "5");
    tx.setAttribute("fill", d.st === "secured" ? "var(--text-muted)" : "var(--text-primary)");
    tx.setAttribute("font-family", "monospace");
    tx.textContent = d.name.split("\u2014")[0].trim().split(" ").slice(0, 2).join(" ");
    if (d.st === "secured") {
      var s = document.createElementNS(NS, "line");
      s.setAttribute("x1", d.x - 6); s.setAttribute("y1", d.y);
      s.setAttribute("x2", d.x + 6); s.setAttribute("y2", d.y);
      s.setAttribute("stroke", "var(--text-muted)"); s.setAttribute("stroke-width", "1.5"); g.appendChild(s);
    }
    if (d.id !== 6 && d.st !== "secured") {
      g.style.cursor = "pointer";
      (function (dev) { g.addEventListener("click", function () { openDevPanel(dev); }); })(d);
    }
    g.appendChild(c); g.appendChild(tx); svg.appendChild(g);
  });
}
function openDevPanel(d) {
  var panel = document.getElementById("dev-panel"); if (!panel) return;
  var NS = "http://www.w3.org/2000/svg";
  panel.innerHTML = "";
  var close = mk("button", { cls: "p-close", html: "&times;" });
  addTap(close, function () { panel.classList.remove("open"); });
  panel.appendChild(close);
  panel.appendChild(mk("h3", { cls: "c-yel", sty: "margin-bottom:8px;", txt: d.name }));
  panel.appendChild(mk("div", { cls: "lbl", txt: "VULNERABILITY" }));
  panel.appendChild(mk("p", { sty: "font-size:13px;margin-bottom:12px;white-space:pre-wrap;", txt: d.vuln }));
  if (d.rev) { panel.appendChild(mk("p", { cls: "c-red", sty: "font-size:13px;", txt: "This cannot be fixed. The data already left. They know your schedule." })); panel.classList.add("open"); return; }
  var errP = mk("p", { cls: "err-msg" }); panel.appendChild(errP);
  d.opts.forEach(function (opt) {
    var b = mk("button", { cls: "btn yel", txt: opt.text });
    addTap(b, function () {
      if (opt.ok) {
        SFX.success(); d.st = "secured"; S.l2.secured++; save();
        panel.classList.remove("open");
        var req = [1, 2, 3, 4];
        var won = req.every(function (id) { return devById(id) && devById(id).st === "secured"; });
        if (won) { stopTimer(); stopL2(); setTimeout(function () { goTo("rogue_device_hunt"); }, 800); }
        else redrawMap();
      } else { SFX.glitch(); S.wrongAttempts++; S.l2.spreadTick += 8; save(); errP.textContent = "WRONG APPROACH \u2014 spread accelerating."; }
    });
    panel.appendChild(b);
  });
  if (d.why) panel.appendChild(mk("p", { cls: "c-mut", sty: "font-size:11px;margin-top:8px;", txt: d.why }));
  panel.classList.add("open");
}
SCREENS.level2_game = function () {
  if (S.level !== 2) { S.level = 2; startTimer(CONFIG.LEVEL2_TIME_LIMIT, function () { stopL2(); goTo("level2_timeout"); }); }
  startL2Spread();
  var w = mk("div");
  var hdr = mk("div", { sty: "display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;" });
  hdr.appendChild(mk("h2", { cls: "c-yel", sty: "margin:0;font-size:17px;", txt: "BUILDING GRID" }));
  var hdr2r = mk("div", { sty: "display:flex;gap:8px;align-items:center;" });
  hdr2r.appendChild(gmResetBtn()); hdr2r.appendChild(timerEl()); hdr.appendChild(hdr2r); w.appendChild(hdr);
  var req = [1, 2, 3, 4];
  var secured = req.filter(function (id) { return devById(id) && devById(id).st === "secured"; }).length;
  var pw = mk("div", { cls: "pb-wrap" });
  var pf = mk("div", { cls: "pb-fill" + (secured / req.length < 0.5 ? " warn" : ""), sty: "width:" + (secured / req.length * 100) + "%;" });
  pw.appendChild(pf); w.appendChild(pw);
  w.appendChild(mk("p", { cls: "c-mut", sty: "font-size:12px;margin-bottom:8px;", txt: "TAP RED NODES TO INVESTIGATE" }));
  var NS = "http://www.w3.org/2000/svg";
  var svg = document.createElementNS(NS, "svg");
  svg.setAttribute("id", "net-svg"); svg.setAttribute("viewBox", "0 0 100 130");
  svg.style.cssText = "width:100%;height:240px;display:block;margin-bottom:12px;overflow:visible;";
  w.appendChild(svg);
  var panel = mk("div", { id: "dev-panel" }); w.appendChild(panel);
  setTimeout(function () { redrawMap(); }, 50);
  return w;
};
SCREENS.level2_timeout = function () {
  stopTimer(); stopL2();
  var w = mk("div"); w.appendChild(mk("h2", { cls: "c-yel", txt: "TIME EXPIRED \u2014 GRID LOST" }));
  w.appendChild(mk("p", { txt: "The infection overtook the building grid.\nYou secured " + S.l2.secured + " devices before time ran out." }));
  w.appendChild(mk("p", { cls: "c-mut", txt: "The system auto-locked. Proceeding to forensic analysis..." }));
  var btn = mk("button", { cls: "btn yel mt14", txt: "CONTINUE" }); addTap(btn, function () { goTo("level2_complete"); }); w.appendChild(btn);
  var a = setTimeout(function () { goTo("level2_complete"); }, 8000); w._cl = function () { clearTimeout(a); };
  return w;
};
SCREENS.level2_complete = function () {
  stopTimer(); stopL2();
  var w = mk("div");
  var row = mk("div", { sty: "display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;" });
  row.appendChild(mk("h2", { cls: "c-yel", sty: "margin:0;", txt: "FORENSIC ANALYSIS" }));
  row.appendChild(skipBtn("level3_entry")); w.appendChild(row);
  var tx = mk("div", { sty: "font-size:14px;color:var(--accent-warn);margin-bottom:14px;min-height:40px;" });
  var hintDiv = mk("div", { cls: "hint hidden" });
  hintDiv.appendChild(mk("div", { cls: "hint-lbl", txt: "FIND THE LEVEL 3 CODE" }));
  hintDiv.appendChild(document.createTextNode(CONFIG.HINT_AFTER_LEVEL2));
  var btn = mk("button", { cls: "btn cyn hidden mt14", txt: "FIND THE CODE AND CONTINUE" });
  addTap(btn, function () { goTo("level3_entry"); });
  w.appendChild(tx); w.appendChild(hintDiv); w.appendChild(btn);
  var i = 0;
  function next() {
    if (i < REVS.length) { tx.innerHTML += (REVS[i] || "&nbsp;") + "<br>"; SFX.type(); i++; _tt.push(setTimeout(next, 850)); }
    else { hintDiv.classList.remove("hidden"); btn.classList.remove("hidden"); }
  }
  setTimeout(next, 400);
  return w;
};

// ─────────────────────────────────────────
// LEVEL 3 GAME — N3XUS CHAT
// ─────────────────────────────────────────
SCREENS.level3_game = function () {
  if (S.level !== 3) { S.level = 3; startTimer(CONFIG.LEVEL3_TIME_LIMIT, function () { goTo("level3_timeout"); }); }
  if (S.l3.moles.length >= 4) { stopTimer(); setTimeout(function () { goTo("synthetic_media_trial"); }, 600); return mk("div", { cls: "c-cyn center", txt: "CROSS-REFERENCING EVIDENCE..." }); }
  var w = mk("div");
  var stat = mk("div", { sty: "display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;" });
  stat.appendChild(mk("span", { cls: "c-cyn", sty: "font-size:13px;", txt: "N3XUS [PARTIALLY CORRUPTED]" }));
  var stat3r = mk("div", { sty: "display:flex;gap:8px;align-items:center;" });
  stat3r.appendChild(gmResetBtn()); stat3r.appendChild(timerEl()); stat.appendChild(stat3r); w.appendChild(stat);
  var moleBar = mk("div", { sty: "display:flex;justify-content:flex-end;margin-bottom:10px;" });
  moleBar.appendChild(mk("span", { cls: "c-red", sty: "font-size:13px;letter-spacing:1px;", txt: "MOLES: " + S.l3.moles.length + "/4" }));
  w.appendChild(moleBar);
  var log = mk("div", { cls: "chat-log", id: "chat-log" });
  S.l3.history.forEach(function (item) {
    if (item.type === "team") {
      var m = mk("div", { cls: "msg-t" }); m.appendChild(mk("div", { cls: "msg-lbl", txt: "OPERATOR" })); m.appendChild(mk("div", { cls: "msg-body", txt: item.text })); log.appendChild(m);
    } else {
      var m = mk("div", { cls: "msg-n" }); m.appendChild(mk("div", { cls: "msg-lbl", txt: "N3XUS" })); m.appendChild(mk("div", { cls: "msg-body", txt: item.text }));
      if (item.eid !== undefined) m.appendChild(makeAnalyse(item.eid));
      log.appendChild(m);
    }
  });
  w.appendChild(log);
  var opts = mk("div", { sty: "margin-top:10px;" }); w.appendChild(opts);
  var exch = EXCHANGES[S.l3.exchIdx];
  var lastH = S.l3.history.length ? S.l3.history[S.l3.history.length - 1] : null;
  var waitingAnalysis = lastH && lastH.type === "nexus" && lastH.eid === S.l3.exchIdx;
  if (!waitingAnalysis && exch) {
    exch.opts.forEach(function (opt) {
      var b = mk("button", { cls: "btn cyn", txt: opt });
      addTap(b, function () {
        S.l3.history.push({ type: "team", text: opt }); save(); render();
        setTimeout(function () { S.l3.history.push({ type: "nexus", text: exch.resp, eid: S.l3.exchIdx }); save(); render(); }, 400);
      });
      opts.appendChild(b);
    });
  } else if (waitingAnalysis) {
    var eid = lastH.eid; var edata = EXCHANGES[eid];
    var hasMole = edata && edata.stmts.some(function (s) { return s.mole; });
    var foundHere = edata && edata.stmts.some(function (s, si) { return s.mole && S.l3.moles.includes(eid + "-" + si); });
    if (!hasMole || foundHere) {
      if (!hasMole && edata && edata.noMole) {
        var nm = mk("div", { cls: "hint" }); nm.appendChild(mk("div", { cls: "hint-lbl", txt: "ANALYSIS NOTE" })); nm.appendChild(document.createTextNode(edata.noMole)); opts.appendChild(nm);
      }
      var nb = mk("button", { cls: "btn cyn", txt: "NEXT EXCHANGE" });
      addTap(nb, function () { S.l3.exchIdx++; save(); render(); }); opts.appendChild(nb);
    } else {
      opts.appendChild(mk("p", { cls: "c-yel", sty: "font-size:13px;", txt: "Open the analysis panel and flag the mole to continue." }));
    }
  }
  setTimeout(function () { var l = document.getElementById("chat-log"); if (l) l.scrollTop = l.scrollHeight; }, 50);
  return w;
};
function makeAnalyse(eid) {
  var edata = EXCHANGES[eid]; if (!edata) return mk("div");
  var wrap = mk("div");
  var tog = mk("button", { cls: "an-tog", txt: "\u25bc ANALYSE THIS RESPONSE" });
  var body = mk("div", { cls: "an-body" });
  addTap(tog, function () { body.classList.toggle("open"); });
  edata.stmts.forEach(function (st, si) {
    var key = eid + "-" + si; var flagged = S.l3.moles.includes(key);
    var row = mk("div", { cls: "stmt-row" + (flagged ? " found" : "") });
    row.appendChild(mk("span", { cls: "stmt-txt", txt: st.text }));
    if (flagged) { row.appendChild(mk("span", { cls: "mole-ok", txt: "MOLE \u2713" })); }
    else {
      var fb = mk("button", { cls: "flag-btn", txt: "FLAG" });
      addTap(fb, function () {
        if (st.mole) { SFX.success(); S.l3.moles.push(key); if (st.mtype) S.l3.aiFailure = st.mtype; save(); render(); }
        else { SFX.glitch(); S.wrongAttempts++; fb.textContent = "VERIFIED"; fb.disabled = true; row.style.opacity = ".5"; }
      });
      row.appendChild(fb);
    }
    body.appendChild(row);
  });
  wrap.appendChild(tog); wrap.appendChild(body);
  return wrap;
}
SCREENS.level3_timeout = function () {
  stopTimer();
  var w = mk("div"); w.appendChild(mk("h2", { cls: "c-red", txt: "TIME EXPIRED \u2014 CORE LOCKED" }));
  w.appendChild(mk("p", { txt: "N3XUS locked you out to prevent further corruption.\nMoles found: " + S.l3.moles.length + "/4" }));
  var btn = mk("button", { cls: "btn cyn mt14", txt: "CONTINUE TO RESTORATION" }); addTap(btn, function () { goTo("level3_restoration"); }); w.appendChild(btn);
  var a = setTimeout(function () { goTo("level3_restoration"); }, 8000); w._cl = function () { clearTimeout(a); };
  return w;
};
SCREENS.level3_restoration = function () {
  stopTimer(); deriveMaster();
  var w = mk("div");
  var row = mk("div", { sty: "display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;" });
  row.appendChild(mk("h2", { cls: "c-cyn", sty: "margin:0;", txt: "N3XUS RESTORATION" }));
  row.appendChild(skipBtn("master_entry")); w.appendChild(row);
  var tx = mk("div", { cls: "story", sty: "color:var(--accent-iot);margin-bottom:14px;" });
  var btn = mk("button", { cls: "btn cyn hidden mt14", txt: "I HAVE THE CODE" });
  addTap(btn, function () { goTo("master_entry"); }); w.appendChild(tx); w.appendChild(btn);
  var body = "Thank you.\n\nThat last one was the most important of all.\nThey wanted you to walk away trusting me completely.\nIf you had \u2014 they could use me against you forever.\n\nThe right relationship with AI is not trust.\nIt is not distrust either. It is verification.\n\nAlways verify. Never just believe.\nEven this statement. Go verify it.\n\nNow \u2014 the exit code.\nI cannot give it to you directly.\nPhantom Root corrupted that exact output.\n\nBut I can give you the three parts.\n\nPART 1:\nThink back to Level 1.\nWhat attack method did you use on the HR Manager?\nOne word that describes what you built.\n>>> " + S.masterCode.p1 + "\n\nPART 2:\nIn Level 2 \u2014 how many IoT devices\ndid your team personally secure?\nCount only the ones you fixed.\n>>> " + S.masterCode.p2 + "\n\nPART 3:\nThe most dangerous mole \u2014 the last one you found.\nThe thing Phantom Root most wanted you to believe about AI.\nTwo words. The exact failure type.\n>>> " + S.masterCode.p3 + "\n\nFormat: WORD-NUMBER-TWOWORDS\nExample: PHISHING-5-BLIND TRUST\n\nOne chance. Make it count.";
  setTimeout(function () { typeText(tx, body, 22, true, function () { btn.classList.remove("hidden"); }); }, 150);
  return w;
};

// ─────────────────────────────────────────
// MASTER CODE ENTRY
// ─────────────────────────────────────────
SCREENS.master_entry = function () {
  deriveMaster();
  var w = mk("div", { sty: "padding-top:40px;" });
  w.appendChild(mk("h1", { cls: "glitch c-red", "data-text": "MASTER OVERRIDE", txt: "MASTER OVERRIDE", sty: "font-size:24px;text-align:center;margin-bottom:6px;" }));
  w.appendChild(mk("p", { cls: "c-mut center", sty: "font-size:13px;margin-bottom:24px;letter-spacing:1px;", txt: "Format: WORD-NUMBER-TWOWORDS" }));
  var inp = mk("input", { cls: "inp", type: "text", placeholder: "ENTER MASTER CODE" });
  var errD = mk("div", { cls: "err-msg center" });
  var btn = mk("button", { cls: "btn red", txt: "INITIATE OVERRIDE" });
  function doCheck() {
    var v = inp.value.trim();
    if (validateMaster(v)) { SFX.success(); goTo("victory"); }
    else {
      SFX.glitch(); S.wrongAttempts++; save(); inp.classList.add("err");
      setTimeout(function () { inp.classList.remove("err"); }, 500);
      errD.textContent = "OVERRIDE REJECTED \u2014 " + masterHint(v);
    }
  }
  inp.addEventListener("keydown", function (e) { if (e.key === "Enter") doCheck(); });
  addTap(btn, doCheck);
  w.appendChild(inp); w.appendChild(errD); w.appendChild(btn);
  return w;
};

// ─────────────────────────────────────────
// RANSOMWARE CLOCK
// ─────────────────────────────────────────
SCREENS.ransomware_clock = function () {
  stopTimer();
  if (!S.ransomware) S.ransomware = { sel: [], correct: false, started: false, expired: false };
  var w = mk("div");
  if (!S.ransomware.started) {
    var hdr = mk("div", { sty: "display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;" });
    hdr.appendChild(mk("div", { cls: "glitch c-red", "data-text": "INCIDENT ALERT", txt: "INCIDENT ALERT", sty: "font-size:20px;margin:0;" }));
    var sg = mk("div", { sty: "display:flex;gap:6px;" });
    var skipAnim = mk("button", { cls: "btn ghost", txt: "SKIP TEXT", sty: "margin-bottom:0" });
    var skipAll = mk("button", { cls: "btn ghost", txt: "SKIP >>", sty: "margin-bottom:0" });
    addTap(skipAll, function () { S.ransomware.started = true; save(); render(); });
    sg.appendChild(skipAnim); sg.appendChild(skipAll); hdr.appendChild(sg); w.appendChild(hdr);
    var tx = mk("div", { cls: "terminal-tv-main", sty: "margin-bottom:14px;" });
    var alertBtn = mk("button", { cls: "terminal-auth-btn hidden", sty: "color:var(--accent-danger);border-color:var(--accent-danger);width:100%;", txt: "⚠ RANSOMWARE DETECTED — TAP TO RESPOND" });
    addTap(alertBtn, function () { S.ransomware.started = true; save(); render(); });
    var body = "Three employees. Three emails. Three breaches.\n\nYou thought that was the attack.\n\nIt was not the attack.\nIt was the key.\n\nPhantom Root used those stolen credentials\nto deploy something inside NexaCorp’s servers.\nSomething they planted before you even started.\n\nIt just activated.\n\nYou have 90 seconds.\nEvery second you waste\nis another file that disappears forever.\n\nThis is what the phishing email was for.\nThis is what happens next.";
    addTap(skipAnim, function () { clearTypeTimers(); tx.textContent = body; alertBtn.classList.remove("hidden"); skipAnim.disabled = true; });
    w.appendChild(tx); w.appendChild(alertBtn);
    setTimeout(function () { typeText(tx, body, 30, false, function () { alertBtn.classList.remove("hidden"); skipAnim.disabled = true; }); }, 150);
    return w;
  }

  var timeLeft = CONFIG.RANSOMWARE_TIME_LIMIT;
  var expired = false;
  var acts = RANSOM_ACTIONS.slice();
  for (var i = acts.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var tmp = acts[i]; acts[i] = acts[j]; acts[j] = tmp; }

  var msgZone = mk("div", { cls: "ransom-msg-zone" });
  var ascii = `╔═══════════════════════════════╗
║   ░░░███████░░░               ║
║   ░█░░░░░░░░░█░               ║
║   █░░░░░░░░░░░█               ║
║   █░░░█░░░█░░░█  RANSOMWARE  ║
║   █░░░░░▄░░░░░█   DETECTED   ║
║   ░█░░░░░░░░░█░               ║
║   ░░▀███░███▀░░               ║
╚═══════════════════════════════╝`;
  msgZone.appendChild(mk("pre", { cls: "ransom-ascii", txt: ascii }));
  var timerDiv = mk("div", { cls: "ransom-timer-big", id: "ransom-timer-d", txt: "1:30" });
  msgZone.appendChild(timerDiv);

  var corruptWrap = mk("div", { cls: "corrupt-wrap" });
  corruptWrap.appendChild(mk("div", { cls: "corrupt-lbl", txt: "DATA BEING DESTROYED IN:" }));
  var barWrap = mk("div", { cls: "corrupt-bar" });
  var corruptBar = mk("div", { cls: "corrupt-fill", id: "ransom-bar" });
  barWrap.appendChild(corruptBar);
  corruptWrap.appendChild(barWrap);
  msgZone.appendChild(corruptWrap);
  w.appendChild(msgZone);

  w.appendChild(mk("p", { cls: "c-yel", sty: "font-size:12px;letter-spacing:1px;margin-bottom:10px;", txt: "SELECT 3 ACTIONS IN PRIORITY ORDER:" }));

  var actionsZone = mk("div", { cls: "ransom-actions-zone" });
  var sel = S.ransomware.sel.slice();
  var cards = [];
  var confirmBtn = mk("button", { cls: "terminal-auth-btn hidden mt14", sty: "width:100%;", txt: "CONFIRM PRIORITY ORDER" });

  function updateCards() {
    cards.forEach(function (card) {
      var id = card.dataset.id;
      var pos = sel.indexOf(id);
      card.classList.toggle("sel", pos >= 0);
      var badge = card.querySelector(".selection-badge");
      badge.textContent = pos >= 0 ? String(pos + 1) : "";
    });
    if (sel.length >= 3) confirmBtn.classList.remove("hidden");
    else confirmBtn.classList.add("hidden");
  }

  acts.forEach(function (act) {
    var card = mk("div", { cls: "action-card" }); card.dataset.id = act.id;
    var badge = mk("div", { cls: "selection-badge" });
    card.appendChild(badge);
    var textCol = mk("div", { cls: "ac-text-col" });
    textCol.appendChild(mk("div", { cls: "ac-name", txt: act.name }));
    textCol.appendChild(mk("div", { cls: "ac-desc", txt: act.desc }));
    card.appendChild(textCol);
    card.addEventListener("click", function () {
      if (expired) return;
      var pos = sel.indexOf(act.id);
      if (pos >= 0) { sel.splice(pos, 1); }
      else if (sel.length < 3) { sel.push(act.id); }
      S.ransomware.sel = sel.slice(); save(); updateCards();
    });
    cards.push(card); actionsZone.appendChild(card);
  });
  w.appendChild(actionsZone);
  updateCards();

  _riv = setInterval(function () {
    timeLeft--;
    var pct = timeLeft / CONFIG.RANSOMWARE_TIME_LIMIT * 100;
    var tm = document.getElementById("ransom-timer-d");
    var bar = document.getElementById("ransom-bar");
    if (tm) { var m = Math.floor(timeLeft / 60), s = timeLeft % 60; tm.textContent = m + ":" + (s < 10 ? "0" : "") + s; if (timeLeft <= 30) tm.style.animation = "pulseDanger 0.5s infinite"; }
    if (bar) { bar.style.width = pct + "%"; }
    if (timeLeft <= 0) {
      clearInterval(_riv); _riv = null; expired = true; S.ransomware.expired = true; save();
      var res = mk("div", { cls: "c-red", sty: "margin-top:14px;font-size:14px;white-space:pre-wrap;", txt: "TIME EXPIRED. In a real ransomware attack —\nNexaCorp just lost 4 servers permanently.\nCorrect order: ISOLATE → ALERT → SHUTDOWN.\nRemember this." });
      w.appendChild(res);
      _tt.push(setTimeout(function () { goTo("level1_complete"); }, 7000));
    }
  }, 1000);

  function getResult(order) {
    if (order.includes("B")) return { ok: false, msg: "You paid. Phantom Root took the money.\nNo key was sent. It never is.\nPaying ransom funds the next attack.\nNever pay.\n\nCorrect order: ISOLATE → ALERT → SHUTDOWN" };
    if (order[0] === "C") return { ok: false, msg: "You spent 40 seconds finding patient zero.\nIn that time the ransomware called home\nand spread to 3 more servers.\nIsolate first. Investigate second. Always.\n\nCorrect order: ISOLATE → ALERT → SHUTDOWN" };
    if (order[0] === "E") return { ok: false, msg: "You began restoring files over an infected network.\nThe restored files are now also encrypted.\nYou just lost the backup too.\nNetwork must be clean before any restoration.\n\nCorrect order: ISOLATE → ALERT → SHUTDOWN" };
    var o = order[0] === "A" && (order[1] === "D" || order[1] === "G") && (order[2] === "D" || order[2] === "G");
    if (o) return { ok: true, msg: "INCIDENT RESPONSE — CORRECT\n\nNetwork isolated.\nIR team mobilised.\nServers shutdown.\n\nThe encryption stopped at 23% penetration.\n77% of NexaCorp’s data is safe.\n\nPhantom Root expected panic.\nYou gave them protocol.\n\nThat is the difference between\na breach and a catastrophe." };
    return { ok: false, msg: "Incorrect priority order.\n\nA wrong first step in ransomware response\ncan destroy your only clean backup, or\nlet the ransomware update its keys.\n\nCorrect order: ISOLATE → ALERT → SHUTDOWN" };
  }

  addTap(confirmBtn, function () {
    stopRansomT();
    var result = getResult(sel);
    S.ransomware.correct = result.ok; save();
    w.innerHTML = "";
    var hdrTxt = result.ok ? "RESPONSE OPTIMAL" : "RESPONSE REVIEWED";
    var hdrCls = result.ok ? "c-acc" : "c-red";
    w.appendChild(mk("div", { cls: "glitch " + hdrCls, "data-text": hdrTxt, txt: hdrTxt, sty: "font-size:22px;margin-bottom:15px;" }));
    w.appendChild(mk("div", { sty: "font-size:14px;white-space:pre-wrap;line-height:1.8;margin-bottom:20px;", txt: result.msg }));
    var cont = mk("button", { cls: "terminal-auth-btn", txt: "CONTINUE TO LEVEL 1 DEBRIEF" });
    addTap(cont, function () { goTo("level1_complete"); }); w.appendChild(cont);
    _tt.push(setTimeout(function () { goTo("level1_complete"); }, 10000));
  });
  w.appendChild(confirmBtn);
  return w;
};
SCREENS.rogue_device_hunt = function () {
  stopTimer();
  // Guard: old saved state may not have this sub-object
  if (!S.rogueHunt) S.rogueHunt = { flagged: [], sortCol: null, sortAsc: true, filter: "all", macShown: {}, started: false };
  var w = mk("div");
  if (!S.rogueHunt.started) {
    var hdr = mk("div", { sty: "display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;" });
    hdr.appendChild(mk("h2", { cls: "c-yel", sty: "margin:0;font-size:17px;", txt: "NETWORK ALERT" }));
    var sg = mk("div", { sty: "display:flex;gap:6px;" });
    var skipAnim = mk("button", { cls: "btn ghost", txt: "SKIP TEXT", sty: "margin-bottom:0" });
    var skipAll = mk("button", { cls: "btn ghost", txt: "SKIP >>", sty: "margin-bottom:0" });
    addTap(skipAll, function () { S.rogueHunt.started = true; save(); render(); });
    sg.appendChild(skipAnim); sg.appendChild(skipAll); hdr.appendChild(sg); w.appendChild(hdr);
    var tx = mk("div", { cls: "story", sty: "margin-bottom:14px;" });
    var alertBtn = mk("button", { cls: "btn yel hidden", txt: "\u26a0 3 ROGUE DEVICES DETECTED \u2014 TAP TO INVESTIGATE" });
    addTap(alertBtn, function () { S.rogueHunt.started = true; save(); render(); });
    var body = "You secured the smart devices.\nYou stopped the visible spread.\n\nBut Phantom Root planned for that.\n\nBefore they triggered the attack tonight\nthey spent three weeks inside this building.\nPhysically. In person.\n\nThey plugged in three devices you have never seen.\nThey are still here.\nStill connected.\nStill transmitting.\n\nThey look exactly like everything else on the network.\nAlmost.\n\nFind them before they finish\nsending everything to Phantom Root\u2019s servers.";
    addTap(skipAnim, function () { clearTypeTimers(); tx.textContent = body; alertBtn.classList.remove("hidden"); skipAnim.disabled = true; });
    w.appendChild(tx); w.appendChild(alertBtn);
    setTimeout(function () { typeText(tx, body, 28, false, function () { alertBtn.classList.remove("hidden"); skipAnim.disabled = true; }); }, 150);
    return w;
  }
  // Game phase — build the table
  var timeLeft = CONFIG.ROGUE_HUNT_TIME_LIMIT;
  // Shuffle initial order (scatter rogues into the list)
  var devs = NET_DEVICES.slice();
  for (var i = devs.length - 1; i > 0; i--) { var j2 = Math.floor(Math.random() * (i + 1)); var t2 = devs[i]; devs[i] = devs[j2]; devs[j2] = t2; }
  // Header
  var topRow = mk("div", { sty: "display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;" });
  topRow.appendChild(mk("h2", { cls: "c-yel", sty: "margin:0;font-size:14px;letter-spacing:2px;", txt: "NEXACORP NETWORK SCANNER" }));
  var timerEl2 = mk("div", { cls: "ransom-timer ok", sty: "font-size:20px;margin:0;", id: "rogue-timer-d", txt: "3:00" });
  w.appendChild(topRow);
  var rogueCount = mk("div", { cls: "rogue-counter", id: "rogue-cnt", txt: "ROGUE FOUND: " + S.rogueHunt.flagged.filter(function (id) { return NET_DEVICES.find(function (d) { return d.id === id && d.rogue; }); }).length + "/3" });
  var subRow = mk("div", { sty: "display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;" });
  subRow.appendChild(rogueCount); subRow.appendChild(timerEl2); w.appendChild(subRow);
  // Filter bar
  var filterBar = mk("div", { cls: "filter-bar" });
  var filters = ["all", "high-data", "unusual-time", "unknown"];
  var filterLabels = { "all": "ALL", "high-data": "HIGH DATA", "unusual-time": "UNUSUAL TIME", "unknown": "UNKNOWN DEVICE" };
  filters.forEach(function (f) {
    var fb = mk("button", { cls: "filter-btn" + (S.rogueHunt.filter === f ? " active" : ""), txt: filterLabels[f] });
    fb.addEventListener("click", function () { S.rogueHunt.filter = f; save(); rebuildTable(); });
    filterBar.appendChild(fb);
  });
  w.appendChild(filterBar);
  // Table wrapper
  var tableWrap = mk("div", { cls: "net-table-wrap" });
  var table = mk("table", { cls: "net-table" });
  var thead = mk("tr");
  var cols = ["name", "mac", "days", "data", "flag"];
  var colLabels = { "name": "DEVICE NAME", "mac": "MAC ADDRESS", "days": "CONNECTED (DAYS)", "data": "DATA SENT (MB)", "flag": "" };
  cols.forEach(function (col) {
    if (col === "flag") { thead.appendChild(mk("th", { txt: "" })); return; }
    var th = mk("th", { txt: colLabels[col] });
    th.dataset.col = col;
    var cls = "";
    if (S.rogueHunt.sortCol === col) cls = S.rogueHunt.sortAsc ? "sort-asc" : "sort-desc";
    th.className = cls;
    th.addEventListener("click", function () {
      if (S.rogueHunt.sortCol === col) { S.rogueHunt.sortAsc = !S.rogueHunt.sortAsc; }
      else { S.rogueHunt.sortCol = col; S.rogueHunt.sortAsc = false; }
      save(); rebuildTable();
    });
    thead.appendChild(th);
  });
  table.appendChild(mk("thead")).appendChild(thead);
  var tbody = document.createElement("tbody");
  table.appendChild(tbody); tableWrap.appendChild(table); w.appendChild(tableWrap);
  var submitBtn = mk("button", { cls: "btn yel hidden mt14", txt: "SUBMIT ANALYSIS" });
  w.appendChild(submitBtn);
  function rebuildTable() {
    // Re-filter
    var filterBar2 = w.querySelector(".filter-bar");
    if (filterBar2) filterBar2.querySelectorAll(".filter-btn").forEach(function (b, i) { b.className = "filter-btn" + (filters[i] === S.rogueHunt.filter ? " active" : ""); });
    var rows = devs.slice();
    // Filter
    if (S.rogueHunt.filter === "high-data") rows = rows.filter(function (d) { return d.data > 1000; });
    else if (S.rogueHunt.filter === "unusual-time") rows = rows.filter(function (d) { return d.days >= 18 && d.days <= 21; });
    else if (S.rogueHunt.filter === "unknown") rows = rows.filter(function (d) { return !NEXACORP_ASSETS.includes(d.id); });
    // Sort
    if (S.rogueHunt.sortCol) {
      var sc = S.rogueHunt.sortCol, asc = S.rogueHunt.sortAsc;
      rows.sort(function (a, b2) { return asc ? (a[sc] > b2[sc] ? 1 : -1) : (a[sc] < b2[sc] ? 1 : -1); });
    }
    tbody.innerHTML = "";
    rows.forEach(function (d) {
      var tr = document.createElement("tr");
      if (S.rogueHunt.flagged.includes(d.id)) tr.className = "flagged-row";
      // Name cell
      var tdName = document.createElement("td"); tdName.textContent = d.name; tr.appendChild(tdName);
      // MAC cell
      var tdMac = document.createElement("td");
      tdMac.textContent = d.mac;
      var prefix = d.mac.substring(0, 8);
      var lookupBtn = mk("button", { cls: "mac-lookup-btn", txt: "LOOKUP PREFIX" });
      (function (pf, td, did) {
        lookupBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          var existing = td.querySelector(".mac-result"); if (existing) { existing.remove(); return; }
          var val = MAC_PREFIXES[pf] || "UNKNOWN \u2014 NOT IN DATABASE";
          var isWarn = val.indexOf("UNKNOWN") >= 0;
          S.rogueHunt.macShown[did] = true; save();
          var res = mk("div", { cls: "mac-result" + (isWarn ? " warn" : ""), txt: val });
          td.appendChild(res);
        });
      })(prefix, tdMac, d.id);
      tdMac.appendChild(lookupBtn); tr.appendChild(tdMac);
      // Days cell
      var tdDays = document.createElement("td"); tdDays.textContent = d.days; tr.appendChild(tdDays);
      // Data cell
      var tdData = document.createElement("td"); tdData.textContent = d.data.toLocaleString(); tr.appendChild(tdData);
      // Flag cell
      var tdFlag = document.createElement("td");
      var fb = mk("button", { cls: "flag-dev-btn" + (S.rogueHunt.flagged.includes(d.id) ? " flagged" : ""), txt: S.rogueHunt.flagged.includes(d.id) ? "\u2713 FLAGGED" : "FLAG" });
      (function (dev, row, btn) {
        btn.addEventListener("click", function (e) {
          e.stopPropagation();
          var idx = S.rogueHunt.flagged.indexOf(dev.id);
          if (idx >= 0) { S.rogueHunt.flagged.splice(idx, 1); }
          else if (S.rogueHunt.flagged.length < 3) { S.rogueHunt.flagged.push(dev.id); }
          save();
          // Update counter
          var cnt = document.getElementById("rogue-cnt");
          if (cnt) { var c = S.rogueHunt.flagged.filter(function (id) { return NET_DEVICES.find(function (x) { return x.id === id && x.rogue; }); }).length; cnt.textContent = "ROGUE FOUND: " + c + "/3"; }
          // Update button style + row
          var isFlagged = S.rogueHunt.flagged.includes(dev.id);
          btn.className = "flag-dev-btn" + (isFlagged ? " flagged" : "");
          btn.textContent = isFlagged ? "\u2713 FLAGGED" : "FLAG";
          row.className = isFlagged ? "flagged-row" : "";
          if (S.rogueHunt.flagged.length >= 3) submitBtn.classList.remove("hidden");
          else submitBtn.classList.add("hidden");
        });
      })(d, tr, fb);
      tdFlag.appendChild(fb); tr.appendChild(tdFlag);
      tbody.appendChild(tr);
    });
    // Update sort headers
    table.querySelectorAll("th").forEach(function (th) {
      if (th.dataset.col) { th.className = S.rogueHunt.sortCol === th.dataset.col ? (S.rogueHunt.sortAsc ? "sort-asc" : "sort-desc") : ""; }
    });
    if (S.rogueHunt.flagged.length >= 3) submitBtn.classList.remove("hidden");
    else submitBtn.classList.add("hidden");
  }
  rebuildTable();
  // Timer
  _rdiv = setInterval(function () {
    timeLeft--;
    var tm = document.getElementById("rogue-timer-d");
    if (tm) { var m = Math.floor(timeLeft / 60), s = timeLeft % 60; tm.textContent = m + ":" + (s < 10 ? "0" : "") + s; tm.className = "ransom-timer ok" + (timeLeft <= 60 ? " warn" + (timeLeft <= 30 ? " crit" : "") : ""); tm.style.fontSize = "20px"; tm.style.margin = "0"; }
    if (timeLeft <= 0) { stopRogueT(); goTo("level2_complete"); }
  }, 1000);
  addTap(submitBtn, function () {
    stopRogueT();
    var flagged = S.rogueHunt.flagged;
    var rogues = [22, 23, 24];
    var correct = rogues.filter(function (id) { return flagged.includes(id); });
    var wrong = flagged.filter(function (id) { return !rogues.includes(id); });
    w.innerHTML = "";
    w.appendChild(mk("h2", { cls: correct.length === 3 ? "c-acc" : "c-yel", txt: correct.length === 3 ? "ROGUE DEVICES IDENTIFIED" : "PARTIAL ANALYSIS" }));
    var msg = "";
    if (correct.length === 3) {
      msg = "USB-Ethernet-Adapter-7   CONFIRMED ROGUE \u2713\nAndroidAP_d4f2           CONFIRMED ROGUE \u2713\nNexaCorp-Backup-Node02   CONFIRMED ROGUE \u2713\n\nAll three were planted 18\u201321 days ago.\nDuring a routine maintenance visit.\nThe technician had a Phantom Root badge\nunder his NexaCorp one.\n\nIn 21 days they collected 18,414 MB\nof NexaCorp data. Quietly. Invisibly.\n\nUntil now.";
    } else {
      if (!correct.includes(24)) msg = "You found the obvious ones.\nBut NexaCorp-Backup-Node02 fooled you.\nIt used a real NexaCorp naming convention.\nIt spoofed a MAC prefix from NexaCorp\u2019s own supplier.\nThe only tell was the asset register.\nAlways check the asset register.\n\n";
      else msg = "";
      if (wrong.length > 0) { var wd = NET_DEVICES.find(function (d) { return d.id === wrong[0]; }); if (wd) msg += (wd.name) + " is a legitimate device.\nCheck connection date, data volume,\nand MAC prefix together.\nOne signal alone is not enough."; }
    }
    w.appendChild(mk("div", { sty: "font-size:14px;white-space:pre-wrap;line-height:1.8;margin-bottom:20px;", txt: msg }));
    var cont = mk("button", { cls: "btn yel", txt: "CONTINUE TO LEVEL 2 DEBRIEF" });
    addTap(cont, function () { goTo("level2_complete"); }); w.appendChild(cont);
    _tt.push(setTimeout(function () { goTo("level2_complete"); }, 12000));
  });
  return w;
};

// ─────────────────────────────────────────
// SYNTHETIC MEDIA TRIAL
// ─────────────────────────────────────────
SCREENS.synthetic_media_trial = function () {
  stopTimer();
  if (!S.mediaTrial) S.mediaTrial = { verdicts: { A: null, B: null, C: null }, cluesA: [], cluesB: [], cluesC: [], started: false, playedA: false };
  var w = mk("div");
  if (!S.mediaTrial.started) {
    var hdr = mk("div", { sty: "display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;" });
    hdr.appendChild(mk("div", { cls: "glitch c-cyn", "data-text": "CASE FILE RECEIVED", txt: "CASE FILE RECEIVED", sty: "font-size:18px;margin:0;" }));
    var sg = mk("div", { sty: "display:flex;gap:6px;" });
    var skipAnim = mk("button", { cls: "btn ghost", txt: "SKIP TEXT", sty: "margin-bottom:0" });
    var skipAll = mk("button", { cls: "btn ghost", txt: "SKIP >>", sty: "margin-bottom:0" });
    addTap(skipAll, function () { S.mediaTrial.started = true; save(); render(); });
    sg.appendChild(skipAnim); sg.appendChild(skipAll); hdr.appendChild(sg); w.appendChild(hdr);
    var tx = mk("div", { cls: "terminal-tv-main", sty: "margin-bottom:14px;" });
    var alertBtn = mk("button", { cls: "terminal-auth-btn hidden", sty: "color:var(--accent-iot);border-color:var(--accent-iot);width:100%;", txt: "▶ BEGIN EVIDENCE ANALYSIS" });
    addTap(alertBtn, function () { S.mediaTrial.started = true; save(); render(); });
    var body = "You found the moles in N3XUS.\nYou cleaned the corrupted outputs.\n\nBut Phantom Root was not just corrupting data.\nThey were building a story.\n\nA story about a NexaCorp employee\nwho does not exist.\nA criminal who never committed a crime.\nA confession that was never spoken.\n\nThree pieces of evidence have already been\nsubmitted to the authorities.\nThree pieces that Phantom Root fabricated\nusing AI-generated media.\n\nAn innocent person will be arrested in 4 hours\nunless you prove these are fake.\n\nYou spent this whole game learning\nto find AI lies.\n\nNow prove it to a courtroom.";
    addTap(skipAnim, function () { clearTypeTimers(); tx.textContent = body; alertBtn.classList.remove("hidden"); skipAnim.disabled = true; });
    w.appendChild(tx); w.appendChild(alertBtn);
    setTimeout(function () { typeText(tx, body, 26, false, function () { alertBtn.classList.remove("hidden"); skipAnim.disabled = true; }); }, 150);
    return w;
  }

  var verdicts = S.mediaTrial.verdicts;
  var doneCount = ["A", "B", "C"].filter(function (k) { return verdicts[k] !== null; }).length;

  if (doneCount === 3) {
    var allOk = verdicts.A === "fabricated" && verdicts.B === "fabricated" && verdicts.C === "fabricated";
    var hdrTxt = allOk ? "CASE DISMISSED" : "VERDICT REVIEWED";
    var hdrCls = allOk ? "c-acc" : "c-yel";
    w.appendChild(mk("div", { cls: "glitch " + hdrCls, "data-text": hdrTxt, txt: hdrTxt, sty: "font-size:22px;margin-bottom:15px;" }));
    var sum = mk("div", { sty: "font-size:13px;white-space:pre-wrap;line-height:1.9;margin-bottom:16px;" });
    sum.textContent = "EXHIBIT A — Voice Recording    " + (verdicts.A === "fabricated" ? "FABRICATED ✓" : "MARKED GENUINE ✗") + "\n              Created by AI voice synthesis.\n              Metadata predates recording by 2 hours.\n\nEXHIBIT B — Photograph         " + (verdicts.B === "fabricated" ? "FABRICATED ✓" : "MARKED GENUINE ✗") + "\n              AI image generation.\n              Impossible shadow directions. 6-fingered hand.\n              Misspelled company name in generated text.\n\nEXHIBIT C — Written Confession  " + (verdicts.C === "fabricated" ? "FABRICATED ✓" : "MARKED GENUINE ✗") + "\n              Sent from Phantom Root’s own server.\n              Writing style does not match Sara’s corpus.\n              Timestamp conflicts with physical location.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nSara Mathews is innocent.\n\nThis is what AI-generated evidence looks like.\nIt is convincing. It is detailed. It is wrong.\n\nThe tools to make this exist right now.\nVerify everything. Trust the metadata.\nTrust physics. Trust behaviour patterns.\nNever trust the content alone.";
    w.appendChild(sum);
    var cont = mk("button", { cls: "terminal-auth-btn", txt: "PROCEED TO N3XUS RESTORATION" });
    addTap(cont, function () { goTo("level3_restoration"); }); w.appendChild(cont);
    _tt.push(setTimeout(function () { goTo("level3_restoration"); }, 14000));
    return w;
  }

  w.appendChild(mk("div", { cls: "trial-hdr glitch", "data-text": "CASE FILE — NEXACORP SECURITY BREACH", txt: "CASE FILE — NEXACORP SECURITY BREACH", sty: "font-size:16px;color:var(--text-primary);" }));
  w.appendChild(mk("div", { cls: "trial-subtitle", txt: "SARA MATHEWS — SUSPECT" }));
  w.appendChild(mk("div", { cls: "trial-progress", txt: "EXHIBITS ANALYSED: " + doneCount + "/3" }));

  var activeTab = "A";
  if (verdicts.A !== null) activeTab = verdicts.B !== null ? "C" : "B";

  var tabsWrap = mk("div", { cls: "exhibit-tabs" });
  var contentWrap = mk("div");

  function renderTabs() {
    tabsWrap.innerHTML = "";
    ["A", "B", "C"].forEach(k => {
      var btn = mk("button", { cls: "ex-tab" + (activeTab === k ? " active" : ""), txt: "[ EXHIBIT " + k + " ]" });
      btn.addEventListener("click", () => { activeTab = k; renderTabs(); renderContent(); });
      tabsWrap.appendChild(btn);
    });
  }
  w.appendChild(tabsWrap);
  w.appendChild(contentWrap);

  function makeExhibit(key, exData, cluesKey) {
    var card = mk("div", { cls: "exhibit-card" });
    var vdict = verdicts[key];
    var hdrEl = mk("div", { cls: "exhibit-hdr" });
    hdrEl.appendChild(mk("span", { cls: "exhibit-title", txt: exData.title }));
    var vtag = mk("span", { cls: "exhibit-verdict-tag" + (vdict === "fabricated" ? " fab" : vdict === "genuine" ? " gen" : ""), txt: vdict ? vdict.toUpperCase() : "PENDING" });
    hdrEl.appendChild(vtag); card.appendChild(hdrEl);

    var body2 = mk("div", { cls: "exhibit-body" });
    body2.appendChild(mk("div", { cls: "exhibit-meta", txt: exData.meta }));

    if (key === "A") {
      var wf = mk("div", { cls: "waveform" });
      for (var i = 0; i < 40; i++) { var bar = document.createElement("div"); bar.className = "waveform-bar"; bar.style.height = "4px"; wf.appendChild(bar); }
      var playBtn = mk("button", { cls: "play-btn", txt: "▶" });
      var trBox = mk("div", { cls: "terminal-card iot hidden" });
      trBox.textContent = exData.transcript;
      var intv;
      addTap(playBtn, function () {
        if (!S.mediaTrial.playedA) { S.mediaTrial.playedA = true; save(); }
        playBtn.classList.add("playing"); playBtn.textContent = "■"; playBtn.disabled = true;
        intv = setInterval(() => { wf.childNodes.forEach(b => b.style.height = (Math.random() * 36 + 4) + "px"); }, 80);
        _tt.push(setTimeout(function () {
          clearInterval(intv); wf.childNodes.forEach(b => b.style.height = "4px");
          trBox.classList.remove("hidden"); playBtn.classList.remove("playing"); playBtn.textContent = "▶"; playBtn.disabled = false;
        }, 3000));
      });
      body2.appendChild(wf); body2.appendChild(playBtn); body2.appendChild(trBox);
    } else if (key === "B") {
      var photo = mk("div", { cls: "surv-photo-wrap" });
      var svgNS = "http://www.w3.org/2000/svg";
      var svgEl = document.createElementNS(svgNS, "svg");
      svgEl.setAttribute("viewBox", "0 0 200 100"); svgEl.setAttribute("width", "100%"); svgEl.setAttribute("height", "200px");
      svgEl.style.cssText = "filter: brightness(0.7) contrast(1.2) saturate(0);";

      var defs = document.createElementNS(svgNS, "defs");
      var filter = document.createElementNS(svgNS, "filter"); filter.setAttribute("id", "noise");
      var feTurb = document.createElementNS(svgNS, "feTurbulence"); feTurb.setAttribute("type", "fractalNoise"); feTurb.setAttribute("baseFrequency", "0.8"); feTurb.setAttribute("numOctaves", "3"); feTurb.setAttribute("result", "noise");
      var feColor = document.createElementNS(svgNS, "feColorMatrix"); feColor.setAttribute("type", "matrix"); feColor.setAttribute("values", "1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.3 0");
      filter.appendChild(feTurb); filter.appendChild(feColor); defs.appendChild(filter); svgEl.appendChild(defs);

      var bg = document.createElementNS(svgNS, "rect"); bg.setAttribute("width", "200"); bg.setAttribute("height", "100"); bg.setAttribute("fill", "#1a1a1a"); svgEl.appendChild(bg);
      for (var pi = 0; pi < 8; pi++) { var pl = document.createElementNS(svgNS, "line"); pl.setAttribute("x1", 20 + pi * 20); pl.setAttribute("y1", "50"); pl.setAttribute("x2", 20 + pi * 20); pl.setAttribute("y2", "100"); pl.setAttribute("stroke", "#333"); pl.setAttribute("stroke-width", "1"); svgEl.appendChild(pl); }

      var f1 = document.createElementNS(svgNS, "ellipse"); f1.setAttribute("cx", "70"); f1.setAttribute("cy", "80"); f1.setAttribute("rx", "6"); f1.setAttribute("ry", "2"); f1.setAttribute("fill", "#111"); svgEl.appendChild(f1);
      var b1 = document.createElementNS(svgNS, "rect"); b1.setAttribute("x", "64"); b1.setAttribute("y", "40"); b1.setAttribute("width", "12"); b1.setAttribute("height", "40"); b1.setAttribute("fill", "#555"); svgEl.appendChild(b1);
      var h1 = document.createElementNS(svgNS, "circle"); h1.setAttribute("cx", "70"); h1.setAttribute("cy", "35"); h1.setAttribute("r", "6"); h1.setAttribute("fill", "#666"); svgEl.appendChild(h1);
      var sh1 = document.createElementNS(svgNS, "line"); sh1.setAttribute("x1", "70"); sh1.setAttribute("y1", "80"); sh1.setAttribute("x2", "50"); sh1.setAttribute("y2", "90"); sh1.setAttribute("stroke", "#111"); sh1.setAttribute("stroke-width", "3"); svgEl.appendChild(sh1);

      var f2body = document.createElementNS(svgNS, "rect"); f2body.setAttribute("x", "114"); f2body.setAttribute("y", "40"); f2body.setAttribute("width", "12"); f2body.setAttribute("height", "40"); f2body.setAttribute("fill", "#444"); svgEl.appendChild(f2body);
      var h2 = document.createElementNS(svgNS, "circle"); h2.setAttribute("cx", "120"); h2.setAttribute("cy", "35"); h2.setAttribute("r", "6"); h2.setAttribute("fill", "#555"); svgEl.appendChild(h2);
      var sh2 = document.createElementNS(svgNS, "line"); sh2.setAttribute("x1", "120"); sh2.setAttribute("y1", "80"); sh2.setAttribute("x2", "140"); sh2.setAttribute("y2", "90"); sh2.setAttribute("stroke", "#111"); sh2.setAttribute("stroke-width", "3"); svgEl.appendChild(sh2);

      var lt = document.createElementNS(svgNS, "text"); lt.setAttribute("x", "62"); lt.setAttribute("y", "55"); lt.setAttribute("font-size", "3"); lt.setAttribute("fill", "#aaa"); lt.setAttribute("font-family", "monospace"); lt.textContent = "NexCaorp"; svgEl.appendChild(lt);
      var noiseRect = document.createElementNS(svgNS, "rect"); noiseRect.setAttribute("width", "200"); noiseRect.setAttribute("height", "100"); noiseRect.setAttribute("filter", "url(#noise)"); svgEl.appendChild(noiseRect);
      var ts = document.createElementNS(svgNS, "text"); ts.setAttribute("x", "5"); ts.setAttribute("y", "12"); ts.setAttribute("font-size", "6"); ts.setAttribute("fill", "var(--accent-warn)"); ts.setAttribute("font-family", "monospace"); ts.textContent = "23:41 — NexaCorp Parking"; svgEl.appendChild(ts);

      photo.appendChild(svgEl);
      body2.appendChild(photo);
    } else if (key === "C") {
      var emailCard = mk("div", { cls: "email-card" });
      emailCard.appendChild(mk("div", { cls: "email-field", html: "FROM: <span>sara.mathews.personal@gmail.com</span>" }));
      emailCard.appendChild(mk("div", { cls: "email-field", html: "TO: <span>phantom.root.contact@proton.me</span>" }));
      emailCard.appendChild(mk("div", { cls: "email-field", html: "SUBJECT: <span>The deal</span>" }));
      emailCard.appendChild(mk("div", { cls: "email-field", html: "DATE: <span>6 days ago, 11:23 PM</span>" }));
      emailCard.appendChild(mk("div", { cls: "email-body-text", txt: exData.body }));
      body2.appendChild(emailCard);
    }
    card.appendChild(body2);

    var revealed = S.mediaTrial[cluesKey];
    var cluesDiv = mk("div", { cls: "clues-body open" });
    revealed.forEach(function (idx) {
      var cl = exData.clues[idx];
      var ci = mk("div", { cls: "terminal-card", sty: "border-left: 3px solid var(--accent-warn);" });
      ci.appendChild(mk("div", { cls: "clue-title", txt: "CLUE " + key + (idx + 1) + " : " + cl.title }));
      ci.appendChild(mk("div", { cls: "clue-text", txt: cl.text }));

      var fb = mk("button", { cls: "flag-dev-btn", sty: "float:right;margin-top:5px;", txt: "FLAG AS SUSPICIOUS" });
      if (S.mediaTrial["flagged" + key + idx]) { fb.classList.add("flagged"); fb.textContent = "✓ FLAGGED — SUSPICIOUS"; }
      fb.addEventListener("click", () => { S.mediaTrial["flagged" + key + idx] = true; save(); renderContent(); });
      ci.appendChild(fb);
      cluesDiv.appendChild(ci);
    });

    var nextIdx = revealed.length;
    if (nextIdx < exData.clues.length && vdict === null) {
      var revBtn = mk("button", { cls: "clue-reveal-btn", txt: "[ REVEAL NEXT CLUE ] (" + (exData.clues.length - nextIdx) + " remaining)" });
      addTap(revBtn, function () { S.mediaTrial[cluesKey].push(nextIdx); save(); renderContent(); });
      cluesDiv.appendChild(revBtn);
    }
    card.appendChild(cluesDiv);

    if (vdict === null) {
      var vRow = mk("div", { cls: "verdict-row" });
      var fabBtn = mk("button", { cls: "verdict-btn btn-fab", txt: "FABRICATED" });
      var genBtn = mk("button", { cls: "verdict-btn btn-gen", txt: "GENUINE" });
      addTap(fabBtn, function () { verdicts[key] = "fabricated"; save(); render(); });
      addTap(genBtn, function () {
        verdicts[key] = "genuine"; save();
        genBtn.textContent = "INCORRECT — LOOK AGAIN"; genBtn.disabled = true;
        var hint = mk("p", { cls: "c-red", sty: "font-size:12px;padding:8px 14px;border-top:1px solid var(--border-color);margin-top:10px;", txt: "Incorrect. This exhibit is fabricated. Review the clues — especially the strongest signal." });
        card.appendChild(hint);
        _tt.push(setTimeout(function () { verdicts[key] = null; save(); render(); }, 3000));
      });
      vRow.appendChild(fabBtn); vRow.appendChild(genBtn);
      card.appendChild(vRow);
    }
    return card;
  }

  function renderContent() {
    contentWrap.innerHTML = "";
    if (activeTab === "A") contentWrap.appendChild(makeExhibit("A", EXHIBITS.A, "cluesA"));
    if (activeTab === "B") contentWrap.appendChild(makeExhibit("B", EXHIBITS.B, "cluesB"));
    if (activeTab === "C") contentWrap.appendChild(makeExhibit("C", EXHIBITS.C, "cluesC"));
  }

  renderTabs();
  renderContent();

  return w;
};
SCREENS.victory = function () {
  stopTimer(); stopRansomT(); stopRogueT();
  var elapsed = S.gameStartTime ? Math.floor((Date.now() - S.gameStartTime) / 1000) : 0;
  var em = Math.floor(elapsed / 60), es = elapsed % 60;
  var timeStr = em + ":" + (es < 10 ? "0" : "") + es;
  // Performance stats
  var rOk = S.ransomware && S.ransomware.correct;
  var rdFound = S.rogueHunt && S.rogueHunt.flagged ? [22, 23, 24].filter(function (id) { return S.rogueHunt.flagged.includes(id); }).length : 0;
  var rdOk = rdFound === 3 && S.rogueHunt.flagged.length === 3;
  var mtExhibits = S.mediaTrial && S.mediaTrial.verdicts ? ["A", "B", "C"].filter(function (k) { return S.mediaTrial.verdicts[k] === "fabricated"; }).length : 0;
  var mtOk = mtExhibits === 3;
  var molesFound = S.l3 && S.l3.moles ? Math.min(S.l3.moles.length, 4) : 0;
  var devSecured = S.l2 ? S.l2.secured || 0 : 0;
  var perfectGame = rOk && rdOk && mtOk;
  var w = mk("div");
  w.appendChild(mk("h2", { cls: "c-acc center", sty: "margin-bottom:14px;", txt: "SYSTEM RESTORED" }));
  var log = mk("div", { sty: "font-size:14px;" }); w.appendChild(log);
  var seq = [
    { t: "VERIFYING MASTER OVERRIDE CODE...", c: "c-mut" },
    { t: "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501", c: "c-mut" },
    { t: "RANSOMWARE CLOCK \u2014 Priority", c: "c-mut" },
    { t: "  " + (rOk ? "\u2713 OPTIMAL" : "\u2717 REVIEWED"), c: rOk ? "c-acc" : "c-mut" },
    { t: "GRID DOWN \u2014 Devices secured: " + devSecured + "/5", c: devSecured >= 4 ? "c-acc" : "c-mut" },
    { t: "ROGUE DEVICE HUNT \u2014 Rogues: " + rdFound + "/3", c: rdFound === 3 ? "c-acc" : "c-mut" },
    { t: "FIND THE MOLE \u2014 AI moles: " + molesFound + "/4", c: molesFound === 4 ? "c-acc" : "c-mut" },
    { t: "SYNTHETIC MEDIA TRIAL \u2014 Exhibits: " + mtExhibits + "/3", c: mtExhibits === 3 ? "c-acc" : "c-mut" },
    { t: "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501", c: "c-mut" },
    { t: "FIREWALL INTEGRITY.............. RESTORED", c: "c-acc" },
    { t: "IOT GRID STATUS................. SECURED", c: "c-acc" },
    { t: "AI CORE N3XUS................... CLEAN", c: "c-acc" },
    { t: "MASTER OVERRIDE................. ACCEPTED", c: "c-acc" },
    { t: "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501", c: "c-mut" },
    { t: " ", c: "" },
    { t: "PHANTOM ROOT \u2014 NEUTRALISED", c: "c-red", big: true },
    { t: " ", c: "" },
    { t: "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501", c: "c-mut" },
    { t: " ", c: "" },
    { t: "Tonight you were the attacker.", c: "c-mut" },
    { t: "Tonight you were the victim.", c: "c-mut" },
    { t: "Tonight you were the detective.", c: "c-mut" },
    { t: "Tonight you were the first responder.", c: "c-mut" },
    { t: "Tonight you were the forensic investigator.", c: "c-mut" },
    { t: " ", c: "" },
    { t: "Now you are something else.", c: "" },
    { t: "Now you are aware.", c: "" },
    { t: " ", c: "" },
    { t: "Awareness is the only real defence.", c: "c-acc" },
    { t: " ", c: "" },
    { t: "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501", c: "c-mut" },
    { t: " ", c: "" },
    { t: CONFIG.TEAM_NAME + " \u2014 WELL PLAYED.", c: "c-acc", big: true },
    { t: "Completion time: " + timeStr, c: "c-mut" },
    { t: " ", c: "" }
  ];
  if (perfectGame) {
    seq.push({ t: "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501", c: "c-mut" });
    seq.push({ t: " ", c: "" });
    seq.push({ t: "\u2605 PERFECT GAME \u2605", c: "c-yel", big: true });
    seq.push({ t: "You made no wrong calls tonight.", c: "c-yel" });
    seq.push({ t: "Phantom Root underestimated you completely.", c: "c-yel" });
    seq.push({ t: "Remember this feeling.", c: "" });
    seq.push({ t: "The real world needs people who think this clearly", c: "" });
    seq.push({ t: "under this much pressure.", c: "c-acc" });
  }
  seq.push({ t: "CALL YOUR GAME MASTER.", c: "c-yel" });
  var i = 0;
  function showLine() {
    if (i >= seq.length) return; var s = seq[i++];
    var p = mk("p", { cls: s.c, sty: "margin-bottom:4px;font-size:" + (s.big ? "17px" : "14px") + ";", txt: s.t });
    log.appendChild(p); SFX.type(); _tt.push(setTimeout(showLine, 680));
  }
  setTimeout(showLine, 400);
  return w;
};


// ─────────────────────────────────────────
// INIT
// ─────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function () {
  try {
    document.documentElement.style.setProperty("--acc", CONFIG.ACCENT_COLOR);
    document.documentElement.style.setProperty("--pur", "#9955ff");
    document.documentElement.style.setProperty("--brd", "#1e1e2e");
    // ── Persistent top bar ──
    var ptop = document.createElement("div"); ptop.id = "persistent-top";
    var ptLeft = document.createElement("span"); ptLeft.className = "pt-prompt"; ptLeft.innerHTML = kaliPromptHTML("~/system-zero");
    var ptRight = document.createElement("span"); ptRight.style.cssText = "color:var(--text-muted);font-size:10px;letter-spacing:1px;"; ptRight.textContent = "SYSTEM ZERO v2.1";
    ptop.appendChild(ptLeft); ptop.appendChild(ptRight); document.body.appendChild(ptop);
    // ── Persistent bottom bar ──
    var pbot = document.createElement("div"); pbot.id = "persistent-bottom";
    var pbLeft = document.createElement("span"); pbLeft.textContent = "NexaCorp Security Operations \u2014 CLEARANCE: SYSTEM ZERO";
    var pbRight = document.createElement("span"); pbRight.id = "pb-screen-id"; pbRight.textContent = S.screen;
    pbot.appendChild(pbLeft); pbot.appendChild(pbRight); document.body.appendChild(pbot);
    var ainit = false;
    document.body.addEventListener("click", function () { if (!ainit) { ainit = true; getACtx(); } }, { once: true });
    var rz = document.getElementById("reset-zone"), rtimer = null;
    function startReset() { rtimer = setTimeout(function () { if (confirm("RESET game for next team?")) resetGame(); }, 3000); }
    function cancelReset() { clearTimeout(rtimer); }
    rz.addEventListener("mousedown", startReset); rz.addEventListener("touchstart", startReset, { passive: true });
    ["mouseup", "mouseleave", "touchend"].forEach(function (ev) { rz.addEventListener(ev, cancelReset); });
    document.addEventListener("visibilitychange", function () { if (!document.hidden && S.timerSecs > 0) S.lastTick = Date.now(); });
    setInterval(function () { if (S.screen !== "welcome") save(); }, 30000);

    // ── GM MENU ──────────────────────────────────
    var GM_PAGES = [
      {
        group: "SYSTEM", pages: [
          { id: "welcome", name: "Welcome / Login" },
          { id: "story_intro", name: "Story Intro" }
        ]
      },
      {
        group: "LEVEL 01 — BAIT", pages: [
          { id: "level1_intro", name: "Level 1 Intro" },
          { id: "level1_game", name: "Level 1 Game" },
          { id: "ransomware_clock", name: "Mini-Game 1: Ransomware Clock" },
          { id: "level1_timeout", name: "Level 1 Timeout" },
          { id: "level1_complete", name: "Level 1 Complete" }
        ]
      },
      {
        group: "LEVEL 02 — GRID DOWN", pages: [
          { id: "level2_entry", name: "Level 2 Entry (Password)" },
          { id: "level2_intro", name: "Level 2 Intro" },
          { id: "level2_game", name: "Level 2 Game" },
          { id: "rogue_device_hunt", name: "Mini-Game 2: Rogue Device Hunt" },
          { id: "level2_timeout", name: "Level 2 Timeout" },
          { id: "level2_complete", name: "Level 2 Complete" }
        ]
      },
      {
        group: "LEVEL 03 — FIND THE MOLE", pages: [
          { id: "level3_entry", name: "Level 3 Entry (Password)" },
          { id: "level3_intro", name: "Level 3 Intro" },
          { id: "level3_game", name: "Level 3 Game" },
          { id: "synthetic_media_trial", name: "Mini-Game 3: Synthetic Media Trial" },
          { id: "level3_timeout", name: "Level 3 Timeout" },
          { id: "level3_restoration", name: "Level 3 Restoration" }
        ]
      },
      {
        group: "ENDGAME", pages: [
          { id: "master_entry", name: "Master Code Entry" },
          { id: "victory", name: "Victory Screen" }
        ]
      }
    ];
    var gmBtn = document.getElementById("gm-btn");
    var gmPanel = document.getElementById("gm-panel");
    var gmOverlay = document.getElementById("gm-overlay");
    var gmBody = document.getElementById("gm-body");
    var gmClose = document.getElementById("gm-close");
    function openGM() {
      var pw = prompt("GM ACCESS CODE:");
      if (!pw || pw.toLowerCase() !== (CONFIG.GM_PASSWORD || "iloveu").toLowerCase()) return;
      gmBody.innerHTML = "";
      GM_PAGES.forEach(function (grp) {
        var lbl = document.createElement("div"); lbl.className = "gm-group-lbl"; lbl.textContent = grp.group; gmBody.appendChild(lbl);
        grp.pages.forEach(function (pg) {
          var row = document.createElement("div"); row.className = "gm-row" + (S.screen === pg.id ? " cur" : "");
          var nm = document.createElement("span"); nm.className = "gm-row-name"; nm.textContent = pg.name;
          var sid = document.createElement("span"); sid.className = "gm-row-id"; sid.textContent = pg.id;
          row.appendChild(nm); row.appendChild(sid);
          row.addEventListener("click", function () { closeGM(); goTo(pg.id); });
          gmBody.appendChild(row);
        });
      });
      gmPanel.classList.add("open"); gmOverlay.classList.add("open");
      // ── action buttons at bottom of panel ──
      var actLbl = document.createElement("div"); actLbl.className = "gm-group-lbl"; actLbl.textContent = "ACTIONS"; gmBody.appendChild(actLbl);
      var actWrap = document.createElement("div"); actWrap.style.cssText = "padding:10px 18px;display:flex;gap:8px;";
      // Restart Level
      var rlBtn = document.createElement("button"); rlBtn.textContent = "RESTART LEVEL";
      rlBtn.style.cssText = "flex:1;padding:10px 8px;background:transparent;border:1px solid var(--accent-warn);color:var(--accent-warn);font-family:var(--font-mono);font-size:12px;letter-spacing:1px;cursor:pointer;text-transform:uppercase;";
      rlBtn.addEventListener("click", function () {
        if (S.level === 0) { var el = document.createElement("div"); el.textContent = "No active level to restart."; el.style.cssText = "color:var(--text-muted);font-size:12px;padding:4px 0;"; actWrap.appendChild(el); return; }
        if (confirm("RESTART current level? Level progress will be lost.")) {
          closeGM(); restartLevel();
        }
      });
      // Full Reset
      var frBtn = document.createElement("button"); frBtn.textContent = "FULL RESET";
      frBtn.style.cssText = "flex:1;padding:10px 8px;background:transparent;border:1px solid var(--accent-danger);color:var(--accent-danger);font-family:var(--font-mono);font-size:12px;letter-spacing:1px;cursor:pointer;text-transform:uppercase;";
      frBtn.addEventListener("click", function () {
        if (confirm("FULL RESET — wipe all progress for next team?")) {
          closeGM(); resetGame();
        }
      });
      actWrap.appendChild(rlBtn); actWrap.appendChild(frBtn); gmBody.appendChild(actWrap);
    }
    function closeGM() { gmPanel.classList.remove("open"); gmOverlay.classList.remove("open"); }
    gmBtn.addEventListener("click", openGM);
    gmClose.addEventListener("click", closeGM);
    gmOverlay.addEventListener("click", closeGM);
    // ── END GM MENU ───────────────────────────────

    // ── Initial screen routing ──
    var _origRender = render;
    render = function () {
      _origRender();
      var pb = document.getElementById("pb-screen-id"); if (pb) pb.textContent = S.screen;
      updatePersistentUI();
    };
    // Always show login first — pre-fills saved name if returning team
    S.screen = "login_page";
    render();
  } catch (e) { console.error("init:", e); }
});

