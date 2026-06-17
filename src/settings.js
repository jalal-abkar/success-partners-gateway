// src/settings.js
// Settings UI: reads/writes site_config to Firestore (if available) or localStorage as fallback.
// Requires src/config.js for placeholders and src/i18n.js for translations.

(async function () {
  const saveBtn = document.getElementById('saveSettings');
  const exportBtn = document.getElementById('exportSettings');
  const importBtn = document.getElementById('importSettings');
  const importFile = document.getElementById('importFile');
  const testBtn = document.getElementById('testConnection');

  function notify(msg) {
    alert(msg);
  }

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
        notify('Settings saved to Firestore successfully.');
        return;
      } catch (err) {
        console.warn('Firestore save failed, fallback to localStorage', err);
      }
    }
    // fallback
    localStorage.setItem('site_config', JSON.stringify(data));
    notify('Settings saved locally (localStorage).');
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
        notify('Imported settings applied to form. Press Save to persist.');
      } catch (err) {
        notify('Failed to import settings: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  function testConnectionStub() {
    // No secrets used here. This is a safe stub to show the UI response.
    notify('Test connection (stub): No secrets provided. Configure env vars to perform real tests.');
  }

  // event listeners
  if (saveBtn) saveBtn.addEventListener('click', saveSettings);
  if (exportBtn) exportBtn.addEventListener('click', exportSettings);
  if (importBtn) importBtn.addEventListener('click', () => importFile.click());
  if (importFile) importFile.addEventListener('change', (e) => {
    const f = e.target.files[0]; if (f) importSettingsFromFile(f);
  });
  if (testBtn) testBtn.addEventListener('click', testConnectionStub);

  // load initial
  await loadSettings();

})();
