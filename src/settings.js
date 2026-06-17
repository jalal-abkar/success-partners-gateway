// src/settings.js
// Settings UI: reads/writes site_config to Firestore (if available) or localStorage as fallback.
// Includes TTS/STT voice helpers and optional voice-command integration.

(async function () {
  const saveBtn = document.getElementById('saveSettings');
  const exportBtn = document.getElementById('exportSettings');
  const importBtn = document.getElementById('importSettings');
  const importFile = document.getElementById('importFile');
  const testBtn = document.getElementById('testConnection');
  const enableVoiceCheckbox = document.getElementById('enableVoice');
  const ttsPlayBtn = document.getElementById('ttsPlay');
  const voiceCmdBtn = document.getElementById('voiceCommandBtn');

  // --- Simple notify (UI) ---
  function notify(msg) {
    // keep using alert for now; could be replaced by in-page toast
    alert(msg);
  }

  // --- TTS helpers ---
  function ttsSpeak(text, lang = 'ar-SA') {
    if (!text || !('speechSynthesis' in window)) return;
    try {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    } catch (e) { /* ignore */ }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 1.0;
    u.pitch = 1.0;
    window.speechSynthesis.speak(u);
  }

  function enableVoiceOnUserInteraction(onceMsg) {
    if (!('speechSynthesis' in window)) return;
    const handler = () => {
      if (onceMsg) ttsSpeak(onceMsg, 'ar-SA');
      window.removeEventListener('click', handler);
    };
    window.addEventListener('click', handler);
  }

  // Announce messages both visually (notify) and via TTS when enabled
  function announce(text) {
    notify(text);
    if (enableVoiceCheckbox && enableVoiceCheckbox.checked) ttsSpeak(text, 'ar-SA');
  }

  // --- STT / Voice Commands ---
  function startVoiceCommands() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      announce('التعرف الصوتي غير مدعوم في متصفحك.');
      return null;
    }
    const rec = new SpeechRecognition();
    rec.lang = 'ar-SA';
    rec.interimResults = false;
    rec.onresult = (e) => {
      const txt = e.results[0][0].transcript.trim();
      console.log('Voice command:', txt);
      // Basic Arabic command mapping
      if (/حفظ|سجل|احفظ/i.test(txt)) {
        if (saveBtn) saveBtn.click();
        ttsSpeak('أقوم بحفظ الإعدادات الآن.', 'ar-SA');
      } else if (/تصدير|export|استخراج/i.test(txt)) {
        if (exportBtn) exportBtn.click();
        ttsSpeak('جاري تصدير إعدادات الموقع.', 'ar-SA');
      } else if (/استيراد|import/i.test(txt)) {
        if (importFile) importFile.click();
        ttsSpeak('اختر ملف الإعدادات للاستيراد.', 'ar-SA');
      } else if (/اختبار|تجربة|test/i.test(txt)) {
        if (testBtn) testBtn.click();
        ttsSpeak('أجري اختبا�� الاتصال الآن.', 'ar-SA');
      } else {
        ttsSpeak('لم أفهم الأمر الصوتي. جرّب قول: حفظ، تصدير، استيراد، أو اختبار.', 'ar-SA');
      }
    };
    rec.onerror = (err) => { console.warn('STT error', err); announce('حدث خطأ في التعرف الصوتي.'); };
    rec.start();
    return rec;
  }

  // --- Form read/write ---
  function readForm() {
    return {
      ui: {
        designerName_ar: document.getElementById('designer_ar').value || 'جلال أحمد محمد أبكر',
        designerName_en: document.getElementById('designer_en').value || 'Jalal Ahmed Mohamed Abkar',
        defaultLang: document.getElementById('defaultLang').value,
        defaultTheme: document.getElementById('defaultTheme').value
      },
      integrations: {
        googleClientId: document.getElementById('googleClientId').value,
        openaiKeyEnvName: document.getElementById('openaiKey').value,
        twilioFrom: document.getElementById('twilioFrom').value,
        social: {
          instagram: document.getElementById('instagramLink').value,
          facebook: document.getElementById('facebookLink').value,
          x: document.getElementById('xLink').value,
          telegram: document.getElementById('telegramLink').value
        }
      },
      pages: {
        home: document.getElementById('pageHome').checked,
        admin: document.getElementById('pageAdmin').checked,
        students: document.getElementById('pageStudents').checked,
        chat: document.getElementById('pageChat').checked,
        exams: document.getElementById('pageExams').checked
      },
      updatedAt: new Date().toISOString()
    };
  }

  async function saveSettings() {
    const data = readForm();
    // Try to save to Firestore if available
    if (window.firebase && firebase.firestore) {
      try {
        const db = firebase.firestore();
        await db.collection('site_config').doc('default').set(data, { merge: true });
        announce('تم حفظ الإعدادات بنجاح إلى Firestore.');
        return;
      } catch (err) {
        console.warn('Firestore save failed, fallback to localStorage', err);
        announce('فشل الحفظ إلى Firestore، تم الحفظ محلياً.');
      }
    }
    // fallback
    localStorage.setItem('site_config', JSON.stringify(data));
    announce('تم حفظ الإعدادات محلياً (localStorage).');
  }

  async function loadSettings() {
    let data = null;
    if (window.firebase && firebase.firestore) {
      try {
        const db = firebase.firestore();
        const doc = await db.collection('site_config').doc('default').get();
        if (doc.exists) data = doc.data();
      } catch (err) {
        console.warn('Failed to read site_config from Firestore', err);
      }
    }
    if (!data) {
      const raw = localStorage.getItem('site_config');
      if (raw) data = JSON.parse(raw);
    }
    if (!data) {
      // fallback default
      data = {
        ui: { designerName_ar: 'جلال أحمد محمد أبكر', designerName_en: 'Jalal Ahmed Mohamed Abkar', defaultLang: 'ar', defaultTheme: 'dark' },
        integrations: { googleClientId: '', openaiKeyEnvName: '', twilioFrom: '', social: {} },
        pages: { home: true, admin: true, students: true, chat: true, exams: true }
      };
    }

    // populate fields
    document.getElementById('designer_ar').value = data.ui?.designerName_ar || '';
    document.getElementById('designer_en').value = data.ui?.designerName_en || '';
    document.getElementById('defaultLang').value = data.ui?.defaultLang || 'ar';
    document.getElementById('defaultTheme').value = data.ui?.defaultTheme || 'dark';

    document.getElementById('googleClientId').value = data.integrations?.googleClientId || '';
    document.getElementById('openaiKey').value = data.integrations?.openaiKeyEnvName || '';
    document.getElementById('twilioFrom').value = data.integrations?.twilioFrom || '';
    document.getElementById('instagramLink').value = data.integrations?.social?.instagram || '';
    document.getElementById('facebookLink').value = data.integrations?.social?.facebook || '';
    document.getElementById('xLink').value = data.integrations?.social?.x || '';
    document.getElementById('telegramLink').value = data.integrations?.social?.telegram || '';

    document.getElementById('pageHome').checked = !!data.pages?.home;
    document.getElementById('pageAdmin').checked = !!data.pages?.admin;
    document.getElementById('pageStudents').checked = !!data.pages?.students;
    document.getElementById('pageChat').checked = !!data.pages?.chat;
    document.getElementById('pageExams').checked = !!data.pages?.exams;

    // apply designer name to footer
    const dnameEl = document.getElementById('designerNameFooter');
    if (dnameEl) {
      const lang = window.I18n ? I18n.current() : 'ar';
      dnameEl.textContent = (lang === 'en') ? (data.ui?.designerName_en || data.ui?.designerName_ar) : (data.ui?.designerName_ar || data.ui?.designerName_en);
    }

    // If voice enabled by default, prepare to enable on next user interaction
    if (enableVoiceCheckbox && enableVoiceCheckbox.checked) {
      enableVoiceOnUserInteraction('تم تفعيل الصوت.');
    }
  }

  function exportSettings() {
    const data = readForm();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site_config.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    announce('تم تصدير إعدادات الموقع كملف JSON.');
  }

  function importSettingsFromFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        // apply to form for review
        if (parsed.ui) {
          document.getElementById('designer_ar').value = parsed.ui.designerName_ar || '';
          document.getElementById('designer_en').value = parsed.ui.designerName_en || '';
          document.getElementById('defaultLang').value = parsed.ui.defaultLang || 'ar';
          document.getElementById('defaultTheme').value = parsed.ui.defaultTheme || 'dark';
        }
        if (parsed.integrations) {
          document.getElementById('googleClientId').value = parsed.integrations.googleClientId || '';
          document.getElementById('openaiKey').value = parsed.integrations.openaiKeyEnvName || '';
        }
        announce('تم استيراد الإعدادات، اضغط حفظ لتخزينها.');
      } catch (err) {
        announce('فشل استيراد الإعدادات: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  function testConnectionStub() {
    // No secrets used here. This is a safe stub to show the UI response.
    announce('اختبار الاتصال (تجريبي): لم تُزوَّد مفاتيح بعد. ضع متغيرات البيئة للاختبارات الحقيقية.');
  }

  // Wire up optional UI voice controls (if present)
  if (ttsPlayBtn) {
    ttsPlayBtn.addEventListener('click', () => {
      const designer = document.getElementById('designer_ar').value || document.getElementById('designerNameFooter')?.textContent || 'جلال';
      const theme = document.getElementById('defaultTheme').value || 'dark';
      const msg = `مرحبا ${designer}. السمة الافتراضية الآن ${theme}. اضغط حفظ لتطبيق التغييرات.`;
      ttsSpeak(msg, 'ar-SA');
    });
  }

  if (voiceCmdBtn) {
    voiceCmdBtn.addEventListener('click', () => {
      startVoiceCommands();
      ttsSpeak('نظام الأوامر الصوتية مفعل. قل حفظ أو تصدير أو اختبار.', 'ar-SA');
    });
  }

  // event listeners
  if (saveBtn) saveBtn.addEventListener('click', saveSettings);
  if (exportBtn) exportBtn.addEventListener('click', exportSettings);
  if (importBtn) importBtn.addEventListener('click', () => importFile.click());
  if (importFile) importFile.addEventListener('change', (e) => {
    const f = e.target.files[0]; if (f) importSettingsFromFile(f);
  });
  if (testBtn) testBtn.addEventListener('click', testConnectionStub);

  if (enableVoiceCheckbox) {
    enableVoiceCheckbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        // enable TTS after next user interaction to satisfy browser policies
        enableVoiceOnUserInteraction('تم تفعيل النطق الصوتي.');
      } else {
        ttsSpeak('تم إيقاف النطق الصوتي.', 'ar-SA');
      }
    });
  }

  // load initial
  await loadSettings();

})();
