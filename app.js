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
    'assistant': 'AI Legal & Tax Literacy Assistant',
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
          fileContent = `
            <div style="font-size: 11px; margin-top: 4px; color: #333;">
              Attached: <a href="${doc.filePath}" target="_blank" style="font-weight: bold; text-decoration: underline;">${doc.file}</a>
              <span style="color: #666; font-size: 10px;">(Uploaded: ${doc.uploadDate || 'Recently'})</span>
            </div>
          `;
        }

        let uploadControls = '';
        if (doc.status === 'pending_upload' || doc.status === 'rejected') {
          uploadControls = `
            <div style="margin-top: 8px; background: #fafafa; border: 1px dashed #bbb; padding: 8px;">
              <div style="font-size: 11px; font-weight: bold; margin-bottom: 4px;">Upload Document:</div>
              <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
                <select id="exampleSel_${doc.id}" style="font-size: 11px; padding: 3px; max-width: 250px;">
                  <option value="">-- Choose from Example_Files folder --</option>
                  <option value="Example_Files/2. Unit II -OFDM Transmitter Numericals_compressed.pdf">2. Unit II -OFDM Transmitter Numericals_compressed.pdf</option>
                  <option value="Example_Files/AI_in_Modeling_Unit II.pptx">AI_in_Modeling_Unit II.pptx</option>
                  <option value="Example_Files/Unit -1 AI in SDLC.pptx">Unit -1 AI in SDLC.pptx</option>
                </select>
                <span style="font-size: 11px; color: #777;">or</span>
                <input type="file" id="localFile_${doc.id}" style="font-size: 11px; width: 140px;">
                <button type="button" class="btn btn-primary btn-sm" onclick="handleClientUpload('${room.id}', ${doc.id})">Upload File</button>
              </div>
            </div>
          `;
        }

        html += `
          <div style="border: 1px solid #ccd1d9; background: #ffffff; padding: 10px; margin-bottom: 10px; border-left: 3px solid ${doc.status === 'accepted' ? '#138808' : (doc.status === 'rejected' ? '#c5221f' : '#003366')};">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <strong style="font-size: 13px; color: #003366;">${doc.name}</strong>
                <div style="font-size: 11px; color: #666;">Requested Due Date: <strong>${doc.dueDate}</strong></div>
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

        const fileLink = doc.file 
          ? `<a href="${doc.filePath}" target="_blank" style="font-weight: bold;">${doc.file}</a><br><small style="color: #666;">Uploaded: ${doc.uploadDate || 'Recently'}</small>`
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

const LEGAL_CASES = {
  cheque: {
    act: "Negotiable Instruments Act, 1881 & Bharatiya Nyaya Sanhita, 2023",
    title: "Dishonour of Cheque for Insufficiency of Funds",
    summary: "When a cheque drawn for discharge of a legally enforceable debt is returned unpaid by the bank due to insufficient funds, criminal liability is attracted under Section 138 of the NI Act.",
    sections: ["Section 138 NI Act (Cheque Dishonour)", "Section 142 NI Act (Cognizance)", "Section 316 BNS (Cheating)"],
    limitation: "30 Days from receipt of Bank Return Memo to issue Legal Demand Notice. 15 days cure window.",
    court: "Court of Judicial Magistrate First Class (JMFC) having territorial jurisdiction over payee bank branch.",
    remedies: [
      "Obtain original dishonoured cheque and bank return memo stating 'Funds Insufficient'.",
      "Issue a formal statutory demand notice via Registered Post AD within 30 days of receiving memo.",
      "Give the drawer 15 statutory days from receipt to make payment.",
      "If unpaid after 15 days, file a criminal complaint in JMFC court within the next 30 days."
    ],
    docType: "sec138",
    sender: "Dev Jain",
    recipient: "Rajesh Sharma (Prop. Sharma Enterprises)",
    particulars: "Cheque No. 448912 dated 10-08-2026 for INR 1,50,000 drawn on HDFC Bank",
    grievance: "Returned unpaid with memo dated 14-08-2026 citing 'Funds Insufficient'. Outstanding liability has remained unpaid despite demands."
  },
  tenant: {
    act: "Transfer of Property Act, 1882 & Maharashtra Rent Control Act, 1999",
    title: "Unlawful Withholding of Tenancy Security Deposit",
    summary: "A landlord has no legal right to arbitrarily withhold the tenant's security deposit after peaceful handover of vacant possession upon expiration of lease or mutual notice.",
    sections: ["Section 108(m) Transfer of Property Act", "Maharashtra Rent Control Act Sec 15", "Section 318 BNS (Criminal Breach of Trust)"],
    limitation: "3 Years under Article 22 of Limitation Act, 1963 from the date of handover of possession.",
    court: "Small Causes Court / Civil Court Senior Division or Rent Authority.",
    remedies: [
      "Collect move-in/move-out inspection notes, handover receipt, and bank rent statements.",
      "Issue a formal 15-day legal notice demanding refund of security deposit with 18% p.a. interest.",
      "If deposit is not refunded, file a Summary Civil Suit under Order 37 CPC for debt recovery."
    ],
    docType: "eviction",
    sender: "Mansvi Khupse",
    recipient: "Harishankar Agarwal (Landlord, Flat 402, Green Valley)",
    particulars: "Refund of Interest-Free Security Deposit of Rs 85,000 for Flat 402",
    grievance: "Vacant possession handed over on 31-07-2026 with clean handover certificate. Landlord unlawfully withholding deposit without itemized repair bill."
  },
  consumer: {
    act: "Consumer Protection Act, 2019 (CPA 2019)",
    title: "Supply of Defective Goods & Deficiency of Service",
    summary: "Selling defective electronic devices, refusing warranty repairs, or unfair trade practice gives the consumer a statutory right to seek replacement, refund, and compensation.",
    sections: ["Section 2(11) CPA 2019 (Deficiency)", "Section 35 CPA 2019 (Filing of Complaint)", "Section 84 CPA 2019 (Product Liability)"],
    limitation: "Strictly 2 Years from the date on which cause of action arose (Section 69, CPA 2019).",
    court: "District Consumer Disputes Redressal Commission (Claims up to INR 50 Lakhs).",
    remedies: [
      "Keep original tax invoice, warranty card, and service center rejection job-sheets.",
      "Lodge grievance on National Consumer Helpline (NCH portal / 1915).",
      "Issue 15-day Consumer Notice demanding replacement or refund with damages.",
      "File online complaint on e-Daakhil without hiring a lawyer."
    ],
    docType: "consumer",
    sender: "Swati Kundu",
    recipient: "Apex Mobile Technologies Ltd. & Retailer Smart Electronics",
    particulars: "Smartphone Model Z-Pro (IMEI: 8901238491) purchased for INR 48,999",
    grievance: "Motherboard failed within 45 days of purchase. Service center refused warranty citing unverified physical damage despite pristine condition."
  },
  cyber: {
    act: "Information Technology Act, 2000 & Bharatiya Nyaya Sanhita, 2023",
    title: "Unauthorized UPI Payment & Cyber Financial Fraud",
    summary: "Victims of unauthorized electronic banking transactions have zero liability if reported to the bank and National Cyber Crime Portal (1930) within 3 days of occurrence.",
    sections: ["Section 66D IT Act (Cheating by Impersonation)", "Section 318(4) BNS (Cyber Cheating)", "RBI Circular DBR.No.Leg.BC.78/2017-18"],
    limitation: "Golden Hour: Report within 2 to 24 hours to freeze mule accounts.",
    court: "Cyber Crime Police Station & Adjudicating Officer under Sec 46 of IT Act / Banking Ombudsman.",
    remedies: [
      "Immediately dial 1930 (National Cyber Crime Helpline) to freeze fraudulent transactions.",
      "Register formal acknowledgement on cybercrime.gov.in.",
      "Submit written dispute to the issuing bank within 72 hours claiming Zero Liability under RBI guidelines."
    ],
    docType: "affidavit",
    sender: "Chinta Bhumika Reddy",
    recipient: "Nodal Cyber Crime Officer & Bank Branch Manager",
    particulars: "Fraudulent UPI Debit of INR 30,000 via malicious APK",
    grievance: "Received electricity disconnection SMS. Remote screen share app triggered unauthorized UPI debit transfers."
  },
  tax: {
    act: "Income-tax Act, 1961 (Direct Taxes)",
    title: "Intimation & Demand Notice under Section 143(1)",
    summary: "A computerized tax demand under Sec 143(1) occurs when there is a mismatch between TDS in Form 26AS/AIS and deductions claimed in ITR. The taxpayer has 30 days to respond online.",
    sections: ["Section 143(1) Income Tax Act", "Section 154 (Rectification of Mistake)", "Section 246A (Appeal to CIT Appeals)"],
    limitation: "30 Days from date of service of notice to submit online response on e-filing portal.",
    court: "Centralized Processing Centre (CPC), Bengaluru & Assessing Officer / CIT (Appeals).",
    remedies: [
      "Download Section 143(1) Intimation order sheet and compare with filed ITR-1/2.",
      "Check Form 26AS and AIS for missing TDS credits from employer or bank.",
      "Submit online response on incometax.gov.in selecting 'Disagree with Demand' with reasons.",
      "File an online Rectification Application under Section 154."
    ],
    docType: "affidavit",
    sender: "Dev Jain",
    recipient: "The Centralized Processing Centre (CPC), Income Tax Department, Bengaluru",
    particulars: "Notice of Demand u/s 143(1) for A.Y. 2025-26 amounting to INR 34,200",
    grievance: "CPC disallowed 80C deduction of PPF and LIC premium already declared in original ITR, resulting in artificial tax demand."
  },
  rti: {
    act: "Right to Information Act, 2005 (Central Act 22 of 2005)",
    title: "RTI for Delayed Public Works / Municipal Road Construction",
    summary: "Under Section 6(1) of the RTI Act, every citizen is entitled to inspect government works, obtain certified copies of contracts, measurement books (MB), and contractor payment vouchers.",
    sections: ["Section 6(1) RTI Act (Request for Information)", "Section 7(1) (30-Day Mandatory Disposal)", "Section 19(1) (First Appeal)"],
    limitation: "30 Days for Public Information Officer (PIO) to furnish information. 48 hours for Life/Liberty.",
    court: "Public Information Officer (PIO) / First Appellate Authority / State Information Commission (SIC).",
    remedies: [
      "Draft a Form A RTI application specifying questions and tender reference.",
      "Affix statutory fee of Rs 10 (Court Fee Stamp or Indian Postal Order).",
      "Submit to designated PIO via Registered Post AD.",
      "If no reply is received within 30 days, file First Appeal under Section 19(1)."
    ],
    docType: "rti",
    sender: "Dev Jain",
    recipient: "The Public Information Officer (PIO), Municipal Corporation, Nagpur",
    particulars: "Tender No. NMC/PWD/ROAD/2025-26/14 regarding Ward 12 Road Resurfacing",
    grievance: "Road resurfacing was tendered for INR 1.2 Crores with completion date of May 2026. Construction abandoned midway causing extreme waterlogging."
  }
};

let selectedCaseKey = 'cheque';

function loadCase(key) {
  selectedCaseKey = key;
  const item = LEGAL_CASES[key];
  if (!item) return;

  document.getElementById('txtUserQuery').value = item.summary;
  renderAnalysis(item);
}

function clearQueryInput() {
  document.getElementById('txtUserQuery').value = '';
}

function processLegalQuery() {
  const q = document.getElementById('txtUserQuery').value.toLowerCase();
  let matched = 'cheque';

  if (q.includes('tenant') || q.includes('deposit') || q.includes('rent') || q.includes('landlord') || q.includes('घरमालक')) {
    matched = 'tenant';
  } else if (q.includes('mobile') || q.includes('phone') || q.includes('warranty') || q.includes('defective') || q.includes('खराब')) {
    matched = 'consumer';
  } else if (q.includes('cyber') || q.includes('upi') || q.includes('fraud') || q.includes('scam')) {
    matched = 'cyber';
  } else if (q.includes('tax') || q.includes('143') || q.includes('tds') || q.includes('income')) {
    matched = 'tax';
  } else if (q.includes('rti') || q.includes('road') || q.includes('municipal') || q.includes('tender')) {
    matched = 'rti';
  } else if (q.includes('cheque') || q.includes('bounce') || q.includes('138') || q.includes('चेक')) {
    matched = 'cheque';
  }

  selectedCaseKey = matched;
  renderAnalysis(LEGAL_CASES[matched]);
}

function renderAnalysis(item) {
  const container = document.getElementById('analysisResultArea');
  if (!container) return;

  const sectionsHtml = item.sections.map(s => `<span style="background: #eef2f7; border: 1px solid #ccd1d9; padding: 2px 6px; font-family: monospace; font-size: 11px; margin-right: 4px; display: inline-block;">${s}</span>`).join(' ');
  const stepsHtml = item.remedies.map(r => `<li>${r}</li>`).join('');

  container.innerHTML = `
    <div style="border-left: 3px solid #003366; padding-left: 10px; margin-bottom: 12px;">
      <span style="font-size: 10px; font-weight: bold; color: #003366; text-transform: uppercase; background: #e8f0fe; padding: 2px 5px;">${item.act}</span>
      <h3 style="font-size: 14px; color: #003366; margin: 4px 0;">${item.title}</h3>
      <p style="font-size: 12px; color: #333;">${item.summary}</p>
      <div style="margin-top: 6px;">${sectionsHtml}</div>
    </div>

    <table class="gov-table" style="margin-bottom: 12px;">
      <tbody>
        <tr>
          <td style="width: 35%; font-weight: bold;">Statutory Limitation:</td>
          <td>${item.limitation}</td>
        </tr>
        <tr>
          <td style="font-weight: bold;">Competent Court / Forum:</td>
          <td>${item.court}</td>
        </tr>
      </tbody>
    </table>

    <fieldset>
      <legend>Recommended Actionable Steps</legend>
      <ol style="padding-left: 18px; font-size: 12px; color: #222; line-height: 1.6;">
        ${stepsHtml}
      </ol>
    </fieldset>
  `;
}

function transferToDrafter() {
  const item = LEGAL_CASES[selectedCaseKey];
  if (!item) return;

  document.getElementById('selectDocType').value = item.docType;
  document.getElementById('inpSender').value = item.sender;
  document.getElementById('inpRecipient').value = item.recipient;
  document.getElementById('inpParticulars').value = item.particulars;
  document.getElementById('inpGrievance').value = item.grievance;

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

function addVoiceBubble(userText, isVoice) {
  const log = document.getElementById('voiceChatLog');
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const userRow = document.createElement('div');
  userRow.className = 'chat-row user';
  userRow.innerHTML = `
    ${isVoice ? '<strong>[Voice Input]</strong> ' : ''}${userText}
    <div class="chat-time">${time}</div>
  `;
  log.appendChild(userRow);
  log.scrollTop = log.scrollHeight;

  setTimeout(() => {
    let reply = "";
    let spoken = "";

    if (userText.includes('डिपॉझिट') || userText.includes('घरमालक') || userText.includes('deposit')) {
      reply = `<strong>महाराष्ट्र भाडे नियंत्रण कायदा, १९९९:</strong><br>घरमालक घर सोडल्यानंतर अनामत रक्कम अडवू शकत नाही.<br>१. १५ दिवसांची कायदेशीर नोटीस पाठवा.<br>२. पैसे न मिळाल्यास लघुवाद न्यायालयात दावा करता येतो.`;
      spoken = "महाराष्ट्र भाडे नियंत्रण कायद्यानुसार घरमालक डिपॉझिट अडवू शकत नाही. १५ दिवसांची कायदेशीर नोटीस पाठवा.";
    } else if (userText.includes('चेक') || userText.includes('बाउंस') || userText.includes('cheque')) {
      reply = `<strong>परक्राम्य संलेख अधिनियम (कलम १३८):</strong><br>चेक बाउंस झाल्यास तो फौजदारी गुन्हा आहे.<br>बँक मेमो मिळाल्यापासून ३० दिवसांच्या आत लीगल नोटीस पाठवणे बंधनकारक आहे.`;
      spoken = "चेक बाउंस होने पर बैंक मेमो मिलने के 30 दिनों के अंदर सेक्शन 138 की लीगल नोटिस भेजना अनिवार्य है।";
    } else if (userText.includes('खराब') || userText.includes('मोबाइल') || userText.includes('consumer')) {
      reply = `<strong>उपभोक्ता संरक्षण कानून, 2019:</strong><br>खराब सामान बेचने पर रिफंड या रिप्लेसमेंट का अधिकार है। 1915 पर शिकायत करें या e-Daakhil पर केस दर्ज करें।`;
      spoken = "उपभोक्ता संरक्षण कानून के तहत खराब उत्पाद के बदले रिफंड का अधिकार है। आप 1915 पर शिकायत कर सकते हैं।";
    } else {
      reply = `<strong>माहितीचा अधिकार कायदा (RTI Act 2005):</strong><br>कलम ६(१) अंतर्गत अर्ज सादर करा. जन माहिती अधिकाऱ्याने (PIO) ३० दिवसांत माहिती देणे बंधनकारक आहे.`;
      spoken = "RTI Act allows you to inspect public works. Information must be provided within thirty days.";
    }

    const botRow = document.createElement('div');
    botRow.className = 'chat-row bot';
    botRow.innerHTML = `
      ${reply}
      <div style="margin-top: 5px;">
        <button type="button" class="btn btn-default btn-sm" onclick="speakAudio('${encodeURIComponent(spoken)}')">Play Audio (Bhashini TTS)</button>
      </div>
      <div class="chat-time">${time}</div>
    `;
    log.appendChild(botRow);
    log.scrollTop = log.scrollHeight;

    speakAudio(encodeURIComponent(spoken));
  }, 800);
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

function fillCNR(cnr) {
  document.getElementById('inpCNR').value = cnr;
  lookupCaseCNR();
}

function lookupCaseCNR() {
  const cnr = document.getElementById('inpCNR').value.trim().toUpperCase();
  const c = SAMPLE_CASES[cnr] || {
    title: `Civil / Criminal Case (CNR: ${cnr})`,
    court: "District Court Complex (Verified via NJDG)",
    status: "Sub-Judice",
    filingDate: "10-01-2025",
    petitioner: "Petitioner / Complainant",
    respondent: "Respondent / Defendant",
    acts: "Code of Civil Procedure / Special Acts",
    judge: "Presiding Judicial Officer",
    nextHearing: "15-10-2026 (Court Hall 2)",
    order: "Case is listed on the cause list for regular hearing. Notice issued to unserved parties.",
    history: [
      { date: "10 Jan 2025", stage: "Filing", detail: "CNR generated and registered in CIS database." },
      { date: "15 Oct 2026", stage: "Next Hearing", detail: "Regular cause list hearing." }
    ]
  };

  document.getElementById('caseTitleDisplay').innerText = c.title;
  document.getElementById('caseStatusBadge').innerText = c.status;
  document.getElementById('courtNameDisplay').innerText = c.court;
  document.getElementById('filingDateDisplay').innerText = c.filingDate;
  document.getElementById('petitionerDisplay').innerText = c.petitioner;
  document.getElementById('respondentDisplay').innerText = c.respondent;
  document.getElementById('actsDisplay').innerText = c.acts;
  document.getElementById('judgeDisplay').innerText = c.judge;
  document.getElementById('nextHearingDisplay').innerText = c.nextHearing;
  document.getElementById('orderSheetDisplay').innerText = `"${c.order}"`;

  const tbody = document.getElementById('historyTableBody');
  tbody.innerHTML = c.history.map(h => `
    <tr>
      <td style="font-weight: bold; width: 25%;">${h.date}</td>
      <td style="width: 35%; color: #003366;">${h.stage}</td>
      <td>${h.detail}</td>
    </tr>
  `).join('');
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
  renderAnalysis(LEGAL_CASES['cheque']);
  renderPleading();
  lookupCaseCNR();
  runLimitationCalc();
  initCountdown();
  renderClientRoom();
  renderLawyerRoom();
});
