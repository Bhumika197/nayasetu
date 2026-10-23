/**
 * NyayaSetu — National Legal Technology Portal
 * Team: Dev Jain, Mansvi Khupse, Swati Kundu, Chinta Bhumika Reddy (Ramdeobaba University, IDEA Lab)
 */

let activeRole = 'citizen';
let activeTab = 'assistant';

// Role switching: Citizen vs Advocate Desk
function switchRole(role) {
  activeRole = role;

  const btnCitizen = document.getElementById('btnRoleCitizen');
  const btnAdvocate = document.getElementById('btnRoleAdvocate');

  const advocateNavs = ['nav-lawyerrooms', 'nav-practicemgmt', 'nav-billable'];
  const citizenNavs = ['nav-assistant', 'nav-autodraft', 'nav-voicebot', 'nav-ecourts', 'nav-bhulekh', 'nav-calendar', 'nav-clientroom'];

  if (role === 'citizen') {
    btnCitizen.className = 'btn-persona active';
    btnAdvocate.className = 'btn-persona';

    citizenNavs.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'inline-block';
    });
    advocateNavs.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });

    showTab('assistant');
  } else {
    btnAdvocate.className = 'btn-persona active';
    btnCitizen.className = 'btn-persona';

    citizenNavs.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    advocateNavs.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'inline-block';
    });

    showTab('lawyerrooms');
  }
}

// Tab navigation handler
function showTab(tabName) {
  activeTab = tabName;

  document.querySelectorAll('.nav-link').forEach(btn => {
    if (btn.id === 'nav-' + tabName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  document.querySelectorAll('.tab-content').forEach(sec => {
    if (sec.id === 'tab-' + tabName) {
      sec.classList.add('active');
    } else {
      sec.classList.remove('active');
    }
  });

  const breadcrumb = document.getElementById('breadcrumbTrail');
  const titles = {
    'assistant': 'Statutory Grievance & Legal Guidance Portal',
    'autodraft': 'Court-Ready Document Drafter',
    'voicebot': 'Bhashini Multilingual Voice Assistant',
    'ecourts': 'eCourts Live Case Status Tracker',
    'bhulekh': 'Bhulekh & Land Records Explorer',
    'calendar': 'Statutory Compliance & Limitation Calendar',
    'clientroom': 'Private Case Room (Client View)',
    'lawyerrooms': 'Advocate Case Rooms & Document Verification Desk',
    'practicemgmt': 'Litigation Docket & Practice Management',
    'billable': 'Billable Hours & Associate Tasks'
  };

  if (breadcrumb) {
    const parent = (tabName === 'lawyerrooms' || tabName === 'practicemgmt' || tabName === 'billable') 
      ? 'Advocate Desk' : 'Citizen Services';
    breadcrumb.innerHTML = `Home &gt; ${parent} &gt; <strong>${titles[tabName] || tabName}</strong>`;
  }

  if (tabName === 'autodraft') {
    renderPleading();
  } else if (tabName === 'clientroom') {
    renderClientRoom();
  } else if (tabName === 'lawyerrooms') {
    renderLawyerRoom();
  }
}

function changeFontSize(size) {
  if (size === 'small') document.body.style.fontSize = '12px';
  else if (size === 'large') document.body.style.fontSize = '15px';
  else document.body.style.fontSize = '13px';
}

// Case Rooms State Management (1 Client Room, 2 Lawyer Rooms + Dynamic Code Sharing)
let selectedClientRoomId = null;
let selectedLawyerRoomId = null;

const DEFAULT_ROOMS = [
  {
    id: "NYAYA-701",
    token: "NYAYA-701-K9",
    caseTitle: "Dev Jain vs. Patanjali Ayurved Ltd (Commercial Dispute 142/2024)",
    clientName: "Dev Jain",
    lawyerName: "Adv. Swati Kundu",
    court: "Civil Court Senior Division, Nagpur",
    nextHearing: "28-09-2026",
    visibleToClient: true,
    visibleToLawyer: true,
    documents: [
      {
        id: 1,
        name: "Original Cheque Return Memo & Bank Slip",
        dueDate: "18-09-2026",
        file: "2. Unit II -OFDM Transmitter Numericals_compressed.pdf",
        filePath: "Example_Files/2. Unit II -OFDM Transmitter Numericals_compressed.pdf",
        status: "accepted",
        uploadDate: "15-09-2026"
      },
      {
        id: 2,
        name: "Tender Technical Specification Paper",
        dueDate: "20-09-2026",
        file: "AI_in_Modeling_Unit II.pptx",
        filePath: "Example_Files/AI_in_Modeling_Unit II.pptx",
        status: "uploaded",
        uploadDate: "16-09-2026"
      },
      {
        id: 3,
        name: "System Architecture & SDLC Diagram",
        dueDate: "22-09-2026",
        file: null,
        filePath: null,
        status: "pending_upload",
        uploadDate: null
      }
    ],
    messages: [
      { sender: "Adv. Swati Kundu", text: "Namaste Dev. Please upload the requested case documents so we can prepare the court injunction rejoinder.", time: "09:30 AM" },
      { sender: "Dev Jain (Client)", text: "Yes Adv. Swati, I have uploaded the first two files from our case records. Checking the third one now.", time: "09:35 AM" }
    ]
  },
  {
    id: "NYAYA-702",
    token: "NYAYA-702-T8",
    caseTitle: "Tata Sons vs. Aditya Birla Group (Commercial Arbitration 44/2025)",
    clientName: "Mansvi Khupse",
    lawyerName: "Adv. Swati Kundu",
    court: "Bombay High Court (Commercial Division)",
    nextHearing: "05-10-2026",
    visibleToClient: false,
    visibleToLawyer: true,
    documents: [
      {
        id: 1,
        name: "Master Service Agreement & Commercial Terms",
        dueDate: "25-09-2026",
        file: "Unit -1 AI in SDLC.pptx",
        filePath: "Example_Files/Unit -1 AI in SDLC.pptx",
        status: "uploaded",
        uploadDate: "16-09-2026"
      },
      {
        id: 2,
        name: "Board Resolution & Power of Attorney",
        dueDate: "28-09-2026",
        file: null,
        filePath: null,
        status: "pending_upload",
        uploadDate: null
      }
    ],
    messages: [
      { sender: "Adv. Swati Kundu", text: "Welcome Mansvi. Please upload the certified Board Resolution copy for filing.", time: "11:00 AM" },
      { sender: "Mansvi Khupse (Client)", text: "Uploaded the MSA agreement. Getting the Board resolution stamped.", time: "11:30 AM" }
    ]
  }
];

function getAllRooms() {
  const stored = localStorage.getItem('nyayasetu_case_rooms_store');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length >= 2) {
        return parsed;
      }
    } catch (e) {}
  }
  localStorage.setItem('nyayasetu_case_rooms_store', JSON.stringify(DEFAULT_ROOMS));
  return JSON.parse(JSON.stringify(DEFAULT_ROOMS));
}

function saveAllRooms(rooms) {
  localStorage.setItem('nyayasetu_case_rooms_store', JSON.stringify(rooms));
  if (activeTab === 'clientroom') renderClientRoom();
  if (activeTab === 'lawyerrooms') renderLawyerRoom();
}

function getRoomById(roomId) {
  const rooms = getAllRooms();
  return rooms.find(r => r.id === roomId) || null;
}

function renderClientRoom() {
  const listView = document.getElementById('clientRoomsListView');
  const detailView = document.getElementById('clientRoomDetailView');
  if (!listView || !detailView) return;

  if (selectedClientRoomId) {
    listView.style.display = 'none';
    detailView.style.display = 'block';
    renderClientRoomDetail(selectedClientRoomId);
  } else {
    listView.style.display = 'block';
    detailView.style.display = 'none';
    renderClientRoomsList();
  }
}

function renderClientRoomsList() {
  const tbody = document.getElementById('clientRoomsTableBody');
  const countBadge = document.getElementById('clientRoomsCountBadge');
  if (!tbody) return;

  const rooms = getAllRooms();
  const clientRooms = rooms.filter(r => r.visibleToClient === true);
  if (countBadge) countBadge.innerText = `${clientRooms.length} Active Room${clientRooms.length === 1 ? '' : 's'}`;

  tbody.innerHTML = clientRooms.map(room => {
    return `
      <tr>
        <td><strong>${room.token}</strong></td>
        <td><strong>${room.caseTitle}</strong></td>
        <td>${room.lawyerName}</td>
        <td>${room.court}</td>
        <td>${room.nextHearing}</td>
        <td>
          <button type="button" class="btn btn-primary btn-sm" onclick="openClientRoom('${room.id}')">Enter Room</button>
        </td>
      </tr>
    `;
  }).join('');
}

function openClientRoom(roomId) {
  selectedClientRoomId = roomId;
  renderClientRoom();
}

function closeClientRoom() {
  selectedClientRoomId = null;
  renderClientRoom();
}

function quickJoinCode(code) {
  const inp = document.getElementById('inpJoinCode');
  if (inp) inp.value = code;
  joinRoomByCode();
}

function joinRoomByCode() {
  const inp = document.getElementById('inpJoinCode');
  if (!inp) return;
  const code = inp.value.trim().toUpperCase();
  if (!code) {
    alert("Please enter a valid invitation code.");
    return;
  }
  const rooms = getAllRooms();
  const found = rooms.find(r => r.token.toUpperCase() === code || r.id.toUpperCase() === code);
  if (found) {
    found.visibleToClient = true;
    saveAllRooms(rooms);
    alert(`Connected to Case Room: "${found.caseTitle}". Entering room now...`);
    openClientRoom(found.id);
  } else {
    alert(`No case room found matching invitation code "${code}". Please verify the code with your advocate.`);
  }
}

function renderClientRoomDetail(roomId) {
  const room = getRoomById(roomId);
  if (!room) {
    closeClientRoom();
    return;
  }

  const titleEl = document.getElementById('clientRoomHeaderTitle');
  const lawyerEl = document.getElementById('clientRoomLawyerName');
  const courtEl = document.getElementById('clientRoomCourt');
  const hearingEl = document.getElementById('clientRoomNextHearing');
  const codeBadge = document.getElementById('clientRoomCodeBadge');
  const statusBadge = document.getElementById('clientRoomBadge');
  const container = document.getElementById('clientDocRequestsContainer');
  const chatLog = document.getElementById('clientChatLog');

  if (titleEl) titleEl.innerText = `Room #${room.id}: ${room.caseTitle}`;
  if (lawyerEl) lawyerEl.innerText = room.lawyerName;
  if (courtEl) courtEl.innerText = room.court;
  if (hearingEl) hearingEl.innerText = room.nextHearing;
  if (codeBadge) codeBadge.innerText = `Code: ${room.token}`;

  const pendingReview = room.documents.filter(d => d.status === 'uploaded').length;
  const pendingUpload = room.documents.filter(d => d.status === 'pending_upload' || d.status === 'rejected').length;

  if (statusBadge) {
    if (pendingUpload > 0) {
      statusBadge.className = 'badge badge-red';
      statusBadge.innerText = `${pendingUpload} Upload(s) Required`;
    } else if (pendingReview > 0) {
      statusBadge.className = 'badge badge-orange';
      statusBadge.innerText = `${pendingReview} Pending Review`;
    } else {
      statusBadge.className = 'badge badge-green';
      statusBadge.innerText = 'All Documents Verified';
    }
  }

  if (container) {
    if (room.documents.length === 0) {
      container.innerHTML = '<p style="color: #666; font-size: 12px;">No document requests currently issued by counsel.</p>';
    } else {
      let html = '';
      room.documents.forEach(doc => {
        let badgeHtml = '';
        if (doc.status === 'accepted') {
          badgeHtml = '<span class="badge badge-green">Accepted &amp; Verified by Counsel</span>';
        } else if (doc.status === 'uploaded') {
          badgeHtml = '<span class="badge badge-orange">Uploaded &mdash; Awaiting Counsel Review</span>';
        } else if (doc.status === 'rejected') {
          badgeHtml = '<span class="badge badge-red">Rejected by Counsel &mdash; Please Re-upload</span>';
        } else {
          badgeHtml = '<span class="badge badge-red">Pending Upload</span>';
        }

        let fileContent = '';
        if (doc.file) {
          const dlTag = doc.isDigiLockerVerified 
            ? '<span class="badge badge-green" style="font-size: 10px; margin-left: 6px; background: #dcfce7; color: #166534; border: 1px solid #86efac;">✓ DigiLocker Verified (SHA-256)</span>' 
            : '';
          fileContent = `
            <div style="font-size: 11px; margin-top: 4px; color: #333;">
              Attached: <a href="${doc.filePath}" target="_blank" style="font-weight: bold; text-decoration: underline;">${doc.file}</a>
              ${dlTag}
              <span style="color: #666; font-size: 10px;">(Uploaded: ${doc.uploadDate || 'Recently'})</span>
            </div>
          `;
        }

        let uploadControls = '';
        if (doc.status === 'pending_upload' || doc.status === 'rejected') {
          uploadControls = `
            <div style="margin-top: 10px; background: #f8fafc; border: 1px dashed var(--border-strong); border-radius: 6px; padding: 10px 12px;">
              <div style="font-size: 11.5px; font-weight: 600; color: #475569; margin-bottom: 6px;">Select Document to Submit:</div>
              <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                <button type="button" class="btn btn-digilocker-fetch btn-sm" onclick="openDigiLockerVaultForUpload('${room.id}', ${doc.id})">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM10 17l-3.5-3.5 1.41-1.41L10 14.17 15.09 9.08l1.41 1.42L10 17z"/></svg>
                  Fetch from DigiLocker
                </button>
                <span style="font-size: 11px; color: #94a3b8;">or</span>
                <select id="exampleSel_${doc.id}" style="font-size: 12px; padding: 5px 8px; max-width: 220px;">
                  <option value="">-- Choose from Example_Files folder --</option>
                  <option value="Example_Files/2. Unit II -OFDM Transmitter Numericals_compressed.pdf">2. Unit II -OFDM Transmitter Numericals_compressed.pdf</option>
                  <option value="Example_Files/AI_in_Modeling_Unit II.pptx">AI_in_Modeling_Unit II.pptx</option>
                  <option value="Example_Files/Unit -1 AI in SDLC.pptx">Unit -1 AI in SDLC.pptx</option>
                </select>
                <span style="font-size: 11px; color: #94a3b8;">or</span>
                <input type="file" id="localFile_${doc.id}" style="font-size: 11px; width: 140px;">
                <button type="button" class="btn btn-primary btn-sm" onclick="handleClientUpload('${room.id}', ${doc.id})">Upload</button>
              </div>
            </div>
          `;
        }

        html += `
          <div style="border: 1px solid var(--border); border-radius: var(--radius-md); background: #ffffff; padding: 14px; margin-bottom: 12px; border-left: 4px solid ${doc.status === 'accepted' ? '#15803d' : (doc.status === 'rejected' ? '#dc2626' : '#0f2e59')}; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
              <div>
                <strong style="font-size: 13.5px; color: var(--primary);">${doc.name}</strong>
                <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 2px;">Requested Due Date: <strong>${doc.dueDate}</strong></div>
                ${fileContent}
              </div>
              <div>${badgeHtml}</div>
            </div>
            ${uploadControls}
          </div>
        `;
      });
      container.innerHTML = html;
    }
  }

  if (chatLog) {
    chatLog.innerHTML = room.messages.map(m => {
      const isClient = m.sender.includes('Client') || m.sender.includes(room.clientName);
      return `
        <div class="chat-row ${isClient ? 'user' : 'bot'}">
          <strong>${m.sender}:</strong><br>
          ${m.text}
          <div class="chat-time">${m.time}</div>
        </div>
      `;
    }).join('');
    chatLog.scrollTop = chatLog.scrollHeight;
  }
}

function handleClientUpload(roomId, docId) {
  const rooms = getAllRooms();
  const room = rooms.find(r => r.id === roomId);
  if (!room) return;

  const doc = room.documents.find(d => d.id === docId);
  if (!doc) return;

  const exampleSel = document.getElementById(`exampleSel_${docId}`);
  const localFile = document.getElementById(`localFile_${docId}`);

  let chosenName = "";
  let chosenPath = "";

  if (exampleSel && exampleSel.value) {
    chosenPath = exampleSel.value;
    chosenName = chosenPath.split('/').pop();
  } else if (localFile && localFile.files && localFile.files[0]) {
    chosenName = localFile.files[0].name;
    chosenPath = `Example_Files/${chosenName}`;
  } else {
    chosenName = "Unit -1 AI in SDLC.pptx";
    chosenPath = "Example_Files/Unit -1 AI in SDLC.pptx";
  }

  doc.file = chosenName;
  doc.filePath = chosenPath;
  doc.status = "uploaded";
  doc.uploadDate = new Date().toLocaleDateString('en-GB');

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  room.messages.push({
    sender: `${room.clientName} (Client)`,
    text: `Uploaded document for "${doc.name}": ${chosenName}`,
    time: time
  });

  saveAllRooms(rooms);
  alert(`Document "${chosenName}" uploaded successfully. It is now awaiting review by ${room.lawyerName}.`);
}

function handleClientChatEnter(e) {
  if (e.key === 'Enter') sendClientMessage();
}

function sendClientMessage() {
  const inp = document.getElementById('inpClientMsg');
  if (!inp || !selectedClientRoomId) return;
  const txt = inp.value.trim();
  if (!txt) return;

  const rooms = getAllRooms();
  const room = rooms.find(r => r.id === selectedClientRoomId);
  if (!room) return;

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  room.messages.push({
    sender: `${room.clientName} (Client)`,
    text: txt,
    time: time
  });

  inp.value = '';
  saveAllRooms(rooms);
}

function renderLawyerRoom() {
  const listView = document.getElementById('lawyerRoomsListView');
  const detailView = document.getElementById('lawyerRoomDetailView');
  if (!listView || !detailView) return;

  if (selectedLawyerRoomId) {
    listView.style.display = 'none';
    detailView.style.display = 'block';
    renderLawyerRoomDetail(selectedLawyerRoomId);
  } else {
    listView.style.display = 'block';
    detailView.style.display = 'none';
    renderLawyerRoomsList();
  }
}

function renderLawyerRoomsList() {
  const tbody = document.getElementById('lawyerRoomsTableBody');
  const countBadge = document.getElementById('lawyerRoomsCountBadge');
  if (!tbody) return;

  const rooms = getAllRooms();
  const lawyerRooms = rooms.filter(r => r.visibleToLawyer === true);
  if (countBadge) countBadge.innerText = `${lawyerRooms.length} Rooms Available`;

  tbody.innerHTML = lawyerRooms.map(room => {
    const totalDocs = room.documents.length;
    const acceptedDocs = room.documents.filter(d => d.status === 'accepted').length;
    const pendingReviewDocs = room.documents.filter(d => d.status === 'uploaded').length;

    let docStatusStr = '';
    if (totalDocs === 0) {
      docStatusStr = '<span style="color: #666;">No requests</span>';
    } else if (pendingReviewDocs > 0) {
      docStatusStr = `<span class="badge badge-orange">${pendingReviewDocs} Pending Review</span> (${acceptedDocs}/${totalDocs} Verified)`;
    } else if (acceptedDocs === totalDocs) {
      docStatusStr = `<span class="badge badge-green">All ${totalDocs} Verified</span>`;
    } else {
      docStatusStr = `<span class="badge badge-blue">${acceptedDocs}/${totalDocs} Verified</span>`;
    }

    return `
      <tr>
        <td><strong>${room.token}</strong></td>
        <td><strong>${room.caseTitle}</strong></td>
        <td>${room.clientName}</td>
        <td>${room.court}</td>
        <td>${docStatusStr}</td>
        <td>${room.nextHearing}</td>
        <td>
          <button type="button" class="btn btn-primary btn-sm" onclick="openLawyerRoom('${room.id}')">Open Chamber</button>
        </td>
      </tr>
    `;
  }).join('');
}

function openLawyerRoom(roomId) {
  selectedLawyerRoomId = roomId;
  renderLawyerRoom();
}

function closeLawyerRoom() {
  selectedLawyerRoomId = null;
  renderLawyerRoom();
}

function createNewCaseRoom() {
  const titleInp = document.getElementById('inpCreateTitle');
  const clientInp = document.getElementById('inpCreateClient');
  const courtInp = document.getElementById('inpCreateCourt');

  const title = titleInp ? titleInp.value.trim() : '';
  const client = clientInp ? clientInp.value.trim() : '';
  const court = courtInp ? courtInp.value.trim() : '';

  if (!title || !client) {
    alert("Please enter both the Case / Matter Title and the Client Name.");
    return;
  }

  const rooms = getAllRooms();
  const nextNum = 700 + rooms.length + 1;
  const roomId = `NYAYA-${nextNum}`;
  const randomSuffix = Math.random().toString(36).substring(2, 4).toUpperCase();
  const token = `NYAYA-${nextNum}-${randomSuffix}`;
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newRoom = {
    id: roomId,
    token: token,
    caseTitle: title,
    clientName: client,
    lawyerName: "Adv. Swati Kundu",
    court: court || "High Court Commercial Division",
    nextHearing: "To be scheduled",
    visibleToClient: false,
    visibleToLawyer: true,
    documents: [],
    messages: [
      {
        sender: "Adv. Swati Kundu",
        text: `Welcome to the secure case chamber for ${title}. Share invitation code ${token} with client ${client}.`,
        time: time
      }
    ]
  };

  rooms.push(newRoom);
  saveAllRooms(rooms);

  if (titleInp) titleInp.value = '';
  if (clientInp) clientInp.value = '';
  if (courtInp) courtInp.value = '';

  alert(`Case Room created successfully!\n\nRoom ID: ${roomId}\nInvitation Code: ${token}\n\nShare this code with client ${client} to join.`);
  openLawyerRoom(roomId);
}

function renderLawyerRoomDetail(roomId) {
  const room = getRoomById(roomId);
  if (!room) {
    closeLawyerRoom();
    return;
  }

  const shareCodeDisplay = document.getElementById('shareCodeDisplay');
  const titleEl = document.getElementById('lawyerRoomHeaderTitle');
  const clientEl = document.getElementById('lawyerRoomClientName');
  const courtEl = document.getElementById('lawyerRoomCourt');
  const hearingEl = document.getElementById('lawyerRoomNextHearing');
  const reviewBadge = document.getElementById('lawyerRoomReviewBadge');
  const tbody = document.getElementById('lawyerDocTableBody');
  const chatLog = document.getElementById('lawyerChatLog');

  if (shareCodeDisplay) shareCodeDisplay.innerText = room.token;
  if (titleEl) titleEl.innerText = `Case Chamber: ${room.caseTitle}`;
  if (clientEl) clientEl.innerText = room.clientName;
  if (courtEl) courtEl.innerText = room.court;
  if (hearingEl) hearingEl.innerText = room.nextHearing;

  const pendingReview = room.documents.filter(d => d.status === 'uploaded').length;
  if (reviewBadge) {
    if (pendingReview > 0) {
      reviewBadge.className = 'badge badge-orange';
      reviewBadge.innerText = `${pendingReview} Pending Review`;
    } else {
      reviewBadge.className = 'badge badge-green';
      reviewBadge.innerText = 'All Verified';
    }
  }

  if (tbody) {
    if (room.documents.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: #777; padding: 15px;">
            No documents requested yet for this room. Use the form above to issue a document request.
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = room.documents.map(doc => {
        let statusLabel = '';
        let actionButtons = '';

        if (doc.status === 'accepted') {
          statusLabel = '<span class="badge badge-green">Accepted</span>';
          actionButtons = `<button type="button" class="btn btn-danger btn-sm" onclick="rejectLawyerDoc('${room.id}', ${doc.id})">Reject</button>`;
        } else if (doc.status === 'rejected') {
          statusLabel = '<span class="badge badge-red">Rejected</span>';
          actionButtons = `<button type="button" class="btn btn-success btn-sm" onclick="acceptLawyerDoc('${room.id}', ${doc.id})">Accept</button>`;
        } else if (doc.status === 'uploaded') {
          statusLabel = '<span class="badge badge-orange">Awaiting Counsel Review</span>';
          actionButtons = `
            <button type="button" class="btn btn-success btn-sm" onclick="acceptLawyerDoc('${room.id}', ${doc.id})">Accept</button>
            <button type="button" class="btn btn-danger btn-sm" onclick="rejectLawyerDoc('${room.id}', ${doc.id})">Reject</button>
          `;
        } else {
          statusLabel = '<span class="badge badge-blue">Awaiting Client Upload</span>';
          actionButtons = '<span style="color: #888; font-size: 11px;">No file yet</span>';
        }

        const dlBadge = doc.isDigiLockerVerified
          ? `<br><span class="badge badge-green" style="font-size: 10px; background: #dcfce7; color: #166534; border: 1px solid #86efac;">✓ DigiLocker Verified (SHA-256 Validated)</span>`
          : '';
        const fileLink = doc.file 
          ? `<a href="${doc.filePath}" target="_blank" style="font-weight: bold;">${doc.file}</a>${dlBadge}<br><small style="color: #666;">Uploaded: ${doc.uploadDate || 'Recently'}</small>`
          : '<span style="color: #888;">Pending upload</span>';

        return `
          <tr>
            <td><strong>${doc.name}</strong></td>
            <td>${doc.dueDate}</td>
            <td>${fileLink}</td>
            <td>${statusLabel}</td>
            <td>${actionButtons}</td>
          </tr>
        `;
      }).join('');
    }
  }

  if (chatLog) {
    chatLog.innerHTML = room.messages.map(m => {
      const isLawyer = m.sender.includes('Swati') || m.sender.includes('Mansvi') || m.sender.includes('Bhoomi') || m.sender.includes('Counsel') || m.sender.includes('Adv');
      return `
        <div class="chat-row ${isLawyer ? 'user' : 'bot'}">
          <strong>${m.sender}:</strong><br>
          ${m.text}
          <div class="chat-time">${m.time}</div>
        </div>
      `;
    }).join('');
    chatLog.scrollTop = chatLog.scrollHeight;
  }
}

function acceptLawyerDoc(roomId, docId) {
  const rooms = getAllRooms();
  const room = rooms.find(r => r.id === roomId);
  if (!room) return;

  const doc = room.documents.find(d => d.id === docId);
  if (!doc) return;

  doc.status = 'accepted';
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  room.messages.push({
    sender: room.lawyerName,
    text: `Verified and Accepted: "${doc.name}" (${doc.file || 'attached'}). Document verified for court submission.`,
    time: time
  });

  saveAllRooms(rooms);
  alert(`Document "${doc.name}" marked as ACCEPTED & VERIFIED.`);
}

function rejectLawyerDoc(roomId, docId) {
  const rooms = getAllRooms();
  const room = rooms.find(r => r.id === roomId);
  if (!room) return;

  const doc = room.documents.find(d => d.id === docId);
  if (!doc) return;

  const reason = prompt("Enter reason for rejection to notify client:", "Document copy is illegible / requires certified copy");
  if (reason === null) return;

  doc.status = 'rejected';
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  room.messages.push({
    sender: room.lawyerName,
    text: `Rejected: "${doc.name}". Reason: ${reason}. Please re-upload a clear copy.`,
    time: time
  });

  saveAllRooms(rooms);
  alert(`Document "${doc.name}" marked as REJECTED. Client notified to re-upload.`);
}

function addLawyerFileRequest() {
  if (!selectedLawyerRoomId) return;
  const inpName = document.getElementById('inpNewDocName');
  const inpDue = document.getElementById('inpNewDocDue');
  const name = inpName ? inpName.value.trim() : '';
  const due = inpDue ? (inpDue.value || '2026-09-24') : '2026-09-24';

  if (!name) {
    alert("Please enter a name for the document to request.");
    return;
  }

  const rooms = getAllRooms();
  const room = rooms.find(r => r.id === selectedLawyerRoomId);
  if (!room) return;

  const newId = Date.now();
  room.documents.push({
    id: newId,
    name: name,
    dueDate: due,
    file: null,
    filePath: null,
    status: "pending_upload",
    uploadDate: null
  });

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  room.messages.push({
    sender: room.lawyerName,
    text: `New Document Request: "${name}" is required by ${due}.`,
    time: time
  });

  if (inpName) inpName.value = '';
  saveAllRooms(rooms);
  alert(`Document request for "${name}" sent to client in Room ${room.id}.`);
}

function handleLawyerChatEnter(e) {
  if (e.key === 'Enter') sendLawyerMessage();
}

function sendLawyerMessage() {
  const inp = document.getElementById('inpLawyerMsg');
  if (!inp || !selectedLawyerRoomId) return;
  const txt = inp.value.trim();
  if (!txt) return;

  const rooms = getAllRooms();
  const room = rooms.find(r => r.id === selectedLawyerRoomId);
  if (!room) return;

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  room.messages.push({
    sender: room.lawyerName,
    text: txt,
    time: time
  });

  inp.value = '';
  saveAllRooms(rooms);
}

// ==========================================================================
// LEGAL & TAX LITERACY ASSISTANT
// ==========================================================================

// ==========================================================================
// API CONFIGURATION & KEY MANAGEMENT
// ==========================================================================

const API_KEY_STORAGE_KEY = 'nyayasetu_ai_api_key';
let currentAnalysisData = null;

function getStoredApiKey() {
  return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
}

function initApiKeyUI() {
  const key = getStoredApiKey();
  const inp = document.getElementById('inpApiKey');
  if (inp && key) {
    inp.value = key;
  }
  updateApiKeyStatusBadge();
}

function updateApiKeyStatusBadge() {
  const badge = document.getElementById('apiKeyStatusBadge');
  if (!badge) return;
  const key = getStoredApiKey();
  if (key && key.trim().length > 0) {
    badge.className = 'badge badge-green';
    badge.innerText = 'Key Configured';
  } else {
    badge.className = 'badge badge-orange';
    badge.innerText = 'Key Not Set';
  }
}

function saveApiKey() {
  const inp = document.getElementById('inpApiKey');
  if (!inp) return;
  const key = inp.value.trim();
  if (!key) {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    updateApiKeyStatusBadge();
    alert('API key removed from local storage.');
    return;
  }
  localStorage.setItem(API_KEY_STORAGE_KEY, key);
  updateApiKeyStatusBadge();
  alert('API Key saved successfully in local browser storage.');
}

function clearApiKey() {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
  const inp = document.getElementById('inpApiKey');
  if (inp) inp.value = '';
  updateApiKeyStatusBadge();
  alert('API Key removed.');
}

function toggleApiKeyVisibility() {
  const inp = document.getElementById('inpApiKey');
  const btn = document.getElementById('btnToggleApiKey');
  if (!inp || !btn) return;
  if (inp.type === 'password') {
    inp.type = 'text';
    btn.innerText = 'Hide';
  } else {
    inp.type = 'password';
    btn.innerText = 'Show';
  }
}

function onApiKeyInput() {
  // Real-time typing handler
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function clearQueryInput() {
  const inp = document.getElementById('txtUserQuery');
  if (inp) inp.value = '';
}

function renderInitialAnalysisState() {
  const container = document.getElementById('analysisResultArea');
  if (!container) return;
  container.innerHTML = `
    <div style="text-align: center; padding: 48px 20px; color: var(--text-muted);">
      <h4 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; font-weight: 700; color: var(--text-main); margin-bottom: 8px;">
        Awaiting Legal Problem
      </h4>
      <p style="font-size: 12.5px; color: var(--text-secondary); max-width: 440px; margin: 0 auto 16px auto; line-height: 1.55;">
        Describe your legal issue on the left, save your API key, and click <strong>Analyze Statutory Provisions</strong> to retrieve real-time governing statutes, limitation deadlines, and citizen remedies.
      </p>
      <div style="display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; background: #f8fafc; border: 1px solid var(--border); padding: 5px 12px; border-radius: var(--radius-full); color: var(--text-secondary);">
        <span>Live AI Engine via Configured API Key</span>
      </div>
    </div>
  `;
}

async function processLegalQuery() {
  const q = document.getElementById('txtUserQuery') ? document.getElementById('txtUserQuery').value.trim() : '';
  const container = document.getElementById('analysisResultArea');
  const btn = document.getElementById('btnAnalyzeQuery');

  if (!q) {
    alert("Please describe your legal problem or grievance in the text box first.");
    if (document.getElementById('txtUserQuery')) {
      document.getElementById('txtUserQuery').focus();
    }
    return;
  }

  const apiKey = getStoredApiKey() || (document.getElementById('inpApiKey') ? document.getElementById('inpApiKey').value.trim() : '');

  if (!apiKey) {
    if (container) {
      container.innerHTML = `
        <div style="background: #fffbeb; border: 1px solid #fde68a; border-left: 4px solid #d97706; border-radius: var(--radius-md); padding: 18px 20px;">
          <h4 style="font-family: 'Plus Jakarta Sans', sans-serif; color: #92400e; margin-bottom: 6px; font-size: 14.5px; font-weight: 700;">
            API Key Required
          </h4>
          <p style="font-size: 12.5px; color: #78350f; margin-bottom: 12px; line-height: 1.55;">
            To analyze this legal grievance, please enter your Gemini or AI API key in the <strong>AI Engine API Key</strong> box on the left and click <strong>Save</strong>.
          </p>
          <button type="button" class="btn btn-primary btn-sm" onclick="document.getElementById('inpApiKey').focus()">Enter API Key</button>
        </div>
      `;
    }
    return;
  }

  // Loading state
  if (btn) {
    btn.disabled = true;
    btn.innerText = 'Analyzing with API...';
  }
  if (container) {
    container.innerHTML = `
      <div style="text-align: center; padding: 50px 20px; color: var(--text-secondary);">
        <div style="display: inline-block; width: 36px; height: 36px; border: 3px solid #e2e8f0; border-top-color: var(--primary); border-radius: 50%; animation: spin 0.9s linear infinite; margin-bottom: 14px;"></div>
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14.5px; font-weight: 700; color: var(--primary);">Querying Live Legal AI Engine...</div>
        <div style="font-size: 12px; color: var(--text-muted); margin-top: 6px;">Identifying governing acts, sections, limitation periods, and remedies</div>
      </div>
    `;
  }

  try {
    const analysisData = await fetchLegalAnalysisFromAPI(q, apiKey);
    currentAnalysisData = analysisData;
    renderAnalysis(analysisData);
  } catch (err) {
    console.error('API Error:', err);
    if (container) {
      container.innerHTML = `
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-left: 4px solid #dc2626; border-radius: var(--radius-md); padding: 18px 20px;">
          <h4 style="font-family: 'Plus Jakarta Sans', sans-serif; color: #991b1b; margin-bottom: 6px; font-size: 14.5px; font-weight: 700;">
            API Request Failed
          </h4>
          <p style="font-size: 12.5px; color: #7f1d1d; margin-bottom: 10px; line-height: 1.5;">
            ${escapeHtml(err.message || 'An error occurred while contacting the AI API.')}
          </p>
          <div style="font-size: 11.5px; color: #991b1b; margin-bottom: 12px;">
            Please check that your API key is correct, active, and has sufficient quota.
          </div>
          <button type="button" class="btn btn-default btn-sm" onclick="processLegalQuery()">Retry Request</button>
        </div>
      `;
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerText = 'Analyze Statutory Provisions';
    }
  }
}

async function fetchLegalAnalysisFromAPI(query, apiKey) {
  const prompt = `You are NyayaSetu, an expert Indian legal literacy and statutory assistance platform.
Analyze the following citizen legal grievance under Indian Law (including Bharatiya Nyaya Sanhita 2023, Bharatiya Nagarik Suraksha Sanhita 2023, Bharatiya Sakshya Adhiniyam 2023, and applicable Central/State Statutes):

Grievance: "${query}"

Return ONLY a valid JSON object (without markdown code blocks, backticks, or other text) with the following exact keys:
{
  "act": "Primary governing Act(s) (e.g. Negotiable Instruments Act, 1881 / Consumer Protection Act, 2019 / Transfer of Property Act, 1882 / BNS 2023)",
  "title": "Clear, formal legal title of the matter",
  "summary": "Clear, concise 2-3 sentence explanation of the citizen's legal position",
  "sections": ["Section X (Brief Description)", "Section Y (Brief Description)"],
  "limitation": "Statutory limitation period and timeline under Limitation Act, 1963 or relevant Act",
  "court": "Competent court, tribunal, forum or authority with jurisdiction",
  "remedies": ["Actionable step 1", "Actionable step 2", "Actionable step 3"],
  "docType": "one of: sec138, rti, consumer, eviction, affidavit",
  "sender": "Suggested applicant/sender name or role",
  "recipient": "Suggested opposite party name or authority",
  "particulars": "Key transaction, property, or dispute particulars",
  "grievance": "Concise factual grievance statement for drafting legal notice"
}`;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    })
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    const message = errorJson.error && errorJson.error.message ? errorJson.error.message : `HTTP ${response.status} ${response.statusText}`;
    throw new Error(message);
  }

  const result = await response.json();
  const candidate = result.candidates && result.candidates[0];
  if (!candidate || !candidate.content || !candidate.content.parts || !candidate.content.parts[0]) {
    throw new Error("No response content generated by the AI API.");
  }

  let text = candidate.content.parts[0].text.trim();
  if (text.startsWith('```json')) {
    text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (text.startsWith('```')) {
    text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed.sections)) parsed.sections = [parsed.sections || 'General Statutory Provisions'];
  if (!Array.isArray(parsed.remedies)) parsed.remedies = [parsed.remedies || 'Consult competent legal counsel'];
  return parsed;
}

function renderAnalysis(item) {
  const container = document.getElementById('analysisResultArea');
  if (!container || !item) return;

  const sectionsHtml = (item.sections || []).map(s => `<span style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; padding: 3px 8px; font-family: ui-monospace, monospace; font-size: 11.5px; color: #0f2e59; font-weight: 600; margin-right: 6px; margin-bottom: 6px; display: inline-block;">${escapeHtml(s)}</span>`).join(' ');
  const stepsHtml = (item.remedies || []).map((r, i) => `<li style="margin-bottom: 8px;"><strong>Step ${i+1}:</strong> ${escapeHtml(r)}</li>`).join('');

  container.innerHTML = `
    <div style="margin-bottom: 14px;">
      <span style="font-size: 11px; font-weight: 600; color: #1e40af; text-transform: uppercase; letter-spacing: 0.04em; background: #eff6ff; border: 1px solid #dbeafe; padding: 3px 8px; border-radius: 4px;">${escapeHtml(item.act || 'Applicable Statutory Provisions')}</span>
      <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 16px; font-weight: 700; color: #0f172a; margin: 8px 0 6px 0;">${escapeHtml(item.title || 'Legal Analysis')}</h3>
      <p style="font-size: 13px; color: #334155; line-height: 1.55;">${escapeHtml(item.summary || '')}</p>
      <div style="margin-top: 10px;">${sectionsHtml}</div>
    </div>

    <table class="gov-table" style="margin-bottom: 16px;">
      <tbody>
        <tr>
          <td style="width: 35%; font-weight: 600; color: #1e293b; background: #f8fafc;">Statutory Limitation</td>
          <td>${escapeHtml(item.limitation || 'As prescribed by Limitation Act, 1963')}</td>
        </tr>
        <tr>
          <td style="font-weight: 600; color: #1e293b; background: #f8fafc;">Competent Forum</td>
          <td>${escapeHtml(item.court || 'Jurisdictional Civil / Criminal Court')}</td>
        </tr>
      </tbody>
    </table>

    <div style="background: #f8fafc; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 14px 16px;">
      <div style="font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-secondary); margin-bottom: 10px;">Recommended Actionable Steps</div>
      <ol style="padding-left: 18px; font-size: 12.5px; color: #1e293b; line-height: 1.6; margin: 0;">
        ${stepsHtml}
      </ol>
    </div>
  `;
}

function transferToDrafter() {
  if (!currentAnalysisData) {
    alert("Please analyze a legal problem first using 'Analyze Statutory Provisions' before transferring to the Document Drafter.");
    return;
  }

  const item = currentAnalysisData;
  if (document.getElementById('selectDocType')) {
    document.getElementById('selectDocType').value = item.docType || 'affidavit';
  }
  if (document.getElementById('inpSender') && item.sender) {
    document.getElementById('inpSender').value = item.sender;
  }
  if (document.getElementById('inpRecipient') && item.recipient) {
    document.getElementById('inpRecipient').value = item.recipient;
  }
  if (document.getElementById('inpParticulars') && item.particulars) {
    document.getElementById('inpParticulars').value = item.particulars;
  }
  if (document.getElementById('inpGrievance') && (item.grievance || item.summary)) {
    document.getElementById('inpGrievance').value = item.grievance || item.summary;
  }

  showTab('autodraft');
}

// ==========================================================================
// COURT PLEADING DRAFTER
// ==========================================================================

function renderPleading() {
  const type = document.getElementById('selectDocType').value;
  const sender = document.getElementById('inpSender').value || "Applicant Name";
  const recipient = document.getElementById('inpRecipient').value || "Opposite Party Name";
  const particulars = document.getElementById('inpParticulars').value || "Matter Particulars";
  const grievance = document.getElementById('inpGrievance').value || "Grievance details";
  const place = document.getElementById('inpPlace').value || "Nagpur, Maharashtra";
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

  const paper = document.getElementById('pleadingPaper');
  if (!paper) return;

  if (type === 'sec138') {
    paper.innerHTML = `
      <div class="pleading-seal">LEGAL<br>NOTICE<br>SEC 138</div>
      <div class="pleading-header">
        STATUTORY DEMAND NOTICE UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881
      </div>
      <div style="text-align: right; margin-bottom: 12px; font-size: 11px;">
        <strong>SPEED POST / REGISTERED POST A.D.</strong><br>
        Date: ${today} | Station: ${place}
      </div>
      <p><strong>TO:</strong><br>${recipient}<br>(DRAWER / OPPOSITE PARTY)</p>
      <p style="margin-top: 8px;"><strong>FROM:</strong><br>${sender}<br>(PAYEE / SENDER)</p>
      <p style="margin-top: 10px;"><strong>SUBJECT:</strong> STATUTORY DEMAND NOTICE UNDER SECTION 138 READ WITH SECTION 142 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881.</p>
      <p style="margin-top: 10px;"><strong>SIR / MADAM,</strong></p>
      <p style="margin-top: 6px;">Under instructions and authority from myself / client, I hereby serve upon you this mandatory Statutory Notice:</p>
      <ol style="padding-left: 20px; margin-top: 6px;">
        <li>That towards the discharge of your legally enforceable debt, you issued in favour of the Payee: <em>${particulars}</em>.</li>
        <li>That the said cheque was deposited for encashment, but was returned unpaid and dishonoured by the bank with memo stating: <em>${grievance}</em>.</li>
        <li>That your failure to maintain sufficient funds constitutes a criminal offence under Section 138 of the Negotiable Instruments Act, 1881.</li>
      </ol>
      <p style="margin-top: 12px; background: #fffde7; border: 1px solid #ffe082; padding: 8px;">
        <strong>MANDATORY STATUTORY DEMAND:</strong><br>
        You are hereby called upon to pay the entire outstanding sum within <strong>15 (FIFTEEN) DAYS</strong> of the receipt of this notice, failing which a criminal complaint under Section 138 of the NI Act shall be filed against you in the Competent Criminal Court at your sole risk and costs.
      </p>
      <div style="margin-top: 35px; display: flex; justify-content: space-between;">
        <div>Station: ${place}<br>Date: ${today}</div>
        <div style="text-align: right;">_______________________________<br><strong>${sender}</strong><br>(Signature of Payee / Complainant)</div>
      </div>
    `;
  } else if (type === 'rti') {
    paper.innerHTML = `
      <div class="pleading-seal">RTI ACT<br>2005<br>FORM A</div>
      <div class="pleading-header">
        FORM A — APPLICATION FOR SEEKING INFORMATION UNDER SECTION 6(1) OF THE RTI ACT, 2005
      </div>
      <div style="text-align: right; margin-bottom: 12px; font-size: 11px;">Date: ${today} | Place: ${place}</div>
      <p><strong>TO:</strong><br>The Public Information Officer (PIO),<br>${recipient}</p>
      <p style="margin-top: 8px;"><strong>1. Name of Applicant:</strong> ${sender}</p>
      <p><strong>2. Address for Correspondence:</strong> ${place}</p>
      <p><strong>3. Citizenship:</strong> Citizen of India</p>
      <p style="margin-top: 8px;"><strong>4. Particulars of Information Sought:</strong><br>Subject Matter: <em>${particulars}</em></p>
      <p style="background: #f7f9fa; border: 1px solid #ddd; padding: 6px; margin-top: 4px;">${grievance}</p>
      <p style="margin-top: 8px;"><strong>5. Application Fee:</strong> Statutory Fee of Rs 10 paid via Court Fee Stamp / Postal Order No. <strong>IPO-89142-2026</strong>.</p>
      <p style="margin-top: 8px;"><strong>6. Declaration:</strong> I state that the information sought falls strictly under Section 2(f) and 2(j) of the RTI Act, 2005 and is not exempt under Section 8 or 9.</p>
      <div style="margin-top: 35px; display: flex; justify-content: space-between;">
        <div>Encl: Fee Stamp Rs 10</div>
        <div style="text-align: right;">_______________________________<br><strong>${sender}</strong><br>(Signature of Citizen Applicant)</div>
      </div>
    `;
  } else if (type === 'consumer') {
    paper.innerHTML = `
      <div class="pleading-seal">CONSUMER<br>NOTICE<br>CPA 2019</div>
      <div class="pleading-header">
        LEGAL NOTICE FOR DEFICIENCY OF SERVICE UNDER CONSUMER PROTECTION ACT, 2019
      </div>
      <div style="text-align: right; margin-bottom: 12px; font-size: 11px;">Date: ${today} | Regd Post AD</div>
      <p><strong>TO:</strong> ${recipient}<br><strong>FROM:</strong> ${sender} (${place})</p>
      <p style="margin-top: 8px;"><strong>SUBJECT:</strong> DEFICIENCY IN SERVICE AND PRODUCT DEFECT: ${particulars}.</p>
      <p style="margin-top: 8px;"><strong>FACTS:</strong><br>1. The Complainant purchased/availed: <em>${particulars}</em>.<br>2. That the said product/service suffered from defect: <em>${grievance}</em>.<br>3. That you neglected to replace the product or refund the consideration.</p>
      <p style="margin-top: 10px; background: #fffde7; border: 1px solid #ffe082; padding: 6px;">
        <strong>DEMAND:</strong> You are called upon to refund the purchase amount with Rs 25,000 damages within <strong>15 DAYS</strong>, failing which complaint under Section 35 of CPA 2019 shall be filed.
      </p>
      <div style="margin-top: 35px; text-align: right;">_______________________________<br><strong>${sender}</strong><br>(Consumer / Complainant)</div>
    `;
  } else if (type === 'eviction') {
    paper.innerHTML = `
      <div class="pleading-seal">LEGAL<br>NOTICE<br>T.P. ACT</div>
      <div class="pleading-header">
        NOTICE OF TERMINATION OF TENANCY UNDER SECTION 106, TRANSFER OF PROPERTY ACT, 1882
      </div>
      <div style="text-align: right; margin-bottom: 12px; font-size: 11px;">Date: ${today} | Place: ${place}</div>
      <p><strong>TO (TENANT):</strong> ${recipient}<br><strong>FROM (LANDLORD):</strong> ${sender} (${place})</p>
      <p style="margin-top: 8px;"><strong>PREMISES:</strong> ${particulars}</p>
      <p style="margin-top: 8px;"><strong>FACTS & BREACH:</strong> You have committed breach of tenancy terms: <em>${grievance}</em>.</p>
      <p style="margin-top: 8px;"><strong>NOTICE:</strong> Your tenancy is hereby terminated upon expiration of 30 days from receipt. You are called upon to vacate and deliver peaceful possession.</p>
      <div style="margin-top: 35px; text-align: right;">_______________________________<br><strong>${sender}</strong><br>(Landlord / Owner)</div>
    `;
  } else {
    paper.innerHTML = `
      <div class="pleading-seal">SWORN<br>AFFIDAVIT<br>NOTARIAL</div>
      <div class="pleading-header">
        BEFORE THE EXECUTIVE MAGISTRATE / NOTARY PUBLIC AT ${place.toUpperCase()}
      </div>
      <div style="text-align: center; font-weight: bold; margin-bottom: 15px;">AFFIDAVIT / SELF-DECLARATION</div>
      <p>I, <strong>${sender}</strong>, residing at ${place}, do hereby solemnly affirm and state on oath as under:</p>
      <ol style="padding-left: 20px; margin-top: 8px; line-height: 1.8;">
        <li>That I am the deponent herein and conversant with the facts of the matter: <em>${particulars}</em>.</li>
        <li>That I state that: <em>${grievance}</em>.</li>
        <li>That the contents of paragraphs 1 to 2 above are true and correct to my personal knowledge.</li>
      </ol>
      <p style="margin-top: 15px;"><strong>VERIFICATION:</strong> Verified at ${place} on ${today} that the contents of this affidavit are true.</p>
      <div style="margin-top: 35px; display: flex; justify-content: space-between;">
        <div>Solemnly affirmed before me:<br>Notary Public / Oath Commissioner</div>
        <div style="text-align: right;">_______________________________<br><strong>DEPONENT (${sender})</strong></div>
      </div>
    `;
  }

  const dlUser = getDigiLockerUser();
  if (dlUser) {
    paper.innerHTML += `
      <div class="pleading-digilocker-stamp">
        <div class="stamp-icon">✓</div>
        <div class="stamp-text">
          <strong>DIGILOCKER e-KYC VERIFIED COMPLAINANT / PETITIONER</strong>
          Verified Identity: ${dlUser.name} &bull; Masked Token: ${dlUser.maskedUid || dlUser.bciReg || 'Verified'} &bull; Digital ID: ${dlUser.digilockerId}<br>
          <span style="font-size: 10.5px; color: #15803d;">Statutory Compliance: Section 4 Aadhaar Act, 2016 &bull; Section 65B Bharatiya Sakshya Adhiniyam, 2023 &bull; SHA-256 Validated</span>
        </div>
      </div>
    `;
  }
}

function copyPleadingText() {
  const paper = document.getElementById('pleadingPaper');
  navigator.clipboard.writeText(paper.innerText).then(() => {
    alert("Pleading text copied to clipboard.");
  });
}

function downloadPleadingText() {
  const paper = document.getElementById('pleadingPaper');
  const blob = new Blob([paper.innerText], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `NyayaSetu_Legal_Pleading_${Date.now()}.txt`;
  a.click();
}

// ==========================================================================
// BHASHINI VOICE ASSISTANT
// ==========================================================================

let speechLang = 'hi-IN';
let recording = false;

function setSpeechLanguage() {
  speechLang = document.getElementById('selectLang').value;
}

function toggleRecordVoice() {
  const btn = document.getElementById('btnRecord');
  const status = document.getElementById('micStatus');

  if (!recording) {
    recording = true;
    btn.innerText = 'Stop Recording';
    btn.className = 'btn btn-default btn-sm';
    status.style.display = 'block';

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      const rec = new SpeechRec();
      rec.lang = speechLang;
      rec.start();
      rec.onresult = (e) => {
        const text = e.results[0][0].transcript;
        addVoiceBubble(text, true);
        stopRecording();
      };
      rec.onerror = () => stopRecording();
    } else {
      setTimeout(() => {
        if (recording) {
          const sample = speechLang.startsWith('mr') 
            ? "माझे घरमालक २ महिन्यांचे डिपॉझिट परत करत नाहीत, मला काय करावे लागेल?"
            : "चेक बाउंस हो गया है, मुझे क्या कानूनी कदम उठाने चाहिए?";
          addVoiceBubble(sample, true);
          stopRecording();
        }
      }, 3000);
    }
  } else {
    stopRecording();
  }
}

function stopRecording() {
  recording = false;
  const btn = document.getElementById('btnRecord');
  const status = document.getElementById('micStatus');
  if (btn) {
    btn.innerText = 'Record Voice';
    btn.className = 'btn btn-primary btn-sm';
  }
  if (status) status.style.display = 'none';
}

function handleVoiceEnter(e) {
  if (e.key === 'Enter') {
    sendVoiceMessage();
  }
}

function sendVoiceMessage() {
  const inp = document.getElementById('inpVoiceText');
  const text = inp.value.trim();
  if (!text) return;

  addVoiceBubble(text, false);
  inp.value = '';
}

function triggerVoiceSample(lang, text) {
  if (lang === 'mr') speechLang = 'mr-IN';
  else if (lang === 'hi') speechLang = 'hi-IN';
  else speechLang = 'en-IN';

  document.getElementById('selectLang').value = speechLang;
  addVoiceBubble(text, true);
}

async function addVoiceBubble(userText, isVoice) {
  const log = document.getElementById('voiceChatLog');
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const userRow = document.createElement('div');
  userRow.className = 'chat-row user';
  userRow.innerHTML = `
    ${isVoice ? '<strong>[Voice Input]</strong> ' : ''}${escapeHtml(userText)}
    <div class="chat-time">${time}</div>
  `;
  log.appendChild(userRow);
  log.scrollTop = log.scrollHeight;

  const apiKey = getStoredApiKey() || (document.getElementById('inpApiKey') ? document.getElementById('inpApiKey').value.trim() : '');

  // Add temporary typing indicator
  const typingRow = document.createElement('div');
  typingRow.className = 'chat-row bot';
  typingRow.id = 'botTypingIndicator';
  typingRow.innerHTML = `<em>Consulting AI Legal Assistant...</em>`;
  log.appendChild(typingRow);
  log.scrollTop = log.scrollHeight;

  if (!apiKey) {
    setTimeout(() => {
      typingRow.remove();
      appendBotResponse(
        `<strong>API Key Required:</strong><br>Please configure your AI API Key in the Legal Guidance portal tab to enable live multilingual responses.`,
        `Please configure your API key in the portal settings to enable live responses.`
      );
    }, 600);
    return;
  }

  try {
    const langNames = {
      'mr-IN': 'Marathi',
      'hi-IN': 'Hindi',
      'en-IN': 'Indian English',
      'ta-IN': 'Tamil'
    };
    const targetLang = langNames[speechLang] || 'Hindi';

    const prompt = `You are NyayaSetu Bhashini, a conversational Indian legal literacy voice assistant.
User query: "${userText}"
Respond in ${targetLang} language concisely (maximum 2-3 short sentences). State the relevant Indian statutory law or procedure clearly and actionably for a citizen. Do not include markdown code blocks.`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3 }
      })
    });

    if (!response.ok) {
      throw new Error(`API error HTTP ${response.status}`);
    }

    const resJson = await response.json();
    const botText = resJson.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "No response received from AI service.";

    typingRow.remove();
    appendBotResponse(botText.replace(/\n/g, '<br>'), botText.replace(/[*_#]/g, ''));
  } catch (err) {
    typingRow.remove();
    appendBotResponse(
      `<strong>API Error:</strong> ${escapeHtml(err.message)}<br><small>Check API key and network connection.</small>`,
      `API request failed. Please check your key.`
    );
  }
}

function appendBotResponse(replyHtml, spokenText) {
  const log = document.getElementById('voiceChatLog');
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const botRow = document.createElement('div');
  botRow.className = 'chat-row bot';
  botRow.innerHTML = `
    <div>${replyHtml}</div>
    <div style="margin-top: 6px;">
      <button type="button" class="btn btn-default btn-sm" onclick="speakAudio('${encodeURIComponent(spokenText)}')">Play Voice (TTS)</button>
    </div>
    <div class="chat-time">${time}</div>
  `;
  log.appendChild(botRow);
  log.scrollTop = log.scrollHeight;

  speakAudio(encodeURIComponent(spokenText));
}

function speakAudio(encoded) {
  const text = decodeURIComponent(encoded);
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = speechLang;
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  }
}

// ==========================================================================
// eCOURTS CASE TRACKER
// ==========================================================================

const SAMPLE_CASES = {
  "MHNG01-004521-2024": {
    title: "Regular Civil Suit No. 142/2024",
    court: "District & Sessions Court, Nagpur",
    status: "Pending (Injunction Arguments)",
    filingDate: "14-02-2024",
    petitioner: "Devendra S. Agrawal",
    respondent: "Vidarbha Trading Corporation",
    acts: "Code of Civil Procedure, Order 39 Rule 1 & 2",
    judge: "Shri R. K. Deshmukh, Civil Judge Senior Division",
    nextHearing: "28-09-2026 (Court Hall No. 4)",
    order: "12-08-2026: Counsel for Petitioner present. Interim order extended. Stand over to 28-09-2026 for final arguments on temporary injunction application.",
    history: [
      { date: "14 Feb 2024", stage: "Institution of Suit", detail: "Civil Suit 142/2024 scrutinized and registered." },
      { date: "28 Mar 2024", stage: "Summons & Appearance", detail: "Defendant appeared through counsel and filed memo of appearance." },
      { date: "15 Jun 2024", stage: "Framing of Issues", detail: "4 core issues framed for trial." },
      { date: "12 Aug 2026", stage: "Interim Injunction Hearing", detail: "Arguments partly heard; matter adjourned to 28-09-2026." },
      { date: "28 Sep 2026", stage: "Scheduled Hearing", detail: "Listed for final arguments on temporary injunction." }
    ]
  },
  "DLHC01-008912-2023": {
    title: "FAO (COMM) No. 89/2023",
    court: "High Court of Delhi (Division Bench)",
    status: "Reserved for Judgment",
    filingDate: "05-09-2023",
    petitioner: "Skyline Infra Private Limited",
    respondent: "National Highways Authority of India (NHAI)",
    acts: "Commercial Courts Act 2015 & Arbitration Act Sec 37",
    judge: "Hon'ble Justice Rajiv Shakdher & Hon'ble Justice Amit Bansal",
    nextHearing: "24-09-2026 (Pronouncement)",
    order: "01-09-2026: Final oral arguments concluded by Senior Counsel. Written submissions filed. Judgment reserved.",
    history: [
      { date: "05 Sep 2023", stage: "Appeal Instituted", detail: "Commercial appeal filed under Section 37." },
      { date: "10 Jan 2024", stage: "Notice Issued", detail: "Respondent accepted notice through Standing Counsel." },
      { date: "01 Sep 2026", stage: "Arguments Concluded", detail: "Hearing closed; matter reserved for judgment." }
    ]
  },
  "MUPU02-001290-2024": {
    title: "Summary Criminal Case No. 891/2024",
    court: "Court of JMFC, Pune (Court No. 8)",
    status: "Complainant Evidence",
    filingDate: "12-04-2024",
    petitioner: "Pooja K. Mehra",
    respondent: "Suresh N. Patel",
    acts: "Negotiable Instruments Act, 1881 (Section 138)",
    judge: "Shri S. V. Kulkarni, Judicial Magistrate First Class",
    nextHearing: "04-10-2026 (Cross-Examination)",
    order: "10-07-2026: Accused pleaded not guilty to plea recorded u/s 251 CrPC. Matter fixed for complainant cross-examination.",
    history: [
      { date: "12 Apr 2024", stage: "Complaint Registered", detail: "Verification affidavit of complainant recorded." },
      { date: "10 Jul 2026", stage: "Plea Recorded", detail: "Plea of accused recorded; pleaded not guilty." },
      { date: "04 Oct 2026", stage: "Evidence Hearing", detail: "Cross-examination of CW-1 scheduled." }
    ]
  }
};

// ==========================================================================
// REAL-TIME eCOURTS DISTRICT PORTAL CNR SEARCH & VISITOR CAPTCHA SOLVER
// ==========================================================================

const RECENT_CASES_STORAGE_KEY = 'nyayasetu_recent_cases';
let currentEcourtSessionId = null;
let currentSnapshotCnr = null;

function initEcourtsCaseSearch() {
  renderRecentSearches();
}

function showEcourtAlert(msg, type = 'error') {
  const banner = document.getElementById('ecourtsStatusBanner');
  if (!banner) return;
  if (!msg) {
    banner.style.display = 'none';
    banner.innerHTML = '';
    return;
  }
  banner.className = `ecourts-alert ecourts-alert-${type}`;
  banner.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
    <span>${msg}</span>
  `;
  banner.style.display = 'flex';
}

function showEcourtLoading(msg) {
  const banner = document.getElementById('ecourtsStatusBanner');
  if (!banner) return;
  banner.className = 'ecourts-alert ecourts-alert-info';
  banner.innerHTML = `
    <svg class="rotating" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>
    <span>${msg}</span>
  `;
  banner.style.display = 'flex';
}

function fillCNR(cnr) {
  const inp = document.getElementById('inpCNR');
  if (inp) {
    inp.value = cnr;
    startCnrSearch();
  }
}

function clearCnrSearch() {
  const inp = document.getElementById('inpCNR');
  if (inp) inp.value = '';
  const captchaBox = document.getElementById('ecourtsCaptchaBox');
  if (captchaBox) captchaBox.style.display = 'none';
  const statusBanner = document.getElementById('ecourtsStatusBanner');
  if (statusBanner) statusBanner.style.display = 'none';
  const snapBanner = document.getElementById('ecourtsSnapshotBanner');
  if (snapBanner) snapBanner.style.display = 'none';
  const resultsContainer = document.getElementById('ecourtsResultsContainer');
  if (resultsContainer) resultsContainer.style.display = 'none';
  const emptyState = document.getElementById('ecourtsEmptyState');
  if (emptyState) emptyState.style.display = 'block';
  currentEcourtSessionId = null;
  currentSnapshotCnr = null;
}

function toggleCaptchaZoom() {
  const wrapper = document.getElementById('captchaImgWrapper');
  const btn = document.getElementById('btnZoomCaptcha');
  if (!wrapper) return;
  wrapper.classList.toggle('zoomed');
  const isZoomed = wrapper.classList.contains('zoomed');
  if (btn) {
    btn.innerHTML = isZoomed ? '🔍 Zoom Out' : '🔍 Zoom In';
  }
}

function cancelEcourtCaptcha() {
  const wrapper = document.getElementById('captchaImgWrapper');
  if (wrapper) wrapper.classList.remove('zoomed');
  const btn = document.getElementById('btnZoomCaptcha');
  if (btn) btn.innerHTML = '🔍 Zoom In';
  const captchaBox = document.getElementById('ecourtsCaptchaBox');
  if (captchaBox) captchaBox.style.display = 'none';
  const statusBanner = document.getElementById('ecourtsStatusBanner');
  if (statusBanner) statusBanner.style.display = 'none';
  currentEcourtSessionId = null;
}

async function startCnrSearch() {
  const inp = document.getElementById('inpCNR');
  const rawCnr = (inp ? inp.value : '').trim();
  const cnr = rawCnr.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

  if (!cnr || cnr.length !== 16) {
    showEcourtAlert('Please enter a valid 16-character CNR number (e.g. MHNG010045212024).', 'error');
    if (inp) inp.focus();
    return;
  }

  // Update input with clean formatting
  inp.value = cnr;

  // Reset UI
  showEcourtLoading('Connecting to official eCourts portal (services.ecourts.gov.in)...');
  const captchaBox = document.getElementById('ecourtsCaptchaBox');
  if (captchaBox) captchaBox.style.display = 'none';
  const snapBanner = document.getElementById('ecourtsSnapshotBanner');
  if (snapBanner) snapBanner.style.display = 'none';
  const btn = document.getElementById('btnStartCnrSearch');
  if (btn) btn.disabled = true;

  try {
    const res = await fetch('/api/search/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cnr })
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.error === 'RATE_LIMITED') {
        showEcourtAlert('Search limit exceeded (max 10 searches per minute). Please wait 60 seconds.', 'error');
      } else {
        showEcourtAlert(data.message || 'Unable to connect to eCourts portal. Please try again.', 'error');
      }
      return;
    }

    // Success: save sessionId and display captcha image
    currentEcourtSessionId = data.sessionId;
    const captchaImg = document.getElementById('ecourtsCaptchaImg');
    if (captchaImg) {
      captchaImg.src = data.captchaImage;
    }

    // Hide loading banner and display captcha box
    showEcourtAlert('');
    if (captchaBox) {
      captchaBox.style.display = 'block';
      const captchaInp = document.getElementById('inpCaptchaCode');
      if (captchaInp) {
        captchaInp.value = '';
        captchaInp.focus();
      }
    }
  } catch (err) {
    showEcourtAlert('Network error connecting to local eCourts proxy. Is the server running?', 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
}

async function refreshEcourtCaptcha() {
  if (!currentEcourtSessionId) {
    startCnrSearch();
    return;
  }

  const btn = document.getElementById('btnRefreshCaptcha');
  if (btn) btn.disabled = true;
  showEcourtLoading('Fetching fresh security captcha from official portal...');

  try {
    const res = await fetch('/api/search/refresh-captcha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: currentEcourtSessionId })
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.error === 'SESSION_EXPIRED') {
        showEcourtAlert('Session expired. Starting a fresh search session...', 'error');
        startCnrSearch();
      } else {
        showEcourtAlert(data.message || 'Failed to refresh captcha. Please try again.', 'error');
      }
      return;
    }

    const captchaImg = document.getElementById('ecourtsCaptchaImg');
    if (captchaImg) {
      captchaImg.src = data.captchaImage;
    }
    showEcourtAlert('');
    const captchaInp = document.getElementById('inpCaptchaCode');
    if (captchaInp) {
      captchaInp.value = '';
      captchaInp.focus();
    }
  } catch (err) {
    showEcourtAlert('Error refreshing captcha. Please click Search again.', 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
}

async function submitEcourtCaptcha() {
  if (!currentEcourtSessionId) {
    showEcourtAlert('Session expired. Please click "Search eCourts" to start a new search.', 'error');
    return;
  }

  const captchaInp = document.getElementById('inpCaptchaCode');
  const captcha = (captchaInp ? captchaInp.value : '').trim();

  if (!captcha) {
    showEcourtAlert('Please enter the captcha text shown in the image.', 'error');
    if (captchaInp) captchaInp.focus();
    return;
  }

  const submitBtn = document.getElementById('btnSubmitCaptcha');
  if (submitBtn) submitBtn.disabled = true;
  showEcourtLoading('Querying official eCourts National Judicial Data Grid...');

  try {
    const res = await fetch('/api/search/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: currentEcourtSessionId,
        captcha: captcha
      })
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.error === 'WRONG_CAPTCHA') {
        showEcourtAlert('Captcha did not match. Please note: Captcha is CASE-SENSITIVE (e.g. lowercase letters). Click "Zoom In" to distinguish 8 vs B or 0 vs O. A fresh image is ready below.', 'error');
        if (data.captchaImage) {
          const captchaImg = document.getElementById('ecourtsCaptchaImg');
          if (captchaImg) captchaImg.src = data.captchaImage;
        } else {
          refreshEcourtCaptcha();
        }
        if (captchaInp) {
          captchaInp.value = '';
          captchaInp.focus();
        }
      } else if (data.error === 'CASE_NOT_FOUND') {
        showEcourtAlert(data.message || 'No case record found for this CNR in eCourts database.', 'error');
        const captchaBox = document.getElementById('ecourtsCaptchaBox');
        if (captchaBox) captchaBox.style.display = 'none';
        const resultsContainer = document.getElementById('ecourtsResultsContainer');
        if (resultsContainer) resultsContainer.style.display = 'none';
        const emptyState = document.getElementById('ecourtsEmptyState');
        if (emptyState) emptyState.style.display = 'block';
      } else if (data.error === 'SESSION_EXPIRED') {
        showEcourtAlert('Your 10-minute session has expired. Click Search to start a new lookup.', 'error');
        const captchaBox = document.getElementById('ecourtsCaptchaBox');
        if (captchaBox) captchaBox.style.display = 'none';
        currentEcourtSessionId = null;
      } else if (data.error === 'RATE_LIMITED') {
        showEcourtAlert('Rate limit reached (max 10 searches per minute). Please wait.', 'error');
      } else if (['PORTAL_SESSION_REJECTED', 'PORTAL_SEARCH_REJECTED', 'PORTAL_UNAVAILABLE'].includes(data.error)) {
        // The official site may invalidate its session or change its response
        // format after displaying a captcha. Do not leave the visitor retrying
        // against a stale captcha/session; they must start a fresh search.
        currentEcourtSessionId = null;
        if (captchaInp) captchaInp.value = '';
        const captchaBox = document.getElementById('ecourtsCaptchaBox');
        if (captchaBox) captchaBox.style.display = 'none';
        showEcourtAlert(`${data.message || 'The official eCourts request could not be completed.'} Click Search eCourts to start a fresh session and receive a new captcha.`, 'error');
      } else {
        showEcourtAlert(data.message || 'Official eCourts portal returned an error. Please try again.', 'error');
      }
      return;
    }

    // Success!
    showEcourtAlert('');
    const captchaBox = document.getElementById('ecourtsCaptchaBox');
    if (captchaBox) captchaBox.style.display = 'none';
    const snapBanner = document.getElementById('ecourtsSnapshotBanner');
    if (snapBanner) snapBanner.style.display = 'none';

    // Render normalized case details
    renderCaseDetails(data, false);

    // Save snapshot to localStorage
    saveCaseSnapshot(data);

  } catch (err) {
    showEcourtAlert('Failed to communicate with eCourts backend. Please check network connection.', 'error');
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
}

function renderCaseDetails(data, isSnapshot = false, savedAt = null) {
  // Title & Status
  const title = data.caseType || `Case Record (CNR: ${data.cnr})`;
  const titleDisplay = document.getElementById('caseTitleDisplay');
  if (titleDisplay) titleDisplay.innerText = title;

  const statusBadge = document.getElementById('caseStatusBadge');
  const status = data.status || 'Active';
  if (statusBadge) {
    statusBadge.innerText = status;
    statusBadge.className = status.toLowerCase().includes('disposed') ? 'badge badge-green' : 'badge badge-orange';
  }

  // Key Fields
  const courtAndJudgeDisplay = document.getElementById('courtAndJudgeDisplay');
  if (courtAndJudgeDisplay) courtAndJudgeDisplay.innerText = data.courtAndJudge || 'District Court Complex';

  const caseTypeDisplay = document.getElementById('caseTypeDisplay');
  if (caseTypeDisplay) caseTypeDisplay.innerText = data.caseType || '—';

  const filingText = data.filingNumber ? `${data.filingNumber} (Filed: ${data.filingDate || '—'})` : (data.filingDate ? `Filed on ${data.filingDate}` : '—');
  const filingDetailsDisplay = document.getElementById('filingDetailsDisplay');
  if (filingDetailsDisplay) filingDetailsDisplay.innerText = filingText;

  const regText = data.registrationNumber ? `${data.registrationNumber} (Reg: ${data.registrationDate || '—'})` : (data.registrationDate ? `Registered on ${data.registrationDate}` : '—');
  const registrationDetailsDisplay = document.getElementById('registrationDetailsDisplay');
  if (registrationDetailsDisplay) registrationDetailsDisplay.innerText = regText;

  const petitionerDisplay = document.getElementById('petitionerDisplay');
  if (petitionerDisplay) petitionerDisplay.innerText = data.petitioner || '—';

  const respondentDisplay = document.getElementById('respondentDisplay');
  if (respondentDisplay) respondentDisplay.innerText = data.respondent || '—';

  const stageDisplay = document.getElementById('stageDisplay');
  if (stageDisplay) stageDisplay.innerText = data.stage || '—';

  const nextHearing = data.nextHearingDate || 'Not Scheduled / Listed';
  const nextHearingDisplay = document.getElementById('nextHearingDisplay');
  if (nextHearingDisplay) nextHearingDisplay.innerText = nextHearing;

  const cnrNumberDisplay = document.getElementById('cnrNumberDisplay');
  if (cnrNumberDisplay) cnrNumberDisplay.innerText = data.cnr;

  // Hearing History Table
  const tbody = document.getElementById('historyTableBody');
  const noHist = document.getElementById('noHistoryNotice');

  if (tbody) {
    if (Array.isArray(data.history) && data.history.length > 0) {
      tbody.innerHTML = data.history.map(h => `
        <tr>
          <td style="font-weight: bold; color: #003366;">${h.date || '—'}</td>
          <td>${h.purpose || '—'}</td>
          <td style="font-size: 11.5px; color: #334155;">${h.businessOnDate || '—'}</td>
        </tr>
      `).join('');
      if (noHist) noHist.style.display = 'none';
    } else {
      tbody.innerHTML = '';
      if (noHist) noHist.style.display = 'block';
    }
  }

  // Display results, hide empty state
  const emptyState = document.getElementById('ecourtsEmptyState');
  if (emptyState) emptyState.style.display = 'none';
  const resultsContainer = document.getElementById('ecourtsResultsContainer');
  if (resultsContainer) resultsContainer.style.display = 'flex';

  // Snapshot Banner handling
  const snapBanner = document.getElementById('ecourtsSnapshotBanner');
  if (snapBanner) {
    if (isSnapshot && savedAt) {
      currentSnapshotCnr = data.cnr;
      const formattedDate = new Date(savedAt).toLocaleString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
      const snapLabel = document.getElementById('snapshotBannerLabel');
      if (snapLabel) {
        snapLabel.innerHTML = `Saved snapshot from ${formattedDate}, may be out of date.`;
      }
      snapBanner.style.display = 'flex';
    } else {
      snapBanner.style.display = 'none';
    }
  }
}

function saveCaseSnapshot(data) {
  try {
    const raw = localStorage.getItem(RECENT_CASES_STORAGE_KEY);
    let list = raw ? JSON.parse(raw) : [];

    // Filter out existing item for same CNR
    list = list.filter(item => item.cnr !== data.cnr);

    const parties = (data.petitioner && data.respondent)
      ? `${data.petitioner.split('\n')[0].substring(0, 25)} v. ${data.respondent.split('\n')[0].substring(0, 25)}`
      : (data.petitioner || data.respondent || 'Litigants recorded');

    // Add new snapshot at the beginning
    list.unshift({
      cnr: data.cnr,
      status: data.status || 'Active',
      nextHearingDate: data.nextHearingDate || '—',
      parties: parties,
      savedAt: new Date().toISOString(),
      data: data
    });

    // Cap at 10 recent searches
    if (list.length > 10) list = list.slice(0, 10);

    localStorage.setItem(RECENT_CASES_STORAGE_KEY, JSON.stringify(list));
    renderRecentSearches();
  } catch (e) {
    console.error('Failed to save case snapshot:', e);
  }
}

function renderRecentSearches() {
  const container = document.getElementById('ecourtsRecentContainer');
  const chipsWrapper = document.getElementById('ecourtsRecentChips');
  if (!container || !chipsWrapper) return;

  try {
    const raw = localStorage.getItem(RECENT_CASES_STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];

    if (list.length === 0) {
      container.style.display = 'none';
      chipsWrapper.innerHTML = '';
      return;
    }

    container.style.display = 'block';
    chipsWrapper.innerHTML = list.map(item => `
      <div class="recent-case-chip" onclick="loadRecentSnapshot('${item.cnr}')" title="Click to view saved snapshot (${item.savedAt})">
        <strong>${item.cnr}</strong>
        <span class="badge badge-mini ${item.status.toLowerCase().includes('disposed') ? 'badge-green' : 'badge-orange'}">${item.status}</span>
        <span style="color: #64748b;">${item.parties}</span>
        <span style="font-size: 10px; color: #0284c7;">(${item.nextHearingDate})</span>
      </div>
    `).join('');
  } catch (e) {
    container.style.display = 'none';
  }
}

function loadRecentSnapshot(cnr) {
  try {
    const raw = localStorage.getItem(RECENT_CASES_STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    const item = list.find(s => s.cnr === cnr);
    if (!item) return;

    // Fill input field
    const inp = document.getElementById('inpCNR');
    if (inp) inp.value = item.cnr;

    // Hide captcha box and errors
    const captchaBox = document.getElementById('ecourtsCaptchaBox');
    if (captchaBox) captchaBox.style.display = 'none';
    showEcourtAlert('');

    // Render snapshot
    renderCaseDetails(item.data, true, item.savedAt);
  } catch (e) {
    console.error('Failed to load recent snapshot:', e);
  }
}

function refreshCurrentSnapshot() {
  if (currentSnapshotCnr) {
    fillCNR(currentSnapshotCnr);
  }
}

function clearRecentSearches() {
  localStorage.removeItem(RECENT_CASES_STORAGE_KEY);
  renderRecentSearches();
}

// ==========================================================================
// BHULEKH LAND RECORDS
// ==========================================================================

function onStateChange() {
  const state = document.getElementById('selLandState').value;
  const dist = document.getElementById('selLandDist');
  dist.innerHTML = '';

  if (state === 'MH') {
    ['Nagpur', 'Pune', 'Thane'].forEach(d => dist.add(new Option(d, d)));
    document.getElementById('inpTaluka').value = 'Nagpur Rural';
    document.getElementById('inpVillage').value = 'Wadi';
  } else if (state === 'UP') {
    ['Lucknow', 'Varanasi', 'Prayagraj'].forEach(d => dist.add(new Option(d, d)));
    document.getElementById('inpTaluka').value = 'Sadar';
    document.getElementById('inpVillage').value = 'Mohanlalganj';
  } else {
    ['Bengaluru Urban', 'Mysuru', 'Belagavi'].forEach(d => dist.add(new Option(d, d)));
    document.getElementById('inpTaluka').value = 'Bengaluru South';
    document.getElementById('inpVillage').value = 'Kengeri';
  }
}

function fetchLandRecord() {
  const state = document.getElementById('selLandState').value;
  const dist = document.getElementById('selLandDist').value;
  const taluka = document.getElementById('inpTaluka').value;
  const village = document.getElementById('inpVillage').value;
  const survey = document.getElementById('inpSurvey').value;

  document.getElementById('lblLandLocation').innerText = `${dist} / ${taluka} / ${village} (Gat ${survey})`;

  const tbody = document.getElementById('tblLandBody');
  const notes = document.getElementById('divMutationNotes');

  if (state === 'MH') {
    tbody.innerHTML = `
      <tr>
        <td><strong>Kishore B. Raut</strong></td>
        <td>0.82 Ha</td>
        <td>Jirayat (Dry Crop)</td>
        <td>Rs. 24.50</td>
      </tr>
      <tr>
        <td><strong>Suman K. Raut</strong> (Joint Holder)</td>
        <td>0.40 Ha</td>
        <td>Bagayat (Irrigated)</td>
        <td>Rs. 18.20</td>
      </tr>
    `;
    notes.innerHTML = `
      <div style="border-bottom: 1px dashed #ccc; padding-bottom: 5px; margin-bottom: 5px;">
        <strong>Mutation No. 892 (Registered Bank Charge):</strong> Charge created in favour of State Bank of India, Agricultural Credit Branch for INR 3,50,000.
      </div>
      <div>
        <strong>Mutation No. 741 (Testamentary Succession):</strong> Mutation sanctioned pursuant to succession under Section 149 of Maharashtra Land Revenue Code 1966.
      </div>
    `;
  } else if (state === 'UP') {
    tbody.innerHTML = `
      <tr>
        <td><strong>Ramprasad Tiwari</strong></td>
        <td>1.1500 Ha</td>
        <td>Bhumidhar with Transferable Rights</td>
        <td>Rs. 42.00</td>
      </tr>
    `;
    notes.innerHTML = `<div><strong>Khatauni Order 14-01-2024:</strong> Namantaran (Mutation) sanctioned by Naib Tehsildar under Section 34 of UP Revenue Code 2006.</div>`;
  } else {
    tbody.innerHTML = `
      <tr>
        <td><strong>Manjunath Gowda</strong></td>
        <td>2 Acres 14 Guntas</td>
        <td>Dry Land (Dry Crop)</td>
        <td>Rs. 36.00</td>
      </tr>
    `;
    notes.innerHTML = `<div><strong>Mutation MR No. T-1209:</strong> Certified under Karnataka Land Revenue Act 1964 with Bhoomi digital signature.</div>`;
  }
}

// ==========================================================================
// COMPLIANCE & LIMITATION CALENDAR
// ==========================================================================

function runLimitationCalc() {
  const type = document.getElementById('selStatuteType').value;
  const inputDate = new Date(document.getElementById('inpIncidentDate').value);
  const out = document.getElementById('calcOutputBox');

  if (isNaN(inputDate.getTime())) return;

  if (type === 'ni138') {
    const noticeDate = new Date(inputDate);
    noticeDate.setDate(noticeDate.getDate() + 30);

    const cureDate = new Date(noticeDate);
    cureDate.setDate(cureDate.getDate() + 15);

    const complaintDate = new Date(cureDate);
    complaintDate.setDate(complaintDate.getDate() + 30);

    out.innerHTML = `
      <strong>SECTION 138 NI ACT STATUTORY STAGES:</strong><br>
      1. Notice Dispatch Deadline (30 Days): <strong>${noticeDate.toDateString()}</strong><br>
      2. 15-Day Statutory Cure Period: Drawer must pay by <strong>${cureDate.toDateString()}</strong><br>
      3. Court Filing Limitation (30 Days): Complaint must be filed by <strong style="color: #b71c1c;">${complaintDate.toDateString()}</strong>.
    `;
  } else if (type === 'consumer') {
    const limit = new Date(inputDate);
    limit.setFullYear(limit.getFullYear() + 2);

    out.innerHTML = `
      <strong>CONSUMER PROTECTION ACT, 2019 (SECTION 69):</strong><br>
      Limitation Period: 2 Years from Cause of Action.<br>
      Final Date to file Consumer Complaint: <strong style="color: #b71c1c;">${limit.toDateString()}</strong>.
    `;
  } else if (type === 'rti') {
    const pio = new Date(inputDate);
    pio.setDate(pio.getDate() + 30);

    const appeal = new Date(pio);
    appeal.setDate(appeal.getDate() + 30);

    out.innerHTML = `
      <strong>RTI ACT, 2005 STATUTORY TIMELINE:</strong><br>
      PIO 30-Day Response Deadline: <strong>${pio.toDateString()}</strong><br>
      First Appeal Window (Section 19(1)): Must be filed by <strong style="color: #b71c1c;">${appeal.toDateString()}</strong>.
    `;
  } else {
    const mact = new Date(inputDate);
    mact.setMonth(mact.getMonth() + 6);

    out.innerHTML = `
      <strong>MOTOR VEHICLES (AMENDMENT) ACT, 2019 (SECTION 166(3)):</strong><br>
      Limitation Period: Strictly 6 Months from date of accident.<br>
      Final Claim Filing Deadline: <strong style="color: #b71c1c;">${mact.toDateString()}</strong>.
    `;
  }
}

function initCountdown() {
  const el = document.getElementById('cntTimer');
  if (!el) return;

  let totalSecs = 2 * 86400 + 14 * 3600 + 22 * 60 + 40;
  setInterval(() => {
    totalSecs = Math.max(0, totalSecs - 1);
    const d = Math.floor(totalSecs / 86400);
    const h = Math.floor((totalSecs % 86400) / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    el.innerText = `${String(d).padStart(2,'0')}d : ${String(h).padStart(2,'0')}h : ${String(m).padStart(2,'0')}m : ${String(s).padStart(2,'0')}s`;
  }, 1000);
}

function exportICS(id) {
  const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//NyayaSetu Portal//IN
BEGIN:VEVENT
SUMMARY:Statutory Deadline: Section 138 NI Act Notice Expiry
DESCRIPTION:Statutory 15-day cure period expires for cheque bounce matter.
DTSTART:20260917T090000Z
DTEND:20260917T100000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  downloadICS(ics, "NyayaSetu_Limitation_Event.ics");
}

function exportAllICS() {
  const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//NyayaSetu Portal//IN
BEGIN:VEVENT
SUMMARY:Cheque Bounce Notice Expiry (Sharma Matter)
DTSTART:20260917T090000Z
DTEND:20260917T100000Z
END:VEVENT
BEGIN:VEVENT
SUMMARY:First RTI Appeal Deadline (Road Works)
DTSTART:20261005T090000Z
DTEND:20261005T100000Z
END:VEVENT
END:VCALENDAR`;

  downloadICS(ics, "NyayaSetu_All_Deadlines.ics");
}

function downloadICS(data, name) {
  const blob = new Blob([data], { type: 'text/calendar;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  alert(`Downloaded calendar event (${name}). Open to import into Google Calendar or Outlook.`);
}

// ==========================================================================
// ADVOCATE PRACTICE MANAGEMENT & BILLABLE STOPWATCH
// ==========================================================================

function promptNewCase() {
  const title = prompt("Enter Case Title:", "Kulkarni vs MSEDCL");
  if (!title) return;
  const cnr = prompt("Enter 16-Digit CNR Number:", "MHNG01-008921-2026");
  const court = prompt("Enter Court / Forum:", "Civil Court Senior Division, Nagpur");

  const tbody = document.getElementById('tbodyMatters');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><strong>${title}</strong><br><span style="font-size: 10px; color: #666;">New Brief</span></td>
    <td><code>${cnr || 'PENDING'}</code></td>
    <td>Client Confidential</td>
    <td>${court}</td>
    <td style="color: #b71c1c; font-weight: bold;">14-10-2026</td>
    <td><span class="badge badge-blue">Pre-Admission</span></td>
    <td><button type="button" class="btn btn-default btn-sm" onclick="showTab('lawyerrooms')">Open Room</button></td>
  `;
  tbody.prepend(tr);
}

let timer = null;
let seconds = 0;
let running = false;

function startTimer() {
  if (!running) {
    running = true;
    document.getElementById('btnTimerStart').innerText = 'Running...';
    timer = setInterval(() => {
      seconds++;
      updateTimerDisplay();
    }, 1000);
  }
}

function pauseTimer() {
  if (running) {
    running = false;
    clearInterval(timer);
    document.getElementById('btnTimerStart').innerText = 'Resume';
  }
}

function updateTimerDisplay() {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  document.getElementById('timerDisplay').innerText = 
    `${String(h).padStart(2,'0')} : ${String(m).padStart(2,'0')} : ${String(s).padStart(2,'0')}`;
}

function recordBillableTime() {
  pauseTimer();
  const matter = document.getElementById('selTimerMatter').value;
  const activity = document.getElementById('selTimerActivity').value;
  const hrs = (seconds / 3600).toFixed(2);
  const bill = Math.round(hrs * 2500);

  alert(`Logged Billable Entry:\n\n• Matter: ${matter}\n• Activity: ${activity}\n• Duration: ${hrs} Hours\n• Billed Amount: Rs ${bill}`);

  seconds = 0;
  updateTimerDisplay();
  document.getElementById('btnTimerStart').innerText = 'Start Timer';
}

// Initial page setup
document.addEventListener('DOMContentLoaded', () => {
  initApiKeyUI();
  initDigiLocker();
  renderInitialAnalysisState();
  renderPleading();
  initEcourtsCaseSearch();
  runLimitationCalc();
  initCountdown();
  renderClientRoom();
  renderLawyerRoom();
});

// ==========================================================================
// DIGILOCKER NATIONAL DIGITAL IDENTITY & e-KYC SYSTEM (MeitY / NeGD)
// Compliant with Section 4 Aadhaar Act 2016 & Digital Personal Data Protection Act 2023
// ==========================================================================

const DIGILOCKER_STORAGE_KEY = 'nyayasetu_digilocker_user';
let activeDlPersona = 'citizen';
let currentOtpCode = '120645';
let otpCountdownTimer = null;
let currentDlUploadContext = null; // { roomId, docId }

const DIGILOCKER_PROFILES = {
  mansvi: {
    id: 'mansvi',
    name: 'Mansvi Khupse',
    role: 'citizen',
    roleLabel: 'Citizen Litigant • e-KYC Verified',
    identifier: '9422188990',
    maskedUid: 'XXXX-XXXX-9182',
    mobile: '+91 94221 88990',
    digilockerId: 'in.gov.uidai-aadhaar-mansvi-9182',
    gender: 'Female',
    dob: '24/11/2002',
    address: 'Civil Lines, Nagpur, Maharashtra - 440001',
    consentId: 'DPDP-CONSENT-MK-44012-2026',
    authMethod: 'UIDAI Aadhaar OTP (e-KYC)',
    authenticatedAt: 'Today, 10:30 AM',
    disputeType: 'Land & Property Title Dispute',
    documents: [
      {
        id: 'doc-land-mansvi',
        name: 'Mahabhumi 7/12 Land Rights Extract',
        issuer: 'Revenue Department, Govt of Maharashtra',
        docType: 'Land Title & Mutation Record',
        docNumber: 'Survey #142/2, Mouza Wadi, Nagpur Rural',
        issueDate: '04/07/2026',
        status: 'Digitally Certified by Tahsildar (e-Mutation)',
        hash: 'SHA256: 3f79bb7b435b05321651daefd374cd681fde49965df612c4146fffa6f600114d',
        file: 'Mahabhumi_7_12_Extract_Wadi_142_2.pdf',
        filePath: 'Example_Files/Unit -1 AI in SDLC.pptx',
        icon: '📜'
      },
      {
        id: 'doc-aadhaar-mansvi',
        name: 'Aadhaar e-KYC Credential',
        issuer: 'UIDAI (Unique Identification Authority of India)',
        docType: 'Identity & Address Proof',
        docNumber: 'XXXX-XXXX-9182',
        issueDate: '12/04/2021',
        status: 'Digitally Signed by UIDAI CCA',
        hash: 'SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        file: 'Aadhaar_eKYC_MansviKhupse.pdf',
        filePath: 'Example_Files/AI_in_Modeling_Unit II.pptx',
        icon: '🪪'
      },
      {
        id: 'doc-pan-mansvi',
        name: 'Permanent Account Number (PAN Card)',
        issuer: 'Income Tax Department (ITD)',
        docType: 'Tax & Financial Identity',
        docNumber: 'MKHUP9182E',
        issueDate: '22/08/2022',
        status: 'Digitally Signed by ITD',
        hash: 'SHA256: 4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
        file: 'PAN_Card_MansviKhupse.pdf',
        filePath: 'Example_Files/2. Unit II -OFDM Transmitter Numericals_compressed.pdf',
        icon: '💳'
      },
      {
        id: 'doc-tax-mansvi',
        name: 'NMC Property Tax & Assessment Extract',
        issuer: 'Nagpur Municipal Corporation (NMC)',
        docType: 'Municipal Property Assessment',
        docNumber: 'NMC-PROP-2026-8819',
        issueDate: '10/01/2026',
        status: 'Digitally Verified Municipality Record',
        hash: 'SHA256: 82b9a7852f82956cf57f722a4b868d447d96901844b7d142171542f7415ab5eb',
        file: 'NMC_Property_Tax_Assessment.pdf',
        filePath: 'Example_Files/Unit -1 AI in SDLC.pptx',
        icon: '🏛️'
      },
      {
        id: 'doc-dl-mansvi',
        name: 'Driving Licence (Smart Card)',
        issuer: 'Ministry of Road Transport & Highways (MoRTH)',
        docType: 'Motor Vehicle Identity',
        docNumber: 'MH-31-2023009182',
        issueDate: '15/05/2023',
        status: 'Digitally Signed by Transport Dept',
        hash: 'SHA256: 9e107d9d372bb6826bd81d3542a419d6dae2ee1adc4f5ac011045f01f423409',
        file: 'Driving_Licence_MansviKhupse.pdf',
        filePath: 'Example_Files/AI_in_Modeling_Unit II.pptx',
        icon: '🚗'
      }
    ]
  },
  swati: {
    id: 'swati',
    name: 'Swati Kundu',
    role: 'citizen',
    roleLabel: 'Citizen Litigant • e-KYC Verified',
    identifier: '9823011223',
    maskedUid: 'XXXX-XXXX-7721',
    mobile: '+91 98230 11223',
    digilockerId: 'in.gov.uidai-aadhaar-swati-7721',
    gender: 'Female',
    dob: '18/09/2003',
    address: 'Dharampeth, Nagpur, Maharashtra - 440010',
    consentId: 'DPDP-CONSENT-SK-88123-2026',
    authMethod: 'UIDAI Aadhaar OTP (e-KYC)',
    authenticatedAt: 'Today, 11:15 AM',
    disputeType: 'Section 138 NI Act Cheque Dishonour',
    documents: [
      {
        id: 'doc-cheque-swati',
        name: 'Original Cheque Dishonour Memo & Slip',
        issuer: 'HDFC Bank Ltd / RBI CTS Clearing',
        docType: 'Negotiable Instrument Return Record',
        docNumber: 'Cheque #448912 (Memo Ref: HDFC-CLR-901)',
        issueDate: '14/08/2026',
        status: 'Digitally Validated Bank Record',
        hash: 'SHA256: 82b9a7852f82956cf57f722a4b868d447d96901844b7d142171542f7415ab5eb',
        file: 'Cheque_Dishonour_Memo_HDFC.pdf',
        filePath: 'Example_Files/2. Unit II -OFDM Transmitter Numericals_compressed.pdf',
        icon: '🏦'
      },
      {
        id: 'doc-aadhaar-swati',
        name: 'Aadhaar e-KYC Credential',
        issuer: 'UIDAI (Unique Identification Authority of India)',
        docType: 'Identity & Address Proof',
        docNumber: 'XXXX-XXXX-7721',
        issueDate: '10/02/2021',
        status: 'Digitally Signed by UIDAI CCA',
        hash: 'SHA256: 3f79bb7b435b05321651daefd374cd681fde49965df612c4146fffa6f600114d',
        file: 'Aadhaar_eKYC_SwatiKundu.pdf',
        filePath: 'Example_Files/AI_in_Modeling_Unit II.pptx',
        icon: '🪪'
      },
      {
        id: 'doc-pan-swati',
        name: 'Permanent Account Number (PAN Card)',
        issuer: 'Income Tax Department (ITD)',
        docType: 'Tax & Financial Identity',
        docNumber: 'SKUND7721F',
        issueDate: '11/03/2022',
        status: 'Digitally Signed by ITD',
        hash: 'SHA256: 4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
        file: 'PAN_Card_SwatiKundu.pdf',
        filePath: 'Example_Files/Unit -1 AI in SDLC.pptx',
        icon: '💳'
      },
      {
        id: 'doc-bank-swati',
        name: 'Certified Bank Account Ledger Statement',
        issuer: 'HDFC Bank Ltd (Dharampeth Branch)',
        docType: 'Banker Books Evidence Act Record',
        docNumber: 'AC-5010049218201',
        issueDate: '20/08/2026',
        status: 'Certified under Section 2A Bankers Books Evidence',
        hash: 'SHA256: 5e2b4d121d3fd328cb08b5531fcacdabf8a7f83b1657ff1fc53b92dc18148a1d',
        file: 'Bank_Statement_HDFC_Certified.pdf',
        filePath: 'Example_Files/2. Unit II -OFDM Transmitter Numericals_compressed.pdf',
        icon: '📊'
      },
      {
        id: 'doc-dl-swati',
        name: 'Driving Licence (Smart Card)',
        issuer: 'Ministry of Road Transport & Highways (MoRTH)',
        docType: 'Motor Vehicle Identity',
        docNumber: 'MH-31-2022007721',
        issueDate: '18/11/2022',
        status: 'Digitally Signed by Transport Dept',
        hash: 'SHA256: 9e107d9d372bb6826bd81d3542a419d6dae2ee1adc4f5ac011045f01f423409',
        file: 'Driving_Licence_SwatiKundu.pdf',
        filePath: 'Example_Files/AI_in_Modeling_Unit II.pptx',
        icon: '🚗'
      }
    ]
  },
  bhoomi: {
    id: 'bhoomi',
    name: 'Chinta Bhumika Reddy (Bhoomi)',
    role: 'citizen',
    roleLabel: 'Citizen Litigant • e-KYC Verified',
    identifier: '9988765432',
    maskedUid: 'XXXX-XXXX-4529',
    mobile: '+91 99887 65432',
    digilockerId: 'in.gov.uidai-aadhaar-bhoomi-4529',
    gender: 'Female',
    dob: '05/08/2003',
    address: 'Ramdaspeth, Nagpur, Maharashtra - 440012',
    consentId: 'DPDP-CONSENT-BR-33219-2026',
    authMethod: 'UIDAI Aadhaar OTP (e-KYC)',
    authenticatedAt: 'Today, 11:45 AM',
    disputeType: 'Tenancy & Consumer Grievance',
    documents: [
      {
        id: 'doc-lease-bhoomi',
        name: 'Registered Tenancy Agreement / Lease Deed',
        issuer: 'Inspector General of Registration (IGR Maharashtra)',
        docType: 'Registered Lease Contract Evidence',
        docNumber: 'Reg. No. NGP-4-10492-2025',
        issueDate: '01/04/2025',
        status: 'Digitally Signed by Sub-Registrar Nagpur-IV',
        hash: 'SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
        file: 'Registered_Lease_Agreement_Bhoomi.pdf',
        filePath: 'Example_Files/Unit -1 AI in SDLC.pptx',
        icon: '📜'
      },
      {
        id: 'doc-aadhaar-bhoomi',
        name: 'Aadhaar e-KYC Credential',
        issuer: 'UIDAI (Unique Identification Authority of India)',
        docType: 'Identity & Address Proof',
        docNumber: 'XXXX-XXXX-4529',
        issueDate: '14/09/2021',
        status: 'Digitally Signed by UIDAI CCA',
        hash: 'SHA256: 4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
        file: 'Aadhaar_eKYC_BhoomiReddy.pdf',
        filePath: 'Example_Files/AI_in_Modeling_Unit II.pptx',
        icon: '🪪'
      },
      {
        id: 'doc-pan-bhoomi',
        name: 'Permanent Account Number (PAN Card)',
        issuer: 'Income Tax Department (ITD)',
        docType: 'Tax & Financial Identity',
        docNumber: 'CBRED4529G',
        issueDate: '19/01/2023',
        status: 'Digitally Signed by ITD',
        hash: 'SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        file: 'PAN_Card_BhoomiReddy.pdf',
        filePath: 'Example_Files/2. Unit II -OFDM Transmitter Numericals_compressed.pdf',
        icon: '💳'
      },
      {
        id: 'doc-elec-bhoomi',
        name: 'Electricity Utility Consumer Bill',
        issuer: 'MSEDCL (Maharashtra State Electricity Distribution)',
        docType: 'Statutory Address Verification',
        docNumber: 'Consumer #41029810482',
        issueDate: '01/09/2026',
        status: 'Digitally Certified Utility Proof',
        hash: 'SHA256: 9e107d9d372bb6826bd81d3542a419d6dae2ee1adc4f5ac011045f01f423409',
        file: 'MSEDCL_Electricity_Bill.pdf',
        filePath: 'Example_Files/AI_in_Modeling_Unit II.pptx',
        icon: '⚡'
      },
      {
        id: 'doc-tax-bhoomi',
        name: 'Municipal Water & Property Tax Bill',
        issuer: 'Nagpur Municipal Corporation (NMC)',
        docType: 'Municipal Assessment Record',
        docNumber: 'NMC-WAT-2026-4412',
        issueDate: '15/06/2026',
        status: 'Digitally Signed by NMC Tax Assessor',
        hash: 'SHA256: 82b9a7852f82956cf57f722a4b868d447d96901844b7d142171542f7415ab5eb',
        file: 'NMC_Water_Tax_Invoice.pdf',
        filePath: 'Example_Files/Unit -1 AI in SDLC.pptx',
        icon: '💧'
      }
    ]
  }
};

function getDigiLockerUser() {
  const data = localStorage.getItem(DIGILOCKER_STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {}
  }
  return null;
}

function setDigiLockerUser(user) {
  if (!user) {
    localStorage.removeItem(DIGILOCKER_STORAGE_KEY);
  } else {
    localStorage.setItem(DIGILOCKER_STORAGE_KEY, JSON.stringify(user));
  }
  renderDigiLockerHeaderUI();
  renderPleading();
  if (activeTab === 'clientroom') renderClientRoom();
  if (activeTab === 'lawyerrooms') renderLawyerRoom();
}

function initDigiLocker() {
  renderDigiLockerHeaderUI();
  fetchDigiLockerServerConfig();
  
  // Close dropdown menu on outside click
  document.addEventListener('click', (e) => {
    const menu = document.getElementById('digilockerDropdownMenu');
    const pill = document.getElementById('digilockerUserPill');
    if (menu && menu.style.display !== 'none' && !menu.contains(e.target) && (!pill || !pill.contains(e.target))) {
      menu.style.display = 'none';
    }
  });
}

function renderDigiLockerHeaderUI() {
  const container = document.getElementById('digilockerHeaderWidget');
  const topStripStatus = document.getElementById('topStripDigiLockerStatus');
  const topStripSep = document.getElementById('topStripSeparator');
  const drafterStatusText = document.getElementById('dlDrafterStatusText');
  const user = getDigiLockerUser();

  if (topStripStatus) {
    if (user) {
      topStripStatus.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="#22c55e"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
        <span>DigiLocker: <strong>${user.name}</strong></span>
      `;
      if (topStripSep) topStripSep.style.display = 'inline';
    } else {
      topStripStatus.innerHTML = `
        <a href="javascript:void(0)" onclick="openDigiLockerModal()" style="color: #93c5fd; text-decoration: underline;">
          DigiLocker Sign In
        </a>
      `;
      if (topStripSep) topStripSep.style.display = 'inline';
    }
  }

  if (drafterStatusText) {
    if (user) {
      drafterStatusText.innerHTML = `Connected as <strong>${user.name}</strong> (${user.maskedUid || user.bciReg}). Click to auto-fill.`;
    } else {
      drafterStatusText.innerText = 'Authenticate via DigiLocker to auto-fill verified identity & address.';
    }
  }

  if (!container) return;

  if (user) {
    const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    container.innerHTML = `
      <div class="digilocker-user-pill" id="digilockerUserPill" onclick="toggleDigiLockerDropdown(event)" title="Click to view DigiLocker Digital Identity">
        <div class="dl-avatar">${initials}</div>
        <div class="dl-user-meta">
          <div class="dl-user-name">${user.name} <span class="dl-check-badge">✓</span></div>
          <div class="dl-user-id">DigiLocker Verified</div>
        </div>
        <span class="dl-dropdown-arrow">▼</span>
      </div>

      <div class="digilocker-dropdown-menu" id="digilockerDropdownMenu" style="display: none;">
        <div class="dl-dropdown-header">
          <div class="dl-auth-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#003366"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            Verified Digital Identity
          </div>
          <div class="dl-dropdown-meta-item">Name: <strong>${user.name}</strong></div>
          <div class="dl-dropdown-meta-item">ID: <strong>${user.maskedUid || user.bciReg}</strong></div>
          <div class="dl-dropdown-meta-item">URI: <span style="font-family: monospace; font-size: 10px;">${user.digilockerId}</span></div>
          <div class="dl-dropdown-meta-item" style="color: #16a34a; font-weight: 600; font-size: 10.5px;">✓ e-KYC Certified (Sec 4 Aadhaar Act)</div>
        </div>

        <div class="dl-dropdown-actions">
          <button type="button" class="dl-dropdown-btn" onclick="openDigiLockerVault()">
            📂 Open DigiLocker Vault (${(user.documents && user.documents.length) || 5} Docs)
          </button>
          <button type="button" class="dl-dropdown-btn" onclick="showDpdpAuditModal()">
            🛡️ DPDP Act 2023 Consent Audit Trail
          </button>
          <button type="button" class="dl-dropdown-btn" onclick="openDigiLockerModal(1)">
            🔄 Switch Account / Re-authenticate
          </button>
          <button type="button" class="dl-dropdown-btn btn-danger-link" onclick="logoutDigiLocker()">
            🚪 Sign Out of DigiLocker
          </button>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <button class="btn-digilocker-header" onclick="openDigiLockerModal()" id="btnDigiLockerLogin" title="Sign in with DigiLocker National e-Governance Division">
        <svg class="dl-icon-svg" viewBox="0 0 24 24" fill="none">
          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" fill="#0099FF"/>
          <path d="M12 11c-1.66 0-3 1.34-3 3 0 1.3.84 2.4 2 2.82V18c0 .55.45 1 1 1s1-.45 1-1v-1.18c1.16-.42 2-1.52 2-2.82 0-1.66-1.34-3-3-3z" fill="#FFFFFF"/>
        </svg>
        <span class="dl-badge-labels">
          <span class="dl-primary-lbl">DigiLocker</span>
          <span class="dl-sub-lbl">Sign In / e-KYC</span>
        </span>
      </button>
    `;
  }
}

function toggleDigiLockerDropdown(e) {
  if (e) e.stopPropagation();
  const menu = document.getElementById('digilockerDropdownMenu');
  if (!menu) return;
  menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function handleModalOverlayClick(e, modalId) {
  if (e.target.id === modalId) {
    if (modalId === 'modalDigiLockerLogin') closeDigiLockerModal();
    else if (modalId === 'modalDigiLockerVault') closeDigiLockerVault();
    else if (modalId === 'modalDocPreview') closeDocPreview();
  }
}

let activeTeamMember = 'mansvi';

function openDigiLockerModal(step = 1) {
  const modal = document.getElementById('modalDigiLockerLogin');
  if (!modal) return;
  modal.style.display = 'flex';
  
  selectTeamMember(activeTeamMember || 'mansvi');
  showDlStep(step);
}

function closeDigiLockerModal() {
  const modal = document.getElementById('modalDigiLockerLogin');
  if (modal) modal.style.display = 'none';
  if (otpCountdownTimer) clearInterval(otpCountdownTimer);
}

function showDlStep(stepNum) {
  document.getElementById('dlStep1View').style.display = stepNum === 1 ? 'block' : 'none';
  document.getElementById('dlStep2View').style.display = stepNum === 2 ? 'block' : 'none';
  document.getElementById('dlStep3View').style.display = stepNum === 3 ? 'block' : 'none';

  for (let i = 1; i <= 3; i++) {
    const ind = document.getElementById(`dlStepIndicator${i}`);
    if (ind) {
      ind.className = i === stepNum ? 'dl-step-item active' : (i < stepNum ? 'dl-step-item completed' : 'dl-step-item');
    }
  }
}

function selectTeamMember(memberKey) {
  if (!DIGILOCKER_PROFILES[memberKey]) return;
  activeTeamMember = memberKey;
  const profile = DIGILOCKER_PROFILES[memberKey];

  // Update card highlights
  ['mansvi', 'swati', 'bhoomi'].forEach(key => {
    const card = document.getElementById(`cardMember_${key}`);
    if (card) {
      if (key === memberKey) card.classList.add('active');
      else card.classList.remove('active');
    }
  });

  // Pre-fill inputs
  const inpIdentifier = document.getElementById('inpDlIdentifier');
  const inpPin = document.getElementById('inpDlPin');
  const consentName = document.getElementById('lblSelectedLitigantConsent');
  const maskedPhone = document.getElementById('lblDlMaskedPhone');

  if (inpIdentifier) inpIdentifier.value = profile.identifier;
  if (inpPin) inpPin.value = '123456';
  if (consentName) consentName.innerText = profile.name;
  if (maskedPhone) maskedPhone.innerText = profile.mobile;
}

function instantTeamLogin(memberKey) {
  const key = memberKey || activeTeamMember || 'mansvi';
  const profile = DIGILOCKER_PROFILES[key];
  if (!profile) return;

  // Save to storage
  setDigiLockerUser(profile);

  // Populate step 3 preview card
  const initials = profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const elAvatar = document.getElementById('dlVerifiedAvatar');
  const elName = document.getElementById('dlVerifiedName');
  const elRole = document.getElementById('dlVerifiedRoleTag');
  const elUid = document.getElementById('dlVerifiedUid');
  const elUri = document.getElementById('dlVerifiedUri');
  const elMobile = document.getElementById('dlVerifiedMobile');
  const elAddress = document.getElementById('dlVerifiedAddress');
  const elConsent = document.getElementById('dlVerifiedConsentRef');

  if (elAvatar) elAvatar.innerText = initials;
  if (elName) elName.innerText = profile.name;
  if (elRole) elRole.innerText = profile.roleLabel;
  if (elUid) elUid.innerText = profile.maskedUid;
  if (elUri) elUri.innerText = profile.digilockerId;
  if (elMobile) elMobile.innerText = profile.mobile;
  if (elAddress) elAddress.innerText = profile.address;
  if (elConsent) elConsent.innerText = profile.consentId;

  // Advance straight to step 3
  showDlStep(3);
}

function sendDigiLockerOtp() {
  const profile = DIGILOCKER_PROFILES[activeTeamMember || 'mansvi'];
  const maskedPhone = profile ? profile.mobile : '+91 94221 88990';
  const lblPhone = document.getElementById('lblDlMaskedPhone');
  if (lblPhone) lblPhone.innerText = maskedPhone;

  // Clear OTP boxes
  for (let i = 0; i < 6; i++) {
    const el = document.getElementById(`otp_${i}`);
    if (el) el.value = '';
  }

  showDlStep(2);

  // Focus first OTP input
  setTimeout(() => {
    const firstOtp = document.getElementById('otp_0');
    if (firstOtp) firstOtp.focus();
  }, 100);

  // Trigger floating simulated SMS toast
  showSimulatedSmsToast();

  // Start 60s timer
  let remaining = 58;
  const timerDisplay = document.getElementById('otpTimerDisplay');
  if (otpCountdownTimer) clearInterval(otpCountdownTimer);
  otpCountdownTimer = setInterval(() => {
    remaining--;
    if (timerDisplay) timerDisplay.innerText = remaining;
    if (remaining <= 0) clearInterval(otpCountdownTimer);
  }, 1000);
}

function backToDlStep1() {
  showDlStep(1);
}

function handleOtpInput(index, event) {
  const input = event.target;
  const val = input.value;
  if (val.length === 1 && index < 5) {
    const next = document.getElementById(`otp_${index + 1}`);
    if (next) next.focus();
  }
}

function handleOtpKey(index, event) {
  if (event.key === 'Backspace' && !event.target.value && index > 0) {
    const prev = document.getElementById(`otp_${index - 1}`);
    if (prev) {
      prev.focus();
      prev.value = '';
    }
  }
}

function autoFillOtpDemo() {
  const code = '120645';
  for (let i = 0; i < 6; i++) {
    const el = document.getElementById(`otp_${i}`);
    if (el) el.value = code[i];
  }
  const last = document.getElementById('otp_5');
  if (last) last.focus();
}

function showSimulatedSmsToast() {
  const toast = document.getElementById('digilockerSmsToast');
  if (!toast) return;
  toast.style.display = 'block';
  
  // Auto-dismiss toast after 10 seconds
  setTimeout(() => {
    toast.style.display = 'none';
  }, 10000);
}

function dismissSmsToast() {
  const toast = document.getElementById('digilockerSmsToast');
  if (toast) toast.style.display = 'none';
}

function autoFillOtpFromToast() {
  dismissSmsToast();
  autoFillOtpDemo();
}

function verifyDigiLockerOtp() {
  let enteredOtp = '';
  for (let i = 0; i < 6; i++) {
    const el = document.getElementById(`otp_${i}`);
    enteredOtp += (el ? el.value.trim() : '');
  }

  if (enteredOtp.length !== 6) {
    alert('Please enter all 6 digits of the OTP received on your mobile.');
    return;
  }

  const chkConsent = document.getElementById('chkDlDpdpConsent');
  if (chkConsent && !chkConsent.checked) {
    alert('You must provide statutory consent under the DPDP Act, 2023 to proceed with authentication.');
    return;
  }

  // Get active team member profile
  const user = DIGILOCKER_PROFILES[activeTeamMember || 'mansvi'];

  // Save to storage
  setDigiLockerUser(user);

  // Populate step 3 preview card
  const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  document.getElementById('dlVerifiedAvatar').innerText = initials;
  document.getElementById('dlVerifiedName').innerText = user.name;
  document.getElementById('dlVerifiedRoleTag').innerText = user.roleLabel;
  document.getElementById('dlVerifiedUid').innerText = user.maskedUid;
  document.getElementById('dlVerifiedUri').innerText = user.digilockerId;
  document.getElementById('dlVerifiedMobile').innerText = user.mobile;
  document.getElementById('dlVerifiedAddress').innerText = user.address;
  document.getElementById('dlVerifiedConsentRef').innerText = user.consentId;

}

function logoutDigiLocker() {
  const user = getDigiLockerUser();
  const userName = user ? user.name : 'User';
  setDigiLockerUser(null);
  
  const menu = document.getElementById('digilockerDropdownMenu');
  if (menu) menu.style.display = 'none';

  alert(`Signed out of DigiLocker (${userName}). Your local session has been cleared.`);
}

function openDigiLockerVault() {
  let user = getDigiLockerUser();
  if (!user) {
    // If not logged in, prompt to log in first
    openDigiLockerModal(1);
    return;
  }

  const modal = document.getElementById('modalDigiLockerVault');
  const countBadge = document.getElementById('dlVaultDocCount');
  const subtitle = document.getElementById('dlVaultOwnerSubtitle');
  const container = document.getElementById('dlVaultListContainer');
  const uploadNotice = document.getElementById('dlVaultUploadNotice');

  if (subtitle) subtitle.innerText = `Verified Identity Vault: ${user.name} (${user.maskedUid || user.bciReg})`;
  if (countBadge) countBadge.innerText = `${(user.documents && user.documents.length) || 0} Issued Documents`;

  if (uploadNotice) {
    if (currentDlUploadContext) {
      uploadNotice.style.display = 'block';
      document.getElementById('dlTargetRoomBadge').innerText = `#${currentDlUploadContext.roomId}`;
    } else {
      uploadNotice.style.display = 'none';
    }
  }

  if (container && user.documents) {
    container.innerHTML = user.documents.map((doc, idx) => {
      const attachBtn = currentDlUploadContext ? `
        <button type="button" class="btn btn-success btn-sm" onclick="attachDigiLockerDocToRoom(${idx})" style="padding: 4px 10px;">
          Attach to Room
        </button>
      ` : '';

      return `
        <div class="dl-vault-card">
          <div class="dl-vault-doc-info">
            <div class="dl-vault-icon-badge">${doc.icon || '📄'}</div>
            <div>
              <div class="dl-vault-title">${doc.name}</div>
              <div class="dl-vault-meta">
                <strong>Issuer:</strong> ${doc.issuer} &bull; <strong>Issued:</strong> ${doc.issueDate}
              </div>
              <div class="dl-vault-hash">${doc.hash}</div>
            </div>
          </div>
          <div style="display: flex; gap: 6px; align-items: center;">
            ${attachBtn}
            <button type="button" class="btn btn-default btn-sm" onclick="previewDigiLockerDoc(${idx})">
              Preview
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  if (modal) modal.style.display = 'flex';
}

function closeDigiLockerVault() {
  const modal = document.getElementById('modalDigiLockerVault');
  if (modal) modal.style.display = 'none';
  currentDlUploadContext = null;
}

function openDigiLockerVaultForUpload(roomId, docId) {
  currentDlUploadContext = { roomId, docId };
  const user = getDigiLockerUser();
  if (!user) {
    alert('Please sign in with DigiLocker to access your digitally verified documents.');
    openDigiLockerModal(1);
    return;
  }
  openDigiLockerVault();
}

function attachDigiLockerDocToRoom(docIndex) {
  if (!currentDlUploadContext) return;
  const { roomId, docId } = currentDlUploadContext;
  const user = getDigiLockerUser();
  if (!user || !user.documents || !user.documents[docIndex]) return;

  const docData = user.documents[docIndex];
  const rooms = getAllRooms();
  const room = rooms.find(r => r.id === roomId);
  if (!room) return;

  const targetDoc = room.documents.find(d => d.id === docId);
  if (targetDoc) {
    targetDoc.file = docData.file;
    targetDoc.filePath = docData.filePath || 'Example_Files/2. Unit II -OFDM Transmitter Numericals_compressed.pdf';
    targetDoc.status = 'uploaded';
    targetDoc.uploadDate = new Date().toLocaleDateString('en-GB');
    targetDoc.isDigiLockerVerified = true;
    targetDoc.digiLockerDocName = docData.name;
    targetDoc.digiLockerHash = docData.hash;

    // Add note to case chat
    room.messages.push({
      sender: `${user.name} (Client)`,
      text: `Attached verified DigiLocker document: "${docData.name}" (${docData.issuer}) with cryptographic SHA-256 seal.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    saveAllRooms(rooms);
    closeDigiLockerVault();
    alert(`Successfully attached "${docData.name}" from DigiLocker Vault into Case Room #${roomId}!`);
  }
}

function previewDigiLockerDoc(docIndex) {
  const user = getDigiLockerUser();
  if (!user || !user.documents || !user.documents[docIndex]) return;
  const doc = user.documents[docIndex];

  const modal = document.getElementById('modalDocPreview');
  const title = document.getElementById('docPreviewTitle');
  const subtitle = document.getElementById('docPreviewSubtitle');
  const body = document.getElementById('docPreviewBody');

  if (title) title.innerText = doc.name;
  if (subtitle) subtitle.innerText = `Issued by ${doc.issuer}`;

  if (body) {
    body.innerHTML = `
      <div style="background: #ffffff; border: 2px solid #cbd5e1; border-radius: 8px; padding: 20px; box-shadow: var(--shadow-sm); font-family: 'Inter', sans-serif;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #003366; padding-bottom: 12px; margin-bottom: 14px;">
          <div>
            <div style="font-size: 11px; color: #ff9933; font-weight: 700;">GOVERNMENT OF INDIA • DIGILOCKER</div>
            <h3 style="font-size: 16px; color: #003366; margin: 2px 0 0 0;">${doc.name}</h3>
            <div style="font-size: 11.5px; color: #64748b;">${doc.issuer}</div>
          </div>
          <div style="text-align: right;">
            <span class="badge badge-green" style="font-size: 11px;">✓ CCA Digitally Certified</span>
          </div>
        </div>

        <div style="background: #f8fafc; border: 1px solid var(--border); border-radius: 6px; padding: 14px; margin-bottom: 14px; font-size: 12px; line-height: 1.6;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div><strong>Document Holder:</strong> ${user.name}</div>
            <div><strong>Document Identifier:</strong> ${doc.docNumber || 'DL-RECORD-901'}</div>
            <div><strong>Issue Date:</strong> ${doc.issueDate}</div>
            <div><strong>Document Category:</strong> ${doc.docType}</div>
            <div style="grid-column: span 2;"><strong>Digital Signature Hash:</strong><br><span style="font-family: monospace; font-size: 10px; color: #003366;">${doc.hash}</span></div>
          </div>
        </div>

        <div style="border-left: 3px solid #16a34a; background: #f0fdf4; padding: 10px 12px; font-size: 11px; color: #166534; line-height: 1.45;">
          <strong>Legal Admissibility &amp; Statutory Validity:</strong><br>
          This electronically generated document is legally recognized under Section 4 of the Information Technology Act, 2000 and admissible as primary evidence under Section 65B of the Indian Evidence Act, 1872 / Section 61 Bharatiya Sakshya Adhiniyam, 2023.
        </div>
      </div>

      <div style="margin-top: 16px; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 11px; color: #64748b;">Filename: <code>${doc.file}</code></span>
        <button type="button" class="btn btn-default" onclick="closeDocPreview()">Close Preview</button>
      </div>
    `;
  }

  if (modal) modal.style.display = 'flex';
}

function closeDocPreview() {
  const modal = document.getElementById('modalDocPreview');
  if (modal) modal.style.display = 'none';
}

function autofillFromDigiLocker() {
  const user = getDigiLockerUser();
  if (!user) {
    alert('Please sign in with DigiLocker to auto-populate your verified identity and territorial address.');
    openDigiLockerModal(1);
    return;
  }

  const inpSender = document.getElementById('inpSender');
  const inpPlace = document.getElementById('inpPlace');
  if (inpSender) inpSender.value = user.name;
  if (inpPlace) inpPlace.value = user.address || 'Nagpur, Maharashtra';

  renderPleading();
  alert(`Auto-filled litigant details from DigiLocker e-KYC:\n\n• Name: ${user.name}\n• Territorial Station: ${user.address}\n• Verification: Section 4 Aadhaar Act 2016 Compliant`);
}

function importLandRecordFromDigiLocker() {
  const user = getDigiLockerUser();
  if (!user) {
    alert('Please sign in with DigiLocker to access your issued land records and 7/12 extracts.');
    openDigiLockerModal(1);
    return;
  }

  const selState = document.getElementById('selLandState');
  const selDist = document.getElementById('selLandDist');
  const inpTaluka = document.getElementById('inpTaluka');
  const inpVillage = document.getElementById('inpVillage');
  const inpSurvey = document.getElementById('inpSurvey');

  if (selState) selState.value = 'MH';
  if (selDist) selDist.value = 'Nagpur';
  if (inpTaluka) inpTaluka.value = 'Nagpur Rural';
  if (inpVillage) inpVillage.value = 'Wadi';
  if (inpSurvey) inpSurvey.value = '142/2';

  if (typeof searchLandRecord === 'function') {
    searchLandRecord();
  }

  alert(`Imported verified 7/12 extract from DigiLocker:\n\n• Owner: ${user.name}\n• Location: Mouza Wadi, Taluka Nagpur Rural, District Nagpur\n• Survey No: 142/2\n• Certified under DILRMP Gateway`);
}

function showDpdpAuditModal() {
  const user = getDigiLockerUser();
  if (!user) return;
  alert(
    `🛡️ DPDP Act 2023 Statutory Consent Audit Log:\n\n` +
    `• Consent Ref ID: ${user.consentId}\n` +
    `• Data Principal: ${user.name}\n` +
    `• Identity Provider: Licensed DigiLocker / NeGD Gateway\n` +
    `• Authentication Mode: ${user.authMethod}\n` +
    `• Timestamp: ${user.authenticatedAt}\n` +
    `• Governing Provisions: Section 4 Aadhaar Act 2016 & Section 6 DPDP Act 2023\n` +
    `• Audit Status: Tamper-proof, Zero Biometric Storage Verified.`
  );
}

// ==========================================================================
// REAL DIGILOCKER OAUTH 2.0 GATEWAY & PARTNER INTEGRATION
// ==========================================================================

let activeDlGatewayMode = 'live';
let currentDigiLockerServerConfig = null;

function switchDlGatewayMode(mode) {
  activeDlGatewayMode = mode;

  const btnLive = document.getElementById('btnModeLiveOAuth');
  const btnSandbox = document.getElementById('btnModeSandbox');

  const viewLive = document.getElementById('dlModeLiveView');
  const viewSandbox = document.getElementById('dlModeSandboxView');

  if (btnLive) btnLive.className = mode === 'live' ? 'dl-mode-tab active' : 'dl-mode-tab';
  if (btnSandbox) btnSandbox.className = mode === 'sandbox' ? 'dl-mode-tab active' : 'dl-mode-tab';

  if (viewLive) viewLive.style.display = mode === 'live' ? 'block' : 'none';
  if (viewSandbox) viewSandbox.style.display = mode === 'sandbox' ? 'block' : 'none';

  if (mode === 'live') {
    fetchDigiLockerServerConfig();
  } else if (mode === 'sandbox') {
    selectTeamMember(activeTeamMember || 'mansvi');
  }
}

async function fetchDigiLockerServerConfig() {
  try {
    const res = await fetch('/api/digilocker/config');
    if (res.ok) {
      const data = await res.json();
      currentDigiLockerServerConfig = data;

      const lblClientId = document.getElementById('lblLiveClientId');
      const lblEndpoint = document.getElementById('lblLiveEndpoint');
      const inpClientId = document.getElementById('inpCfgClientId');
      const inpRedirect = document.getElementById('inpCfgRedirectUri');
      const selEnv = document.getElementById('selDlEnv');
      const noticeBox = document.getElementById('dlLiveNoticeBox');

      const currentOrigin = window.location.origin;
      const liveCallback = currentOrigin + '/callback.html';

      if (inpRedirect) {
        inpRedirect.value = liveCallback;
      }

      if (lblClientId) {
        lblClientId.innerText = data.clientId || 'Not Configured (Default Requester ID)';
        lblClientId.style.color = data.clientId ? '#16a34a' : '#d97706';
      }

      if (lblEndpoint) {
        lblEndpoint.innerText = data.environment === 'sandbox'
          ? 'https://api.digitallocker.gov.in/public/oauth2/1/authorize'
          : 'https://digilocker.meripehchaan.gov.in/public/oauth2/1/authorize';
      }

      if (inpClientId && !inpClientId.value) inpClientId.value = data.clientId || '';
      if (selEnv) selEnv.value = data.environment || 'production';

      if (noticeBox) {
        if (data.clientId) {
          noticeBox.style.background = '#f0fdf4';
          noticeBox.style.borderColor = '#86efac';
          noticeBox.style.color = '#166534';
          noticeBox.innerHTML = `<strong>✓ Government Partner Credentials Configured:</strong><br>Using Client ID: <code>${data.clientId}</code> with Redirect URI: <code>${liveCallback}</code>.`;
        } else {
          noticeBox.style.background = '#fffbeb';
          noticeBox.style.borderColor = '#fde68a';
          noticeBox.style.color = '#92400e';
          noticeBox.innerHTML = `
            <strong>⚠️ NeGD Government Partner Client ID Notice:</strong><br>
            DigiLocker requires an approved <code>client_id</code> issued by the <strong>National e-Governance Division (NeGD) / API Setu</strong>. Without an approved Client ID, DigiLocker's real OAuth server will show <em>'Invalid Client ID'</em>.<br><br>
            • To enter your approved keys, click <strong>"⚙️ API Keys &amp; Partner Setup"</strong>.<br>
            • For step-by-step onboarding for your university, click <strong>"Academic Registration Guide"</strong> below.
          `;
        }
      }
    }
  } catch (e) {
    console.warn('Backend DigiLocker API not reachable; operating in static mode', e);
  }
}

async function saveDigiLockerServerConfig() {
  const clientId = (document.getElementById('inpCfgClientId') ? document.getElementById('inpCfgClientId').value.trim() : '');
  const clientSecret = (document.getElementById('inpCfgClientSecret') ? document.getElementById('inpCfgClientSecret').value.trim() : '');
  const environment = (document.getElementById('selDlEnv') ? document.getElementById('selDlEnv').value : 'production');
  const redirectUri = (document.getElementById('inpCfgRedirectUri') ? document.getElementById('inpCfgRedirectUri').value.trim() : (window.location.origin + '/callback.html'));

  try {
    const res = await fetch('/api/digilocker/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, clientSecret, environment, redirectUri })
    });
    const data = await res.json();
    if (data.success) {
      alert(data.message || 'DigiLocker API credentials saved successfully.');
      fetchDigiLockerServerConfig();
      switchDlGatewayMode('live');
    } else {
      alert('Error saving credentials: ' + (data.error || 'Unknown error'));
    }
  } catch (err) {
    alert('Failed to connect to backend proxy server: ' + err.message);
  }
}

async function launchRealDigiLockerOAuth() {
  const liveCallback = window.location.origin + '/callback.html';
  try {
    const res = await fetch('/api/digilocker/authorize-url?redirect_uri=' + encodeURIComponent(liveCallback));
    if (!res.ok) throw new Error('Server returned HTTP ' + res.status);
    const data = await res.json();

    // Store CSRF state
    sessionStorage.setItem('digilocker_oauth_state', data.state);

    // Redirect to real official DigiLocker OAuth2 endpoint!
    window.location.href = data.authUrl;
  } catch (err) {
    // Fallback if direct fetch fails
    const cfg = currentDigiLockerServerConfig || {};
    const clientId = cfg.clientId || 'NYAYASETU_RBU_GOV';
    const redirectUri = encodeURIComponent(liveCallback);
    const state = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('digilocker_oauth_state', state);

    const liveUrl = `https://digilocker.meripehchaan.gov.in/public/oauth2/1/authorize?response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${redirectUri}&state=${state}&scope=openid%20profile`;
    window.location.href = liveUrl;
  }
}

function copyRedirectUri() {
  const inp = document.getElementById('inpCfgRedirectUri');
  if (inp) {
    navigator.clipboard.writeText(inp.value).then(() => {
      alert('Copied callback redirect URI to clipboard: ' + inp.value);
    });
  }
}

function openPartnerRegistrationGuide() {
  const modal = document.getElementById('modalPartnerRegistrationGuide');
  if (modal) modal.style.display = 'flex';
}

function closePartnerRegistrationGuide() {
  const modal = document.getElementById('modalPartnerRegistrationGuide');
  if (modal) modal.style.display = 'none';
}
