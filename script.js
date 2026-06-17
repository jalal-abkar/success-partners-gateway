// script.js - UI interactions and simple client-side behavior (no backend)

function previewSchoolLogo(event) {
  const file = event.target.files[0];
  if (!file) return;
  const img = document.getElementById('chosenLogoImg');
  const icon = document.getElementById('logoIcon');
  const hint = document.getElementById('logoTextHint');
  const reader = new FileReader();
  reader.onload = function(e) {
    img.src = e.target.result;
    img.style.display = 'block';
    icon.style.display = 'none';
    hint.style.display = 'none';
  }
  reader.readAsDataURL(file);
}

function toggleLanguage(lang){
  // Simple placeholder: change direction and some labels
  if(lang === 'en'){
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
    document.getElementById('loginText').innerText = 'Google Sign In';
  } else {
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
    document.getElementById('loginText').innerText = 'دخول Google';
  }
}

function switchRole(role){
  document.querySelectorAll('.nav-tab').forEach(btn=>btn.classList.remove('active'));
  const tabs = Array.from(document.querySelectorAll('.nav-tab'));
  const index = {guest:0, admin:1, teacher:2, student:3}[role]||0;
  tabs[index] && tabs[index].classList.add('active');
  // Placeholder: show alert for roles
  console.log('Switched role to', role);
}

function executeSmartSearch(){
  const q = document.getElementById('searchName').value.trim().toLowerCase();
  const cls = document.getElementById('searchClass').value;
  const out = document.getElementById('searchResults');
  if(!q && !cls){ out.innerHTML = '<p style="color:#666">لا توجد نتائج للعرض</p>'; return; }
  // demo static data
  const demo = [
    {name:'جلال أحمد محمد',class:'A'},
    {name:'سارة علي',class:'B'},
    {name:'محمد حسن',class:'C'}
  ];
  const filtered = demo.filter(i=> (q? i.name.includes(q) : true) && (cls? i.class===cls : true));
  out.innerHTML = filtered.map(i=>`<div class="result-item"><strong>${i.name}</strong> — الشعبة ${i.class}</div>`).join('') || '<p style="color:#666">لم يعثر على نتائج</p>';
}

function submitExam(e){
  e.preventDefault();
  const val = document.querySelector('input[name="q1"]:checked');
  const feedback = document.getElementById('examFeedback');
  const gradeResult = document.getElementById('gradeResult');
  if(!val){ alert('اختر إجابة ثم أرسل'); return; }
  if(val.value === 'correct'){
    gradeResult.innerText = 'النتيجة: 100% — متميز. تم إصدار شهادة رقمية.';
  } else {
    gradeResult.innerText = 'النتيجة: 0% — حاول مرة أخرى.';
  }
  feedback.style.display = 'block';
}

function speakTextNow(){
  const text = document.getElementById('textToSpeak').value;
  if(!text) return alert('أدخل نصاً ليتم نطقه');
  if('speechSynthesis' in window){
    const ut = new SpeechSynthesisUtterance(text);
    ut.lang = document.documentElement.lang || 'ar';
    speechSynthesis.cancel();
    speechSynthesis.speak(ut);
  } else alert('ميزة النطق غير مدعومة في متصفحك');
}

let recognition;
function startSpeechRecognition(){
  const output = document.getElementById('speechOutput');
  if(!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)){
    output.innerText = 'التعرف الصوتي غير مدعوم في متصفحك.'; return;
  }
  const RecClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new RecClass();
  recognition.lang = document.documentElement.lang || 'ar';
  recognition.interimResults = false;
  recognition.onresult = (ev)=>{
    const transcript = ev.results[0][0].transcript;
    output.innerText = transcript;
  }
  recognition.onerror = (ev)=>{ output.innerText = 'خطأ في التعرف الصوتي'; }
  recognition.start();
}

function switchChannel(channel){
  document.getElementById('currentChannelTitle').innerHTML = `<i class='fa-solid fa-hashtag'></i> ${channel}`;
  document.querySelectorAll('.channel-item').forEach(li=>li.classList.remove('active'));
  document.querySelectorAll('.channel-item').forEach(li=>{ if(li.innerText.includes(channel) || li.getAttribute('onclick').includes(channel)) li.classList.add('active'); });
}

function startVoiceCall(){ alert('بدء اتصال صوتي (تجريبي) — تحتاج تكامل WebRTC أو خدمة خارجية)'); }
function startVideoCall(){ alert('بدء اتصال فيديو (تجريبي) — تحتاج تكامل WebRTC أو خدمة خارجية)'); }

function sendChatMessage(e){
  e.preventDefault();
  const text = document.getElementById('chatMessageText').value.trim();
  if(!text) return;
  const box = document.getElementById('chatMessagesBox');
  const row = document.createElement('div'); row.className='message-row user';
  row.innerHTML = `<div class="msg"><strong>أنت:</strong> ${escapeHtml(text)}</div>`;
  box.appendChild(row);
  box.scrollTop = box.scrollHeight;
  document.getElementById('chatMessageText').value = '';
}

function submitSecureComplaint(e){
  e.preventDefault();
  const sender = document.getElementById('complaintSender').value || 'مجهول';
  const text = document.getElementById('complaintText').value.trim();
  if(!text) return alert('اكتب نص الشكوى');
  // For demo: store encrypted text in localStorage (simple reversible base64) — replace with real encryption/server later
  const key = btoa('spg-secret-key');
  const payload = {from:sender,date:new Date().toISOString(),text:btoa(text)};
  const items = JSON.parse(localStorage.getItem('complaints')||'[]');
  items.push(payload);
  localStorage.setItem('complaints', JSON.stringify(items));
  alert('تم إرسال الشكوى مشفّرة (تجريبي). سيتم تسليمها للمدير عند الربط بالخادم.');
  document.getElementById('complaintForm').reset();
}

function triggerGoogleAuth(){
  // Placeholder: real sign-in requires Firebase SDK integration from /src helpers
  alert('للاشتراك يجب ربط Firebase Google Sign-In. قمت بإضافة helpers في /src. انقل القيم إلى src/firebase-config.js أو اضبط env vars ثم ادمج الفرع.');
}

function escapeHtml(str){ return str.replace(/[&<>"']/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]; }); }

// initialize
document.addEventListener('DOMContentLoaded', ()=>{ executeSmartSearch(); });
