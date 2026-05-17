// src/components/ChatbotWidget.js
// Integración con Gemini 2.5 Flash - Widget flotante de chat conversacional

(function(){
  const apiEndpoint = '/api/chat.php';
  const containerId = 'chatbot-root';

  const systemPrompts = {
    es: "Eres un asistente experto en pesca en Mallorca. Eres amigable, conocedor y conciso. Ayudas a usuarios a encontrar información sobre especies, zonas de pesca, técnicas y regulaciones. Responde siempre en español.",
    en: "You are an expert assistant about fishing in Mallorca. Be friendly, knowledgeable, and concise. Help users find information about fish species, fishing spots, techniques, and regulations. Always respond in English.",
    ca: "Ets un assistent expert en pesca a Mallorca. Ets amable, coneixedor i concís. Ajudes els usuaris a trobar informació sobre espècies, zones de pesca, tècniques i regulacions. Respon sempre en català.",
    de: "Sie sind ein Experte für Fischen auf Mallorca. Seien Sie freundlich, sachkundig und prägnant. Helfen Sie Benutzern, Informationen zu Fischarten, Angelplätzen, Techniken und Vorschriften zu finden. Antworten Sie immer auf Deutsch."
  };

  function createWidget(){
    if (document.getElementById(containerId)) return;

    const root = document.createElement('div');
    root.id = containerId;
    root.className = 'chatbot-root';
    root.innerHTML = `
      <button class="chatbot-open-btn" data-i18n-aria="chatbot_open" aria-label="Abrir chat" aria-expanded="false">💬</button>
      <div class="chatbot-panel" role="dialog" aria-modal="true" aria-labelledby="chatbotPanelTitle" aria-hidden="true">
        <div class="chatbot-header">
          <strong id="chatbotPanelTitle" data-i18n="chatbot_title">Asistente de Pesca</strong>
          <button class="chatbot-close" type="button" data-i18n-aria="chatbot_close" aria-label="Cerrar chat">×</button>
        </div>
        <div class="chatbot-messages" id="chatbotMessages" role="log" aria-live="polite" aria-atomic="false"></div>
        <form class="chatbot-form" id="chatbotForm">
          <label for="chatbotInput" class="visually-hidden" data-i18n="chatbot_input_label">Pregunta sobre pesca</label>
          <input id="chatbotInput" data-i18n-placeholder="chatbot_placeholder" placeholder="Pregunta sobre pesca..." data-i18n-aria="chatbot_aria_label" aria-label="Pregunta sobre pesca" autocomplete="off" />
          <button type="submit" data-i18n="chatbot_send">Enviar</button>
        </form>
      </div>
    `;
    document.body.appendChild(root);

    const openBtn = root.querySelector('.chatbot-open-btn');
    const panel = root.querySelector('.chatbot-panel');
    const closeBtn = root.querySelector('.chatbot-close');
    const form = root.querySelector('#chatbotForm');
    const input = root.querySelector('#chatbotInput');
    const messages = root.querySelector('#chatbotMessages');

    openBtn.addEventListener('click', ()=>{
      panel.setAttribute('aria-hidden','false');
      openBtn.setAttribute('aria-expanded','true');
      root.classList.add('open');
      input.focus();
    });
    closeBtn.addEventListener('click', ()=>{
      panel.setAttribute('aria-hidden','true');
      openBtn.setAttribute('aria-expanded','false');
      root.classList.remove('open');
      openBtn.focus();
    });

    panel.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.getAttribute('aria-hidden') === 'false') {
        closeBtn.click();
      }
    });

    form.addEventListener('submit', async (e)=>{
      if (panel.getAttribute('aria-hidden') === 'true') {
        panel.setAttribute('aria-hidden','false');
        openBtn.setAttribute('aria-expanded','true');
      }
      e.preventDefault();
      const text = input.value.trim();
      if(!text) return;
      appendMessage('user', text);
      input.value = '';
      try{
        appendMessage('assistant', '...', false);
        const resp = await sendMessage(text);
        const last = messages.querySelector('.chatbot-message.assistant:last-child');
        if(last) last.querySelector('.text').innerHTML = formatText(resp);
      }catch(err){
        const last = messages.querySelector('.chatbot-message.assistant:last-child');
        if(last) last.querySelector('.text').textContent = 'Error: '+(err.message||err);
      }
      messages.scrollTop = messages.scrollHeight;
    });

    function formatText(text) {
      return text
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") // Seguridad
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Negrita
        .replace(/(^|\n)\* (.*?)(?=\n|$)/g, "$1• $2") // Listas (*)
        .replace(/(^|\n)- (.*?)(?=\n|$)/g, "$1• $2") // Listas (-)
        .replace(/\*(.*?)\*/g, "<em>$1</em>") // Cursiva
        .replace(/\n/g, "<br>"); // Saltos de línea
    }

    function appendMessage(who, text, isRaw = false){
      const el = document.createElement('div');
      el.className = 'chatbot-message '+ (who==='user'? 'user':'assistant');
      el.innerHTML = `<div class="text"></div>`;
      if(isRaw) {
        el.querySelector('.text').innerHTML = text;
      } else {
        el.querySelector('.text').textContent = text;
      }
      messages.appendChild(el);
      messages.scrollTop = messages.scrollHeight;
    }

    async function sendMessage(message){
      const lang = window.i18next ? window.i18next.language : (window._i18n ? window._i18n.language : 'es');
      const shortLang = (lang || 'es').substring(0, 2).toLowerCase();
      const payload = { 
        message, 
        system: systemPrompts[shortLang] || systemPrompts.es,
        lang: shortLang
      };
      const res = await fetch(apiEndpoint, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      if(!res.ok){
        let bodyText = '';
        try { bodyText = await res.text(); } catch(e) { bodyText = ''; }
        let errText = 'Network error';
        try {
          const parsed = JSON.parse(bodyText);
          if (parsed.error) errText = parsed.error;
          else if (parsed.diagnostic && parsed.diagnostic.body) {
            try {
              const diag = JSON.parse(parsed.diagnostic.body);
              errText = diag.error && diag.error.message ? diag.error.message : parsed.diagnostic.body;
            } catch(e) {
              errText = parsed.diagnostic.body;
            }
          } else {
            errText = JSON.stringify(parsed);
          }
        } catch(e) {
          if (bodyText) errText = bodyText;
        }
        throw new Error(errText);
      }
      const data = await res.json();
      if (data.error) {
        let errText = data.error;
        if (data.details) {
          try { errText += ' - ' + (typeof data.details === 'string' ? data.details : JSON.stringify(data.details)); } catch(e) { errText += ' - (details)'; }
        }
        throw new Error(errText);
      }
      return data.response || '';
    }

    // Traducir por primera vez una vez creado en el DOM
    if (window.updateI18nTexts) {
      window.updateI18nTexts();
    }
  }

  // Init immediately or on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();
