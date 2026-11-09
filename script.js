// --- INITIAL SYSTEM SEED DATA PACKETS ---
const DEFAULT_POSTS = [
    { id: 1, title: "Opening of Classes SY 2026-2027", author: "Principal's Office", content: "Classes commence next Monday. Welcome back learners!" }
];

const DEFAULT_TREE = [
    { id: 10, category: "staff", tier: "tier-1", name: "Dr. Maria T. Soriano", role: "School Principal IV" },
    { id: 11, category: "staff", tier: "tier-2", name: "Mr. Ricardo E. Diaz", role: "SHS Track Coordinator" },
    { id: 12, category: "staff", tier: "tier-2", name: "Mrs. Elena M. Flores", role: "JHS Track Head" },
    { id: 13, category: "sslg", tier: "tier-1", name: "Juan Miguel D. Santos", role: "SSLG President" },
    { id: 14, category: "sslg", tier: "tier-2", name: "Princess Mae A. Alcantara", role: "SSLG Vice President" }
];

const DEFAULT_EVENTS = [
    { id: 20, title: "First Quarter Exam Week", date: "2026-11-20", category: "academic" },
    { id: 21, title: "Christmas Vacation Break", date: "2026-12-18", category: "holiday" }
];

let announcements = JSON.parse(localStorage.getItem("anvhs_posts")) || DEFAULT_POSTS;
let treeData = JSON.parse(localStorage.getItem("anvhs_tree")) || DEFAULT_TREE;
let schoolEvents = JSON.parse(localStorage.getItem("anvhs_events")) || DEFAULT_EVENTS;

let storedVision = localStorage.getItem("anvhs_v") || "To develop holistically developed Filipinos who love their country and contribute meaningfully to the nation.";
let storedMission = localStorage.getItem("anvhs_m") || "To provide quality, inclusive, and learner-centered education in a safe, motivating environment.";

document.addEventListener("DOMContentLoaded", () => {
    const studentView = document.getElementById("studentView");
    const adminDashboard = document.getElementById("adminDashboard");
    const loginModal = document.getElementById("loginModal");
    const publicHeader = document.getElementById("publicHeader");

    document.getElementById("displayVision").innerText = storedVision;
    document.getElementById("displayMission").innerText = storedMission;

    // --- CHART TREE RENDERER ENGINE ---
    function renderCharts() {
        const staffContainer = document.getElementById("orgTreeStaff");
        const sslgContainer = document.getElementById("orgTreeSslg");
        staffContainer.innerHTML = ""; sslgContainer.innerHTML = "";

        ["staff", "sslg"].forEach(cat => {
            const currentContainer = (cat === "staff") ? staffContainer : sslgContainer;
            ["tier-1", "tier-2", "tier-3"].forEach(tierLevel => {
                const elements = treeData.filter(n => n.category === cat && n.tier === tierLevel);
                if (elements.length > 0) {
                    const tierDiv = document.createElement("div");
                    tierDiv.className = `org-tier ${tierLevel}`;
                    tierDiv.innerHTML = elements.map(node => `
                        <div class="org-node ${node.tier === 'tier-1' ? 'leader' : 'coordinator'}" data-tree="${node.category}">
                            <h4>${node.name}</h4>
                            <span>${node.role}</span>
                        </div>
                    `).join('');
                    currentContainer.appendChild(tierDiv);
                }
            });
        });
    }

    // --- CALENDAR TRACKER GENERATOR ENGINE ---
    function renderCalendar() {
        const grid = document.getElementById("publicCalendarGrid");
        
        // Sort events chronologically by date
        schoolEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

        if(schoolEvents.length === 0) {
            grid.innerHTML = "<p style='grid-column: 1/-1; text-align:center; color:#666;'>No events scheduled yet.</p>";
            return;
        }

        grid.innerHTML = schoolEvents.map(ev => {
            const dateOptions = { month: 'long', day: 'numeric', year: 'numeric' };
            const formattedDate = new Date(ev.date).toLocaleDateString("en-US", dateOptions);
            return `
                <div class="calendar-item ${ev.category}">
                    <div class="calendar-date">${formattedDate}</div>
                    <h4>${ev.title}</h4>
                    <span class="calendar-type-tag">${ev.category}</span>
                </div>
            `;
        }).join('');
    }

    function drawCalendarLedger() {
        document.getElementById("adminCalendarLedgerBody").innerHTML = schoolEvents.map(ev => `
            <tr>
                <td><b>${ev.date}</b></td>
                <td>${ev.title}</td>
                <td><span style="text-transform:uppercase; font-size:0.75rem;">${ev.category}</span></td>
                <td><button class="btn-del" onclick="removeEvent(${ev.id})">Remove</button></td>
            </tr>
        `).join('');
    }

    window.removeEvent = (id) => {
        schoolEvents = schoolEvents.filter(ev => ev.id !== id);
        localStorage.setItem("anvhs_events", JSON.stringify(schoolEvents));
        drawCalendarLedger();
        renderCalendar();
    };

    // --- OTHER INTERFACE LEDGERS DRAWERS ---
    function drawPublicAnnouncements() {
        document.getElementById("announcement-list").innerHTML = announcements.map(p => `
            <div class="announcement-box">
                <div class="announcement-meta">Posted by: <b>${p.author}</b></div>
                <h3>${p.title}</h3>
                <p style="margin-top:0.5rem; color:#444;">${p.content}</p>
            </div>
        `).join('');
    }

    function drawAdminLedger() {
        document.getElementById("adminLedgerBody").innerHTML = announcements.map(p => `
            <tr>
                <td><b>${p.title}</b></td>
                <td>${p.author}</td>
                <td><button class="btn-del" onclick="removePost(${p.id})">Delete</button></td>
            </tr>
        `).join('');
    }

    function drawTreeLedger() {
        document.getElementById("adminTreeLedgerBody").innerHTML = treeData.map(n => `
            <tr>
                <td><span style="text-transform:uppercase; font-size:0.75rem; font-weight:bold;">${n.category}</span></td>
                <td><b>${n.name}</b></td>
                <td>${n.role}</td>
                <td><button class="btn-del" onclick="removeNode(${n.id})">Remove</button></td>
            </tr>
        `).join('');
    }

    window.removePost = (id) => {
        announcements = announcements.filter(p => p.id !== id);
        localStorage.setItem("anvhs_posts", JSON.stringify(announcements));
        drawAdminLedger();
        drawPublicAnnouncements();
    };

    window.removeNode = (id) => {
        treeData = treeData.filter(n => n.id !== id);
        localStorage.setItem("anvhs_tree", JSON.stringify(treeData));
        drawTreeLedger();
        renderCharts();
    };

    // --- TABS CONTROL SYSTEM INTERFACES ROUTING ---
    document.querySelectorAll(".menu-item").forEach(item => {
        item.addEventListener("click", () => {
            document.querySelectorAll(".menu-item").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".tab-panel").forEach(p => p.classList.add("hidden"));
            item.classList.add("active");
            document.getElementById(item.getAttribute("data-target")).classList.remove("hidden");
        });
    });

    document.querySelectorAll(".org-tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".org-tab-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const staffTree = document.getElementById("orgTreeStaff");
            const sslgTree = document.getElementById("orgTreeSslg");

            if(btn.getAttribute("data-org") === "staff") {
                // Instantly swap the visibility tags so the animation transitions from transparent
                sslgTree.classList.add("hidden");
                staffTree.classList.remove("hidden");
            } else {
                staffTree.classList.add("hidden");
                sslgTree.classList.remove("hidden");
            }
        });
    });

    // --- AUTH MODALS TRIGGERS HANDLING ---
    document.getElementById("adminNavBtn").addEventListener("click", () => {
        loginModal.style.display = "flex";
        document.getElementById("loginError").style.display = "none";
    });
    document.getElementById("closeLoginBtn").addEventListener("click", () => loginModal.style.display = "none");

    document.getElementById("submitLoginBtn").addEventListener("click", () => {
        if(document.getElementById("adminUser").value === "anvhs" && document.getElementById("adminPass").value === "admin") {
            loginModal.style.display = "none";
            studentView.classList.add("hidden");
            publicHeader.classList.add("hidden");
            adminDashboard.classList.remove("hidden");
            document.getElementById("editVision").value = storedVision;
            document.getElementById("editMission").value = storedMission;
            drawAdminLedger();
            drawTreeLedger();
            drawCalendarLedger();
        } else {
            document.getElementById("loginError").style.display = "block";
        }
    });

    document.getElementById("logoutBtn").addEventListener("click", () => {
        adminDashboard.classList.add("hidden");
        studentView.classList.remove("hidden");
        publicHeader.classList.remove("hidden");
        drawPublicAnnouncements();
        renderCharts();
        renderCalendar();
    });

    // --- SUBMISSION MUTATIONS OPERATIONS ---
    document.getElementById("saveTextBtn").addEventListener("click", () => {
        storedVision = document.getElementById("editVision").value;
        storedMission = document.getElementById("editMission").value;
        localStorage.setItem("anvhs_v", storedVision);
        localStorage.setItem("anvhs_m", storedMission);
        document.getElementById("displayVision").innerText = storedVision;
        document.getElementById("displayMission").innerText = storedMission;
	alert("Saved successfully!");
});
document.getElementById("addNodeBtn").addEventListener("click", () => {
const category = document.getElementById("nodeCategory").value;
const tier = document.getElementById("nodeTier").value;
const name = document.getElementById("nodeName").value;
const role = document.getElementById("nodeRole").value;
if (!name || !role) return alert("Fulfill all fields!");
treeData.push({ id: Date.now(), category, tier, name, role });
localStorage.setItem("anvhs_tree", JSON.stringify(treeData));
document.getElementById("nodeName").value = "";
document.getElementById("nodeRole").value = "";
drawTreeLedger();
renderCharts();
alert("Member node added successfully!");
});
document.getElementById("addEventBtn").addEventListener("click", () => {
const title = document.getElementById("eventTitle").value;
const date = document.getElementById("eventDate").value;
const category = document.getElementById("eventCategory").value;
if(!title || !date) return alert("Please specify an event title and execution date!");
schoolEvents.push({ id: Date.now(), title, date, category });
localStorage.setItem("anvhs_events", JSON.stringify(schoolEvents));
document.getElementById("eventTitle").value = "";
document.getElementById("eventDate").value = "";
drawCalendarLedger();
renderCalendar();
alert("Activity successfully scheduled on school calendar ledger!");
});
document.getElementById("submitPostBtn").addEventListener("click", () => {
const title = document.getElementById("postTitle").value;
const author = document.getElementById("postAuthor").value;
const content = document.getElementById("postContent").value;
if(!title || !author || !content) return alert("Fulfill all fields!");
announcements.unshift({ id: Date.now(), title, author, content });
localStorage.setItem("anvhs_posts", JSON.stringify(announcements));
document.getElementById("postTitle").value = "";
document.getElementById("postAuthor").value = "";
document.getElementById("postContent").value = "";
drawAdminLedger();
alert("Broadcast complete!");
});
// Run Initial Layout Passes Setup Configurations
renderCharts();
renderCalendar();
drawPublicAnnouncements();
});
// Feature: Search & Filter Announcements
const searchInput = document.getElementById("announcementSearch");
if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const boxes = document.querySelectorAll("#announcement-list .announcement-box");
        
        boxes.forEach(box => {
            const textContent = box.textContent.toLowerCase();
            if (textContent.includes(query)) {
                box.style.display = "block";
            } else {
                box.style.display = "none";
            }
        });
    });
}
    // --- LIVE CHAT ROUTING AND PERSISTENCE ENGINE ---
    const DEFAULT_CHAT = [
        { sender: "admin", text: "Welcome to ANVHS Support! How can we assist you today?", time: Date.now() }
    ];

    let chatMessages = JSON.parse(localStorage.getItem("anvhs_chat")) || DEFAULT_CHAT;

    const toggleChatBtn = document.getElementById("toggleChatBtn");
    const minimizeChatBtn = document.getElementById("minimizeChatBtn");
    const chatWindow = document.getElementById("chatWindow");
    const studentStream = document.getElementById("chatMessageStream");
    const adminStream = document.getElementById("adminChatMessageStream");
    
    // Toggle Public view chat drawer
    if (toggleChatBtn) toggleChatBtn.addEventListener("click", () => chatWindow.classList.toggle("hidden"));
    if (minimizeChatBtn) minimizeChatBtn.addEventListener("click", () => chatWindow.classList.add("hidden"));

    // Render engine function that feeds both views simultaneously
    function renderChatStreams() {
        const generateHTML = (msg) => {
            const isAdmin = msg.sender === "admin";
            const bg = isAdmin ? "var(--primary)" : "#e5e7e9";
            const color = isAdmin ? "white" : "var(--dark)";
            const align = isAdmin ? "flex-start" : "flex-end";
            const label = isAdmin ? "<b>Admin:</b> " : "<b>Student:</b> ";
            
            return `
                <div style="align-self: ${align}; background: ${bg}; color: ${color}; padding: 0.6rem 1rem; border-radius: 8px; max-width: 80%; word-break: break-word;">
                    ${label}${msg.text}
                </div>
            `;
        };

        const streamHTML = chatMessages.map(generateHTML).join('');
        if (studentStream) {
            studentStream.innerHTML = streamHTML;
            studentStream.scrollTop = studentStream.scrollHeight; // Auto scroll to newest anchor
        }
        if (adminStream) {
            adminStream.innerHTML = streamHTML;
            adminStream.scrollTop = adminStream.scrollHeight;
        }
    }

    // Handler: Student Message Dispatch
    document.getElementById("sendChatBtn")?.addEventListener("click", () => {
        const input = document.getElementById("chatInput");
        if (!input.value.trim()) return;
        
        chatMessages.push({ sender: "student", text: input.value.trim(), time: Date.now() });
        localStorage.setItem("anvhs_chat", JSON.stringify(chatMessages));
        input.value = "";
        renderChatStreams();
    });

    // Handler: Admin Message Dispatch
    document.getElementById("adminSendChatReplyBtn")?.addEventListener("click", () => {
        const input = document.getElementById("adminChatReplyInput");
        if (!input.value.trim()) return;
        
        chatMessages.push({ sender: "admin", text: input.value.trim(), time: Date.now() });
        localStorage.setItem("anvhs_chat", JSON.stringify(chatMessages));
        input.value = "";
        renderChatStreams();
    });

    // Handler: Maintenance Cleanup
    document.getElementById("clearChatBtn")?.addEventListener("click", () => {
        if(confirm("Are you sure you want to clear chat logs?")) {
            chatMessages = [...DEFAULT_CHAT];
            localStorage.setItem("anvhs_chat", JSON.stringify(chatMessages));
            renderChatStreams();
        }
    });

    // Handle instant layout setup execution
    renderChatStreams();
    
    // Auto-update streams every 3 seconds to pull in new replies live
    setInterval(renderChatStreams, 3000);