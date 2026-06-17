/* ==========================================================================
   بوابة شركاء النجاح - ملف التشغيل والحركات والذكاء الاصطناعي (script.js)
   تطوير وتصميم المستشار: جلال أحمد محمد أبكر
   ========================================================================== */

// 1. نظام التبديل الذكي بين الصلاحيات والرتب (مدير، معلم، طالب، زائر)
function switchRole(role) {
  // إزالة النشاط من جميع الأزرار
  document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));

  // إضافة النشاط للزر الذي تم الضغط عليه (آمن عند وجود حدث)
  const evt = window.event;
  if (evt && evt.target) evt.target.classList.add('active');

  const label = role === 'admin' ? 'لوحة الإدارة العليا' : role === 'teacher' ? 'شاشة المعلمين' : role === 'student' ? 'بوابة الطلاب والنتائج' : 'الصفحة الرئيسية';
  alert(`تم التبديل بنجاح إلى صلاحيات: ${label}`);
}

// 2. محرك البحث المدرسي السريع الفوري
function executeSmartSearch() {
  const nameInput = (document.getElementById('searchName')?.value || '').toLowerCase();
  const classSelect = document.getElementById('searchClass')?.value || '';
  const resultsBox = document.getElementById('searchResults');

  if (!resultsBox) return;

  if (nameInput === "" && classSelect === "") {
    resultsBox.innerHTML = '';
    return;
  }

  // محاكاة سريعة لنتائج البحث الذكية متوافقة مع الأنظمة العالمية
  resultsBox.innerHTML = `
    <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; margin-top: 10px; border-right: 3px solid #238636;">
      <i class="fa-solid fa-circle-check" style="color: #2ea44f;"></i>
      جاري تصفية البحث عن (${nameInput || 'كل الأسماء'}) في شعبة (${classSelect || 'كل الشعب'})... النتيجة مطابقة للنظام الدولي للطلاب.
    </div>
  `;
}

// 3. رفع الشعار الاختياري ومعاينته فوراً في الهوية الحكومية
function previewSchoolLogo(event) {
  const file = event?.target?.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function () {
    const output = document.getElementById('chosenLogoImg');
    if (output) {
      output.src = reader.result;
      output.style.display = 'block';
    }
    const icon = document.getElementById('logoIcon');
    const hint = document.getElementById('logoTextHint');
    if (icon) icon.style.display = 'none';
    if (hint) hint.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

// 4. نظام الدخول الموحد الآمن عبر Google (مؤقت - يحتاج تكامل Firebase)
function triggerGoogleAuth() {
  alert("لإتمام عملية الدخول الرجاء إعداد Firebase Google Sign-In وفق التعليمات في README. تم إضافة helpers في /src.");
}

// 5. نظام التبديل بين اللغات (العربية والانجليزية)
function toggleLanguage(lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  if (lang === 'en') {
    document.getElementById('loginText') && (document.getElementById('loginText').innerText = 'Google Sign In');
    alert('Interface switched to International English Profile');
  } else {
    document.getElementById('loginText') && (document.getElementById('loginText').innerText = 'دخول Google');
    alert('تم تحويل الواجهة المتقدمة إلى العربية بامتياز');
  }
}

// 6. منصة الاختبارات الفورية والتصحيح التلقائي بالذكاء الاصطناعي (محاكاة)
function submitExam(event) {
  event.preventDefault();
  const form = document.getElementById('studentExamForm');
  if (!form) return;
  const q1 = form.elements['q1'] ? form.elements['q1'].value : null;
  const feedbackArea = document.getElementById('examFeedback');
  const gradeResult = document.getElementById('gradeResult');

  if (feedbackArea) feedbackArea.style.display = 'block';
  if (!gradeResult) return;

  if (q1 === 'correct') {
    gradeResult.innerHTML = `<span style="color: #2ea44f; font-weight: bold;">النتيجة: 100% (ممتاز مرتفع)</span><br>تم رصد الدرجة فوراً وإرسالها للسجل الموحد بنجاح.`;
  } else {
    gradeResult.innerHTML = `<span style="color: #f85149; font-weight: bold;">النتيجة: 0% (تحتاج مراجعة الدرس)</span><br>حاول مجدداً لتنشيط المراجعة الصوتية الفورية.`;
  }
}

// 7. النطق الآلي للدروس (الذكاء الاصطناعي الصوتي المتحدث - Text-to-Speech)
function speakTextNow() {
  const text = document.getElementById('textToSpeak')?.value || '';
  if (text.trim() === "") {
    alert("فضلاً، اكتب أو الصق أي نص أو درس أولاً ليتمكن المساعد من نطقه وإملاءه.");
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ar-SA'; // نطق لغة عربية فصحى رسمية
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

// 8. الإملاء الصوتي المباشر عبر المايك والمترجم الفوري (محاكاة بسيطة)
function startSpeechRecognition() {
  const micBtn = document.getElementById('micBtn');
  const speechOutput = document.getElementById('speechOutput');
  if (!micBtn || !speechOutput) return;

  micBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> جاري الاستماع والمحاكاة الذكية...`;
  micBtn.style.background = '#1f6feb';

  // محاكاة زمنية لنتيجة الاستماع ثم إعادة الحالة
  setTimeout(() => {
    speechOutput.innerHTML = `<strong style="color: #58a6ff;">النص الرقمي المستمع:</strong> أهلاً بكم في بوابة شركاء النجاح الذكية الدولية، تحت إشراف وتطوير الأستاذ جلال أبكر.`;
    micBtn.innerHTML = `<i class="fa-solid fa-microphone"></i> اضغط على المايك وتحدث (إملاء وترجمة)`;
    micBtn.style.background = '#238636';
  }, 1500);
}

// 9. إضافة مكتبة الماسح الضوئي (QR) - تهيئة آمنة إن كانت المكتبة متاحة
try {
  if (typeof Html5QrcodeScanner !== 'undefined') {
    const readerElementId = 'reader';
    // only initialize if element exists
    if (document.getElementById(readerElementId)) {
      const html5QrcodeScanner = new Html5QrcodeScanner(readerElementId, { fps: 10, qrbox: 250 });
      html5QrcodeScanner.render((text) => alert("تم قراءة بيانات الطالب: " + text));
    }
  }
} catch (err) {
  // library not available or other error - ignore for now
  console.warn('Html5QrcodeScanner not initialized:', err);
}

// 10. وظيفة إضافة مشاركة جديدة (واجهة وDOM فقط)
function addPost() {
  const container = document.getElementById('posts-container');
  if (!container) return;
  container.innerHTML += `
    <div class="post-card">
      <p>نشاط جديد من طالب...</p>
      <div class="post-actions">
        <span class="like-btn" onclick="this.classList.toggle('active')"><i class="fa-solid fa-heart"></i></span>
        <label class="pdf-btn"><i class="fa-solid fa-file-pdf"></i><input type="file" hidden accept=".pdf"></label>
      </div>
      <textarea placeholder="أضف تعليقاً..." style="width:100%; background:transparent; color:#fff; border:none; margin-top:10px;"></textarea>
    </div>
  `;
}

// 11. مركز التواصل والاتصال المرئي وغرف المجموعات والتيمز
function switchChannel(channel) {
  const title = document.getElementById('currentChannelTitle');
  const box = document.getElementById('chatMessagesBox');
  if (!title || !box) return;

  if (channel === 'general') {
    title.innerHTML = `<i class="fa-solid fa-hashtag"></i> المناقشة العامة`;
  } else if (channel === 'teachers') {
    title.innerHTML = `<i class="fa-solid fa-lock"></i> غرفة المعلمين والإدارة`;
  } else {
    title.innerHTML = `<i class="fa-solid fa-graduation-cap"></i> أسئلة الطلاب ودعم النجاح`;
  }

  // إضافة رسالة نظامية توضيحية
  const row = document.createElement('div');
  row.className = 'message-row system';
  row.innerHTML = `<span class="system-msg">تم التبديل إلى القناة: ${channel}</span>`;
  box.appendChild(row);
  box.scrollTop = box.scrollHeight;
}

// تهيئة بسيطة بعد تحميل DOM
document.addEventListener('DOMContentLoaded', () => {
  // تنفيذ بحث ابتدائي لملء النتائج التجريبية
  executeSmartSearch();
});
